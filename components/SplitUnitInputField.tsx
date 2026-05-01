
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

  const baseInputClasses = "w-full pl-3 py-2 border shadow-sm focus:z-10 transition duration-150 ease-in-out bg-(--color-input-bg) text-(--color-text-primary) focus:ring-(--color-input-focus-ring) focus:border-(--color-input-focus-ring)";

  return (
    <div className="field-wrap">
      <label htmlFor={`${id}-positive`} className="block text-sm font-medium text-(--color-text-tertiary)">
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
          className={`${baseInputClasses} border-(--color-border) rounded-l-md`}
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
          className={`${baseInputClasses} border-t-(--color-border) border-b-(--color-border) border-r-(--color-border) -ml-px`}
          aria-label="Negative pressure value"
        />
        <select
          aria-label="Unit"
          value={selectedUnit}
          onChange={(e) => setSelectedUnit(e.target.value)}
          className="relative -ml-px inline-flex items-center px-4 py-2 border border-(--color-border) text-sm font-medium rounded-r-md text-(--color-text-tertiary) bg-(--color-panel-alt-bg) hover:bg-(--color-panel-alt-bg)/80 focus:outline-none focus:ring-1 focus:ring-(--color-input-focus-ring) focus:border-(--color-input-focus-ring)"
        >
          {units.map(unit => (
            <option key={unit} value={unit}>{unit}</option>
          ))}
        </select>
      </div>
      {description && <p className="mt-2 text-xs text-(--color-text-secondary)">{description}</p>}
    </div>
  );
};