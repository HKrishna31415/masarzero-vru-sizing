import React, { useState, useEffect } from 'react';
import { CalculatorForm } from './components/CalculatorForm';
import { ResultsDisplay } from './components/ResultsDisplay';
import { DetailedQuestionnaire } from './components/DetailedQuestionnaire';
import { type VRUInput, type VRUResult } from './types';
import { GPM_TO_FT3_FACTOR, SCFM_TO_SCMH_FACTOR, GPM_TO_LPM_FACTOR, BREATHING_LOSS_EMPIRICAL_FACTOR, STANDARD_TEMP_F, HP_SIZES, HP_CALCULATION_DIVISOR } from './constants';

type Theme = 'light' | 'dark' | 'gold';
type Tab = 'calculator' | 'questionnaire';

const App: React.FC = () => {
  const [results, setResults] = useState<VRUResult | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('calculator');
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  const handleCalculate = (inputs: VRUInput) => {
    if (
      inputs.maxDeliveryRateGPM === null ||
      inputs.simulOps === null ||
      inputs.rvpPSI === null ||
      inputs.maxTempF === null ||
      inputs.safetyFactor === null ||
      inputs.tankVolumeGAL === null ||
      inputs.tempSwingF === null
    ) {
      setResults(null);
      return;
    }

    // Calculate Vapor Volume Factor based on RVP and Temperature
    const tempCorrection = Math.max(0, (inputs.maxTempF - STANDARD_TEMP_F) / 20 * 0.1);
    const rvpCorrection = Math.max(0, inputs.rvpPSI / 5 * 0.1);
    const volumetricFactor = 1.0 + tempCorrection + rvpCorrection;

    // Suggested size based on Working Losses
    const totalFlowGPM = inputs.maxDeliveryRateGPM * inputs.simulOps;
    const suggestedCapacitySCFM = totalFlowGPM * GPM_TO_FT3_FACTOR * volumetricFactor * inputs.safetyFactor;
    
    // Minimum size based on Breathing Losses
    const minimumCapacitySCFM = inputs.tankVolumeGAL * inputs.tempSwingF * BREATHING_LOSS_EMPIRICAL_FACTOR;

    // Metric Conversions
    const totalFlowLPM = totalFlowGPM * GPM_TO_LPM_FACTOR;
    const suggestedCapacitySCMH = suggestedCapacitySCFM * SCFM_TO_SCMH_FACTOR;
    const minimumCapacitySCMH = minimumCapacitySCFM * SCFM_TO_SCMH_FACTOR;

    // HP Calculation
    const calculatedHP = suggestedCapacitySCFM / HP_CALCULATION_DIVISOR;
    let recommendedHP = '150+'; // Default for sizes larger than the max standard size
    const foundSize = HP_SIZES.find(size => size.value >= calculatedHP);
    
    if (foundSize) {
      recommendedHP = foundSize.display;
    }

    setResults({
      suggested: {
        totalFlowGPM,
        totalFlowLPM,
        vruCapacitySCFM: suggestedCapacitySCFM,
        vruCapacitySCMH: suggestedCapacitySCMH,
        volumetricFactor,
        rvpPSI: inputs.rvpPSI,
        maxTempF: inputs.maxTempF,
      },
      minimum: {
        vruCapacitySCFM: minimumCapacitySCFM,
        vruCapacitySCMH: minimumCapacitySCMH,
      },
      recommendedHP,
    });
  };

   const ThemeSwitcher: React.FC = () => {
    const themes: { name: Theme, color: string }[] = [
      { name: 'light', color: '#FDFBF6' },
      { name: 'dark', color: '#121212' },
      { name: 'gold', color: '#F5D781' },
    ];

    return (
      <div className="flex items-center space-x-2 bg-[var(--color-panel-bg)] p-1 rounded-full border border-[var(--color-border)] shadow-inner">
        {themes.map(({ name, color }) => (
          <button
            key={name}
            onClick={() => setTheme(name)}
            className={`w-6 h-6 rounded-full focus:outline-none transition-all duration-200 ${
              theme === name 
              ? 'ring-2 ring-offset-2 ring-[var(--color-accent-primary)] ring-offset-[var(--color-panel-bg)]' 
              : 'hover:scale-110 hover:ring-1 hover:ring-[var(--color-border)]'
            }`}
            style={{ backgroundColor: color, border: '1px solid var(--color-border)' }}
            aria-label={`Switch to ${name} theme`}
          />
        ))}
      </div>
    );
  };

  const Header: React.FC<{ logoUrl: string }> = ({ logoUrl }) => (
    <header className="bg-[var(--color-header-bg)] text-[var(--color-header-text)] border-b border-[var(--color-border)]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-2 flex justify-between items-center">
            <div className="flex items-center">
                <img src={logoUrl} alt="Sevali Energy Logo" className="h-20" />
            </div>
            <ThemeSwitcher />
        </div>
    </header>
  );

  const TabButton: React.FC<{tab: Tab, label: string}> = ({tab, label}) => {
    const isActive = activeTab === tab;
    return (
        <button
            onClick={() => setActiveTab(tab)}
            className={`py-3 px-6 font-semibold text-sm rounded-t-lg focus:outline-none transition-colors duration-300 ${
                isActive 
                ? 'bg-[var(--color-panel-bg)] text-[var(--color-text-primary)]' 
                : 'bg-transparent text-[var(--color-text-secondary)] hover:bg-[var(--color-panel-bg)]/50 hover:text-[var(--color-text-primary)]'
            }`}
        >
            {label}
        </button>
    );
  };
  
  const logos: Record<Theme, string> = {
      light: 'https://i.ibb.co/Zpx00M2n/sevalitransparentlogo.png',
      dark: 'https://i.ibb.co/mFTGjqxj/sevaliyellow.png',
      gold: 'https://i.ibb.co/JjLCgLNb/sevaliblack.png',
  };
  const currentLogo = logos[theme];

  return (
    <div className="min-h-screen font-sans text-[var(--color-text-primary)]">
      <Header logoUrl={currentLogo} />
      <main className="w-full max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="mt-4">
            <nav className="flex border-b border-[var(--color-border)]">
                <TabButton tab="calculator" label="Sizing Calculator" />
                <TabButton tab="questionnaire" label="Detailed Questionnaire" />
            </nav>
            <div className="bg-[var(--color-panel-bg)] rounded-b-2xl shadow-2xl p-8 md:p-12">
                {activeTab === 'calculator' && (
                    <>
                        <div className="text-center mb-8">
                           <h2 className="text-3xl font-bold text-[var(--color-text-primary)]">VRU Sizing Calculator</h2>
                           <p className="text-[var(--color-text-secondary)] mt-1">Estimate Vapor Recovery Unit capacity for industrial compliance.</p>
                        </div>
                        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
                            <CalculatorForm onCalculate={handleCalculate} />
                            <ResultsDisplay results={results} />
                        </div>
                    </>
                )}
                {activeTab === 'questionnaire' && (
                    <DetailedQuestionnaire />
                )}
            </div>
        </div>
        <footer className="text-center mt-8 text-sm text-[var(--color-text-secondary)]">
          <p>&copy; {new Date().getFullYear()} Sevali Energy. All rights reserved.</p>
          <p className="mt-1">For official use, consult a qualified engineer.</p>
        </footer>
      </main>
    </div>
  );
};

export default App;