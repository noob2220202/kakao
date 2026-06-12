import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, fontSize } from '@/constants/theme';
import { formatWon, transactions } from '@/data/dummy';

// 거래상세 화면 (스크린샷 받으면 상세 구현 예정)
export default function TransactionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const tx = transactions.find((t) => t.id === id) ?? transactions[0];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.tag}>{tx.tag}</Text>
        <Text style={styles.merchant}>{tx.merchant}</Text>

        <View style={styles.section}>
          <Row label="거래시각" value={tx.dateTime} />
          <Row label="거래구분" value={tx.type} />
        </View>

        <View style={styles.section}>
          <Row label="거래금액" value={formatWon(tx.amount)} bold />
          <Row label="거래 후 잔액" value={formatWon(tx.balanceAfter)} />
          {tx.cardInfo && <Row label="카드정보" value={tx.cardInfo} />}
        </View>

        {tx.address && (
          <View style={styles.section}>
            <Row label="사용처" value={tx.merchant} />
            <Row label="주소" value={tx.address} />
            <Row label="전화번호" value="-" />
          </View>
        )}
      </ScrollView>

      <View style={styles.bottomBar}>
        <Pressable style={styles.confirmButton} onPress={() => router.back()}>
          <Text style={styles.confirmText}>확인</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

function Row({
  label,
  value,
  bold,
}: {
  label: string;
  value: string;
  bold?: boolean;
}) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={[styles.rowValue, bold && styles.rowValueBold]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  container: {
    padding: 24,
  },
  tag: {
    fontSize: fontSize.sm,
    color: colors.textBlue,
    marginTop: 40,
  },
  merchant: {
    fontSize: fontSize.xxl,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 8,
    marginBottom: 24,
  },
  section: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.divider,
    paddingVertical: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  rowLabel: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
  },
  rowValue: {
    fontSize: fontSize.md,
    color: colors.textPrimary,
    flexShrink: 1,
    textAlign: 'right',
  },
  rowValueBold: {
    fontWeight: '700',
  },
  bottomBar: {
    padding: 16,
  },
  confirmButton: {
    backgroundColor: colors.kakaoYellow,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  confirmText: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: colors.textPrimary,
  },
});
