import React, { useEffect, useMemo, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { questionnaireSchema, QuestionnaireData } from '../../schema/questionnaireSchema';
import { useQuestionnaireStore } from '../../store/useQuestionnaireStore';
import { useTheme } from '../../ThemeContext';
import { useLang } from '../../LanguageContext';
import { Step1 } from './Step1';
import { Step2 } from './Step2';
import { Step3 } from './Step3';
import { Step4 } from './Step4';
import { Step5 } from './Step5';
import { Step6 } from './Step6';
import { Step7 } from './Step7';
import { Step8 } from './Step8';
import { Step9 } from './Step9';
import { Step10 } from './Step10';
import { LiveSizingSidebar } from './LiveSizingSidebar';

import { PDFReport } from './PDFReport';
import {
  CheckCircle2, ChevronLeft, ChevronRight,
  FolderOpen, Settings2, FlaskConical, Pipette, Zap,
  HardHat, ShieldAlert, BarChart3, StickyNote, Building2,
} from 'lucide-react';

const TOTAL_STEPS = 10;

const STEP_ICONS = [
  Building2, Settings2, FolderOpen, FlaskConical, Pipette,
  Zap, HardHat, ShieldAlert, BarChart3, StickyNote,
];

export const QuestionnaireContainer: React.FC = () => {
  const { formData, setFormData, currentStep, setStep } = useQuestionnaireStore();
  const { tokens } = useTheme();
  const { t, lang } = useLang();
  const [attachments, setAttachments] = useState<File[]>([]);
  const [packaging, setPackaging] = useState(false);

  const methods = useForm<QuestionnaireData>({
    resolver: zodResolver(questionnaireSchema) as any,
    defaultValues: formData as QuestionnaireData,
    mode: 'onChange',
  });

  const { watch, handleSubmit } = methods;

  // Auto-save drafts to store (which persists to localStorage)
  useEffect(() => {
    const subscription = watch((value) => {
      setFormData(value as Partial<QuestionnaireData>);
    });
    return () => subscription.unsubscribe();
  }, [watch, setFormData]);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  const goNext = () => { setStep(Math.min(currentStep + 1, TOTAL_STEPS)); scrollToTop(); };
  const goBack = () => { setStep(Math.max(currentStep - 1, 1)); scrollToTop(); };

  const stepLabels = useMemo(() => [
    t.s1title, t.s2title, t.s3title, t.s4title, t.s5title,
    t.s6title, t.s7title, t.s8title, t.s9title, t.s10title,
  ], [t]);

  // Short labels for the stepper (strip the number prefix)
  const shortLabels = useMemo(() => stepLabels.map(l => l.replace(/^\d+[\.\s٠-٩]+\s*/, '')), [stepLabels]);

  const renderStep = (step: number) => {
    switch (step) {
      case 1: return <Step1 />;
      case 2: return <Step2 />;
      case 3: return <Step3 />;
      case 4: return <Step4 />;
      case 5: return <Step5 />;
      case 6: return <Step6 />;
      case 7: return <Step7 />;
      case 8: return <Step8 />;
      case 9: return <Step9 />;
      case 10: return <Step10 attachments={attachments} onAttachmentsChange={(files) => setAttachments(files)} />;
      default: return null;
    }
  };

  const progressPct = Math.round(((currentStep - 1) / (TOTAL_STEPS - 1)) * 100);

  const downloadSubmissionPackage = async () => {
    setPackaging(true);
    try {
      // Load packaging dependencies only when the user requests the export.
      // This keeps the questionnaire entry path independent of ZIP/PDF tooling.
      const [{ pdf }, JSZipModule] = await Promise.all([
        import('@react-pdf/renderer'),
        import('jszip'),
      ]);
      const JSZip = JSZipModule.default;
      const data = watch() as QuestionnaireData;
      const report = await pdf(<PDFReport data={data} tokens={tokens} t={t} />).toBlob();
      const zip = new JSZip();
      const project = String(data.projectName || 'VRU_Submission').replace(/[^a-z0-9-_]+/gi, '_');
      zip.file('VRU_Questionnaire_Response.json', JSON.stringify(data, null, 2));
      zip.file('VRU_Questionnaire_Report.pdf', report);
      if (attachments.length) {
        const folder = zip.folder('Supporting_Documents');
        attachments.forEach((file) => folder?.file(file.name, file));
      }
      zip.file('README.txt', `MasarZero VRU Questionnaire Submission\nProject: ${data.projectName || 'Not specified'}\nCreated: ${new Date().toISOString()}\n\nThis package contains the completed questionnaire, PDF report, and supporting documents supplied by the requester.`);
      const blob = await zip.generateAsync({ type: 'blob', compression: 'DEFLATE' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${project}_VRU_Submission.zip`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Unable to create VRU submission ZIP', error);
      window.alert('The submission package could not be created. Please try again or remove any unusually large attachment.');
    } finally {
      setPackaging(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <div className="mt-6 flex gap-8 items-start max-w-7xl mx-auto">
        <div className="flex-1 min-w-0">

          {/* ── Page title ─────────────────────────────────────────────── */}
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
              {t.detailedVRUSpec}
            </h1>
            <p className="mt-2 max-w-2xl mx-auto text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              {t.detailedVRUSpecDesc}
            </p>
          </div>

          {/* ── Horizontal step nav ────────────────────────────────────── */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 mb-4 overflow-hidden">
            {/* Progress bar */}
            <div className="h-1 bg-gray-100">
              <div
                className="h-full transition-all duration-500 ease-out"
                style={{ width: `${progressPct}%`, backgroundColor: tokens.brandAccent }}
              />
            </div>

            {/* Step pills */}
            <div className="flex overflow-x-auto scrollbar-hide px-4 py-3 gap-1">
              {Array.from({ length: TOTAL_STEPS }).map((_, i) => {
                const stepNum = i + 1;
                const done = stepNum < currentStep;
                const active = stepNum === currentStep;
                const Icon = STEP_ICONS[i];

                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => { setStep(stepNum); scrollToTop(); }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 shrink-0 ${
                      active
                        ? 'text-white shadow-md'
                        : done
                        ? 'text-teal-700 bg-teal-50 hover:bg-teal-100'
                        : 'text-gray-400 bg-gray-50 hover:bg-gray-100 hover:text-gray-600'
                    }`}
                    style={active ? { backgroundColor: tokens.brandAccent } : {}}
                  >
                    {done ? (
                      <CheckCircle2 size={13} className="shrink-0" />
                    ) : (
                      <Icon size={13} className="shrink-0" />
                    )}
                    <span>{shortLabels[i]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Main card ──────────────────────────────────────────────── */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">

            {/* Step header */}
            <div
              className="px-7 pt-5 pb-4"
              style={{ borderBottom: `3px solid ${tokens.brandAccent}` }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${tokens.brandAccent}18` }}
                >
                  {React.createElement(STEP_ICONS[currentStep - 1], {
                    size: 20,
                    style: { color: tokens.brandAccent },
                  })}
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className="text-[0.65rem] font-bold uppercase tracking-widest mb-0.5"
                    style={{ color: tokens.brandAccent }}
                  >
                    {lang === 'ar' ? `${TOTAL_STEPS} من ${currentStep}` : `Step ${currentStep} of ${TOTAL_STEPS}`}
                  </p>
                  <h2 className="text-xl font-bold text-gray-900 m-0 leading-tight">
                    {stepLabels[currentStep - 1]}
                  </h2>
                </div>

                {/* Compact dot stepper */}
                <div className="hidden sm:flex items-center gap-1 bg-gray-100 rounded-full px-3 py-1.5">
                  {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => { setStep(i + 1); scrollToTop(); }}
                      className={`rounded-full transition-all duration-300 ${
                        i + 1 === currentStep ? 'w-5 h-2' : 'w-2 h-2'
                      }`}
                      style={{
                        backgroundColor: i + 1 <= currentStep ? tokens.brandAccent : '#D1D5DB',
                      }}
                      aria-label={`Go to step ${i + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Step content */}
            <div className="p-7 md:p-8">
              <form onSubmit={handleSubmit((data) => console.log(data))}>
                <div className="min-h-[400px] step-content">
                  {renderStep(currentStep)}
                </div>

                {/* Navigation */}
                <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={goBack}
                    disabled={currentStep === 1}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-gray-200 text-gray-500 font-semibold text-sm transition-all hover:bg-gray-50 hover:border-gray-300 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft size={18} />
                    {lang === 'ar' ? 'السابق' : lang === 'zh' ? '上一步' : 'Back'}
                  </button>

                  <div className="flex items-center gap-3">
                    {/* Step counter badge */}
                    <span className="hidden sm:block text-xs text-gray-400 font-medium">
                      {currentStep} / {TOTAL_STEPS}
                    </span>

                    {currentStep < TOTAL_STEPS ? (
                      <button
                        type="button"
                        onClick={goNext}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm shadow-md transition-all hover:opacity-90 hover:shadow-lg active:scale-95"
                        style={{ backgroundColor: tokens.brandAccent, color: tokens.brandText }}
                      >
                        {lang === 'ar' ? 'التالي' : lang === 'zh' ? '下一步' : 'Next'}
                        <ChevronRight size={18} />
                      </button>
                    ) : (
                      <button type="button" onClick={downloadSubmissionPackage} disabled={packaging} className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm shadow-md transition-all hover:opacity-90 hover:shadow-lg active:scale-95 disabled:opacity-60" style={{ backgroundColor: tokens.brandAccent, color: tokens.brandText }}>
                        <span aria-hidden="true">↓</span>
                        {packaging ? 'Preparing ZIP…' : 'Download Submission ZIP'}
                      </button>
                    )}
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>

        <LiveSizingSidebar />
      </div>
    </FormProvider>
  );
};
