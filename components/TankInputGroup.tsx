
import React from 'react';
import { UnitInputField } from './UnitInputField';
import { SelectField } from './SelectField';
import { type TankData } from './TankInventoryManager';

interface TankInputGroupProps {
  tankData: TankData;
  onChange: (id: number, field: keyof Omit<TankData, 'id'>, value: string) => void;
  onRemove: (id: number) => void;
  canRemove: boolean;
  isFirst: boolean;
}

const inputClasses = "w-full pl-3 py-2 border border-[var(--color-border)] rounded-md shadow-sm focus:ring-[var(--color-input-focus-ring)] focus:border-[var(--color-input-focus-ring)] transition duration-150 ease-in-out bg-[var(--color-input-bg)] text-[var(--color-text-primary)] text-sm";

export const TankInputGroup: React.FC<TankInputGroupProps> = ({ tankData, onChange, onRemove, canRemove, isFirst }) => {
  const { id, tankId, product } = tankData;

  const handleInputChange = (field: keyof Omit<TankData, 'id'>) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    onChange(id, field, e.target.value);
  };

  return (
    <div className="p-4 border border-[var(--color-border)] rounded-lg bg-[var(--color-panel-alt-bg)]/50 relative">
      {!isFirst && canRemove && (
         <button
          type="button"
          onClick={() => onRemove(id)}
          className="absolute top-2 right-2 text-[var(--color-text-secondary)] hover:text-[var(--color-error)] transition-colors"
          aria-label="Remove Tank"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-2">
          <div className="md:col-span-1">
               <label htmlFor={`tankId-${id}`} className="block text-xs font-medium text-[var(--color-text-tertiary)] mb-1">Tank ID</label>
               <input id={`tankId-${id}`} type="text" value={tankId} onChange={handleInputChange('tankId')} className={inputClasses} placeholder="e.g., T-101"/>
          </div>
          <div className="md:col-span-2">
               <label htmlFor={`product-${id}`} className="block text-xs font-medium text-[var(--color-text-tertiary)] mb-1">Product Stored</label>
               <input id={`product-${id}`} type="text" value={product} onChange={handleInputChange('product')} className={inputClasses} placeholder="e.g., Gasoline (RVP 10)"/>
          </div>
          <div className="md:col-span-1">
             <UnitInputField 
                id={`volume-${id}`} 
                label="Volume" 
                units={['L', 'gal', 'm³']} 
                placeholder="e.g., 80000"
                value={tankData.volumeValue}
                unit={tankData.volumeUnit}
                onValueChange={(val) => onChange(id, 'volumeValue', val)}
                onUnitChange={(val) => onChange(id, 'volumeUnit', val)}
              />
          </div>
          <div className="md:col-span-1">
             <UnitInputField 
                id={`diameter-${id}`} 
                label="Diameter" 
                units={['m', 'ft']} 
                placeholder="e.g., 4"
                value={tankData.diameterValue}
                unit={tankData.diameterUnit}
                onValueChange={(val) => onChange(id, 'diameterValue', val)}
                onUnitChange={(val) => onChange(id, 'diameterUnit', val)}
              />
          </div>
          <div className="md:col-span-1">
             <UnitInputField 
                id={`height-${id}`} 
                label="Height" 
                units={['m', 'ft']} 
                placeholder="e.g., 6.5"
                value={tankData.heightValue}
                unit={tankData.heightUnit}
                onValueChange={(val) => onChange(id, 'heightValue', val)}
                onUnitChange={(val) => onChange(id, 'heightUnit', val)}
              />
          </div>
           <div className="md:col-span-1">
             <SelectField 
                id={`type-${id}`} 
                label="Tank Type" 
                options={["Cone Roof", "Internal Floating Roof (IFR)", "External Floating Roof (EFR)", "Domed EFR", "Horizontal"]} 
                value={tankData.type}
                onChange={handleInputChange('type')}
              />
          </div>
          <div className="md:col-span-1">
             <SelectField 
                id={`material-${id}`} 
                label="Material" 
                options={["Carbon Steel", "Stainless Steel 304", "Stainless Steel 316", "FRP"]}
                value={tankData.material}
                onChange={handleInputChange('material')}
              />
          </div>
           <div className="md:col-span-1">
             <SelectField 
                id={`designCode-${id}`} 
                label="Design Code" 
                options={["API 650", "API 620", "UL 142", "Other"]}
                value={tankData.designCode}
                onChange={handleInputChange('designCode')}
              />
          </div>
           <div className="md:col-span-3">
             <UnitInputField 
                id={`throughput-${id}`} 
                label="Avg. Throughput" 
                units={['L/month', 'm³/month', 'gal/month', 'bbl/day']} 
                placeholder="e.g., 5000"
                value={tankData.throughputValue}
                unit={tankData.throughputUnit}
                onValueChange={(val) => onChange(id, 'throughputValue', val)}
                onUnitChange={(val) => onChange(id, 'throughputUnit', val)}
              />
          </div>
      </div>
    </div>
  )
};