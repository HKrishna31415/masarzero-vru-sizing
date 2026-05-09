import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';

interface ControlledUnitInputFieldProps {
  name: string;
  label: string;
  description?: string;
  units: string[];
  placeholder?: string;
  isInteger?: boolean;
}

export const ControlledUnitInputField: React.FC<ControlledUnitInputFieldProps> = ({
  name, label, description, units, placeholder, isInteger = false,
}) => {
  const { control } = useFormContext();

  return (
    <div className="field-wrap">
      <label>{label}</label>
      <div className="unit-row">
        <Controller
          name={`${name}.value`}
          control={control}
          render={({ field }) => (
            <input
              {...field}
              type="number"
              placeholder={placeholder}
              step={isInteger ? '1' : 'any'}
              min="0"
            />
          )}
        />
        {units.length > 1 ? (
          <Controller
            name={`${name}.unit`}
            control={control}
            render={({ field }) => (
              <select aria-label="Unit" {...field}>
                {units.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            )}
          />
        ) : (
          <span className="unit-badge">{units[0]}</span>
        )}
      </div>
      {description && <p className="field-desc">{description}</p>}
    </div>
  );
};
