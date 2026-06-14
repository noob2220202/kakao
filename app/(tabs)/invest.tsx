import { Ionicons } from '@expo/vector-icons';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, fontSize, radius } from '@/constants/theme';
import { useAppData } from '@/context/DataContext';

const MONTH_USAGE = 142800;
const MONTH_CASHBACK = 4284;

const CARD_BENEFITS = [
  { emoji: '🛒', title: '마트·편의점', desc: '결제금액의 0.2% 캐시백' },
  { emoji: '🍽️', title: '음식점·카페', desc: '결제금액의 0.2% 캐시백' },
  { emoji: '🚇', title: '대중교통', desc: '결제금액의 0.2% 캐시백' },
];

const CARD_COLORS: Record<string, string> = {
  beige: '#B5AD9B',
  yellow: '#FFEB00',
  green: '#3FA45C',
};
const CARD_TEXT: Record<string, string> = {
  beige: '#1A1009',
  yellow: '#1A1009',
  green: '#FFFFFF',
};

export default function CardScreen() {
  const { data } = useAppData();
  const kakaoAccounts = data.accounts.filter((a) => a.bank === '카카오뱅크');

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>카드</Text>
        </View>

        {/* 카카오뱅크 카드 목록 */}
        {kakaoAccounts.map((account) => {
          const bg = CARD_COLORS[account.color] ?? '#B5AD9B';
          const textColor = CARD_TEXT[account.color] ?? '#1A1009';
          const subColor = account.color === 'green' ? 'rgba(255,255,255,0.65)' : 'rgba(26,16,9,0.55)';
          return (
            <View key={account.id} style={styles.cardPanel}>
              {/* 카드 시각화 */}
              <View style={[styles.virtualCard, { backgroundColor: bg }]}>
                <View style={styles.vcTop}>
                  <Text style={[styles.vcBank, { color: textColor }]}>kakaobank</Text>
                  <View style={[styles.vcChip, { borderColor: account.color === 'green' ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.2)' }]}>
                    <View style={[styles.vcChipInner, { backgroundColor: account.color === 'green' ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.15)' }]} />
                  </View>
                </View>
                <View style={styles.vcBottom}>
                  <Text style={[styles.vcName, { color: textColor }]}>{account.name}</Text>
                  <Text style={[styles.vcNumber, { color: subColor }]}>
                    {account.accountNumber.replace(/\d(?=\d{4})/g, '*').slice(-9)}
                  </Text>
                </View>
              </View>

              {/* 이용 정보 */}
              <View style={styles.cardInfoRow}>
                <View style={styles.cardInfoItem}>
                  <Text style={styles.cardInfoLabel}>이번 달 이용금액</Text>
                  <Text style={styles.cardInfoValue}>{MONTH_USAGE.toLocaleString('ko-KR')}원</Text>
                </View>
                <View style={styles.cardInfoDivider} />
                <View style={styles.cardInfoItem}>
                  <Text style={styles.cardInfoLabel}>캐시백 적립</Text>
                  <Text style={[styles.cardInfoValue, { color: colors.textGreen }]}>
                    +{MONTH_CASHBACK.toLocaleString('ko-KR')}원
                  </Text>
                </View>
              </View>
            </View>
          );
        })}

        {/* 카드 발급 */}
        <Pressable style={styles.issueBtn}>
          <Ionicons name="add-circle-outline" size={20} color={colors.textSecondary} />
          <Text style={styles.issueBtnText}>카드 신청하기</Text>
        </Pressable>

        {/* 혜택 안내 */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>프렌즈 체크카드 혜택</Text>
        </View>
        <View style={styles.benefitsCard}>
          <View style={styles.benefitsTop}>
            <Text style={styles.benefitsTopLabel}>월 최대 캐시백</Text>
            <Text style={styles.benefitsTopAmount}>10,000원</Text>
          </View>
          {CARD_BENEFITS.map((b, i) => (
            <View key={b.title} style={[styles.benefitRow, i > 0 && styles.benefitRowBorder]}>
              <Text style={styles.benefitEmoji}>{b.emoji}</Text>
              <View style={styles.benefitInfo}>
                <Text style={styles.benefitTitle}>{b.title}</Text>
                <Text style={styles.benefitDesc}>{b.desc}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* 카드 분실 신고 */}
        <Pressable style={styles.lostBtn}>
          <Ionicons name="alert-circle-outline" size={18} color={colors.textSecondary} style={{ marginRight: 8 }} />
          <Text style={styles.lostBtnText}>카드 분실·도난 신고</Text>
          <Ionicons name="chevron-forward" size={16} color={colors.textTertiary} style={{ marginLeft: 'auto' }} />
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  content: { paddingBottom: 40 },

  header: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 10 },
  headerTitle: { fontSize: fontSize.xl, fontWeight: '700', color: colors.textPrimary },

  cardPanel: {
    backgroundColor: colors.white,
    marginHorizontal: 16,
    marginBottom: 10,
    borderRadius: radius.xl,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 2,
  },
  virtualCard: { height: 170, padding: 22, justifyContent: 'space-between' },
  vcTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  vcBank: { fontSize: 15, fontWeight: '700', letterSpacing: 0.3 },
  vcChip: { width: 38, height: 28, borderRadius: 5, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  vcChipInner: { width: 22, height: 16, borderRadius: 3 },
  vcBottom: {},
  vcName: { fontSize: 14, fontWeight: '600', marginBottom: 4 },
  vcNumber: { fontSize: 12, letterSpacing: 1 },

  cardInfoRow: { flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 14 },
  cardInfoItem: { flex: 1 },
  cardInfoDivider: { width: StyleSheet.hairlineWidth, backgroundColor: colors.divider, marginHorizontal: 16 },
  cardInfoLabel: { fontSize: fontSize.xs, color: colors.textTertiary, marginBottom: 4 },
  cardInfoValue: { fontSize: fontSize.md, fontWeight: '700', color: colors.textPrimary },

  issueBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginHorizontal: 16,
    marginBottom: 10,
    paddingVertical: 14,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.divider,
    backgroundColor: colors.white,
  },
  issueBtnText: { fontSize: fontSize.sm, color: colors.textSecondary, fontWeight: '500' },

  sectionHeader: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 10 },
  sectionTitle: { fontSize: fontSize.md, fontWeight: '700', color: colors.textPrimary },

  benefitsCard: {
    backgroundColor: colors.white,
    marginHorizontal: 16,
    borderRadius: radius.xl,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  benefitsTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#FFFDE7',
  },
  benefitsTopLabel: { fontSize: fontSize.sm, color: '#7A6500', fontWeight: '600' },
  benefitsTopAmount: { fontSize: fontSize.md, fontWeight: '800', color: '#5A4A00' },
  benefitRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 13 },
  benefitRowBorder: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.divider },
  benefitEmoji: { fontSize: 22, width: 34, textAlign: 'center', marginRight: 12 },
  benefitInfo: {},
  benefitTitle: { fontSize: fontSize.sm, fontWeight: '600', color: colors.textPrimary },
  benefitDesc: { fontSize: fontSize.xs, color: colors.textTertiary, marginTop: 2 },

  lostBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: radius.xl,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  lostBtnText: { fontSize: fontSize.sm, color: colors.textSecondary },
});
