
import React, { useState } from 'react';

interface SplitUnitInputFieldProps {
  id: string;
  label: string;
  description?: string;
  units: string[];
  placeholders?: { positive: string; negative: string };
}

export const SplitUnitInputField: React.FC<SplitUnitInputFieldProps> = ({ id, label, description, units, placeholders }) => {
  const [positiveValue, setPositiveValue] = useState('');
  const [negativeValue, setNegativeValue] = useState('');
  const [selectedUnit, setSelectedUnit] = useState(units[0]);

  const baseInputClasses = "w-full pl-3 py-2 border shadow-sm focus:z-10 transition duration-150 ease-in-out bg-[var(--color-input-bg)] text-[var(--color-text-primary)] focus:ring-[var(--color-input-focus-ring)] focus:border-[var(--color-input-focus-ring)]";

  return (
    <div className="mb-4">
      <label htmlFor={`${id}-positive`} className="block text-sm font-medium text-[var(--color-text-tertiary)]">
        {label}
      </label>
      <div className="mt-1 relative flex items-stretch">
        <input
          type="number"
          id={`${id}-positive`}
          name={`${id}-positive`}
          value={positiveValue}
          onChange={(e) => setPositiveValue(e.target.value)}
          placeholder={placeholders?.positive}
          min="0"
          className={`${baseInputClasses} border-[var(--color-border)] rounded-l-md`}
          aria-label="Positive pressure value"
        />
        <input
          type="number"
          id={`${id}-negative`}
          name={`${id}-negative`}
          value={negativeValue}
          onChange={(e) => setNegativeValue(e.target.value)}
          placeholder={placeholders?.negative}
          max="0"
          className={`${baseInputClasses} border-t-[var(--color-border)] border-b-[var(--color-border)] border-r-[var(--color-border)] -ml-px`}
          aria-label="Negative pressure value"
        />
        <select
          aria-label="Unit"
          value={selectedUnit}
          onChange={(e) => setSelectedUnit(e.target.value)}
          className="relative -ml-px inline-flex items-center px-4 py-2 border border-[var(--color-border)] text-sm font-medium rounded-r-md text-[var(--color-text-tertiary)] bg-[var(--color-panel-alt-bg)] hover:bg-[var(--color-panel-alt-bg)]/80 focus:outline-none focus:ring-1 focus:ring-[var(--color-input-focus-ring)] focus:border-[var(--color-input-focus-ring)]"
        >
          {units.map(unit => (
            <option key={unit} value={unit}>{unit}</option>
          ))}
        </select>
      </div>
      {description && <p className="mt-2 text-xs text-[var(--color-text-secondary)]">{description}</p>}
    </div>
  );
};