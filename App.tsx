import React, { useState } from 'react';
import { DetailedQuestionnaire } from './components/DetailedQuestionnaire';
import { GasStationQuestionnaire } from './components/GasStationQuestionnaire';
import { PortfolioOverview } from './components/PortfolioOverview';
import { StartScreen } from './components/StartScreen';
import { ThemeProvider } from './ThemeContext';
import { useLang } from './LanguageContext';
import { type Language } from './i18n';
import { MasarZeroLogo } from './components/MasarZeroLogo';
import { useQuestionnaireStore } from './store/useQuestionnaireStore';
import { StorageRefineryPortfolioSite, usePortfolioStore } from './store/usePortfolioStore';

type Workflow = 'selection' | 'portfolio' | 'gas-station' | 'storage-facility';

const App: React.FC = () => {
  const { t, lang, setLang } = useLang();
  const [workflow, setWorkflow] = useState<Workflow>('selection');
  const [storageStage, setStorageStage] = useState<'portfolio' | 'details'>('portfolio');
  const { portfolio, retailNetwork } = usePortfolioStore();
  const portfolioSummarySite: StorageRefineryPortfolioSite = {
    id: 'portfolio-summary', name: `All relevant sites (${portfolio.siteCount || '—'})`, country: portfolio.country, city: portfolio.city, siteType: 'Storage Facility',
    normalInventoryTonnes: portfolio.totalNormalInventoryTonnes, maximumUsableCapacityTonnes: portfolio.totalMaximumUsableCapacityTonnes, monthlyThroughputTonnes: portfolio.totalMonthlyThroughputTonnes, priority: 'Medium',
  };

  const renderContent = () => {
    switch (workflow) {
      case 'selection':
        return <StartScreen onSelect={(type) => { if (type === 'gas-station') setWorkflow('gas-station'); else { setStorageStage('portfolio'); setWorkflow('storage-facility'); } }} />;
      case 'portfolio':
        return <PortfolioOverview onContinue={() => { setStorageStage('details'); }} onBack={() => setWorkflow('selection')} />;
      case 'gas-station':
        return <GasStationQuestionnaire onBack={() => setWorkflow('selection')} />;
      case 'storage-facility':
        if (storageStage === 'portfolio') return <PortfolioOverview onContinue={() => setStorageStage('details')} onBack={() => setWorkflow('selection')} />;
        return (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <button 
              onClick={() => setStorageStage('portfolio')}
              className="mb-8 flex items-center gap-2 text-teal-600 font-semibold hover:text-teal-700 transition-colors"
            >
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Back to portfolio overview
            </button>
            <DetailedQuestionnaire portfolioSites={[portfolioSummarySite]} retailNetwork={retailNetwork} />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen font-sans bg-gray-50" style={{ color: '#111827' }}>
        {/* ── Header ── */}
        {workflow !== 'selection' && <header className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
              {/* Logo */}
              <div className="flex items-center gap-2 cursor-pointer" onClick={() => setWorkflow('selection')}>
                <MasarZeroLogo height={32} />
              </div>

              {/* Controls */}
              <div className="flex items-center gap-3">
                <select
                  value={lang}
                  onChange={e => setLang(e.target.value as Language)}
                  className="text-xs font-bold px-3 py-1.5 rounded-lg border-2 border-gray-100 bg-white text-gray-600 cursor-pointer focus:border-teal-600 outline-none"
                  aria-label="Select language"
                >
                  <option value="en">EN</option>
                  <option value="zh">中文</option>
                  <option value="ar">العربية</option>
                </select>
              </div>
            </div>
        </header>}

        {/* ── Main Content ── */}
        <main>
          {renderContent()}
        </main>

        {/* ── Footer ── */}
        {workflow !== 'selection' && <footer className="text-center py-12 text-sm text-gray-500">
            <p>&copy; {new Date().getFullYear()} MasarZero. All rights reserved.</p>
            <p className="mt-1">For official use, consult a qualified engineer.</p>
        </footer>}
      </div>
    </ThemeProvider>
  );
};

export default App;
