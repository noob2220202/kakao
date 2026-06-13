import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, fontSize } from '@/constants/theme';
import { useAppData } from '@/context/DataContext';

export default function TransferScreen() {
  const { data } = useAppData();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={28} color={colors.textPrimary} />
      </Pressable>

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>이체</Text>

        <Text style={styles.sectionTitle}>내 계좌</Text>
        {data.myAccounts.map((account) => (
          <View key={account.id} style={styles.recipientRow}>
            <Text style={styles.recipientName}>{account.name}</Text>
            <Text style={styles.recipientAccount}>{account.bank} {account.accountNumber}</Text>
          </View>
        ))}

        <Text style={styles.sectionTitle}>최근 이체</Text>
        {data.recentRecipients.map((recipient) => (
          <View key={recipient.id} style={styles.recipientRow}>
            <Text style={styles.recipientName}>{recipient.name}</Text>
            <Text style={styles.recipientAccount}>{recipient.bank} {recipient.accountNumber}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.white },
  backButton: { paddingHorizontal: 20, paddingVertical: 12 },
  container: { paddingHorizontal: 20, paddingBottom: 40 },
  title: { fontSize: fontSize.xxl, fontWeight: '700', color: colors.textPrimary, marginBottom: 24 },
  sectionTitle: { fontSize: fontSize.md, fontWeight: '700', color: colors.textPrimary, marginTop: 24, marginBottom: 12 },
  recipientRow: { paddingVertical: 12 },
  recipientName: { fontSize: fontSize.md, color: colors.textPrimary },
  recipientAccount: { fontSize: fontSize.sm, color: colors.textTertiary, marginTop: 2 },
});
