import { Ionicons } from '@expo/vector-icons';
import { Link, router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, fontSize, radius } from '@/constants/theme';
import { useAppData } from '@/context/DataContext';
import { formatWon, formatWonPlain } from '@/data/dummy';
import type { Transaction } from '@/data/dummy';

type Filter = 'all' | 'in' | 'out';

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all', label: '전체' },
  { key: 'in', label: '입금' },
  { key: 'out', label: '출금' },
];

const DAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'];

function formatDateHeader(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  const dow = new Date(y, m - 1, d).getDay();
  return `${m}월 ${d}일 (${DAY_LABELS[dow]})`;
}

function groupByDate(txs: Transaction[]): { date: string; items: Transaction[] }[] {
  const map = new Map<string, Transaction[]>();
  for (const tx of txs) {
    const arr = map.get(tx.date) ?? [];
    arr.push(tx);
    map.set(tx.date, arr);
  }
  return Array.from(map.entries())
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([date, items]) => ({ date, items }));
}

export default function TransactionsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data } = useAppData();
  const account = data.accounts.find((a) => a.id === id) ?? data.accounts[0];
  const [filter, setFilter] = useState<Filter>('all');

  const filtered = useMemo(() => {
    const base = data.transactions.filter((tx) => tx.accountId === account?.id);
    if (filter === 'in') return base.filter((tx) => tx.amount > 0);
    if (filter === 'out') return base.filter((tx) => tx.amount < 0);
    return base;
  }, [data.transactions, account?.id, filter]);

  const grouped = useMemo(() => groupByDate(filtered), [filtered]);

  if (!account) return null;

  const bg = { beige: '#B5AD9B', yellow: '#FFEB00', green: '#3FA45C' }[account.color] ?? '#B5AD9B';
  const textColor = account.color === 'green' ? '#FFFFFF' : '#1A1009';
  const subColor = account.color === 'green' ? 'rgba(255,255,255,0.65)' : 'rgba(26,16,9,0.55)';

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* 미니 히어로 */}
      <View style={[styles.hero, { backgroundColor: bg }]}>
        <View style={styles.heroHeader}>
          <Pressable onPress={() => router.back()} hitSlop={8}>
            <Ionicons name="chevron-back" size={26} color={textColor} />
          </Pressable>
          <Text style={[styles.heroTitle, { color: textColor }]}>거래 내역</Text>
          <View style={{ width: 34 }} />
        </View>
        <Text style={[styles.heroBalance, { color: textColor }]}>{formatWonPlain(account.balance)}</Text>
        <Text style={[styles.heroNumber, { color: subColor }]}>{account.accountNumber}</Text>
      </View>

      {/* 필터 탭 */}
      <View style={styles.filterBar}>
        {FILTERS.map(({ key, label }) => (
          <Pressable
            key={key}
            style={[styles.filterChip, filter === key && styles.filterChipActive]}
            onPress={() => setFilter(key)}
          >
            <Text style={[styles.filterText, filter === key && styles.filterTextActive]}>
              {label}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* 거래 목록 */}
      <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
        {grouped.length === 0 ? (
          <View style={styles.emptyBox}>
            <Ionicons name="receipt-outline" size={40} color={colors.textTertiary} />
            <Text style={styles.emptyText}>거래 내역이 없어요</Text>
          </View>
        ) : (
          grouped.map(({ date, items }) => (
            <View key={date}>
              <View style={styles.dateHeader}>
                <Text style={styles.dateHeaderText}>{formatDateHeader(date)}</Text>
                <Text style={styles.dateSumText}>
                  {items.filter((t) => t.amount > 0).reduce((s, t) => s + t.amount, 0) > 0
                    ? `+${items.filter((t) => t.amount > 0).reduce((s, t) => s + t.amount, 0).toLocaleString('ko-KR')}원`
                    : ''}
                  {' '}
                  {items.filter((t) => t.amount < 0).reduce((s, t) => s + t.amount, 0) < 0
                    ? `${items.filter((t) => t.amount < 0).reduce((s, t) => s + t.amount, 0).toLocaleString('ko-KR')}원`
                    : ''}
                </Text>
              </View>
              {items.map((tx) => (
                <Link key={tx.id} href={`/transaction/${tx.id}`} asChild>
                  <Pressable style={styles.txRow}>
                    <View style={styles.txIconWrap}>
                      <Ionicons
                        name={tx.amount > 0 ? 'arrow-down-circle-outline' : 'arrow-up-circle-outline'}
                        size={24}
                        color={tx.amount > 0 ? colors.textGreen : colors.textSecondary}
                      />
                    </View>
                    <View style={styles.txInfo}>
                      <Text style={styles.txMerchant}>{tx.merchant}</Text>
                      <Text style={styles.txMeta}>{tx.time} · {tx.tag}</Text>
                    </View>
                    <View style={styles.txRight}>
                      <Text style={[styles.txAmount, { color: tx.amount > 0 ? colors.textBlue : colors.textPrimary }]}>
                        {formatWon(tx.amount)}
                      </Text>
                      <Text style={styles.txBalance}>{formatWonPlain(tx.balanceAfter)}</Text>
                    </View>
                  </Pressable>
                </Link>
              ))}
            </View>
          ))
        )}
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },

  hero: { paddingHorizontal: 20, paddingBottom: 20 },
  heroHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10 },
  heroTitle: { fontSize: fontSize.md, fontWeight: '600' },
  heroBalance: { fontSize: fontSize.xxl, fontWeight: '800', marginTop: 8, letterSpacing: -0.5 },
  heroNumber: { fontSize: fontSize.xs, marginTop: 4 },

  filterBar: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.white,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.divider,
  },
  filterChip: { paddingHorizontal: 16, paddingVertical: 7, borderRadius: radius.full, backgroundColor: colors.chipBackground },
  filterChipActive: { backgroundColor: colors.textPrimary },
  filterText: { fontSize: fontSize.sm, color: colors.textSecondary, fontWeight: '500' },
  filterTextActive: { color: colors.white, fontWeight: '700' },

  list: { flex: 1, backgroundColor: colors.white },

  dateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 8,
    backgroundColor: colors.background,
  },
  dateHeaderText: { fontSize: fontSize.sm, fontWeight: '700', color: colors.textSecondary },
  dateSumText: { fontSize: fontSize.xs, color: colors.textTertiary },

  txRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: colors.white,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.divider,
  },
  txIconWrap: { marginRight: 12 },
  txInfo: { flex: 1 },
  txMerchant: { fontSize: fontSize.md, color: colors.textPrimary, fontWeight: '500' },
  txMeta: { fontSize: fontSize.xs, color: colors.textTertiary, marginTop: 3 },
  txRight: { alignItems: 'flex-end' },
  txAmount: { fontSize: fontSize.md, fontWeight: '700' },
  txBalance: { fontSize: fontSize.xs, color: colors.textTertiary, marginTop: 3 },

  emptyBox: { alignItems: 'center', paddingTop: 80, gap: 14 },
  emptyText: { fontSize: fontSize.md, color: colors.textTertiary },
});
