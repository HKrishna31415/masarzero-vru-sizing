import React from 'react';
import { useFormContext } from 'react-hook-form';
import { QuestionnaireField } from '../QuestionnaireField';
import { ControlledSelectField } from './ControlledSelectField';
import { ControlledUnitInputField } from './ControlledUnitInputField';
import { useLang } from '../../LanguageContext';
import { QuestionnaireData } from '../../schema/questionnaireSchema';

export const Step5: React.FC = () => {
  const { t } = useLang();
  const { register } = useFormContext<QuestionnaireData>();

  return (
    <fieldset>
      <legend className="sr-only">{t.s5title}</legend>
      <div className="form-grid">
        <ControlledUnitInputField 
          name="headerSize" 
          label={t.headerDiameter} 
          units={['mm']}
          placeholder={t.ph_headerDiameter} 
        />
        <ControlledUnitInputField 
          name="pipingLength" 
          label={t.pipingLength} 
          units={['m']}
          placeholder={t.ph_pipingLength} 
        />
        <div className="col-span-2 grid grid-cols-2 gap-4">
          <QuestionnaireField label={t.ventSetPoints} description={t.ventSetPointsDesc}>
            <div className="flex gap-2">
              <input {...register('ventSetPointsPositive')} type="text" placeholder="+6.2" className="w-1/2 p-2 border rounded" />
              <input {...register('ventSetPointsNegative')} type="text" placeholder="-1.2" className="w-1/2 p-2 border rounded" />
            </div>
          </QuestionnaireField>
          <ControlledSelectField 
            name="ventSetPointsUnit" 
            label="Unit" 
            options={['mbar', 'Pa']}
          />
        </div>
        <ControlledSelectField 
          name="arrestorExists" 
          label={t.arrestorExists} 
          options={t.arrestorOptions as unknown as string[]} 
        />
        <QuestionnaireField label={t.pipingMaterial} description={t.pipingMaterialDesc}>
          <input {...register('pipingMaterial')} type="text" placeholder={t.ph_pipingMaterial} className="w-full p-2 border rounded" />
        </QuestionnaireField>
      </div>
    </fieldset>
  );
};
