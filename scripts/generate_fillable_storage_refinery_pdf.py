#!/usr/bin/env python3
"""Generate the branded interactive Storage/Refinery VRU questionnaire."""
from pathlib import Path
from reportlab.lib.colors import Color, HexColor, white
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfgen import canvas
from pypdf import PdfReader

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "downloads" / "MasarZero_Storage_Refinery_VRU_Fillable_Questionnaire.pdf"
LOGO = ROOT / "public" / "masarzerologo.png"
TMP = ROOT / "tmp" / "pdfs"

W, H = A4
MARGIN = 14 * mm
PANEL_W, PANEL_H = W - (2 * MARGIN), H - (2 * MARGIN)
TEAL = HexColor("#18877E")
LIGHT_TEAL = HexColor("#2BA99E")
BASE = HexColor("#F2F4F8")
INK = HexColor("#152230")
MUTED = HexColor("#526171")
PALE = HexColor("#EAF7F5")


def field_name(section, name):
    return f"{section}.{name}".replace(" ", "_").lower()


class Form:
    def __init__(self, output):
        self.c = canvas.Canvas(str(output), pagesize=A4)
        self.form = self.c.acroForm
        self.page = 0

    def cover(self):
        c = self.c
        c.setFillColor(BASE); c.rect(0, 0, W, H, fill=1, stroke=0)
        # A single, constant-width diagonal ribbon sits behind the vertical brand block.
        # The ribbon ends at the edge of the vertical teal block, not at the page corner.
        c.saveState(); c.setFillColor(LIGHT_TEAL); c.translate(W, H); c.rotate(-118); c.rect(0, -15 * mm, 430 * mm, 30 * mm, fill=1, stroke=0); c.restoreState()
        c.setFillColor(TEAL); c.rect(0, 0, 52 * mm, H, fill=1, stroke=0)
        panel_w, panel_h = 119 * mm, 112 * mm
        panel_x, panel_y = (W - panel_w) / 2, (H - panel_h) / 2
        c.setFillColor(white); c.roundRect(panel_x, panel_y, panel_w, panel_h, 5 * mm, fill=1, stroke=0)
        if LOGO.exists(): c.drawImage(str(LOGO), panel_x + 18.5 * mm, panel_y + 67 * mm, width=82 * mm, height=39 * mm, preserveAspectRatio=True, mask='auto')
        c.setFillColor(INK); c.setFont("Helvetica-Bold", 20); c.drawCentredString(panel_x + panel_w / 2, panel_y + 51 * mm, "Storage / Refinery")
        c.drawCentredString(panel_x + panel_w / 2, panel_y + 39 * mm, "VRU Engineering Questionnaire")
        c.setFillColor(white); c.setFont("Helvetica-Bold", 10); c.drawString(14 * mm, 18 * mm, "MASARZERO")
        c.showPage()

    def interior(self, title, note):
        self.page += 1
        c = self.c
        c.setFillColor(BASE); c.rect(0, 0, W, H, fill=1, stroke=0)
        c.saveState(); c.setFillColor(LIGHT_TEAL); c.translate(W, H); c.rotate(-118); c.rect(0, -15 * mm, 430 * mm, 30 * mm, fill=1, stroke=0); c.restoreState()
        c.setFillColor(TEAL); c.rect(0, 0, 42 * mm, H, fill=1, stroke=0)
        c.setFillColor(white); c.roundRect(MARGIN, MARGIN, PANEL_W, PANEL_H, 4 * mm, fill=1, stroke=0)
        c.setFillColor(TEAL); c.roundRect(MARGIN + 7 * mm, H - MARGIN - 23 * mm, PANEL_W - 14 * mm, 13 * mm, 2 * mm, fill=1, stroke=0)
        c.setFillColor(white); c.setFont("Helvetica-Bold", 12); c.drawString(MARGIN + 11 * mm, H - MARGIN - 18 * mm, title)
        c.setFillColor(MUTED); c.setFont("Helvetica", 8.5); c.drawString(MARGIN + 8 * mm, H - MARGIN - 31 * mm, note)
        if LOGO.exists(): c.drawImage(str(LOGO), W - MARGIN - 38 * mm, H - MARGIN - 19 * mm, width=31 * mm, height=16 * mm, preserveAspectRatio=True, mask='auto')
        c.setFillColor(MUTED); c.setFont("Helvetica", 7.5); c.drawString(MARGIN + 8 * mm, MARGIN + 5 * mm, "MasarZero - Fillable VRU Questionnaire")
        c.drawRightString(W - MARGIN - 8 * mm, MARGIN + 5 * mm, f"Page {self.page + 1}")
        return H - MARGIN - 42 * mm

    def label(self, text, x, y):
        self.c.setFillColor(INK); self.c.setFont("Helvetica-Bold", 8.5); self.c.drawString(x, y, text)

    def hint(self, text, x, y):
        self.c.setFillColor(MUTED); self.c.setFont("Helvetica", 7); self.c.drawString(x, y, text)

    def text(self, section, name, label, x, y, width=70*mm, height=7*mm, hint=None, multiline=False):
        self.label(label, x, y + height + 3 * mm)
        if hint: self.hint(hint, x, y - 3 * mm)
        flags = 4096 if multiline else 0
        self.form.textfield(name=field_name(section, name), x=x, y=y, width=width, height=height, borderColor=TEAL, fillColor=white, textColor=INK, borderWidth=1, fontName="Helvetica", fontSize=8, fieldFlags=flags)

    def choice(self, section, name, label, options, x, y, width=70*mm):
        self.label(f"{label} (dropdown - select one)", x, y + 10 * mm)
        self.form.choice(name=field_name(section, name), value=options[0], options=options, x=x, y=y, width=width, height=7*mm, borderColor=TEAL, fillColor=white, textColor=INK, borderWidth=1, fontName="Helvetica", fontSize=8)
        # PDF viewers do not always show the native dropdown affordance, so add one explicitly.
        arrow_x, arrow_y = x + width - 6 * mm, y + 3.2 * mm
        self.c.setFillColor(TEAL)
        arrow = self.c.beginPath(); arrow.moveTo(arrow_x, arrow_y + 1.5 * mm); arrow.lineTo(arrow_x + 3 * mm, arrow_y + 1.5 * mm); arrow.lineTo(arrow_x + 1.5 * mm, arrow_y); arrow.close()
        self.c.drawPath(arrow, fill=1, stroke=0)

    def checkbox(self, section, name, label, x, y):
        self.form.checkbox(name=field_name(section, name), x=x, y=y, size=5*mm, buttonStyle='check', borderColor=TEAL, fillColor=white, textColor=TEAL, borderWidth=1)
        self.c.setFillColor(INK); self.c.setFont("Helvetica", 8.5); self.c.drawString(x + 7 * mm, y + 1.3 * mm, label)

    def radio(self, section, name, value, label, x, y, selected=False):
        self.form.radio(name=field_name(section, name), value=value, selected=selected, x=x, y=y, size=5*mm, buttonStyle='circle', borderColor=TEAL, fillColor=white, textColor=TEAL, borderWidth=1)
        self.c.setFillColor(INK); self.c.setFont("Helvetica", 8.5); self.c.drawString(x + 7 * mm, y + 1.3 * mm, label)

    def finish(self):
        self.c.save()


def build():
    OUT.parent.mkdir(parents=True, exist_ok=True); TMP.mkdir(parents=True, exist_ok=True)
    f = Form(OUT); f.cover(); left, right = MARGIN + 8*mm, MARGIN + 100*mm

    y = f.interior("1. Portfolio overview", "Combined figures for all relevant storage and refinery sites.")
    f.text("portfolio", "site_count", "Number of relevant sites", left, y-14*mm, hint="Storage, tank farm, and refinery sites requiring VRU review")
    f.text("portfolio", "country", "Country", right, y-14*mm)
    f.text("portfolio", "city_region", "City / region", left, y-39*mm)
    f.text("portfolio", "normal_inventory_t", "Typical inventory across all sites (t)", right, y-39*mm, hint="Normal operating inventory")
    f.text("portfolio", "usable_capacity_t", "Total usable capacity across all sites (t)", left, y-64*mm, hint="Maximum safe working inventory")
    f.text("portfolio", "throughput_t_month", "Total monthly throughput across all sites (t/month)", right, y-64*mm, hint="Monthly product received, transferred, or dispatched")
    f.c.showPage()

    y = f.interior("2. Proposed VRU project", "Provide the scope and contacts for the proposed VRU package, not the wider refinery programme.")
    f.text("project", "project_name", "Proposed VRU project name / reference", left, y-14*mm)
    f.text("project", "site_address", "Site address / area reference", right, y-14*mm)
    f.text("project", "country", "Country", left, y-39*mm)
    f.text("project", "city_region", "City / region", right, y-39*mm)
    f.text("project", "contact_name", "Technical contact", left, y-64*mm)
    f.text("project", "contact_email", "Contact email", right, y-64*mm)
    f.text("project", "vru_start", "Expected VRU project start", left, y-89*mm)
    f.text("project", "vru_commission", "Target VRU commissioning date", right, y-89*mm)
    f.c.showPage()

    y = f.interior("3. Facility and transfer sources", "Select every source that can feed tanks connected to this vapor system. Complete applicable fields only.")
    f.choice("transfer", "facility_type", "Facility type", ["Tank Farm", "Storage Facility", "Refinery", "Bulk terminal", "Other"], left, y-14*mm)
    for i, item in enumerate(["Truck receipt", "Refinery / pipeline transfer", "Rail receipt", "Marine / barge receipt"]): f.checkbox("transfer", f"source_{i}", item, left + (i%2)*88*mm, y-35*mm-(i//2)*11*mm)
    f.text("transfer", "truck_frequency", "Truck receipt frequency (events/day, if applicable)", left, y-68*mm)
    f.text("transfer", "truck_simultaneous", "Simultaneous trucks (if applicable)", right, y-68*mm)
    f.text("transfer", "pipeline_flow", "Pipeline/refinery transfer flow (m3/h, if applicable)", left, y-93*mm)
    f.text("transfer", "transfer_lines", "Simultaneous transfer lines", right, y-93*mm)
    f.text("transfer", "transfer_hours", "Normal / peak transfer hours per day", left, y-118*mm)
    f.text("transfer", "transfer_pressure", "Transfer pressure (barg or kPa)", right, y-118*mm)
    f.choice("transfer", "fill_method", "Tank receipt / fill method", ["Submerged fill (top-entry dip pipe)", "Bottom fill (lower tank nozzle)", "Top loading", "Both / varies by tank", "Other"], left, y-143*mm)
    f.hint("Submerged describes discharge below the liquid level; bottom fill describes entry through a lower tank nozzle.", left, y-153*mm)
    f.c.showPage()

    y = f.interior("4. Simultaneous operations and design case", "Use the absolute worst credible case, not monthly throughput or an average operating day.")
    f.text("operations", "simultaneous_arms", "Maximum simultaneous loading arms / hoses", left, y-14*mm)
    f.text("operations", "simultaneous_truck_bays", "Maximum simultaneous truck bays", right, y-14*mm)
    f.text("operations", "simultaneous_marine_berths", "Maximum simultaneous marine berths", left, y-39*mm)
    f.text("operations", "simultaneous_transfer_lines", "Maximum simultaneous refinery / pipeline lines", right, y-39*mm)
    f.text("operations", "average_active_rate", "Average active transfer rate (m3/h per connection)", left, y-64*mm)
    f.text("operations", "peak_active_rate", "Peak active transfer rate (m3/h per connection)", right, y-64*mm)
    f.text("operations", "worst_case_scenario", "Worst-case simultaneous scenario", left, y-99*mm, width=160*mm, height=22*mm, multiline=True)
    f.c.showPage()

    y = f.interior("5. Tank inventory", "List tanks connected to the proposed VRU vapor collection system. Add rows on a continuation sheet if needed.")
    headers = [["Tank ID"], ["Product"], ["Tank type"], ["Normal inventory", "(t)"], ["Usable capacity", "(t)"], ["Throughput", "(t/month)"], ["VRU", "connected?"]]
    widths = [18, 25, 22, 28, 27, 30, 16]
    x = left
    for h, w in zip(headers, widths):
        for line, label in enumerate(h): f.label(label, x, y - line * 3.5 * mm)
        x += w*mm
    for row in range(5):
        yy = y - 10*mm - row*14*mm; x = left
        for col, w in enumerate(widths[:-1]):
            f.form.textfield(name=field_name("tanks", f"{row+1}_{col+1}"), x=x, y=yy, width=(w-2)*mm, height=7*mm, borderColor=TEAL, fillColor=white, textColor=INK, borderWidth=1, fontName="Helvetica", fontSize=7)
            x += w*mm
        f.form.checkbox(name=field_name("tanks", f"{row+1}_connected"), x=x+4*mm, y=yy+1*mm, size=5*mm, buttonStyle='check', borderColor=TEAL, fillColor=white, textColor=TEAL, borderWidth=1)
    f.radio("tanks", "blanketing", "yes", "Tanks gas blanketed - Yes", left, y-88*mm); f.radio("tanks", "blanketing", "no", "No", left+60*mm, y-88*mm)
    f.text("tanks", "blanketing_details", "Blanketing gas and set pressure (if applicable)", left, y-113*mm, width=160*mm)
    f.c.showPage()

    y = f.interior("6. Vapor and product characteristics", "Use laboratory or current design-basis data where available.")
    f.text("vapor", "gc_analysis", "Headspace vapor composition / GC analysis", left, y-16*mm, width=160*mm, height=18*mm, multiline=True)
    f.text("vapor", "molecular_weight", "Vapor molecular weight (g/mol)", left, y-51*mm)
    f.text("vapor", "lel", "Vapor lower explosive limit (% by vol)", right, y-51*mm)
    f.choice("vapor", "water_saturation", "Water saturated vapor stream?", ["Unknown", "Yes", "No"], left, y-76*mm)
    f.text("vapor", "corrosives", "Corrosive / toxic components", right, y-76*mm)
    f.text("vapor", "source_notes", "Additional vapor or product notes", left, y-116*mm, width=160*mm, height=25*mm, multiline=True)
    f.c.showPage()

    y = f.interior("7. Vapor system and piping", "Complete available values. Mark not available in the notes when design data is pending.")
    f.text("piping", "header_size", "Vapor header nominal size (mm)", left, y-14*mm)
    f.text("piping", "piping_length", "Total vapor piping length (m)", right, y-14*mm)
    f.text("piping", "vent_positive", "Tank P/V vent positive setting (mbar or Pa)", left, y-39*mm)
    f.text("piping", "vent_negative", "Tank P/V vent vacuum setting (mbar or Pa)", right, y-39*mm)
    f.radio("piping", "arrestor", "yes", "Existing flame/detonation arrestor - Yes", left, y-65*mm); f.radio("piping", "arrestor", "no", "No", left+76*mm, y-65*mm)
    f.text("piping", "material", "Vapor piping material", left, y-90*mm)
    f.text("piping", "piping_notes", "Piping constraints or notes", right, y-90*mm)
    f.text("piping", "tie_in_distance", "Vapor-header tie-in to VRU plot distance (m)", left, y-115*mm)
    f.text("piping", "tie_in_elevation", "Tie-in to VRU plot elevation change (m)", right, y-115*mm)
    f.c.showPage()

    y = f.interior("8. Utilities and hazardous area", "Use IECEx/ATEX Zone terminology unless another owner/project standard applies.")
    f.text("utilities", "voltage", "Available voltage (V)", left, y-14*mm)
    f.choice("utilities", "phase", "Electrical phase", ["3-phase", "Single-phase"], right, y-14*mm)
    f.choice("utilities", "frequency", "Electrical frequency", ["50 Hz", "60 Hz"], left, y-39*mm)
    f.choice("utilities", "classification", "Hazardous-area classification", ["Zone 0", "Zone 1", "Zone 2", "Other / owner standard"], right, y-39*mm)
    f.text("utilities", "gas_group", "Gas group / certification requirement", left, y-64*mm)
    f.text("utilities", "instrument_air", "Instrument air pressure (bar)", right, y-64*mm)
    f.text("utilities", "cooling_water", "Cooling water: flow, temperature, pressure", left, y-89*mm, width=160*mm)
    f.choice("utilities", "internet", "Installation-site internet access", ["Fiber", "Ethernet", "Stable Wi-Fi", "Cellular", "No internet", "Other"], left, y-114*mm)
    f.c.showPage()

    y = f.interior("9. Installation, safety, and compliance", "Complete applicable fields and attach owner specifications, drawings, and permits where available.")
    f.text("compliance", "space_constraints", "VRU installation space constraints", left, y-16*mm, width=160*mm, height=18*mm, multiline=True)
    f.text("compliance", "construction_equipment", "Available construction / lifting equipment", left, y-51*mm, width=160*mm)
    f.text("compliance", "emissions_standard", "Applicable environmental permit or emissions standard", left, y-76*mm)
    f.text("compliance", "voc_recovery", "Required VOC recovery efficiency (%)", right, y-76*mm)
    f.text("compliance", "noise_limit", "Noise limit (dBA and distance)", left, y-101*mm)
    f.text("compliance", "owner_standards", "Owner / project standards (IEC, ISO, EN, API if required)", right, y-101*mm)
    f.text("compliance", "plot_length", "Usable VRU plot length (m)", left, y-126*mm)
    f.text("compliance", "plot_width", "Usable VRU plot width (m)", right, y-126*mm)
    f.text("compliance", "plot_restrictions", "Plot dimensions, boundaries, access, setbacks, height, or layout restrictions", left, y-161*mm, width=160*mm, height=18*mm, multiline=True)
    f.c.showPage()

    y = f.interior("10. Controls, emissions, and guarantees", "Capture the owner acceptance requirements and control-room integration basis before final VRU scoping.")
    f.choice("controls", "control_system", "Control-system interface", ["DCS", "SCADA", "Local PLC", "Hardwired local control", "To be defined"], left, y-14*mm)
    f.text("controls", "control_vendor", "Existing DCS / SCADA vendor", right, y-14*mm)
    f.choice("controls", "plc_requirement", "Local PLC requirement", ["Vendor PLC", "Owner-specified PLC", "DCS integrated", "To be defined"], left, y-39*mm)
    f.choice("controls", "communications", "Required control-room handshake", ["Hardwired I/O", "Modbus TCP", "Profibus DP", "Profinet", "Other / TBD"], right, y-39*mm)
    f.choice("emissions", "cems_requirement", "CEMS / analyzer required?", ["Not required", "Integrated analyzer required", "Existing CEMS interface", "To be defined"], left, y-64*mm)
    f.text("emissions", "outlet_limit", "Guaranteed outlet limit (mg/Nm3 or ppmv)", right, y-64*mm)
    f.text("emissions", "outlet_basis", "Outlet pollutant / guarantee basis and test method", left, y-99*mm, width=160*mm, height=18*mm, multiline=True)
    f.c.showPage()

    y = f.interior("11. Refinery unit design basis", "Complete if the proposed VRU serves refinery process equipment or refinery transfer systems.")
    f.text("refinery", "unit", "Refinery unit / process area", left, y-14*mm)
    f.text("refinery", "vapor_sources", "Connected vapor sources", right, y-14*mm)
    f.choice("refinery", "operating_mode", "Operating mode", ["Continuous", "Intermittent", "Batch", "Multiple cases"], left, y-39*mm)
    f.text("refinery", "operating_hours", "Expected operating hours per year", right, y-39*mm)
    f.text("refinery", "normal_vapor_flow", "Normal vapor flow (Nm3/h)", left, y-64*mm)
    f.text("refinery", "design_vapor_flow", "Design vapor flow (Nm3/h)", right, y-64*mm)
    f.text("refinery", "inlet_conditions", "VRU inlet pressure and temperature", left, y-89*mm)
    f.text("refinery", "downstream", "Downstream destination and pressure", right, y-89*mm)
    f.text("refinery", "refinery_notes", "Refinery design-basis notes", left, y-118*mm, width=160*mm, height=22*mm, multiline=True)
    f.c.showPage()

    y = f.interior("12. Reporting, attachments, and sign-off", "Check documents being supplied with the completed PDF. Supporting files must be sent separately.")
    for i, item in enumerate(["P&ID / piping drawings", "GC or laboratory analysis", "Plot plan / general arrangement", "Tank datasheets", "Photographs", "Owner / EPC specifications", "Environmental permit", "Other supporting document"]): f.checkbox("attachments", f"document_{i+1}", item, left + (i%2)*86*mm, y-16*mm-(i//2)*11*mm)
    f.text("closeout", "reporting_requirements", "Required reports, approvals, and deliverables", left, y-80*mm, width=160*mm, height=18*mm, multiline=True)
    f.text("closeout", "other_requirements", "Other VRU requirements or constraints", left, y-119*mm, width=160*mm, height=18*mm, multiline=True)
    f.text("closeout", "prepared_by", "Prepared by", left, y-158*mm)
    f.text("closeout", "date", "Date", right, y-158*mm)
    f.finish()


def validate():
    reader = PdfReader(str(OUT))
    fields = reader.get_fields() or {}
    expected = {"portfolio.site_count", "transfer.source_0", "tanks.1_connected", "attachments.document_1", "closeout.prepared_by"}
    missing = expected - set(fields)
    if missing: raise RuntimeError(f"Missing expected form fields: {sorted(missing)}")
    buttons = [name for name, value in fields.items() if value.get("/FT") == "/Btn"]
    if len(buttons) < 12: raise RuntimeError("Expected interactive checkbox/radio fields were not created")
    print(f"Validated {len(fields)} AcroForm fields ({len(buttons)} button fields) in {OUT}")


if __name__ == "__main__":
    build(); validate()
