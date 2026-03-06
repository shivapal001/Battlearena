import React, { useState, useEffect } from 'react';
import { Player, Tournament } from '../types';

interface ProfilePageProps {
  user: Player;
  joinedTournaments: Tournament[];
  onViewTournament: (id: string) => void;
  onLogout: () => void;
  onSave: (data: { username: string; gameId: string; phone: string }) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ user, joinedTournaments, onViewTournament, onLogout, onSave }) => {
  const [formData, setFormData] = useState({
    username: user.username || '',
    gameId: user.gameId || '',
    phone: user.phone || ''
  });

  useEffect(() => {
    setFormData({
      username: user.username || '',
      gameId: user.gameId || '',
      phone: user.phone || ''
    });
  }, [user]);

  const handleSave = () => {
    onSave(formData);
  };

  return (
    <div className="pinner">
      <div className="phd">
        <div className="phd-top">
          <div className="phd-n">04</div>
          <div><div className="phd-title">PROFILE</div></div>
        </div>
      </div>
      
      <div className="prof-hero">
        <div className="pav">{user.username.charAt(0).toUpperCase()}</div>
        <div style={{ flex: 1 }}>
          <div className="pname">
            {user.username.toUpperCase()} {user.role === 'admin' ? <span className="badge badge-r">ADMIN</span> : ''}
          </div>
          <div className="puid">{user.email} · UID: {user.gameId || 'NOT SET'}</div>
          <div className="pstats">
            {[
              ['JOINED', user.joined.length],
              ['KILLS', user.kills],
              ['WINS', user.wins],
              ['EARNED', `₹${user.earnings.toLocaleString('en-IN')}`]
            ].map(([l, v]) => (
              <div key={l} className="pstat">
                <div className="pstat-n">{v}</div>
                <div className="pstat-l">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="two-col" style={{ marginTop: '2px' }}>
        <div style={{ background: 'var(--dim)', border: '1px solid var(--dim2)', padding: '22px' }}>
          <div className="sh">MY TOURNAMENTS</div>
          {joinedTournaments.length ? (
            joinedTournaments.map(t => (
              <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '11px 0', borderBottom: '1px solid rgba(255,255,255,.04)', cursor: 'pointer' }} onClick={() => onViewTournament(t.id)}>
                <div>
                  <div style={{ fontFamily: "'Anton', sans-serif", fontSize: '15px', letterSpacing: '.5px' }}>{t.name}</div>
                  <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', color: 'var(--dim3)', marginTop: '2px' }}>{t.game} · {t.startDate}</div>
                </div>
                <span className={`tc-st ${t.status}`}>{t.status.toUpperCase()}</span>
              </div>
            ))
          ) : (
            <div className="empty" style={{ padding: '28px 0' }}>
              <div className="empty-ico">🎮</div>
              <div className="empty-t">NO TOURNAMENTS</div>
            </div>
          )}
        </div>
        
        <div style={{ background: 'var(--dim)', border: '1px solid var(--dim2)', padding: '22px' }}>
          <div className="sh">EDIT PROFILE</div>
          <div className="fg">
            <label className="fl">Username</label>
            <input 
              className="fi" 
              value={formData.username} 
              onChange={e => setFormData({ ...formData, username: e.target.value })} 
            />
          </div>
          <div className="fg">
            <label className="fl">Free Fire UID</label>
            <input 
              className="fi" 
              value={formData.gameId} 
              onChange={e => setFormData({ ...formData, gameId: e.target.value })} 
            />
          </div>
          <div className="fg">
            <label className="fl">Phone</label>
            <input 
              className="fi" 
              value={formData.phone} 
              onChange={e => setFormData({ ...formData, phone: e.target.value })} 
            />
          </div>
          <button className="btn btn-red btn-full" onClick={handleSave}>SAVE CHANGES</button>
          <div style={{ height: '2px' }}></div>
          <button className="btn btn-gh btn-full" style={{ marginTop: '2px' }} onClick={onLogout}>LOGOUT</button>
        </div>
      </div>
    </div>
  );
};
