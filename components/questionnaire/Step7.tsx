import React from 'react';
import { useFormContext } from 'react-hook-form';
import { QuestionnaireField } from '../QuestionnaireField';
import { ControlledUnitInputField } from './ControlledUnitInputField';
import { useLang } from '../../LanguageContext';
import { Info } from 'lucide-react';

export const Step7: React.FC = () => {
  const { t } = useLang();
  const { register } = useFormContext();

  return (
    <fieldset>
      <legend className="sr-only">{t.s7title}</legend>
      <div className="space-y-6">
        <div className="rounded-xl border border-teal-100 bg-teal-50/50 p-4 sm:p-5">
          <h3 className="font-bold text-teal-950">VRU plot space and boundaries</h3>
          <p className="mt-1 text-xs text-teal-800">Capture the usable footprint and any access, setback, height, lifting, drainage, or hazardous-area restrictions—not just a general statement that space is available.</p>
          <div className="mt-4 form-grid">
            <ControlledUnitInputField name="plotLength" label="Usable VRU plot length" description="Clear usable length within the designated plot." units={['m']} placeholder="e.g. 18" />
            <ControlledUnitInputField name="plotWidth" label="Usable VRU plot width" description="Clear usable width within the designated plot." units={['m']} placeholder="e.g. 8" />
            <div className="col-span-full"><QuestionnaireField label="Plot layout restrictions" description="Setbacks, access roads, pipe-rack crossings, maximum height/weight, drainage, crane access, or adjacent equipment."><textarea {...register('plotLayoutRestrictions')} rows={3} placeholder="Describe dimensions, boundaries, and restrictions" /></QuestionnaireField></div>
          </div>
        </div>
        <QuestionnaireField label={t.spaceConstraints} description={t.spaceConstraintsDesc}>
          <textarea {...register('spaceConstraints')} rows={3} placeholder={t.ph_spaceConstraints} className="w-full p-2 border rounded" />
        </QuestionnaireField>
        <QuestionnaireField label={t.constructionEquipment} description={t.constructionEquipmentDesc}>
          <textarea {...register('constructionEquipment')} rows={3} placeholder={t.ph_constructionEquip} className="w-full p-2 border rounded" />
        </QuestionnaireField>
        <div className="flex items-start gap-3 p-4 bg-blue-50 text-blue-800 rounded-lg border border-blue-100">
          <Info className="shrink-0 mt-0.5" size={18} />
          <p className="text-sm">{t.blueprintNote}</p>
        </div>
      </div>
    </fieldset>
  );
};
