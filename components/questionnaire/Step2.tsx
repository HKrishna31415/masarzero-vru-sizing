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

    {hasPipeline && <section className="rounded-xl border border-teal-100 bg-teal-50/50 p-4 sm:p-5"><div className="mb-5 flex items-start gap-3"><Gauge size={18} className="mt-0.5 text-teal-700"/><div><h3 className="font-bold text-teal-950">Refinery / pipeline transfer</h3><p className="mt-1 text-xs text-teal-800">Capture normal and peak transfer conditions for the vapor-source design case.</p></div></div><div className="form-grid">
      <ControlledUnitInputField name="pipelineTransferFlowRate" label="Transfer flow rate" description="Maximum flow from refinery or pipeline into connected tanks." units={['m³/h', 'm³/day']} placeholder="e.g. 250" />
      <QuestionnaireField label="Simultaneous transfer lines" description="Maximum number of lines operating together."><input {...register('simultaneousTransferLines')} type="number" min="1" placeholder="e.g. 2" /></QuestionnaireField>
      <QuestionnaireField label="Normal transfer hours" description="Typical transfer duration per day."><input {...register('normalTransferHours')} type="number" min="0" max="24" placeholder="e.g. 12" /></QuestionnaireField>
      <QuestionnaireField label="Peak transfer hours" description="Maximum daily duration during peak operation."><input {...register('peakTransferHours')} type="number" min="0" max="24" placeholder="e.g. 18" /></QuestionnaireField>
      <ControlledUnitInputField name="transferPressure" label="Transfer pressure" description="Pressure at the tank inlet or transfer header." units={['barg', 'kPa']} placeholder="e.g. 3" />
      <ControlledSelectField name="transferFillMethod" label="Tank receipt / fill method" options={['Submerged fill pipe', 'Bottom fill', 'Top loading', 'Other']} />
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
