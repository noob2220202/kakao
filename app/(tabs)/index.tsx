import { Link } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AdminPanel from '@/components/AdminPanel';
import { colors, fontSize } from '@/constants/theme';
import { useAppData } from '@/context/DataContext';
import { formatWon } from '@/data/dummy';

// 홈 화면 — 이름을 5번 빠르게 탭하면 관리자 패널 오픈
export default function HomeScreen() {
  const { data } = useAppData();
  const [adminVisible, setAdminVisible] = useState(false);

  const tapCount = useRef(0);
  const tapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleNameTap = useCallback(() => {
    tapCount.current += 1;
    if (tapTimer.current) clearTimeout(tapTimer.current);
    if (tapCount.current >= 5) {
      tapCount.current = 0;
      setAdminVisible(true);
      return;
    }
    tapTimer.current = setTimeout(() => {
      tapCount.current = 0;
    }, 1500);
  }, []);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView contentContainerStyle={styles.container}>
        <Pressable onPress={handleNameTap}>
          <Text style={styles.title}>{data.userName}</Text>
        </Pressable>

        {data.accounts.map((account) => (
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

      <AdminPanel visible={adminVisible} onClose={() => setAdminVisible(false)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  container: { padding: 20, gap: 12 },
  title: { fontSize: fontSize.xl, fontWeight: '700', color: colors.textPrimary, marginBottom: 8 },
  accountCard: { backgroundColor: colors.card, borderRadius: 16, padding: 20 },
  accountName: { fontSize: fontSize.sm, color: colors.textSecondary },
  accountBalance: { fontSize: fontSize.lg, fontWeight: '700', color: colors.textPrimary, marginTop: 4 },
  transferButton: { backgroundColor: colors.kakaoYellow, borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 8 },
  transferButtonText: { fontSize: fontSize.md, fontWeight: '600', color: colors.textPrimary },
});
