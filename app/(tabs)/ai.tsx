import { Ionicons } from '@expo/vector-icons';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, fontSize, radius } from '@/constants/theme';
import { useAppData } from '@/context/DataContext';
import { formatWonPlain } from '@/data/dummy';

const SAVINGS_PRODUCTS = [
  { emoji: '🐷', title: '저금통', desc: '목표를 정해 매일 조금씩', bg: '#FFF7E8' },
  { emoji: '🔒', title: '세이프박스', desc: '통장 속 나만의 금고', bg: '#EBF4FF' },
  { emoji: '📊', title: '정기예금', desc: '연 최대 3.80%', bg: '#F0FFF7', rate: '연 3.80%' },
  { emoji: '🌱', title: '자유적금', desc: '연 최대 4.00%', bg: '#F5F0FF', rate: '연 4.00%' },
] as const;

const LOAN_ITEMS = [
  { icon: 'person-outline' as const, title: '신용대출', desc: '최저 연 4.10% · 한도 최대 3억' },
  { icon: 'home-outline' as const, title: '전월세 보증금대출', desc: '최저 연 3.50%' },
  { icon: 'calculator-outline' as const, title: '마이너스통장', desc: '한도 최대 5,000만원' },
];

export default function BankingScreen() {
  const { data } = useAppData();
  const totalBalance = data.accounts.reduce((sum, a) => sum + a.balance, 0);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>뱅킹</Text>
          <Pressable hitSlop={8}>
            <Ionicons name="search-outline" size={22} color={colors.textPrimary} />
          </Pressable>
        </View>

        {/* 총 자산 */}
        <View style={styles.assetCard}>
          <Text style={styles.assetLabel}>총 자산</Text>
          <Text style={styles.assetAmount}>{formatWonPlain(totalBalance)}</Text>
          <View style={styles.assetDivider} />
          <View style={styles.assetRow}>
            {data.accounts.map((a) => (
              <View key={a.id} style={styles.assetItem}>
                <Text style={styles.assetItemName} numberOfLines={1}>{a.name}</Text>
                <Text style={styles.assetItemAmount}>{formatWonPlain(a.balance)}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* 금융 상품 */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>금융 상품</Text>
          <Pressable><Text style={styles.sectionMore}>전체보기</Text></Pressable>
        </View>
        <View style={styles.productGrid}>
          {SAVINGS_PRODUCTS.map((p) => (
            <Pressable key={p.title} style={[styles.productCard, { backgroundColor: p.bg }]}>
              <Text style={styles.productEmoji}>{p.emoji}</Text>
              <Text style={styles.productTitle}>{p.title}</Text>
              <Text style={styles.productDesc}>{p.desc}</Text>
              {'rate' in p && p.rate ? (
                <View style={styles.ratePill}>
                  <Text style={styles.rateText}>{p.rate}</Text>
                </View>
              ) : null}
            </Pressable>
          ))}
        </View>

        {/* 대출 */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>대출</Text>
          <Pressable><Text style={styles.sectionMore}>전체보기</Text></Pressable>
        </View>
        <View style={styles.loanCard}>
          {LOAN_ITEMS.map((item, i) => (
            <Pressable key={item.title} style={[styles.loanRow, i > 0 && styles.loanRowBorder]}>
              <View style={styles.loanIconWrap}>
                <Ionicons name={item.icon} size={20} color={colors.textSecondary} />
              </View>
              <View style={styles.loanInfo}>
                <Text style={styles.loanTitle}>{item.title}</Text>
                <Text style={styles.loanDesc}>{item.desc}</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={colors.textTertiary} />
            </Pressable>
          ))}
        </View>

        {/* 오픈뱅킹 */}
        <Pressable style={styles.openBankingBanner}>
          <View style={styles.openBankingIcon}>
            <Ionicons name="link-outline" size={20} color={colors.textSecondary} />
          </View>
          <View style={styles.openBankingText}>
            <Text style={styles.openBankingTitle}>오픈뱅킹 연결하기</Text>
            <Text style={styles.openBankingDesc}>다른 은행 계좌를 한곳에서 관리해요</Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color={colors.textTertiary} />
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  content: { paddingBottom: 40 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 10,
  },
  headerTitle: { fontSize: fontSize.xl, fontWeight: '700', color: colors.textPrimary },

  assetCard: {
    backgroundColor: colors.white,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: radius.xl,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  assetLabel: { fontSize: fontSize.sm, color: colors.textSecondary, marginBottom: 4 },
  assetAmount: { fontSize: 28, fontWeight: '800', color: colors.textPrimary, letterSpacing: -0.5 },
  assetDivider: { height: StyleSheet.hairlineWidth, backgroundColor: colors.divider, marginVertical: 14 },
  assetRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  assetItem: { minWidth: '28%' },
  assetItemName: { fontSize: fontSize.xs, color: colors.textTertiary, marginBottom: 3 },
  assetItemAmount: { fontSize: fontSize.sm, fontWeight: '600', color: colors.textPrimary },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  sectionTitle: { fontSize: fontSize.md, fontWeight: '700', color: colors.textPrimary },
  sectionMore: { fontSize: fontSize.sm, color: colors.textTertiary },

  productGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16, gap: 10 },
  productCard: { width: '47.5%', borderRadius: radius.lg, padding: 16 },
  productEmoji: { fontSize: 26, marginBottom: 10 },
  productTitle: { fontSize: fontSize.md, fontWeight: '700', color: colors.textPrimary, marginBottom: 3 },
  productDesc: { fontSize: fontSize.xs, color: colors.textSecondary },
  ratePill: {
    marginTop: 10,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(0,0,0,0.07)',
    borderRadius: radius.full,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  rateText: { fontSize: 10, fontWeight: '700', color: colors.textPrimary },

  loanCard: {
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
  loanRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14 },
  loanRowBorder: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.divider },
  loanIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.chipBackground,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  loanInfo: { flex: 1 },
  loanTitle: { fontSize: fontSize.md, fontWeight: '600', color: colors.textPrimary },
  loanDesc: { fontSize: fontSize.xs, color: colors.textTertiary, marginTop: 2 },

  openBankingBanner: {
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
  openBankingIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.chipBackground,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  openBankingText: { flex: 1 },
  openBankingTitle: { fontSize: fontSize.md, fontWeight: '600', color: colors.textPrimary, marginBottom: 2 },
  openBankingDesc: { fontSize: fontSize.xs, color: colors.textSecondary },
});
