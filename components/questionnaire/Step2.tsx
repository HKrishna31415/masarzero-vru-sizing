import React from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { QuestionnaireField } from '../QuestionnaireField';
import { ControlledSelectField } from './ControlledSelectField';
import { ControlledUnitInputField } from './ControlledUnitInputField';
import { useLang } from '../../LanguageContext';
import { QuestionnaireData } from '../../schema/questionnaireSchema';
import { Factory, Gauge, Thermometer } from 'lucide-react';
import { RefineryDetails } from './RefineryDetails';

const SOURCES = ['Truck receipt', 'Refinery / pipeline transfer', 'Rail receipt', 'Marine / barge receipt'];

export const Step2: React.FC = () => {
  const { t } = useLang();
  const { register, control, setValue } = useFormContext<QuestionnaireData>();
  const storageType = useWatch({ control, name: 'storageType' });
  const transferSources = useWatch({ control, name: 'transferSources' }) || [];
  const isRefinery = String(storageType || '').trim().toLowerCase() === 'refinery';
  const hasTruck = transferSources.includes('Truck receipt');
  const hasPipeline = transferSources.includes('Refinery / pipeline transfer');
  const hasMarine = transferSources.includes('Marine / barge receipt');
  const toggleSource = (source: string) => setValue('transferSources', transferSources.includes(source)
    ? transferSources.filter(value => value !== source)
    : [...transferSources, source], { shouldDirty: true });

  return <fieldset className="space-y-7">
    <legend className="sr-only">{t.s2title}</legend>
    <section className="rounded-xl border border-gray-200 bg-gray-50 p-4 sm:p-5">
      <div className="mb-5 flex items-start gap-3 border-b border-gray-200 pb-3">
        <Factory size={18} className="mt-0.5 text-teal-600" />
        <div><h3 className="font-bold text-gray-900">Facility & transfer context</h3><p className="mt-1 text-xs text-gray-600">Select every product-receipt source that can feed tanks connected to this vapor system.</p></div>
      </div>
      <div className="form-grid">
        <ControlledSelectField name="storageType" label="Facility type" description="Select the facility’s primary operational role." options={t.storageTypes as unknown as string[]} />
        <div className="field-wrap"><label>Incoming transfer sources</label><div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {SOURCES.map(source => <button key={source} type="button" aria-pressed={transferSources.includes(source)} onClick={() => toggleSource(source)} className={`flex items-center gap-2 rounded-lg border px-3 py-2.5 text-left text-sm ${transferSources.includes(source) ? 'border-teal-600 bg-teal-50 font-semibold text-teal-900' : 'border-gray-200 bg-white text-gray-700'}`}><span className={`flex h-4 w-4 items-center justify-center rounded border text-[10px] ${transferSources.includes(source) ? 'border-teal-600 bg-teal-600 text-white' : 'border-gray-300'}`}>{transferSources.includes(source) ? '✓' : ''}</span>{source}</button>)}
        </div><p className="field-desc">Only inputs relevant to the selected sources are shown below.</p></div>
      </div>
    </section>

    {transferSources.length > 0 && <section className="rounded-xl border border-amber-200 bg-amber-50/60 p-4 sm:p-5"><div className="mb-5 flex items-start gap-3"><Gauge size={18} className="mt-0.5 text-amber-700"/><div><h3 className="font-bold text-amber-950">Worst-case simultaneous transfer case</h3><p className="mt-1 text-xs text-amber-900">This is the design case: every loading arm, truck bay, transfer line, or marine berth operating at the same exact time—not an average day.</p></div></div><div className="form-grid">
      <QuestionnaireField label="Maximum simultaneous loading arms" description="Arms or hoses transferring product at the design peak, across all selected sources."><input {...register('simultaneousLoadingArms')} type="number" min="0" placeholder="e.g. 6" /></QuestionnaireField>
      {hasMarine && <QuestionnaireField label="Maximum simultaneous marine berths" description="Berths loading or receiving concurrently in the design case."><input {...register('simultaneousMarineBerths')} type="number" min="0" placeholder="e.g. 1" /></QuestionnaireField>}
      <ControlledUnitInputField name="averageLoadingRate" label="Average active transfer rate" description="Typical rate per active arm, bay, or line; do not use monthly throughput." units={['m³/h', 'm³/day']} placeholder="e.g. 150" />
      <ControlledUnitInputField name="peakLoadingRate" label="Peak active transfer rate" description="Highest rate per active arm, bay, or line during the simultaneous design case." units={['m³/h', 'm³/day']} placeholder="e.g. 300" />
      <div className="col-span-full"><QuestionnaireField label="Worst-case simultaneous scenario" description="Describe the exact combination: e.g. 4 truck bays plus 1 marine berth at peak rate, or 3 pipeline lines at maximum flow."><textarea {...register('worstCaseScenario')} rows={3} placeholder="Describe all simultaneous vapor-generating operations" /></QuestionnaireField></div>
    </div></section>}

    {hasPipeline && <section className="rounded-xl border border-teal-100 bg-teal-50/50 p-4 sm:p-5"><div className="mb-5 flex items-start gap-3"><Gauge size={18} className="mt-0.5 text-teal-700"/><div><h3 className="font-bold text-teal-950">Refinery / pipeline transfer</h3><p className="mt-1 text-xs text-teal-800">Capture normal and peak transfer conditions for the vapor-source design case.</p></div></div><div className="form-grid">
      <ControlledUnitInputField name="pipelineTransferFlowRate" label="Transfer flow rate" description="Maximum flow from refinery or pipeline into connected tanks." units={['m³/h', 'm³/day']} placeholder="e.g. 250" />
      <QuestionnaireField label="Simultaneous transfer lines" description="Maximum number of lines operating together."><input {...register('simultaneousTransferLines')} type="number" min="1" placeholder="e.g. 2" /></QuestionnaireField>
      <QuestionnaireField label="Normal transfer hours" description="Typical transfer duration per day."><input {...register('normalTransferHours')} type="number" min="0" max="24" placeholder="e.g. 12" /></QuestionnaireField>
      <QuestionnaireField label="Peak transfer hours" description="Maximum daily duration during peak operation."><input {...register('peakTransferHours')} type="number" min="0" max="24" placeholder="e.g. 18" /></QuestionnaireField>
      <ControlledUnitInputField name="transferPressure" label="Transfer pressure" description="Pressure at the tank inlet or transfer header." units={['barg', 'kPa']} placeholder="e.g. 3" />
      <ControlledSelectField name="transferFillMethod" label="Tank receipt / fill method" description="Submerged: a top-entry dip pipe discharges below liquid level. Bottom fill: product enters through a lower tank nozzle. Select “Both / varies” where applicable." options={['Submerged fill (top-entry dip pipe)', 'Bottom fill (lower tank nozzle)', 'Top loading', 'Both / varies by tank', 'Other']} />
    </div></section>}

    {hasTruck && <section className="rounded-xl border border-gray-200 bg-gray-50 p-4 sm:p-5"><div className="mb-5 flex items-start gap-3"><Gauge size={18} className="mt-0.5 text-teal-600"/><div><h3 className="font-bold text-gray-900">Truck receipt operations</h3><p className="mt-1 text-xs text-gray-600">Shown because truck receipt is selected as a vapor source.</p></div></div><div className="form-grid">
      <QuestionnaireField label="Truck receipt events" description="Maximum truck receipt events per day."><input {...register('loadingFrequency')} type="number" min="0" placeholder="e.g. 5" /></QuestionnaireField>
      <QuestionnaireField label="Simultaneous truck receipts" description="Maximum trucks unloading at the same time."><input {...register('simultaneousLoading')} type="number" min="1" placeholder="e.g. 2" /></QuestionnaireField>
      <ControlledUnitInputField name="loadingPumpFlowRate" label="Truck unloading flow rate" description="Flow rate per active truck connection." units={['m³/h', 'LPM']} placeholder="e.g. 120" />
      <ControlledSelectField name="loadingMethod" label="Truck receipt fill method" options={['Submerged fill pipe', 'Bottom loading', 'Top splash loading']} />
    </div></section>}

    {isRefinery && <RefineryDetails />}
    <section className="rounded-xl border border-gray-200 bg-gray-50 p-4 sm:p-5"><div className="mb-4 flex items-center gap-2"><Thermometer size={18} className="text-teal-600"/><h3 className="font-bold text-gray-900">Ambient conditions</h3></div><div className="form-grid"><ControlledUnitInputField name="ambientTempMax" label={t.maxAmbientTemp} units={['°C']} placeholder={t.ph_tempMax}/><ControlledUnitInputField name="ambientTempMin" label={t.minAmbientTemp} units={['°C']} placeholder={t.ph_tempMin}/></div></section>
  </fieldset>;
};
