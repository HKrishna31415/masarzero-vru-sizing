import React from 'react';
import { useFormContext } from 'react-hook-form';

interface ControlledSelectFieldProps {
  name: string;
  label: string;
  description?: string;
  options: string[];
}

export const ControlledSelectField: React.FC<ControlledSelectFieldProps> = ({
  name, label, description, options,
}) => {
  const { register } = useFormContext();

  return (
    <div className="field-wrap">
      <label htmlFor={name}>{label}</label>
      <select {...register(name)} id={name}>
        {options.map(opt => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
      {description && <p className="field-desc">{description}</p>}
    </div>
  );
};
