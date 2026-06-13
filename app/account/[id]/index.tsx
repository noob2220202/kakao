import { Ionicons } from '@expo/vector-icons';
import { Link, router, useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, fontSize } from '@/constants/theme';
import { useAppData } from '@/context/DataContext';
import { formatWon } from '@/data/dummy';

export default function AccountDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data } = useAppData();
  const account = data.accounts.find((a) => a.id === id) ?? data.accounts[0];
  const recentTransactions = data.transactions.filter((tx) => tx.accountId === account?.id).slice(0, 3);

  if (!account) return null;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={28} color={colors.textPrimary} />
      </Pressable>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.balanceCard}>
          <Text style={styles.balance}>{formatWon(account.balance)}</Text>
          <View style={styles.buttonRow}>
            <Link href="/transfer" asChild>
              <Pressable style={styles.actionButton}><Text style={styles.actionButtonText}>이체하기</Text></Pressable>
            </Link>
            <Pressable style={styles.actionButton}><Text style={styles.actionButtonText}>채우기</Text></Pressable>
          </View>
        </View>
        <View style={styles.historyHeader}>
          <Text style={styles.historyTitle}>최근 내역</Text>
          <Link href={`/account/${account.id}/transactions`} asChild>
            <Pressable><Text style={styles.historyAll}>전체보기</Text></Pressable>
          </Link>
        </View>
        {recentTransactions.map((tx) => (
          <Link key={tx.id} href={`/transaction/${tx.id}`} asChild>
            <Pressable style={styles.txRow}>
              <View>
                <Text style={styles.txMerchant}>{tx.merchant}</Text>
                <Text style={styles.txTime}>{tx.time} {tx.tag}</Text>
              </View>
              <View style={styles.txAmounts}>
                <Text style={styles.txAmount}>{formatWon(tx.amount)}</Text>
                <Text style={styles.txBalance}>{formatWon(tx.balanceAfter)}</Text>
              </View>
            </Pressable>
          </Link>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  backButton: { paddingHorizontal: 20, paddingVertical: 12 },
  container: { padding: 20, gap: 16 },
  balanceCard: { backgroundColor: colors.card, borderRadius: 20, padding: 24 },
  balance: { fontSize: fontSize.xxl, fontWeight: '700', color: colors.textPrimary },
  buttonRow: { flexDirection: 'row', gap: 12, marginTop: 20 },
  actionButton: { flex: 1, backgroundColor: colors.chipBackground, borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  actionButtonText: { fontSize: fontSize.md, fontWeight: '600', color: colors.textPrimary },
  historyHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  historyTitle: { fontSize: fontSize.lg, fontWeight: '700', color: colors.textPrimary },
  historyAll: { fontSize: fontSize.sm, color: colors.textTertiary },
  txRow: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: colors.card, borderRadius: 12, padding: 16 },
  txMerchant: { fontSize: fontSize.md, color: colors.textPrimary },
  txTime: { fontSize: fontSize.xs, color: colors.textBlue, marginTop: 4 },
  txAmounts: { alignItems: 'flex-end' },
  txAmount: { fontSize: fontSize.md, fontWeight: '700', color: colors.textPrimary },
  txBalance: { fontSize: fontSize.xs, color: colors.textTertiary, marginTop: 4 },
});
