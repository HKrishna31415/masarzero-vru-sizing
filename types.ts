export interface VRUInput {
  maxDeliveryRateGPM: number | null;
  simulOps: number | null;
  rvpPSI: number | null;
  maxTempF: number | null;
  safetyFactor: number | null;
  tankVolumeGAL: number | null;
  tempSwingF: number | null;
}

interface SizingResult {
  vruCapacitySCFM: number;
  vruCapacitySCMH: number;
}

export interface VRUResult {
  suggested: SizingResult & {
    totalFlowGPM: number;
    totalFlowLPM: number;
    volumetricFactor: number;
    rvpPSI: number;
    maxTempF: number;
  };
  minimum: SizingResult;
  recommendedHP: string;
}
