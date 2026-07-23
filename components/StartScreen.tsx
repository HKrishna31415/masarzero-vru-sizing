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
    <div className="flex h-screen w-full overflow-hidden font-sans">

      {/* ── Gas Station Side ─────────────────────────────────────────── */}
      <button
        onClick={() => onSelect('gas-station')}
        className="group relative flex w-1/2 flex-col items-center justify-center bg-white transition-all hover:bg-teal-50"
      >
        <div className="z-10 flex flex-col items-center gap-6">
          <div className="rounded-full bg-teal-100 p-8 transition-transform group-hover:scale-110">
            <Fuel size={64} className="text-teal-600" />
          </div>
          <div className="text-center">
            <h2 className="text-4xl font-extrabold text-gray-900">{t.gasStation}</h2>
            <p className="mt-2 text-lg text-gray-500">{t.gasStationDesc}</p>
          </div>
          <div className="mt-8 rounded-full border-2 border-teal-600 px-8 py-3 text-lg font-bold text-teal-600 transition-colors group-hover:bg-teal-600 group-hover:text-white">
            {t.getStarted}
          </div>
        </div>
        <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none" />
      </button>

      {/* ── Vertical Divider ─────────────────────────────────────────── */}
      <div className="absolute left-1/2 top-0 bottom-0 z-20 w-px bg-gray-200" />

      {/* ── Storage Facility Side ─────────────────────────────────────── */}
      <button
        onClick={() => onSelect('storage-facility')}
        className="group relative flex w-1/2 flex-col items-center justify-center bg-gray-50 transition-all hover:bg-teal-900"
      >
        <div className="z-10 flex flex-col items-center gap-6">
          <div className="rounded-full bg-teal-600 p-8 transition-transform group-hover:scale-110 group-hover:bg-teal-500">
            <Factory size={64} className="text-white" />
          </div>
          <div className="text-center">
          <h2 className="text-4xl font-extrabold text-gray-900 group-hover:text-white">Storage / Refinery</h2>
          <p className="mt-2 text-lg text-gray-500 group-hover:text-teal-100">Tank farms, storage facilities, and refinery-unit VRU sizing</p>
          </div>
          <div className="mt-8 rounded-full bg-teal-600 px-8 py-3 text-lg font-bold text-white transition-colors group-hover:bg-white group-hover:text-teal-900 shadow-lg">
            {t.professionalSizing}
          </div>
        </div>
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] pointer-events-none" />
      </button>

      {/* ── Logo + Back-to-home overlay ───────────────────────────────── */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-3">
        {/* Logo card */}
        <div className="flex items-center justify-center bg-white px-8 py-4 rounded-2xl shadow-2xl border border-gray-100">
          <MasarZeroLogo height={96} />
        </div>

        {/* Back to website button */}
        <a
          href="https://masarzero.com"
          target="_blank"
          rel="noopener noreferrer"
          onClick={e => e.stopPropagation()}
          className="flex items-center gap-1.5 bg-white/90 backdrop-blur-sm text-teal-700 text-xs font-semibold px-4 py-2 rounded-full shadow-md border border-teal-100 hover:bg-teal-600 hover:text-white hover:border-teal-600 transition-all"
        >
          <ExternalLink size={12} />
          {t.backToWebsite}
        </a>
      </div>
    </div>
  );
};
