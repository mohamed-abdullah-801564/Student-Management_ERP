import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  CreditCard,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Building,
  FileText,
  Download,
  Printer,
  ShieldCheck,
  ChevronRight,
  X,
  Phone,
  Landmark,
  Receipt,
  Info,
} from 'lucide-react-native';
import { COLORS, SHADOWS } from '../../src/constants/theme';
import { AnimatedNumberTicker } from '../../src/components/AnimatedNumberTicker';

interface Installment {
  id: string;
  termTitle: string;
  periodMonths: string;
  amount: number;
  dueDate: string;
  status: 'paid' | 'pending' | 'upcoming';
  receiptNo?: string;
  paidDate?: string;
  paymentMode?: string;
  breakdown: { label: string; amount: number }[];
}

export default function ParentFeesScreen() {
  const router = useRouter();

  // Active view: installment list or receipt modal
  const [selectedReceipt, setSelectedReceipt] = useState<Installment | null>(null);
  const [installments, setInstallments] = useState<Installment[]>([
    {
      id: 'term_1',
      termTitle: 'Term 1 Installment',
      periodMonths: 'April – July 2026',
      amount: 38834,
      dueDate: '15 July 2026',
      status: 'paid',
      receiptNo: 'GW-REC-2026-0842',
      paidDate: '14 July 2026',
      paymentMode: 'Cash at Admission Counter 1',
      breakdown: [
        { label: 'Tuition Fee (Term 1)', amount: 24000 },
        { label: 'CBSE Science & Tech Composite Fund', amount: 4834 },
        { label: 'Smart Campus, Library & Sports Fee', amount: 2666 },
        { label: 'School GPS Bus Route #12 Transport', amount: 7334 },
      ],
    },
    {
      id: 'term_2',
      termTitle: 'Term 2 Installment',
      periodMonths: 'August – November 2026',
      amount: 38833,
      dueDate: '15 October 2026',
      status: 'pending',
      breakdown: [
        { label: 'Tuition Fee (Term 2)', amount: 24000 },
        { label: 'CBSE Science & Tech Composite Fund', amount: 4833 },
        { label: 'Smart Campus, Library & Sports Fee', amount: 2667 },
        { label: 'School GPS Bus Route #12 Transport', amount: 7333 },
      ],
    },
    {
      id: 'term_3',
      termTitle: 'Term 3 Installment',
      periodMonths: 'December 2026 – March 2027',
      amount: 38833,
      dueDate: '15 January 2027',
      status: 'upcoming',
      breakdown: [
        { label: 'Tuition Fee (Term 3)', amount: 24000 },
        { label: 'CBSE Science & Tech Composite Fund', amount: 4833 },
        { label: 'Smart Campus, Library & Sports Fee', amount: 2667 },
        { label: 'School GPS Bus Route #12 Transport', amount: 7333 },
      ],
    },
  ]);

  const totalAnnual = installments.reduce((acc, curr) => acc + curr.amount, 0);
  const totalPaid = installments
    .filter((i) => i.status === 'paid')
    .reduce((acc, curr) => acc + curr.amount, 0);
  const outstandingDue = installments
    .filter((i) => i.status === 'pending')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const handleSimulatePaymentNotice = () => {
    Alert.alert(
      'Payment at Counter Registered',
      'If you have already deposited Cash, Cheque, or NEFT, the Accounts Desk will reconcile and issue your digital receipt within 2 working hours.\n\nAccounts Helpline: +91 44 2618 9000',
      [{ text: 'Understood' }]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* HEADER BAR */}
      <View style={styles.headerBar}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <ArrowLeft size={20} color={COLORS.slate[700]} />
        </TouchableOpacity>

        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Fees & Accounts Ledger</Text>
          <Text style={styles.headerSubtitle}>
            Rahul Suresh • Class 8-B (GW-2026-0842)
          </Text>
        </View>

        {outstandingDue > 0 ? (
          <View style={styles.pendingBadgeHeader}>
            <Text style={styles.pendingBadgeHeaderText}>Term 2 Due</Text>
          </View>
        ) : (
          <View style={styles.clearedBadgeHeader}>
            <Text style={styles.clearedBadgeHeaderText}>All Cleared ✓</Text>
          </View>
        )}
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* SUMMARY PULSE CARD (Minimal White with Hairline Border & Animated Numbers) */}
        <View style={[styles.summaryCard, SHADOWS.card]}>
          <View style={styles.summaryTopRow}>
            <View>
              <Text style={styles.summaryTitle}>ANNUAL ACADEMIC FEE</Text>
              <Text style={styles.summarySub}>AY 2026-27 • CBSE Affiliation #1930412</Text>
            </View>
            <View style={styles.planPill}>
              <Text style={styles.planPillText}>3 Terms Plan</Text>
            </View>
          </View>

          {/* 3 Metric Columns with Animated Number Tickers */}
          <View style={styles.metricsRow}>
            <View style={styles.metricCol}>
              <AnimatedNumberTicker
                value={totalAnnual}
                prefix="₹"
                duration={900}
                style={styles.metricVal}
              />
              <Text style={styles.metricLabel}>Total Annual</Text>
            </View>

            <View style={styles.metricDivider} />

            <View style={styles.metricCol}>
              <AnimatedNumberTicker
                value={totalPaid}
                prefix="₹"
                duration={900}
                style={[styles.metricVal, { color: '#059669' }]}
              />
              <Text style={styles.metricLabel}>Paid (Term 1)</Text>
            </View>

            <View style={styles.metricDivider} />

            <View style={styles.metricCol}>
              <AnimatedNumberTicker
                value={outstandingDue}
                prefix="₹"
                duration={900}
                style={[styles.metricVal, { color: '#DC2626' }]}
              />
              <Text style={styles.metricLabel}>Due (Term 2)</Text>
            </View>
          </View>
        </View>

        {/* PUSH NOTIFICATION NOTICE BANNER */}
        {outstandingDue > 0 && (
          <View style={styles.noticeBanner}>
            <View style={styles.noticeIconWrap}>
              <AlertTriangle size={18} color="#D97706" strokeWidth={2.2} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.noticeTitle}>Term 2 Fee Notice Issued</Text>
              <Text style={styles.noticeText}>
                Due date: October 15, 2026. Settle at School Accounts Counter or via Bank NEFT.
              </Text>
            </View>
          </View>
        )}

        {/* INSTALLMENTS BREAKDOWN LIST */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Billing Schedule & Invoices</Text>
          <Text style={styles.sectionSubtitle}>Academic Year 2026-27</Text>
        </View>

        <View style={styles.installmentsList}>
          {installments.map((item) => {
            const isPaid = item.status === 'paid';
            const isPending = item.status === 'pending';
            const isUpcoming = item.status === 'upcoming';

            return (
              <View
                key={item.id}
                style={[
                  styles.installmentCard,
                  SHADOWS.card,
                  isPending && styles.installmentCardPending,
                ]}
              >
                {/* CARD TOP HEADER */}
                <View style={styles.installmentHeader}>
                  <View>
                    <Text style={styles.installmentTermTitle}>{item.termTitle}</Text>
                    <Text style={styles.installmentPeriod}>{item.periodMonths}</Text>
                  </View>

                  <View
                    style={[
                      styles.statusPill,
                      isPaid && styles.statusPillPaid,
                      isPending && styles.statusPillPending,
                      isUpcoming && styles.statusPillUpcoming,
                    ]}
                  >
                    {isPaid && (
                      <CheckCircle2 size={12} color="#059669" strokeWidth={2.5} />
                    )}
                    {isPending && (
                      <Clock size={12} color="#DC2626" strokeWidth={2.5} />
                    )}
                    <Text
                      style={[
                        styles.statusPillText,
                        isPaid && styles.statusTextPaid,
                        isPending && styles.statusTextPending,
                        isUpcoming && styles.statusTextUpcoming,
                      ]}
                    >
                      {isPaid ? 'PAID ✓' : isPending ? 'PENDING' : 'UPCOMING'}
                    </Text>
                  </View>
                </View>

                {/* AMOUNT AND DUE DATE */}
                <View style={styles.amountRow}>
                  <View>
                    <Text style={styles.amountLabel}>Installment Amount</Text>
                    <Text style={styles.amountVal}>
                      ₹{item.amount.toLocaleString('en-IN')}
                    </Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={styles.amountLabel}>
                      {isPaid ? 'Settled Date' : 'Payment Due Date'}
                    </Text>
                    <Text
                      style={[
                        styles.dueDateText,
                        isPending && { color: '#DC2626', fontWeight: '800' },
                      ]}
                    >
                      {isPaid ? item.paidDate : item.dueDate}
                    </Text>
                  </View>
                </View>

                {/* ITEM BREAKDOWN */}
                <View style={styles.breakdownBox}>
                  {item.breakdown.map((b, idx) => (
                    <View key={idx} style={styles.breakdownRow}>
                      <Text style={styles.breakdownLabel}>{b.label}</Text>
                      <Text style={styles.breakdownVal}>
                        ₹{b.amount.toLocaleString('en-IN')}
                      </Text>
                    </View>
                  ))}
                </View>

                {/* ACTIONS */}
                {isPaid && item.receiptNo && (
                  <TouchableOpacity
                    style={styles.receiptBtn}
                    onPress={() => setSelectedReceipt(item)}
                    activeOpacity={0.8}
                  >
                    <Receipt size={15} color="#4F46E5" strokeWidth={2.2} />
                    <Text style={styles.receiptBtnText}>
                      View Digital Receipt ({item.receiptNo})
                    </Text>
                    <ChevronRight size={14} color="#4F46E5" />
                  </TouchableOpacity>
                )}

                {isPending && (
                  <View style={styles.pendingInfoBox}>
                    <Info size={14} color="#0284C7" />
                    <Text style={styles.pendingInfoText}>
                      Pay via Counter Cash, Cheque, or NEFT using details below.
                    </Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>

        {/* REAL-WORLD MANUAL PAYMENT INSTRUCTIONS CARD */}
        <View style={[styles.bankCard, SHADOWS.card]}>
          <View style={styles.bankHeader}>
            <View style={styles.bankIconWrap}>
              <Landmark size={20} color="#4F46E5" strokeWidth={2.2} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.bankTitle}>School Counter & Bank Details</Text>
              <Text style={styles.bankSub}>Official Greenwood Academy Accounts Desk</Text>
            </View>
          </View>

          {/* Option A: Front Desk Counter */}
          <View style={styles.bankOptionRow}>
            <View style={styles.bankOptionPill}>
              <Text style={styles.bankOptionPillText}>OPTION 1: CASH / CHEQUE</Text>
            </View>
            <Text style={styles.bankOptionDesc}>
              Visit Admin Block, Fee Counter #2. Working Hours: 9:00 AM – 2:30 PM (Mon – Fri).
              Cheques in favor of: "Greenwood Academy".
            </Text>
          </View>

          <View style={styles.bankDivider} />

          {/* Option B: Direct NEFT / IMPS */}
          <View style={styles.bankOptionRow}>
            <View style={[styles.bankOptionPill, { backgroundColor: '#EEF2FF' }]}>
              <Text style={[styles.bankOptionPillText, { color: '#4338CA' }]}>
                OPTION 2: NEFT / IMPS TRANSFER
              </Text>
            </View>

            <View style={styles.bankGrid}>
              <View style={styles.bankGridItem}>
                <Text style={styles.bankGridLabel}>Bank Name:</Text>
                <Text style={styles.bankGridVal}>State Bank of India (SBI)</Text>
              </View>
              <View style={styles.bankGridItem}>
                <Text style={styles.bankGridLabel}>Account Name:</Text>
                <Text style={styles.bankGridVal}>Greenwood Academy Trust</Text>
              </View>
              <View style={styles.bankGridItem}>
                <Text style={styles.bankGridLabel}>Account No:</Text>
                <Text style={styles.bankGridVal}>39482019482</Text>
              </View>
              <View style={styles.bankGridItem}>
                <Text style={styles.bankGridLabel}>IFSC Code:</Text>
                <Text style={styles.bankGridVal}>SBIN0004921 (Anna Nagar)</Text>
              </View>
              <View style={styles.bankGridItemFull}>
                <Text style={styles.bankGridLabel}>Mandatory NEFT Remark:</Text>
                <Text style={[styles.bankGridVal, { color: '#4F46E5' }]}>
                  GW-2026-0842 Rahul Suresh
                </Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={styles.notifyDeskBtn}
            onPress={handleSimulatePaymentNotice}
            activeOpacity={0.8}
          >
            <Phone size={15} color="#FFFFFF" strokeWidth={2.2} />
            <Text style={styles.notifyDeskBtnText}>
              Inquire / Notify Accounts Desk (+91 44 2618 9000)
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* OFFICIAL DIGITAL RECEIPT MODAL */}
      <Modal
        visible={!!selectedReceipt}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedReceipt(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.receiptModalCard, SHADOWS.soft]}>
            {/* MODAL HEADER */}
            <View style={styles.receiptModalHeader}>
              <View style={styles.receiptHeaderCrest}>
                <Building size={20} color="#4F46E5" />
                <View>
                  <Text style={styles.receiptSchoolName}>Greenwood Academy</Text>
                  <Text style={styles.receiptAffiliation}>
                    CBSE Affiliation #1930412 • Anna Nagar West, Chennai
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                onPress={() => setSelectedReceipt(null)}
                style={styles.closeBtn}
              >
                <X size={18} color="#64748B" />
              </TouchableOpacity>
            </View>

            {/* RECEIPT TITLE BADGE */}
            <View style={styles.receiptBadgeWrap}>
              <View style={styles.verifiedReceiptPill}>
                <ShieldCheck size={14} color="#059669" />
                <Text style={styles.verifiedReceiptText}>
                  OFFICIAL INSTITUTIONAL RECEIPT
                </Text>
              </View>
            </View>

            {/* RECEIPT DETAILS TABLE */}
            <View style={styles.receiptTable}>
              <View style={styles.receiptTableRow}>
                <Text style={styles.receiptTableLabel}>Receipt No:</Text>
                <Text style={styles.receiptTableVal}>
                  {selectedReceipt?.receiptNo}
                </Text>
              </View>
              <View style={styles.receiptTableRow}>
                <Text style={styles.receiptTableLabel}>Date Settled:</Text>
                <Text style={styles.receiptTableVal}>
                  {selectedReceipt?.paidDate}
                </Text>
              </View>
              <View style={styles.receiptTableRow}>
                <Text style={styles.receiptTableLabel}>Student Name:</Text>
                <Text style={styles.receiptTableVal}>Rahul Suresh</Text>
              </View>
              <View style={styles.receiptTableRow}>
                <Text style={styles.receiptTableLabel}>Admission ID:</Text>
                <Text style={styles.receiptTableVal}>GW-2026-0842</Text>
              </View>
              <View style={styles.receiptTableRow}>
                <Text style={styles.receiptTableLabel}>Grade & Section:</Text>
                <Text style={styles.receiptTableVal}>Class 8 - Section B</Text>
              </View>
              <View style={styles.receiptTableRow}>
                <Text style={styles.receiptTableLabel}>Installment:</Text>
                <Text style={styles.receiptTableVal}>
                  {selectedReceipt?.termTitle} ({selectedReceipt?.periodMonths})
                </Text>
              </View>
              <View style={styles.receiptTableRow}>
                <Text style={styles.receiptTableLabel}>Payment Mode:</Text>
                <Text style={styles.receiptTableVal}>
                  {selectedReceipt?.paymentMode}
                </Text>
              </View>
            </View>

            {/* RECEIPT LINE ITEMS */}
            <View style={styles.receiptItemsList}>
              {selectedReceipt?.breakdown.map((item, idx) => (
                <View key={idx} style={styles.receiptItemRow}>
                  <Text style={styles.receiptItemLabel}>{item.label}</Text>
                  <Text style={styles.receiptItemVal}>
                    ₹{item.amount.toLocaleString('en-IN')}
                  </Text>
                </View>
              ))}

              <View style={styles.receiptTotalRow}>
                <Text style={styles.receiptTotalLabel}>Total Amount Cleared:</Text>
                <Text style={styles.receiptTotalVal}>
                  ₹{selectedReceipt?.amount.toLocaleString('en-IN')}
                </Text>
              </View>
            </View>

            <View style={styles.receiptSignatureBox}>
              <View>
                <Text style={styles.receiptCashierTag}>ACCOUNTS SECTION</Text>
                <Text style={styles.receiptCashierName}>Counter Desk #1 • Authorized Cashier</Text>
              </View>
              <View style={styles.verifiedStamp}>
                <Text style={styles.verifiedStampText}>SEAL VERIFIED ✓</Text>
              </View>
            </View>

            {/* MODAL ACTIONS */}
            <View style={styles.modalActionsRow}>
              <TouchableOpacity
                style={styles.downloadPdfBtn}
                onPress={() => {
                  Alert.alert(
                    'Receipt Downloaded',
                    `Official Digital PDF for ${selectedReceipt?.receiptNo} saved to device storage.`,
                    [{ text: 'OK' }]
                  );
                }}
                activeOpacity={0.8}
              >
                <Download size={15} color="#FFFFFF" />
                <Text style={styles.downloadPdfBtnText}>Save PDF Voucher</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.doneBtn}
                onPress={() => setSelectedReceipt(null)}
                activeOpacity={0.8}
              >
                <Text style={styles.doneBtnText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEF2F6',
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  headerSubtitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  pendingBadgeHeader: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  pendingBadgeHeaderText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#DC2626',
  },
  clearedBadgeHeader: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  clearedBadgeHeaderText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#059669',
  },

  scrollContent: {
    padding: 16,
    paddingBottom: 40,
    gap: 14,
  },

  // Summary Card
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EEF2F6',
  },
  summaryTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  summaryTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.6,
  },
  summarySub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
    fontWeight: '500',
  },
  planPill: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  planPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#4338CA',
  },
  metricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  metricCol: {
    flex: 1,
    alignItems: 'center',
  },
  metricVal: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  metricLabel: {
    fontSize: 10.5,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 3,
  },
  metricDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#F1F5F9',
  },

  // Notice Banner
  noticeBanner: {
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderRadius: 14,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  noticeIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  noticeTitle: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#92400E',
  },
  noticeText: {
    fontSize: 11,
    color: '#B45309',
    marginTop: 2,
    lineHeight: 15,
  },

  // Section Header
  sectionHeaderRow: {
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  sectionSubtitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },

  // Installment Card
  installmentsList: {
    gap: 12,
  },
  installmentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EEF2F6',
  },
  installmentCardPending: {
    borderColor: '#FED7AA',
    backgroundColor: '#FFFCFA',
  },
  installmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  installmentTermTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  installmentPeriod: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusPillPaid: {
    backgroundColor: '#ECFDF5',
  },
  statusPillPending: {
    backgroundColor: '#FEE2E2',
  },
  statusPillUpcoming: {
    backgroundColor: '#F1F5F9',
  },
  statusPillText: {
    fontSize: 10,
    fontWeight: '800',
  },
  statusTextPaid: {
    color: '#059669',
  },
  statusTextPending: {
    color: '#DC2626',
  },
  statusTextUpcoming: {
    color: '#64748B',
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  amountLabel: {
    fontSize: 10.5,
    color: '#64748B',
    fontWeight: '500',
  },
  amountVal: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 2,
  },
  dueDateText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
    marginTop: 2,
  },
  breakdownBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 10,
    gap: 6,
    marginBottom: 10,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  breakdownLabel: {
    fontSize: 11,
    color: '#475569',
  },
  breakdownVal: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0F172A',
  },
  receiptBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 4,
  },
  receiptBtnText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#4F46E5',
    flex: 1,
  },
  pendingInfoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F0F9FF',
    padding: 8,
    borderRadius: 8,
    marginTop: 4,
  },
  pendingInfoText: {
    fontSize: 10.5,
    color: '#0369A1',
    fontWeight: '500',
    flex: 1,
  },

  // School Bank Card
  bankCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EEF2F6',
    marginTop: 4,
  },
  bankHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  bankIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bankTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  bankSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  bankOptionRow: {
    gap: 6,
  },
  bankOptionPill: {
    alignSelf: 'flex-start',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  bankOptionPillText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#475569',
    letterSpacing: 0.4,
  },
  bankOptionDesc: {
    fontSize: 11.5,
    color: '#334155',
    lineHeight: 16,
  },
  bankDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 12,
  },
  bankGrid: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 10,
    gap: 6,
    marginTop: 4,
  },
  bankGridItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bankGridItemFull: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: '#EEF2F6',
  },
  bankGridLabel: {
    fontSize: 10.5,
    color: '#64748B',
  },
  bankGridVal: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0F172A',
  },
  notifyDeskBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#4F46E5',
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 14,
  },
  notifyDeskBtnText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    justifyContent: 'center',
    padding: 16,
  },
  receiptModalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    maxHeight: Dimensions.get('window').height * 0.88,
  },
  receiptModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  receiptHeaderCrest: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  receiptSchoolName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  receiptAffiliation: {
    fontSize: 9.5,
    color: '#64748B',
    marginTop: 2,
  },
  closeBtn: {
    padding: 4,
  },
  receiptBadgeWrap: {
    alignItems: 'center',
    marginVertical: 10,
  },
  verifiedReceiptPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  verifiedReceiptText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#059669',
    letterSpacing: 0.5,
  },
  receiptTable: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 10,
    gap: 6,
    marginBottom: 12,
  },
  receiptTableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  receiptTableLabel: {
    fontSize: 10.5,
    color: '#64748B',
  },
  receiptTableVal: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0F172A',
  },
  receiptItemsList: {
    borderTopWidth: 1,
    borderTopColor: '#EEF2F6',
    paddingTop: 10,
    gap: 6,
    marginBottom: 12,
  },
  receiptItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  receiptItemLabel: {
    fontSize: 11,
    color: '#475569',
  },
  receiptItemVal: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0F172A',
  },
  receiptTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    marginTop: 4,
    borderTopWidth: 1,
    borderTopColor: '#CBD5E1',
  },
  receiptTotalLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
  },
  receiptTotalVal: {
    fontSize: 15,
    fontWeight: '900',
    color: '#059669',
  },
  receiptSignatureBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    padding: 10,
    borderRadius: 10,
    marginBottom: 14,
  },
  receiptCashierTag: {
    fontSize: 9,
    fontWeight: '800',
    color: '#64748B',
  },
  receiptCashierName: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 1,
  },
  verifiedStamp: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#86EFAC',
  },
  verifiedStampText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#166534',
  },
  modalActionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  downloadPdfBtn: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#4F46E5',
    paddingVertical: 10,
    borderRadius: 10,
  },
  downloadPdfBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  doneBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F5F9',
    paddingVertical: 10,
    borderRadius: 10,
  },
  doneBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
});
