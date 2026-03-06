import React from 'react';
import { Tournament } from '../types';

interface TournamentCardProps {
  tournament: Tournament;
  isJoined: boolean;
  onJoin: (id: string) => void;
  onView: (id: string) => void;
}

export const TournamentCard: React.FC<TournamentCardProps> = ({ tournament, isJoined, onJoin, onView }) => {
  const pct = Math.round((tournament.joined.length / tournament.slots) * 100);
  const full = tournament.joined.length >= tournament.slots;
  
  const gameEmoji: Record<string, string> = {
    'Free Fire': '🎯',
    'Ludo': '🎲',
    'Carrom': '🎱',
    'Quiz': '🧠'
  };
  const emoji = gameEmoji[tournament.game] || '🎮';

  const getStatusClass = () => {
    if (tournament.status === 'live') return 'live';
    if (tournament.status === 'completed') return 'completed';
    if (full) return 'full';
    return 'upcoming';
  };

  const getStatusLabel = () => {
    if (tournament.status === 'live') return '● LIVE';
    if (tournament.status === 'completed') return 'ENDED';
    if (full) return 'FULL';
    return 'UPCOMING';
  };

  const getButtonProps = () => {
    if (tournament.status === 'completed') return { className: 'tc-btn disabled', label: 'ENDED', disabled: true };
    if (isJoined) return { className: 'tc-btn joined', label: '✓ REGISTERED', disabled: true };
    if (full) return { className: 'tc-btn disabled', label: 'FULL', disabled: true };
    return { className: 'tc-btn joinable', label: `JOIN — ₹${tournament.fee}`, disabled: false };
  };

  const btn = getButtonProps();

  return (
    <div className="tc" onClick={() => onView(tournament.id)}>
      <div className="tc-top">
        <div className="tc-game">{emoji} {tournament.game.toUpperCase()}</div>
        <div className={`tc-st ${getStatusClass()}`}>{getStatusLabel()}</div>
      </div>
      <div className="tc-body">
        <div className="tc-name">{tournament.title}</div>
        <div className="tc-grid">
          <div><div className="tc-sl">Entry</div><div className="tc-sv">{tournament.fee === 0 ? 'FREE' : `₹${tournament.fee}`}</div></div>
          <div><div className="tc-sl">Prize Pool</div><div className="tc-sv gold">₹{tournament.prize.toLocaleString('en-IN')}</div></div>
          <div><div className="tc-sl">Time</div><div className="tc-sv">{tournament.time}</div></div>
          <div><div className="tc-sl">Slots</div><div className="tc-sv">{tournament.slots}</div></div>
        </div>
        <div className="tc-slots">{tournament.joined.length}/{tournament.slots} PLAYERS</div>
        <div className="tc-bar"><div className={`tc-bar-f ${pct > 90 ? 'd' : 'n'}`} style={{ width: `${pct}%` }}></div></div>
        <button 
          className={btn.className} 
          disabled={btn.disabled}
          onClick={(e) => {
            e.stopPropagation();
            if (!btn.disabled) onJoin(tournament.id);
          }}
        >
          {btn.label}
        </button>
      </div>
    </div>
  );
};
