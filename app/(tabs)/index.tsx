import { Link } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, fontSize } from '@/constants/theme';
import { accounts, formatWon } from '@/data/dummy';

// 홈 화면 — 계좌 목록 (스크린샷 받으면 상세 구현 예정)
export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>이준영</Text>

        {accounts.map((account) => (
          <Link key={account.id} href={`/account/${account.id}`} asChild>
            <Pressable style={styles.accountCard}>
              <Text style={styles.accountName}>{account.name}</Text>
              <Text style={styles.accountBalance}>{formatWon(account.balance)}</Text>
            </Pressable>
          </Link>
        ))}

        <Link href="/transfer" asChild>
          <Pressable style={styles.transferButton}>
            <Text style={styles.transferButtonText}>이체</Text>
          </Pressable>
        </Link>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    padding: 20,
    gap: 12,
  },
  title: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  accountCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
  },
  accountName: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  accountBalance: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 4,
  },
  transferButton: {
    backgroundColor: colors.kakaoYellow,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  transferButtonText: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.textPrimary,
  },
});
