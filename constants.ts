// Volumetric conversion factor from US Gallons to Cubic Feet (ft^3)
export const GPM_TO_FT3_FACTOR = 0.1337;

// Conversion from Standard Cubic Feet per Minute to Standard Cubic Meters per Hour
export const SCFM_TO_SCMH_FACTOR = 1.69901;

// Conversion from US Gallons Per Minute to Liters Per Minute
export const GPM_TO_LPM_FACTOR = 3.78541;

// Conversion from Bar to Pounds per Square Inch
export const BAR_TO_PSI_FACTOR = 14.5038;

// Conversion from Cubic Meters to US Gallons
export const M3_TO_GAL_FACTOR = 264.172;

// Conversion from Barrels (oil) to US Gallons
export const BBL_TO_GAL_FACTOR = 42;

// A simplified empirical factor for estimating breathing losses from tank volume and temperature swing.
// This is not based on a specific physical model but provides a reasonable estimate for this calculator's purpose.
export const BREATHING_LOSS_EMPIRICAL_FACTOR = 0.0005;

// Standard temperature in Fahrenheit, used as a baseline for vapor growth calculations.
export const STANDARD_TEMP_F = 60;

// Standard VRU compressor horsepower sizes.
export const HP_SIZES: { value: number, display: string }[] = [
  { value: 0.25, display: '1/4' },
  { value: 1/3, display: '1/3' },
  { value: 0.5, display: '1/2' },
  { value: 0.75, display: '3/4' },
  { value: 1, display: '1' },
  { value: 1.5, display: '1.5' },
  { value: 2, display: '2' },
  { value: 3, display: '3' },
  { value: 5, display: '5' },
  { value: 7.5, display: '7.5' },
  { value: 10, display: '10' },
  { value: 15, display: '15' },
  { value: 20, display: '20' },
  { value: 25, display: '25' },
  { value: 30, display: '30' },
  { value: 40, display: '40' },
  { value: 50, display: '50' },
  { value: 60, display: '60' },
  { value: 75, display: '75' },
  { value: 100, display: '100' },
  { value: 125, display: '125' },
  { value: 150, display: '150' },
];

// Divisor to convert SCFM to a raw HP value for sizing.
export const HP_CALCULATION_DIVISOR = 10;
