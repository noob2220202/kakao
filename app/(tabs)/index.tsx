import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AdminPanel from '@/components/AdminPanel';
import { colors, fontSize, radius } from '@/constants/theme';
import { useAppData } from '@/context/DataContext';
import { formatWonPlain } from '@/data/dummy';
import type { Account } from '@/data/dummy';

const CARD_THEME = {
  beige: {
    bg: '#B5AD9B',
    text: '#1A1009',
    sub: 'rgba(26,16,9,0.55)',
    chip: 'rgba(0,0,0,0.12)',
    chipText: '#1A1009',
    avatarBg: '#3D2716',
    avatarText: '#FFFFFF',
  },
  yellow: {
    bg: '#FFEB00',
    text: '#1A1009',
    sub: 'rgba(26,16,9,0.55)',
    chip: 'rgba(0,0,0,0.12)',
    chipText: '#1A1009',
    avatarBg: '#665900',
    avatarText: '#FFEB00',
  },
  green: {
    bg: '#3FA45C',
    text: '#FFFFFF',
    sub: 'rgba(255,255,255,0.65)',
    chip: 'rgba(255,255,255,0.22)',
    chipText: '#FFFFFF',
    avatarBg: 'rgba(255,255,255,0.25)',
    avatarText: '#FFFFFF',
  },
};

function AccountCard({ account }: { account: Account }) {
  const theme = CARD_THEME[account.color];
  const isKakao = account.bank === '카카오뱅크';
  const isEmoji = account.avatarText && /\p{Emoji}/u.test(account.avatarText);

  return (
    <Link href={`/account/${account.id}`} asChild>
      <Pressable style={StyleSheet.flatten([styles.accountCard, { backgroundColor: theme.bg }])}>
        <View style={styles.cardHeader}>
          <View style={styles.cardTitleRow}>
            {account.avatarText ? (
              <View style={[styles.avatarCircle, { backgroundColor: isEmoji ? 'transparent' : theme.avatarBg }]}>
                <Text style={[styles.avatarText, { color: theme.avatarText, fontSize: isEmoji ? 20 : account.avatarText.length > 1 ? 12 : 16 }]}>
                  {account.avatarText}
                </Text>
              </View>
            ) : null}
            <View style={{ flex: 1 }}>
              <View style={styles.nameRow}>
                <Text style={[styles.cardName, { color: theme.text }]} numberOfLines={1}>{account.name}</Text>
                {account.badge ? (
                  <View style={styles.badgePill}>
                    <Text style={styles.badgeText}>{account.badge}</Text>
                  </View>
                ) : null}
              </View>
              {!isKakao && (
                <Text style={[styles.cardBankLabel, { color: theme.sub }]}>{account.bank}</Text>
              )}
            </View>
          </View>
          <Pressable hitSlop={10} style={styles.starBtn}>
            <Ionicons name="star-outline" size={18} color={theme.text} />
          </Pressable>
        </View>

        <Text style={[styles.cardBalance, { color: theme.text }]}>{formatWonPlain(account.balance)}</Text>
        <Text style={[styles.cardNumber, { color: theme.sub }]}>{account.accountNumber}</Text>

        <View style={styles.chipRow}>
          {isKakao && (
            <View style={[styles.chip, { backgroundColor: theme.chip }]}>
              <Text style={[styles.chipText, { color: theme.chipText }]}>카드</Text>
            </View>
          )}
          <View style={[styles.chip, { backgroundColor: theme.chip }]}>
            <Text style={[styles.chipText, { color: theme.chipText }]}>이체</Text>
          </View>
        </View>
      </Pressable>
    </Link>
  );
}

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
    tapTimer.current = setTimeout(() => { tapCount.current = 0; }, 1500);
  }, []);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Pressable onPress={handleNameTap} hitSlop={8}>
            <Text style={styles.userName}>{data.userName}</Text>
          </Pressable>
          <View style={styles.headerIcons}>
            <Pressable style={styles.iconBtn}>
              <Ionicons name="chatbubble-ellipses-outline" size={22} color={colors.textPrimary} />
            </Pressable>
            <Pressable style={styles.iconBtn}>
              <Ionicons name="notifications-outline" size={22} color={colors.textPrimary} />
            </Pressable>
          </View>
        </View>

        <Pressable style={styles.aiBanner}>
          <View style={styles.aiLeft}>
            <View style={styles.aiDot} />
            <Text style={styles.aiBannerText}>이번 달 소비 분석이 준비됐어요</Text>
          </View>
          <Ionicons name="chevron-forward" size={15} color={colors.textTertiary} />
        </Pressable>

        {data.accounts.map((account) => (
          <AccountCard key={account.id} account={account} />
        ))}

        <View style={styles.tmoneyCard}>
          <View style={styles.tmoneyLeft}>
            <View style={styles.tmoneyCircle}>
              <Text style={styles.tmoneyT}>T</Text>
            </View>
            <View>
              <Text style={styles.tmoneyTitle}>교통카드 T머니</Text>
              <Text style={styles.tmoneyDesc}>잔액 조회 후 충전 가능</Text>
            </View>
          </View>
          <View style={styles.tmoneyChips}>
            <Pressable style={styles.tmoneyChip}>
              <Text style={styles.tmoneyChipText}>조회</Text>
            </Pressable>
            <Pressable style={styles.tmoneyChip}>
              <Text style={styles.tmoneyChipText}>충전</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.quickCard}>
          <Pressable style={styles.quickItem}>
            <Ionicons name="id-card-outline" size={20} color={colors.textPrimary} />
            <Text style={styles.quickLabel}>모바일 신분증</Text>
          </Pressable>
          <View style={styles.quickDivider} />
          <Pressable style={styles.quickItem}>
            <Ionicons name="wallet-outline" size={20} color={colors.textPrimary} />
            <Text style={styles.quickLabel}>내 계좌</Text>
          </Pressable>
          <View style={styles.quickDivider} />
          <Pressable style={StyleSheet.flatten([styles.quickItem, { flex: 1.4 }])}>
            <Text style={styles.quickLabel}>전체 서비스 보기</Text>
            <Ionicons name="chevron-forward" size={14} color={colors.textTertiary} />
          </Pressable>
        </View>

        <Link href="/transfer" asChild>
          <Pressable style={styles.transferBtn}>
            <Ionicons name="swap-horizontal-outline" size={18} color={colors.textPrimary} style={{ marginRight: 6 }} />
            <Text style={styles.transferBtnText}>이체하기</Text>
          </Pressable>
        </Link>

        <View style={styles.promoBanner}>
          <View style={styles.promoBannerLeft}>
            <Text style={styles.promoTag}>혜택</Text>
            <Text style={styles.promoTitle}>프렌즈 체크카드 캐시백</Text>
            <Text style={styles.promoDesc}>이번 달 최대 3% 캐시백 받아보세요</Text>
          </View>
          <View style={styles.promoEmoji}>
            <Text style={{ fontSize: 36 }}>💳</Text>
          </View>
        </View>
      </ScrollView>

      <AdminPanel visible={adminVisible} onClose={() => setAdminVisible(false)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  scrollContent: { paddingBottom: 32 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 10,
  },
  userName: { fontSize: fontSize.xl, fontWeight: '700', color: colors.textPrimary },
  headerIcons: { flexDirection: 'row', gap: 4 },
  iconBtn: { padding: 8 },
  aiBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    marginHorizontal: 16,
    marginBottom: 10,
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderRadius: radius.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  aiLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  aiDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.aiGreen },
  aiBannerText: { fontSize: fontSize.sm, color: colors.textPrimary, fontWeight: '500' },
  accountCard: {
    marginHorizontal: 16,
    marginBottom: 10,
    borderRadius: radius.xl,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 },
  cardTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  avatarCircle: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontWeight: '700' },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' },
  cardName: { fontSize: fontSize.md, fontWeight: '600' },
  cardBankLabel: { fontSize: fontSize.xs, marginTop: 2 },
  badgePill: { backgroundColor: 'rgba(0,0,0,0.55)', borderRadius: radius.full, paddingHorizontal: 7, paddingVertical: 2 },
  badgeText: { fontSize: 10, color: '#FFFFFF', fontWeight: '600' },
  starBtn: { paddingLeft: 8, paddingTop: 2 },
  cardBalance: { fontSize: fontSize.xxl, fontWeight: '700', marginBottom: 4 },
  cardNumber: { fontSize: fontSize.xs, marginBottom: 16, letterSpacing: 0.3 },
  chipRow: { flexDirection: 'row', gap: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: radius.full },
  chipText: { fontSize: fontSize.sm, fontWeight: '600' },
  tmoneyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    marginHorizontal: 16,
    marginBottom: 10,
    padding: 18,
    borderRadius: radius.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  tmoneyLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  tmoneyCircle: { width: 42, height: 42, borderRadius: 21, backgroundColor: colors.tmoneyRed, alignItems: 'center', justifyContent: 'center' },
  tmoneyT: { fontSize: 20, fontWeight: '900', color: '#FFFFFF', fontStyle: 'italic' },
  tmoneyTitle: { fontSize: fontSize.md, fontWeight: '600', color: colors.textPrimary },
  tmoneyDesc: { fontSize: fontSize.xs, color: colors.textTertiary, marginTop: 2 },
  tmoneyChips: { flexDirection: 'row', gap: 8 },
  tmoneyChip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: radius.full, backgroundColor: colors.chipBackground },
  tmoneyChipText: { fontSize: fontSize.sm, fontWeight: '600', color: colors.textPrimary },
  quickCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    marginHorizontal: 16,
    marginBottom: 10,
    borderRadius: radius.xl,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  quickItem: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 16 },
  quickLabel: { fontSize: fontSize.xs, color: colors.textPrimary, fontWeight: '500' },
  quickDivider: { width: 1, height: 20, backgroundColor: colors.divider },
  transferBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.kakaoYellow,
    marginHorizontal: 16,
    marginBottom: 16,
    paddingVertical: 16,
    borderRadius: radius.lg,
  },
  transferBtnText: { fontSize: fontSize.md, fontWeight: '700', color: colors.textPrimary },
  promoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF9DB',
    marginHorizontal: 16,
    borderRadius: radius.xl,
    padding: 20,
    overflow: 'hidden',
  },
  promoBannerLeft: { flex: 1 },
  promoTag: { fontSize: fontSize.xs, color: '#AA8000', fontWeight: '700', marginBottom: 4 },
  promoTitle: { fontSize: fontSize.md, fontWeight: '700', color: colors.textPrimary, marginBottom: 4 },
  promoDesc: { fontSize: fontSize.xs, color: colors.textSecondary },
  promoEmoji: { marginLeft: 12 },
});
