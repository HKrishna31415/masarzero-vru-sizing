import React from 'react';
import { Document, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import { RetailNetworkPortfolio, StorageRefineryPortfolioSite } from '../../store/usePortfolioStore';

const styles = StyleSheet.create({
  page: { padding: 32, fontSize: 10, fontFamily: 'Helvetica', color: '#111827' },
  title: { color: '#0f766e', fontFamily: 'Helvetica-Bold', fontSize: 18, marginBottom: 6 },
  subtitle: { color: '#4b5563', marginBottom: 20 },
  section: { marginBottom: 18 },
  heading: { backgroundColor: '#f0fdfa', color: '#115e59', fontFamily: 'Helvetica-Bold', padding: 7, marginBottom: 5 },
  row: { flexDirection: 'row', paddingVertical: 5, borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },
  label: { width: '48%', color: '#4b5563' }, value: { width: '52%', fontFamily: 'Helvetica-Bold' },
  tableHeader: { flexDirection: 'row', paddingVertical: 5, backgroundColor: '#f3f4f6', fontFamily: 'Helvetica-Bold' },
  tableRow: { flexDirection: 'row', paddingVertical: 5, borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },
  c1: { width: '27%' }, c2: { width: '19%' }, c3: { width: '18%' }, c4: { width: '18%' }, c5: { width: '18%' },
  note: { fontSize: 8, color: '#6b7280', marginTop: 14, lineHeight: 1.45 },
});

export const PortfolioPDFReport: React.FC<{ sites: StorageRefineryPortfolioSite[]; retailNetwork: RetailNetworkPortfolio }> = ({ sites, retailNetwork }) => {
  const total = (field: keyof StorageRefineryPortfolioSite) => sites.reduce((sum, site) => sum + (Number(site[field]) || 0), 0);
  const sales = (Number(retailNetwork.stationCount) || 0) * (Number(retailNetwork.averageMonthlySalesLitres) || 0);
  return <Document><Page size="A4" style={styles.page}>
    <Text style={styles.title}>Portfolio market overview</Text>
    <Text style={styles.subtitle}>User-provided screening information for engineering review. It is not a VRU design or commercial recommendation.</Text>
    <View style={styles.section}><Text style={styles.heading}>Storage and refinery sites</Text>
      <View style={styles.tableHeader}><Text style={styles.c1}>Site</Text><Text style={styles.c2}>Location / type</Text><Text style={styles.c3}>Normal inventory</Text><Text style={styles.c4}>Usable capacity</Text><Text style={styles.c5}>Throughput</Text></View>
      {sites.map((site) => <View key={site.id} style={styles.tableRow}><Text style={styles.c1}>{site.name || 'Unnamed site'}</Text><Text style={styles.c2}>{[site.city, site.country, site.siteType].filter(Boolean).join(' · ')}</Text><Text style={styles.c3}>{site.normalInventoryTonnes || '—'} t</Text><Text style={styles.c4}>{site.maximumUsableCapacityTonnes || '—'} t</Text><Text style={styles.c5}>{site.monthlyThroughputTonnes || '—'} t/month</Text></View>)}
      <View style={styles.row}><Text style={styles.label}>Portfolio totals</Text><Text style={styles.value}>{total('normalInventoryTonnes').toLocaleString()} t normal inventory · {total('maximumUsableCapacityTonnes').toLocaleString()} t usable capacity · {total('monthlyThroughputTonnes').toLocaleString()} t/month</Text></View>
    </View>
    <View style={styles.section}><Text style={styles.heading}>Retail network</Text>
      <View style={styles.row}><Text style={styles.label}>Coverage</Text><Text style={styles.value}>{[retailNetwork.region, retailNetwork.country].filter(Boolean).join(', ') || 'Not specified'}</Text></View>
      <View style={styles.row}><Text style={styles.label}>Stations / average monthly sales</Text><Text style={styles.value}>{retailNetwork.stationCount || '—'} stations · {retailNetwork.averageMonthlySalesLitres || '—'} L/station/month</Text></View>
      <View style={styles.row}><Text style={styles.label}>Estimated total monthly sales</Text><Text style={styles.value}>{sales.toLocaleString()} L/month</Text></View>
    </View>
    <Text style={styles.note}>Values are entered by the user. Confirm site conditions, design basis, standards, and engineering requirements during the detailed assessment.</Text>
  </Page></Document>;
};
