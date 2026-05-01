
import React, { useState, useEffect } from 'react';
import { type VRUInput } from '../types';
import { CalculatorUnitField } from './CalculatorUnitField';
import { M3_TO_GAL_FACTOR, BBL_TO_GAL_FACTOR, BAR_TO_PSI_FACTOR, STANDARD_TEMP_F, GPM_TO_LPM_FACTOR } from '../constants';
import { useLang } from '../LanguageContext';

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
  const { t } = useLang();
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
    if (formState.deliveryRate.value === null || formState.deliveryRate.value <= 0) newErrors.deliveryRate = t.fieldRequired;
    if (formState.simulOps.value === null || formState.simulOps.value <= 0) newErrors.simulOps = t.fieldRequired;
    if (formState.rvp.value === null || formState.rvp.value <= 0) newErrors.rvp = t.fieldRequired;
    if (formState.maxTemp.value === null) newErrors.maxTemp = t.fieldRequiredOnly;
    if (formState.safetyFactor.value === null || formState.safetyFactor.value <= 0) newErrors.safetyFactor = t.fieldRequired;
    if (formState.tankVolume.value === null || formState.tankVolume.value <= 0) newErrors.tankVolume = t.fieldRequired;
    if (formState.tempSwing.value === null || formState.tempSwing.value <= 0) newErrors.tempSwing = t.fieldRequired;
    
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
        <h2 className="text-xl font-semibold text-(--color-text-primary) mb-4 border-b border-(--color-border) pb-2">{t.workingLossesTitle}</h2>
        <p className="text-xs text-(--color-text-secondary) -mt-3 mb-3">{t.workingLossesDesc}</p>
        <CalculatorUnitField
            id="deliveryRate"
            label={t.maxDeliveryRate}
            value={formState.deliveryRate.value}
            onValueChange={(val) => handleValueChange('deliveryRate', val)}
            unit={formState.deliveryRate.unit}
            onUnitChange={(unit) => handleUnitChange('deliveryRate', unit)}
            units={['LPM', 'GPM']}
            error={errors.deliveryRate}
            placeholder={t.ph_deliveryRate}
        />
        <CalculatorUnitField
            id="simulOps"
            label={t.maxSimultaneousOps}
            value={formState.simulOps.value}
            onValueChange={(val) => handleValueChange('simulOps', val)}
            units={['Integer']}
            error={errors.simulOps}
            placeholder={t.ph_simulOps}
            isInteger={true}
        />
         <CalculatorUnitField
            id="rvp"
            label={t.highestRVP}
            value={formState.rvp.value}
            onValueChange={(val) => handleValueChange('rvp', val)}
            unit={formState.rvp.unit}
            onUnitChange={(unit) => handleUnitChange('rvp', unit)}
            units={['bar', 'psi']}
            error={errors.rvp}
            placeholder={t.ph_rvp}
        />
        <CalculatorUnitField
            id="maxTemp"
            label={t.maxProductTemp}
            value={formState.maxTemp.value}
            onValueChange={(val) => handleValueChange('maxTemp', val)}
            unit={formState.maxTemp.unit}
            onUnitChange={(unit) => handleUnitChange('maxTemp', unit)}
            units={['°C', '°F']}
            error={errors.maxTemp}
            placeholder={t.ph_temp}
        />
        <div className="mb-4">
            <label htmlFor="calculated-factor" className="block text-sm font-medium text-(--color-text-tertiary) mb-1">{t.calculatedVaporFactor}</label>
            <div className="relative">
                <input id="calculated-factor" type="text" readOnly value={calculatedFactor.toFixed(3)} className="w-full pl-3 pr-16 py-2 border border-(--color-border) rounded-md bg-(--color-panel-alt-bg) text-(--color-text-primary) font-medium cursor-not-allowed"/>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className="text-(--color-text-secondary) text-sm">(ratio)</span>
                </div>
            </div>
        </div>
        <CalculatorUnitField
            id="safetyFactor"
            label={t.safetyFactor}
            value={formState.safetyFactor.value}
            onValueChange={(val) => handleValueChange('safetyFactor', val)}
            units={['%']}
            error={errors.safetyFactor}
            placeholder={t.ph_safetyFactor}
        />
      </div>

       <div>
        <h2 className="text-xl font-semibold text-(--color-text-primary) mb-4 border-b border-(--color-border) pb-2">{t.breathingLossesTitle}</h2>
        <p className="text-xs text-(--color-text-secondary) -mt-3 mb-3">{t.breathingLossesDesc}</p>
        <CalculatorUnitField
            id="tankVolume"
            label={t.totalTankVolume}
            value={formState.tankVolume.value}
            onValueChange={(val) => handleValueChange('tankVolume', val)}
            unit={formState.tankVolume.unit}
            onUnitChange={(unit) => handleUnitChange('tankVolume', unit)}
            units={['m³', 'gal', 'bbl']}
            placeholder={t.ph_tankVolume}
            error={errors.tankVolume}
        />
        <CalculatorUnitField
            id="tempSwing"
            label={t.avgDailyTempSwing}
            value={formState.tempSwing.value}
            onValueChange={(val) => handleValueChange('tempSwing', val)}
            unit={formState.tempSwing.unit}
            onUnitChange={(unit) => handleUnitChange('tempSwing', unit)}
            units={['°C', '°F']}
            placeholder={t.ph_tempSwing}
            error={errors.tempSwing}
        />
      </div>

      <button
        type="submit"
        className="w-full bg-(--color-accent-primary) text-(--color-accent-text) font-bold py-3 px-4 rounded-lg hover:opacity-90 focus:outline-none focus:ring-4 focus:ring-(--color-accent-primary)/50 transition-all duration-300 shadow-md hover:shadow-lg"
      >
        {t.calculateBtn}
      </button>
    </form>
  );
};