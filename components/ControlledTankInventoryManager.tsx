import React from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { ControlledTankInputGroup } from './ControlledTankInputGroup';
import { useLang } from '../LanguageContext';
import { QuestionnaireData } from '../schema/questionnaireSchema';

export const ControlledTankInventoryManager: React.FC = () => {
  const { t } = useLang();
  const { control } = useFormContext<QuestionnaireData>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "tanks"
  });

  const handleAddTank = () => {
    append({
      tankId: '',
      product: '',
      volumeValue: '',
      volumeUnit: 'L',
      diameterValue: '',
      diameterUnit: 'm',
      heightValue: '',
      heightUnit: 'm',
      throughputValue: '',
      throughputUnit: 'm³/month',
      type: 'Cone Roof',
      material: 'Carbon Steel',
      designCode: 'API 650',
    });
  };

  return (
    <div className="space-y-6">
      <p className="text-sm text-(--color-text-secondary)">
        {t.tankInventoryDesc}
      </p>
      <div className="space-y-8">
        {fields.map((field, index) => (
          <ControlledTankInputGroup 
            key={field.id} 
            index={index}
            onRemove={() => remove(index)} 
            canRemove={fields.length > 1}
            isFirst={index === 0}
          />
        ))}
      </div>
      <div className="text-left">
        <button
          type="button"
          onClick={handleAddTank}
          className="font-semibold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-(--color-accent-primary) transition-colors duration-200 text-sm inline-flex items-center gap-2 border border-(--color-accent-primary) text-(--color-accent-primary) hover:bg-(--color-accent-primary) hover:text-(--color-accent-text)"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          {t.addAnotherTank}
        </button>
      </div>
    </div>
  );
};
