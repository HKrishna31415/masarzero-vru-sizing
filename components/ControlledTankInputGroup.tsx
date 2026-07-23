import React from 'react';
import { useFormContext } from 'react-hook-form';
import { ControlledUnitInputField } from './questionnaire/ControlledUnitInputField';
import { ControlledSelectField } from './questionnaire/ControlledSelectField';
import { useLang } from '../LanguageContext';
import { QuestionnaireData } from '../schema/questionnaireSchema';

interface ControlledTankInputGroupProps {
  index: number;
  onRemove: () => void;
  canRemove: boolean;
  isFirst: boolean;
}

const inputClasses = "w-full pl-3 py-2 border border-(--color-border) rounded-md shadow-sm focus:ring-(--color-input-focus-ring) focus:border-(--color-input-focus-ring) transition duration-150 ease-in-out bg-(--color-input-bg) text-(--color-text-primary) text-sm";

export const ControlledTankInputGroup: React.FC<ControlledTankInputGroupProps> = ({ index, onRemove, canRemove, isFirst }) => {
  const { t } = useLang();
  const { register } = useFormContext<QuestionnaireData>();

  return (
    <div className="p-4 border border-(--color-border) rounded-lg bg-(--color-panel-alt-bg)/50 relative">
      {!isFirst && canRemove && (
         <button
          type="button"
          onClick={onRemove}
          className="absolute top-2 right-2 text-(--color-text-secondary) hover:text-(--color-error) transition-colors"
          aria-label={t.removeTank}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-2">
          <div className="md:col-span-1 field-wrap">
               <label className="block text-xs font-medium text-(--color-text-tertiary) mb-1">{t.tankId}</label>
               <input {...register(`tanks.${index}.tankId`)} type="text" className={inputClasses} placeholder={t.ph_tankId}/>
          </div>
          <div className="md:col-span-2 field-wrap">
               <label className="block text-xs font-medium text-(--color-text-tertiary) mb-1">{t.productStored}</label>
               <input {...register(`tanks.${index}.product`)} type="text" className={inputClasses} placeholder={t.ph_product}/>
          </div>
          <div className="md:col-span-1">
             <ControlledUnitInputField 
                name={`tanks.${index}.volume`} 
                label={t.volume} 
                units={['m³']}
                placeholder={t.ph_volume} 
             />
          </div>
          <div className="md:col-span-1">
             <ControlledUnitInputField name={`tanks.${index}.normalInventory`} label="Normal operating inventory" description="Typical liquid inventory." units={['t']} placeholder="e.g. 850" />
          </div>
          <div className="md:col-span-1">
             <ControlledUnitInputField name={`tanks.${index}.maximumUsableCapacity`} label="Maximum usable capacity" description="Maximum working inventory." units={['t']} placeholder="e.g. 1000" />
          </div>
          <div className="md:col-span-1">
             <ControlledUnitInputField 
                name={`tanks.${index}.diameter`} 
                label={t.diameter} 
                units={['m']}
                placeholder={t.ph_diameter} 
             />
          </div>
          <div className="md:col-span-1">
             <ControlledUnitInputField 
                name={`tanks.${index}.height`} 
                label={t.height} 
                units={['m']}
                placeholder={t.ph_height} 
             />
          </div>
          <div className="md:col-span-1">
             <ControlledSelectField 
                name={`tanks.${index}.type`} 
                label={t.tankType} 
                options={t.tankTypes as unknown as string[]} 
             />
          </div>
          <div className="md:col-span-1">
             <ControlledSelectField name={`tanks.${index}.vaporCollectionParticipation`} label="Connected to this vapor system?" options={['Yes', 'No']} />
          </div>
          <div className="md:col-span-1">
             <ControlledSelectField 
                name={`tanks.${index}.material`} 
                label={t.material} 
                options={t.materials as unknown as string[]} 
             />
          </div>
          <div className="md:col-span-1">
             <ControlledSelectField 
                name={`tanks.${index}.designCode`} 
                label={t.designCode} 
                options={['ISO 28300 / EN 14015', 'API 650 (owner requirement)', 'Other']}
             />
          </div>
          <div className="md:col-span-3">
             <ControlledUnitInputField 
                name={`tanks.${index}.throughput`} 
                label={t.avgThroughput} 
                units={['m³/month', 'm³/day']}
                placeholder={t.ph_throughput} 
             />
          </div>
      </div>
    </div>
  )
};
