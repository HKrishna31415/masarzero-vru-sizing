import { z } from 'zod';

const UnitValueSchema = z.object({
  value: z.string(),
  unit: z.string(),
});

const TankSchema = z.object({
  tankId: z.string().default(''), product: z.string().default(''),
  volume: UnitValueSchema.default({ value: '', unit: 'm³' }),
  normalInventory: UnitValueSchema.default({ value: '', unit: 't' }),
  maximumUsableCapacity: UnitValueSchema.default({ value: '', unit: 't' }),
  diameter: UnitValueSchema.default({ value: '', unit: 'm' }), height: UnitValueSchema.default({ value: '', unit: 'm' }),
  throughput: UnitValueSchema.default({ value: '', unit: 'm³/month' }),
  type: z.string().default('Cone Roof'), material: z.string().default('Carbon Steel'),
  designCode: z.string().default('ISO 28300 / EN 14015'), vaporCollectionParticipation: z.string().default('Yes'),
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
  transferSources: z.array(z.string()).default([]),
  pipelineTransferFlowRate: UnitValueSchema.default({ value: '', unit: 'm³/h' }),
  simultaneousTransferLines: z.string().optional(),
  normalTransferHours: z.string().optional(),
  peakTransferHours: z.string().optional(),
  transferPressure: UnitValueSchema.default({ value: '', unit: 'barg' }),
  transferFillMethod: z.string().optional(),
  worstCaseScenario: z.string().optional(),
  simultaneousLoadingArms: z.string().optional(),
  simultaneousMarineBerths: z.string().optional(),
  averageLoadingRate: UnitValueSchema.default({ value: '', unit: 'm³/h' }),
  peakLoadingRate: UnitValueSchema.default({ value: '', unit: 'm³/h' }),
  loadingFrequency: z.string().optional(),
  loadingPumpFlowRate: UnitValueSchema.default({ value: '', unit: 'LPM' }),
  simultaneousLoading: z.string().optional(),
  dischargePressure: UnitValueSchema.default({ value: '', unit: 'bar' }),
  ambientTempMax: UnitValueSchema.default({ value: '', unit: '°C' }),
  ambientTempMin: UnitValueSchema.default({ value: '', unit: '°C' }),

  // Refinery unit design basis (shown only when storageType is Refinery)
  refineryUnit: z.string().optional(),
  vaporSourceDescription: z.string().optional(),
  operatingMode: z.string().optional(),
  operatingHours: z.string().optional(),
  normalVaporFlow: UnitValueSchema.default({ value: '', unit: 'Nm³/h' }),
  minimumVaporFlow: UnitValueSchema.default({ value: '', unit: 'Nm³/h' }),
  maximumVaporFlow: UnitValueSchema.default({ value: '', unit: 'Nm³/h' }),
  designVaporFlow: UnitValueSchema.default({ value: '', unit: 'Nm³/h' }),
  vaporInletPressure: UnitValueSchema.default({ value: '', unit: 'barg' }),
  vaporInletTemperature: UnitValueSchema.default({ value: '', unit: '°C' }),
  liquidCarryover: z.string().optional(),
  vaporCompositionBasis: z.string().optional(),
  h2sConcentration: UnitValueSchema.default({ value: '', unit: 'ppm vol' }),
  benzeneConcentration: UnitValueSchema.default({ value: '', unit: 'ppm vol' }),
  oxygenConcentration: UnitValueSchema.default({ value: '', unit: '% vol' }),
  waterContent: UnitValueSchema.default({ value: '', unit: 'ppm wt' }),
  hydrocarbonDewPoint: UnitValueSchema.default({ value: '', unit: '°C' }),
  downstreamDestination: z.string().optional(),
  downstreamPressure: UnitValueSchema.default({ value: '', unit: 'barg' }),
  existingPipingDocuments: z.string().optional(),
  controlSystemVendor: z.string().optional(),
  plcRequirement: z.string().optional(),
  communicationsInterface: z.string().optional(),
  reliefDesignResponsibility: z.string().optional(),
  esdRequired: z.string().optional(),
  silRequirement: z.string().optional(),
  fireGasInterface: z.string().optional(),
  controlSystem: z.string().optional(),
  hazardousAreaDrawing: z.string().optional(),
  equipmentCertification: z.string().optional(),
  vruAvailability: z.string().optional(),
  vocGuaranteeBasis: z.string().optional(),
  emissionsStandard: z.string().optional(),
  requiredDocuments: z.string().optional(),
  ownerStandards: z.string().optional(),
  performanceTesting: z.string().optional(),

  // Step 3: Tank Inventory
  tankBlanketing: z.string().optional(),
  blanketingGasType: z.string().optional(),
  blanketingPressure: UnitValueSchema.default({ value: '', unit: 'mbar' }),
  tanks: z.array(TankSchema).default([]),

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
  tieInDistance: UnitValueSchema.default({ value: '', unit: 'm' }),
  tieInElevationChange: UnitValueSchema.default({ value: '', unit: 'm' }),

  // Step 6: Utilities & Area Class
  electricalVoltage: z.string().optional(),
  electricalPhase: z.string().optional(),
  electricalFreq: z.string().optional(),
  classificationSystem: z.string().default('Zone'),
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
  plotLength: UnitValueSchema.default({ value: '', unit: 'm' }),
  plotWidth: UnitValueSchema.default({ value: '', unit: 'm' }),
  plotLayoutRestrictions: z.string().optional(),

  // Step 8: Environmental & Safety
  regulations: z.string().optional(),
  vocRecovery: UnitValueSchema.default({ value: '', unit: '%' }),
  noiseLevel: UnitValueSchema.default({ value: '', unit: 'dBA @ 1m' }),
  noiseBoundaryDistance: UnitValueSchema.default({ value: '', unit: 'm' }),
  guaranteedOutletConcentration: UnitValueSchema.default({ value: '', unit: 'mg/Nm³' }),
  outletPollutantBasis: z.string().optional(),
  cemsRequirement: z.string().optional(),

  // Step 9: Reporting
  reportingRequirements: z.string().optional(),

  // Step 10: Additional Notes
  otherRequirements: z.string().optional(),
});

export type QuestionnaireData = z.infer<typeof questionnaireSchema>;
