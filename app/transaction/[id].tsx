import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, fontSize, radius } from '@/constants/theme';
import { useAppData } from '@/context/DataContext';
import { formatWon, formatWonPlain } from '@/data/dummy';

export default function TransactionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data } = useAppData();
  const tx = data.transactions.find((t) => t.id === id) ?? data.transactions[0];
  const [memoVisible, setMemoVisible] = useState(false);
  const [memo, setMemo] = useState('');
  const [savedMemo, setSavedMemo] = useState('');
  const [splitVisible, setSplitVisible] = useState(false);

  if (!tx) return null;

  const isIncome = tx.amount > 0;
  const amountColor = isIncome ? colors.textBlue : colors.textRed;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      {/* 헤더 */}
      <View style={styles.navBar}>
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="chevron-back" size={26} color={colors.textPrimary} />
        </Pressable>
        <Text style={styles.navTitle}>거래 상세</Text>
        <Pressable hitSlop={8}>
          <Ionicons name="share-outline" size={22} color={colors.textPrimary} />
        </Pressable>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* 상단 요약 */}
        <View style={styles.summary}>
          <View style={styles.tagRow}>
            <View style={[styles.tagPill, { backgroundColor: isIncome ? '#E8F4FF' : '#FFF0F0' }]}>
              <Text style={[styles.tagText, { color: isIncome ? colors.textBlue : colors.textRed }]}>
                {tx.tag}
              </Text>
            </View>
          </View>
          <Text style={styles.merchantName}>{tx.merchant}</Text>
          <Text style={[styles.amountLarge, { color: amountColor }]}>
            {formatWon(tx.amount)}
          </Text>
          <Text style={styles.dateTime}>{tx.dateTime}</Text>
        </View>

        {/* 거래 정보 */}
        <View style={styles.card}>
          <DetailRow label="거래 구분" value={tx.type} />
          <DetailRow label="거래시각" value={tx.dateTime} />
          <DetailRow label="거래금액" value={formatWon(tx.amount)} bold valueColor={amountColor} />
          <DetailRow label="거래 후 잔액" value={formatWonPlain(tx.balanceAfter)} />
          {tx.cardInfo && <DetailRow label="카드 정보" value={tx.cardInfo} />}
        </View>

        {/* 사용처 */}
        {tx.address && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>사용처</Text>
            <DetailRow label="가맹점" value={tx.merchant} />
            <DetailRow label="주소" value={tx.address} />
            <DetailRow label="전화번호" value="-" />
          </View>
        )}

        {/* 메모 */}
        <Pressable style={styles.memoRow} onPress={() => setMemoVisible(true)}>
          <View style={styles.memoLeft}>
            <Ionicons name="create-outline" size={18} color={colors.textSecondary} />
            <Text style={styles.memoLabel}>{savedMemo ? savedMemo : '메모 추가'}</Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color={colors.textTertiary} />
        </Pressable>

        {/* 1/N 분할 */}
        <Pressable style={styles.splitRow} onPress={() => setSplitVisible(true)}>
          <View style={styles.splitLeft}>
            <Ionicons name="people-outline" size={18} color={colors.textSecondary} />
            <Text style={styles.splitLabel}>1/N 정산하기</Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color={colors.textTertiary} />
        </Pressable>
      </ScrollView>

      {/* 하단 버튼 */}
      <View style={styles.bottomBar}>
        <Pressable style={styles.bottomBtnOutline} onPress={() => Alert.alert('채우기', '이 기능은 준비 중입니다.')}>
          <Text style={styles.bottomBtnOutlineText}>채우기</Text>
        </Pressable>
        <Pressable style={styles.bottomBtnFill} onPress={() => router.back()}>
          <Text style={styles.bottomBtnFillText}>확인</Text>
        </Pressable>
      </View>

      {/* 메모 모달 */}
      <Modal visible={memoVisible} transparent animationType="slide" onRequestClose={() => setMemoVisible(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setMemoVisible(false)} />
        <View style={styles.memoSheet}>
          <Text style={styles.memoSheetTitle}>메모</Text>
          <TextInput
            style={styles.memoInput}
            value={memo}
            onChangeText={setMemo}
            placeholder="메모를 입력해 주세요"
            placeholderTextColor={colors.textTertiary}
            multiline
            autoFocus
          />
          <View style={styles.memoButtons}>
            <Pressable style={styles.memoCancelBtn} onPress={() => setMemoVisible(false)}>
              <Text style={styles.memoCancelText}>취소</Text>
            </Pressable>
            <Pressable style={styles.memoSaveBtn} onPress={() => { setSavedMemo(memo); setMemoVisible(false); }}>
              <Text style={styles.memoSaveText}>저장</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* 1/N 모달 */}
      <Modal visible={splitVisible} transparent animationType="slide" onRequestClose={() => setSplitVisible(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setSplitVisible(false)} />
        <View style={styles.splitSheet}>
          <Text style={styles.memoSheetTitle}>1/N 정산</Text>
          <Text style={styles.splitAmount}>{formatWonPlain(Math.abs(tx.amount))}</Text>
          <View style={styles.splitPersonRow}>
            {[2, 3, 4, 5].map((n) => (
              <Pressable
                key={n}
                style={styles.splitPersonChip}
                onPress={() =>
                  Alert.alert(
                    `${n}명`,
                    `1인당 ${Math.ceil(Math.abs(tx.amount) / n).toLocaleString('ko-KR')}원`,
                  )
                }
              >
                <Text style={styles.splitPersonText}>{n}명</Text>
                <Text style={styles.splitPersonAmt}>{Math.ceil(Math.abs(tx.amount) / n).toLocaleString('ko-KR')}원</Text>
              </Pressable>
            ))}
          </View>
          <Pressable style={styles.splitCloseBtn} onPress={() => setSplitVisible(false)}>
            <Text style={styles.splitCloseBtnText}>닫기</Text>
          </Pressable>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

function DetailRow({
  label,
  value,
  bold,
  valueColor,
}: {
  label: string;
  value: string;
  bold?: boolean;
  valueColor?: string;
}) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={[styles.detailValue, bold && styles.detailValueBold, valueColor ? { color: valueColor } : {}]}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.white },

  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.divider,
  },
  navTitle: { fontSize: fontSize.md, fontWeight: '700', color: colors.textPrimary },

  scroll: { flex: 1 },

  summary: { paddingHorizontal: 24, paddingTop: 24, paddingBottom: 20 },
  tagRow: { marginBottom: 10 },
  tagPill: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: radius.full },
  tagText: { fontSize: fontSize.xs, fontWeight: '700' },
  merchantName: { fontSize: fontSize.xxl, fontWeight: '800', color: colors.textPrimary, marginBottom: 8, letterSpacing: -0.5 },
  amountLarge: { fontSize: 28, fontWeight: '800', letterSpacing: -0.5, marginBottom: 6 },
  dateTime: { fontSize: fontSize.xs, color: colors.textTertiary },

  card: {
    marginHorizontal: 16,
    marginBottom: 10,
    backgroundColor: colors.background,
    borderRadius: radius.lg,
    padding: 16,
  },
  cardTitle: { fontSize: fontSize.sm, fontWeight: '700', color: colors.textSecondary, marginBottom: 10 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 11, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.divider },
  detailLabel: { fontSize: fontSize.sm, color: colors.textSecondary },
  detailValue: { fontSize: fontSize.sm, color: colors.textPrimary, maxWidth: '60%', textAlign: 'right' },
  detailValueBold: { fontWeight: '700' },

  memoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginBottom: 8,
    backgroundColor: colors.background,
    borderRadius: radius.lg,
    padding: 16,
  },
  memoLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  memoLabel: { fontSize: fontSize.sm, color: colors.textSecondary },

  splitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginBottom: 24,
    backgroundColor: colors.background,
    borderRadius: radius.lg,
    padding: 16,
  },
  splitLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  splitLabel: { fontSize: fontSize.sm, color: colors.textSecondary },

  bottomBar: { flexDirection: 'row', gap: 10, padding: 16, paddingBottom: 8 },
  bottomBtnOutline: {
    flex: 1,
    backgroundColor: colors.chipBackground,
    borderRadius: radius.lg,
    paddingVertical: 16,
    alignItems: 'center',
  },
  bottomBtnOutlineText: { fontSize: fontSize.md, fontWeight: '600', color: colors.textPrimary },
  bottomBtnFill: {
    flex: 2,
    backgroundColor: colors.kakaoYellow,
    borderRadius: radius.lg,
    paddingVertical: 16,
    alignItems: 'center',
  },
  bottomBtnFillText: { fontSize: fontSize.md, fontWeight: '700', color: colors.textPrimary },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)' },
  memoSheet: { backgroundColor: colors.white, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24 },
  memoSheetTitle: { fontSize: fontSize.lg, fontWeight: '700', color: colors.textPrimary, marginBottom: 16 },
  memoInput: {
    backgroundColor: colors.chipBackground,
    borderRadius: radius.md,
    padding: 14,
    fontSize: fontSize.md,
    color: colors.textPrimary,
    minHeight: 80,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  memoButtons: { flexDirection: 'row', gap: 10 },
  memoCancelBtn: { flex: 1, backgroundColor: colors.chipBackground, borderRadius: radius.md, paddingVertical: 14, alignItems: 'center' },
  memoCancelText: { fontSize: fontSize.md, fontWeight: '600', color: colors.textSecondary },
  memoSaveBtn: { flex: 2, backgroundColor: colors.kakaoYellow, borderRadius: radius.md, paddingVertical: 14, alignItems: 'center' },
  memoSaveText: { fontSize: fontSize.md, fontWeight: '700', color: colors.textPrimary },

  splitSheet: { backgroundColor: colors.white, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24 },
  splitAmount: { fontSize: 26, fontWeight: '800', color: colors.textPrimary, textAlign: 'center', marginBottom: 20 },
  splitPersonRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  splitPersonChip: { flex: 1, alignItems: 'center', backgroundColor: colors.chipBackground, borderRadius: radius.md, padding: 12, marginHorizontal: 4 },
  splitPersonText: { fontSize: fontSize.sm, fontWeight: '600', color: colors.textPrimary },
  splitPersonAmt: { fontSize: fontSize.xs, color: colors.textSecondary, marginTop: 4 },
  splitCloseBtn: { backgroundColor: colors.kakaoYellow, borderRadius: radius.md, paddingVertical: 14, alignItems: 'center' },
  splitCloseBtnText: { fontSize: fontSize.md, fontWeight: '700', color: colors.textPrimary },
});
