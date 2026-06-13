import { Ionicons } from '@expo/vector-icons';
import { Link, router, useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, fontSize, radius } from '@/constants/theme';
import { useAppData } from '@/context/DataContext';
import { formatWon, formatWonPlain } from '@/data/dummy';

const CARD_BG: Record<string, string> = {
  beige: '#B5AD9B',
  yellow: '#FFEB00',
  green: '#3FA45C',
};
const CARD_TEXT: Record<string, string> = {
  beige: '#1A1009',
  yellow: '#1A1009',
  green: '#FFFFFF',
};
const CARD_SUB: Record<string, string> = {
  beige: 'rgba(26,16,9,0.55)',
  yellow: 'rgba(26,16,9,0.55)',
  green: 'rgba(255,255,255,0.65)',
};

export default function AccountDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data } = useAppData();
  const account = data.accounts.find((a) => a.id === id) ?? data.accounts[0];
  const recent = data.transactions.filter((tx) => tx.accountId === account?.id).slice(0, 3);

  if (!account) return null;

  const bg = CARD_BG[account.color] ?? '#B5AD9B';
  const textColor = CARD_TEXT[account.color] ?? '#1A1009';
  const subColor = CARD_SUB[account.color] ?? 'rgba(26,16,9,0.55)';
  const chipBg = account.color === 'green' ? 'rgba(255,255,255,0.22)' : 'rgba(0,0,0,0.12)';

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={StyleSheet.flatten([styles.heroArea, { backgroundColor: bg }])}>
        <View style={styles.heroHeader}>
          <Pressable onPress={() => router.back()} hitSlop={8}>
            <Ionicons name="chevron-back" size={26} color={textColor} />
          </Pressable>
          <Text style={[styles.heroAccountName, { color: textColor }]}>{account.name}</Text>
          <Pressable hitSlop={8}>
            <Ionicons name="ellipsis-horizontal" size={22} color={textColor} />
          </Pressable>
        </View>

        <View style={styles.heroBody}>
          <Text style={[styles.heroBalanceLabel, { color: subColor }]}>잔액</Text>
          <Text style={[styles.heroBalance, { color: textColor }]}>{formatWonPlain(account.balance)}</Text>
          <Text style={[styles.heroAccountNumber, { color: subColor }]}>{account.accountNumber}</Text>
        </View>

        <View style={styles.heroActions}>
          <Link href="/transfer" asChild>
            <Pressable style={StyleSheet.flatten([styles.heroChip, { backgroundColor: chipBg }])}>
              <Text style={[styles.heroChipText, { color: textColor }]}>이체하기</Text>
            </Pressable>
          </Link>
          <Pressable style={StyleSheet.flatten([styles.heroChip, { backgroundColor: chipBg }])}>
            <Text style={[styles.heroChipText, { color: textColor }]}>채우기</Text>
          </Pressable>
          {account.bank === '카카오뱅크' && (
            <Pressable style={StyleSheet.flatten([styles.heroChip, { backgroundColor: chipBg }])}>
              <Text style={[styles.heroChipText, { color: textColor }]}>카드</Text>
            </Pressable>
          )}
        </View>
      </View>

      <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent} showsVerticalScrollIndicator={false}>
        <View style={styles.aiCard}>
          <View style={styles.aiIconWrap}>
            <View style={styles.aiDot} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.aiTitle}>AI 분석</Text>
            <Text style={styles.aiDesc}>이번 달 지출 패턴을 분석해드릴게요</Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color={colors.textTertiary} />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>최근 거래</Text>
            <Link href={`/account/${account.id}/transactions`} asChild>
              <Pressable>
                <Text style={styles.sectionMore}>전체보기</Text>
              </Pressable>
            </Link>
          </View>

          {recent.length === 0 ? (
            <View style={styles.emptyTx}>
              <Text style={styles.emptyTxText}>거래 내역이 없어요</Text>
            </View>
          ) : (
            recent.map((tx) => (
              <Link key={tx.id} href={`/transaction/${tx.id}`} asChild>
                <Pressable style={styles.txRow}>
                  <View style={styles.txIconWrap}>
                    <Ionicons
                      name={tx.amount > 0 ? 'arrow-down-circle-outline' : 'arrow-up-circle-outline'}
                      size={22}
                      color={tx.amount > 0 ? colors.textGreen : colors.textSecondary}
                    />
                  </View>
                  <View style={styles.txInfo}>
                    <Text style={styles.txMerchant}>{tx.merchant}</Text>
                    <Text style={styles.txMeta}>{tx.time} · {tx.tag}</Text>
                  </View>
                  <View style={styles.txAmounts}>
                    <Text style={[styles.txAmount, { color: tx.amount > 0 ? colors.textBlue : colors.textPrimary }]}>
                      {formatWon(tx.amount)}
                    </Text>
                    <Text style={styles.txBalance}>{formatWonPlain(tx.balanceAfter)}</Text>
                  </View>
                </Pressable>
              </Link>
            ))
          )}
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>계좌 정보</Text>
          <InfoRow label="은행" value={account.bank} />
          <InfoRow label="계좌번호" value={account.accountNumber} />
          {account.badge && <InfoRow label="계좌 유형" value={account.badge} />}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  heroArea: { paddingTop: 4, paddingBottom: 24, paddingHorizontal: 20 },
  heroHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10 },
  heroAccountName: { fontSize: fontSize.md, fontWeight: '600' },
  heroBody: { marginTop: 20, marginBottom: 24 },
  heroBalanceLabel: { fontSize: fontSize.sm, marginBottom: 4 },
  heroBalance: { fontSize: 32, fontWeight: '800', letterSpacing: -0.5 },
  heroAccountNumber: { fontSize: fontSize.xs, marginTop: 6 },
  heroActions: { flexDirection: 'row', gap: 10 },
  heroChip: { paddingHorizontal: 18, paddingVertical: 9, borderRadius: radius.full },
  heroChipText: { fontSize: fontSize.sm, fontWeight: '600' },
  body: { flex: 1 },
  bodyContent: { padding: 16, gap: 12, paddingBottom: 40 },
  aiCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: 16,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  aiIconWrap: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#E6F9F0', alignItems: 'center', justifyContent: 'center' },
  aiDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: colors.aiGreen },
  aiTitle: { fontSize: fontSize.sm, fontWeight: '700', color: colors.textPrimary, marginBottom: 2 },
  aiDesc: { fontSize: fontSize.xs, color: colors.textSecondary },
  section: { backgroundColor: colors.white, borderRadius: radius.lg, overflow: 'hidden' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 },
  sectionTitle: { fontSize: fontSize.md, fontWeight: '700', color: colors.textPrimary },
  sectionMore: { fontSize: fontSize.sm, color: colors.textTertiary },
  emptyTx: { paddingVertical: 32, alignItems: 'center' },
  emptyTxText: { fontSize: fontSize.sm, color: colors.textTertiary },
  txRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.divider,
  },
  txIconWrap: { marginRight: 12 },
  txInfo: { flex: 1 },
  txMerchant: { fontSize: fontSize.md, color: colors.textPrimary, fontWeight: '500' },
  txMeta: { fontSize: fontSize.xs, color: colors.textTertiary, marginTop: 3 },
  txAmounts: { alignItems: 'flex-end' },
  txAmount: { fontSize: fontSize.md, fontWeight: '700' },
  txBalance: { fontSize: fontSize.xs, color: colors.textTertiary, marginTop: 3 },
  infoCard: { backgroundColor: colors.white, borderRadius: radius.lg, padding: 16 },
  infoTitle: { fontSize: fontSize.md, fontWeight: '700', color: colors.textPrimary, marginBottom: 12 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.divider },
  infoLabel: { fontSize: fontSize.sm, color: colors.textSecondary },
  infoValue: { fontSize: fontSize.sm, color: colors.textPrimary, fontWeight: '500' },
});
