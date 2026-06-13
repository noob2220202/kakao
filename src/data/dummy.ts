export interface Account {
  id: string;
  name: string;
  bank: string;
  accountNumber: string;
  balance: number;
  color: 'beige' | 'yellow' | 'green';
  badge?: string;
  avatarText?: string;
}

export interface Transaction {
  id: string;
  accountId: string;
  merchant: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  dateTime: string; // 거래상세 표기용 YYYY.MM.DD HH:mm:ss
  amount: number; // 음수 = 출금
  balanceAfter: number;
  tag: string; // #체크카드, #캐시백 등
  type: string; // 거래구분
  cardInfo?: string;
  address?: string;
}

export interface RecentRecipient {
  id: string;
  name: string;
  bank: string;
  accountNumber: string;
  bankColor: string;
  starred?: boolean;
}

export const accounts: Account[] = [
  {
    id: 'mini',
    name: '이준영 mini',
    bank: '카카오뱅크',
    accountNumber: '7777-03-3443370',
    balance: 762,
    color: 'beige',
    avatarText: 'B',
  },
  {
    id: 'limit',
    name: '준영',
    bank: '카카오뱅크',
    accountNumber: '3333-12-3456789',
    balance: 28911,
    color: 'yellow',
    badge: '한도계좌',
    avatarText: '준영',
  },
  {
    id: 'nh',
    name: '이준영의 농협은행 계좌',
    bank: '농협',
    accountNumber: '3521880213103',
    balance: 3163,
    color: 'green',
    avatarText: '🌱',
  },
];

export const transactions: Transaction[] = [
  {
    id: 'tx1',
    accountId: 'limit',
    merchant: '매산음료자판기',
    date: '2026-06-12',
    time: '07:45',
    dateTime: '2026.06.12 07:45:23',
    amount: -700,
    balanceAfter: 28911,
    tag: '#체크카드',
    type: '체크카드결제',
    cardInfo: '프렌즈 체크카드 (5321)',
    address: '전남 순천시 호남길 12 2층 (행동)',
  },
  {
    id: 'tx2',
    accountId: 'limit',
    merchant: '매산음료자판기',
    date: '2026-06-12',
    time: '07:44',
    dateTime: '2026.06.12 07:44:51',
    amount: -1000,
    balanceAfter: 29611,
    tag: '#체크카드',
    type: '체크카드결제',
    cardInfo: '프렌즈 체크카드 (5321)',
    address: '전남 순천시 호남길 12 2층 (행동)',
  },
  {
    id: 'tx3',
    accountId: 'limit',
    merchant: '매산음료자판기',
    date: '2026-06-11',
    time: '12:50',
    dateTime: '2026.06.11 12:50:08',
    amount: -1000,
    balanceAfter: 30611,
    tag: '#체크카드',
    type: '체크카드결제',
    cardInfo: '프렌즈 체크카드 (5321)',
    address: '전남 순천시 호남길 12 2층 (행동)',
  },
  {
    id: 'tx4',
    accountId: 'limit',
    merchant: '프렌즈 체크카드 캐시백',
    date: '2026-06-10',
    time: '11:45',
    dateTime: '2026.06.10 11:45:00',
    amount: 1753,
    balanceAfter: 31611,
    tag: '#캐시백',
    type: '캐시백',
  },
  {
    id: 'tx5',
    accountId: 'mini',
    merchant: 'GS25 순천점',
    date: '2026-06-12',
    time: '09:20',
    dateTime: '2026.06.12 09:20:11',
    amount: -2400,
    balanceAfter: 762,
    tag: '#체크카드',
    type: '체크카드결제',
    cardInfo: '카카오뱅크 체크카드 (8812)',
    address: '전남 순천시 연향동 25',
  },
];

export const myAccounts: RecentRecipient[] = [
  {
    id: 'my1',
    name: '이준영의 농협은행 계좌',
    bank: '농협',
    accountNumber: '3521880213103',
    bankColor: '#3FA45C',
  },
  {
    id: 'my2',
    name: '이준영 mini',
    bank: '카카오뱅크',
    accountNumber: '7777-03-3443370',
    bankColor: '#FFEB00',
  },
  {
    id: 'my3',
    name: '이준영의 하나은행 계좌',
    bank: '하나',
    accountNumber: '70491075452107',
    bankColor: '#008375',
  },
];

export const recentRecipients: RecentRecipient[] = [
  {
    id: 'r1',
    name: '김미연',
    bank: '농협',
    accountNumber: '64102460618',
    bankColor: '#3FA45C',
    starred: true,
  },
  {
    id: 'r2',
    name: '카페24 주식회사',
    bank: '국민',
    accountNumber: '95759073983842',
    bankColor: '#8A7E6E',
    starred: false,
  },
  {
    id: 'r3',
    name: '문희준(미니)',
    bank: '카카오뱅크',
    accountNumber: '7777-02-6354952',
    bankColor: '#FFEB00',
    starred: false,
  },
];

export function formatWon(amount: number): string {
  const abs = Math.abs(amount);
  return `${amount < 0 ? '-' : ''}${abs.toLocaleString('ko-KR')}원`;
}

export function formatWonPlain(amount: number): string {
  return `${amount.toLocaleString('ko-KR')}원`;
}
