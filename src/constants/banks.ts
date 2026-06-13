export interface BankInfo {
  name: string;
  color: string;
  textColor: string;
}

export const BANKS: BankInfo[] = [
  { name: '카카오뱅크', color: '#FFEB00', textColor: '#000000' },
  { name: '농협', color: '#3FA45C', textColor: '#FFFFFF' },
  { name: '하나', color: '#008375', textColor: '#FFFFFF' },
  { name: '국민', color: '#8A7E6E', textColor: '#FFFFFF' },
  { name: '신한', color: '#0046FF', textColor: '#FFFFFF' },
  { name: '우리', color: '#004B9D', textColor: '#FFFFFF' },
  { name: '기업', color: '#005BAC', textColor: '#FFFFFF' },
  { name: '토스뱅크', color: '#3182F6', textColor: '#FFFFFF' },
  { name: '케이뱅크', color: '#00D4AA', textColor: '#FFFFFF' },
  { name: 'SC제일', color: '#006D6D', textColor: '#FFFFFF' },
];

export function getBankColor(bankName: string): string {
  return BANKS.find((b) => b.name === bankName)?.color ?? '#CCCCCC';
}

export function getBankTextColor(bankName: string): string {
  return BANKS.find((b) => b.name === bankName)?.textColor ?? '#000000';
}
