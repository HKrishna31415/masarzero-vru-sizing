import React, { useEffect, useState } from 'react';
import { useLang } from '../LanguageContext';
import {
  Fuel, ArrowLeft, Download, AlertTriangle, CheckCircle2, ChevronDown,
  Info, Building2, Droplets, FileText,
} from 'lucide-react';
import { MasarZeroLogo } from './MasarZeroLogo';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { GasStationPDFReport } from './GasStationPDFReport';

// ── Suggestion logic ──────────────────────────────────────────────────────────
type SuggestionTier = 'compact' | 'standard' | 'large' | 'none';

function getSuggestion(gasolineL: number, gasohlL: number): SuggestionTier {
  const combined = gasolineL + gasohlL;
  if (combined === 0) return 'none';
  if (combined < 200_000) return 'compact';
  if (combined > 2_000_000) return 'large';
  return 'standard';
}

// ── Sub-components ────────────────────────────────────────────────────────────
const SectionCard: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode }> = ({
  icon, title, children,
}) => (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-visible">
    <div className="flex items-center gap-3 px-4 sm:px-6 py-4 border-b border-gray-100 bg-gray-50/60">
      <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center shrink-0">
        {icon}
      </div>
      <h3 className="font-bold text-gray-800 text-sm">{title}</h3>
    </div>
    <div className="p-4 sm:p-6">{children}</div>
  </div>
);

const FieldWrap: React.FC<{ label: string; hint?: string; children: React.ReactNode }> = ({
  label, hint, children,
}) => (
  <div className="field-wrap">
    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
      {label}
    </label>
    {children}
    {hint && <p className="text-xs text-gray-400 mt-1 leading-relaxed">{hint}</p>}
  </div>
);

// ── Main component ────────────────────────────────────────────────────────────
export const GasStationQuestionnaire: React.FC<{ onBack: () => void; initialLocation?: { country: string; city: string } }> = ({ onBack, initialLocation }) => {
  const { t } = useLang();

  // Site info
  const [siteName, setSiteName]           = useState('');
  const [assessmentScope, setAssessmentScope] = useState<'single' | 'network'>('single');
  const [siteCountry, setSiteCountry]     = useState(initialLocation?.country || '');
  const [siteCity, setSiteCity]           = useState(initialLocation?.city || '');
  const [contactName, setContactName]     = useState('');
  const [contactEmail, setContactEmail]   = useState('');

  // Configuration
  const [tanksCount, setTanksCount]             = useState('');
  const [pumpsCount, setPumpsCount]             = useState('');
  const [dispensersCount, setDispensersCount]   = useState('');
  const [existingVRU, setExistingVRU]           = useState<string[]>([]);
  const [existingVRUOpen, setExistingVRUOpen]   = useState(false);
  const [installationYear, setInstallationYear] = useState('');
  const [networkStationCount, setNetworkStationCount] = useState('');
  const [averageNetworkSales, setAverageNetworkSales] = useState('');

  // Fuel sales (L/month)
  const [gasolineL, setGasolineL] = useState('');
  const [gasohlL,   setGasohlL]   = useState('');
  const [ethanolL,  setEthanolL]  = useState('');
  const [dieselL,   setDieselL]   = useState('');

  // Additional
  const [regulations, setRegulations] = useState('');
  const [notes, setNotes]             = useState('');

  useEffect(() => {
    if (siteCountry || siteCity) return;
    const controller = new AbortController();
    void fetch('https://ipapi.co/json/', { signal: controller.signal, cache: 'no-store' })
      .then((response) => response.ok ? response.json() : undefined)
      .then((data: { country_name?: string; country_capital?: string } | undefined) => {
        if (!data) return;
        setSiteCountry(data.country_name || '');
        setSiteCity(data.country_capital || '');
      }).catch(() => undefined);
    return () => controller.abort();
  }, []);

  // Derived
  const gasNum    = parseFloat(gasolineL) || 0;
  const gasohlNum = parseFloat(gasohlL)   || 0;
  const ethanolNum = parseFloat(ethanolL) || 0;
  const dieselNum  = parseFloat(dieselL)  || 0;
  const totalL     = gasNum + gasohlNum + ethanolNum + dieselNum;
  const suggestion = getSuggestion(gasNum, gasohlNum);
  const toggleExistingVRU = (option: string) => {
    setExistingVRU(current => current.includes(option)
      ? current.filter(value => value !== option)
      : [...current, option]);
  };

  const suggestionConfig = {
    compact: {
      bgClass:   'bg-teal-50 border-teal-200',
      textClass: 'text-teal-800',
      badgeClass:'bg-teal-100 text-teal-700',
      icon: <CheckCircle2 size={20} className="text-teal-600 shrink-0" />,
      label: t.suggestionCompactLabel,
      desc:  t.suggestionCompactDesc,
    },
    standard: {
      bgClass:   'bg-blue-50 border-blue-200',
      textClass: 'text-blue-800',
      badgeClass:'bg-blue-100 text-blue-700',
      icon: <CheckCircle2 size={20} className="text-blue-600 shrink-0" />,
      label: t.suggestionStandardLabel,
      desc:  t.suggestionStandardDesc,
    },
    large: {
      bgClass:   'bg-amber-50 border-amber-200',
      textClass: 'text-amber-800',
      badgeClass:'bg-amber-100 text-amber-700',
      icon: <AlertTriangle size={20} className="text-amber-500 shrink-0" />,
      label: t.suggestionLargeLabel,
      desc:  t.suggestionLargeDesc,
    },
    none: null,
  };

  const cfg = suggestion !== 'none' ? suggestionConfig[suggestion] : null;

  // PDF data object — rebuilt on every render so it's always fresh
  const pdfData = {
    siteName, assessmentScope, siteLocation: [siteCity, siteCountry].filter(Boolean).join(', '), contactName, contactEmail,
    tanksCount, pumpsCount, dispensersCount, existingVRU, installationYear, networkStationCount, averageNetworkSales,
    gasolineL, gasohlL, ethanolL, dieselL,
    regulations, notes,
    suggestion,
    totalL,
    t,
  };

  return (
    <div className="max-w-3xl mx-auto px-3 sm:px-4 py-5 sm:py-10">

      {/* ── Back ─────────────────────────────────────────────────────── */}
      <button
        onClick={onBack}
        className="mb-5 sm:mb-8 flex items-center gap-2 text-teal-600 font-semibold hover:text-teal-700 transition-colors text-sm"
      >
        <ArrowLeft size={16} />
        {t.backToSelection}
      </button>

      {/* ── Header card ──────────────────────────────────────────────── */}
      <div className="bg-gradient-to-br from-teal-700 to-teal-900 rounded-2xl sm:rounded-3xl p-5 sm:p-8 text-white mb-5 sm:mb-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-3 sm:gap-4 mb-3">
            <div className="w-12 h-12 bg-white/15 rounded-2xl flex items-center justify-center">
              <Fuel size={26} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight">{t.gasStationSizing}</h1>
              <p className="text-teal-200 text-sm mt-0.5">{t.gasStationSizingDesc}</p>
            </div>
          </div>
          <div className="mt-4 flex items-start gap-2.5 bg-white/10 rounded-xl p-3.5 border border-white/20">
            <Info size={15} className="text-teal-200 shrink-0 mt-0.5" />
            <p className="text-xs text-teal-100 leading-relaxed">{t.gasStationIntro}</p>
          </div>
        </div>
        <div className="absolute -right-16 -top-16 w-56 h-56 bg-teal-600/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-8 -bottom-12 w-40 h-40 bg-teal-800/40 rounded-full blur-2xl pointer-events-none" />
      </div>

      <div className="space-y-6">

        <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
          <h2 className="text-base font-bold text-gray-900">{t.assessmentScopeTitle}</h2>
          <p className="mt-1 text-sm text-gray-600">{t.assessmentScopeDesc}</p>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button type="button" onClick={() => setAssessmentScope('single')} aria-pressed={assessmentScope === 'single'} className={`min-h-14 rounded-lg border px-4 text-left text-sm font-bold ${assessmentScope === 'single' ? 'border-teal-700 bg-teal-50 text-teal-950' : 'border-gray-200 text-gray-700 hover:bg-gray-50'}`}>{t.singleStation}<span className="mt-1 block text-xs font-normal">{t.singleStationDesc}</span></button>
            <button type="button" onClick={() => setAssessmentScope('network')} aria-pressed={assessmentScope === 'network'} className={`min-h-14 rounded-lg border px-4 text-left text-sm font-bold ${assessmentScope === 'network' ? 'border-teal-700 bg-teal-50 text-teal-950' : 'border-gray-200 text-gray-700 hover:bg-gray-50'}`}>{t.retailNetwork}<span className="mt-1 block text-xs font-normal">{t.retailNetworkDesc}</span></button>
          </div>
        </section>

        {/* ── Site Information ─────────────────────────────────────────── */}
        <SectionCard icon={<Building2 size={16} className="text-teal-600" />} title={assessmentScope === 'single' ? t.gsSiteInfoTitle : t.networkInfoTitle}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FieldWrap label={assessmentScope === 'single' ? t.gsSiteName : t.networkName}>
              <input type="text" value={siteName} onChange={e => setSiteName(e.target.value)} placeholder={assessmentScope === 'single' ? t.ph_gsSiteName : t.ph_networkName} />
            </FieldWrap>
            <FieldWrap label={t.country} hint={t.locationSuggestion}>
              <input type="text" value={siteCountry} onChange={e => setSiteCountry(e.target.value)} placeholder={t.ph_country} />
            </FieldWrap>
            <FieldWrap label={t.cityRegion} hint={t.citySuggestion}>
              <input type="text" value={siteCity} onChange={e => setSiteCity(e.target.value)} placeholder={t.ph_city} />
            </FieldWrap>
            <FieldWrap label={t.contactPerson}>
              <input type="text" value={contactName} onChange={e => setContactName(e.target.value)} placeholder={t.ph_contact} />
            </FieldWrap>
            <FieldWrap label={t.contactEmail}>
              <input type="email" value={contactEmail} onChange={e => setContactEmail(e.target.value)} placeholder={t.ph_email} />
            </FieldWrap>
          </div>
        </SectionCard>

        {/* ── Station Configuration ─────────────────────────────────── */}
        {assessmentScope === 'single' && <SectionCard icon={<Fuel size={16} className="text-teal-600" />} title={t.gsConfigTitle}>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
            <FieldWrap label={t.numberOfTanks} hint={t.gsHintTanks}>
              <input type="number" min="1" value={tanksCount} onChange={e => setTanksCount(e.target.value)} placeholder="e.g. 4" />
            </FieldWrap>
            <FieldWrap label={t.numberOfPumps} hint={t.gsHintPumps}>
              <input type="number" min="1" value={pumpsCount} onChange={e => setPumpsCount(e.target.value)} placeholder="e.g. 8" />
            </FieldWrap>
            <FieldWrap label={t.gsDispensers} hint={t.gsHintDispensers}>
              <input type="number" min="1" value={dispensersCount} onChange={e => setDispensersCount(e.target.value)} placeholder="e.g. 16" />
            </FieldWrap>
            <FieldWrap label={t.gsExistingVRU} hint={t.gsExistingVRUHint}>
              <div className="relative">
                <button
                  type="button"
                  aria-expanded={existingVRUOpen}
                  onClick={() => setExistingVRUOpen(open => !open)}
                  className="flex w-full items-center justify-between rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-left text-sm text-gray-700 shadow-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-600/20"
                >
                  <span className={existingVRU.length ? 'text-gray-800' : 'text-gray-400'}>
                    {existingVRU.length ? `${existingVRU.length} selected` : t.gsSelectOption}
                  </span>
                  <ChevronDown size={17} className={`text-gray-500 transition-transform ${existingVRUOpen ? 'rotate-180' : ''}`} />
                </button>
                {existingVRUOpen && (
                  <div className="absolute left-0 right-0 z-20 mt-2 rounded-xl border border-gray-200 bg-white p-2 shadow-lg" role="group" aria-label={t.gsExistingVRU}>
                    {(t.gsExistingVRUOptions as unknown as string[]).map((o: string) => (
                      <button
                        key={o}
                        type="button"
                        aria-pressed={existingVRU.includes(o)}
                        onClick={() => toggleExistingVRU(o)}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border text-[10px] ${existingVRU.includes(o) ? 'border-teal-600 bg-teal-600 text-white' : 'border-gray-300 bg-white'}`}>{existingVRU.includes(o) ? '✓' : ''}</span>
                        {o}
                      </button>
                    ))}
                    <button type="button" onClick={() => setExistingVRUOpen(false)} className="mt-1 w-full border-t border-gray-100 pt-2 text-center text-xs font-semibold text-teal-700">Done</button>
                  </div>
                )}
              </div>
            </FieldWrap>
            <FieldWrap label={t.gsInstallYear} hint={t.gsHintInstallYear}>
              <input
                type="number" min="1990" max={new Date().getFullYear() + 5}
                value={installationYear} onChange={e => setInstallationYear(e.target.value)}
                placeholder={`e.g. ${new Date().getFullYear()}`}
              />
            </FieldWrap>
          </div>
        </SectionCard>}

        {assessmentScope === 'network' && <SectionCard icon={<Fuel size={16} className="text-teal-600" />} title={t.retailNetwork}><div className="grid grid-cols-1 gap-5 sm:grid-cols-2"><FieldWrap label={t.numberOfStations} hint={t.numberOfStationsHint}><input type="number" min="1" value={networkStationCount} onChange={e => setNetworkStationCount(e.target.value)} placeholder="e.g. 40" /></FieldWrap><FieldWrap label={`${t.averageStationSales} (L/${t.gsMonthUnit})`} hint={t.averageStationSalesHint}><input type="number" min="0" value={averageNetworkSales} onChange={e => setAverageNetworkSales(e.target.value)} placeholder="e.g. 500000" /></FieldWrap></div></SectionCard>}

        {/* ── Monthly Fuel Sales ────────────────────────────────────── */}
        {assessmentScope === 'single' && <SectionCard
          icon={<Droplets size={16} className="text-teal-600" />}
          title={`${t.amountSold} (L/${t.gsMonthUnit})`}
        >
          <p className="text-xs text-gray-500 mb-5 leading-relaxed">{t.gsFuelSalesHint}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FieldWrap label={t.gasoline} hint={t.gsGasolineHint}>
              <div className="unit-row">
                <input type="number" min="0" value={gasolineL} onChange={e => setGasolineL(e.target.value)} placeholder="0" />
                <span className="unit-badge">L/mo</span>
              </div>
            </FieldWrap>
            <FieldWrap label={t.gasohol} hint={t.gsGasohlHint}>
              <div className="unit-row">
                <input type="number" min="0" value={gasohlL} onChange={e => setGasohlL(e.target.value)} placeholder="0" />
                <span className="unit-badge">L/mo</span>
              </div>
            </FieldWrap>
            <FieldWrap label={t.ethanol}>
              <div className="unit-row">
                <input type="number" min="0" value={ethanolL} onChange={e => setEthanolL(e.target.value)} placeholder="0" />
                <span className="unit-badge">L/mo</span>
              </div>
            </FieldWrap>
            <FieldWrap label={t.diesel}>
              <div className="unit-row">
                <input type="number" min="0" value={dieselL} onChange={e => setDieselL(e.target.value)} placeholder="0" />
                <span className="unit-badge">L/mo</span>
              </div>
            </FieldWrap>
          </div>
          {totalL > 0 && (
            <div className="mt-5 flex items-center justify-between bg-gray-50 rounded-xl px-5 py-3 border border-gray-100">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{t.gsTotalThroughput}</span>
              <span className="text-base font-black text-gray-800">{totalL.toLocaleString()} L/mo</span>
            </div>
          )}
        </SectionCard>}

        {/* ── Regulations & Notes ───────────────────────────────────── */}
        <SectionCard icon={<Info size={16} className="text-teal-600" />} title={t.gsAdditionalTitle}>
          <div className="space-y-5">
            <FieldWrap label={t.envRegulations} hint={t.gsRegulationsHint}>
              <input type="text" value={regulations} onChange={e => setRegulations(e.target.value)} placeholder={t.ph_regulations} />
            </FieldWrap>
            <FieldWrap label={t.additionalNotes}>
              <textarea rows={3} value={notes} onChange={e => setNotes(e.target.value)} placeholder={t.ph_additionalNotes} />
            </FieldWrap>
          </div>
        </SectionCard>

        {/* ── Machine Suggestion ────────────────────────────────────── */}
        {assessmentScope === 'single' && cfg && (
          <div className={`rounded-2xl border-2 p-6 ${cfg.bgClass}`}>
            <div className="flex items-start gap-3 mb-3">
              {cfg.icon}
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h3 className={`font-black text-base ${cfg.textClass}`}>{t.gsSuggestionTitle}</h3>
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${cfg.badgeClass}`}>
                    {cfg.label}
                  </span>
                </div>
                <p className={`text-sm leading-relaxed ${cfg.textClass} opacity-90`}>{cfg.desc}</p>
              </div>
            </div>
            <div className="mt-4 flex items-start gap-2 bg-white/60 rounded-xl p-3.5 border border-white/80">
              <AlertTriangle size={14} className="text-gray-500 shrink-0 mt-0.5" />
              <p className="text-xs text-gray-600 leading-relaxed">{t.gsSuggestionDisclaimer}</p>
            </div>
          </div>
        )}

        {/* ── Download card ─────────────────────────────────────────── */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-lg p-8 relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8">

            {/* Logo + description */}
            <div className="flex flex-col items-center md:items-start gap-4">
              <MasarZeroLogo height={100} />
              <div className="flex items-start gap-2.5 max-w-sm">
                <FileText size={15} className="text-gray-400 shrink-0 mt-0.5" />
                <p className="text-sm text-gray-500 leading-relaxed">{t.gsSubmitDesc}</p>
              </div>
            </div>

            {/* PDF download button */}
            <PDFDownloadLink
              document={<GasStationPDFReport data={pdfData} />}
              fileName={`MasarZero_GasStation_${siteName || 'Report'}.pdf`}
            >
              {({ loading }) => (
                <button
                  disabled={loading}
                  className="flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-base text-white shadow-lg transition-all hover:opacity-90 hover:shadow-xl active:scale-95 disabled:opacity-60 shrink-0"
                  style={{ backgroundColor: '#0d9488' }}
                >
                  <Download size={20} className={loading ? 'animate-spin' : ''} />
                  {loading ? t.generatingPdf : t.downloadReport}
                </button>
              )}
            </PDFDownloadLink>
          </div>

          {/* Subtle decorative corner */}
          <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-teal-50 rounded-full opacity-60 pointer-events-none" />
        </div>

      </div>
    </div>
  );
};
