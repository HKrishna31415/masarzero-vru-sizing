import React from 'react';
import { useFormContext } from 'react-hook-form';
import { QuestionnaireData } from '../../schema/questionnaireSchema';
import { ControlledSelectField } from './ControlledSelectField';
import { ControlledUnitInputField } from './ControlledUnitInputField';
import { QuestionnaireField } from '../QuestionnaireField';
import { Activity, FlaskConical, Gauge, ShieldCheck, FileText } from 'lucide-react';

const Section: React.FC<{ icon: React.ReactNode; title: string; note: string; children: React.ReactNode }> = ({ icon, title, note, children }) => (
  <section className="bg-gray-50 rounded-xl p-5 border border-gray-100">
    <div className="flex items-start gap-3 mb-5 pb-3 border-b border-gray-100">
      <div className="w-9 h-9 rounded-lg bg-teal-50 flex items-center justify-center shrink-0 text-teal-600">{icon}</div>
      <div><h3 className="text-sm font-bold text-gray-800">{title}</h3><p className="text-xs text-gray-500 mt-0.5">{note}</p></div>
    </div>
    <div className="form-grid">{children}</div>
  </section>
);

export const RefineryDetails: React.FC = () => {
  const { register } = useFormContext<QuestionnaireData>();
  const text = (name: string, label: string, placeholder = '') => (
    <QuestionnaireField label={label} description="Provide the latest available design-basis information.">
      <input {...register(name as any)} type="text" placeholder={placeholder} />
    </QuestionnaireField>
  );
  const options = (name: any, label: string, values: string[]) => <ControlledSelectField name={name} label={label} options={values} />;

  return <div className="space-y-8 mt-8 pt-8 border-t-2 border-teal-100">
    <div className="flex items-start gap-3 p-4 rounded-xl bg-teal-50 border border-teal-100">
      <Activity className="text-teal-700 shrink-0 mt-0.5" size={18} />
      <div><h3 className="font-bold text-teal-900">Refinery unit design basis</h3><p className="text-sm text-teal-800 mt-1">Answer only for the tanks and process equipment connected to this proposed VRU—not for the whole refinery. Attach P&amp;IDs, GC reports, plot plans, and owner specifications where available.</p></div>
    </div>
    <Section icon={<Activity size={18} />} title="Process and operating basis" note="Define where the vapor comes from and how the unit operates.">
      {text('refineryUnit', 'Refinery unit / process area', 'e.g., Tank Farm 3, CDU, Loading Rack')}
      {text('vaporSourceDescription', 'Vapor source description', 'Connected vessels, vents, or equipment')}
      {options('operatingMode', 'Operating mode', ['Continuous', 'Intermittent', 'Batch', 'Multiple operating cases'])}
      {text('operatingHours', 'Expected operating hours per year', 'e.g., 8,000 h/year')}
      {options('vruAvailability', 'Required VRU availability', ['Single train', 'Duty / standby', 'N+1 redundancy', 'To be specified'])}
      {options('liquidCarryover', 'Potential liquid carryover', ['None expected', 'Possible', 'Known / continuous', 'Unknown'])}
    </Section>
    <Section icon={<Gauge size={18} />} title="Vapor flow and conditions" note="Use normal, minimum, maximum, and design cases—not one averaged flow rate.">
      <ControlledUnitInputField name="normalVaporFlow" label="Normal vapor flow" units={['Nm³/h', 'Sm³/h']} placeholder="e.g., 1,200" />
      <ControlledUnitInputField name="minimumVaporFlow" label="Minimum vapor flow" units={['Nm³/h', 'Sm³/h']} placeholder="e.g., 200" />
      <ControlledUnitInputField name="maximumVaporFlow" label="Maximum vapor flow" units={['Nm³/h', 'Sm³/h']} placeholder="e.g., 2,500" />
      <ControlledUnitInputField name="designVaporFlow" label="Design vapor flow" units={['Nm³/h', 'Sm³/h']} placeholder="Include design margin" />
      <ControlledUnitInputField name="vaporInletPressure" label="VRU inlet pressure" units={['barg', 'mbar', 'kPag']} placeholder="e.g., 0.05" />
      <ControlledUnitInputField name="vaporInletTemperature" label="VRU inlet temperature" units={['°C']} placeholder="e.g., 35" />
      <ControlledUnitInputField name="hydrocarbonDewPoint" label="Hydrocarbon dew point" units={['°C']} placeholder="If available" />
      {options('downstreamDestination', 'Downstream destination', ['Recovered product', 'Fuel-gas system', 'Flare', 'Incinerator', 'Other'])}
      <ControlledUnitInputField name="downstreamPressure" label="Downstream pressure" units={['barg', 'mbar', 'kPag']} placeholder="e.g., 0.3" />
    </Section>
    <Section icon={<FlaskConical size={18} />} title="Vapor composition and contaminants" note="Provide laboratory values and identify the analysis date and basis in the attachments.">
      {options('vaporCompositionBasis', 'Composition data basis', ['Laboratory GC analysis', 'Process simulation', 'Material balance', 'Estimated', 'Unknown'])}
      <ControlledUnitInputField name="h2sConcentration" label="H₂S concentration" units={['ppm vol', '% vol']} placeholder="e.g., 25" />
      <ControlledUnitInputField name="benzeneConcentration" label="Benzene concentration" units={['ppm vol', '% vol']} placeholder="e.g., 1,500" />
      <ControlledUnitInputField name="oxygenConcentration" label="Oxygen concentration" units={['% vol', 'ppm vol']} placeholder="e.g., 0.5" />
      <ControlledUnitInputField name="waterContent" label="Water content" units={['ppm wt', '% wt']} placeholder="If available" />
      {text('corrosiveComponents', 'Other corrosive / toxic components', 'H₂S, mercaptans, acids, chlorides, etc.')}
    </Section>
    <Section icon={<ShieldCheck size={18} />} title="Relief, safety, and controls" note="Establish interfaces with refinery safety and control systems.">
      {options('reliefDesignResponsibility', 'Relief design responsibility', ['VRU vendor', 'EPC contractor', 'Owner / operator', 'To be agreed'])}
      {options('esdRequired', 'Emergency shutdown required', ['Yes', 'No', 'To be defined'])}
      {options('silRequirement', 'SIL requirement', ['Not required', 'SIL assessment required', 'SIL 1', 'SIL 2', 'To be defined'])}
      {options('fireGasInterface', 'Fire and gas interface', ['Required', 'Not required', 'Existing system—interface required', 'To be defined'])}
      {options('controlSystem', 'Control-system interface', ['DCS', 'PLC', 'SCADA', 'Local control only', 'To be defined'])}
      {text('hazardousAreaDrawing', 'Hazardous-area drawing reference', 'Drawing number and revision')}
      {text('equipmentCertification', 'Required equipment certification', 'IECEx, ATEX, Saudi Aramco, BAPCO, etc.')}
      {text('existingPipingDocuments', 'Existing P&ID / piping references', 'Document numbers and revisions')}
    </Section>
    <Section icon={<FileText size={18} />} title="Compliance, guarantees, and deliverables" note="Capture the owner’s acceptance basis before preparing a quotation.">
      {text('ownerStandards', 'Owner / project standards', 'SAES, SAMSS, BAPCO, EPC, IEC, API, local authority')}
      {text('emissionsStandard', 'Applicable emissions standard', 'Regulation, permit, or owner specification')}
      {text('vocGuaranteeBasis', 'VOC guarantee basis', 'Pollutant, inlet/outlet basis, test method')}
      {text('performanceTesting', 'Performance testing requirements', 'Test duration, cases, acceptance criteria')}
      {text('requiredDocuments', 'Required engineering deliverables', 'Datasheets, PFD/P&ID, GA, I/O, C&E, calculations, manuals')}
    </Section>
  </div>;
};
