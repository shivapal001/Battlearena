import React from 'react';
import { Page } from '../types';

interface NavProps {
  user: any;
  wallet: number;
  onPageChange: (page: Page) => void;
  onLoginClick: () => void;
}

export const Nav: React.FC<NavProps> = ({ user, wallet, onPageChange, onLoginClick }) => {
  const isAdmin = user?.role === 'admin';

  return (
    <nav className="nav">
      <div className="logo" onClick={() => onPageChange(user ? 'home' : 'landing')}>
        BATTLE<span className="sl">/</span>ARENA
      </div>
      <div className="nav-links">
        <div className="nl" onClick={() => onPageChange('home')}>Home</div>
        <div className="nl" onClick={() => onPageChange('tournaments')}>Tournaments</div>
        <div className="nl" onClick={() => onPageChange('leaderboard')}>Leaderboard</div>
        <div className="nl" onClick={() => onPageChange('wallet')}>Wallet</div>
        <div className="nl" onClick={() => onPageChange('profile')}>Profile</div>
        {isAdmin && <div className="nl" onClick={() => onPageChange('admin')}>Admin</div>}
      </div>
      <div className="nav-r">
        {user ? (
          <>
            <div className="nav-wallet" onClick={() => onPageChange('wallet')}>
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', color: 'var(--dim3)' }}>BAL</span>
              <span>₹{wallet.toLocaleString('en-IN')}</span>
            </div>
            <div className="nav-av" onClick={() => onPageChange('profile')}>
              {user.username.charAt(0).toUpperCase()}
            </div>
          </>
        ) : (
          <button className="nav-login" onClick={onLoginClick}>LOGIN / JOIN</button>
        )}
      </div>
    </nav>
  );
};
