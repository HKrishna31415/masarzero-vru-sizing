import React, { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { QuestionnaireField } from '../QuestionnaireField';
import { useLang } from '../../LanguageContext';
import { QuestionnaireData } from '../../schema/questionnaireSchema';

export const Step1: React.FC = () => {
  const { t } = useLang();
  const { register, getValues, setValue } = useFormContext<QuestionnaireData>();
  const [locationHint, setLocationHint] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    const suggestLocation = async () => {
      try {
        // The lookup stays in the visitor's browser; only the country and its
        // capital are used, and we never replace a saved or typed location.
        const response = await fetch('https://ipapi.co/json/', {
          signal: controller.signal,
          cache: 'no-store',
        });
        if (!response.ok) return;

        const location = await response.json() as {
          country_name?: string;
          country_capital?: string;
        };
        if (!location.country_name || !location.country_capital) return;

        const country = String(getValues('siteCountry') || '').trim();
        const city = String(getValues('siteCity') || '').trim();
        if (country || city) return;

        setValue('siteCountry', location.country_name, { shouldDirty: false });
        setValue('siteCity', location.country_capital, { shouldDirty: false });
        setLocationHint('Suggested from your country. Please edit this if the facility is in another city.');
      } catch (error) {
        if ((error as DOMException).name !== 'AbortError') {
          // Location suggestion is optional; the form remains fully usable offline.
          console.info('Country-based location suggestion unavailable.');
        }
      }
    };

    void suggestLocation();
    return () => controller.abort();
  }, [getValues, setValue]);

  return (
    <fieldset>
      <legend className="sr-only">{t.s1title}</legend>
      <div className="mb-6 rounded-lg border border-teal-200 bg-teal-50 px-4 py-3 text-sm text-teal-950">
        Complete these dates for the proposed VRU package. They do not refer to the refinery’s overall construction or turnaround schedule.
      </div>
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
        {locationHint && (
          <p className="col-span-2 -mt-3 text-xs text-teal-800" role="status">
            {locationHint}
          </p>
        )}
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
