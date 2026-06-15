from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_RIGHT
from reportlab.graphics.shapes import Drawing, Rect, String, Line, Polygon, Arrow
from reportlab.graphics import renderPDF
from reportlab.platypus import Flowable
import math

OUTPUT = "/mnt/user-data/outputs/WRH_Visual_Model_Sheet.pdf"

doc = SimpleDocTemplate(
    OUTPUT,
    pagesize=letter,
    leftMargin=0.7*inch,
    rightMargin=0.7*inch,
    topMargin=0.6*inch,
    bottomMargin=0.6*inch,
)

# ── Palette ──────────────────────────────────────────────────────────────────
BLACK      = colors.HexColor("#0D0D0D")
CHARCOAL   = colors.HexColor("#2B2B2B")
GOLD       = colors.HexColor("#C9A84C")
GOLD_LIGHT = colors.HexColor("#F5E6C0")
MID_GRAY   = colors.HexColor("#555555")
LIGHT_GRAY = colors.HexColor("#F4F4F4")
RULE_GRAY  = colors.HexColor("#DDDDDD")
DARK_BOX   = colors.HexColor("#1E1E1E")
WHITE      = colors.white

# ── Styles ───────────────────────────────────────────────────────────────────
def S(name, **kw):
    d = dict(fontName="Helvetica", fontSize=9, leading=13,
             textColor=CHARCOAL, spaceAfter=0, spaceBefore=0)
    d.update(kw)
    return ParagraphStyle(name, **d)

S_TITLE    = S("title", fontSize=16, fontName="Helvetica-Bold", textColor=BLACK, leading=20)
S_SUB      = S("sub",   fontSize=8.5, textColor=MID_GRAY, leading=12)
S_SECTION  = S("sec",   fontSize=7.5, fontName="Helvetica-Bold", textColor=WHITE, leading=10)
S_BODY     = S("body",  fontSize=8.8, leading=13, textColor=CHARCOAL)
S_BODY_SM  = S("bsm",   fontSize=8.2, leading=12, textColor=CHARCOAL)
S_CAPTION  = S("cap",   fontSize=7.5, textColor=MID_GRAY, leading=11, alignment=TA_CENTER)
S_FOOTER   = S("ft",    fontSize=7.5, textColor=MID_GRAY, alignment=TA_CENTER, leading=10)
S_RIGHT    = S("rt",    fontSize=8,   textColor=MID_GRAY, alignment=TA_RIGHT, leading=11)

story = []
W = 7.1 * inch

def section_bar(text):
    t = Table([[Paragraph(text.upper(), S_SECTION)]], colWidths=[W])
    t.setStyle(TableStyle([
        ("BACKGROUND",    (0,0), (-1,-1), CHARCOAL),
        ("TOPPADDING",    (0,0), (-1,-1), 4),
        ("BOTTOMPADDING", (0,0), (-1,-1), 4),
        ("LEFTPADDING",   (0,0), (-1,-1), 7),
    ]))
    story.append(Spacer(1, 6))
    story.append(t)
    story.append(Spacer(1, 8))

# ── Header ────────────────────────────────────────────────────────────────────
hdr = Table([[
    Paragraph("WRH Core Model — Visual Reference", S_TITLE),
    Paragraph("Capitol Contracts LLC<br/>capitolcontracts@outlook.com", S_RIGHT),
]], colWidths=[4.4*inch, 2.7*inch])
hdr.setStyle(TableStyle([
    ("VALIGN", (0,0), (-1,-1), "BOTTOM"),
    ("BOTTOMPADDING", (0,0), (-1,-1), 3),
]))
story.append(hdr)
story.append(Paragraph(
    "What Really Happened™ (WRH) — Survival Map &amp; Trajectory Engine",
    S_SUB))
story.append(HRFlowable(width="100%", thickness=1.5, color=GOLD,
                         spaceAfter=6, spaceBefore=4))

# ══════════════════════════════════════════════════════════════════════════════
# SURVIVAL MAP — horizontal flow diagram built as a table
# ══════════════════════════════════════════════════════════════════════════════
section_bar("The Survival Map — Where Patterns Come From")

story.append(Paragraph(
    "The Survival Map is WRH's five-part trauma-literacy model. It explains where "
    "patterns came from before asking anyone to change them. It does not require "
    "disclosure, diagnosis, or clinical processing.",
    S_BODY))
story.append(Spacer(1, 10))

# Build the five-box flow as a table with arrow connectors
# Box content: [stage name, one-line description, color]
stages = [
    ("The Flood",      "Overwhelming conditions\nthat shaped the system",    colors.HexColor("#1A3A5C"), colors.HexColor("#B8D4EC")),
    ("The Alarm",      "The nervous system\nreads danger — real or not",     colors.HexColor("#2A3A20"), colors.HexColor("#B8D4A8")),
    ("Survival Moves", "Automatic behaviors\nthat kept the person safe",     colors.HexColor("#3A2A10"), colors.HexColor("#EAC98A")),
    ("The Rescue Boat","Tools, people, and\npatterns that held things",      colors.HexColor("#2A1A3A"), colors.HexColor("#C8B4E8")),
    ("The Way Back",   "The path toward\ndirection and stability",           colors.HexColor("#1A3A30"), colors.HexColor("#A8D4C8")),
]

# Build as a single-row table: box | arrow | box | arrow | box ...
BOX_W = 1.09 * inch
ARR_W = 0.14 * inch
BOX_H = 0.82 * inch

def make_stage_box(name, desc, bg_dark, bg_light):
    """Return a table cell paragraph list for one stage box."""
    name_style = S("sn", fontSize=8, fontName="Helvetica-Bold",
                   textColor=bg_light, leading=10, alignment=TA_CENTER)
    desc_style = S("sd", fontSize=7, textColor=bg_light,
                   leading=9.5, alignment=TA_CENTER)
    return [Paragraph(name, name_style),
            Spacer(1, 2),
            Paragraph(desc.replace("\n", "<br/>"), desc_style)]

def make_arrow_cell():
    return [Paragraph("→", S("arr", fontSize=14, textColor=GOLD,
                              alignment=TA_CENTER, leading=20))]

# Build row data and column widths
row_data = []
col_widths = []
for i, (name, desc, bg_dark, bg_light) in enumerate(stages):
    row_data.append(make_stage_box(name, desc, bg_dark, bg_light))
    col_widths.append(BOX_W)
    if i < len(stages) - 1:
        row_data.append(make_arrow_cell())
        col_widths.append(ARR_W)

flow_table = Table([row_data], colWidths=col_widths, rowHeights=[BOX_H])

# Build table style
ts = [
    ("VALIGN",        (0,0), (-1,-1), "MIDDLE"),
    ("TOPPADDING",    (0,0), (-1,-1), 6),
    ("BOTTOMPADDING", (0,0), (-1,-1), 6),
    ("LEFTPADDING",   (0,0), (-1,-1), 4),
    ("RIGHTPADDING",  (0,0), (-1,-1), 4),
    ("ALIGN",         (0,0), (-1,-1), "CENTER"),
]
# Add background colors for each box column
for i, (name, desc, bg_dark, bg_light) in enumerate(stages):
    col_idx = i * 2  # every other col is a box
    ts.append(("BACKGROUND", (col_idx, 0), (col_idx, 0), bg_dark))
    ts.append(("ROUNDEDCORNERS", [4], (col_idx, 0), (col_idx, 0)))

flow_table.setStyle(TableStyle(ts))
story.append(flow_table)
story.append(Spacer(1, 5))

# Caption row with stage numbers
caption_data = []
cap_col_widths = []
for i, (name, _, _, _) in enumerate(stages):
    caption_data.append(Paragraph(f"Stage {i+1}", S_CAPTION))
    cap_col_widths.append(BOX_W)
    if i < len(stages) - 1:
        caption_data.append(Paragraph("", S_CAPTION))
        cap_col_widths.append(ARR_W)

cap_table = Table([caption_data], colWidths=cap_col_widths)
cap_table.setStyle(TableStyle([
    ("ALIGN", (0,0), (-1,-1), "CENTER"),
    ("TOPPADDING", (0,0), (-1,-1), 0),
    ("BOTTOMPADDING", (0,0), (-1,-1), 0),
]))
story.append(cap_table)
story.append(Spacer(1, 6))

# Summary line
summary_box = Table([[Paragraph(
    "<b>Core principle:</b> People cannot interrupt a pattern they have never been "
    "taught to see. The Survival Map makes the pattern visible — without blame, "
    "disclosure, or clinical framing.",
    S_BODY_SM)]], colWidths=[W])
summary_box.setStyle(TableStyle([
    ("BACKGROUND",    (0,0), (-1,-1), LIGHT_GRAY),
    ("TOPPADDING",    (0,0), (-1,-1), 6),
    ("BOTTOMPADDING", (0,0), (-1,-1), 6),
    ("LEFTPADDING",   (0,0), (-1,-1), 10),
    ("RIGHTPADDING",  (0,0), (-1,-1), 10),
    ("BOX",           (0,0), (-1,-1), 0.5, RULE_GRAY),
]))
story.append(summary_box)

# ══════════════════════════════════════════════════════════════════════════════
# TRAJECTORY ENGINE — horizontal flow diagram
# ══════════════════════════════════════════════════════════════════════════════
section_bar("The Trajectory Engine — How Direction Changes")

story.append(Paragraph(
    "The Trajectory Engine is WRH's directional-change model. It explains how a person "
    "moves from automatic survival pattern to repeated, measurable change — not through "
    "willpower or punishment, but through repeated interrupts that build evidence.",
    S_BODY))
story.append(Spacer(1, 10))

te_stages = [
    ("Pattern",     "The automatic\nsurvival sequence",    colors.HexColor("#3A1A1A"), colors.HexColor("#F0B8B8")),
    ("Fork",        "The moment\ndirection can change",    colors.HexColor("#3A2A10"), colors.HexColor("#EAC98A")),
    ("Interrupt",   "A small action\nbreaks the sequence", colors.HexColor("#1A3A20"), colors.HexColor("#A8D4A8")),
    ("Repetition",  "The new action\nis repeated",         colors.HexColor("#1A2A3A"), colors.HexColor("#A8C4E8")),
    ("Evidence",    "Lived proof the\nnew path works",     colors.HexColor("#2A1A3A"), colors.HexColor("#C8B4E8")),
    ("Direction",   "Stabilized\nmovement forward",        colors.HexColor("#1A3A28"), colors.HexColor("#A8D4C0")),
]

te_BOX_W = 0.895 * inch
te_ARR_W = 0.13 * inch

te_row = []
te_col_w = []
for i, (name, desc, bg_dark, bg_light) in enumerate(te_stages):
    te_row.append(make_stage_box(name, desc, bg_dark, bg_light))
    te_col_w.append(te_BOX_W)
    if i < len(te_stages) - 1:
        te_row.append(make_arrow_cell())
        te_col_w.append(te_ARR_W)

te_table = Table([te_row], colWidths=te_col_w, rowHeights=[BOX_H])

te_ts = [
    ("VALIGN",        (0,0), (-1,-1), "MIDDLE"),
    ("TOPPADDING",    (0,0), (-1,-1), 6),
    ("BOTTOMPADDING", (0,0), (-1,-1), 6),
    ("LEFTPADDING",   (0,0), (-1,-1), 4),
    ("RIGHTPADDING",  (0,0), (-1,-1), 4),
    ("ALIGN",         (0,0), (-1,-1), "CENTER"),
]
for i, (name, desc, bg_dark, bg_light) in enumerate(te_stages):
    col_idx = i * 2
    te_ts.append(("BACKGROUND", (col_idx, 0), (col_idx, 0), bg_dark))

te_table.setStyle(TableStyle(te_ts))
story.append(te_table)
story.append(Spacer(1, 5))

# Caption row
te_cap_data = []
te_cap_widths = []
for i, (name, _, _, _) in enumerate(te_stages):
    te_cap_data.append(Paragraph(f"Stage {i+1}", S_CAPTION))
    te_cap_widths.append(te_BOX_W)
    if i < len(te_stages) - 1:
        te_cap_data.append(Paragraph("", S_CAPTION))
        te_cap_widths.append(te_ARR_W)

te_cap_table = Table([te_cap_data], colWidths=te_cap_widths)
te_cap_table.setStyle(TableStyle([
    ("ALIGN",         (0,0), (-1,-1), "CENTER"),
    ("TOPPADDING",    (0,0), (-1,-1), 0),
    ("BOTTOMPADDING", (0,0), (-1,-1), 0),
]))
story.append(te_cap_table)
story.append(Spacer(1, 6))

te_summary = Table([[Paragraph(
    "<b>Core principle:</b> One interrupt does not change a trajectory — repetition does. "
    "The nervous system updates through repeated evidence that a new direction is possible. "
    "WRH tracks direction, not compliance.",
    S_BODY_SM)]], colWidths=[W])
te_summary.setStyle(TableStyle([
    ("BACKGROUND",    (0,0), (-1,-1), LIGHT_GRAY),
    ("TOPPADDING",    (0,0), (-1,-1), 6),
    ("BOTTOMPADDING", (0,0), (-1,-1), 6),
    ("LEFTPADDING",   (0,0), (-1,-1), 10),
    ("RIGHTPADDING",  (0,0), (-1,-1), 10),
    ("BOX",           (0,0), (-1,-1), 0.5, RULE_GRAY),
]))
story.append(te_summary)

# ══════════════════════════════════════════════════════════════════════════════
# HOW THEY CONNECT
# ══════════════════════════════════════════════════════════════════════════════
section_bar("How the Two Models Connect")

connect_rows = [
    [Paragraph("<b>Survival Map</b>", S_BODY),
     Paragraph("Answers: <i>Where did this pattern come from?</i>", S_BODY_SM)],
    [Paragraph("<b>Trajectory Engine</b>", S_BODY),
     Paragraph("Answers: <i>How does direction change?</i>", S_BODY_SM)],
    [Paragraph("<b>Together</b>", S_BODY),
     Paragraph("Give staff and participants a shared language for understanding patterns "
               "and supporting measurable directional change — without therapy, "
               "diagnosis, or disclosure.", S_BODY_SM)],
]
connect_table = Table(connect_rows, colWidths=[1.5*inch, 5.6*inch])
connect_table.setStyle(TableStyle([
    ("VALIGN",        (0,0), (-1,-1), "TOP"),
    ("TOPPADDING",    (0,0), (-1,-1), 5),
    ("BOTTOMPADDING", (0,0), (-1,-1), 5),
    ("LEFTPADDING",   (0,0), (-1,-1), 6),
    ("ROWBACKGROUNDS",(0,0), (-1,-1), [LIGHT_GRAY, WHITE, LIGHT_GRAY]),
    ("GRID",          (0,0), (-1,-1), 0.25, RULE_GRAY),
]))
story.append(connect_table)

# ── Footer ────────────────────────────────────────────────────────────────────
story.append(Spacer(1, 8))
story.append(HRFlowable(width="100%", thickness=0.5, color=MID_GRAY,
                         spaceAfter=5, spaceBefore=2))
footer_row = Table([[
    Paragraph("Repository Index:", S_FOOTER),
    Paragraph(
        '<a href="https://github.com/daniel-lingar/wrh-master-curriculum/blob/master/WRH_REPOSITORY_INDEX.md" color="#C9A84C">'
        'github.com/daniel-lingar/wrh-master-curriculum/blob/master/WRH_REPOSITORY_INDEX.md</a>',
        S("fl", fontSize=7.5, textColor=GOLD, alignment=TA_LEFT, leading=10)),
]], colWidths=[1.3*inch, 5.8*inch])
footer_row.setStyle(TableStyle([
    ("VALIGN", (0,0), (-1,-1), "MIDDLE"),
    ("LEFTPADDING", (0,0), (-1,-1), 0),
    ("TOPPADDING", (0,0), (-1,-1), 0),
    ("BOTTOMPADDING", (0,0), (-1,-1), 0),
]))
story.append(footer_row)
story.append(Spacer(1, 3))
story.append(Paragraph(
    "NOT THERAPY · NOT MEDICAL ADVICE · NOT CLINICAL CARE  ·  "
    "Non-clinical trauma-literacy curriculum  ·  Capitol Contracts LLC  ·  NAICS 611710",
    S_FOOTER))

doc.build(story)
print("Visual Model Sheet built successfully.")
