import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type PortfolioSiteType = 'Tank Farm' | 'Storage Facility' | 'Refinery';
export type PortfolioPriority = 'High' | 'Medium' | 'Low';

export interface StorageRefineryPortfolioSite {
  id: string;
  name: string;
  country: string;
  city: string;
  siteType: PortfolioSiteType;
  normalInventoryTonnes: string;
  maximumUsableCapacityTonnes: string;
  monthlyThroughputTonnes: string;
  priority: PortfolioPriority;
}

export interface RetailNetworkPortfolio {
  country: string;
  region: string;
  stationCount: string;
  averageMonthlySalesLitres: string;
  priority: PortfolioPriority;
}

interface PortfolioState {
  sites: StorageRefineryPortfolioSite[];
  retailNetwork: RetailNetworkPortfolio;
  selectedSiteId?: string;
  addSite: (site?: Partial<StorageRefineryPortfolioSite>) => void;
  updateSite: (id: string, patch: Partial<StorageRefineryPortfolioSite>) => void;
  removeSite: (id: string) => void;
  setRetailNetwork: (patch: Partial<RetailNetworkPortfolio>) => void;
  selectSite: (id?: string) => void;
}

const createSite = (site: Partial<StorageRefineryPortfolioSite> = {}): StorageRefineryPortfolioSite => ({
  id: globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random()}`,
  name: '', country: '', city: '', siteType: 'Tank Farm',
  normalInventoryTonnes: '', maximumUsableCapacityTonnes: '', monthlyThroughputTonnes: '', priority: 'Medium',
  ...site,
});

const emptyRetailNetwork: RetailNetworkPortfolio = {
  country: '', region: '', stationCount: '', averageMonthlySalesLitres: '', priority: 'Medium',
};

export const usePortfolioStore = create<PortfolioState>()(
  persist(
    (set) => ({
      sites: [],
      retailNetwork: emptyRetailNetwork,
      addSite: (site) => set((state) => ({ sites: [...state.sites, createSite(site)] })),
      updateSite: (id, patch) => set((state) => ({ sites: state.sites.map((site) => site.id === id ? { ...site, ...patch } : site) })),
      removeSite: (id) => set((state) => ({
        sites: state.sites.filter((site) => site.id !== id),
        selectedSiteId: state.selectedSiteId === id ? undefined : state.selectedSiteId,
      })),
      setRetailNetwork: (patch) => set((state) => ({ retailNetwork: { ...state.retailNetwork, ...patch } })),
      selectSite: (id) => set({ selectedSiteId: id }),
    }),
    { name: 'vru-portfolio-storage', storage: createJSONStorage(() => localStorage) },
  ),
);
