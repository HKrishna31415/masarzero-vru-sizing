import React from 'react';
import { useFormContext } from 'react-hook-form';
import { QuestionnaireField } from '../QuestionnaireField';
import { ControlledUnitInputField } from './ControlledUnitInputField';
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
            units={['dBA @ 1m', 'dBA @ 3ft']} 
            placeholder={t.ph_noiseLevel} 
          />
        </div>
      </div>
    </fieldset>
  );
};
