import React, { useState } from 'react';
import { LeaderboardEntry } from '../types';
import { INITIAL_LEADERBOARD } from '../constants';

export const LeaderboardPage: React.FC = () => {
  const [filter, setFilter] = useState('all');
  
  const filteredList = filter === 'all' 
    ? INITIAL_LEADERBOARD 
    : INITIAL_LEADERBOARD.filter(e => e.game === filter);
    
  const sortedList = [...filteredList].sort((a, b) => b.score - a.score);

  return (
    <div className="pinner">
      <div className="phd">
        <div className="phd-top">
          <div className="phd-n">02</div>
          <div><div className="phd-title">LEADERBOARD</div></div>
        </div>
        <div className="phd-sub">Top players ranked by total score</div>
      </div>
      
      <div className="chips">
        {['all', 'Free Fire', 'Ludo', 'Quiz'].map(f => (
          <div key={f} className={`chip ${filter === f ? 'on' : ''}`} onClick={() => setFilter(f)}>
            {f.toUpperCase()}
          </div>
        ))}
      </div>

      {sortedList.length ? (
        <div style={{ overflowX: 'auto' }}>
          <table className="lb-tbl" style={{ background: 'var(--dim)', border: '1px solid var(--dim2)' }}>
            <thead>
              <tr><th>RK</th><th>PLAYER</th><th>GAME</th><th>KILLS</th><th>RANK PTS</th><th>SCORE</th><th>PRIZE</th></tr>
            </thead>
            <tbody>
              {sortedList.map((e, i) => {
                const rc = i === 0 ? 'r1' : i === 1 ? 'r2' : i === 2 ? 'r3' : 'rn';
                return (
                  <tr key={i}>
                    <td><span className={`lb-rk ${rc}`}>{i + 1}</span></td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                        <div style={{ width: '30px', height: '30px', background: 'var(--red)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Anton', sans-serif", fontSize: '15px', color: '#fff' }}>
                          {e.username.charAt(0)}
                        </div>
                        <span style={{ fontFamily: "'Anton', sans-serif", fontSize: '15px', letterSpacing: '.5px' }}>{e.username}</span>
                      </div>
                    </td>
                    <td><span className="badge badge-gr">{e.game}</span></td>
                    <td style={{ color: 'var(--red)', fontFamily: "'IBM Plex Mono', monospace", fontSize: '12px' }}>💀 {e.kills}</td>
                    <td style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '12px' }}>{e.rankPts}</td>
                    <td style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '21px' }}>{e.score}</td>
                    <td style={{ color: 'var(--gold)', fontFamily: "'Bebas Neue', sans-serif", fontSize: '19px' }}>{e.prize}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="empty" style={{ background: 'var(--dim)', border: '1px solid var(--dim2)', padding: '56px 20px' }}>
          <div className="empty-ico">📊</div>
          <div className="empty-t">NO DATA</div>
        </div>
      )}
    </div>
  );
};
