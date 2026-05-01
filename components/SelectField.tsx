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
    <div className="field-wrap">
      <label htmlFor={id}>{label}</label>
      <select id={id} name={id} value={value} onChange={onChange} className={className}>
        {options.map(option => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
      {description && <p className="field-desc">{description}</p>}
    </div>
  );
};
