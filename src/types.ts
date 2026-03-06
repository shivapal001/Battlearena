export interface Player {
  id: string;
  username: string;
  email: string;
  phone: string;
  gameId: string;
  wallet: number;
  joined: string[];
  kills: number;
  wins: number;
  earnings: number;
  password?: string;
  role: 'user' | 'admin';
}

export interface TournamentResult {
  uid: string;
  kills: number;
  rankPts: number;
  total: number;
}

export interface Tournament {
  id: string;
  title: string;
  game: string;
  fee: number;
  slots: number;
  joined: string[];
  prize: number;
  prize1: number;
  prize2: number;
  prize3: number;
  time: string;
  status: 'upcoming' | 'live' | 'completed';
  roomId: string;
  roomPass: string;
  results: TournamentResult[];
}

export interface LeaderboardEntry {
  username: string;
  game: string;
  kills: number;
  rankPts: number;
  score: number;
  prize: string;
}

export interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'prize' | 'entry';
  title: string;
  amount: number;
  time: string;
  icon: string;
  status: 'pending' | 'completed' | 'failed';
  upi?: string;
  utr?: string;
  uid: string;
}

export type Page = 'landing' | 'home' | 'tournaments' | 'detail' | 'leaderboard' | 'wallet' | 'profile' | 'admin';
