import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { QuestionnaireData } from '../schema/questionnaireSchema';

interface QuestionnaireState {
  formData: Partial<QuestionnaireData>;
  currentStep: number;
  setFormData: (data: Partial<QuestionnaireData>) => void;
  setStep: (step: number) => void;
  resetForm: (seed?: Partial<QuestionnaireData>) => void;
}

const initialData: Partial<QuestionnaireData> = {
  storageType: 'Storage Facility',
  classificationSystem: 'Zone',
  loadingPumpFlowRate: { value: '', unit: 'LPM' },
  transferSources: [],
  pipelineTransferFlowRate: { value: '', unit: 'm³/h' },
  transferPressure: { value: '', unit: 'barg' },
  simultaneousLoading: '',
  dischargePressure: { value: '', unit: 'bar' },
  ambientTempMax: { value: '', unit: '°C' },
  ambientTempMin: { value: '', unit: '°C' },
  blanketingPressure: { value: '', unit: 'mbar' },
  vaporMolecularWeight: { value: '', unit: 'g/mol' },
  vaporLEL: { value: '', unit: '% by vol' },
  headerSize: { value: '', unit: 'mm' },
  pipingLength: { value: '', unit: 'meters' },
  instrumentAir: { value: '', unit: 'bar' },
  coolingWaterFlow: { value: '', unit: 'LPM' },
  coolingWaterTemp: { value: '', unit: '°C' },
  coolingWaterPressure: { value: '', unit: 'bar' },
  vocRecovery: { value: '', unit: '%' },
  noiseLevel: { value: '', unit: 'dBA @ 1m' },
  tanks: [],
};

export const useQuestionnaireStore = create<QuestionnaireState>()(
  persist(
    (set) => ({
      formData: initialData,
      currentStep: 1,
      setFormData: (data) =>
        set((state) => ({
          formData: { ...state.formData, ...data },
        })),
      setStep: (step) => set({ currentStep: step }),
      resetForm: (seed = {}) => set({ formData: { ...initialData, ...seed }, currentStep: 1 }),
    }),
    {
      name: 'vru-questionnaire-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
