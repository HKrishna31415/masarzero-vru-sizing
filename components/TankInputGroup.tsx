
import React from 'react';
import { UnitInputField } from './UnitInputField';
import { SelectField } from './SelectField';
import { type TankData } from './TankInventoryManager';
import { useLang } from '../LanguageContext';

interface TankInputGroupProps {
  tankData: TankData;
  onChange: (id: number, field: keyof Omit<TankData, 'id'>, value: string) => void;
  onRemove: (id: number) => void;
  canRemove: boolean;
  isFirst: boolean;
}

const inputClasses = "w-full pl-3 py-2 border border-(--color-border) rounded-md shadow-sm focus:ring-(--color-input-focus-ring) focus:border-(--color-input-focus-ring) transition duration-150 ease-in-out bg-(--color-input-bg) text-(--color-text-primary) text-sm";

export const TankInputGroup: React.FC<TankInputGroupProps> = ({ tankData, onChange, onRemove, canRemove, isFirst }) => {
  const { t } = useLang();
  const { id, tankId, product } = tankData;

  const handleInputChange = (field: keyof Omit<TankData, 'id'>) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    onChange(id, field, e.target.value);
  };

  return (
    <div className="p-4 border border-(--color-border) rounded-lg bg-(--color-panel-alt-bg)/50 relative">
      {!isFirst && canRemove && (
         <button
          type="button"
          onClick={() => onRemove(id)}
          className="absolute top-2 right-2 text-(--color-text-secondary) hover:text-(--color-error) transition-colors"
          aria-label={t.removeTank}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-2">
          <div className="md:col-span-1">
               <label htmlFor={`tankId-${id}`} className="block text-xs font-medium text-(--color-text-tertiary) mb-1">{t.tankId}</label>
               <input id={`tankId-${id}`} type="text" value={tankId} onChange={handleInputChange('tankId')} className={inputClasses} placeholder={t.ph_tankId}/>
          </div>
          <div className="md:col-span-2">
               <label htmlFor={`product-${id}`} className="block text-xs font-medium text-(--color-text-tertiary) mb-1">{t.productStored}</label>
               <input id={`product-${id}`} type="text" value={product} onChange={handleInputChange('product')} className={inputClasses} placeholder={t.ph_product}/>
          </div>
          <div className="md:col-span-1">
             <UnitInputField id={`volume-${id}`} label={t.volume} units={['L', 'gal', 'm³']} placeholder={t.ph_volume} value={tankData.volumeValue} unit={tankData.volumeUnit} onValueChange={(val) => onChange(id, 'volumeValue', val)} onUnitChange={(val) => onChange(id, 'volumeUnit', val)} />
          </div>
          <div className="md:col-span-1">
             <UnitInputField id={`diameter-${id}`} label={t.diameter} units={['m', 'ft']} placeholder={t.ph_diameter} value={tankData.diameterValue} unit={tankData.diameterUnit} onValueChange={(val) => onChange(id, 'diameterValue', val)} onUnitChange={(val) => onChange(id, 'diameterUnit', val)} />
          </div>
          <div className="md:col-span-1">
             <UnitInputField id={`height-${id}`} label={t.height} units={['m', 'ft']} placeholder={t.ph_height} value={tankData.heightValue} unit={tankData.heightUnit} onValueChange={(val) => onChange(id, 'heightValue', val)} onUnitChange={(val) => onChange(id, 'heightUnit', val)} />
          </div>
          <div className="md:col-span-1">
             <SelectField id={`type-${id}`} label={t.tankType} options={t.tankTypes as unknown as string[]} value={tankData.type} onChange={handleInputChange('type')} />
          </div>
          <div className="md:col-span-1">
             <SelectField id={`material-${id}`} label={t.material} options={t.materials as unknown as string[]} value={tankData.material} onChange={handleInputChange('material')} />
          </div>
          <div className="md:col-span-1">
             <SelectField id={`designCode-${id}`} label={t.designCode} options={t.designCodes as unknown as string[]} value={tankData.designCode} onChange={handleInputChange('designCode')} />
          </div>
          <div className="md:col-span-3">
             <UnitInputField id={`throughput-${id}`} label={t.avgThroughput} units={['L/month', 'm³/month', 'gal/month', 'bbl/day']} placeholder={t.ph_throughput} value={tankData.throughputValue} unit={tankData.throughputUnit} onValueChange={(val) => onChange(id, 'throughputValue', val)} onUnitChange={(val) => onChange(id, 'throughputUnit', val)} />
          </div>
      </div>
    </div>
  )
};