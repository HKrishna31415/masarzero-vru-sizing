
import React from 'react';
import { type VRUResult } from '../types';

interface ResultsDisplayProps {
  results: VRUResult | null;
}

const ResultRow: React.FC<{ label: string; value: string; unit: string }> = ({ label, value, unit }) => (
  <div className="flex justify-between items-baseline py-3 border-b border-[var(--color-border)] last:border-b-0">
    <dt className="text-sm text-[var(--color-text-secondary)]">{label}</dt>
    <dd className="text-right">
      <span className="text-lg font-semibold text-[var(--color-text-primary)]">{value}</span>
      <span className="ml-1 text-sm text-[var(--color-text-secondary)]">{unit}</span>
    </dd>
  </div>
);

const InitialState: React.FC = () => (
  <div className="flex flex-col items-center justify-center h-full text-center bg-[var(--color-panel-alt-bg)] p-6 rounded-lg border-2 border-dashed border-[var(--color-border)]">
     <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-[var(--color-border)] mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
     </svg>
    <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">Awaiting Calculation</h3>
    <p className="text-sm text-[var(--color-text-secondary)] mt-1">Enter your parameters and click "Calculate" to see the results.</p>
  </div>
);

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results }) => {
  if (!results) {
    return <InitialState />;
  }

  return (
    <div className="bg-[var(--color-panel-alt-bg)] p-6 rounded-lg h-full border border-[var(--color-border)]">
      <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-4 border-b border-[var(--color-border)] pb-2">Calculation Results</h2>
      
      <div className="mb-6">
        <h3 className="text-md font-semibold text-[var(--color-text-tertiary)] mb-2">Suggested VRU Capacity <span className="text-xs font-normal text-[var(--color-text-secondary)]">(Working Losses)</span></h3>
        <dl>
          <ResultRow label="Imperial" value={results.suggested.vruCapacitySCFM.toFixed(2)} unit="SCFM" />
          <ResultRow label="Metric" value={results.suggested.vruCapacitySCMH.toFixed(2)} unit="SCMH" />
        </dl>
      </div>
      
      <div className="mb-6">
        <h3 className="text-md font-semibold text-[var(--color-text-tertiary)] mb-2">Minimum VRU Capacity <span className="text-xs font-normal text-[var(--color-text-secondary)]">(Breathing Losses)</span></h3>
        <dl>
          <ResultRow label="Imperial" value={results.minimum.vruCapacitySCFM.toFixed(2)} unit="SCFM" />
          <ResultRow label="Metric" value={results.minimum.vruCapacitySCMH.toFixed(2)} unit="SCMH" />
        </dl>
      </div>

      <div className="mb-6">
        <h3 className="text-md font-semibold text-[var(--color-text-tertiary)] mb-2">Working Loss Calculation Basis</h3>
        <dl>
          <ResultRow label="Highest RVP" value={results.suggested.rvpPSI.toFixed(2)} unit="psi" />
          <ResultRow label="Max Product Temp." value={results.suggested.maxTempF.toFixed(1)} unit="°F" />
          <ResultRow label="Calculated Vapor Volume Factor" value={results.suggested.volumetricFactor.toFixed(3)} unit="(ratio)" />
        </dl>
      </div>

      <div className="mb-6">
        <h3 className="text-md font-semibold text-[var(--color-text-tertiary)] mb-2">Total Liquid Flow Rate</h3>
        <dl>
          <ResultRow label="Imperial" value={results.suggested.totalFlowGPM.toFixed(2)} unit="GPM" />
          <ResultRow label="Metric" value={results.suggested.totalFlowLPM.toFixed(2)} unit="LPM" />
        </dl>
      </div>

      <div>
        <h3 className="text-md font-semibold text-[var(--color-text-tertiary)] mb-2">Recommended Compressor Size</h3>
        <dl>
          <ResultRow label="Horsepower (HP)" value={results.recommendedHP} unit="HP" />
        </dl>
      </div>
    </div>
  );
};