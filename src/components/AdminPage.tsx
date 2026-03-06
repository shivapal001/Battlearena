import React, { useState } from 'react';
import { Player, Tournament, Transaction } from '../types';

interface AdminPageProps {
  players: Player[];
  tournaments: Tournament[];
  transactions: Transaction[];
  onCreateTournament: (data: any) => void;
  onUpdateRoom: (id: string, roomId: string, roomPass: string, status: string) => void;
  onUpdateResults: (id: string, results: any[]) => void;
  onDeleteTournament: (id: string) => void;
  onApproveWithdrawal: (txId: string) => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({ 
  players, 
  tournaments, 
  transactions, 
  onCreateTournament, 
  onUpdateRoom, 
  onUpdateResults, 
  onDeleteTournament,
  onApproveWithdrawal
}) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Create Tournament State
  const [newT, setNewT] = useState({
    name: '',
    game: 'Free Fire',
    entryFee: 50,
    maxPlayers: 50,
    date: new Date().toISOString().split('T')[0],
    time: '20:00',
    p1: 1200,
    p2: 600,
    p3: 300,
    status: 'upcoming'
  });

  // Room Edit State
  const [editingRoom, setEditingRoom] = useState<any>(null);
  
  // Results Edit State
  const [editingResults, setEditingResults] = useState<any>(null);

  const revenue = transactions.filter(tx => tx.type === 'deposit' && tx.status === 'completed').reduce((s, tx) => s + tx.amount, 0);
  const totalWinnings = transactions.filter(tx => tx.title.includes('Prize')).reduce((s, tx) => s + tx.amount, 0);
  const pendingWd = transactions.filter(tx => tx.type === 'withdrawal' && tx.status === 'pending').length;
  const pendingDp = transactions.filter(tx => tx.type === 'deposit' && tx.status === 'pending').length;

  const handleCreate = () => {
    if (!newT.name || !newT.date || !newT.time) return;
    onCreateTournament(newT);
    setNewT({ ...newT, name: '' });
    setActiveTab('manage');
  };

  const SidebarItem = ({ id, label, icon, section }: { id: string, label: string, icon: string, section?: boolean }) => {
    if (section) return <div className="adm-side-sec">{label}</div>;
    return (
      <div 
        className={`adm-side-item ${activeTab === id ? 'on' : ''}`} 
        onClick={() => setActiveTab(id)}
      >
        <span className="adm-side-icon">{icon}</span>
        {label}
      </div>
    );
  };

  return (
    <div className="adm-layout">
      {/* Sidebar */}
      <div className="adm-sidebar">
        <div className="adm-logo">
          <div className="adm-logo-main">⚙️ WALLTER</div>
          <div className="adm-logo-sub">Admin Control Panel</div>
        </div>

        <div className="adm-side-nav">
          <SidebarItem id="" label="OVERVIEW" icon="" section />
          <SidebarItem id="dashboard" label="Dashboard" icon="📊" />
          
          <SidebarItem id="" label="GAME CONTROL" icon="" section />
          <SidebarItem id="create" label="Create Tournament" icon="🎮" />
          <SidebarItem id="manage" label="Manage Games" icon="⚙️" />
          
          <SidebarItem id="" label="USERS" icon="" section />
          <SidebarItem id="players" label="All Users" icon="👥" />
          <SidebarItem id="deposits" label="Deposit Requests" icon="💳" />
          <SidebarItem id="withdrawals" label="Withdrawals" icon="🏦" />
          
          <SidebarItem id="" label="HISTORY" icon="" section />
          <SidebarItem id="history" label="Game History" icon="📜" />
          
          <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
            <div className="adm-side-item" style={{ color: 'var(--red)' }} onClick={() => window.location.reload()}>
              <span className="adm-side-icon">🚪</span> Logout
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="adm-main">
        <div className="adm-top">
          <div>
            <div className="adm-top-title">{activeTab.toUpperCase()}</div>
            <div className="adm-top-sub">Live overview of all activity</div>
          </div>
          <button className="btn btn-gh btn-sm" onClick={() => window.location.reload()}>🔄 Refresh</button>
        </div>

        <div className="adm-content">
          {activeTab === 'dashboard' && (
            <>
              <div className="adm-stats-row">
                <div className="adm-stat-card">
                  <div className="adm-stat-val">{players.filter(p => p.role !== 'admin').length}</div>
                  <div className="adm-stat-lbl">👥 Total Users</div>
                </div>
                <div className="adm-stat-card">
                  <div className="adm-stat-val" style={{ color: '#22c55e' }}>₹{revenue}</div>
                  <div className="adm-stat-lbl">💵 Total Deposits</div>
                </div>
                <div className="adm-stat-card">
                  <div className="adm-stat-val" style={{ color: 'var(--gold)' }}>₹{totalWinnings}</div>
                  <div className="adm-stat-lbl">🏆 Total Winnings</div>
                </div>
                <div className="adm-stat-card">
                  <div className="adm-stat-val" style={{ color: 'var(--red)' }}>{pendingWd}</div>
                  <div className="adm-stat-lbl">🏦 Pending Withdrawals</div>
                </div>
              </div>

              <div className="adm-dash-grid">
                <div className="adm-dash-card">
                  <div className="adm-dash-card-hd">👥 RECENT USERS</div>
                  <div className="adm-dash-list">
                    {players.filter(p => p.role !== 'admin').slice(-5).reverse().map(p => (
                      <div key={p.id} className="adm-list-item">
                        <div className="adm-list-avatar">{p.username.charAt(0)}</div>
                        <div className="adm-list-info">
                          <div className="adm-list-name">{p.username}</div>
                          <div className="adm-list-sub">{p.email}</div>
                        </div>
                        <div className="adm-list-val">₹{p.wallet}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="adm-dash-card">
                  <div className="adm-dash-card-hd">🎲 RECENT TRANSACTIONS</div>
                  <div className="adm-dash-list">
                    {transactions.slice(0, 6).map(tx => (
                      <div key={tx.id} className="adm-list-item">
                        <div className="adm-list-info">
                          <div className="adm-list-name">{tx.title}</div>
                          <div className="adm-list-sub">{tx.time}</div>
                        </div>
                        <div className={`adm-list-val ${tx.type === 'deposit' ? 'txt-g' : 'txt-r'}`}>
                          {tx.type === 'deposit' ? '+' : '-'}₹{tx.amount}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'create' && (
            <div className="adm-sec on">
              <div style={{ background: 'var(--dim)', border: '1px solid var(--dim2)', padding: '26px', maxWidth: '580px', borderRadius: '12px' }}>
                <div className="sh">NEW TOURNAMENT</div>
                <div className="frow">
                  <div className="fg"><label className="fl">Name *</label><input className="fi" value={newT.name} onChange={e => setNewT({...newT, name: e.target.value})} placeholder="Night Brawl" /></div>
                  <div className="fg"><label className="fl">Game</label><select className="fsel" value={newT.game} onChange={e => setNewT({...newT, game: e.target.value})}><option>Free Fire</option><option>Ludo</option><option>Carrom</option><option>Quiz</option></select></div>
                </div>
                <div className="frow">
                  <div className="fg"><label className="fl">Entry Fee ₹</label><input className="fi" type="number" value={newT.entryFee} onChange={e => setNewT({...newT, entryFee: parseInt(e.target.value)})} /></div>
                  <div className="fg"><label className="fl">Max Players</label><input className="fi" type="number" value={newT.maxPlayers} onChange={e => setNewT({...newT, maxPlayers: parseInt(e.target.value)})} /></div>
                </div>
                <div className="frow">
                  <div className="fg"><label className="fl">Date *</label><input className="fi" type="date" value={newT.date} onChange={e => setNewT({...newT, date: e.target.value})} /></div>
                  <div className="fg"><label className="fl">Time *</label><input className="fi" type="time" value={newT.time} onChange={e => setNewT({...newT, time: e.target.value})} /></div>
                </div>
                <div className="frow">
                  <div className="fg"><label className="fl">1st Prize ₹</label><input className="fi" type="number" value={newT.p1} onChange={e => setNewT({...newT, p1: parseInt(e.target.value)})} /></div>
                  <div className="fg"><label className="fl">2nd Prize ₹</label><input className="fi" type="number" value={newT.p2} onChange={e => setNewT({...newT, p2: parseInt(e.target.value)})} /></div>
                </div>
                <div className="frow">
                  <div className="fg"><label className="fl">3rd Prize ₹</label><input className="fi" type="number" value={newT.p3} onChange={e => setNewT({...newT, p3: parseInt(e.target.value)})} /></div>
                  <div className="fg"><label className="fl">Status</label><select className="fsel" value={newT.status} onChange={e => setNewT({...newT, status: e.target.value as any})}><option value="upcoming">Upcoming</option><option value="live">Live</option></select></div>
                </div>
                <button className="btn btn-red btn-full" onClick={handleCreate}>CREATE TOURNAMENT</button>
              </div>
            </div>
          )}

          {activeTab === 'manage' && (
            <div className="adm-sec on">
              <div style={{ overflowX: 'auto' }}>
                <table className="dtbl">
                  <thead>
                    <tr><th>NAME</th><th>GAME</th><th>PLAYERS</th><th>FEE</th><th>STATUS</th><th>ACTIONS</th></tr>
                  </thead>
                  <tbody>
                    {tournaments.map(t => (
                      <tr key={t.id}>
                        <td style={{ fontFamily: "'Anton', sans-serif", fontSize: '14px', letterSpacing: '.5px' }}>{t.title}</td>
                        <td style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px' }}>{t.game}</td>
                        <td style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px' }}>{t.joined.length}/{t.slots}</td>
                        <td style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px' }}>₹{t.fee}</td>
                        <td><span className={`badge ${t.status === 'live' ? 'badge-r' : t.status === 'completed' ? 'badge-gold' : 'badge-gr'}`}>{t.status}</span></td>
                        <td style={{ display: 'flex', gap: '2px', flexWrap: 'wrap' }}>
                          <button className="btn btn-gh btn-sm" onClick={() => setEditingRoom(t)}>ROOM</button>
                          <button className="btn btn-gold btn-sm" onClick={() => setEditingResults(t)}>RESULTS</button>
                          <button className="btn btn-gh btn-sm" style={{ color: 'var(--red)', borderColor: 'rgba(232,0,29,.3)' }} onClick={() => onDeleteTournament(t.id)}>DEL</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'players' && (
            <div className="adm-sec on">
              <div style={{ overflowX: 'auto' }}>
                <table className="dtbl">
                  <thead>
                    <tr><th>PLAYER</th><th>EMAIL</th><th>UID</th><th>JOINED</th><th>WALLET</th><th>WINS</th></tr>
                  </thead>
                  <tbody>
                    {players.filter(p => p.role !== 'admin').map(p => (
                      <tr key={p.id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                            <div style={{ width: '28px', height: '28px', background: 'var(--red)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Anton', sans-serif", fontSize: '13px', color: '#fff' }}>{p.username.charAt(0)}</div>
                            <span style={{ fontFamily: "'Anton', sans-serif", fontSize: '14px', letterSpacing: '.5px' }}>{p.username}</span>
                          </div>
                        </td>
                        <td style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', color: 'var(--mt)' }}>{p.email}</td>
                        <td style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', color: 'var(--dim3)' }}>{p.gameId || '—'}</td>
                        <td style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px' }}>{p.joined.length}</td>
                        <td style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '19px', color: 'var(--gold)' }}>₹{p.wallet}</td>
                        <td style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '19px' }}>{p.wins}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {(activeTab === 'deposits' || activeTab === 'withdrawals' || activeTab === 'history') && (
            <div className="adm-sec on">
              <div style={{ overflowX: 'auto' }}>
                <table className="dtbl">
                  <thead>
                    <tr><th>TYPE</th><th>PLAYER</th><th>DESCRIPTION</th><th>DETAILS</th><th>AMOUNT</th><th>STATUS</th></tr>
                  </thead>
                  <tbody>
                    {transactions
                      .filter(tx => {
                        if (activeTab === 'withdrawals') return tx.type === 'withdrawal' && tx.status === 'pending';
                        if (activeTab === 'deposits') return tx.type === 'deposit' && tx.status === 'pending';
                        if (activeTab === 'history') return tx.status === 'completed';
                        return true;
                      })
                      .map(tx => {
                        const p = players.find(x => x.id === tx.uid);
                        return (
                          <tr key={tx.id}>
                            <td><span className={`badge ${tx.type === 'deposit' ? 'badge-g' : 'badge-r'}`}>{tx.type.toUpperCase()}</span></td>
                            <td style={{ fontFamily: "'Anton', sans-serif", fontSize: '13px' }}>{p?.username || 'Unknown'}</td>
                            <td style={{ fontSize: '12px' }}>{tx.title}</td>
                            <td style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', color: 'var(--gold)' }}>
                              {tx.upi && <div>UPI: {tx.upi}</div>}
                              {tx.utr && <div>UTR: {tx.utr}</div>}
                              {!tx.upi && !tx.utr && <span style={{ color: 'var(--dim3)' }}>—</span>}
                            </td>
                            <td style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '19px', color: tx.type === 'deposit' ? '#22c55e' : 'var(--red)' }}>
                              {tx.type === 'deposit' ? '+' : '-'}₹{tx.amount}
                            </td>
                            <td>
                              {tx.status === 'pending' ? (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                  <span className="badge badge-r" style={{ animation: 'pulse 2s infinite' }}>PENDING</span>
                                  <button className="btn btn-red btn-sm" onClick={() => onApproveWithdrawal(tx.id)}>APPROVE</button>
                                </div>
                              ) : (
                                <span className="badge badge-gr">{tx.status.toUpperCase()}</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Room Modal */}
      {editingRoom && (
        <div className="mbg open" onClick={(e) => e.target === e.currentTarget && setEditingRoom(null)}>
          <div className="modal">
            <div className="mhd"><div className="mt">UPDATE ROOM</div><div className="mx" onClick={() => setEditingRoom(null)}>✕</div></div>
            <div className="mbody">
              <div className="fg"><label className="fl">Room ID</label><input className="fi" id="er_rid" defaultValue={editingRoom.roomId} /></div>
              <div className="fg"><label className="fl">Password</label><input className="fi" id="er_rp" defaultValue={editingRoom.roomPass} /></div>
              <div className="fg"><label className="fl">Status</label>
                <select className="fsel" id="er_st" defaultValue={editingRoom.status}>
                  <option value="upcoming">Upcoming</option>
                  <option value="live">Live</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <button className="btn btn-red btn-full" onClick={() => {
                const rid = (document.getElementById('er_rid') as HTMLInputElement).value;
                const rp = (document.getElementById('er_rp') as HTMLInputElement).value;
                const st = (document.getElementById('er_st') as HTMLSelectElement).value;
                onUpdateRoom(editingRoom.id, rid, rp, st);
                setEditingRoom(null);
              }}>SAVE DETAILS</button>
            </div>
          </div>
        </div>
      )}

      {/* Results Modal */}
      {editingResults && (
        <div className="mbg open" onClick={(e) => e.target === e.currentTarget && setEditingResults(null)}>
          <div className="modal" style={{ maxWidth: '590px' }}>
            <div className="mhd"><div className="mt">UPDATE RESULTS</div><div className="mx" onClick={() => setEditingResults(null)}>✕</div></div>
            <div className="mbody">
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '2px', marginBottom: '7px' }}>
                <div className="fl">PLAYER</div><div className="fl">RANK PTS</div><div className="fl">KILLS</div>
              </div>
              {editingResults.joined.slice(0, 12).map((pid: string, i: number) => {
                const p = players.find(x => x.id === pid);
                const nm = p ? p.username : pid;
                return (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '2px', marginBottom: '2px' }}>
                    <input className="fi" style={{ padding: '7px 10px', fontSize: '12px' }} defaultValue={nm} id={`rr_n_${i}`} />
                    <input className="fi" style={{ padding: '7px 10px', fontSize: '12px' }} type="number" placeholder="Rank Pts" id={`rr_rp_${i}`} />
                    <input className="fi" style={{ padding: '7px 10px', fontSize: '12px' }} type="number" placeholder="Kills" id={`rr_k_${i}`} />
                  </div>
                );
              })}
              <button className="btn btn-red btn-full" style={{ marginTop: '14px' }} onClick={() => {
                const res = [];
                for (let i = 0; i < editingResults.joined.length; i++) {
                  const n = (document.getElementById(`rr_n_${i}`) as HTMLInputElement)?.value;
                  const rp = parseInt((document.getElementById(`rr_rp_${i}`) as HTMLInputElement)?.value || '0');
                  const k = parseInt((document.getElementById(`rr_k_${i}`) as HTMLInputElement)?.value || '0');
                  if (n) res.push({ uid: n, rankPts: rp, kills: k, total: rp + k });
                }
                onUpdateResults(editingResults.id, res);
                setEditingResults(null);
              }}>SAVE + DISTRIBUTE PRIZES</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
