import React, { useState, useEffect, useCallback } from 'react';
import { BackgroundCanvas } from './components/BackgroundCanvas';
import { Nav } from './components/Nav';
import { LandingPage } from './components/LandingPage';
import { TournamentCard } from './components/TournamentCard';
import { DetailPage } from './components/DetailPage';
import { LeaderboardPage } from './components/LeaderboardPage';
import { WalletPage } from './components/WalletPage';
import { ProfilePage } from './components/ProfilePage';
import { AdminPage } from './components/AdminPage';
import { INITIAL_PLAYERS, INITIAL_TOURNAMENTS, INITIAL_LEADERBOARD, INITIAL_TRANSACTIONS } from './constants';
import { Player, Tournament, Transaction, Page } from './types';
import { auth, db } from './firebase';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut 
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  onSnapshot, 
  collection, 
  query, 
  where, 
  orderBy, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  serverTimestamp,
  getDocFromServer
} from 'firebase/firestore';
import { handleFirestoreError, OperationType } from './firebase';

export default function App() {
  const [user, setUser] = useState<Player | null>(null);
  const [wallet, setWallet] = useState(0);
  const [players, setPlayers] = useState<Player[]>([]);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [page, setPage] = useState<Page>('landing');
  const [prevPage, setPrevPage] = useState<Page>('home');
  const [detailId, setDetailId] = useState<string | null>(null);
  const [toasts, setToasts] = useState<{ id: number; type: 'ok' | 'err' | 'info'; msg: string }[]>([]);
  const [modals, setModals] = useState<Record<string, boolean>>({});
  const [authTab, setAuthTab] = useState<'login' | 'register'>('login');
  const [tFilter, setTFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  const toast = useCallback((type: 'ok' | 'err' | 'info', msg: string) => {
    let finalMsg = msg;
    try {
      // If msg is a JSON string from handleFirestoreError, parse it
      if (msg.startsWith('{') && msg.endsWith('}')) {
        const parsed = JSON.parse(msg);
        if (parsed.error) finalMsg = parsed.error;
      }
    } catch (e) {
      // Not JSON, keep original
    }
    const id = Date.now();
    setToasts(prev => [...prev, { id, type, msg: finalMsg }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  }, []);

  // Connection Test
  useEffect(() => {
    async function testConnection() {
      try {
        await getDocFromServer(doc(db, 'test', 'connection'));
      } catch (error) {
        if (error instanceof Error && error.message.includes('the client is offline')) {
          console.error("Please check your Firebase configuration.");
          toast('err', 'Firebase connection failed. Check your configuration.');
        }
      }
    }
    testConnection();
  }, [toast]);

  // Auth form states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [regData, setRegData] = useState({ username: '', gid: '', email: '', phone: '', pw: '', cf: '' });

  // Wallet states
  const [addAmt, setAddAmt] = useState('');
  const [addUtr, setAddUtr] = useState('');
  const [wdAmt, setWdAmt] = useState('');
  const [wdUpi, setWdUpi] = useState('');

  // Firebase Auth Listener
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      try {
        if (fbUser) {
          // Fetch user data from Firestore
          const userDoc = await getDoc(doc(db, 'users', fbUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data() as Player;
            setUser(userData);
            setWallet(userData.wallet);
            if (page === 'landing') setPage('home');
          } else {
            // Handle case where auth exists but doc doesn't
            console.warn("User profile missing in Firestore for UID:", fbUser.uid);
            setUser(null);
            setWallet(0);
            toast('err', 'User profile not found. Please register again.');
          }
        } else {
          setUser(null);
          setWallet(0);
          setPage('landing');
        }
      } catch (err: any) {
        console.error("Error in auth state change:", err);
        toast('err', err.message || 'Authentication error');
      } finally {
        setLoading(false);
      }
    });
    return () => unsub();
  }, [page, toast]);

  // Real-time Data Sync
  useEffect(() => {
    // Sync Tournaments - Publicly readable
    const unsubT = onSnapshot(collection(db, 'tournaments'), (snap) => {
      const list: Tournament[] = [];
      snap.forEach(doc => list.push({ id: doc.id, ...doc.data() } as Tournament));
      setTournaments(list);
    }, (err) => {
      handleFirestoreError(err, OperationType.LIST, 'tournaments');
    });

    return () => unsubT();
  }, []);

  // Sync Players - Admin only
  useEffect(() => {
    if (user?.role !== 'admin') {
      setPlayers([]);
      return;
    }

    const unsubP = onSnapshot(collection(db, 'users'), (snap) => {
      const list: Player[] = [];
      snap.forEach(doc => list.push({ id: doc.id, ...doc.data() } as Player));
      setPlayers(list);
    }, (err) => {
      handleFirestoreError(err, OperationType.LIST, 'users');
    });

    return () => unsubP();
  }, [user]);

  // Sync Transactions for current user
  useEffect(() => {
    if (!user) {
      setTransactions([]);
      return;
    }
    const q = query(collection(db, 'transactions'), where('uid', '==', user.id), orderBy('timestamp', 'desc'));
    const unsubTx = onSnapshot(q, (snap) => {
      const list: Transaction[] = [];
      snap.forEach(doc => {
        const data = doc.data();
        list.push({ 
          id: doc.id, 
          ...data,
          time: data.timestamp?.toDate ? data.timestamp.toDate().toLocaleString() : 'Just now'
        } as Transaction);
      });
      setTransactions(list);
    }, (err) => {
      handleFirestoreError(err, OperationType.LIST, 'transactions');
    });
    return () => unsubTx();
  }, [user]);

  const openModal = (id: string) => setModals(prev => ({ ...prev, [id]: true }));
  const closeModal = (id: string) => setModals(prev => ({ ...prev, [id]: false }));

  const handlePageChange = (p: Page) => {
    if (!user && p !== 'landing') {
      setAuthTab('login');
      openModal('authM');
      return;
    }
    setPrevPage(page);
    setPage(p);
    window.scrollTo(0, 0);
  };

  const doLogin = async () => {
    if (!loginEmail || !loginPass) {
      toast('err', 'Fill all fields');
      return;
    }
    try {
      const email = loginEmail.trim();
      const pass = loginPass.trim();
      console.log("Attempting login for email:", email);
      const userCredential = await signInWithEmailAndPassword(auth, email, pass);
      console.log("Login successful for UID:", userCredential.user.uid);
      closeModal('authM');
      toast('ok', `Welcome back!`);
    } catch (err: any) {
      console.error("Login error details:", {
        code: err.code,
        message: err.message,
        email: loginEmail.trim()
      });
      let msg = 'Login failed';
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        msg = 'Invalid email or password.';
      } else if (err.code === 'auth/invalid-email') {
        msg = 'Invalid email address format.';
      } else if (err.code === 'auth/too-many-requests') {
        msg = 'Too many failed attempts. Please try again later.';
      } else if (err.message) {
        msg = err.message;
      }
      toast('err', msg);
    }
  };

  const doRegister = async () => {
    const { username, email, pw, cf, gid, phone } = regData;
    if (!username || !email || !pw || !cf) {
      toast('err', 'Fill required fields');
      return;
    }
    if (pw !== cf) {
      toast('err', 'Passwords do not match');
      return;
    }

    try {
      const email = regData.email.trim();
      const pw = regData.pw.trim();
      console.log("Attempting registration for email:", email);
      const res = await createUserWithEmailAndPassword(auth, email, pw);
      console.log("Auth user created successfully:", res.user.uid);
      const newUser: Player = {
        id: res.user.uid,
        username: regData.username.trim(),
        email,
        password: '', // Don't store plain text
        gameId: regData.gid.trim(),
        phone: regData.phone.trim(),
        wallet: 0,
        earnings: 0,
        wins: 0,
        kills: 0,
        joined: [],
        role: 'user'
      };
      const path = `users/${res.user.uid}`;
      console.log("Saving user profile to Firestore at:", path);
      try {
        await setDoc(doc(db, 'users', res.user.uid), newUser);
        console.log("User profile saved successfully");
        toast('ok', `Account created! Welcome ${newUser.username}`);
        closeModal('authM');
      } catch (fsErr: any) {
        console.error("Firestore profile save error:", fsErr);
        toast('err', 'Auth succeeded but profile creation failed. Please contact support.');
      }
    } catch (err: any) {
      console.error("Registration error details:", {
        code: err.code,
        message: err.message,
        email: regData.email.trim()
      });
      let msg = 'Registration failed';
      if (err.code === 'auth/email-already-in-use') {
        msg = 'This email is already registered. Please login instead.';
      } else if (err.code === 'auth/weak-password') {
        msg = 'Password is too weak (min 6 characters).';
      } else if (err.code === 'auth/invalid-email') {
        msg = 'Invalid email address format.';
      } else if (err.message) {
        msg = err.message;
      }
      toast('err', msg);
    }
  };

  const doLogout = async () => {
    try {
      await signOut(auth);
      toast('info', 'Logged out.');
    } catch (err: any) {
      toast('err', 'Logout failed');
    }
  };

  const handleJoin = async (id: string) => {
    const t = tournaments.find(x => x.id === id);
    if (!t || !user) return;
    if (user.joined.includes(id)) {
      toast('info', 'Already registered');
      return;
    }
    if (wallet < t.fee) {
      toast('err', 'Insufficient balance');
      return;
    }
    
    try {
      const newBalance = wallet - t.fee;
      const userPath = `users/${user.id}`;
      const tournamentPath = `tournaments/${id}`;
      const transactionPath = 'transactions';

      try {
        // Update User
        await updateDoc(doc(db, 'users', user.id), {
          wallet: newBalance,
          joined: [...user.joined, id]
        });
      } catch (e) {
        handleFirestoreError(e, OperationType.UPDATE, userPath);
      }

      try {
        // Update Tournament
        await updateDoc(doc(db, 'tournaments', id), {
          joined: [...t.joined, user.id]
        });
      } catch (e) {
        handleFirestoreError(e, OperationType.UPDATE, tournamentPath);
      }

      try {
        // Add Transaction
        await addDoc(collection(db, 'transactions'), {
          uid: user.id,
          type: 'entry',
          title: 'Entry — ' + t.title,
          amount: t.fee,
          status: 'completed',
          icon: '🎯',
          timestamp: serverTimestamp()
        });
      } catch (e) {
        handleFirestoreError(e, OperationType.CREATE, transactionPath);
      }
      
      toast('ok', `Registered for ${t.title}!`);
    } catch (err: any) {
      toast('err', 'Failed to join tournament');
    }
  };

  const doAddMoney = async () => {
    const amt = parseInt(addAmt);
    if (!amt || amt < 10) {
      toast('err', 'Minimum ₹10');
      return;
    }
    if (!addUtr) {
      toast('err', 'Enter Transaction ID / UTR');
      return;
    }
    
    try {
      await addDoc(collection(db, 'transactions'), {
        uid: user!.id,
        type: 'deposit',
        title: 'Deposit Request',
        amount: amt,
        status: 'pending',
        icon: '💰',
        utr: addUtr,
        timestamp: serverTimestamp()
      });
      
      setAddAmt('');
      setAddUtr('');
      closeModal('addMoneyM');
      toast('ok', `Deposit request for ₹${amt} submitted.`);
    } catch (err: any) {
      toast('err', 'Failed to submit request');
    }
  };

  const doWithdraw = async () => {
    const amt = parseInt(wdAmt);
    if (!amt || amt < 100) {
      toast('err', 'Minimum ₹100');
      return;
    }
    if (!wdUpi) {
      toast('err', 'Enter UPI ID');
      return;
    }
    if (wallet < amt) {
      toast('err', 'Insufficient balance');
      return;
    }

    try {
      const newBalance = wallet - amt;
      await updateDoc(doc(db, 'users', user!.id), { wallet: newBalance });
      await addDoc(collection(db, 'transactions'), {
        uid: user!.id,
        type: 'withdrawal',
        title: 'Withdrawal Request',
        amount: amt,
        status: 'pending',
        icon: '💸',
        upi: wdUpi,
        timestamp: serverTimestamp()
      });
      
      setWdAmt('');
      setWdUpi('');
      closeModal('withdrawM');
      toast('ok', `₹${amt} withdrawal requested.`);
    } catch (err: any) {
      toast('err', 'Failed to request withdrawal');
    }
  };

  const handleProfileSave = async (data: { username: string; gameId: string; phone: string }) => {
    if (!user) return;
    try {
      await updateDoc(doc(db, 'users', user.id), data);
      toast('ok', 'Profile updated.');
    } catch (err: any) {
      toast('err', 'Failed to update profile');
    }
  };

  const handleCreateTournament = async (data: any) => {
    try {
      await addDoc(collection(db, 'tournaments'), {
        title: data.name,
        game: data.game,
        fee: data.entryFee,
        prize: data.p1 + data.p2 + data.p3,
        slots: data.maxPlayers,
        joined: [],
        status: data.status,
        time: `${data.date} ${data.time}`,
        prize1: data.p1,
        prize2: data.p2,
        prize3: data.p3,
        roomId: '',
        roomPass: '',
        results: []
      });
      toast('ok', 'Tournament created successfully.');
    } catch (err: any) {
      toast('err', 'Failed to create tournament');
    }
  };

  const handleUpdateRoom = async (id: string, roomId: string, roomPass: string, status: string) => {
    try {
      await updateDoc(doc(db, 'tournaments', id), { roomId, roomPass, status });
      toast('ok', 'Room details updated.');
    } catch (err: any) {
      toast('err', 'Failed to update room');
    }
  };

  const handleUpdateResults = async (id: string, results: any[]) => {
    try {
      await updateDoc(doc(db, 'tournaments', id), { results, status: 'completed' });
      
      // Distribute prizes to top 3
      const sorted = [...results].sort((a, b) => b.total - a.total);
      const t = tournaments.find(x => x.id === id);
      if (t) {
        const top3 = sorted.slice(0, 3);
        const prizeAmounts = [t.prize1, t.prize2, t.prize3];
        
        for (let idx = 0; idx < top3.length; idx++) {
          const res = top3[idx];
          const p = players.find(x => x.username === res.uid);
          if (p) {
            const prize = prizeAmounts[idx];
            await updateDoc(doc(db, 'users', p.id), {
              wallet: p.wallet + prize,
              earnings: p.earnings + prize,
              wins: idx === 0 ? p.wins + 1 : p.wins
            });
            
            await addDoc(collection(db, 'transactions'), {
              uid: p.id,
              title: `Prize: ${t.title} (${idx + 1}st)`,
              amount: prize,
              type: 'prize',
              status: 'completed',
              icon: '🏆',
              timestamp: serverTimestamp()
            });
          }
        }
      }
      toast('ok', 'Results updated & prizes distributed.');
    } catch (err: any) {
      toast('err', 'Failed to update results');
    }
  };

  const handleDeleteTournament = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'tournaments', id));
      toast('ok', 'Tournament deleted.');
    } catch (err: any) {
      toast('err', 'Failed to delete tournament');
    }
  };

  const handleApproveTransaction = async (txId: string) => {
    const tx = transactions.find(x => x.id === txId);
    if (!tx) return;

    try {
      if (tx.type === 'deposit' && tx.status === 'pending') {
        const p = players.find(x => x.id === tx.uid);
        if (p) {
          await updateDoc(doc(db, 'users', p.id), { wallet: p.wallet + tx.amount });
        }
      }
      await updateDoc(doc(db, 'transactions', txId), { status: 'completed' });
      toast('ok', 'Transaction approved.');
    } catch (err: any) {
      toast('err', 'Failed to approve transaction');
    }
  };

  const renderPage = () => {
    switch (page) {
      case 'landing':
        return <LandingPage onAuth={(t) => { setAuthTab(t); openModal('authM'); }} />;
      case 'home':
        return (
          <div className="pinner">
            <div className="phd"><div className="rl"></div><div className="phd-title">WELCOME BACK, {user?.username.toUpperCase()}</div><div className="phd-sub">Here is what is happening today</div></div>
            <div className="sgrid" style={{ marginBottom: '26px' }}>
              <div className="sc"><div className="sc-num" style={{ color: 'var(--gold)' }}>₹{wallet.toLocaleString('en-IN')}</div><div className="sc-lbl">BAL</div></div>
              <div className="sc"><div className="sc-num">{user?.joined.length}</div><div className="sc-lbl">JOINED</div></div>
              <div className="sc"><div className="sc-num">{tournaments.filter(t => t.status === 'live').length}</div><div className="sc-lbl">LIVE</div></div>
              <div className="sc"><div className="sc-num">{tournaments.filter(t => t.status === 'upcoming').length}</div><div className="sc-lbl">UPCOMING</div></div>
            </div>
            <div className="sh">FEATURED TOURNAMENTS</div>
            <div className="tgrid">
              {tournaments.filter(t => t.status !== 'completed').slice(0, 3).map(t => (
                <TournamentCard 
                  key={t.id} 
                  tournament={t} 
                  isJoined={user?.joined.includes(t.id) || false} 
                  onJoin={handleJoin} 
                  onView={(id) => { setDetailId(id); handlePageChange('detail'); }} 
                />
              ))}
            </div>
            <div style={{ textAlign: 'center', marginTop: '14px' }}>
              <button className="btn btn-gh" onClick={() => handlePageChange('tournaments')}>VIEW ALL TOURNAMENTS →</button>
            </div>
          </div>
        );
      case 'tournaments':
        const filteredTournaments = tournaments.filter(t => {
          if (tFilter === 'all') return true;
          if (tFilter === 'live') return t.status === 'live';
          if (tFilter === 'upcoming') return t.status === 'upcoming';
          return t.game === tFilter;
        });
        return (
          <div className="pinner">
            <div className="phd"><div className="phd-top"><div className="phd-n">01</div><div><div className="phd-title">TOURNAMENTS</div></div></div><div className="phd-sub">Join competitive matches and win real cash prizes</div></div>
            <div className="chips">
              {['all', 'Free Fire', 'Ludo', 'Quiz', 'Carrom', 'live', 'upcoming'].map(f => (
                <div key={f} className={`chip ${tFilter === f ? 'on' : ''}`} onClick={() => setTFilter(f)}>{f.toUpperCase()}</div>
              ))}
            </div>
            <div className="tgrid">
              {filteredTournaments.map(t => (
                <TournamentCard 
                  key={t.id} 
                  tournament={t} 
                  isJoined={user?.joined.includes(t.id) || false} 
                  onJoin={handleJoin} 
                  onView={(id) => { setDetailId(id); handlePageChange('detail'); }} 
                />
              ))}
            </div>
          </div>
        );
      case 'detail':
        const t = tournaments.find(x => x.id === detailId);
        return t ? (
          <DetailPage 
            tournament={t} 
            isJoined={user?.joined.includes(t.id) || false} 
            onBack={() => handlePageChange(prevPage)} 
            onJoin={handleJoin} 
          />
        ) : null;
      case 'leaderboard':
        return <LeaderboardPage />;
      case 'wallet':
        return (
          <WalletPage 
            wallet={wallet} 
            transactions={transactions} 
            onAddMoney={() => openModal('addMoneyM')} 
            onWithdraw={() => openModal('withdrawM')} 
          />
        );
      case 'profile':
        return user ? (
          <ProfilePage 
            user={user} 
            joinedTournaments={tournaments.filter(t => user.joined.includes(t.id))} 
            onViewTournament={(id) => { setDetailId(id); handlePageChange('detail'); }} 
            onLogout={doLogout} 
            onSave={handleProfileSave} 
          />
        ) : null;
      case 'admin':
        return user?.role === 'admin' ? (
          <AdminPage 
            players={players} 
            tournaments={tournaments} 
            transactions={transactions}
            onCreateTournament={handleCreateTournament}
            onUpdateRoom={handleUpdateRoom}
            onUpdateResults={handleUpdateResults}
            onDeleteTournament={handleDeleteTournament}
            onApproveWithdrawal={handleApproveTransaction}
          />
        ) : null;
      default:
        return <div className="pinner"><div className="empty"><div className="empty-ico">🚧</div><div className="empty-t">PAGE UNDER CONSTRUCTION</div></div></div>;
    }
  };

  return (
    <>
      <BackgroundCanvas />
      <div id="toasts">
        {toasts.map(t => (
          <div key={t.id} className={`toast ${t.type === 'ok' ? 'ok' : t.type === 'info' ? 'info' : ''}`}>
            <span style={{ fontSize: '11px', color: t.type === 'ok' ? '#22c55e' : t.type === 'err' ? 'var(--red)' : 'var(--mt)' }}>
              {t.type === 'ok' ? '▶' : '✕'}
            </span>
            <span>{t.msg}</span>
          </div>
        ))}
      </div>

      <Nav 
        user={user} 
        wallet={wallet} 
        onPageChange={handlePageChange} 
        onLoginClick={() => { setAuthTab('login'); openModal('authM'); }} 
      />

      {loading ? (
        <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--red)', fontFamily: 'Anton' }}>
          LOADING BATTLE ARENA...
        </div>
      ) : (
        <div className={page === 'landing' ? '' : 'page show'}>
          {renderPage()}
        </div>
      )}

      {modals['authM'] && (
        <div className="mbg open" onClick={(e) => e.target === e.currentTarget && closeModal('authM')}>
          <div className="modal">
            <div className="mhd"><div className="mt">BATTLE/ARENA</div><div className="mx" onClick={() => closeModal('authM')}>✕</div></div>
            <div className="mbody">
              <div className="auth-tabs">
                <button className={`auth-tab ${authTab === 'login' ? 'on' : ''}`} onClick={() => setAuthTab('login')}>LOGIN</button>
                <button className={`auth-tab ${authTab === 'register' ? 'on' : ''}`} onClick={() => setAuthTab('register')}>REGISTER</button>
              </div>
              {authTab === 'login' ? (
                <div>
                  <div className="fg"><label className="fl">Email</label><input className="fi" type="email" placeholder="you@email.com" value={loginEmail || ''} onChange={e => setLoginEmail(e.target.value)} /></div>
                  <div className="fg"><label className="fl">Password</label><input className="fi" type="password" placeholder="••••••••" value={loginPass || ''} onChange={e => setLoginPass(e.target.value)} onKeyDown={e => e.key === 'Enter' && doLogin()} /></div>
                  <button className="btn btn-red btn-full" onClick={doLogin}>LOGIN →</button>
                </div>
              ) : (
                <div>
                  <div className="frow">
                    <div className="fg"><label className="fl">Username *</label><input className="fi" placeholder="GamerTag" value={regData.username || ''} onChange={e => setRegData({...regData, username: e.target.value})} /></div>
                    <div className="fg"><label className="fl">FF UID</label><input className="fi" placeholder="UID" value={regData.gid || ''} onChange={e => setRegData({...regData, gid: e.target.value})} /></div>
                  </div>
                  <div className="fg"><label className="fl">Email *</label><input className="fi" type="email" placeholder="you@email.com" value={regData.email || ''} onChange={e => setRegData({...regData, email: e.target.value})} /></div>
                  <div className="fg"><label className="fl">Phone</label><input className="fi" placeholder="+91 XXXXX XXXXX" value={regData.phone || ''} onChange={e => setRegData({...regData, phone: e.target.value})} /></div>
                  <div className="frow">
                    <div className="fg"><label className="fl">Password *</label><input className="fi" type="password" placeholder="••••••••" value={regData.pw || ''} onChange={e => setRegData({...regData, pw: e.target.value})} /></div>
                    <div className="fg"><label className="fl">Confirm *</label><input className="fi" type="password" placeholder="••••••••" value={regData.cf || ''} onChange={e => setRegData({...regData, cf: e.target.value})} /></div>
                  </div>
                  <button className="btn btn-red btn-full" onClick={doRegister}>CREATE ACCOUNT →</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {modals['addMoneyM'] && (
        <div className="mbg open" onClick={(e) => e.target === e.currentTarget && closeModal('addMoneyM')}>
          <div className="modal">
            <div className="mhd"><div className="mt">DEPOSIT MONEY</div><div className="mx" onClick={() => closeModal('addMoneyM')}>✕</div></div>
            <div className="mbody">
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <div className="fl" style={{ marginBottom: '10px' }}>SCAN QR TO PAY</div>
                <div style={{ background: '#fff', padding: '10px', display: 'inline-block', borderRadius: '8px' }}>
                  <img 
                    src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=9878669937@ptyes&pn=Karan%20Kumar%20Yadav&cu=INR" 
                    alt="Payment QR" 
                    style={{ width: '180px', height: '180px' }}
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div style={{ marginTop: '10px', fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px', color: 'var(--wh)' }}>
                  UPI: <span style={{ color: 'var(--red)' }}>9878669937@ptyes</span>
                </div>
              </div>

              <div className="fg"><label className="fl">Amount (₹)</label><input className="fi" type="number" placeholder="Enter amount" min="10" value={addAmt || ''} onChange={e => setAddAmt(e.target.value)} /></div>
              <div className="fg"><label className="fl">Transaction ID / UTR *</label><input className="fi" placeholder="12-digit UTR number" value={addUtr || ''} onChange={e => setAddUtr(e.target.value)} /></div>
              
              <button className="btn btn-red btn-full" onClick={doAddMoney}>SUBMIT DEPOSIT REQUEST →</button>
              <div style={{ textAlign: 'center', fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', color: 'var(--dim3)', marginTop: '9px' }}>ADMIN WILL APPROVE AFTER VERIFICATION</div>
            </div>
          </div>
        </div>
      )}

      {modals['withdrawM'] && (
        <div className="mbg open" onClick={(e) => e.target === e.currentTarget && closeModal('withdrawM')}>
          <div className="modal">
            <div className="mhd"><div className="mt">WITHDRAW</div><div className="mx" onClick={() => closeModal('withdrawM')}>✕</div></div>
            <div className="mbody">
              <div className="fg"><label className="fl">Amount (₹)</label><input className="fi" type="number" placeholder="Min ₹100" value={wdAmt || ''} onChange={e => setWdAmt(e.target.value)} /></div>
              <div className="fg"><label className="fl">UPI ID</label><input className="fi" placeholder="yourname@upi" value={wdUpi || ''} onChange={e => setWdUpi(e.target.value)} /></div>
              <button className="btn btn-red btn-full" onClick={doWithdraw}>REQUEST WITHDRAWAL</button>
              <div style={{ textAlign: 'center', fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', color: 'var(--dim3)', marginTop: '9px' }}>PROCESSING IN 24–48 HOURS</div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
