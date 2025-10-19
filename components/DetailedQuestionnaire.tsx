
import React, { useState } from 'react';
import { QuestionnaireField } from './QuestionnaireField';
import { SelectField } from './SelectField';
import { UnitInputField } from './UnitInputField';
import { SplitUnitInputField } from './SplitUnitInputField';
import { TankInventoryManager } from './TankInventoryManager';

const inputClasses = "w-full pl-3 py-2 border border-[var(--color-border)] rounded-md shadow-sm focus:ring-[var(--color-input-focus-ring)] focus:border-[var(--color-input-focus-ring)] transition duration-150 ease-in-out bg-[var(--color-input-bg)] text-[var(--color-text-primary)]";

type UnitFieldState = { value: string; unit: string };

type FormState = {
  [key: string]: UnitFieldState;
};

export const DetailedQuestionnaire: React.FC = () => {
  const [classificationSystem, setClassificationSystem] = useState('Class/Division');
  const [storageType, setStorageType] = useState('Truck Filling Station');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  
  const [formState, setFormState] = useState<FormState>({
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
  });

  const handleUnitInputChange = (id: string, field: 'value' | 'unit', val: string) => {
    setFormState(prev => ({
        ...prev,
        [id]: {
            ...prev[id],
            [field]: val
        }
    }));
};

 const handleDownloadPdf = async () => {
    setIsGeneratingPdf(true);
    const formElement = document.getElementById('detailed-questionnaire');
    if (!formElement) {
      setIsGeneratingPdf(false);
      return;
    }

    const getBase64Image = (url: string): Promise<string> => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'Anonymous';
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    reject(new Error('Could not get canvas context'));
                    return;
                }
                ctx.drawImage(img, 0, 0);
                const dataURL = canvas.toDataURL('image/png');
                resolve(dataURL);
            };
            img.onerror = reject;
            img.src = url;
        });
    };
    
    const logoUrl = 'https://i.ibb.co/Zpx00M2n/sevalitransparentlogo.png';
    const logoBase64 = await getBase64Image(logoUrl);
    
    const pdf = new (window as any).jspdf.jsPDF({
      orientation: 'p',
      unit: 'mm',
      format: 'a4',
    });

    // --- Cover Page ---
    const pdfPageWidth = pdf.internal.pageSize.getWidth();
    const pdfPageHeight = pdf.internal.pageSize.getHeight();
    const margin = 15;

    // Logo
    const logoWidth = 60;
    const logoHeight = 60;
    const logoX = (pdfPageWidth - logoWidth) / 2;
    pdf.addImage(logoBase64, 'PNG', logoX, margin, logoWidth, logoHeight);

    // Title
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(22);
    pdf.setTextColor('#1a202c');
    pdf.text('VRU Specification Report', pdfPageWidth / 2, margin + logoHeight + 15, { align: 'center' });

    // Subtitle
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(14);
    pdf.setTextColor('#4A5568');
    pdf.text('Preliminary Assessment', pdfPageWidth / 2, margin + logoHeight + 25, { align: 'center' });

    // Project Details from Form
    const projectName = (document.getElementById('projectName') as HTMLInputElement)?.value || 'Not Specified';
    const siteCity = (document.getElementById('siteCity') as HTMLInputElement)?.value || '';
    const siteCountry = (document.getElementById('siteCountry') as HTMLInputElement)?.value || '';
    let siteLocation = [siteCity, siteCountry].filter(Boolean).join(', ');
    if (!siteLocation) siteLocation = 'Not Specified';

    const contactPerson = (document.getElementById('contactPerson') as HTMLInputElement)?.value || 'Not Specified';
    const generationDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    const detailsStartY = margin + logoHeight + 45;
    pdf.setFontSize(11);
    pdf.setTextColor('#2D3748');

    pdf.setFont('helvetica', 'bold');
    pdf.text('Project:', margin, detailsStartY);
    pdf.setFont('helvetica', 'normal');
    pdf.text(projectName, margin + 40, detailsStartY);

    pdf.setFont('helvetica', 'bold');
    pdf.text('Site Location:', margin, detailsStartY + 10);
    pdf.setFont('helvetica', 'normal');
    pdf.text(siteLocation, margin + 40, detailsStartY + 10);

    pdf.setFont('helvetica', 'bold');
    pdf.text('Contact:', margin, detailsStartY + 20);
    pdf.setFont('helvetica', 'normal');
    pdf.text(contactPerson, margin + 40, detailsStartY + 20);

    pdf.setFont('helvetica', 'bold');
    pdf.text('Date Generated:', margin, detailsStartY + 30);
    pdf.setFont('helvetica', 'normal');
    pdf.text(generationDate, margin + 40, detailsStartY + 30);

    // Disclaimer
    const disclaimerText = "This report is a preliminary assessment based on the data provided. The information contained herein is for discussion purposes only and should not be considered a final engineering specification. A qualified engineer must be consulted for a detailed design and final equipment selection.";
    pdf.setFontSize(9);
    pdf.setTextColor('#6B7280');
    const splitDisclaimer = pdf.splitTextToSize(disclaimerText, pdfPageWidth - (margin * 2));
    pdf.text(splitDisclaimer, margin, pdfPageHeight - margin - 20);
    
    // Add page for questionnaire content
    pdf.addPage();


    // Create a temporary container for a print-friendly version of the form data
    const printContainer = document.createElement('div');
    printContainer.style.position = 'absolute';
    printContainer.style.left = '-9999px';
    printContainer.style.width = '210mm'; // A4 width
    printContainer.style.boxSizing = 'border-box';

    const style = document.createElement('style');
    style.innerHTML = `
      .pdf-print-area { font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif; color: #2D3748; background: white; padding: 15mm; }
      .pdf-print-area .pdf-header { text-align: center; margin-bottom: 1rem; }
      .pdf-print-area .pdf-header img { max-height: 80px; display: inline-block; }
      .pdf-print-area h1 { font-size: 1.75rem; font-weight: 700; text-align: center; margin-bottom: 1.5rem; color: #1a202c; word-wrap: break-word; }
      .pdf-print-area h2 { font-size: 1.25rem; font-weight: 600; margin-top: 1.5rem; margin-bottom: 1rem; border-bottom: 1px solid #e2e8f0; padding-bottom: 0.5rem; color: #1a202c;}
      .pdf-print-area h3 { font-size: 1rem; font-weight: 600; margin-top: 1rem; margin-bottom: 0.5rem; }
      .pdf-print-area .entry { display: grid; grid-template-columns: 200px 1fr; gap: 1rem; align-items: start; padding: 0.6rem 0; border-bottom: 1px solid #f1f5f9; }
      .pdf-print-area .entry-full { padding: 0.6rem 0; border-bottom: 1px solid #f1f5f9; }
      .pdf-print-area .entry-label { font-weight: 600; font-size: 0.875rem; color: #4A5568; }
      .pdf-print-area .entry-value { font-size: 0.875rem; white-space: pre-wrap; word-break: break-word; }
      .pdf-print-area .tank-group { margin-top: 1rem; padding: 1rem; border: 1px solid #e2e8f0; border-radius: 0.5rem; background: #f8fafc; page-break-inside: avoid; }
      .pdf-print-area .info-box { margin-top: 1rem; padding: 1rem; background: #fefcbf; border-left: 4px solid #facc15; color: #713f12; font-size: 0.875rem; }
    `;
    printContainer.className = 'pdf-print-area';
    document.head.appendChild(style);
    document.body.appendChild(printContainer);

    // Add PDF Header
    const headerDiv = document.createElement('div');
    headerDiv.className = 'pdf-header';
    const headerImg = document.createElement('img');
    headerImg.src = logoUrl;
    headerDiv.appendChild(headerImg);
    printContainer.appendChild(headerDiv);

    // Helper to add an entry if the value exists
    const addEntry = (container: HTMLElement, label: string | null, value: string | null, isFullWidth = false) => {
      if (!label || !value || value.trim() === '') return;
      
      const entryDiv = document.createElement('div');
      entryDiv.className = isFullWidth ? 'entry-full' : 'entry';
      
      const labelSpan = document.createElement('span');
      labelSpan.className = 'entry-label';
      labelSpan.textContent = label;
      entryDiv.appendChild(labelSpan);

      const valueSpan = document.createElement(isFullWidth ? 'p' : 'span');
      valueSpan.className = 'entry-value';
      valueSpan.textContent = value;
      entryDiv.appendChild(valueSpan);

      container.appendChild(entryDiv);
    };

    const title = document.createElement('h1');
    title.textContent = 'VRU Specification Questionnaire';
    printContainer.appendChild(title);

    const fieldsets = formElement.querySelectorAll('fieldset');
    fieldsets.forEach(fieldset => {
      const legend = fieldset.querySelector('legend');
      if (legend) {
        const h2 = document.createElement('h2');
        h2.textContent = legend.textContent;
        printContainer.appendChild(h2);
      }
      
      const tankManager = fieldset.querySelector('.space-y-8');
      if (tankManager) {
        const tankGroups = tankManager.querySelectorAll<HTMLElement>('.p-4.border');
        tankGroups.forEach((tankGroup, index) => {
          const tankContainer = document.createElement('div');
          tankContainer.className = 'tank-group';

          const tankIdInput = tankGroup.querySelector<HTMLInputElement>('input[id^="tankId-"]');
          const tankTitle = document.createElement('h3');
          tankTitle.textContent = `Tank #${index + 1}: ${tankIdInput?.value || '(Not specified)'}`;
          tankContainer.appendChild(tankTitle);

          const fieldWrappers = tankGroup.querySelectorAll<HTMLElement>('.mb-4');
          fieldWrappers.forEach(wrapper => {
            const labelEl = wrapper.querySelector('label');
            const input = wrapper.querySelector<HTMLInputElement>('input');
            const select = wrapper.querySelector<HTMLSelectElement>('select');
            
            let label = labelEl?.textContent || '';
            let value: string | null = null;
            
            const unitInput = wrapper.querySelector<HTMLInputElement>('input[type="number"]');
            const unitSelect = wrapper.querySelector<HTMLSelectElement>('select');

            if (unitInput && unitSelect) { // UnitInputField
              if (unitInput.value) value = `${unitInput.value} ${unitSelect.value}`;
            } else if (select) { // SelectField
              value = select.value;
            } else if (input) { // Simple input
              value = input.value;
            }
            addEntry(tankContainer, label, value);
          });
          printContainer.appendChild(tankContainer);
        });
        return;
      }
      
      const fieldWrappers = fieldset.querySelectorAll<HTMLElement>('.mb-4');
      fieldWrappers.forEach(wrapper => {
        const labelEl = wrapper.querySelector('label');
        const input = wrapper.querySelector<HTMLInputElement | HTMLTextAreaElement>('input:not([type="radio"]):not([type="checkbox"]), textarea');
        const select = wrapper.querySelector<HTMLSelectElement>('select');
        let label = labelEl?.textContent || '';
        let value: string | null = null;
        let isFullWidth = !!wrapper.querySelector('textarea');
        
        const splitInputs = wrapper.querySelectorAll<HTMLInputElement>('input[type="number"]');
        
        if (splitInputs.length === 2 && select) {
          const pos = splitInputs[0].value || 'N/A';
          const neg = splitInputs[1].value || 'N/A';
          if (pos !== 'N/A' || neg !== 'N/A') value = `${pos} / ${neg} ${select.value}`;
        } else if (splitInputs.length === 1 && select) {
          if (splitInputs[0].value) value = `${splitInputs[0].value} ${select.value}`;
        } else if (select) {
          value = select.value;
        } else if (input) {
          value = input.value;
          if (input.type === 'date' && value) {
             const [year, month, day] = value.split('-');
             value = `${month}/${day}/${year}`;
          }
        }
        
        const infoBox = wrapper.querySelector('.p-4.bg-\\[var\\(--color-info-bg\\)\\]');
        if (infoBox) {
          const infoText = infoBox.querySelector('p')?.textContent;
          if (infoText) {
            const infoDiv = document.createElement('div');
            infoDiv.className = 'info-box';
            infoDiv.textContent = infoText;
            printContainer.appendChild(infoDiv);
          }
        } else {
            addEntry(printContainer, label, value, isFullWidth);
        }
      });
    });

    const canvas = await (window as any).html2canvas(printContainer, { scale: 2, useCORS: true });
    const imgData = canvas.toDataURL('image/png');
    
    document.body.removeChild(printContainer);
    document.head.removeChild(style);

    const pdfContentWidth = pdfPageWidth - margin * 2;
    const pdfContentHeight = pdfPageHeight - margin * 2;
    
    const canvasAspectRatio = canvas.width / canvas.height;
    const totalImageHeightOnPdf = pdfContentWidth / canvasAspectRatio;

    let position = 0;
    pdf.addImage(imgData, 'PNG', margin, margin, pdfContentWidth, totalImageHeightOnPdf);
    let heightLeft = totalImageHeightOnPdf - pdfContentHeight;

    while (heightLeft > 0) {
      position -= pdfContentHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', margin, position + margin, pdfContentWidth, totalImageHeightOnPdf);
      heightLeft -= pdfContentHeight;
    }
    
    const pageCount = pdf.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i);

        pdf.setFontSize(8);
        pdf.setTextColor(100);

        // Footer content
        const footerY1 = pdfPageHeight - 12;
        const footerY2 = pdfPageHeight - 8;

        // Contact Info - Left aligned on all pages
        pdf.text('CEO: Mr. Yalçin Aliyev', margin, footerY1);
        pdf.text('Phone: +994 55 320 42 81', margin, footerY2);

        // Copyright & Disclaimer - Right aligned on all pages
        const footerText1 = `© ${new Date().getFullYear()} Sevali Energy. All rights reserved.`;
        const footerText2 = `For official use, consult a qualified engineer.`;
        pdf.text(footerText1, pdfPageWidth - margin, footerY1, { align: 'right' });
        pdf.text(footerText2, pdfPageWidth - margin, footerY2, { align: 'right' });
    }
    
    pdf.save('VRU_Questionnaire_Report.pdf');
    setIsGeneratingPdf(false);
  };


  return (
    <div id="detailed-questionnaire" className="mt-2">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-[var(--color-text-primary)]">Detailed VRU Specification</h2>
        <p className="text-center text-[var(--color-text-secondary)] mt-2 max-w-3xl mx-auto">
          This section helps gather additional information for a more precise VRU system design. Fill out the fields below to provide our engineers with the necessary context for your project.
        </p>
      </div>
      <form className="space-y-10">
        
        <fieldset>
            <legend className="text-lg font-semibold text-[var(--color-text-primary)] mb-4 border-b pb-2 w-full border-[var(--color-border)]">1. Project Information</legend>
            <div className="grid md:grid-cols-2 gap-x-6">
                 <QuestionnaireField label="Project Name / ID" description="A unique identifier for this project.">
                    <input id="projectName" type="text" className={inputClasses} placeholder="e.g., Tank Farm Expansion 2024" />
                </QuestionnaireField>
                <QuestionnaireField label="Country" description="The country where the site is located.">
                    <input id="siteCountry" type="text" className={inputClasses} placeholder="e.g., USA" />
                </QuestionnaireField>
                 <QuestionnaireField label="City / State" description="The city and state/province of the site.">
                    <input id="siteCity" type="text" className={inputClasses} placeholder="e.g., Houston, TX" />
                </QuestionnaireField>
                 <QuestionnaireField label="Street Address" description="Full street address of the project site.">
                    <input id="siteAddress" type="text" className={inputClasses} placeholder="e.g., 123 Industrial Way" />
                </QuestionnaireField>
                <QuestionnaireField label="Contact Person" description="Primary technical or project contact.">
                    <input id="contactPerson" type="text" className={inputClasses} placeholder="e.g., Jane Doe" />
                </QuestionnaireField>
                <QuestionnaireField label="Contact Email" description="Email for project communications.">
                    <input id="contactEmail" type="email" className={inputClasses} placeholder="e.g., jane.doe@example.com" />
                </QuestionnaireField>
                 <QuestionnaireField label="Project Start Date" description="Expected start date.">
                    <input id="projectStartDate" type="date" className={inputClasses} />
                </QuestionnaireField>
                <QuestionnaireField label="Project Completion Date" description="Target completion date.">
                    <input id="projectEndDate" type="date" className={inputClasses} />
                </QuestionnaireField>
            </div>
        </fieldset>

        <fieldset>
          <legend className="text-lg font-semibold text-[var(--color-text-primary)] mb-4 border-b pb-2 w-full border-[var(--color-border)]">2. Operational Conditions</legend>
          <div className="grid md:grid-cols-2 gap-x-6">
            <SelectField
                id="storageType"
                label="What type of storage is this?"
                description="Select the primary function of the facility."
                options={["Truck Filling Station", "Tank Farm", "Refinery", "Bulk GDF", "Storage Facility", "Other"]}
                value={storageType}
                onChange={(e) => setStorageType(e.target.value)}
            />
            {storageType === 'Other' && (
                <QuestionnaireField label="Please specify other storage type" description="">
                    <input id="storageTypeOther" type="text" className={inputClasses} placeholder="e.g., Marine Terminal" />
                </QuestionnaireField>
            )}
            <SelectField
                id="deliveryMethod"
                label="Delivery Method"
                description="How is the product delivered to the tanks?"
                options={["Truck", "Railcar", "Pipeline", "Barge / Marine", "Other"]}
            />
            <SelectField
                id="loadingMethod"
                label="Loading Method"
                description="The method used to fill the tanks."
                options={["Top Splash Loading", "Submerged Fill Pipe", "Bottom Loading"]}
            />
            <QuestionnaireField label="Loading Frequency" description="Number of loading events per day.">
                <div className="relative">
                    <input id="loadingFrequency" type="number" step="1" className={`${inputClasses} pr-20`} placeholder="e.g., 5" />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <span className="text-[var(--color-text-secondary)] text-sm">trucks/day</span>
                    </div>
                </div>
            </QuestionnaireField>
            <UnitInputField
                id="dischargePressure"
                label="VRU Discharge Pressure"
                description="Specify the pressure at the VRU outlet."
                units={["bar", "psig", "kPa"]}
                placeholder="e.g., 0.35"
                value={formState.dischargePressure.value}
                unit={formState.dischargePressure.unit}
                onValueChange={(val) => handleUnitInputChange('dischargePressure', 'value', val)}
                onUnitChange={(val) => handleUnitInputChange('dischargePressure', 'unit', val)}
            />
            <UnitInputField
                id="ambientTempMax"
                label="Maximum Ambient Temperature"
                description="Highest expected environmental temperature at the site."
                units={["°C", "°F"]}
                placeholder="e.g., 35"
                value={formState.ambientTempMax.value}
                unit={formState.ambientTempMax.unit}
                onValueChange={(val) => handleUnitInputChange('ambientTempMax', 'value', val)}
                onUnitChange={(val) => handleUnitInputChange('ambientTempMax', 'unit', val)}
            />
            <UnitInputField
                id="ambientTempMin"
                label="Minimum Ambient Temperature"
                description="Lowest expected environmental temperature."
                units={["°C", "°F"]}
                placeholder="e.g., -10"
                value={formState.ambientTempMin.value}
                unit={formState.ambientTempMin.unit}
                onValueChange={(val) => handleUnitInputChange('ambientTempMin', 'value', val)}
                onUnitChange={(val) => handleUnitInputChange('ambientTempMin', 'unit', val)}
            />
          </div>
        </fieldset>
        
        <fieldset>
          <legend className="text-lg font-semibold text-[var(--color-text-primary)] mb-4 border-b pb-2 w-full border-[var(--color-border)]">3. Tank & Inventory Details</legend>
          <TankInventoryManager />
          <div className="grid md:grid-cols-2 gap-x-6 mt-6">
            <SelectField
                id="tankBlanketing"
                label="Are tanks gas blanketed?"
                description="Is an inert gas used to cover the liquid?"
                options={["No", "Yes", "Not Applicable"]}
            />
            <div>
                 <SelectField
                    id="blanketingGasType"
                    label="Blanketing Gas Type"
                    description="If yes, specify gas."
                    options={["Nitrogen", "Carbon Dioxide", "Natural Gas", "Other"]}
                />
                <UnitInputField
                    id="blanketingPressure"
                    label="Blanketing Gas Pressure"
                    description="Specify set pressure."
                    units={["mbar", "in WC", "Pa"]}
                    placeholder="e.g., 1.25"
                    value={formState.blanketingPressure.value}
                    unit={formState.blanketingPressure.unit}
                    onValueChange={(val) => handleUnitInputChange('blanketingPressure', 'value', val)}
                    onUnitChange={(val) => handleUnitInputChange('blanketingPressure', 'unit', val)}
                />
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend className="text-lg font-semibold text-[var(--color-text-primary)] mb-4 border-b pb-2 w-full border-[var(--color-border)]">4. Vapor & Product Characteristics</legend>
           <QuestionnaireField
            label="Headspace Vapor Composition (GC Analysis)"
            description="If available, provide the gas chromatograph analysis of the vapor."
          >
            <textarea
              id="gcAnalysis"
              rows={4}
              className={`${inputClasses} min-h-[80px]`}
              placeholder="e.g., VOCs (C4-C10): 95%, Methane: 4%, H2S: <1 ppm, Benzene: 1.1%"
            />
          </QuestionnaireField>
          <div className="grid md:grid-cols-2 gap-x-6">
              <QuestionnaireField label="Corrosive Components" description="Any known corrosive elements in the vapor. Note: trace H2S can be corrosive to carbon steel.">
                <input id="corrosiveComponents" type="text" className={inputClasses} placeholder="e.g., H2S, Ammonia, Chlorides" />
              </QuestionnaireField>
              <SelectField
                  id="vaporSaturation"
                  label="Is vapor stream saturated with water?"
                  description="Expected moisture content. Note: vapor is often saturated with water for gasoline, especially with ethanol blends."
                  options={["Unknown", "Yes", "No"]}
              />
               <UnitInputField
                id="vaporMolecularWeight"
                label="Vapor Molecular Weight"
                description="Average molecular weight of the vapor stream."
                units={["g/mol"]}
                placeholder="e.g., 65"
                value={formState.vaporMolecularWeight.value}
                unit={formState.vaporMolecularWeight.unit}
                onValueChange={(val) => handleUnitInputChange('vaporMolecularWeight', 'value', val)}
                onUnitChange={(val) => handleUnitInputChange('vaporMolecularWeight', 'unit', val)}
              />
              <UnitInputField
                id="vaporLEL"
                label="Vapor Lower Explosive Limit (LEL)"
                description="The lowest concentration that will burn in air."
                units={["% by vol"]}
                placeholder="e.g., 1.4"
                value={formState.vaporLEL.value}
                unit={formState.vaporLEL.unit}
                onValueChange={(val) => handleUnitInputChange('vaporLEL', 'value', val)}
                onUnitChange={(val) => handleUnitInputChange('vaporLEL', 'unit', val)}
              />
          </div>
        </fieldset>
        
        <fieldset>
          <legend className="text-lg font-semibold text-[var(--color-text-primary)] mb-4 border-b pb-2 w-full border-[var(--color-border)]">5. System & Equipment Specifications</legend>
          <div className="grid md:grid-cols-2 gap-x-6">
            <UnitInputField
                id="headerSize"
                label="Proposed Vapor Header Diameter"
                description="Specify pipe nominal size."
                units={["mm", "inches"]}
                placeholder="e.g., 150"
                value={formState.headerSize.value}
                unit={formState.headerSize.unit}
                onValueChange={(val) => handleUnitInputChange('headerSize', 'value', val)}
                onUnitChange={(val) => handleUnitInputChange('headerSize', 'unit', val)}
            />
             <UnitInputField
                id="pipingLength"
                label="Total Length of Vapor Piping"
                description="Estimated total length from tanks to VRU."
                units={["meters", "feet"]}
                placeholder="e.g., 150"
                value={formState.pipingLength.value}
                unit={formState.pipingLength.unit}
                onValueChange={(val) => handleUnitInputChange('pipingLength', 'value', val)}
                onUnitChange={(val) => handleUnitInputChange('pipingLength', 'unit', val)}
            />
            <SplitUnitInputField
                id="ventSetPoints"
                label="Tank P/V Vent Valve Set Points"
                description="Pressure (+) and vacuum (-) relief settings."
                units={["mbar", "in WC"]}
                placeholders={{ positive: "+6.2", negative: "-1.2" }}
            />
            <SelectField
                id="arrestorExists"
                label="Existing Flame/Detonation Arrestor?"
                description="Is safety equipment already installed?"
                options={["No", "Yes", "Unsure"]}
            />
            <QuestionnaireField label="Piping Material" description="Material of construction for vapor lines.">
              <input id="pipingMaterial" type="text" className={inputClasses} placeholder="e.g., Carbon Steel A106" />
            </QuestionnaireField>
          </div>
        </fieldset>

        <fieldset>
            <legend className="text-lg font-semibold text-[var(--color-text-primary)] mb-4 border-b pb-2 w-full border-[var(--color-border)]">6. Utilities & Site Conditions</legend>
            <div className="grid md:grid-cols-2 gap-x-6">
                <div className="col-span-1 space-y-4">
                     <QuestionnaireField label="Available Voltage" description="Specify the line-to-line voltage.">
                        <input id="electricalVoltage" type="number" className={inputClasses} placeholder="e.g., 480" />
                    </QuestionnaireField>
                    <SelectField
                        id="electricalPhase"
                        label="Phase"
                        options={["3-Phase", "Single-Phase"]}
                    />
                    <SelectField
                        id="electricalFreq"
                        label="Frequency"
                        options={["60Hz", "50Hz"]}
                    />
                </div>
                <div className="col-span-1 space-y-4">
                     <SelectField 
                        id="classificationSystem"
                        label="Hazard Zone Classification System" 
                        description="Select the standard used."
                        options={["Class/Division", "Zone"]}
                        value={classificationSystem}
                        onChange={(e) => setClassificationSystem(e.target.value)}
                    />
                    {classificationSystem === 'Class/Division' ? (
                        <div className="grid grid-cols-2 gap-x-2">
                            <SelectField id="areaDiv" label="Division" options={["Div 1", "Div 2"]} />
                            <SelectField id="areaGroup" label="Group" options={["A", "B", "C", "D"]} />
                        </div>
                    ) : (
                         <div className="grid grid-cols-2 gap-x-2">
                            <SelectField id="areaZone" label="Zone" options={["Zone 0", "Zone 1", "Zone 2"]} />
                            <SelectField id="areaGasGroup" label="Gas Group" options={["IIA", "IIB", "IIC"]} />
                        </div>
                    )}
                </div>
                <div className="md:col-span-2">
                    <SelectField
                        id="electricitySupply"
                        label="Electricity Supply Stability"
                        description="Is the supply stable or subject to fluctuations?"
                        options={["Stable Grid Supply", "Unstable Grid / Fluctuations", "Solar Panels / Variable Supply", "Generator Only"]}
                    />
                </div>
                 <div className="md:col-span-2">
                    <SelectField
                        id="internetAccess"
                        label="Internet Access at Installation Site"
                        description="Select the most reliable internet connection type available for commissioning and remote monitoring."
                        options={["Fiber Optic", "Ethernet", "Wi-Fi (Stable Coverage)", "Wi-Fi (Unreliable / Partial Coverage)", "Cellular (5G)", "Cellular (4G)", "No Internet Access"]}
                    />
                </div>
                <div className="md:col-span-2">
                    <UnitInputField
                        id="instrumentAir"
                        label="Available Instrument Air"
                        description="Pressure of available compressed air."
                        units={["bar", "PSIG"]}
                        placeholder="e.g., 7"
                        value={formState.instrumentAir.value}
                        unit={formState.instrumentAir.unit}
                        onValueChange={(val) => handleUnitInputChange('instrumentAir', 'value', val)}
                        onUnitChange={(val) => handleUnitInputChange('instrumentAir', 'unit', val)}
                    />
                </div>
                 <div className="md:col-span-2 mt-4">
                    <label className="block text-sm font-medium text-[var(--color-text-tertiary)]">Available Cooling Water</label>
                    <p className="mt-1 text-xs text-[var(--color-text-secondary)] mb-2">Specify flow, temperature, and pressure, if applicable.</p>
                    <div className="grid sm:grid-cols-3 gap-x-6 p-4 border border-[var(--color-border)] rounded-lg bg-[var(--color-panel-alt-bg)]/50">
                        <UnitInputField
                            id="coolingWaterFlow"
                            label="Flow Rate"
                            units={["LPM", "GPM"]}
                            placeholder="e.g., 380"
                            value={formState.coolingWaterFlow.value}
                            unit={formState.coolingWaterFlow.unit}
                            onValueChange={(val) => handleUnitInputChange('coolingWaterFlow', 'value', val)}
                            onUnitChange={(val) => handleUnitInputChange('coolingWaterFlow', 'unit', val)}
                        />
                        <UnitInputField
                            id="coolingWaterTemp"
                            label="Temperature"
                            units={["°C", "°F"]}
                            placeholder="e.g., 30"
                            value={formState.coolingWaterTemp.value}
                            unit={formState.coolingWaterTemp.unit}
                            onValueChange={(val) => handleUnitInputChange('coolingWaterTemp', 'value', val)}
                            onUnitChange={(val) => handleUnitInputChange('coolingWaterTemp', 'unit', val)}
                        />
                        <UnitInputField
                            id="coolingWaterPressure"
                            label="Pressure"
                            units={["bar", "PSIG"]}
                            placeholder="e.g., 3.5"
                            value={formState.coolingWaterPressure.value}
                            unit={formState.coolingWaterPressure.unit}
                            onValueChange={(val) => handleUnitInputChange('coolingWaterPressure', 'value', val)}
                            onUnitChange={(val) => handleUnitInputChange('coolingWaterPressure', 'unit', val)}
                        />
                    </div>
                </div>
            </div>
        </fieldset>

         <fieldset>
            <legend className="text-lg font-semibold text-[var(--color-text-primary)] mb-4 border-b pb-2 w-full border-[var(--color-border)]">7. Installation & Site Access</legend>
            <div className="grid md:grid-cols-1 gap-x-6">
                <QuestionnaireField
                    label="Space Constraints or Limitations"
                    description="Describe any physical limitations for the VRU installation area."
                >
                    <textarea
                        id="spaceConstraints"
                        rows={3}
                        className={inputClasses}
                        placeholder="e.g., Limited footprint of 10x15 ft, overhead height restriction of 20 ft."
                    />
                </QuestionnaireField>
                <QuestionnaireField
                    label="Available Construction Equipment"
                    description="Do you have access to lifts or machinery for installation?"
                >
                    <textarea
                        id="constructionEquipment"
                        rows={3}
                        className={inputClasses}
                        placeholder="e.g., Yes, we have a 5-ton forklift and a 50-ft manlift available on site."
                    />
                </QuestionnaireField>
                <div className="md:col-span-1 mt-4 p-4 bg-[var(--color-info-bg)] border-l-4 border-[var(--color-info-border)] rounded-r-lg">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-[var(--color-info-icon)]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-[var(--color-info-text)]">
                                For a more accurate assessment, please send any available site blueprints or P&IDs (Piping and Instrumentation Diagrams) separately to our engineering team.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </fieldset>


         <fieldset>
            <legend className="text-lg font-semibold text-[var(--color-text-primary)] mb-4 border-b pb-2 w-full border-[var(--color-border)]">8. Regulatory & Compliance</legend>
            <div className="grid md:grid-cols-2 gap-x-6">
                <QuestionnaireField label="Applicable Environmental Regulations" description="List governing bodies (e.g., EPA, CARB, TA Luft).">
                    <input id="regulations" type="text" className={inputClasses} placeholder="e.g., EPA 40 CFR Part 63, Subpart CC" />
                </QuestionnaireField>
                <UnitInputField
                    id="vocRecovery"
                    label="Required VOC Recovery Efficiency"
                    description="The target percentage of VOCs to be recovered."
                    units={["%"]}
                    placeholder="e.g., 98.5"
                    value={formState.vocRecovery.value}
                    unit={formState.vocRecovery.unit}
                    onValueChange={(val) => handleUnitInputChange('vocRecovery', 'value', val)}
                    onUnitChange={(val) => handleUnitInputChange('vocRecovery', 'unit', val)}
                />
            </div>
             <UnitInputField
                id="noiseLevel"
                label="Noise Level Requirements"
                description="Maximum allowable noise at a specified distance."
                units={["dBA @ 1m", "dBA @ 3ft"]}
                placeholder="e.g., < 85"
                value={formState.noiseLevel.value}
                unit={formState.noiseLevel.unit}
                onValueChange={(val) => handleUnitInputChange('noiseLevel', 'value', val)}
                onUnitChange={(val) => handleUnitInputChange('noiseLevel', 'unit', val)}
            />
        </fieldset>

        <fieldset>
            <legend className="text-lg font-semibold text-[var(--color-text-primary)] mb-4 border-b pb-2 w-full border-[var(--color-border)]">9. Project Management & Reporting</legend>
            <QuestionnaireField
                label="Reporting Requirements"
                description="Will your company require additional documentation during installation?"
            >
                <textarea
                    id="reportingRequirements"
                    rows={4}
                    className={inputClasses}
                    placeholder="e.g., Yes, we require daily progress reports with photos and a weekly summary meeting with the project manager."
                />
            </QuestionnaireField>
        </fieldset>
        
        <fieldset>
            <legend className="text-lg font-semibold text-[var(--color-text-primary)] mb-4 border-b pb-2 w-full border-[var(--color-border)]">10. Other Requirements</legend>
            <QuestionnaireField
                label="Additional Notes or Requirements"
                description="Please provide any other relevant information, specifications, or constraints for this project."
            >
                <textarea
                    id="otherRequirements"
                    rows={5}
                    className={inputClasses}
                    placeholder="e.g., Skid-mounted unit required, specific paint specifications, preferred component manufacturers, etc."
                />
            </QuestionnaireField>
        </fieldset>
        
        <div className="text-right pt-4">
          <button
            type="button"
            className="bg-[var(--color-pdf-button-bg)] text-[var(--color-pdf-button-text)] font-bold py-3 px-6 rounded-lg hover:opacity-90 focus:outline-none focus:ring-4 focus:ring-[var(--color-pdf-button-bg)]/50 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-wait"
            onClick={handleDownloadPdf}
            disabled={isGeneratingPdf}
          >
            {isGeneratingPdf ? 'Generating PDF...' : 'Download as PDF for Review'}
          </button>
        </div>
      </form>
    </div>
  );
};
