
import React from 'react';

interface CalculatorUnitFieldProps {
  id: string;
  label: string;
  value: number | null;
  onValueChange: (value: string) => void;
  unit?: string;
  onUnitChange?: (unit: string) => void;
  units: string[];
  error?: string;
  placeholder?: string;
  isInteger?: boolean;
}

export const CalculatorUnitField: React.FC<CalculatorUnitFieldProps> = ({ 
  id, 
  label, 
  value, 
  onValueChange, 
  unit, 
  onUnitChange, 
  units, 
  error, 
  placeholder, 
  isInteger = false 
}) => {
  const hasUnits = units.length > 1;

  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium text-(--color-text-tertiary) mb-1">
        {label}
      </label>
      <div className="relative flex items-stretch">
        <input
          type="number"
          id={id}
          name={id}
          value={value === null ? '' : value}
          onChange={(e) => onValueChange(e.target.value)}
          placeholder={placeholder}
          step={isInteger ? "1" : "any"}
          min="0"
          className={`w-full pl-3 py-2 border shadow-sm focus:z-10 transition duration-150 ease-in-out bg-(--color-input-bg) text-(--color-text-primary) ${
            hasUnits ? 'rounded-l-md' : 'rounded-md'
          } ${
            error
              ? 'border-(--color-error) focus:ring-(--color-error) focus:border-(--color-error)'
              : 'border-(--color-border) focus:ring-(--color-input-focus-ring) focus:border-(--color-input-focus-ring)'
          }`}
          aria-describedby={error ? `${id}-error` : undefined}
        />
        <div className={`absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none ${hasUnits ? 'hidden' : ''}`}>
           <span className="text-(--color-text-secondary) text-sm">{units[0]}</span>
        </div>
        {hasUnits && onUnitChange && (
          <select
            aria-label="Unit"
            value={unit}
            onChange={(e) => onUnitChange(e.target.value)}
            className="relative -ml-px inline-flex items-center px-4 py-2 border border-(--color-border) text-sm font-medium rounded-r-md text-(--color-text-tertiary) bg-(--color-panel-alt-bg) hover:bg-(--color-panel-alt-bg)/80 focus:outline-none focus:ring-1 focus:ring-(--color-input-focus-ring) focus:border-(--color-input-focus-ring)"
          >
            {units.map(u => (
              <option key={u} value={u}>{u}</option>
            ))}
          </select>
        )}
      </div>
      {error && (
        <p id={`${id}-error`} className="mt-1 text-xs text-(--color-error)">
          {error}
        </p>
      )}
    </div>
  );
};