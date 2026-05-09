import { z } from 'zod';

const UnitValueSchema = z.object({
  value: z.string(),
  unit: z.string(),
});

export const questionnaireSchema = z.object({
  // Step 1: Project Information
  projectName: z.string().optional(),
  siteCountry: z.string().optional(),
  siteCity: z.string().optional(),
  siteAddress: z.string().optional(),
  contactPerson: z.string().optional(),
  contactEmail: z.string().email().optional().or(z.literal('')),
  projectStartDate: z.string().optional(),
  projectEndDate: z.string().optional(),

  // Step 2: Storage & Logistics
  storageType: z.string().default('Truck Filling Station'),
  storageTypeOther: z.string().optional(),
  deliveryMethod: z.string().optional(),
  loadingMethod: z.string().optional(),
  loadingFrequency: z.string().optional(),
  loadingPumpFlowRate: UnitValueSchema.default({ value: '', unit: 'LPM' }),
  simultaneousLoading: z.string().optional(),
  dischargePressure: UnitValueSchema.default({ value: '', unit: 'bar' }),
  ambientTempMax: UnitValueSchema.default({ value: '', unit: '°C' }),
  ambientTempMin: UnitValueSchema.default({ value: '', unit: '°C' }),

  // Step 3: Tank Inventory
  tankBlanketing: z.string().optional(),
  blanketingGasType: z.string().optional(),
  blanketingPressure: UnitValueSchema.default({ value: '', unit: 'mbar' }),
  tanks: z.array(z.any()).default([]), // For TankInventoryManager

  // Step 4: Vapor Composition
  gcAnalysis: z.string().optional(),
  corrosiveComponents: z.string().optional(),
  vaporSaturation: z.string().optional(),
  vaporMolecularWeight: UnitValueSchema.default({ value: '', unit: 'g/mol' }),
  vaporLEL: UnitValueSchema.default({ value: '', unit: '% by vol' }),

  // Step 5: Piping & Venting
  headerSize: UnitValueSchema.default({ value: '', unit: 'mm' }),
  pipingLength: UnitValueSchema.default({ value: '', unit: 'meters' }),
  ventSetPointsPositive: z.string().optional(),
  ventSetPointsNegative: z.string().optional(),
  ventSetPointsUnit: z.string().default('mbar'),
  arrestorExists: z.string().optional(),
  pipingMaterial: z.string().optional(),

  // Step 6: Utilities & Area Class
  electricalVoltage: z.string().optional(),
  electricalPhase: z.string().optional(),
  electricalFreq: z.string().optional(),
  classificationSystem: z.string().default('Class/Division'),
  areaDiv: z.string().optional(),
  areaGroup: z.string().optional(),
  areaZone: z.string().optional(),
  areaGasGroup: z.string().optional(),
  electricitySupply: z.string().optional(),
  internetAccess: z.string().optional(),
  instrumentAir: UnitValueSchema.default({ value: '', unit: 'bar' }),
  coolingWaterFlow: UnitValueSchema.default({ value: '', unit: 'LPM' }),
  coolingWaterTemp: UnitValueSchema.default({ value: '', unit: '°C' }),
  coolingWaterPressure: UnitValueSchema.default({ value: '', unit: 'bar' }),

  // Step 7: Site Constraints
  spaceConstraints: z.string().optional(),
  constructionEquipment: z.string().optional(),

  // Step 8: Environmental & Safety
  regulations: z.string().optional(),
  vocRecovery: UnitValueSchema.default({ value: '', unit: '%' }),
  noiseLevel: UnitValueSchema.default({ value: '', unit: 'dBA @ 1m' }),

  // Step 9: Reporting
  reportingRequirements: z.string().optional(),

  // Step 10: Additional Notes
  otherRequirements: z.string().optional(),
});

export type QuestionnaireData = z.infer<typeof questionnaireSchema>;
