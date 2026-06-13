import { Ionicons } from '@expo/vector-icons';
import { Link, router, useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, fontSize } from '@/constants/theme';
import { useAppData } from '@/context/DataContext';
import { formatWon } from '@/data/dummy';

export default function TransactionsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data } = useAppData();
  const account = data.accounts.find((a) => a.id === id) ?? data.accounts[0];
  const accountTransactions = data.transactions.filter((tx) => tx.accountId === account?.id);

  if (!account) return null;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={28} color={colors.textPrimary} />
      </Pressable>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.balance}>{formatWon(account.balance)}</Text>
        {accountTransactions.map((tx) => (
          <Link key={tx.id} href={`/transaction/${tx.id}`} asChild>
            <Pressable style={styles.txRow}>
              <View>
                <Text style={styles.txMerchant}>{tx.merchant}</Text>
                <Text style={styles.txTime}>{tx.time} {tx.tag}</Text>
              </View>
              <View style={styles.txAmounts}>
                <Text style={[styles.txAmount, tx.amount > 0 && styles.txAmountPlus]}>{formatWon(tx.amount)}</Text>
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
  safeArea: { flex: 1, backgroundColor: colors.white },
  backButton: { paddingHorizontal: 20, paddingVertical: 12 },
  container: { paddingHorizontal: 20, paddingBottom: 40 },
  balance: { fontSize: fontSize.xxl, fontWeight: '700', color: colors.textPrimary, textAlign: 'center', marginVertical: 32 },
  txRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 16, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.divider },
  txMerchant: { fontSize: fontSize.md, color: colors.textPrimary },
  txTime: { fontSize: fontSize.xs, color: colors.textBlue, marginTop: 4 },
  txAmounts: { alignItems: 'flex-end' },
  txAmount: { fontSize: fontSize.md, fontWeight: '700', color: colors.textPrimary },
  txAmountPlus: { color: colors.textBlue },
  txBalance: { fontSize: fontSize.xs, color: colors.textTertiary, marginTop: 4 },
});
