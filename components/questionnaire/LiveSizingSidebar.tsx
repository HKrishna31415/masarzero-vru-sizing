import React, { useMemo } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { QuestionnaireData } from '../../schema/questionnaireSchema';
import { useLang } from '../../LanguageContext';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Zap, Activity, ShieldCheck, Info, AlertTriangle } from 'lucide-react';

export const LiveSizingSidebar: React.FC = () => {
  const { t } = useLang();
  const { control } = useFormContext<QuestionnaireData>();
  const allData = useWatch({ control });

  const metrics = useMemo(() => {
    const dischargePressure = parseFloat(allData.dischargePressure?.value || '0');
    const tanksCount = allData.tanks?.length || 0;
    const pumpFlowLPM = parseFloat(allData.loadingPumpFlowRate?.value || '0');
    const simultaneousTrucks = parseFloat(allData.simultaneousLoading || '0');
    const loadingFreq = parseFloat(allData.loadingFrequency || '0');

    // Confidence score
    const baseFields = [
      allData.projectName, allData.siteCountry, allData.siteCity, allData.contactPerson,
      allData.storageType, allData.deliveryMethod, allData.loadingMethod,
      allData.loadingFrequency, allData.simultaneousLoading, allData.loadingPumpFlowRate?.value,
      allData.dischargePressure?.value, allData.ambientTempMax?.value,
      allData.blanketingPressure?.value, allData.vaporMolecularWeight?.value,
      allData.vaporLEL?.value, allData.headerSize?.value, allData.pipingLength?.value,
      allData.electricalVoltage, allData.classificationSystem,
      allData.instrumentAir?.value, allData.vocRecovery?.value, allData.noiseLevel?.value,
    ];
    const refineryFields = [
      allData.refineryUnit, allData.vaporSourceDescription, allData.operatingMode,
      allData.operatingHours, allData.designVaporFlow?.value, allData.vaporInletPressure?.value,
      allData.vaporInletTemperature?.value, allData.vaporCompositionBasis,
      allData.downstreamDestination, allData.emissionsStandard, allData.requiredDocuments,
    ];
    const relevantFields = String(allData.storageType).toLowerCase() === 'refinery'
      ? [...baseFields, ...refineryFields]
      : baseFields;

    const filledCount = relevantFields.filter(
      v => v && (typeof v === 'string' ? v.trim() !== '' : true),
    ).length;
    const confidenceScore = Math.min(100, Math.round((filledCount / relevantFields.length) * 100));

    // Rough estimate: pump flow × simultaneous trucks → SCFM
    const totalFlowLPM = pumpFlowLPM * simultaneousTrucks;
    const estimate =
      totalFlowLPM > 0
        ? Math.round(totalFlowLPM * 0.045)
        : tanksCount * 50 + dischargePressure * 10;

    return {
      confidenceScore,
      estimate,
      tanksCount,
      pumpFlowLPM,
      simultaneousTrucks,
      loadingFreq,
      totalFlowLPM,
    };
  }, [allData]);

  const chartData = [
    { name: 'Filled', value: metrics.confidenceScore },
    { name: 'Remaining', value: 100 - metrics.confidenceScore },
  ];
  const COLORS = ['#0d9488', '#E5E7EB'];

  return (
    <div className="w-full lg:w-80 shrink-0 flex flex-col gap-5 lg:sticky lg:top-24 h-fit">

      {/* ── Confidence Score ─────────────────────────────────────────── */}
      <div className="bg-white p-5 rounded-2xl shadow-lg border border-gray-100">
        <div className="flex items-center gap-2 mb-3">
          <ShieldCheck className="text-teal-500" size={18} />
          <h3 className="font-bold text-gray-800 text-sm">{t.sidebarConfidenceTitle}</h3>
        </div>

        <div className="h-36 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                innerRadius={46}
                outerRadius={64}
                paddingAngle={4}
                dataKey="value"
                startAngle={90}
                endAngle={450}
              >
                {chartData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <text
                x="50%"
                y="50%"
                textAnchor="middle"
                dominantBaseline="middle"
                style={{ fontSize: '1.4rem', fontWeight: 800, fill: '#111827' }}
              >
                {metrics.confidenceScore}%
              </text>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <p className="text-xs text-gray-400 text-center mt-1 leading-relaxed">
          {t.sidebarConfidenceHint}
        </p>
      </div>

      {/* ── Preliminary Estimate ─────────────────────────────────────── */}
      <div className="bg-white p-5 rounded-2xl shadow-lg border border-gray-100">
        <div className="flex items-center gap-2 mb-3">
          <Zap className="text-teal-500" size={18} />
          <h3 className="font-bold text-gray-800 text-sm">{t.sidebarEstimateTitle}</h3>
        </div>

        <div className="space-y-3">
          {/* Capacity bar */}
          <div>
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>{t.sidebarEstimatedCapacity}</span>
              <span className="font-bold text-gray-800">{metrics.estimate} SCFM</span>
            </div>
            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
              <div
                className="h-full transition-all duration-500"
                style={{
                  width: `${Math.min(100, metrics.estimate / 5)}%`,
                  backgroundColor: '#0d9488',
                }}
              />
            </div>
          </div>

          {/* Loading ops grid */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <div className="p-2.5 bg-teal-50 rounded-lg border border-teal-100">
              <span className="block text-[0.62rem] text-teal-600 font-bold uppercase tracking-wide mb-0.5">
                {t.sidebarPumpFlow}
              </span>
              <span className="text-sm font-bold text-teal-800">
                {metrics.pumpFlowLPM > 0 ? `${metrics.pumpFlowLPM} LPM` : '—'}
              </span>
            </div>
            <div className="p-2.5 bg-teal-50 rounded-lg border border-teal-100">
              <span className="block text-[0.62rem] text-teal-600 font-bold uppercase tracking-wide mb-0.5">
                {t.sidebarSimultaneous}
              </span>
              <span className="text-sm font-bold text-teal-800">
                {metrics.simultaneousTrucks > 0 ? `${metrics.simultaneousTrucks} ${t.trucksUnit}` : '—'}
              </span>
            </div>
            <div className="p-2.5 bg-gray-50 rounded-lg border border-gray-100">
              <span className="block text-[0.62rem] text-gray-500 font-bold uppercase tracking-wide mb-0.5">
                {t.sidebarFrequency}
              </span>
              <span className="text-sm font-bold text-gray-700">
                {metrics.loadingFreq > 0 ? `${metrics.loadingFreq}/${t.sidebarPerDay}` : '—'}
              </span>
            </div>
            <div className="p-2.5 bg-gray-50 rounded-lg border border-gray-100">
              <span className="block text-[0.62rem] text-gray-500 font-bold uppercase tracking-wide mb-0.5">
                {t.sidebarTotalFlow}
              </span>
              <span className="text-sm font-bold text-gray-700">
                {metrics.totalFlowLPM > 0 ? `${metrics.totalFlowLPM} LPM` : '—'}
              </span>
            </div>
          </div>

          {/* Complexity */}
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <Activity className="text-gray-400 shrink-0" size={15} />
            <div className="text-xs">
              <span className="block text-gray-400">{t.sidebarComplexity}</span>
              <span className="font-bold text-gray-800">
                {metrics.tanksCount > 5 ? t.sidebarComplexityHigh : t.sidebarComplexityMedium}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── API reference ─────────────────────────────────────────────── */}
      <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex gap-3">
        <Info className="text-blue-500 shrink-0 mt-0.5" size={16} />
        <p className="text-xs text-blue-700 leading-relaxed">{t.sidebarApiNote}</p>
      </div>

      {/* ── Disclaimer ────────────────────────────────────────────────── */}
      <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 flex gap-3">
        <AlertTriangle className="text-amber-500 shrink-0 mt-0.5" size={16} />
        <p className="text-xs text-amber-800 leading-relaxed">{t.sidebarDisclaimer}</p>
      </div>
    </div>
  );
};
