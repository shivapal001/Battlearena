import { Player, Tournament, LeaderboardEntry, Transaction } from './types';

export const INITIAL_PLAYERS: Player[] = [
  {
    id: 'demo',
    username: 'GameLord99',
    email: 'player@demo.com',
    phone: '+91 98765 43210',
    gameId: '4521897634',
    wallet: 850,
    joined: ['t1'],
    kills: 45,
    wins: 3,
    earnings: 3200,
    password: 'demo123',
    role: 'user'
  },
  {
    id: 'adm1',
    username: 'Admin',
    email: 'admin@battlearena.gg',
    phone: '+91 99999 00000',
    gameId: '0000000001',
    wallet: 99999,
    joined: [],
    kills: 0,
    wins: 0,
    earnings: 0,
    password: 'admin123',
    role: 'admin'
  },
];

export const INITIAL_TOURNAMENTS: Tournament[] = [
  {
    id: 't1',
    title: 'Friday Night Brawl',
    game: 'Free Fire',
    fee: 50,
    slots: 50,
    joined: ['demo'],
    prize: 2500,
    prize1: 1200,
    prize2: 600,
    prize3: 300,
    time: 'Today, 8:00 PM',
    status: 'upcoming',
    roomId: '',
    roomPass: '',
    results: []
  },
  {
    id: 't2',
    title: 'Headshot Masters',
    game: 'Free Fire',
    fee: 100,
    slots: 30,
    joined: Array.from({ length: 28 }, (_, i) => 'px' + i),
    prize: 3000,
    prize1: 1500,
    prize2: 750,
    prize3: 400,
    time: 'Today, 9:00 PM',
    status: 'live',
    roomId: '445566',
    roomPass: 'ff2024',
    results: []
  },
  {
    id: 't3',
    title: 'Ludo King Showdown',
    game: 'Ludo',
    fee: 30,
    slots: 16,
    joined: ['p1', 'p2'],
    prize: 480,
    prize1: 250,
    prize2: 120,
    prize3: 60,
    time: 'Tomorrow, 9:00 PM',
    status: 'upcoming',
    roomId: '',
    roomPass: '',
    results: []
  },
  {
    id: 't4',
    title: 'GK Quiz Championship',
    game: 'Quiz',
    fee: 20,
    slots: 100,
    joined: Array.from({ length: 10 }, (_, i) => 'pq' + i),
    prize: 2000,
    prize1: 1000,
    prize2: 500,
    prize3: 250,
    time: 'Sun, 7:00 PM',
    status: 'upcoming',
    roomId: '',
    roomPass: '',
    results: []
  },
  {
    id: 't5',
    title: 'Survivor Pro League',
    game: 'Free Fire',
    fee: 200,
    slots: 48,
    joined: Array.from({ length: 48 }, (_, i) => 'ps' + i),
    prize: 9600,
    prize1: 5000,
    prize2: 2500,
    prize3: 1200,
    time: 'Yesterday, 6:00 PM',
    status: 'completed',
    roomId: '887766',
    roomPass: 'pro2024',
    results: [
      { uid: 'GameLord99', kills: 8, rankPts: 12, total: 20 },
      { uid: 'SnipeKing', kills: 6, rankPts: 9, total: 15 },
      { uid: 'HeadshotHero', kills: 7, rankPts: 8, total: 15 }
    ]
  },
  {
    id: 't6',
    title: 'Carrom Pool Masters',
    game: 'Carrom',
    fee: 50,
    slots: 20,
    joined: ['p1', 'p2'],
    prize: 1000,
    prize1: 500,
    prize2: 250,
    prize3: 125,
    time: 'Tomorrow, 10:00 PM',
    status: 'upcoming',
    roomId: '',
    roomPass: '',
    results: []
  },
];

export const INITIAL_LEADERBOARD: LeaderboardEntry[] = [
  { username: 'HeadshotHero', game: 'Free Fire', kills: 89, rankPts: 12, score: 101, prize: '₹5,000' },
  { username: 'SnipeKing', game: 'Free Fire', kills: 67, rankPts: 9, score: 76, prize: '₹2,500' },
  { username: 'GameLord99', game: 'Free Fire', kills: 45, rankPts: 8, score: 53, prize: '₹1,200' },
  { username: 'RushMaster', game: 'Free Fire', kills: 34, rankPts: 6, score: 40, prize: '—' },
  { username: 'QuizMaster', game: 'Quiz', kills: 0, rankPts: 12, score: 95, prize: '₹1,000' },
  { username: 'LudoKing', game: 'Ludo', kills: 0, rankPts: 12, score: 88, prize: '₹250' },
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  { id: 'tx1', type: 'deposit', title: 'Added Money', amount: 500, time: 'Yesterday', icon: '💰', status: 'completed', uid: 'demo' },
  { id: 'tx2', type: 'entry', title: 'Entry — Friday Night Brawl', amount: 50, time: 'Today', icon: '🎯', status: 'completed', uid: 'demo' },
  { id: 'tx3', type: 'prize', title: 'Prize — Survivor Pro League', amount: 800, time: '2d ago', icon: '🏆', status: 'completed', uid: 'demo' },
];
