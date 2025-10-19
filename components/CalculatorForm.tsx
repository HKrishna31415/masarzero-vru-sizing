
import React, { useState, useEffect } from 'react';
import { type VRUInput } from '../types';
import { CalculatorUnitField } from './CalculatorUnitField';
import { M3_TO_GAL_FACTOR, BBL_TO_GAL_FACTOR, BAR_TO_PSI_FACTOR, STANDARD_TEMP_F, GPM_TO_LPM_FACTOR } from '../constants';

interface CalculatorFormProps {
  onCalculate: (inputs: VRUInput) => void;
}

type FormState = {
    deliveryRate: { value: number | null, unit: 'LPM' | 'GPM' },
    simulOps: { value: number | null },
    rvp: { value: number | null, unit: 'psi' | 'bar' },
    maxTemp: { value: number | null, unit: '°C' | '°F' },
    safetyFactor: { value: number | null },
    tankVolume: { value: number | null, unit: 'm³' | 'gal' | 'bbl' },
    tempSwing: { value: number | null, unit: '°C' | '°F' },
};

export const CalculatorForm: React.FC<CalculatorFormProps> = ({ onCalculate }) => {
  const [formState, setFormState] = useState<FormState>({
    deliveryRate: { value: null, unit: 'LPM' },
    simulOps: { value: null },
    rvp: { value: null, unit: 'bar' },
    maxTemp: { value: null, unit: '°C' },
    safetyFactor: { value: 125 },
    tankVolume: { value: null, unit: 'm³' },
    tempSwing: { value: null, unit: '°C' },
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [calculatedFactor, setCalculatedFactor] = useState<number>(1.0);

  useEffect(() => {
    const { rvp, maxTemp } = formState;
    if (rvp.value === null || rvp.value <= 0 || maxTemp.value === null) {
      setCalculatedFactor(1.0);
      return;
    }

    const rvpPSI = rvp.unit === 'psi' ? rvp.value : rvp.value * BAR_TO_PSI_FACTOR;
    const maxTempF = maxTemp.unit === '°F' ? maxTemp.value : (maxTemp.value * 9/5) + 32;

    const tempCorrection = Math.max(0, (maxTempF - STANDARD_TEMP_F) / 20 * 0.1);
    const rvpCorrection = Math.max(0, rvpPSI / 5 * 0.1);
    const factor = 1.0 + tempCorrection + rvpCorrection;
    
    setCalculatedFactor(factor);

  }, [formState.rvp, formState.maxTemp]);

  const handleValueChange = (id: keyof FormState, value: string) => {
    const numericValue = value === '' ? null : parseFloat(value);
    setFormState(prev => ({
        ...prev,
        [id]: { ...prev[id], value: numericValue }
    }));
    if (id in errors && numericValue !== null && numericValue > 0) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[id];
        return newErrors;
      });
    }
  };
  
  const handleUnitChange = (id: keyof FormState, unit: any) => {
    setFormState(prev => ({
        ...prev,
        [id]: { ...prev[id], unit }
    }));
  };

  const validateInputs = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (formState.deliveryRate.value === null || formState.deliveryRate.value <= 0) newErrors.deliveryRate = "This field is required and must be positive.";
    if (formState.simulOps.value === null || formState.simulOps.value <= 0) newErrors.simulOps = "This field is required and must be positive.";
    if (formState.rvp.value === null || formState.rvp.value <= 0) newErrors.rvp = "This field is required and must be positive.";
    if (formState.maxTemp.value === null) newErrors.maxTemp = "This field is required.";
    if (formState.safetyFactor.value === null || formState.safetyFactor.value <= 0) newErrors.safetyFactor = "This field is required and must be positive.";
    if (formState.tankVolume.value === null || formState.tankVolume.value <= 0) newErrors.tankVolume = "This field is required and must be positive.";
    if (formState.tempSwing.value === null || formState.tempSwing.value <= 0) newErrors.tempSwing = "This field is required and must be positive.";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateInputs()) {
      const { deliveryRate, simulOps, rvp, maxTemp, safetyFactor, tankVolume, tempSwing } = formState;

      // Convert all inputs to the base units required for calculation (GPM, GAL, °F, psi)
      const maxDeliveryRateGPM = deliveryRate.unit === 'GPM' 
        ? deliveryRate.value 
        : (deliveryRate.value !== null ? deliveryRate.value / GPM_TO_LPM_FACTOR : null);
      
      const rvpPSI = rvp.unit === 'psi'
        ? rvp.value
        : (rvp.value !== null ? rvp.value * BAR_TO_PSI_FACTOR : null);
        
      const maxTempF = maxTemp.unit === '°F'
        ? maxTemp.value
        : (maxTemp.value !== null ? (maxTemp.value * 9/5) + 32 : null);

      const tankVolumeGAL = tankVolume.value === null ? null :
        tankVolume.unit === 'gal' ? tankVolume.value :
        tankVolume.unit === 'm³' ? tankVolume.value * M3_TO_GAL_FACTOR :
        tankVolume.value * BBL_TO_GAL_FACTOR;

      const tempSwingF = tempSwing.unit === '°F'
        ? tempSwing.value
        : (tempSwing.value !== null ? (tempSwing.value * 9/5) : null); // Temp swing conversion is direct

      onCalculate({
          maxDeliveryRateGPM,
          simulOps: simulOps.value,
          rvpPSI,
          maxTempF,
          safetyFactor: safetyFactor.value !== null ? safetyFactor.value / 100 : null,
          tankVolumeGAL,
          tempSwingF
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-4 border-b border-[var(--color-border)] pb-2">Working Losses (Loading)</h2>
        <p className="text-xs text-[var(--color-text-secondary)] -mt-3 mb-3">Determines the suggested VRU size based on maximum operational flow.</p>
        <CalculatorUnitField
            id="deliveryRate"
            label="Max Delivery Rate"
            value={formState.deliveryRate.value}
            onValueChange={(val) => handleValueChange('deliveryRate', val)}
            unit={formState.deliveryRate.unit}
            onUnitChange={(unit) => handleUnitChange('deliveryRate', unit)}
            units={['LPM', 'GPM']}
            error={errors.deliveryRate}
            placeholder="e.g., 1900"
        />
        <CalculatorUnitField
            id="simulOps"
            label="Max Simultaneous Operations"
            value={formState.simulOps.value}
            onValueChange={(val) => handleValueChange('simulOps', val)}
            units={['Integer']}
            error={errors.simulOps}
            placeholder="e.g., 2"
            isInteger={true}
        />
         <CalculatorUnitField
            id="rvp"
            label="Highest RVP"
            value={formState.rvp.value}
            onValueChange={(val) => handleValueChange('rvp', val)}
            unit={formState.rvp.unit}
            onUnitChange={(unit) => handleUnitChange('rvp', unit)}
            units={['bar', 'psi']}
            error={errors.rvp}
            placeholder="e.g., 0.7"
        />
        <CalculatorUnitField
            id="maxTemp"
            label="Max Product Temperature"
            value={formState.maxTemp.value}
            onValueChange={(val) => handleValueChange('maxTemp', val)}
            unit={formState.maxTemp.unit}
            onUnitChange={(unit) => handleUnitChange('maxTemp', unit)}
            units={['°C', '°F']}
            error={errors.maxTemp}
            placeholder="e.g., 35"
        />
        <div className="mb-4">
            <label htmlFor="calculated-factor" className="block text-sm font-medium text-[var(--color-text-tertiary)] mb-1">Calculated Vapor Volume Factor</label>
            <div className="relative">
                <input id="calculated-factor" type="text" readOnly value={calculatedFactor.toFixed(3)} className="w-full pl-3 pr-16 py-2 border border-[var(--color-border)] rounded-md bg-[var(--color-panel-alt-bg)] text-[var(--color-text-primary)] font-medium cursor-not-allowed"/>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className="text-[var(--color-text-secondary)] text-sm">(ratio)</span>
                </div>
            </div>
        </div>
        <CalculatorUnitField
            id="safetyFactor"
            label="Safety Factor"
            value={formState.safetyFactor.value}
            onValueChange={(val) => handleValueChange('safetyFactor', val)}
            units={['%']}
            error={errors.safetyFactor}
            placeholder="e.g., 125"
        />
      </div>

       <div>
        <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-4 border-b border-[var(--color-border)] pb-2">Breathing Losses (Storage)</h2>
        <p className="text-xs text-[var(--color-text-secondary)] -mt-3 mb-3">Determines the minimum VRU size based on thermal vapor expansion.</p>
        <CalculatorUnitField
            id="tankVolume"
            label="Total Tank Volume"
            value={formState.tankVolume.value}
            onValueChange={(val) => handleValueChange('tankVolume', val)}
            unit={formState.tankVolume.unit}
            onUnitChange={(unit) => handleUnitChange('tankVolume', unit)}
            units={['m³', 'gal', 'bbl']}
            placeholder="e.g., 75"
            error={errors.tankVolume}
        />
        <CalculatorUnitField
            id="tempSwing"
            label="Avg. Daily Temperature Swing"
            value={formState.tempSwing.value}
            onValueChange={(val) => handleValueChange('tempSwing', val)}
            unit={formState.tempSwing.unit}
            onUnitChange={(unit) => handleUnitChange('tempSwing', unit)}
            units={['°C', '°F']}
            placeholder="e.g., 15"
            error={errors.tempSwing}
        />
      </div>

      <button
        type="submit"
        className="w-full bg-[var(--color-accent-primary)] text-[var(--color-accent-text)] font-bold py-3 px-4 rounded-lg hover:opacity-90 focus:outline-none focus:ring-4 focus:ring-[var(--color-accent-primary)]/50 transition-all duration-300 shadow-md hover:shadow-lg"
      >
        Calculate VRU Capacity
      </button>
    </form>
  );
};