import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';

const TEAL = '#0d9488';
const TEAL_DARK = '#0f766e';
const GRAY_LIGHT = '#F3F4F6';
const GRAY_MID = '#E5E7EB';
const GRAY_TEXT = '#6B7280';
const BLACK = '#111827';

const styles = StyleSheet.create({
  page: {
    padding: 36,
    fontSize: 10,
    fontFamily: 'Helvetica',
    color: BLACK,
    backgroundColor: '#FFFFFF',
  },
  // ── Header ──
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    paddingBottom: 14,
    borderBottomWidth: 2,
    borderBottomColor: TEAL,
  },
  logo: {
    width: 130,
    height: 73, // 1826×1030 ratio
    objectFit: 'contain',
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  headerTitle: {
    fontSize: 16,
    fontFamily: 'Helvetica-Bold',
    color: TEAL_DARK,
  },
  headerSub: {
    fontSize: 9,
    color: GRAY_TEXT,
    marginTop: 3,
  },
  // ── Section ──
  section: {
    marginBottom: 16,
  },
  sectionHeader: {
    backgroundColor: TEAL,
    paddingVertical: 5,
    paddingHorizontal: 8,
    marginBottom: 6,
    borderRadius: 3,
  },
  sectionTitle: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: '#FFFFFF',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  // ── Row ──
  row: {
    flexDirection: 'row',
    paddingVertical: 4,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: GRAY_MID,
  },
  rowAlt: {
    backgroundColor: GRAY_LIGHT,
  },
  label: {
    width: '42%',
    fontFamily: 'Helvetica-Bold',
    color: GRAY_TEXT,
    fontSize: 9,
  },
  value: {
    width: '58%',
    color: BLACK,
    fontSize: 9,
  },
  // ── Suggestion box ──
  suggestionBox: {
    marginTop: 8,
    padding: 10,
    borderRadius: 4,
    borderWidth: 1,
  },
  suggestionTitle: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 4,
  },
  suggestionText: {
    fontSize: 9,
    lineHeight: 1.5,
  },
  // ── Disclaimer ──
  disclaimer: {
    marginTop: 10,
    padding: 8,
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderRadius: 4,
  },
  disclaimerText: {
    fontSize: 8,
    color: '#92400E',
    lineHeight: 1.5,
  },
  // ── Footer ──
  footer: {
    position: 'absolute',
    bottom: 28,
    left: 36,
    right: 36,
    borderTopWidth: 1,
    borderTopColor: GRAY_MID,
    paddingTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerText: {
    fontSize: 7.5,
    color: GRAY_TEXT,
  },
});

export interface GasStationFormData {
  siteName: string;
  assessmentScope: 'single' | 'network';
  siteLocation: string;
  contactName: string;
  contactEmail: string;
  tanksCount: string;
  pumpsCount: string;
  dispensersCount: string;
  existingVRU: string[];
  installationYear: string;
  networkStationCount: string;
  averageNetworkSales: string;
  gasolineL: string;
  gasohlL: string;
  ethanolL: string;
  dieselL: string;
  regulations: string;
  notes: string;
  suggestion: 'compact' | 'standard' | 'large' | 'none';
  totalL: number;
  t: any;
}

export const GasStationPDFReport: React.FC<{ data: GasStationFormData }> = ({ data }) => {
  const { t } = data;

  const renderRow = (label: string, value: string | number | undefined, alt = false) => {
    if (!value && value !== 0) return null;
    return (
      <View style={[styles.row, alt ? styles.rowAlt : {}]}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{String(value)}</Text>
      </View>
    );
  };

  const suggestionLabels: Record<string, { label: string; desc: string; color: string; bg: string; border: string }> = {
    compact:  { label: t.suggestionCompactLabel,  desc: t.suggestionCompactDesc,  color: '#065F46', bg: '#ECFDF5', border: '#6EE7B7' },
    standard: { label: t.suggestionStandardLabel, desc: t.suggestionStandardDesc, color: '#1E3A8A', bg: '#EFF6FF', border: '#93C5FD' },
    large:    { label: t.suggestionLargeLabel,    desc: t.suggestionLargeDesc,    color: '#92400E', bg: '#FFFBEB', border: '#FCD34D' },
  };

  const sg = data.suggestion !== 'none' ? suggestionLabels[data.suggestion] : null;

  return (
    <Document>
      <Page size="A4" style={styles.page}>

        {/* ── Header ── */}
        <View style={styles.header}>
          <Image src="/masarzerologo.png" style={styles.logo} />
          <View style={styles.headerRight}>
            <Text style={styles.headerTitle}>{t.gasStationSizing}</Text>
            <Text style={styles.headerSub}>{new Date().toLocaleDateString()}</Text>
            <Text style={styles.headerSub}>MasarZero VRU Assessment</Text>
          </View>
        </View>

        {/* ── Site Information ── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t.gsSiteInfoTitle}</Text>
          </View>
          {renderRow(t.gsSiteName,      data.siteName,      false)}
          {renderRow(t.gsSiteLocation,  data.siteLocation,  true)}
          {renderRow(t.contactPerson,   data.contactName,   false)}
          {renderRow(t.contactEmail,    data.contactEmail,  true)}
          {renderRow(t.assessmentScopeTitle, data.assessmentScope === 'network' ? t.retailNetwork : t.singleStation, false)}
        </View>

        {/* ── Station Configuration ── */}
        {data.assessmentScope === 'single' && <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t.gsConfigTitle}</Text>
          </View>
          {renderRow(t.numberOfTanks,   data.tanksCount,       false)}
          {renderRow(t.numberOfPumps,   data.pumpsCount,       true)}
          {renderRow(t.gsDispensers,    data.dispensersCount,  false)}
          {renderRow(t.gsExistingVRU,   data.existingVRU.join(', '), true)}
          {renderRow(t.gsInstallYear,   data.installationYear, false)}
        </View>}

        {data.assessmentScope === 'network' && <View style={styles.section}><View style={styles.sectionHeader}><Text style={styles.sectionTitle}>{t.retailNetwork}</Text></View>{renderRow(t.numberOfStations, data.networkStationCount, false)}{renderRow(t.averageStationSales, data.averageNetworkSales ? `${Number(data.averageNetworkSales).toLocaleString()} L/${t.gsMonthUnit}` : undefined, true)}</View>}

        {/* ── Monthly Fuel Sales ── */}
        {data.assessmentScope === 'single' && <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{`${t.amountSold} (L/${t.gsMonthUnit})`}</Text>
          </View>
          {renderRow(t.gasoline,  data.gasolineL ? `${Number(data.gasolineL).toLocaleString()} L` : '—', false)}
          {renderRow(t.gasohol,   data.gasohlL   ? `${Number(data.gasohlL).toLocaleString()} L`   : '—', true)}
          {renderRow(t.ethanol,   data.ethanolL  ? `${Number(data.ethanolL).toLocaleString()} L`  : '—', false)}
          {renderRow(t.diesel,    data.dieselL   ? `${Number(data.dieselL).toLocaleString()} L`   : '—', true)}
          {renderRow(t.gsTotalThroughput, `${data.totalL.toLocaleString()} L`, false)}
        </View>}

        {/* ── Regulations & Notes ── */}
        {(data.regulations || data.notes) && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{t.gsAdditionalTitle}</Text>
            </View>
            {renderRow(t.envRegulations, data.regulations, false)}
            {renderRow(t.additionalNotes, data.notes, true)}
          </View>
        )}

        {/* ── Machine Suggestion ── */}
        {data.assessmentScope === 'single' && sg && (
          <View style={[styles.suggestionBox, { backgroundColor: sg.bg, borderColor: sg.border }]}>
            <Text style={[styles.suggestionTitle, { color: sg.color }]}>
              {t.gsSuggestionTitle}: {sg.label}
            </Text>
            <Text style={[styles.suggestionText, { color: sg.color }]}>{sg.desc}</Text>
          </View>
        )}

        {/* ── Disclaimer ── */}
        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerText}>{t.gsSuggestionDisclaimer}</Text>
        </View>

        {/* ── Footer ── */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>© {new Date().getFullYear()} MasarZero. {t.allRightsReserved}</Text>
          <Text style={styles.footerText}>{t.consultEngineer}</Text>
        </View>

      </Page>
    </Document>
  );
};
