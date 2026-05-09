import React from 'react';
import { useFormContext } from 'react-hook-form';
import { QuestionnaireField } from '../QuestionnaireField';
import { useLang } from '../../LanguageContext';

export const Step10: React.FC = () => {
  const { t } = useLang();
  const { register } = useFormContext();

  return (
    <fieldset>
      <legend className="sr-only">{t.s10title}</legend>
      <QuestionnaireField label={t.additionalNotes} description={t.additionalNotesDesc}>
        <textarea {...register('otherRequirements')} rows={6} placeholder={t.ph_additionalNotes} className="w-full p-2 border rounded" />
      </QuestionnaireField>
    </fieldset>
  );
};
