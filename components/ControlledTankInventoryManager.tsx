import React from 'react';
import { useFormContext, useFieldArray, useWatch } from 'react-hook-form';
import { ControlledTankInputGroup } from './ControlledTankInputGroup';
import { useLang } from '../LanguageContext';
import { QuestionnaireData } from '../schema/questionnaireSchema';

export const ControlledTankInventoryManager: React.FC = () => {
  const { t } = useLang();
  const { control } = useFormContext<QuestionnaireData>();
  const tanks = useWatch({ control, name: 'tanks' }) || [];
  const { fields, append, remove } = useFieldArray({
    control,
    name: "tanks"
  });

  const handleAddTank = () => {
    append({
      tankId: '',
      product: '',
      volume: { value: '', unit: 'm³' },
      normalInventory: { value: '', unit: 't' },
      maximumUsableCapacity: { value: '', unit: 't' },
      diameter: { value: '', unit: 'm' }, height: { value: '', unit: 'm' },
      throughput: { value: '', unit: 'm³/month' },
      type: 'Cone Roof',
      material: 'Carbon Steel',
      designCode: 'ISO 28300 / EN 14015',
      vaporCollectionParticipation: 'Yes',
    });
  };
  const total = (key: 'normalInventory' | 'maximumUsableCapacity') => tanks.reduce((sum, tank) => sum + (Number(tank?.[key]?.value) || 0), 0);

  return (
    <div className="space-y-6">
      <p className="text-sm text-(--color-text-secondary)">
        List only tanks whose vapor will be routed to the proposed VRU. Record both normal working inventory and maximum usable capacity in tonnes.
      </p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-lg bg-teal-50 px-4 py-3 text-sm text-teal-950"><span className="block text-xs font-semibold text-teal-700">Total normal inventory</span><strong className="text-lg">{total('normalInventory').toLocaleString()} t</strong></div>
        <div className="rounded-lg bg-gray-100 px-4 py-3 text-sm text-gray-900"><span className="block text-xs font-semibold text-gray-600">Total maximum usable capacity</span><strong className="text-lg">{total('maximumUsableCapacity').toLocaleString()} t</strong></div>
      </div>
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
