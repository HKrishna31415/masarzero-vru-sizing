import React from 'react';
import { useFormContext } from 'react-hook-form';
import { QuestionnaireField } from '../QuestionnaireField';
import { useLang } from '../../LanguageContext';
import { QuestionnaireData } from '../../schema/questionnaireSchema';

export const Step1: React.FC = () => {
  const { t } = useLang();
  const { register } = useFormContext<QuestionnaireData>();

  return (
    <fieldset>
      <legend className="sr-only">{t.s1title}</legend>
      <div className="form-grid">
        <QuestionnaireField label={t.projectNameId} description={t.projectNameDesc}>
          <input {...register('projectName')} type="text" placeholder={t.ph_projectName} />
        </QuestionnaireField>
        <QuestionnaireField label={t.country} description={t.countryDesc}>
          <input {...register('siteCountry')} type="text" placeholder={t.ph_country} />
        </QuestionnaireField>
        <QuestionnaireField label={t.cityState} description={t.cityStateDesc}>
          <input {...register('siteCity')} type="text" placeholder={t.ph_city} />
        </QuestionnaireField>
        <QuestionnaireField label={t.streetAddress} description={t.streetAddressDesc}>
          <input {...register('siteAddress')} type="text" placeholder={t.ph_address} />
        </QuestionnaireField>
        <QuestionnaireField label={t.contactPerson} description={t.contactPersonDesc}>
          <input {...register('contactPerson')} type="text" placeholder={t.ph_contact} />
        </QuestionnaireField>
        <QuestionnaireField label={t.contactEmail} description={t.contactEmailDesc}>
          <input {...register('contactEmail')} type="email" placeholder={t.ph_email} />
        </QuestionnaireField>
        <QuestionnaireField label={t.projectStartDate} description={t.projectStartDateDesc}>
          <input {...register('projectStartDate')} type="date" style={{ direction: 'ltr' }} />
        </QuestionnaireField>
        <QuestionnaireField label={t.projectEndDate} description={t.projectEndDateDesc}>
          <input {...register('projectEndDate')} type="date" style={{ direction: 'ltr' }} />
        </QuestionnaireField>
      </div>
    </fieldset>
  );
};
