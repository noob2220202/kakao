import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { getBankColor, getBankShortName, getBankTextColor } from '@/constants/banks';
import { colors, fontSize, radius } from '@/constants/theme';
import { useAppData } from '@/context/DataContext';
import type { RecentRecipient } from '@/data/dummy';

type TabKey = 'recent' | 'frequent' | 'mine';

const TABS: { key: TabKey; label: string }[] = [
  { key: 'recent', label: '최근이체' },
  { key: 'frequent', label: '자주쓰는' },
  { key: 'mine', label: '내 계좌' },
];

function maskAccountNumber(num: string): string {
  if (num.length <= 4) return num;
  return num.slice(0, -4).replace(/\d/g, '*') + num.slice(-4);
}

function BankAvatar({ bank, size = 52 }: { bank: string; size?: number }) {
  const bg = getBankColor(bank);
  const textColor = getBankTextColor(bank);
  const short = getBankShortName(bank);
  return (
    <View style={[styles.bankAvatarCircle, { backgroundColor: bg, width: size, height: size, borderRadius: size / 2 }]}>
      <Text style={[styles.bankAvatarText, { color: textColor }]} adjustsFontSizeToFit numberOfLines={1}>
        {short}
      </Text>
    </View>
  );
}

function RecipientCircle({ recipient }: { recipient: RecentRecipient }) {
  return (
    <Pressable style={styles.circleItem}>
      <BankAvatar bank={recipient.bank} size={54} />
      <Text style={styles.circleName} numberOfLines={1}>{recipient.name}</Text>
      <Text style={styles.circleBank} numberOfLines={1}>{recipient.bank}</Text>
    </Pressable>
  );
}

function RecipientRow({
  recipient,
  onToggleStar,
}: {
  recipient: RecentRecipient;
  onToggleStar?: (id: string) => void;
}) {
  const masked = maskAccountNumber(recipient.accountNumber);
  return (
    <Pressable style={styles.recipientRow}>
      <BankAvatar bank={recipient.bank} size={44} />
      <View style={styles.recipientInfo}>
        <Text style={styles.recipientName}>{recipient.name}</Text>
        <Text style={styles.recipientMeta}>{recipient.bank} {masked}</Text>
      </View>
      {onToggleStar && (
        <Pressable onPress={() => onToggleStar(recipient.id)} hitSlop={12}>
          <Ionicons
            name={recipient.starred ? 'star' : 'star-outline'}
            size={20}
            color={recipient.starred ? '#FFCE00' : colors.textTertiary}
          />
        </Pressable>
      )}
    </Pressable>
  );
}

export default function TransferScreen() {
  const { data, setRecentRecipients } = useAppData();
  const [activeTab, setActiveTab] = useState<TabKey>('recent');
  const [query, setQuery] = useState('');

  const toggleStar = (id: string) => {
    setRecentRecipients(
      data.recentRecipients.map((r) => (r.id === id ? { ...r, starred: !r.starred } : r)),
    );
  };

  const currentList: RecentRecipient[] =
    activeTab === 'mine'
      ? data.myAccounts
      : activeTab === 'frequent'
        ? data.recentRecipients.filter((r) => r.starred)
        : data.recentRecipients;

  const filtered = query.trim()
    ? currentList.filter(
        (r) => r.name.includes(query) || r.bank.includes(query) || r.accountNumber.includes(query),
      )
    : currentList;

  const isSearching = query.trim().length > 0;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={26} color={colors.textPrimary} />
        </Pressable>
        <Text style={styles.headerTitle}>이체</Text>
        <View style={{ width: 42 }} />
      </View>

      {/* 검색 */}
      <View style={styles.searchWrap}>
        <Ionicons name="search-outline" size={18} color={colors.textTertiary} style={{ marginRight: 8 }} />
        <TextInput
          style={styles.searchInput}
          placeholder="계좌번호, 이름으로 검색"
          placeholderTextColor={colors.textTertiary}
          value={query}
          onChangeText={setQuery}
        />
        {query.length > 0 && (
          <Pressable onPress={() => setQuery('')} hitSlop={8}>
            <Ionicons name="close-circle" size={18} color={colors.textTertiary} />
          </Pressable>
        )}
      </View>

      {/* 탭 */}
      <View style={styles.tabBar}>
        {TABS.map(({ key, label }) => (
          <Pressable
            key={key}
            style={[styles.tab, activeTab === key && styles.tabActive]}
            onPress={() => setActiveTab(key)}
          >
            <Text style={[styles.tabText, activeTab === key && styles.tabTextActive]}>{label}</Text>
          </Pressable>
        ))}
      </View>

      <ScrollView style={styles.list} keyboardShouldPersistTaps="handled">
        {filtered.length === 0 ? (
          <View style={styles.emptyBox}>
            <Ionicons name="people-outline" size={40} color={colors.textTertiary} />
            <Text style={styles.emptyText}>{isSearching ? '검색 결과가 없어요' : '이체 내역이 없어요'}</Text>
          </View>
        ) : (
          <>
            {/* 가로 스크롤 원형 아이콘 (검색 중 아닐 때) */}
            {!isSearching && (
              <View style={styles.circleSection}>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.circleScrollContent}
                >
                  {filtered.map((r) => (
                    <RecipientCircle key={r.id} recipient={r} />
                  ))}
                </ScrollView>
              </View>
            )}

            {/* 전체 목록 헤더 */}
            {!isSearching && (
              <View style={styles.listDivider}>
                <Text style={styles.listDividerText}>전체 목록</Text>
              </View>
            )}

            {/* 상세 리스트 */}
            {filtered.map((r) => (
              <RecipientRow
                key={r.id}
                recipient={r}
                onToggleStar={activeTab === 'mine' ? undefined : toggleStar}
              />
            ))}

            <View style={{ height: 20 }} />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.white },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.divider,
  },
  backBtn: { padding: 8 },
  headerTitle: { fontSize: fontSize.lg, fontWeight: '700', color: colors.textPrimary },

  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.chipBackground,
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderRadius: radius.lg,
  },
  searchInput: { flex: 1, fontSize: fontSize.md, color: colors.textPrimary, padding: 0 },

  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.divider,
    paddingHorizontal: 16,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 13,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: { borderBottomColor: colors.textPrimary },
  tabText: { fontSize: fontSize.sm, color: colors.textTertiary, fontWeight: '500' },
  tabTextActive: { color: colors.textPrimary, fontWeight: '700' },

  list: { flex: 1 },

  circleSection: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.divider,
    backgroundColor: colors.white,
  },
  circleScrollContent: { paddingHorizontal: 16, paddingTop: 20, paddingBottom: 16, gap: 4 },
  circleItem: { alignItems: 'center', width: 74, marginRight: 4 },
  bankAvatarCircle: { alignItems: 'center', justifyContent: 'center' },
  bankAvatarText: { fontSize: 11, fontWeight: '700', textAlign: 'center', paddingHorizontal: 3 },
  circleName: { fontSize: 12, fontWeight: '500', color: colors.textPrimary, textAlign: 'center', marginTop: 7, maxWidth: 70 },
  circleBank: { fontSize: 10, color: colors.textTertiary, textAlign: 'center', marginTop: 1 },

  listDivider: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 8,
    backgroundColor: colors.background,
  },
  listDividerText: { fontSize: fontSize.xs, fontWeight: '600', color: colors.textSecondary },

  recipientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 13,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.divider,
    backgroundColor: colors.white,
  },
  recipientInfo: { flex: 1, marginLeft: 14 },
  recipientName: { fontSize: fontSize.md, fontWeight: '600', color: colors.textPrimary },
  recipientMeta: { fontSize: fontSize.xs, color: colors.textTertiary, marginTop: 3 },

  emptyBox: { alignItems: 'center', justifyContent: 'center', paddingTop: 80, gap: 12 },
  emptyText: { fontSize: fontSize.md, color: colors.textTertiary },
});
