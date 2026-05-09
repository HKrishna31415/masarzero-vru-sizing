import React from 'react';
import { useFormContext } from 'react-hook-form';
import { QuestionnaireField } from '../QuestionnaireField';
import { useLang } from '../../LanguageContext';
import { Info } from 'lucide-react';

export const Step7: React.FC = () => {
  const { t } = useLang();
  const { register } = useFormContext();

  return (
    <fieldset>
      <legend className="sr-only">{t.s7title}</legend>
      <div className="space-y-6">
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
