import React from 'react';

interface LandingPageProps {
  onAuth: (type: 'login' | 'register') => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onAuth }) => {
  return (
    <div id="landingPage" className="page show">
      <div className="hero">
        <div className="hero-inner">
          <div>
            <div className="hero-eyebrow">INDIA'S #1 ESPORTS PLATFORM</div>
            <h1 className="hero-h1"><span className="l1">BATTLE</span><span className="l2">ARENA</span></h1>
            <p className="hero-tagline">Join daily Free Fire custom room tournaments.<br />Compete. Climb. Collect real cash prizes.</p>
            <div className="hero-btns">
              <button className="btn btn-red" onClick={() => onAuth('register')}>CREATE ACCOUNT →</button>
              <button className="btn btn-gh" onClick={() => onAuth('login')}>LOGIN</button>
            </div>
            <div className="hero-nums">
              <div className="hnum"><div className="hnum-v">12K+</div><div className="hnum-l">Players</div></div>
              <div className="hnum"><div className="hnum-v">1,284</div><div className="hnum-l">Tournaments</div></div>
              <div className="hnum"><div className="hnum-v">₹8.4L</div><div className="hnum-l">Distributed</div></div>
              <div className="hnum"><div className="hnum-v">DAILY</div><div className="hnum-l">Matches</div></div>
            </div>
          </div>
        </div>
      </div>

      <div className="feat-sec">
        <div className="wrap">
          <div className="s-lbl">What We Offer</div>
          <div className="s-h2">BUILT FOR FIGHTERS</div>
          <div className="feat-grid">
            <div className="feat"><div className="feat-n">01</div><div className="feat-t">DAILY TOURNAMENTS</div><div className="feat-d">Multiple tournaments every day across Free Fire, Ludo, Quiz and Carrom. Something to compete in every single night.</div></div>
            <div className="feat"><div className="feat-n">02</div><div className="feat-t">REAL CASH PRIZES</div><div className="feat-d">Win actual money directly to your wallet. Withdraw anytime via UPI within 24 hours. No gimmicks.</div></div>
            <div className="feat"><div className="feat-n">03</div><div className="feat-t">CUSTOM ROOMS</div><div className="feat-d">Admin-managed Free Fire custom rooms. Room ID and password shared on platform before every match starts.</div></div>
            <div className="feat"><div className="feat-n">04</div><div className="feat-t">LIVE LEADERBOARDS</div><div className="feat-d">Ranked by Kill Points + Rank Points. See exactly where you stand after every elimination.</div></div>
            <div className="feat"><div className="feat-n">05</div><div className="feat-t">INSTANT PAYOUTS</div><div className="feat-d">Powered by Razorpay. Prize money auto-credited to your wallet the moment results are published.</div></div>
            <div className="feat"><div className="feat-n">06</div><div className="feat-t">MOBILE READY</div><div className="feat-d">Designed for mobile gamers. Plays perfectly on any phone. Join a tournament in under 60 seconds.</div></div>
          </div>
        </div>
      </div>

      <div className="games-sec">
        <div className="wrap">
          <div className="s-lbl">Supported Games</div>
          <div className="s-h2">CHOOSE YOUR WEAPON</div>
          <div className="games-grid">
            <div className="game-item"><span className="g-ico">🎯</span><div className="g-name">FREE FIRE</div><div className="g-sub">Battle Royale</div></div>
            <div className="game-item"><span className="g-ico">🎲</span><div className="g-name">LUDO</div><div className="g-sub">Board Game</div></div>
            <div className="game-item"><span className="g-ico">🎱</span><div className="g-name">CARROM</div><div className="g-sub">Pool</div></div>
            <div className="game-item"><span className="g-ico">🧠</span><div className="g-name">QUIZ</div><div className="g-sub">Trivia Battle</div></div>
          </div>
        </div>
      </div>

      <div className="how-sec">
        <div className="wrap">
          <div className="s-lbl">Process</div>
          <div className="s-h2">HOW IT WORKS</div>
          <div className="how-grid">
            <div className="how-step"><div className="step-n">01</div><div className="step-t">REGISTER</div><div className="step-d">Create your free account. Enter email and Free Fire UID. Done in 30 seconds.</div></div>
            <div className="how-step"><div className="step-n">02</div><div className="step-t">ADD MONEY</div><div className="step-d">Load your wallet via UPI, cards or net banking through Razorpay. Minimum ₹10.</div></div>
            <div className="how-step"><div className="step-n">03</div><div className="step-t">JOIN & PLAY</div><div className="step-d">Pick a tournament. Pay entry. Get Room ID and password before the match.</div></div>
            <div className="how-step"><div className="step-n">04</div><div className="step-t">COLLECT PRIZE</div><div className="step-d">Top finishers get cash auto-credited instantly. Withdraw to UPI anytime.</div></div>
          </div>
        </div>
      </div>

      <div className="cta-sec">
        <div className="wrap" style={{ position: 'relative', zIndex: 1 }}>
          <div className="s-lbl" style={{ justifyContent: 'center' }}>Ready?</div>
          <div style={{ fontFamily: "'Anton', sans-serif", fontSize: 'clamp(34px, 7vw, 76px)', letterSpacing: '2px', color: 'var(--wh)', marginBottom: '12px' }}>ENTER THE ARENA</div>
          <div style={{ fontSize: '14px', color: 'var(--mt)', marginBottom: '28px', fontFamily: "'IBM Plex Mono', monospace", letterSpacing: '.5px' }}>Free to sign up. Start competing tonight.</div>
          <button className="btn btn-red" style={{ fontSize: '12px', padding: '15px 38px' }} onClick={() => onAuth('register')}>CREATE FREE ACCOUNT →</button>
        </div>
      </div>

      <div className="footer-s">
        <div className="footer-logo">BATTLE/ARENA</div>
        <div className="footer-txt">© 2025 BATTLEARENA · INDIA · POWERED BY RAZORPAY</div>
        <div className="footer-txt">ALL RIGHTS RESERVED</div>
      </div>
    </div>
  );
};
