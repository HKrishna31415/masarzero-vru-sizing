import React from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { QuestionnaireField } from '../QuestionnaireField';
import { ControlledSelectField } from './ControlledSelectField';
import { ControlledUnitInputField } from './ControlledUnitInputField';
import { useLang } from '../../LanguageContext';
import { QuestionnaireData } from '../../schema/questionnaireSchema';

export const Step6: React.FC = () => {
  const { t } = useLang();
  const { register, control } = useFormContext<QuestionnaireData>();
  const classificationSystem = useWatch({ control, name: 'classificationSystem' });

  return (
    <fieldset>
      <legend className="sr-only">{t.s6title}</legend>
      <div className="form-grid">
        <div className="space-y-4">
          <QuestionnaireField label={t.availableVoltage} description={t.availableVoltageDesc}>
            <input {...register('electricalVoltage')} type="number" placeholder={t.ph_voltage} className="w-full p-2 border rounded" />
          </QuestionnaireField>
          <ControlledSelectField name="electricalPhase" label={t.phase} options={t.phaseOptions as unknown as string[]} />
          <ControlledSelectField name="electricalFreq" label={t.frequency} options={t.frequencyOptions as unknown as string[]} />
        </div>
        
        <div className="space-y-4">
          <ControlledSelectField 
            name="classificationSystem" 
            label={t.hazardClassSystem} 
            options={t.hazardSystems as unknown as string[]} 
          />
          {classificationSystem === 'Class/Division' ? (
            <div className="grid grid-cols-2 gap-2">
              <ControlledSelectField name="areaDiv" label={t.division} options={t.divisionOptions as unknown as string[]} />
              <ControlledSelectField name="areaGroup" label={t.group} options={t.groupOptions as unknown as string[]} />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <ControlledSelectField name="areaZone" label={t.zone} options={t.zoneOptions as unknown as string[]} />
              <ControlledSelectField name="areaGasGroup" label={t.gasGroup} options={t.gasGroupOptions as unknown as string[]} />
            </div>
          )}
        </div>

        <div className="col-span-2">
          <ControlledSelectField name="electricitySupply" label={t.electricitySupply} options={t.electricityOptions as unknown as string[]} />
        </div>
        
        <div className="col-span-2">
          <ControlledSelectField name="internetAccess" label={t.internetAccess} options={t.internetOptions as unknown as string[]} />
        </div>

        <div className="col-span-2">
          <ControlledUnitInputField name="instrumentAir" label={t.instrumentAir} units={['bar', 'PSIG']} placeholder={t.ph_instrumentAir} />
        </div>

        <div className="col-span-2 p-4 border rounded-lg bg-gray-50">
          <label className="block text-sm font-bold mb-2">{t.coolingWater}</label>
          <div className="grid grid-cols-3 gap-4">
            <ControlledUnitInputField name="coolingWaterFlow" label={t.coolingFlowRate} units={["LPM", "GPM"]} placeholder={t.ph_coolingFlow} />
            <ControlledUnitInputField name="coolingWaterTemp" label={t.temperature} units={['°C', '°F']} placeholder={t.ph_coolingTemp} />
            <ControlledUnitInputField name="coolingWaterPressure" label={t.pressure} units={['bar', 'PSIG']} placeholder={t.ph_coolingPressure} />
          </div>
        </div>
      </div>
    </fieldset>
  );
};
