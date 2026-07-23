import React, { useEffect, useMemo, useState } from 'react';
import { BarChart3, Building2, ChevronRight, Fuel, Plus, Trash2 } from 'lucide-react';
import { PortfolioPriority, PortfolioSiteType, StorageRefineryPortfolioSite, usePortfolioStore } from '../store/usePortfolioStore';

interface PortfolioOverviewProps {
  onStartStorage: (site: StorageRefineryPortfolioSite) => void;
  onStartGasStation: (location: { country: string; city: string }) => void;
}

const number = (value: string) => Number(value) || 0;
const format = (value: number) => value.toLocaleString();

export const PortfolioOverview: React.FC<PortfolioOverviewProps> = ({ onStartStorage, onStartGasStation }) => {
  const { sites, retailNetwork, addSite, updateSite, removeSite, setRetailNetwork } = usePortfolioStore();
  const [suggestion, setSuggestion] = useState({ country: '', city: '' });

  useEffect(() => {
    const controller = new AbortController();
    void fetch('https://ipapi.co/json/', { signal: controller.signal, cache: 'no-store' })
      .then((response) => response.ok ? response.json() : undefined)
      .then((data: { country_name?: string; country_capital?: string } | undefined) => {
        if (!data?.country_name) return;
        setSuggestion({ country: data.country_name, city: data.country_capital || '' });
        if (!retailNetwork.country) setRetailNetwork({ country: data.country_name });
      })
      .catch(() => undefined);
    return () => controller.abort();
  }, []);

  const totals = useMemo(() => ({
    inventory: sites.reduce((sum, site) => sum + number(site.normalInventoryTonnes), 0),
    capacity: sites.reduce((sum, site) => sum + number(site.maximumUsableCapacityTonnes), 0),
    throughput: sites.reduce((sum, site) => sum + number(site.monthlyThroughputTonnes), 0),
    retailSales: number(retailNetwork.stationCount) * number(retailNetwork.averageMonthlySalesLitres),
  }), [sites, retailNetwork]);

  const addSuggestedSite = () => addSite({ country: suggestion.country, city: suggestion.city });
  const field = (site: StorageRefineryPortfolioSite, key: keyof StorageRefineryPortfolioSite, label: string, type = 'text') => <label className="block text-xs font-semibold text-gray-700"><span className="mb-1 block">{label}</span><input type={type} min={type === 'number' ? 0 : undefined} value={String(site[key] || '')} onChange={(event) => updateSite(site.id, { [key]: event.target.value } as Partial<StorageRefineryPortfolioSite>)} /></label>;

  return <div className="mx-auto max-w-6xl px-3 py-6 sm:px-6 sm:py-10">
    <div className="mb-7 max-w-3xl"><div className="mb-3 flex items-center gap-2 text-teal-700"><BarChart3 size={21}/><span className="font-semibold">Portfolio overview</span></div><h1 className="text-3xl font-bold tracking-tight text-gray-900">Map the opportunity before the detailed engineering review.</h1><p className="mt-3 text-sm leading-6 text-gray-600">Record the site totals you know today. Select a storage or refinery site only when you are ready to prepare its detailed VRU questionnaire.</p></div>

    <section className="mb-7 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6"><div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center"><div><h2 className="text-lg font-bold text-gray-900">Storage & refinery portfolio</h2><p className="mt-1 text-sm text-gray-600">Use site totals in tonnes. Only detailed site reviews require tank-by-tank data.</p></div><button type="button" onClick={addSuggestedSite} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-teal-700 px-4 py-2 text-sm font-bold text-white hover:bg-teal-800"><Plus size={17}/>Add site</button></div>
      <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-3"><div className="rounded-lg bg-teal-50 p-3 text-sm"><span className="block text-xs font-semibold text-teal-800">Normal inventory</span><strong className="text-lg text-teal-950">{format(totals.inventory)} t</strong></div><div className="rounded-lg bg-gray-100 p-3 text-sm"><span className="block text-xs font-semibold text-gray-700">Usable capacity</span><strong className="text-lg text-gray-950">{format(totals.capacity)} t</strong></div><div className="rounded-lg bg-gray-100 p-3 text-sm"><span className="block text-xs font-semibold text-gray-700">Monthly throughput</span><strong className="text-lg text-gray-950">{format(totals.throughput)} t/month</strong></div></div>
      <div className="space-y-4">{sites.length === 0 && <div className="rounded-lg bg-gray-50 p-5 text-sm text-gray-600">No storage or refinery sites added yet. Add a site to capture its market-screening totals.</div>}{sites.map((site, index) => <div key={site.id} className="rounded-lg border border-gray-200 p-4"><div className="mb-4 flex items-center justify-between gap-3"><h3 className="font-bold text-gray-900">Site {index + 1}</h3><button type="button" onClick={() => removeSite(site.id)} className="inline-flex min-h-10 items-center gap-1 rounded-md px-2 text-sm font-semibold text-red-700 hover:bg-red-50" aria-label={`Remove ${site.name || `site ${index + 1}`}`}><Trash2 size={16}/>Remove</button></div><div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">{field(site, 'name', 'Site name')}{field(site, 'country', 'Country')}{field(site, 'city', 'City / region')}<label className="block text-xs font-semibold text-gray-700"><span className="mb-1 block">Site type</span><select value={site.siteType} onChange={(event) => updateSite(site.id, { siteType: event.target.value as PortfolioSiteType })}>{(['Tank Farm', 'Storage Facility', 'Refinery'] as PortfolioSiteType[]).map((value) => <option key={value}>{value}</option>)}</select></label>{field(site, 'normalInventoryTonnes', 'Typical inventory (t)', 'number')}{field(site, 'maximumUsableCapacityTonnes', 'Usable capacity (t)', 'number')}{field(site, 'monthlyThroughputTonnes', 'Monthly throughput (t)', 'number')}<label className="block text-xs font-semibold text-gray-700"><span className="mb-1 block">Priority</span><select value={site.priority} onChange={(event) => updateSite(site.id, { priority: event.target.value as PortfolioPriority })}>{(['High', 'Medium', 'Low'] as PortfolioPriority[]).map((value) => <option key={value}>{value}</option>)}</select></label></div><button type="button" onClick={() => onStartStorage(site)} className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-lg border border-teal-700 px-4 py-2 text-sm font-bold text-teal-800 hover:bg-teal-50">Open detailed VRU questionnaire <ChevronRight size={17}/></button></div>)}</div>
    </section>

    <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6"><div className="mb-5 flex items-start gap-3"><div className="mt-0.5 rounded-lg bg-teal-50 p-2 text-teal-700"><Fuel size={19}/></div><div><h2 className="text-lg font-bold text-gray-900">Retail network</h2><p className="mt-1 text-sm text-gray-600">Add one aggregate network view. Individual station VRU sizing remains a separate, PDF-only assessment.</p></div></div><div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5"><label className="block text-xs font-semibold text-gray-700"><span className="mb-1 block">Country</span><input value={retailNetwork.country} onChange={(event) => setRetailNetwork({ country: event.target.value })}/></label><label className="block text-xs font-semibold text-gray-700"><span className="mb-1 block">Region</span><input value={retailNetwork.region} onChange={(event) => setRetailNetwork({ region: event.target.value })}/></label><label className="block text-xs font-semibold text-gray-700"><span className="mb-1 block">Number of stations</span><input type="number" min="0" value={retailNetwork.stationCount} onChange={(event) => setRetailNetwork({ stationCount: event.target.value })}/></label><label className="block text-xs font-semibold text-gray-700"><span className="mb-1 block">Average sales (L/station/month)</span><input type="number" min="0" value={retailNetwork.averageMonthlySalesLitres} onChange={(event) => setRetailNetwork({ averageMonthlySalesLitres: event.target.value })}/></label><label className="block text-xs font-semibold text-gray-700"><span className="mb-1 block">Priority</span><select value={retailNetwork.priority} onChange={(event) => setRetailNetwork({ priority: event.target.value as PortfolioPriority })}>{(['High', 'Medium', 'Low'] as PortfolioPriority[]).map((value) => <option key={value}>{value}</option>)}</select></label></div><div className="mt-5 flex flex-col justify-between gap-3 rounded-lg bg-gray-50 p-4 sm:flex-row sm:items-center"><div><span className="block text-xs font-semibold text-gray-700">Estimated network monthly sales</span><strong className="text-xl text-gray-950">{format(totals.retailSales)} L/month</strong></div><button type="button" onClick={() => onStartGasStation({ country: retailNetwork.country, city: retailNetwork.region })} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-teal-700 px-4 py-2 text-sm font-bold text-teal-800 hover:bg-teal-50"><Building2 size={17}/>Open Gas Station Sizer</button></div></section>
  </div>;
};
