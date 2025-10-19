import React from 'react';
import { type VRUInput } from '../types';

interface InputFieldProps {
  id: keyof VRUInput;
  label: string;
  unit: string;
  value: number | null;
  onChange: (id: keyof VRUInput, value: string) => void;
  error?: string;
  placeholder?: string;
  isInteger?: boolean;
}

export const InputField: React.FC<InputFieldProps> = ({ id, label, unit, value, onChange, error, placeholder, isInteger = false }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(id, e.target.value);
  };

  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium text-gray-600 mb-1">
        {label}
      </label>
      <div className="relative">
        <input
          type="number"
          id={id}
          name={id}
          value={value === null ? '' : value}
          onChange={handleChange}
          placeholder={placeholder}
          step={isInteger ? "1" : "any"}
          min="0"
          className={`w-full pl-3 pr-16 py-2 border rounded-md shadow-sm transition duration-150 ease-in-out ${
            error
              ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
              : 'border-gray-300 focus:ring-primary-gold focus:border-primary-gold'
          }`}
          aria-describedby={error ? `${id}-error` : undefined}
        />
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <span className="text-gray-500 text-sm">{unit}</span>
        </div>
      </div>
      {error && (
        <p id={`${id}-error`} className="mt-1 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
};