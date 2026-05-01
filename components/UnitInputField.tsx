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
  id, label, description, units, placeholder, isInteger = false,
  value, unit, onValueChange, onUnitChange,
}) => {
  return (
    <div className="field-wrap">
      <label htmlFor={id}>{label}</label>
      <div className="unit-row">
        <input
          type="number"
          id={id}
          name={id}
          value={value}
          onChange={e => onValueChange(e.target.value)}
          placeholder={placeholder}
          step={isInteger ? '1' : 'any'}
          min="0"
        />
        {units.length > 1 ? (
          <select aria-label="Unit" value={unit} onChange={e => onUnitChange(e.target.value)}>
            {units.map(u => <option key={u} value={u}>{u}</option>)}
          </select>
        ) : (
          <span className="unit-badge">{units[0]}</span>
        )}
      </div>
      {description && <p className="field-desc">{description}</p>}
    </div>
  );
};
