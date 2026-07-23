import React from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { QuestionnaireField } from '../QuestionnaireField';
import { ControlledSelectField } from './ControlledSelectField';
import { ControlledUnitInputField } from './ControlledUnitInputField';
import { useLang } from '../../LanguageContext';
import { QuestionnaireData } from '../../schema/questionnaireSchema';
import { Truck, Thermometer, Gauge, Info } from 'lucide-react';
import { RefineryDetails } from './RefineryDetails';

const SectionHeader: React.FC<{ icon: React.ReactNode; title: string; subtitle?: string }> = ({ icon, title, subtitle }) => (
  <div className="flex items-start gap-3 mb-5 pb-3 border-b border-gray-100">
    <div className="w-9 h-9 rounded-lg bg-teal-50 flex items-center justify-center shrink-0 mt-0.5">
      {icon}
    </div>
    <div>
      <h3 className="text-sm font-bold text-gray-800 leading-tight">{title}</h3>
      {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
    </div>
  </div>
);

export const Step2: React.FC = () => {
  const { t } = useLang();
  const { register, control } = useFormContext<QuestionnaireData>();
  const storageType = useWatch({ control, name: 'storageType' });
  const isRefinery = String(storageType || '').trim().toLowerCase() === 'refinery' || storageType === (t.storageTypes as unknown as string[])[2];

  return (
    <fieldset className="space-y-8">
      <legend className="sr-only">{t.s2title}</legend>

      {/* ── Facility Type ─────────────────────────────────────────────── */}
      <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
        <SectionHeader
          icon={<Truck size={18} className="text-teal-600" />}
          title={t.facilityTypeSection}
          subtitle={t.facilityTypeSectionDesc}
        />
        <div className="form-grid">
          <ControlledSelectField
            name="storageType"
            label={t.storageTypeLabel}
            description={t.storageTypeDesc}
            options={t.storageTypes as unknown as string[]}
          />
          {storageType === 'Other' && (
            <QuestionnaireField label={t.specifyOtherStorage} description="">
              <input {...register('storageTypeOther')} type="text" placeholder={t.ph_marineTerminal} />
            </QuestionnaireField>
          )}
          <ControlledSelectField
            name="deliveryMethod"
            label={t.deliveryMethod}
            description={t.deliveryMethodDesc}
            options={t.deliveryMethods as unknown as string[]}
          />
          <ControlledSelectField
            name="loadingMethod"
            label={t.loadingMethod}
            description={t.loadingMethodDesc}
            options={t.loadingMethods as unknown as string[]}
          />
        </div>
      </div>

      {isRefinery ? <RefineryDetails /> : <>
      {/* ── Loading Operations ────────────────────────────────────────── */}
      <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
        <SectionHeader
          icon={<Gauge size={18} className="text-teal-600" />}
          title={t.loadingOpsSection}
          subtitle={t.loadingOpsSectionDesc}
        />
        <div className="form-grid">
          {/* Loading Frequency */}
          <QuestionnaireField label={t.loadingFrequency} description={t.loadingFrequencyDesc}>
            <div style={{ position: 'relative' }}>
              <input
                {...register('loadingFrequency')}
                type="number"
                step="1"
                min="0"
                placeholder={t.ph_loadingFreq}
              />
              <div style={{ position: 'absolute', inset: '0 0 0 auto', right: '0.75rem', display: 'flex', alignItems: 'center', pointerEvents: 'none' }}>
                <span style={{ fontSize: '0.8rem', color: '#6B7280' }}>{t.truckDay}</span>
              </div>
            </div>
          </QuestionnaireField>

          {/* Simultaneous Loading */}
          <QuestionnaireField label={t.simultaneousLoading} description={t.simultaneousLoadingDesc}>
            <div style={{ position: 'relative' }}>
              <input
                {...register('simultaneousLoading')}
                type="number"
                step="1"
                min="1"
                placeholder={t.ph_simultaneousLoading}
              />
              <div style={{ position: 'absolute', inset: '0 0 0 auto', right: '0.75rem', display: 'flex', alignItems: 'center', pointerEvents: 'none' }}>
                <span style={{ fontSize: '0.8rem', color: '#6B7280' }}>{t.trucksUnit}</span>
              </div>
            </div>
          </QuestionnaireField>

          {/* Loading Pump Flow Rate */}
          <ControlledUnitInputField
            name="loadingPumpFlowRate"
            label={t.loadingPumpFlowRate}
            description={t.loadingPumpFlowRateDesc}
            units={['LPM', 'GPM', 'm³/h']}
            placeholder={t.ph_loadingPumpFlowRate}
          />

          {/* Discharge Pressure */}
          <ControlledUnitInputField
            name="dischargePressure"
            label={t.dischargePressure}
            description={t.dischargePressureDesc}
            units={['bar', 'psig', 'kPa']}
            placeholder={t.ph_dischargePressure}
          />
        </div>

        {/* Info callout */}
        <div className="mt-4 flex items-start gap-3 p-3.5 bg-amber-50 border border-amber-100 rounded-lg">
          <Info size={16} className="text-amber-500 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-800 leading-relaxed">{t.loadingOpsNote}</p>
        </div>
      </div>

      {/* ── Ambient Conditions ────────────────────────────────────────── */}
      <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
        <SectionHeader
          icon={<Thermometer size={18} className="text-teal-600" />}
          title={t.ambientConditionsSection}
          subtitle={t.ambientConditionsSectionDesc}
        />
        <div className="form-grid">
          <ControlledUnitInputField
            name="ambientTempMax"
            label={t.maxAmbientTemp}
            description={t.maxAmbientTempDesc}
            units={['°C', '°F']}
            placeholder={t.ph_tempMax}
          />
          <ControlledUnitInputField
            name="ambientTempMin"
            label={t.minAmbientTemp}
            description={t.minAmbientTempDesc}
            units={['°C', '°F']}
            placeholder={t.ph_tempMin}
          />
        </div>
      </div>
      </>}
    </fieldset>
  );
};
