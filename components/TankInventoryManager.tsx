
import React, { useState } from 'react';
import { TankInputGroup } from './TankInputGroup';
import { useLang } from '../LanguageContext';

export interface TankData {
  id: number;
  tankId: string;
  product: string;
  volumeValue: string;
  volumeUnit: string;
  diameterValue: string;
  diameterUnit: string;
  heightValue: string;
  heightUnit: string;
  throughputValue: string;
  throughputUnit: string;
  type: string;
  material: string;
  designCode: string;
}

const createNewTank = (id: number): TankData => ({
  id,
  tankId: '',
  product: '',
  volumeValue: '',
  volumeUnit: 'L',
  diameterValue: '',
  diameterUnit: 'm',
  heightValue: '',
  heightUnit: 'm',
  throughputValue: '',
  throughputUnit: 'm³/month',
  type: 'Cone Roof',
  material: 'Carbon Steel',
  designCode: 'API 650',
});

export const TankInventoryManager: React.FC = () => {
  const { t } = useLang();
  const [tanks, setTanks] = useState<TankData[]>([createNewTank(1)]);
  const [nextId, setNextId] = useState(2);

  const handleAddTank = () => {
    setTanks(prev => [...prev, createNewTank(nextId)]);
    setNextId(prev => prev + 1);
  };

  const handleRemoveTank = (id: number) => {
    setTanks(prev => prev.filter(tank => tank.id !== id));
  };

  const handleChange = (id: number, field: keyof Omit<TankData, 'id'>, value: string) => {
    setTanks(prev => prev.map(tank => 
      tank.id === id ? { ...tank, [field]: value } : tank
    ));
  };
  
  return (
    <div className="space-y-6">
      <p className="text-sm text-(--color-text-secondary)">
        {t.tankInventoryDesc}
      </p>
      <div className="space-y-8">
        {tanks.map((tank, index) => (
          <TankInputGroup 
            key={tank.id} 
            tankData={tank}
            onChange={handleChange}
            onRemove={handleRemoveTank} 
            canRemove={tanks.length > 1}
            isFirst={index === 0}
          />
        ))}
      </div>
      <div className="text-left">
        <button
          type="button"
          onClick={handleAddTank}
          className="font-semibold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-(--color-accent-primary) transition-colors duration-200 text-sm inline-flex items-center gap-2 border border-(--color-accent-primary) text-(--color-accent-primary) hover:bg-(--color-accent-primary) hover:text-(--color-accent-text)"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          {t.addAnotherTank}
        </button>
      </div>
    </div>
  );
};