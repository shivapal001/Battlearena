import React from 'react';
import { Tournament } from '../types';

interface DetailPageProps {
  tournament: Tournament;
  isJoined: boolean;
  onBack: () => void;
  onJoin: (id: string) => void;
}

export const DetailPage: React.FC<DetailPageProps> = ({ tournament, isJoined, onBack, onJoin }) => {
  const full = tournament.joined.length >= tournament.slots;
  const pct = Math.round((tournament.joined.length / tournament.slots) * 100);
  const emoji = tournament.game === 'Free Fire' ? '🎯' : tournament.game === 'Ludo' ? '🎲' : tournament.game === 'Carrom' ? '🎱' : tournament.game === 'Quiz' ? '🧠' : '🎮';
  const statusColor = tournament.status === 'live' ? 'var(--red)' : tournament.status === 'completed' ? 'var(--gold)' : 'var(--wh)';

  const copyRoom = (id: string, pass: string) => {
    navigator.clipboard.writeText(`Room ID: ${id}\nPassword: ${pass}`).then(() => alert('Copied!'));
  };

  return (
    <div className="pinner">
      <button className="btn btn-gh btn-sm" style={{ marginBottom: '18px' }} onClick={onBack}>← BACK</button>
      <div className="dhd">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '11px', marginBottom: '22px' }}>
          <div>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', color: 'var(--mt2)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '7px' }}>{emoji} {tournament.game}</div>
            <div style={{ fontFamily: "'Anton', sans-serif", fontSize: '32px', letterSpacing: '2px', color: 'var(--wh)', lineHeight: 1 }}>{tournament.title}</div>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', color: 'var(--dim3)', marginTop: '7px' }}>📅 {tournament.time}</div>
          </div>
          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', fontWeight: 700, color: statusColor, letterSpacing: '2px', padding: '7px 12px', border: `1px solid ${statusColor}40`, textTransform: 'uppercase' }}>{tournament.status.toUpperCase()}</span>
        </div>
        <div className="tc-bar" style={{ height: '3px', marginBottom: '7px' }}><div className={`tc-bar-f ${pct > 90 ? 'd' : 'n'}`} style={{ width: `${pct}%` }}></div></div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', color: 'var(--dim3)' }}>{tournament.joined.length} joined &nbsp;·&nbsp; {tournament.slots - tournament.joined.length} slots left</div>
      </div>
      
      <div className="dstats" style={{ marginBottom: '2px' }}>
        {[
          ['ENTRY FEE', tournament.fee === 0 ? 'FREE' : `₹${tournament.fee}`],
          ['PRIZE POOL', `₹${tournament.prize.toLocaleString('en-IN')}`],
          ['PLAYERS', `${tournament.joined.length}/${tournament.slots}`],
          ['FORMAT', 'BATTLE ROYALE']
        ].map(([l, v]) => (
          <div key={l} className="dstat">
            <div className="dstat-l">{l}</div>
            <div className="dstat-v">{v}</div>
          </div>
        ))}
      </div>

      {(tournament.status === 'live' || tournament.status === 'completed') && isJoined && tournament.roomId && (
        <div className="room-reveal" style={{ marginBottom: '2px' }}>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', color: 'var(--dim3)', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '8px' }}>ROOM ID</div>
          <div className="room-id-v">{tournament.roomId}</div>
          <div style={{ height: '1px', background: 'var(--dim2)', margin: '14px 0' }}></div>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', color: 'var(--dim3)', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '7px' }}>PASSWORD</div>
          <div className="room-pass-v">{tournament.roomPass}</div>
          <button className="btn btn-gh btn-sm" style={{ marginTop: '13px' }} onClick={() => copyRoom(tournament.roomId, tournament.roomPass)}>COPY DETAILS</button>
        </div>
      )}

      <div className="two-col" style={{ marginBottom: '2px' }}>
        <div style={{ background: 'var(--dim)', border: '1px solid var(--dim2)', padding: '20px' }}>
          <div className="sh">PRIZE DISTRIBUTION</div>
          <div className="pr r1"><div className="pr-pos" style={{ color: 'var(--gold)' }}>🥇 1ST PLACE</div><div className="pr-amt">₹{tournament.prize1.toLocaleString('en-IN')}</div></div>
          <div className="pr r2"><div className="pr-pos" style={{ color: '#9ca3af' }}>🥈 2ND PLACE</div><div className="pr-amt">₹{tournament.prize2.toLocaleString('en-IN')}</div></div>
          <div className="pr r3"><div className="pr-pos" style={{ color: '#cd7f32' }}>🥉 3RD PLACE</div><div className="pr-amt">₹{tournament.prize3.toLocaleString('en-IN')}</div></div>
        </div>
        <div style={{ background: 'var(--dim)', border: '1px solid var(--dim2)', padding: '20px' }}>
          <div className="sh">SCORING SYSTEM</div>
          {[
            ['RANK #1', '12 PTS'],
            ['RANK #2', '9 PTS'],
            ['RANK #3', '8 PTS'],
            ['RANK #4+', '6/4/2 PTS'],
            ['PER KILL', '+1 PT']
          ].map(([l, v]) => (
            <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,.04)' }}>
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', color: 'var(--mt)' }}>{l}</span>
              <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '18px', color: 'var(--wh)' }}>{v}</span>
            </div>
          ))}
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', color: 'var(--dim3)', marginTop: '9px' }}>TOTAL = RANK PTS + KILL PTS</div>
        </div>
      </div>

      <div style={{ textAlign: 'center', padding: '18px 0' }}>
        {tournament.status === 'completed' ? (
          <button className="btn btn-gh" disabled style={{ opacity: 0.5, cursor: 'not-allowed' }}>TOURNAMENT ENDED</button>
        ) : isJoined ? (
          <button className="btn btn-wh" style={{ cursor: 'default' }}>✓ YOU ARE REGISTERED</button>
        ) : full ? (
          <button className="btn btn-gh" disabled style={{ opacity: 0.5, cursor: 'not-allowed' }}>FULL</button>
        ) : (
          <button className="btn btn-red" onClick={() => onJoin(tournament.id)}>JOIN TOURNAMENT — ₹{tournament.fee}</button>
        )}
      </div>

      {tournament.status === 'completed' && tournament.results.length > 0 && (
        <div style={{ marginTop: '2px' }}>
          <div className="sh" style={{ marginBottom: '12px' }}>MATCH RESULTS</div>
          <div style={{ overflowX: 'auto' }}>
            <table className="dtbl">
              <thead>
                <tr><th>RK</th><th>PLAYER</th><th>KILLS</th><th>RANK PTS</th><th>TOTAL</th><th>PRIZE</th></tr>
              </thead>
              <tbody>
                {tournament.results.map((r, i) => {
                  const rc = i === 0 ? 'r1' : i === 1 ? 'r2' : i === 2 ? 'r3' : 'rn';
                  const pz = [tournament.prize1, tournament.prize2, tournament.prize3];
                  return (
                    <tr key={i}>
                      <td><span className={`lb-rk ${rc}`}>{i + 1}</span></td>
                      <td style={{ fontFamily: "'Anton', sans-serif", fontSize: '15px', letterSpacing: '.5px' }}>{r.uid}</td>
                      <td style={{ color: 'var(--red)', fontFamily: "'IBM Plex Mono', monospace", fontSize: '12px' }}>💀 {r.kills}</td>
                      <td style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '12px' }}>{r.rankPts}</td>
                      <td style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '19px' }}>{r.total}</td>
                      <td style={{ color: 'var(--gold)', fontFamily: "'Bebas Neue', sans-serif", fontSize: '17px' }}>{pz[i] ? `₹${pz[i]}` : '—'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
