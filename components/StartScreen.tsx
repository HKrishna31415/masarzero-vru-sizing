import React from 'react';
import { Fuel, Factory, ExternalLink } from 'lucide-react';
import { useLang } from '../LanguageContext';
import { MasarZeroLogo } from './MasarZeroLogo';

interface StartScreenProps {
  onSelect: (type: 'gas-station' | 'storage-facility') => void;
}

export const StartScreen: React.FC<StartScreenProps> = ({ onSelect }) => {
  const { t } = useLang();

  return (
    <div className="flex min-h-screen w-full flex-col overflow-y-auto font-sans md:h-screen md:flex-row md:overflow-hidden">

      {/* ── Gas Station Side ─────────────────────────────────────────── */}
      <button
        onClick={() => onSelect('gas-station')}
        className="group relative flex min-h-[55vh] w-full flex-col items-center justify-center bg-white px-5 pb-8 pt-44 transition-all hover:bg-teal-50 md:h-full md:min-h-0 md:w-1/2 md:px-8 md:py-0"
      >
        <div className="z-10 flex w-full max-w-md flex-col items-center gap-5 md:gap-6">
          <div className="rounded-full bg-teal-100 p-5 md:p-8 transition-transform group-hover:scale-110">
            <Fuel size={48} className="text-teal-600 md:h-16 md:w-16" />
          </div>
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 md:text-4xl">{t.gasStation}</h2>
            <p className="mx-auto mt-2 max-w-xs text-base text-gray-500 md:text-lg">{t.gasStationDesc}</p>
          </div>
          <div className="mt-4 rounded-full border-2 border-teal-600 px-8 py-3 text-base font-bold text-teal-600 transition-colors group-hover:bg-teal-600 group-hover:text-white md:mt-8 md:text-lg">
            {t.getStarted}
          </div>
        </div>
        <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none" />
      </button>

      {/* ── Vertical Divider ─────────────────────────────────────────── */}
      <div className="absolute bottom-1/2 left-0 right-0 z-20 hidden h-px bg-gray-200 md:bottom-0 md:left-1/2 md:right-auto md:top-0 md:block md:h-auto md:w-px" />

      {/* ── Storage Facility Side ─────────────────────────────────────── */}
      <button
        onClick={() => onSelect('storage-facility')}
        className="group relative flex min-h-[55vh] w-full flex-col items-center justify-center bg-gray-50 px-5 py-12 transition-all hover:bg-teal-900 md:h-full md:min-h-0 md:w-1/2 md:px-8 md:py-0"
      >
        <div className="z-10 flex w-full max-w-md flex-col items-center gap-5 md:gap-6">
          <div className="rounded-full bg-teal-600 p-5 transition-transform group-hover:scale-110 group-hover:bg-teal-500 md:p-8">
            <Factory size={48} className="text-white md:h-16 md:w-16" />
          </div>
          <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 group-hover:text-white md:text-4xl">Storage / Refinery</h2>
          <p className="mx-auto mt-2 max-w-sm text-base text-gray-500 group-hover:text-teal-100 md:text-lg">Tank farms, storage facilities, and refinery-unit VRU sizing</p>
          </div>
          <div className="mt-4 rounded-full bg-teal-600 px-8 py-3 text-base font-bold text-white transition-colors group-hover:bg-white group-hover:text-teal-900 shadow-lg md:mt-8 md:text-lg">
            {t.professionalSizing}
          </div>
        </div>
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] pointer-events-none" />
      </button>

      {/* ── Logo + Back-to-home overlay ───────────────────────────────── */}
      <div className="absolute left-1/2 top-4 z-30 flex w-[calc(100%-2rem)] -translate-x-1/2 flex-col items-center gap-2 md:top-10 md:w-auto md:gap-3">
        {/* Logo card */}
        <div className="flex items-center justify-center rounded-2xl border border-gray-100 bg-white px-6 py-3 shadow-2xl md:px-8 md:py-4">
          <MasarZeroLogo height={64} />
        </div>

        {/* Back to website button */}
        <a
          href="https://masarzero.com"
          target="_blank"
          rel="noopener noreferrer"
          onClick={e => e.stopPropagation()}
          className="flex max-w-full items-center gap-1.5 whitespace-nowrap rounded-full border border-teal-100 bg-white/90 px-4 py-2 text-xs font-semibold text-teal-700 shadow-md backdrop-blur-sm transition-all hover:border-teal-600 hover:bg-teal-600 hover:text-white"
        >
          <ExternalLink size={12} />
          {t.backToWebsite}
        </a>
      </div>
    </div>
  );
};
