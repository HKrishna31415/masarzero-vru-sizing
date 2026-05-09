import React from 'react';
import { useFormContext } from 'react-hook-form';
import { QuestionnaireField } from '../QuestionnaireField';
import { useLang } from '../../LanguageContext';

export const Step9: React.FC = () => {
  const { t } = useLang();
  const { register } = useFormContext();

  return (
    <fieldset>
      <legend className="sr-only">{t.s9title}</legend>
      <QuestionnaireField label={t.reportingReqs} description={t.reportingReqsDesc}>
        <textarea {...register('reportingRequirements')} rows={5} placeholder={t.ph_reportingReqs} className="w-full p-2 border rounded" />
      </QuestionnaireField>
    </fieldset>
  );
};
