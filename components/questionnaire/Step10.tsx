import React from 'react';
import { useFormContext } from 'react-hook-form';
import { useLang } from '../../LanguageContext';

export const Step10: React.FC<{ attachments: File[]; onAttachmentsChange: (files: File[]) => void }> = ({ attachments, onAttachmentsChange }) => {
  const { t } = useLang();
  const { register } = useFormContext();

  return (
    <fieldset>
      <legend className="sr-only">{t.s10title}</legend>
      <div className="field-wrap">
        <label htmlFor="other-requirements">{t.additionalNotes}</label>
        <textarea id="other-requirements" {...register('otherRequirements')} rows={6} placeholder={t.ph_additionalNotes} className="w-full p-2 border rounded" />
        <p className="field-desc">{t.additionalNotesDesc}</p>
      </div>
      <div className="field-wrap">
        <label htmlFor="supporting-documents">Attach supporting documents</label>
        <input
          id="supporting-documents"
          type="file"
          multiple
          accept=".pdf,.png,.jpg,.jpeg,.xlsx,.xls,.csv,.doc,.docx,.dwg,.dxf,.txt"
          onChange={(event) => onAttachmentsChange([...attachments, ...Array.from(event.target.files || [])])}
          className="block w-full text-sm"
        />
        {attachments.length > 0 && <div className="mt-3 space-y-1 text-xs text-gray-600">
          {attachments.map((file, index) => <div key={`${file.name}-${index}`} className="flex items-center justify-between gap-3 rounded-md bg-gray-50 px-3 py-2">
            <span className="truncate">{file.name}</span><span className="shrink-0">{Math.ceil(file.size / 1024)} KB</span>
          </div>)}
        </div>}
        <p className="field-desc">Add P&amp;IDs, GC reports, plot plans, datasheets, photographs, or owner specifications. Files are included in the final ZIP.</p>
      </div>
    </fieldset>
  );
};
