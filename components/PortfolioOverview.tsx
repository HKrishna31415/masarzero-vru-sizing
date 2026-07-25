import React, { useEffect } from 'react';
import { ArrowLeft, BarChart3, ChevronRight, Info } from 'lucide-react';
import { usePortfolioStore } from '../store/usePortfolioStore';
import { useLang } from '../LanguageContext';

const InfoBubble: React.FC<{ text: string; ariaLabel: string }> = ({ text, ariaLabel }) => {
  const [open, setOpen] = React.useState(false);
  return <span className="relative inline-flex"><button type="button" onClick={(event) => { event.preventDefault(); setOpen((value) => !value); }} aria-expanded={open} aria-label={ariaLabel} className="inline-flex rounded-full text-teal-700 hover:text-teal-900 focus:outline-none focus:ring-2 focus:ring-teal-500"><Info size={16}/></button>{open && <span role="status" className="absolute left-0 top-6 z-10 w-64 rounded-lg border border-teal-200 bg-white p-3 text-left text-xs font-normal leading-5 text-gray-700 shadow-lg">{text}</span>}</span>;
};

export const PortfolioOverview: React.FC<{ onContinue: () => void; onBack: () => void }> = ({ onContinue, onBack }) => {
  const { t } = useLang();
  const { portfolio, setPortfolio } = usePortfolioStore();
  useEffect(() => {
    const controller = new AbortController();
    void fetch('https://ipapi.co/json/', { signal: controller.signal, cache: 'no-store' })
      .then((response) => response.ok ? response.json() : undefined)
      .then((data: { country_name?: string; country_capital?: string } | undefined) => {
        if (!data) return;
        setPortfolio({ ...(portfolio.country ? {} : { country: data.country_name || '' }), ...(portfolio.city ? {} : { city: data.country_capital || '' }) });
      }).catch(() => undefined);
    return () => controller.abort();
  }, []);
  const input = (key: keyof typeof portfolio, label: string, hint: string, type = 'text', help?: string) => <label className="block text-sm font-semibold text-gray-800"><span className="flex items-center gap-1.5">{label}{help && <InfoBubble text={help} ariaLabel={t.showFieldExplanation}/>}</span><input className="mt-1.5" type={type} min={type === 'number' ? 0 : undefined} value={portfolio[key]} onChange={(event) => setPortfolio({ [key]: event.target.value })}/><span className="mt-1 block text-xs font-normal leading-5 text-gray-600">{hint}</span></label>;
  return <div className="mx-auto max-w-4xl px-3 py-6 sm:px-6 sm:py-10"><button type="button" onClick={onBack} className="mb-6 inline-flex min-h-11 items-center gap-2 rounded-lg px-2 text-sm font-bold text-teal-800 hover:bg-teal-50"><ArrowLeft size={17}/>{t.backToHome}</button><div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-8"><div className="mb-7 flex items-start gap-3"><div className="rounded-lg bg-teal-50 p-2 text-teal-700"><BarChart3 size={22}/></div><div><h1 className="text-2xl font-bold text-gray-900">{t.portfolioTitle}</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600">{t.portfolioIntro}</p></div></div><div className="grid grid-cols-1 gap-5 sm:grid-cols-2">{input('siteCount', t.relevantSiteCount, t.relevantSiteCountHint, 'number')}{input('country', t.country, t.locationSuggestion)}{input('city', t.cityRegion, t.citySuggestion)}{input('totalNormalInventoryTonnes', `${t.normalInventoryAllSites} (t)`, t.normalInventoryAllSitesHint, 'number', t.normalInventoryHelp)}{input('totalMaximumUsableCapacityTonnes', `${t.usableCapacityAllSites} (t)`, t.usableCapacityAllSitesHint, 'number', t.usableCapacityHelp)}{input('totalMonthlyThroughputTonnes', `${t.throughputAllSites} (t/${t.gsMonthUnit})`, t.throughputAllSitesHint, 'number', t.throughputHelp)}</div><div className="mt-8 flex justify-end border-t border-gray-100 pt-5"><button type="button" onClick={onContinue} className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-teal-700 px-5 py-2.5 text-sm font-bold text-white hover:bg-teal-800">{t.continueToQuestionnaire} <ChevronRight size={17}/></button></div></div></div>;
};
