export type UnitCategory = 'pressure' | 'temperature' | 'length' | 'flow' | 'volume' | 'weight';

const conversionFactors: Record<string, number> = {
  // Pressure (Base: bar)
  'bar': 1,
  'psig': 0.0689476,
  'kPa': 0.01,
  'mbar': 0.001,
  'Pa': 0.00001,
  'in WC': 0.00249089,

  // Temperature (handled specially)
  
  // Length (Base: meters)
  'meters': 1,
  'feet': 0.3048,
  'mm': 0.001,
  'inches': 0.0254,

  // Flow (Base: LPM)
  'LPM': 1,
  'GPM': 3.78541,
  'm³/month': 1 / (30 * 24 * 60 / 1000), // Approximate
  
  // Volume (Base: L)
  'L': 1,
  'gal': 3.78541,
  'm³': 1000,
};

export const convertUnit = (value: number, from: string, to: string, category: UnitCategory): number => {
  if (from === to) return value;

  if (category === 'temperature') {
    if (from === '°C' && to === '°F') return (value * 9) / 5 + 32;
    if (from === '°F' && to === '°C') return ((value - 32) * 5) / 9;
    return value;
  }

  const baseValue = value * (conversionFactors[from] || 1);
  return baseValue / (conversionFactors[to] || 1);
};

export const formatValue = (value: number, precision: number = 2): string => {
  return value.toLocaleString(undefined, {
    minimumFractionDigits: precision,
    maximumFractionDigits: precision,
  });
};
