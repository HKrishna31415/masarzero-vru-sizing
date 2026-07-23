import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font, Image } from '@react-pdf/renderer';
import { QuestionnaireData } from '../../schema/questionnaireSchema';

// Register fonts if needed (e.g., for Chinese support)
// Font.register({ family: 'SourceHanSans', src: '...' });

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 10,
    fontFamily: 'Helvetica',
    color: '#333',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
    paddingBottom: 10,
  },
  logo: {
    width: 100,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#0d9488',
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    backgroundColor: '#F3F4F6',
    padding: 5,
    marginBottom: 5,
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#F9FAFB',
    paddingVertical: 3,
  },
  label: {
    width: '40%',
    fontWeight: 'bold',
    color: '#666',
  },
  value: {
    width: '60%',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    fontSize: 8,
    color: '#999',
    textAlign: 'center',
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    paddingTop: 10,
  },
});

interface PDFReportProps {
  data: QuestionnaireData;
  tokens: any;
  t: any;
}

export const PDFReport: React.FC<PDFReportProps> = ({ data, tokens, t }) => {
  const renderRow = (label: string, value?: string | number) => {
    if (!value) return null;
    return (
      <View style={styles.row}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value}</Text>
      </View>
    );
  };

  const renderUnitValue = (label: string, uv?: { value: string; unit: string }) => {
    if (!uv || !uv.value) return null;
    return renderRow(label, `${uv.value} ${uv.unit}`);
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Cover Page could be added here */}
        
        <View style={styles.header}>
          {tokens.logoUrl && <Image src={tokens.logoUrl} style={styles.logo} />}
          <View>
            <Text style={{ fontWeight: 'bold' }}>{tokens.companyName}</Text>
            <Text>{new Date().toLocaleDateString()}</Text>
          </View>
        </View>

        <Text style={styles.title}>{t.detailedVRUSpec}</Text>

        {/* Step 1: Project Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t.s1title}</Text>
          {renderRow(t.projectNameId, data.projectName)}
          {renderRow(t.country, data.siteCountry)}
          {renderRow(t.cityState, data.siteCity)}
          {renderRow(t.contactPerson, data.contactPerson)}
          {renderRow(t.contactEmail, data.contactEmail)}
        </View>

        {/* Step 2: Storage & Logistics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t.s2title}</Text>
          {renderRow(t.storageTypeLabel, data.storageType === 'Other' ? data.storageTypeOther : data.storageType)}
          {renderRow(t.deliveryMethod, data.deliveryMethod)}
          {renderRow('Transfer sources', data.transferSources?.join(', '))}
          {renderRow(t.loadingMethod, data.loadingMethod)}
          {data.loadingFrequency && renderRow(t.loadingFrequency, `${data.loadingFrequency} ${t.truckDay}`)}
          {data.simultaneousLoading && renderRow(t.simultaneousLoading, `${data.simultaneousLoading} ${t.trucksUnit}`)}
          {renderUnitValue(t.loadingPumpFlowRate, data.loadingPumpFlowRate)}
          {renderUnitValue('Pipeline / refinery transfer flow rate', data.pipelineTransferFlowRate)}
          {renderRow('Simultaneous transfer lines', data.simultaneousTransferLines)}
          {renderRow('Normal / peak transfer hours', data.normalTransferHours || data.peakTransferHours ? `${data.normalTransferHours || '—'} / ${data.peakTransferHours || '—'} h/day` : undefined)}
          {renderUnitValue('Transfer pressure', data.transferPressure)}
          {renderUnitValue(t.dischargePressure, data.dischargePressure)}
          {renderUnitValue(t.maxAmbientTemp, data.ambientTempMax)}
          {renderUnitValue(t.minAmbientTemp, data.ambientTempMin)}
        </View>

        {/* Step 3: Tank Inventory */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t.s3title}</Text>
          {renderRow('Tanks Count', data.tanks?.length)}
          {renderRow('Total normal inventory', `${(data.tanks || []).reduce((total, tank) => total + (Number(tank.normalInventory?.value) || 0), 0).toLocaleString()} t`)}
          {renderRow('Total maximum usable capacity', `${(data.tanks || []).reduce((total, tank) => total + (Number(tank.maximumUsableCapacity?.value) || 0), 0).toLocaleString()} t`)}
          {(data.tanks || []).map((tank, index) => renderRow(`Tank ${index + 1}: ${tank.tankId || 'Unidentified'}`, `${tank.product || 'Product not specified'} · normal ${tank.normalInventory?.value || '—'} t · max ${tank.maximumUsableCapacity?.value || '—'} t · vapor collection ${tank.vaporCollectionParticipation || '—'}`))}
          {renderUnitValue(t.blanketPressure, data.blanketingPressure)}
        </View>

        {/* Audit Log / Revision History */}
        <View style={[styles.section, { marginTop: 20, borderTopWidth: 1, borderTopColor: '#EEE', paddingTop: 10 }]}>
          <Text style={[styles.sectionTitle, { backgroundColor: 'transparent', padding: 0 }]}>Revision History</Text>
          <View style={styles.row}>
            <Text style={[styles.label, { width: '20%' }]}>Version</Text>
            <Text style={[styles.label, { width: '30%' }]}>Date</Text>
            <Text style={[styles.label, { width: '50%' }]}>Notes</Text>
          </View>
          <View style={styles.row}>
            <Text style={{ width: '20%' }}>2.0.0</Text>
            <Text style={{ width: '30%' }}>{new Date().toLocaleDateString()}</Text>
            <Text style={{ width: '50%' }}>Initial Specification (v2.0 Overhaul)</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text>{t.consultEngineer}</Text>
          <Text>© {new Date().getFullYear()} {tokens.companyName}. All rights reserved.</Text>
        </View>
      </Page>
    </Document>
  );
};
