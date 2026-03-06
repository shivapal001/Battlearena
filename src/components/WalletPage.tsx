import React from 'react';
import { Transaction } from '../types';

interface WalletPageProps {
  wallet: number;
  transactions: Transaction[];
  onAddMoney: () => void;
  onWithdraw: () => void;
}

export const WalletPage: React.FC<WalletPageProps> = ({ wallet, transactions, onAddMoney, onWithdraw }) => {
  return (
    <div className="pinner">
      <div className="phd">
        <div className="phd-top">
          <div className="phd-n">03</div>
          <div><div className="phd-title">WALLET</div></div>
        </div>
        <div className="phd-sub">Your balance and transaction history</div>
      </div>
      
      <div className="wal-hero">
        <div className="wal-lbl">AVAILABLE BALANCE</div>
        <div className="wal-bal">₹{wallet.toLocaleString('en-IN')}</div>
        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', color: 'var(--dim3)', marginTop: '7px', letterSpacing: '2px' }}>
          WITHDRAW ANYTIME · POWERED BY RAZORPAY
        </div>
        <div style={{ display: 'flex', gap: '2px', marginTop: '20px', flexWrap: 'wrap' }}>
          <button className="btn btn-red" onClick={onAddMoney}>+ ADD MONEY</button>
          <button className="btn btn-gh" onClick={onWithdraw}>WITHDRAW</button>
        </div>
      </div>
      
      <div className="sh">TRANSACTIONS</div>
      <div style={{ background: 'var(--dim)', border: '1px solid var(--dim2)', padding: '0 14px' }}>
        {transactions.length ? (
          transactions.map(tx => (
            <div key={tx.id} className="txn">
              <div className="txn-ic">{tx.icon}</div>
              <div className="txn-info">
                <div className="txn-t">{tx.title}</div>
                <div className="txn-d">{tx.time}</div>
              </div>
              <div className={`txn-a ${tx.type === 'deposit' || tx.type === 'prize' ? 'cr' : 'dr'}`}>
                {tx.type === 'deposit' || tx.type === 'prize' ? '+' : '-'}₹{tx.amount.toLocaleString('en-IN')}
              </div>
            </div>
          ))
        ) : (
          <div className="empty" style={{ padding: '36px 0' }}>
            <div className="empty-ico">💳</div>
            <div className="empty-t">NO TRANSACTIONS</div>
          </div>
        )}
      </div>
    </div>
  );
};
