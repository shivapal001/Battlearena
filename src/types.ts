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
  name: string;
  game: string;
  entryFee: number;
  maxPlayers: number;
  joined: string[];
  prizePool: number;
  prize1: number;
  prize2: number;
  prize3: number;
  startTime: string;
  startDate: string;
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
  type: 'credit' | 'debit';
  title: string;
  amount: number;
  time: string;
  icon: string;
  status: 'pending' | 'completed' | 'rejected';
  upi?: string;
  utr?: string;
  userId: string;
}

export type Page = 'landing' | 'home' | 'tournaments' | 'detail' | 'leaderboard' | 'wallet' | 'profile' | 'admin';
