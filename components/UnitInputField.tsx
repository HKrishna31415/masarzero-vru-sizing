
import React from 'react';

interface UnitInputFieldProps {
  id: string;
  label: string;
  description?: string;
  units: string[];
  placeholder?: string;
  isInteger?: boolean;
  value: string;
  unit: string;
  onValueChange: (value: string) => void;
  onUnitChange: (unit: string) => void;
}

export const UnitInputField: React.FC<UnitInputFieldProps> = ({ 
  id, 
  label, 
  description, 
  units, 
  placeholder, 
  isInteger = false,
  value,
  unit,
  onValueChange,
  onUnitChange
}) => {

  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium text-[var(--color-text-tertiary)]">
        {label}
      </label>
      <div className="mt-1 relative flex items-stretch">
        <input
          type="number"
          id={id}
          name={id}
          value={value}
          onChange={(e) => onValueChange(e.target.value)}
          placeholder={placeholder}
          step={isInteger ? "1" : "any"}
          min="0"
          className="w-full pl-3 py-2 border border-[var(--color-border)] rounded-l-md shadow-sm focus:ring-[var(--color-input-focus-ring)] focus:border-[var(--color-input-focus-ring)] focus:z-10 transition duration-150 ease-in-out bg-[var(--color-input-bg)] text-[var(--color-text-primary)]"
        />
        <select
          aria-label="Unit"
          value={unit}
          onChange={(e) => onUnitChange(e.target.value)}
          className="relative -ml-px inline-flex items-center px-4 py-2 border border-[var(--color-border)] text-sm font-medium rounded-r-md text-[var(--color-text-tertiary)] bg-[var(--color-panel-alt-bg)] hover:bg-[var(--color-panel-alt-bg)]/80 focus:outline-none focus:ring-1 focus:ring-[var(--color-input-focus-ring)] focus:border-[var(--color-input-focus-ring)]"
        >
          {units.map(u => (
            <option key={u} value={u}>{u}</option>
          ))}
        </select>
      </div>
      {description && <p className="mt-2 text-xs text-[var(--color-text-secondary)]">{description}</p>}
    </div>
  );
};