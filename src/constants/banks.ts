export interface BankInfo {
  name: string;
  color: string;
  textColor: string;
  shortName: string;
}

export const BANKS: BankInfo[] = [
  { name: '카카오뱅크', color: '#FFEB00', textColor: '#000000', shortName: '카카오' },
  { name: '농협', color: '#3FA45C', textColor: '#FFFFFF', shortName: '농협' },
  { name: '하나', color: '#008375', textColor: '#FFFFFF', shortName: '하나' },
  { name: '국민', color: '#8A7E6E', textColor: '#FFFFFF', shortName: 'KB' },
  { name: '신한', color: '#0046FF', textColor: '#FFFFFF', shortName: '신한' },
  { name: '우리', color: '#004B9D', textColor: '#FFFFFF', shortName: '우리' },
  { name: '기업', color: '#005BAC', textColor: '#FFFFFF', shortName: 'IBK' },
  { name: '토스뱅크', color: '#3182F6', textColor: '#FFFFFF', shortName: '토스' },
  { name: '케이뱅크', color: '#00D4AA', textColor: '#FFFFFF', shortName: 'K뱅크' },
  { name: 'SC제일', color: '#006D6D', textColor: '#FFFFFF', shortName: 'SC' },
  { name: '부산', color: '#FF6B0B', textColor: '#FFFFFF', shortName: '부산' },
  { name: 'iM뱅크', color: '#00789E', textColor: '#FFFFFF', shortName: 'iM' },
  { name: '광주', color: '#D91A2A', textColor: '#FFFFFF', shortName: '광주' },
  { name: '전북', color: '#0059B7', textColor: '#FFFFFF', shortName: '전북' },
  { name: '경남', color: '#0E4C96', textColor: '#FFFFFF', shortName: '경남' },
  { name: '제주', color: '#00AEEF', textColor: '#FFFFFF', shortName: '제주' },
  { name: '수협', color: '#0047A3', textColor: '#FFFFFF', shortName: '수협' },
  { name: '우체국', color: '#E01E25', textColor: '#FFFFFF', shortName: '우체국' },
  { name: '새마을금고', color: '#00954C', textColor: '#FFFFFF', shortName: '새마을' },
  { name: '신협', color: '#0069B4', textColor: '#FFFFFF', shortName: '신협' },
  { name: '씨티', color: '#003087', textColor: '#FFFFFF', shortName: '씨티' },
  { name: '산업은행', color: '#004B97', textColor: '#FFFFFF', shortName: 'KDB' },
  { name: '저축은행', color: '#6B4EAB', textColor: '#FFFFFF', shortName: '저축' },
  { name: '카카오페이', color: '#FF5733', textColor: '#FFFFFF', shortName: 'Pay' },
  { name: '네이버페이', color: '#03C75A', textColor: '#FFFFFF', shortName: 'N Pay' },
];

export function getBankColor(bankName: string): string {
  return BANKS.find((b) => b.name === bankName)?.color ?? '#CCCCCC';
}

export function getBankTextColor(bankName: string): string {
  return BANKS.find((b) => b.name === bankName)?.textColor ?? '#000000';
}

export function getBankShortName(bankName: string): string {
  return BANKS.find((b) => b.name === bankName)?.shortName ?? bankName.slice(0, 3);
}
