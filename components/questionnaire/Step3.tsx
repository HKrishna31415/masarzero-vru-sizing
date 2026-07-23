import React from 'react';
import { ControlledSelectField } from './ControlledSelectField';
import { ControlledUnitInputField } from './ControlledUnitInputField';
import { ControlledTankInventoryManager } from '../ControlledTankInventoryManager';
import { useLang } from '../../LanguageContext';

export const Step3: React.FC = () => {
  const { t } = useLang();

  return (
    <fieldset>
      <legend className="sr-only">{t.s3title}</legend>
      <div id="tank-inventory-section">
        <ControlledTankInventoryManager />
      </div>
      <div className="form-grid" style={{ marginTop: "1.5rem" }}>
        <ControlledSelectField 
          name="tankBlanketing" 
          label={t.tankBlanketed} 
          description={t.tankBlanketedDesc}
          options={t.blanketOptions as unknown as string[]} 
        />
        <div>
          <ControlledSelectField 
            name="blanketingGasType" 
            label={t.blanketGasType} 
            description={t.blanketGasTypeDesc}
            options={t.blanketGases as unknown as string[]} 
          />
          <ControlledUnitInputField 
            name="blanketingPressure" 
            label={t.blanketPressure} 
            description={t.blanketPressureDesc}
            units={['mbar', 'Pa']}
            placeholder={t.ph_blanketPressure} 
          />
        </div>
      </div>
    </fieldset>
  );
};
