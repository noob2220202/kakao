import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BANKS } from '@/constants/banks';
import { colors, fontSize } from '@/constants/theme';
import { useAppData } from '@/context/DataContext';
import type { Account, RecentRecipient, Transaction } from '@/data/dummy';

type Tab = 'profile' | 'accounts' | 'transactions' | 'recipients';

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

function FieldRow({
  label,
  value,
  onChange,
  keyboardType,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  keyboardType?: 'default' | 'numeric' | 'decimal-pad';
  placeholder?: string;
}) {
  return (
    <View style={styles.fieldRow}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        style={styles.fieldInput}
        value={value}
        onChangeText={onChange}
        keyboardType={keyboardType ?? 'default'}
        placeholder={placeholder ?? ''}
        placeholderTextColor={colors.textTertiary}
      />
    </View>
  );
}

function BankPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <View style={styles.fieldRow}>
      <Text style={styles.fieldLabel}>은행</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.bankPickerRow}>
          {BANKS.map((b) => (
            <Pressable
              key={b.name}
              style={[
                styles.bankChip,
                { backgroundColor: b.color },
                value === b.name && styles.bankChipSelected,
              ]}
              onPress={() => onChange(b.name)}
            >
              <Text
                style={[styles.bankChipText, { color: b.textColor }]}
                numberOfLines={1}
              >
                {b.name}
              </Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

function AccountEditor({
  account,
  onSave,
  onCancel,
}: {
  account: Account;
  onSave: (a: Account) => void;
  onCancel: () => void;
}) {
  const [draft, setDraft] = useState(account);
  const set = (key: keyof Account, val: string) =>
    setDraft((prev) => ({ ...prev, [key]: val }));

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.editorScroll}>
        <FieldRow label="계좌 이름" value={draft.name} onChange={(v) => set('name', v)} />
        <BankPicker value={draft.bank} onChange={(v) => setDraft((p) => ({ ...p, bank: v }))} />
        <FieldRow label="계좌번호" value={draft.accountNumber} onChange={(v) => set('accountNumber', v)} />
        <FieldRow
          label="잔액 (원)"
          value={String(draft.balance)}
          onChange={(v) => setDraft((p) => ({ ...p, balance: Number(v) || 0 }))}
          keyboardType="numeric"
        />
        <View style={styles.fieldRow}>
          <Text style={styles.fieldLabel}>카드 색상</Text>
          <View style={styles.colorRow}>
            {(['beige', 'yellow', 'green'] as const).map((c) => (
              <Pressable
                key={c}
                style={[
                  styles.colorChip,
                  { backgroundColor: c === 'beige' ? '#B5AD9B' : c === 'yellow' ? '#FFEB00' : '#3FA45C' },
                  draft.color === c && styles.colorChipSelected,
                ]}
                onPress={() => setDraft((p) => ({ ...p, color: c }))}
              >
                <Text style={styles.colorChipText}>{c}</Text>
              </Pressable>
            ))}
          </View>
        </View>
        <FieldRow
          label="뱃지 (선택)"
          value={draft.badge ?? ''}
          onChange={(v) => setDraft((p) => ({ ...p, badge: v || undefined }))}
          placeholder="예: 한도계좌"
        />
        <View style={styles.editorButtons}>
          <Pressable style={styles.cancelBtn} onPress={onCancel}>
            <Text style={styles.cancelBtnText}>취소</Text>
          </Pressable>
          <Pressable style={styles.saveBtn} onPress={() => onSave(draft)}>
            <Text style={styles.saveBtnText}>저장</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function TransactionEditor({
  transaction,
  accountIds,
  onSave,
  onCancel,
}: {
  transaction: Transaction;
  accountIds: string[];
  onSave: (t: Transaction) => void;
  onCancel: () => void;
}) {
  const [draft, setDraft] = useState(transaction);
  const set = <K extends keyof Transaction>(key: K, val: Transaction[K]) =>
    setDraft((prev) => ({ ...prev, [key]: val }));

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.editorScroll}>
        <FieldRow label="상호명" value={draft.merchant} onChange={(v) => set('merchant', v)} />
        <View style={styles.fieldRow}>
          <Text style={styles.fieldLabel}>계좌</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.bankPickerRow}>
              {accountIds.map((id) => (
                <Pressable
                  key={id}
                  style={[
                    styles.bankChip,
                    { backgroundColor: draft.accountId === id ? colors.navy : colors.chipBackground },
                  ]}
                  onPress={() => set('accountId', id)}
                >
                  <Text style={[styles.bankChipText, { color: draft.accountId === id ? '#fff' : colors.textPrimary }]}>
                    {id}
                  </Text>
                </Pressable>
              ))}
            </View>
          </ScrollView>
        </View>
        <FieldRow label="날짜 (YYYY-MM-DD)" value={draft.date} onChange={(v) => set('date', v)} placeholder="2026-06-12" />
        <FieldRow label="시간 (HH:mm)" value={draft.time} onChange={(v) => set('time', v)} placeholder="07:45" />
        <FieldRow label="거래시각 (상세 표시)" value={draft.dateTime} onChange={(v) => set('dateTime', v)} placeholder="2026.06.12 07:45:23" />
        <FieldRow label="금액 (출금은 음수)" value={String(draft.amount)} onChange={(v) => set('amount', Number(v) || 0)} keyboardType="numeric" />
        <FieldRow label="거래 후 잔액" value={String(draft.balanceAfter)} onChange={(v) => set('balanceAfter', Number(v) || 0)} keyboardType="numeric" />
        <FieldRow label="태그 (예: #체크카드)" value={draft.tag} onChange={(v) => set('tag', v)} />
        <FieldRow label="거래구분" value={draft.type} onChange={(v) => set('type', v)} />
        <FieldRow label="카드정보 (선택)" value={draft.cardInfo ?? ''} onChange={(v) => set('cardInfo', v || undefined)} />
        <FieldRow label="주소 (선택)" value={draft.address ?? ''} onChange={(v) => set('address', v || undefined)} />
        <View style={styles.editorButtons}>
          <Pressable style={styles.cancelBtn} onPress={onCancel}>
            <Text style={styles.cancelBtnText}>취소</Text>
          </Pressable>
          <Pressable style={styles.saveBtn} onPress={() => onSave(draft)}>
            <Text style={styles.saveBtnText}>저장</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function RecipientEditor({
  recipient,
  onSave,
  onCancel,
}: {
  recipient: RecentRecipient;
  onSave: (r: RecentRecipient) => void;
  onCancel: () => void;
}) {
  const [draft, setDraft] = useState(recipient);

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.editorScroll}>
        <FieldRow label="이름" value={draft.name} onChange={(v) => setDraft((p) => ({ ...p, name: v }))} />
        <BankPicker
          value={draft.bank}
          onChange={(v) => {
            const bank = BANKS.find((b) => b.name === v);
            setDraft((p) => ({ ...p, bank: v, bankColor: bank?.color ?? p.bankColor }));
          }}
        />
        <FieldRow label="계좌번호" value={draft.accountNumber} onChange={(v) => setDraft((p) => ({ ...p, accountNumber: v }))} />
        <View style={styles.editorButtons}>
          <Pressable style={styles.cancelBtn} onPress={onCancel}>
            <Text style={styles.cancelBtnText}>취소</Text>
          </Pressable>
          <Pressable style={styles.saveBtn} onPress={() => onSave(draft)}>
            <Text style={styles.saveBtnText}>저장</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default function AdminPanel({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const { data, setUserName, setAccounts, setTransactions, setMyAccounts, setRecentRecipients, reset } = useAppData();
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);
  const [editingMyAccount, setEditingMyAccount] = useState<RecentRecipient | null>(null);
  const [editingRecipient, setEditingRecipient] = useState<RecentRecipient | null>(null);
  const [userName, setLocalName] = useState(data.userName);

  const switchTab = (tab: Tab) => {
    setEditingAccount(null);
    setEditingTx(null);
    setEditingMyAccount(null);
    setEditingRecipient(null);
    setActiveTab(tab);
  };

  function saveAccount(updated: Account) {
    const exists = data.accounts.find((a) => a.id === updated.id);
    setAccounts(exists ? data.accounts.map((a) => (a.id === updated.id ? updated : a)) : [...data.accounts, updated]);
    setEditingAccount(null);
  }

  function deleteAccount(id: string) {
    Alert.alert('계좌 삭제', '정말 삭제할까요?', [
      { text: '취소', style: 'cancel' },
      { text: '삭제', style: 'destructive', onPress: () => setAccounts(data.accounts.filter((a) => a.id !== id)) },
    ]);
  }

  function newAccount(): Account {
    return { id: uid(), name: '새 계좌', bank: '카카오뱅크', accountNumber: '7777-00-0000000', balance: 0, color: 'yellow' };
  }

  function saveTx(updated: Transaction) {
    const exists = data.transactions.find((t) => t.id === updated.id);
    setTransactions(exists ? data.transactions.map((t) => (t.id === updated.id ? updated : t)) : [...data.transactions, updated]);
    setEditingTx(null);
  }

  function deleteTx(id: string) {
    Alert.alert('거래내역 삭제', '정말 삭제할까요?', [
      { text: '취소', style: 'cancel' },
      { text: '삭제', style: 'destructive', onPress: () => setTransactions(data.transactions.filter((t) => t.id !== id)) },
    ]);
  }

  function newTx(): Transaction {
    const today = new Date().toISOString().slice(0, 10);
    const time = new Date().toTimeString().slice(0, 5);
    return { id: uid(), accountId: data.accounts[0]?.id ?? 'limit', merchant: '새 거래처', date: today, time, dateTime: `${today.replace(/-/g, '.')} ${time}:00`, amount: -1000, balanceAfter: 0, tag: '#체크카드', type: '체크카드결제' };
  }

  function saveMyAccount(updated: RecentRecipient) {
    const exists = data.myAccounts.find((a) => a.id === updated.id);
    setMyAccounts(exists ? data.myAccounts.map((a) => (a.id === updated.id ? updated : a)) : [...data.myAccounts, updated]);
    setEditingMyAccount(null);
  }

  function saveRecipient(updated: RecentRecipient) {
    const exists = data.recentRecipients.find((r) => r.id === updated.id);
    setRecentRecipients(exists ? data.recentRecipients.map((r) => (r.id === updated.id ? updated : r)) : [...data.recentRecipients, updated]);
    setEditingRecipient(null);
  }

  function newRecipient(): RecentRecipient {
    return { id: uid(), name: '새 대상', bank: '카카오뱅크', accountNumber: '7777-00-0000000', bankColor: '#FFEB00' };
  }

  const TABS: { key: Tab; label: string }[] = [
    { key: 'profile', label: '프로필' },
    { key: 'accounts', label: '계좌' },
    { key: 'transactions', label: '거래내역' },
    { key: 'recipients', label: '이체대상' },
  ];

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>🔧 관리자 설정</Text>
          <Pressable onPress={onClose} hitSlop={12}>
            <Ionicons name="close" size={26} color={colors.textPrimary} />
          </Pressable>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabBar} contentContainerStyle={styles.tabBarContent}>
          {TABS.map(({ key, label }) => (
            <Pressable key={key} style={[styles.tab, activeTab === key && styles.tabActive]} onPress={() => switchTab(key)}>
              <Text style={[styles.tabText, activeTab === key && styles.tabTextActive]}>{label}</Text>
            </Pressable>
          ))}
        </ScrollView>

        <ScrollView style={styles.body} keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingBottom: 40 }}>
          {activeTab === 'profile' && (
            <View>
              <Text style={styles.sectionTitle}>사용자 이름</Text>
              <TextInput
                style={styles.bigInput}
                value={userName}
                onChangeText={setLocalName}
                onBlur={() => setUserName(userName)}
                placeholder="이름"
              />
              <View style={styles.divider} />
              <Text style={styles.sectionTitle}>초기화</Text>
              <Pressable
                style={styles.resetBtn}
                onPress={() =>
                  Alert.alert('전체 초기화', '모든 데이터를 기본값으로 되돌릴까요?', [
                    { text: '취소', style: 'cancel' },
                    { text: '초기화', style: 'destructive', onPress: () => { reset(); setLocalName('이준영'); } },
                  ])
                }
              >
                <Text style={styles.resetBtnText}>전체 데이터 초기화</Text>
              </Pressable>
            </View>
          )}

          {activeTab === 'accounts' && (
            <View>
              <Text style={styles.sectionTitle}>계좌 목록 ({data.accounts.length}개)</Text>
              {editingAccount ? (
                <AccountEditor account={editingAccount} onSave={saveAccount} onCancel={() => setEditingAccount(null)} />
              ) : (
                <>
                  {data.accounts.map((acc) => (
                    <View key={acc.id} style={styles.listItem}>
                      <View style={styles.listItemInfo}>
                        <View style={[styles.bankDot, { backgroundColor: acc.color === 'beige' ? '#B5AD9B' : acc.color === 'yellow' ? '#FFEB00' : '#3FA45C' }]} />
                        <View>
                          <Text style={styles.listItemName}>{acc.name}</Text>
                          <Text style={styles.listItemSub}>{acc.bank} · {acc.balance.toLocaleString()}원{acc.badge ? ` · ${acc.badge}` : ''}</Text>
                        </View>
                      </View>
                      <View style={styles.listItemActions}>
                        <Pressable style={styles.editBtn} onPress={() => setEditingAccount(acc)}>
                          <Ionicons name="pencil" size={16} color={colors.textSecondary} />
                        </Pressable>
                        <Pressable style={styles.deleteBtn} onPress={() => deleteAccount(acc.id)}>
                          <Ionicons name="trash" size={16} color="#FF4444" />
                        </Pressable>
                      </View>
                    </View>
                  ))}
                  <Pressable style={styles.addBtn} onPress={() => setEditingAccount(newAccount())}>
                    <Ionicons name="add-circle" size={20} color={colors.white} />
                    <Text style={styles.addBtnText}>계좌 추가</Text>
                  </Pressable>
                </>
              )}
            </View>
          )}

          {activeTab === 'transactions' && (
            <View>
              <Text style={styles.sectionTitle}>거래내역 ({data.transactions.length}건)</Text>
              {editingTx ? (
                <TransactionEditor transaction={editingTx} accountIds={data.accounts.map((a) => a.id)} onSave={saveTx} onCancel={() => setEditingTx(null)} />
              ) : (
                <>
                  {data.transactions.map((tx) => (
                    <View key={tx.id} style={styles.listItem}>
                      <View style={styles.listItemInfo}>
                        <View>
                          <Text style={styles.listItemName}>{tx.merchant}</Text>
                          <Text style={styles.listItemSub}>{tx.date} {tx.time} · {tx.amount.toLocaleString()}원 · [{tx.accountId}]</Text>
                        </View>
                      </View>
                      <View style={styles.listItemActions}>
                        <Pressable style={styles.editBtn} onPress={() => setEditingTx(tx)}>
                          <Ionicons name="pencil" size={16} color={colors.textSecondary} />
                        </Pressable>
                        <Pressable style={styles.deleteBtn} onPress={() => deleteTx(tx.id)}>
                          <Ionicons name="trash" size={16} color="#FF4444" />
                        </Pressable>
                      </View>
                    </View>
                  ))}
                  <Pressable style={styles.addBtn} onPress={() => setEditingTx(newTx())}>
                    <Ionicons name="add-circle" size={20} color={colors.white} />
                    <Text style={styles.addBtnText}>거래 추가</Text>
                  </Pressable>
                </>
              )}
            </View>
          )}

          {activeTab === 'recipients' && (
            <View>
              <Text style={styles.sectionTitle}>내 계좌 ({data.myAccounts.length}개)</Text>
              {editingMyAccount ? (
                <RecipientEditor recipient={editingMyAccount} onSave={saveMyAccount} onCancel={() => setEditingMyAccount(null)} />
              ) : (
                <>
                  {data.myAccounts.map((acc) => (
                    <View key={acc.id} style={styles.listItem}>
                      <View style={styles.listItemInfo}>
                        <View style={[styles.bankDot, { backgroundColor: acc.bankColor }]} />
                        <View>
                          <Text style={styles.listItemName}>{acc.name}</Text>
                          <Text style={styles.listItemSub}>{acc.bank} {acc.accountNumber}</Text>
                        </View>
                      </View>
                      <View style={styles.listItemActions}>
                        <Pressable style={styles.editBtn} onPress={() => setEditingMyAccount(acc)}>
                          <Ionicons name="pencil" size={16} color={colors.textSecondary} />
                        </Pressable>
                        <Pressable style={styles.deleteBtn} onPress={() => setMyAccounts(data.myAccounts.filter((a) => a.id !== acc.id))}>
                          <Ionicons name="trash" size={16} color="#FF4444" />
                        </Pressable>
                      </View>
                    </View>
                  ))}
                  <Pressable style={styles.addBtn} onPress={() => setEditingMyAccount(newRecipient())}>
                    <Ionicons name="add-circle" size={20} color={colors.white} />
                    <Text style={styles.addBtnText}>내 계좌 추가</Text>
                  </Pressable>
                </>
              )}

              <View style={styles.divider} />

              <Text style={styles.sectionTitle}>최근 이체 ({data.recentRecipients.length}명)</Text>
              {editingRecipient ? (
                <RecipientEditor recipient={editingRecipient} onSave={saveRecipient} onCancel={() => setEditingRecipient(null)} />
              ) : (
                <>
                  {data.recentRecipients.map((r) => (
                    <View key={r.id} style={styles.listItem}>
                      <View style={styles.listItemInfo}>
                        <View style={[styles.bankDot, { backgroundColor: r.bankColor }]} />
                        <View>
                          <Text style={styles.listItemName}>{r.name}</Text>
                          <Text style={styles.listItemSub}>{r.bank} {r.accountNumber}</Text>
                        </View>
                      </View>
                      <View style={styles.listItemActions}>
                        <Pressable style={styles.editBtn} onPress={() => setEditingRecipient(r)}>
                          <Ionicons name="pencil" size={16} color={colors.textSecondary} />
                        </Pressable>
                        <Pressable style={styles.deleteBtn} onPress={() => setRecentRecipients(data.recentRecipients.filter((x) => x.id !== r.id))}>
                          <Ionicons name="trash" size={16} color="#FF4444" />
                        </Pressable>
                      </View>
                    </View>
                  ))}
                  <Pressable style={styles.addBtn} onPress={() => setEditingRecipient(newRecipient())}>
                    <Ionicons name="add-circle" size={20} color={colors.white} />
                    <Text style={styles.addBtnText}>최근 이체 추가</Text>
                  </Pressable>
                </>
              )}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.white },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.divider },
  headerTitle: { fontSize: fontSize.lg, fontWeight: '700', color: colors.textPrimary },
  tabBar: { flexGrow: 0, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.divider },
  tabBarContent: { paddingHorizontal: 12, paddingVertical: 4, gap: 4 },
  tab: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: colors.chipBackground },
  tabActive: { backgroundColor: colors.navy },
  tabText: { fontSize: fontSize.sm, color: colors.textSecondary },
  tabTextActive: { color: colors.white, fontWeight: '600' },
  body: { flex: 1, padding: 16 },
  sectionTitle: { fontSize: fontSize.md, fontWeight: '700', color: colors.textPrimary, marginBottom: 12, marginTop: 4 },
  divider: { height: 1, backgroundColor: colors.divider, marginVertical: 20 },
  listItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.background, borderRadius: 10, padding: 12, marginBottom: 8 },
  listItemInfo: { flexDirection: 'row', alignItems: 'center', flex: 1, gap: 10 },
  bankDot: { width: 28, height: 28, borderRadius: 14 },
  listItemName: { fontSize: fontSize.sm, fontWeight: '600', color: colors.textPrimary },
  listItemSub: { fontSize: fontSize.xs, color: colors.textTertiary, marginTop: 2 },
  listItemActions: { flexDirection: 'row', gap: 8 },
  editBtn: { padding: 6 },
  deleteBtn: { padding: 6 },
  addBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: colors.navy, borderRadius: 10, paddingVertical: 12, marginTop: 4 },
  addBtnText: { fontSize: fontSize.sm, color: colors.white, fontWeight: '600' },
  editorScroll: { maxHeight: 500 },
  fieldRow: { marginBottom: 14 },
  fieldLabel: { fontSize: fontSize.xs, color: colors.textTertiary, marginBottom: 4 },
  fieldInput: { borderWidth: 1, borderColor: colors.divider, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: fontSize.sm, color: colors.textPrimary, backgroundColor: colors.background },
  editorButtons: { flexDirection: 'row', gap: 10, marginTop: 16, marginBottom: 8 },
  cancelBtn: { flex: 1, backgroundColor: colors.chipBackground, borderRadius: 10, paddingVertical: 12, alignItems: 'center' },
  cancelBtnText: { fontSize: fontSize.sm, color: colors.textSecondary, fontWeight: '600' },
  saveBtn: { flex: 2, backgroundColor: colors.kakaoYellow, borderRadius: 10, paddingVertical: 12, alignItems: 'center' },
  saveBtnText: { fontSize: fontSize.sm, color: colors.textPrimary, fontWeight: '700' },
  bankPickerRow: { flexDirection: 'row', gap: 6 },
  bankChip: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 14, minWidth: 64, alignItems: 'center' },
  bankChipSelected: { borderWidth: 2, borderColor: colors.navy },
  bankChipText: { fontSize: fontSize.xs, fontWeight: '600' },
  colorRow: { flexDirection: 'row', gap: 8, marginTop: 4 },
  colorChip: { width: 60, height: 32, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  colorChipSelected: { borderWidth: 2, borderColor: colors.navy },
  colorChipText: { fontSize: 10, fontWeight: '700', color: colors.white },
  bigInput: { borderWidth: 1, borderColor: colors.divider, borderRadius: 10, paddingHorizontal: 16, paddingVertical: 14, fontSize: fontSize.lg, color: colors.textPrimary },
  resetBtn: { backgroundColor: '#FF4444', borderRadius: 10, paddingVertical: 14, alignItems: 'center' },
  resetBtnText: { fontSize: fontSize.sm, color: colors.white, fontWeight: '700' },
});
