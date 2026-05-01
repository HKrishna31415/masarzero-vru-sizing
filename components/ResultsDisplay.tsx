import React, { useState } from 'react';
import { type VRUResult } from '../types';
import { useLang } from '../LanguageContext';

type UnitSystem = 'imperial' | 'metric';

interface ResultsDisplayProps {
  results: VRUResult | null;
}

const ResultRow: React.FC<{ label: string; value: string; unit: string }> = ({ label, value, unit }) => (
  <div className="flex justify-between items-baseline py-3 border-b border-(--color-border) last:border-b-0">
    <dt className="text-sm text-(--color-text-secondary)">{label}</dt>
    <dd className="text-right">
      <span className="text-lg font-semibold text-(--color-text-primary)">{value}</span>
      <span className="ml-1 text-sm text-(--color-text-secondary)">{unit}</span>
    </dd>
  </div>
);

const InitialState: React.FC = () => {
  const { t } = useLang();
  return (
    <div className="flex flex-col items-center justify-center h-full text-center bg-(--color-panel-alt-bg) p-6 rounded-lg border-2 border-dashed border-(--color-border)">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-(--color-border) mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
      <h3 className="text-lg font-semibold text-(--color-text-primary)">{t.awaitingCalc}</h3>
      <p className="text-sm text-(--color-text-secondary) mt-1">{t.awaitingCalcDesc}</p>
    </div>
  );
};

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results }) => {
  const { t } = useLang();
  const [unitSystem, setUnitSystem] = useState<UnitSystem>('metric');

  if (!results) return <InitialState />;

  const imp = unitSystem === 'imperial';

  const vruSuggested  = imp ? results.suggested.vruCapacitySCFM : results.suggested.vruCapacitySCMH;
  const vruMinimum    = imp ? results.minimum.vruCapacitySCFM   : results.minimum.vruCapacitySCMH;
  const vruUnit       = imp ? 'SCFM' : 'SCMH';

  const flow          = imp ? results.suggested.totalFlowGPM : results.suggested.totalFlowLPM;
  const flowUnit      = imp ? 'GPM' : 'LPM';

  const rvp           = imp ? results.suggested.rvpPSI : results.suggested.rvpPSI * 0.0689476;
  const rvpUnit       = imp ? 'psi' : 'bar';

  const temp          = imp ? results.suggested.maxTempF : (results.suggested.maxTempF - 32) * 5 / 9;
  const tempUnit      = imp ? '°F' : '°C';

  return (
    <div className="bg-(--color-panel-alt-bg) p-6 rounded-lg h-full border border-(--color-border)">

      {/* Header + unit toggle */}
      <div className="flex items-center justify-between mb-4 border-b border-(--color-border) pb-2">
        <h2 className="text-xl font-semibold text-(--color-text-primary)">{t.calcResults}</h2>
        <div className="flex items-center bg-(--color-panel-bg) rounded-full p-0.5 border border-(--color-border) text-xs font-semibold">
          <button
            onClick={() => setUnitSystem('metric')}
            className={`px-3 py-1 rounded-full transition-colors duration-200 ${
              unitSystem === 'metric'
                ? 'bg-(--color-accent-primary) text-(--color-accent-text)'
                : 'text-(--color-text-secondary) hover:text-(--color-text-primary)'
            }`}
          >
            {t.metric}
          </button>
          <button
            onClick={() => setUnitSystem('imperial')}
            className={`px-3 py-1 rounded-full transition-colors duration-200 ${
              unitSystem === 'imperial'
                ? 'bg-(--color-accent-primary) text-(--color-accent-text)'
                : 'text-(--color-text-secondary) hover:text-(--color-text-primary)'
            }`}
          >
            {t.imperial}
          </button>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-md font-semibold text-(--color-text-tertiary) mb-2">
          {t.suggestedVRU} <span className="text-xs font-normal text-(--color-text-secondary)">{t.workingLossesParens}</span>
        </h3>
        <dl>
          <ResultRow label={t.vruCapacity} value={vruSuggested.toFixed(2)} unit={vruUnit} />
        </dl>
      </div>

      <div className="mb-6">
        <h3 className="text-md font-semibold text-(--color-text-tertiary) mb-2">
          {t.minimumVRU} <span className="text-xs font-normal text-(--color-text-secondary)">{t.breathingLossesParens}</span>
        </h3>
        <dl>
          <ResultRow label={t.vruCapacity} value={vruMinimum.toFixed(2)} unit={vruUnit} />
        </dl>
      </div>

      <div className="mb-6">
        <h3 className="text-md font-semibold text-(--color-text-tertiary) mb-2">{t.workingLossBasis}</h3>
        <dl>
          <ResultRow label={t.highestRVP}            value={rvp.toFixed(imp ? 2 : 4)}                    unit={rvpUnit} />
          <ResultRow label={t.maxProductTempShort}   value={temp.toFixed(1)}                              unit={tempUnit} />
          <ResultRow label={t.calculatedVaporFactor} value={results.suggested.volumetricFactor.toFixed(3)} unit="(ratio)" />
        </dl>
      </div>

      <div className="mb-6">
        <h3 className="text-md font-semibold text-(--color-text-tertiary) mb-2">{t.totalLiquidFlow}</h3>
        <dl>
          <ResultRow label={t.flowRate} value={flow.toFixed(2)} unit={flowUnit} />
        </dl>
      </div>

      <div>
        <h3 className="text-md font-semibold text-(--color-text-tertiary) mb-2">{t.recommendedCompressor}</h3>
        <dl>
          <ResultRow label={t.horsepower} value={results.recommendedHP} unit="HP" />
        </dl>
      </div>

    </div>
  );
};
