import React from 'react';
import { useFormContext } from 'react-hook-form';
import { QuestionnaireField } from '../QuestionnaireField';
import { ControlledSelectField } from './ControlledSelectField';
import { ControlledUnitInputField } from './ControlledUnitInputField';
import { useLang } from '../../LanguageContext';
import { QuestionnaireData } from '../../schema/questionnaireSchema';

export const Step4: React.FC = () => {
  const { t } = useLang();
  const { register } = useFormContext<QuestionnaireData>();

  return (
    <fieldset>
      <legend className="sr-only">{t.s4title}</legend>
      <QuestionnaireField label={t.gcAnalysis} description={t.gcAnalysisDesc}>
        <textarea {...register('gcAnalysis')} rows={4} className="w-full p-2 border rounded" placeholder={t.ph_gcAnalysis} />
      </QuestionnaireField>
      <div className="form-grid mt-4">
        <QuestionnaireField label={t.corrosiveComponents} description={t.corrosiveDesc}>
          <input {...register('corrosiveComponents')} type="text" className="w-full p-2 border rounded" placeholder={t.ph_corrosive} />
        </QuestionnaireField>
        <ControlledSelectField 
          name="vaporSaturation" 
          label={t.vaporSaturation} 
          description={t.vaporSaturationDesc}
          options={t.saturationOptions as unknown as string[]} 
        />
        <ControlledUnitInputField 
          name="vaporMolecularWeight" 
          label={t.vaporMolWeight} 
          units={['g/mol']} 
          placeholder={t.ph_molWeight} 
        />
        <ControlledUnitInputField 
          name="vaporLEL" 
          label={t.vaporLEL} 
          units={['% by vol']} 
          placeholder={t.ph_lel} 
        />
      </div>
    </fieldset>
  );
};
