
import React from 'react';

interface SelectFieldProps {
  id: string;
  label: string;
  description?: string;
  options: string[];
  className?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export const SelectField: React.FC<SelectFieldProps> = ({ id, label, description, options, className, value, onChange }) => {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium text-[var(--color-text-tertiary)]">
        {label}
      </label>
      <div className="mt-1">
        <select
          id={id}
          name={id}
          value={value}
          onChange={onChange}
          className={`w-full pl-3 py-2 border border-[var(--color-border)] rounded-md shadow-sm focus:ring-[var(--color-input-focus-ring)] focus:border-[var(--color-input-focus-ring)] transition duration-150 ease-in-out bg-[var(--color-input-bg)] text-[var(--color-text-primary)] ${className}`}
        >
          {options.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>
      {description && <p className="mt-2 text-xs text-[var(--color-text-secondary)]">{description}</p>}
    </div>
  );
};