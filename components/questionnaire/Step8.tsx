import React from 'react';
import { useFormContext } from 'react-hook-form';
import { QuestionnaireField } from '../QuestionnaireField';
import { ControlledUnitInputField } from './ControlledUnitInputField';
import { ControlledSelectField } from './ControlledSelectField';
import { useLang } from '../../LanguageContext';

export const Step8: React.FC = () => {
  const { t } = useLang();
  const { register } = useFormContext();

  return (
    <fieldset>
      <legend className="sr-only">{t.s8title}</legend>
      <div className="form-grid">
        <QuestionnaireField label={t.envRegulations} description={t.envRegulationsDesc}>
          <input {...register('regulations')} type="text" placeholder={t.ph_regulations} className="w-full p-2 border rounded" />
        </QuestionnaireField>
        <ControlledUnitInputField 
          name="vocRecovery" 
          label={t.vocRecovery} 
          units={['%']} 
          placeholder={t.ph_vocRecovery} 
        />
        <div className="col-span-2">
          <ControlledUnitInputField 
            name="noiseLevel" 
            label={t.noiseLevel} 
            description="State the applicable plot-boundary or receptor requirement, rather than only an equipment sound level at 1 m."
            units={['dBA @ boundary', 'dBA @ 1m', 'dBA @ 3 ft']}
            placeholder={t.ph_noiseLevel} 
          />
        </div>
        <ControlledUnitInputField name="noiseBoundaryDistance" label="Noise assessment boundary / receptor distance" description="Distance from the proposed VRU to the relevant plot boundary, occupied building, or other noise receptor." units={['m']} placeholder="e.g. 45" />
        <ControlledUnitInputField name="guaranteedOutletConcentration" label="Guaranteed VRU outlet concentration limit" description="Hard tail-gas or stack concentration limit required by permit or owner specification." units={['mg/Nm³', 'ppmv NMHC', 'ppmv VOC']} placeholder="e.g. 35" />
        <QuestionnaireField label="Outlet pollutant and guarantee basis" description="Specify NMHC/VOC, oxygen correction or dry/wet basis, reference conditions, test method, and averaging period."><input {...register('outletPollutantBasis')} placeholder="e.g. NMHC, dry basis, mg/Nm³ at 0 °C" /></QuestionnaireField>
        <ControlledSelectField name="cemsRequirement" label="Continuous emissions monitoring / analyzer requirement" description="Confirm whether a CEMS or continuous VOC analyzer is required on the VRU exhaust stack and who provides the integration." options={['Not required', 'Integrated CEMS / analyzer required', 'Existing site CEMS interface required', 'To be defined with authority / owner']} />
        <div className="col-span-full mt-2 rounded-xl border border-gray-200 bg-gray-50 p-4 sm:p-5"><h3 className="font-bold text-gray-900">Controls and control-room integration</h3><p className="mt-1 text-xs text-gray-600">Confirm the site architecture before final pricing: vendor, local PLC responsibility, and the exact handshake required at the control-room boundary.</p><div className="mt-4 form-grid">
          <QuestionnaireField label="Existing DCS / SCADA vendor" description="For example: Yokogawa, Emerson DeltaV, Honeywell, Siemens, or another owner standard."><input {...register('controlSystemVendor')} placeholder="e.g. Yokogawa CENTUM VP" /></QuestionnaireField>
          <ControlledSelectField name="plcRequirement" label="Local PLC requirement" options={['Vendor-supplied standalone PLC', 'Owner-specified PLC', 'DCS-integrated control', 'No local PLC required', 'To be defined']} />
          <ControlledSelectField name="communicationsInterface" label="Required control-room handshake" description="Choose the required primary interface; describe additional protocols in other requirements if needed." options={['Hardwired I/O only', 'Modbus TCP', 'Modbus RTU', 'Profibus DP', 'Profinet', 'OPC UA', 'Other / to be defined']} />
        </div></div>
      </div>
    </fieldset>
  );
};
