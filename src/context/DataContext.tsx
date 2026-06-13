import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from 'react';

import {
  accounts as defaultAccounts,
  myAccounts as defaultMyAccounts,
  recentRecipients as defaultRecipients,
  transactions as defaultTransactions,
} from '@/data/dummy';
import type { Account, RecentRecipient, Transaction } from '@/data/dummy';

const STORAGE_KEY = '@kakaobank_data';

export interface AppData {
  userName: string;
  accounts: Account[];
  transactions: Transaction[];
  myAccounts: RecentRecipient[];
  recentRecipients: RecentRecipient[];
}

const defaultState: AppData = {
  userName: '이준영',
  accounts: defaultAccounts,
  transactions: defaultTransactions,
  myAccounts: defaultMyAccounts,
  recentRecipients: defaultRecipients,
};

type Action =
  | { type: 'LOAD'; payload: AppData }
  | { type: 'SET_USERNAME'; payload: string }
  | { type: 'SET_ACCOUNTS'; payload: Account[] }
  | { type: 'SET_TRANSACTIONS'; payload: Transaction[] }
  | { type: 'SET_MY_ACCOUNTS'; payload: RecentRecipient[] }
  | { type: 'SET_RECENT_RECIPIENTS'; payload: RecentRecipient[] }
  | { type: 'RESET' };

function reducer(state: AppData, action: Action): AppData {
  switch (action.type) {
    case 'LOAD':
      return action.payload;
    case 'SET_USERNAME':
      return { ...state, userName: action.payload };
    case 'SET_ACCOUNTS':
      return { ...state, accounts: action.payload };
    case 'SET_TRANSACTIONS':
      return { ...state, transactions: action.payload };
    case 'SET_MY_ACCOUNTS':
      return { ...state, myAccounts: action.payload };
    case 'SET_RECENT_RECIPIENTS':
      return { ...state, recentRecipients: action.payload };
    case 'RESET':
      return defaultState;
    default:
      return state;
  }
}

interface DataContextValue {
  data: AppData;
  setUserName: (name: string) => void;
  setAccounts: (accounts: Account[]) => void;
  setTransactions: (transactions: Transaction[]) => void;
  setMyAccounts: (accounts: RecentRecipient[]) => void;
  setRecentRecipients: (recipients: RecentRecipient[]) => void;
  reset: () => void;
}

const DataContext = createContext<DataContextValue | null>(null);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [data, dispatch] = useReducer(reducer, defaultState);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((json) => {
      if (json) {
        try {
          dispatch({ type: 'LOAD', payload: JSON.parse(json) });
        } catch {
          // 파싱 실패 시 기본값 유지
        }
      }
    });
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const setUserName = useCallback(
    (name: string) => dispatch({ type: 'SET_USERNAME', payload: name }),
    [],
  );
  const setAccounts = useCallback(
    (accounts: Account[]) => dispatch({ type: 'SET_ACCOUNTS', payload: accounts }),
    [],
  );
  const setTransactions = useCallback(
    (transactions: Transaction[]) =>
      dispatch({ type: 'SET_TRANSACTIONS', payload: transactions }),
    [],
  );
  const setMyAccounts = useCallback(
    (accounts: RecentRecipient[]) =>
      dispatch({ type: 'SET_MY_ACCOUNTS', payload: accounts }),
    [],
  );
  const setRecentRecipients = useCallback(
    (recipients: RecentRecipient[]) =>
      dispatch({ type: 'SET_RECENT_RECIPIENTS', payload: recipients }),
    [],
  );
  const reset = useCallback(() => dispatch({ type: 'RESET' }), []);

  return (
    <DataContext.Provider
      value={{
        data,
        setUserName,
        setAccounts,
        setTransactions,
        setMyAccounts,
        setRecentRecipients,
        reset,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useAppData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useAppData must be used inside DataProvider');
  return ctx;
}
