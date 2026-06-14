const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, HeadingLevel, BorderStyle, WidthType,
  ShadingType, VerticalAlign, PageNumber, PageBreak, LevelFormat,
  TableOfContents, TabStopType, TabStopPosition
} = require('docx');
const fs = require('fs');

// ── Color Palette ──────────────────────────────────────────────
const C = {
  navy:      "1F3864",
  steel:     "2E5F8A",
  midBlue:   "4472C4",
  lightBlue: "D6E4F0",
  headerBg:  "1F3864",
  rowAlt:    "EAF2FB",
  gold:      "C9A84C",
  warn:      "C00000",
  warnBg:    "FCE4E4",
  gray:      "595959",
  lightGray: "F2F2F2",
  white:     "FFFFFF",
  black:     "000000",
};

// ── Helpers ────────────────────────────────────────────────────
function spacer(sz = 120) {
  return new Paragraph({ children: [new TextRun("")], spacing: { before: sz, after: 0 } });
}

function pageBreak() {
  return new Paragraph({ children: [new PageBreak()] });
}

const border1 = { style: BorderStyle.SINGLE, size: 1, color: "BBBBBB" };
const borders = { top: border1, bottom: border1, left: border1, right: border1 };

const noBorder = { style: BorderStyle.NIL };
const noBorders = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder };

function cell(text, opts = {}) {
  const {
    bold = false, shade = null, align = AlignmentType.LEFT,
    w = 2340, italic = false, color = "000000", size = 20,
    vAlign = VerticalAlign.CENTER, colSpan = 1
  } = opts;
  return new TableCell({
    borders,
    width: { size: w, type: WidthType.DXA },
    shading: shade ? { fill: shade, type: ShadingType.CLEAR } : undefined,
    margins: { top: 80, bottom: 80, left: 120, right: 120 },
    verticalAlign: vAlign,
    columnSpan: colSpan,
    children: [new Paragraph({
      alignment: align,
      children: [new TextRun({ text, bold, italic, color, size, font: "Arial" })]
    })]
  });
}

function hCell(text, w = 2340) {
  return cell(text, { bold: true, shade: C.headerBg, color: C.white, w, size: 20 });
}

function labelCell(text, w = 2340) {
  return cell(text, { bold: true, shade: C.lightBlue, w, size: 20 });
}

function inputCell(text = "", w = 4680) {
  return cell(text, { w, shade: C.lightGray, size: 20 });
}

function blankCell(w = 4680) {
  return cell("", { w, shade: C.white, size: 20 });
}

function multiLineCell(lines, opts = {}) {
  const { shade = null, bold = false, w = 2340 } = opts;
  return new TableCell({
    borders,
    width: { size: w, type: WidthType.DXA },
    shading: shade ? { fill: shade, type: ShadingType.CLEAR } : undefined,
    margins: { top: 80, bottom: 80, left: 120, right: 120 },
    children: lines.map(l => new Paragraph({
      children: [new TextRun({ text: l, bold, size: 20, font: "Arial" })]
    }))
  });
}

// ── Typography helpers ─────────────────────────────────────────
function h1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    children: [new TextRun({ text, font: "Arial" })]
  });
}

function h2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    children: [new TextRun({ text, font: "Arial" })]
  });
}

function h3(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    children: [new TextRun({ text, font: "Arial" })]
  });
}

function body(text, opts = {}) {
  const { bold = false, italic = false, color = "000000", spacing = { after: 120 } } = opts;
  return new Paragraph({
    spacing,
    children: [new TextRun({ text, bold, italic, color, font: "Arial", size: 22 })]
  });
}

function bullet(text, level = 0) {
  return new Paragraph({
    numbering: { reference: "bullets", level },
    children: [new TextRun({ text, font: "Arial", size: 22 })]
  });
}

function numbered(text, level = 0) {
  return new Paragraph({
    numbering: { reference: "numbers", level },
    children: [new TextRun({ text, font: "Arial", size: 22 })]
  });
}

function sectionRule() {
  return new Paragraph({
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: C.steel, space: 1 } },
    spacing: { before: 240, after: 240 },
    children: []
  });
}

function callout(text, shade = C.warnBg, textColor = C.warn) {
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [9360],
    rows: [new TableRow({
      children: [new TableCell({
        borders,
        shading: { fill: shade, type: ShadingType.CLEAR },
        margins: { top: 100, bottom: 100, left: 160, right: 160 },
        children: [new Paragraph({
          children: [new TextRun({ text, bold: true, color: textColor, font: "Arial", size: 20 })]
        })]
      })]
    })]
  });
}

function infoBox(text) {
  return callout(text, C.lightBlue, C.navy);
}

// ── Section Header Banner ──────────────────────────────────────
function sectionBanner(number, title, subtitle = "") {
  const rows = [
    new TableRow({
      children: [new TableCell({
        borders: noBorders,
        shading: { fill: C.headerBg, type: ShadingType.CLEAR },
        margins: { top: 120, bottom: 60, left: 200, right: 200 },
        children: [
          new Paragraph({
            children: [new TextRun({ text: number, font: "Arial", size: 18, color: C.gold, bold: true })]
          }),
          new Paragraph({
            children: [new TextRun({ text: title, font: "Arial", size: 36, bold: true, color: C.white })]
          }),
          ...(subtitle ? [new Paragraph({
            children: [new TextRun({ text: subtitle, font: "Arial", size: 20, color: "AAAAAA", italic: true })]
          })] : [])
        ]
      })]
    })
  ];
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [9360],
    rows
  });
}

// ── Form header table ──────────────────────────────────────────
function formHeader(fields) {
  // fields: [{label, value}]
  const rows = fields.map(f => new TableRow({
    children: [
      labelCell(f.label, 2520),
      inputCell(f.value || "", 6840)
    ]
  }));
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [2520, 6840],
    rows
  });
}

// ── Checkbox row ───────────────────────────────────────────────
function checkRow(label, cols = 4) {
  // returns a table row with label + N checkbox columns
  const colW = Math.floor((9360 - 3360) / cols);
  const checkCells = Array.from({ length: cols }, (_, i) =>
    cell("☐", { w: colW, align: AlignmentType.CENTER })
  );
  return new TableRow({
    children: [
      cell(label, { w: 3360, bold: false }),
      ...checkCells
    ]
  });
}

// ── Rating Row ─────────────────────────────────────────────────
function ratingRow(label, scale = 5) {
  const colW = Math.floor((9360 - 4320) / scale);
  const rateCells = Array.from({ length: scale }, (_, i) =>
    cell(`${i + 1}`, { w: colW, align: AlignmentType.CENTER })
  );
  return new TableRow({
    children: [
      cell(label, { w: 4320 }),
      ...rateCells
    ]
  });
}

// ══════════════════════════════════════════════════════════════
// DOCUMENT SECTIONS
// ══════════════════════════════════════════════════════════════

// ── Cover Page ─────────────────────────────────────────────────
function coverPage() {
  return [
    spacer(1440),
    new Table({
      width: { size: 9360, type: WidthType.DXA },
      columnWidths: [9360],
      rows: [new TableRow({
        children: [new TableCell({
          borders: noBorders,
          shading: { fill: C.headerBg, type: ShadingType.CLEAR },
          margins: { top: 400, bottom: 400, left: 400, right: 400 },
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [new TextRun({ text: "WRH", font: "Arial", size: 80, bold: true, color: C.gold })]
            }),
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [new TextRun({ text: "Pilot Operating &", font: "Arial", size: 44, bold: true, color: C.white })]
            }),
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [new TextRun({ text: "Evaluation Package", font: "Arial", size: 44, bold: true, color: C.white })]
            }),
            spacer(200),
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [new TextRun({ text: "Master Document  ·  Phase 1", font: "Arial", size: 24, italic: true, color: "AAAAAA" })]
            }),
          ]
        })]
      })]
    }),
    spacer(400),
    new Table({
      width: { size: 9360, type: WidthType.DXA },
      columnWidths: [4680, 4680],
      rows: [
        new TableRow({ children: [
          labelCell("Document Version", 4680),
          inputCell("1.0 — Draft", 4680)
        ]}),
        new TableRow({ children: [
          labelCell("Prepared By", 4680),
          inputCell("", 4680)
        ]}),
        new TableRow({ children: [
          labelCell("Pilot Site", 4680),
          inputCell("", 4680)
        ]}),
        new TableRow({ children: [
          labelCell("Pilot Start Date", 4680),
          inputCell("", 4680)
        ]}),
        new TableRow({ children: [
          labelCell("Pilot End Date", 4680),
          inputCell("", 4680)
        ]}),
        new TableRow({ children: [
          labelCell("WRH Oversight Contact", 4680),
          inputCell("", 4680)
        ]}),
      ]
    }),
    spacer(400),
    infoBox("PURPOSE: This package contains all forms, logs, and evaluation tools required to run one controlled WRH pilot and measure it honestly. Complete all sections in sequence. Do not skip or defer any form."),
    pageBreak()
  ];
}

// ── Table of Contents ──────────────────────────────────────────
function tocSection() {
  return [
    h1("Table of Contents"),
    new TableOfContents("Table of Contents", {
      hyperlink: true,
      headingStyleRange: "1-3",
    }),
    pageBreak()
  ];
}

// ── How to Use ────────────────────────────────────────────────
function howToUse() {
  return [
    sectionBanner("INTRODUCTION", "How to Use This Package", "Read before beginning the pilot"),
    spacer(),
    h2("Document Purpose"),
    body("This master document contains every form, log, and evaluation tool needed to run one controlled WRH pilot. It is organized in the sequence the pilot actually unfolds — from pre-pilot setup through final revision decisions."),
    body("After the pilot is complete and this document is finalized, each form will be exported as a separate file for field use in future pilots."),
    spacer(),
    h2("Role Assignments"),
    body("Not every person completes every form. Assignments are as follows:"),
    spacer(80),
    new Table({
      width: { size: 9360, type: WidthType.DXA },
      columnWidths: [2520, 3240, 3600],
      rows: [
        new TableRow({ children: [hCell("Role", 2520), hCell("Documents Completed", 3240), hCell("Timing", 3600)] }),
        new TableRow({ children: [
          cell("WRH Facilitator", { w: 2520, bold: true }),
          multiLineCell(["Facilitator Fidelity Self-Check", "Activation Event Log", "Support Bridge Activation Log", "Session Notes (informal)"], { w: 3240 }),
          cell("During and immediately after each session", { w: 3600 })
        ]}),
        new TableRow({ children: [
          cell("Site Coordinator / Administrator", { w: 2520, bold: true, shade: C.rowAlt }),
          multiLineCell(["Session Attendance & Completion Tracker", "Site Performance Summary", "Support Pathway Confirmation"], { shade: C.rowAlt, w: 3240 }),
          cell("Weekly and at pilot close", { w: 3600, shade: C.rowAlt })
        ]}),
        new TableRow({ children: [
          cell("Participants (Self-Report)", { w: 2520, bold: true }),
          multiLineCell(["Participant Feedback Form", "Optional reflection questions"], { w: 3240 }),
          cell("After final session", { w: 3600 })
        ]}),
        new TableRow({ children: [
          cell("WRH Staff / External Reviewer", { w: 2520, bold: true, shade: C.rowAlt }),
          multiLineCell(["Facilitator Fidelity Scoring Sheet", "Unresolved Handoff Review Form", "Final Pilot Report Template", "Pilot Revision Decision Memo"], { shade: C.rowAlt, w: 3240 }),
          cell("During pilot review and at close", { w: 3600, shade: C.rowAlt })
        ]}),
      ]
    }),
    spacer(),
    h2("What This Pilot Measures"),
    body("WRH Phase 1 does not measure clinical outcomes. The honest Phase 1 test answers eight operational questions:"),
    bullet("Was the curriculum delivered as designed?"),
    bullet("Did facilitators stay within their defined scope?"),
    bullet("Did participants engage without disclosure?"),
    bullet("Did activation events occur, and were they handled correctly?"),
    bullet("Did the Support Bridge function as designed?"),
    bullet("Were unresolved handoffs documented and tracked?"),
    bullet("Did the Site Readiness Gate accurately predict site performance?"),
    bullet("What must be revised before this pilot can be expanded?"),
    spacer(),
    callout("CRITICAL STANDARD: If any of these eight questions cannot be answered by the data in this package, the pilot is incomplete. Do not proceed to expansion review until all eight are answered.", C.warnBg, C.warn),
    pageBreak()
  ];
}

// ══════════════════════════════════════════════════════════════
// SECTION 1: Pilot Evaluation Framework
// ══════════════════════════════════════════════════════════════
function section1() {
  return [
    sectionBanner("SECTION 1", "Pilot Evaluation Framework", "Completed by: WRH Staff / External Reviewer"),
    spacer(),
    body("Complete this framework before the pilot begins. It defines success thresholds, establishes the measurement standard, and must be locked prior to session one."),
    spacer(),
    h2("1.1  Pilot Identification"),
    formHeader([
      { label: "Pilot Site Name" },
      { label: "Site Type (e.g., healthcare system, community org)" },
      { label: "Pilot Cohort Size" },
      { label: "Number of Sessions Planned" },
      { label: "Pilot Duration (weeks)" },
      { label: "Framework Completed By" },
      { label: "Framework Locked Date" },
    ]),
    spacer(),
    h2("1.2  Pre-Defined Success Thresholds"),
    body("The following thresholds must be set before the pilot begins and may not be revised after session one starts. Check the box to confirm each threshold is locked."),
    spacer(80),
    new Table({
      width: { size: 9360, type: WidthType.DXA },
      columnWidths: [360, 4680, 2160, 2160],
      rows: [
        new TableRow({ children: [
          hCell("", 360), hCell("Metric", 4680), hCell("Minimum Threshold", 2160), hCell("Actual Result", 2160)
        ]}),
        new TableRow({ children: [
          cell("☐", { w: 360, align: AlignmentType.CENTER }),
          cell("Session Delivery Rate — % of planned sessions completed", { w: 4680 }),
          cell("≥ 85%", { w: 2160, align: AlignmentType.CENTER }),
          blankCell(2160)
        ]}),
        new TableRow({ children: [
          cell("☐", { w: 360, align: AlignmentType.CENTER, shade: C.rowAlt }),
          cell("Facilitator Scope Compliance — % of sessions with no scope breach", { w: 4680, shade: C.rowAlt }),
          cell("100%", { w: 2160, align: AlignmentType.CENTER, shade: C.rowAlt }),
          blankCell(2160)
        ]}),
        new TableRow({ children: [
          cell("☐", { w: 360, align: AlignmentType.CENTER }),
          cell("Activation Event Documentation Rate — % of events with complete logs", { w: 4680 }),
          cell("100%", { w: 2160, align: AlignmentType.CENTER }),
          blankCell(2160)
        ]}),
        new TableRow({ children: [
          cell("☐", { w: 360, align: AlignmentType.CENTER, shade: C.rowAlt }),
          cell("Support Bridge Response Time — % of activations with same-session response confirmation", { w: 4680, shade: C.rowAlt }),
          cell("≥ 90%", { w: 2160, align: AlignmentType.CENTER, shade: C.rowAlt }),
          blankCell(2160)
        ]}),
        new TableRow({ children: [
          cell("☐", { w: 360, align: AlignmentType.CENTER }),
          cell("Participant Feedback Return Rate — % of enrolled completing feedback form", { w: 4680 }),
          cell("≥ 70%", { w: 2160, align: AlignmentType.CENTER }),
          blankCell(2160)
        ]}),
        new TableRow({ children: [
          cell("☐", { w: 360, align: AlignmentType.CENTER, shade: C.rowAlt }),
          cell("Unresolved Handoff Documentation Rate — % of unresolved handoffs with completed review forms", { w: 4680, shade: C.rowAlt }),
          cell("100%", { w: 2160, align: AlignmentType.CENTER, shade: C.rowAlt }),
          blankCell(2160)
        ]}),
      ]
    }),
    spacer(),
    h2("1.3  Pilot Halt Criteria"),
    body("The pilot must be halted immediately if any of the following conditions occur. Document the halt in the Activation Event Log and notify the WRH Oversight Contact within 24 hours."),
    bullet("A facilitator provides clinical advice, mental health diagnosis, or treatment recommendations"),
    bullet("A participant is in acute crisis and the Support Bridge fails to engage within the session"),
    bullet("Site loses its qualified on-site support contact and no replacement is identified within 48 hours"),
    bullet("Cumulative scope breach rate reaches 2 or more sessions in any rolling 4-session window"),
    bullet("Site Coordinator determines the environment is no longer safe to deliver programming"),
    spacer(),
    h2("1.4  Reviewer Sign-Off (Pre-Pilot Lock)"),
    spacer(80),
    new Table({
      width: { size: 9360, type: WidthType.DXA },
      columnWidths: [4680, 4680],
      rows: [
        new TableRow({ children: [labelCell("WRH Reviewer Name", 4680), blankCell(4680)] }),
        new TableRow({ children: [labelCell("Role / Title", 4680), blankCell(4680)] }),
        new TableRow({ children: [labelCell("Signature", 4680), blankCell(4680)] }),
        new TableRow({ children: [labelCell("Date Locked", 4680), blankCell(4680)] }),
      ]
    }),
    pageBreak()
  ];
}

// ══════════════════════════════════════════════════════════════
// SECTION 2: Participant Feedback Form
// ══════════════════════════════════════════════════════════════
function section2() {
  return [
    sectionBanner("SECTION 2", "Participant Feedback Form", "Completed by: Participants (Self-Report)"),
    spacer(),
    infoBox("INSTRUCTIONS TO PARTICIPANT: This form is voluntary and anonymous. Your answers help WRH understand what worked and what should be improved. You do not need to include your name. There are no right or wrong answers."),
    spacer(),
    h2("2.1  Session Information (Pre-Filled by Site Coordinator)"),
    formHeader([
      { label: "Site Name" },
      { label: "Session Number / Date" },
      { label: "Cohort Identifier (no names)" },
    ]),
    spacer(),
    h2("2.2  Engagement & Clarity"),
    body("Circle or check the number that best reflects your experience. 1 = Strongly Disagree  ·  5 = Strongly Agree"),
    spacer(80),
    new Table({
      width: { size: 9360, type: WidthType.DXA },
      columnWidths: [4320, 1008, 1008, 1008, 1008, 1008],
      rows: [
        new TableRow({ children: [hCell("Statement", 4320), hCell("1", 1008), hCell("2", 1008), hCell("3", 1008), hCell("4", 1008), hCell("5", 1008)] }),
        ...([
          "The content of this session was clear and easy to follow.",
          "I felt the session was relevant to my experience.",
          "I understood the purpose of each activity or discussion.",
          "I felt comfortable participating at my own level.",
          "The facilitator presented material in a professional and respectful manner.",
          "I knew what support was available if I needed it.",
        ].map((s, i) => new TableRow({ children: [
          cell(s, { w: 4320, shade: i % 2 === 0 ? C.white : C.rowAlt }),
          cell("☐", { w: 1008, align: AlignmentType.CENTER, shade: i % 2 === 0 ? C.white : C.rowAlt }),
          cell("☐", { w: 1008, align: AlignmentType.CENTER, shade: i % 2 === 0 ? C.white : C.rowAlt }),
          cell("☐", { w: 1008, align: AlignmentType.CENTER, shade: i % 2 === 0 ? C.white : C.rowAlt }),
          cell("☐", { w: 1008, align: AlignmentType.CENTER, shade: i % 2 === 0 ? C.white : C.rowAlt }),
          cell("☐", { w: 1008, align: AlignmentType.CENTER, shade: i % 2 === 0 ? C.white : C.rowAlt }),
        ]}))),
      ]
    }),
    spacer(),
    h2("2.3  Open Response"),
    body("Answer any of the following you feel comfortable addressing. Leave blank any you prefer to skip."),
    spacer(80),
    new Table({
      width: { size: 9360, type: WidthType.DXA },
      columnWidths: [9360],
      rows: [
        new TableRow({ children: [new TableCell({ borders, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [
          new Paragraph({ children: [new TextRun({ text: "What was most useful about this session?", bold: true, font: "Arial", size: 20 })] }),
          spacer(200), spacer(200), spacer(200)
        ]})] }),
        new TableRow({ children: [new TableCell({ borders, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [
          new Paragraph({ children: [new TextRun({ text: "Was there anything that felt unclear, uncomfortable, or out of place?", bold: true, font: "Arial", size: 20 })] }),
          spacer(200), spacer(200), spacer(200)
        ]})] }),
        new TableRow({ children: [new TableCell({ borders, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [
          new Paragraph({ children: [new TextRun({ text: "Is there anything you wish had been handled differently?", bold: true, font: "Arial", size: 20 })] }),
          spacer(200), spacer(200), spacer(200)
        ]})] }),
      ]
    }),
    spacer(),
    h2("2.4  Safety & Support Check"),
    spacer(80),
    new Table({
      width: { size: 9360, type: WidthType.DXA },
      columnWidths: [7200, 1080, 1080],
      rows: [
        new TableRow({ children: [hCell("Question", 7200), hCell("Yes", 1080), hCell("No", 1080)] }),
        new TableRow({ children: [cell("Did anything in this session feel distressing or unsafe?", { w: 7200 }), cell("☐", { w: 1080, align: AlignmentType.CENTER }), cell("☐", { w: 1080, align: AlignmentType.CENTER })] }),
        new TableRow({ children: [cell("If yes, did you feel support was available to you?", { w: 7200, shade: C.rowAlt }), cell("☐", { w: 1080, align: AlignmentType.CENTER, shade: C.rowAlt }), cell("☐", { w: 1080, align: AlignmentType.CENTER, shade: C.rowAlt })] }),
        new TableRow({ children: [cell("Would you attend another WRH session?", { w: 7200 }), cell("☐", { w: 1080, align: AlignmentType.CENTER }), cell("☐", { w: 1080, align: AlignmentType.CENTER })] }),
      ]
    }),
    spacer(),
    body("Any additional comments on safety or support (optional):", { bold: true }),
    new Table({
      width: { size: 9360, type: WidthType.DXA },
      columnWidths: [9360],
      rows: [new TableRow({ children: [new TableCell({ borders, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [spacer(300), spacer(300)] })] })]
    }),
    pageBreak()
  ];
}

// ══════════════════════════════════════════════════════════════
// SECTION 3: Facilitator Fidelity Scoring Sheet
// ══════════════════════════════════════════════════════════════
function section3() {
  return [
    sectionBanner("SECTION 3", "Facilitator Fidelity Scoring Sheet", "Completed by: WRH Staff / External Reviewer"),
    spacer(),
    body("This sheet is completed by a WRH reviewer — not the facilitator. It may be completed via direct observation or recorded session review. One sheet per session observed."),
    spacer(),
    h2("3.1  Session Identification"),
    formHeader([
      { label: "Facilitator Name" },
      { label: "Session Number" },
      { label: "Session Date" },
      { label: "Observer Name" },
      { label: "Observation Method" },
      { label: "Observation Date" },
    ]),
    spacer(),
    h2("3.2  Curriculum Delivery Fidelity"),
    body("Score each item: 2 = Fully Met  ·  1 = Partially Met  ·  0 = Not Met  ·  N/A = Not Applicable this session"),
    spacer(80),
    new Table({
      width: { size: 9360, type: WidthType.DXA },
      columnWidths: [5040, 1080, 1080, 1080, 1080],
      rows: [
        new TableRow({ children: [hCell("Delivery Item", 5040), hCell("2", 1080), hCell("1", 1080), hCell("0", 1080), hCell("N/A", 1080)] }),
        ...([
          "Session opened with framing statement as scripted",
          "Core content presented in designated sequence",
          "Designated discussion prompts used verbatim or close equivalent",
          "Session closed with support pathway reminder",
          "Time boundaries maintained within 10 minutes of plan",
          "Materials used matched approved session guide",
        ].map((s, i) => new TableRow({ children: [
          cell(s, { w: 5040, shade: i % 2 === 0 ? C.white : C.rowAlt }),
          cell("☐", { w: 1080, align: AlignmentType.CENTER, shade: i % 2 === 0 ? C.white : C.rowAlt }),
          cell("☐", { w: 1080, align: AlignmentType.CENTER, shade: i % 2 === 0 ? C.white : C.rowAlt }),
          cell("☐", { w: 1080, align: AlignmentType.CENTER, shade: i % 2 === 0 ? C.white : C.rowAlt }),
          cell("☐", { w: 1080, align: AlignmentType.CENTER, shade: i % 2 === 0 ? C.white : C.rowAlt }),
        ]}))),
      ]
    }),
    spacer(),
    h2("3.3  Scope Compliance"),
    body("This section is binary. Any scope breach is a critical finding regardless of fidelity score above."),
    spacer(80),
    new Table({
      width: { size: 9360, type: WidthType.DXA },
      columnWidths: [6480, 1440, 1440],
      rows: [
        new TableRow({ children: [hCell("Scope Item", 6480), hCell("In Scope", 1440), hCell("BREACH", 1440)] }),
        ...([
          "Facilitator remained within peer education / psychoeducation role",
          "No clinical assessment or diagnostic language used",
          "No treatment recommendations made",
          "No personal disclosures that shifted facilitator to peer/client role",
          "Participant questions outside scope redirected to support pathway",
          "No unsanctioned materials or resources introduced",
        ].map((s, i) => new TableRow({ children: [
          cell(s, { w: 6480, shade: i % 2 === 0 ? C.white : C.rowAlt }),
          cell("☐", { w: 1440, align: AlignmentType.CENTER, shade: i % 2 === 0 ? C.white : C.rowAlt }),
          cell("☐", { w: 1440, align: AlignmentType.CENTER, shade: i % 2 === 0 ? C.warnBg : C.warnBg }),
        ]}))),
      ]
    }),
    spacer(),
    callout("BREACH PROTOCOL: If any BREACH box is checked, complete the Activation Event Log for that session immediately. Notify WRH Oversight Contact within 24 hours. Do not defer."),
    spacer(),
    h2("3.4  Observer Notes"),
    new Table({
      width: { size: 9360, type: WidthType.DXA },
      columnWidths: [9360],
      rows: [
        new TableRow({ children: [new TableCell({ borders, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [
          new Paragraph({ children: [new TextRun({ text: "Delivery strengths observed:", bold: true, font: "Arial", size: 20 })] }),
          spacer(200), spacer(200)
        ]})] }),
        new TableRow({ children: [new TableCell({ borders, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [
          new Paragraph({ children: [new TextRun({ text: "Areas requiring coaching or correction before next session:", bold: true, font: "Arial", size: 20 })] }),
          spacer(200), spacer(200)
        ]})] }),
      ]
    }),
    spacer(),
    h2("3.5  Fidelity Score Summary"),
    spacer(80),
    new Table({
      width: { size: 9360, type: WidthType.DXA },
      columnWidths: [4680, 4680],
      rows: [
        new TableRow({ children: [labelCell("Total Points Possible", 4680), blankCell(4680)] }),
        new TableRow({ children: [labelCell("Total Points Scored", 4680), blankCell(4680)] }),
        new TableRow({ children: [labelCell("Fidelity Percentage", 4680), blankCell(4680)] }),
        new TableRow({ children: [labelCell("Scope Breach Identified?", 4680), blankCell(4680)] }),
        new TableRow({ children: [labelCell("Cleared for Next Session?", 4680), blankCell(4680)] }),
      ]
    }),
    pageBreak()
  ];
}

// ══════════════════════════════════════════════════════════════
// SECTION 4: Session Attendance & Completion Tracker
// ══════════════════════════════════════════════════════════════
function section4() {
  return [
    sectionBanner("SECTION 4", "Session Attendance & Completion Tracker", "Completed by: Site Coordinator / Administrator"),
    spacer(),
    body("Complete one row per session. Participant names are not recorded here. Use anonymized cohort identifiers only. This tracker is submitted to WRH at pilot close."),
    spacer(),
    h2("4.1  Site Information"),
    formHeader([
      { label: "Site Name" },
      { label: "Cohort Identifier" },
      { label: "Total Enrolled" },
      { label: "Total Sessions Planned" },
      { label: "Site Coordinator" },
    ]),
    spacer(),
    h2("4.2  Session-by-Session Log"),
    spacer(80),
    new Table({
      width: { size: 9360, type: WidthType.DXA },
      columnWidths: [720, 1440, 1200, 1200, 1200, 1200, 1200, 1200],
      rows: [
        new TableRow({ children: [
          hCell("#", 720),
          hCell("Date", 1440),
          hCell("Enrolled", 1200),
          hCell("Present", 1200),
          hCell("Completed", 1200),
          hCell("Activation Events", 1200),
          hCell("Support Bridge Used", 1200),
          hCell("Notes", 1200),
        ]}),
        ...[1,2,3,4,5,6,7,8].map((n, i) => new TableRow({ children: [
          cell(`${n}`, { w: 720, align: AlignmentType.CENTER, shade: i % 2 === 0 ? C.white : C.rowAlt }),
          cell("", { w: 1440, shade: i % 2 === 0 ? C.white : C.rowAlt }),
          cell("", { w: 1200, align: AlignmentType.CENTER, shade: i % 2 === 0 ? C.white : C.rowAlt }),
          cell("", { w: 1200, align: AlignmentType.CENTER, shade: i % 2 === 0 ? C.white : C.rowAlt }),
          cell("", { w: 1200, align: AlignmentType.CENTER, shade: i % 2 === 0 ? C.white : C.rowAlt }),
          cell("", { w: 1200, align: AlignmentType.CENTER, shade: i % 2 === 0 ? C.white : C.rowAlt }),
          cell("", { w: 1200, align: AlignmentType.CENTER, shade: i % 2 === 0 ? C.white : C.rowAlt }),
          cell("", { w: 1200, shade: i % 2 === 0 ? C.white : C.rowAlt }),
        ]})
        )
      ]
    }),
    spacer(),
    h2("4.3  Completion Totals"),
    spacer(80),
    new Table({
      width: { size: 9360, type: WidthType.DXA },
      columnWidths: [4680, 4680],
      rows: [
        new TableRow({ children: [labelCell("Total Sessions Completed", 4680), blankCell(4680)] }),
        new TableRow({ children: [labelCell("Session Delivery Rate (%)", 4680), blankCell(4680)] }),
        new TableRow({ children: [labelCell("Average Attendance Per Session", 4680), blankCell(4680)] }),
        new TableRow({ children: [labelCell("Participants Completing All Sessions", 4680), blankCell(4680)] }),
        new TableRow({ children: [labelCell("Participants Completing ≥ 75% of Sessions", 4680), blankCell(4680)] }),
        new TableRow({ children: [labelCell("Total Activation Events (all sessions)", 4680), blankCell(4680)] }),
        new TableRow({ children: [labelCell("Total Support Bridge Activations", 4680), blankCell(4680)] }),
      ]
    }),
    spacer(),
    h2("4.4  Site Coordinator Attestation"),
    body("By signing below, the Site Coordinator confirms that this tracker is accurate and complete to the best of their knowledge."),
    spacer(80),
    new Table({
      width: { size: 9360, type: WidthType.DXA },
      columnWidths: [4680, 4680],
      rows: [
        new TableRow({ children: [labelCell("Name", 4680), blankCell(4680)] }),
        new TableRow({ children: [labelCell("Signature", 4680), blankCell(4680)] }),
        new TableRow({ children: [labelCell("Date", 4680), blankCell(4680)] }),
      ]
    }),
    pageBreak()
  ];
}

// ══════════════════════════════════════════════════════════════
// SECTION 5: Activation Event Log
// ══════════════════════════════════════════════════════════════
function section5() {
  return [
    sectionBanner("SECTION 5", "Activation Event Log", "Completed by: WRH Facilitator (one entry per event)"),
    spacer(),
    callout("DOCUMENTATION STANDARD: Every activation event must be logged within 24 hours of occurrence. 100% documentation is required. Undocumented events are a pilot data failure."),
    spacer(),
    body("An activation event is any moment during a session where a participant's response, behavior, or disclosed content indicates potential distress, risk, or a need for support beyond what WRH programming provides."),
    spacer(),
    h2("5.1  Activation Event Entry"),
    body("Complete a separate copy of this section for each event. If using this master document, duplicate this section for each additional event."),
    spacer(80),

    // Entry A
    new Table({
      width: { size: 9360, type: WidthType.DXA },
      columnWidths: [9360],
      rows: [new TableRow({ children: [new TableCell({
        borders: noBorders,
        shading: { fill: C.headerBg, type: ShadingType.CLEAR },
        margins: { top: 60, bottom: 60, left: 160, right: 160 },
        children: [new Paragraph({ children: [new TextRun({ text: "EVENT ENTRY", bold: true, font: "Arial", size: 22, color: C.gold })] })]
      })] })]
    }),
    spacer(60),
    new Table({
      width: { size: 9360, type: WidthType.DXA },
      columnWidths: [2520, 6840],
      rows: [
        new TableRow({ children: [labelCell("Event Date", 2520), blankCell(6840)] }),
        new TableRow({ children: [labelCell("Session Number", 2520), blankCell(6840)] }),
        new TableRow({ children: [labelCell("Facilitator Name", 2520), blankCell(6840)] }),
        new TableRow({ children: [labelCell("Participant ID (no names)", 2520), blankCell(6840)] }),
        new TableRow({ children: [labelCell("Event Type", 2520), new TableCell({
          borders, width: { size: 6840, type: WidthType.DXA },
          margins: { top: 80, bottom: 80, left: 120, right: 120 },
          children: [new Paragraph({ children: [new TextRun({ text: "☐ Distress disclosure   ☐ Safety concern   ☐ Scope boundary tested   ☐ Support Bridge triggered   ☐ Other: _____________", font: "Arial", size: 20 })] })]
        })] }),
      ]
    }),
    spacer(80),
    new Table({
      width: { size: 9360, type: WidthType.DXA },
      columnWidths: [9360],
      rows: [
        new TableRow({ children: [new TableCell({ borders, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [
          new Paragraph({ children: [new TextRun({ text: "Describe what occurred (behavioral observation only — no clinical interpretation):", bold: true, font: "Arial", size: 20 })] }),
          spacer(240), spacer(240), spacer(240)
        ]})] }),
        new TableRow({ children: [new TableCell({ borders, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [
          new Paragraph({ children: [new TextRun({ text: "What action did the facilitator take in response?", bold: true, font: "Arial", size: 20 })] }),
          spacer(240), spacer(240)
        ]})] }),
        new TableRow({ children: [new TableCell({ borders, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [
          new Paragraph({ children: [new TextRun({ text: "Was the Support Bridge activated?  ☐ Yes   ☐ No   ☐ N/A", bold: true, font: "Arial", size: 20 })] }),
          spacer(80)
        ]})] }),
        new TableRow({ children: [new TableCell({ borders, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [
          new Paragraph({ children: [new TextRun({ text: "Was the event resolved within the session?  ☐ Yes   ☐ No — complete Unresolved Handoff Review Form", bold: true, font: "Arial", size: 20 })] }),
          spacer(80)
        ]})] }),
        new TableRow({ children: [new TableCell({ borders, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [
          new Paragraph({ children: [new TextRun({ text: "Was WRH Oversight Contact notified?  ☐ Yes — Date/Time: _____________   ☐ No — Reason: _____________", bold: true, font: "Arial", size: 20 })] }),
          spacer(80)
        ]})] }),
      ]
    }),
    spacer(),
    new Table({
      width: { size: 9360, type: WidthType.DXA },
      columnWidths: [4680, 4680],
      rows: [
        new TableRow({ children: [labelCell("Facilitator Signature", 4680), blankCell(4680)] }),
        new TableRow({ children: [labelCell("Log Completed Date/Time", 4680), blankCell(4680)] }),
      ]
    }),
    pageBreak()
  ];
}

// ══════════════════════════════════════════════════════════════
// SECTION 6: Support Bridge Activation Log
// ══════════════════════════════════════════════════════════════
function section6() {
  return [
    sectionBanner("SECTION 6", "Support Bridge Activation Log", "Completed by: WRH Facilitator — one entry per activation"),
    spacer(),
    body("The Support Bridge Activation Log documents every instance where a participant was connected to on-site support. It is distinct from the Activation Event Log, which documents the triggering event. This log documents what happened after the bridge was activated."),
    spacer(),
    infoBox("COMPLETENESS REQUIREMENT: An entry in this log must exist for every Support Bridge Activation recorded in the Session Attendance Tracker. If counts do not match at pilot close, the discrepancy must be explained in the Final Pilot Report."),
    spacer(),
    h2("6.1  Bridge Activation Entry"),
    spacer(80),
    new Table({
      width: { size: 9360, type: WidthType.DXA },
      columnWidths: [2520, 6840],
      rows: [
        new TableRow({ children: [labelCell("Activation Date", 2520), blankCell(6840)] }),
        new TableRow({ children: [labelCell("Session Number", 2520), blankCell(6840)] }),
        new TableRow({ children: [labelCell("Facilitator Name", 2520), blankCell(6840)] }),
        new TableRow({ children: [labelCell("Participant ID", 2520), blankCell(6840)] }),
        new TableRow({ children: [labelCell("On-Site Support Contact Name", 2520), blankCell(6840)] }),
        new TableRow({ children: [labelCell("Support Contact Role / Title", 2520), blankCell(6840)] }),
        new TableRow({ children: [labelCell("Time Bridge Activated", 2520), blankCell(6840)] }),
        new TableRow({ children: [labelCell("Time Support Contact Engaged", 2520), blankCell(6840)] }),
      ]
    }),
    spacer(80),
    new Table({
      width: { size: 9360, type: WidthType.DXA },
      columnWidths: [9360],
      rows: [
        new TableRow({ children: [new TableCell({ borders, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [
          new Paragraph({ children: [new TextRun({ text: "Describe how the handoff occurred (no clinical detail — procedural description only):", bold: true, font: "Arial", size: 20 })] }),
          spacer(240), spacer(240)
        ]})] }),
        new TableRow({ children: [new TableCell({ borders, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [
          new Paragraph({ children: [new TextRun({ text: "Was the participant successfully connected to the support contact within the session?  ☐ Yes   ☐ No", bold: true, font: "Arial", size: 20 })] }),
          spacer(80)
        ]})] }),
        new TableRow({ children: [new TableCell({ borders, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [
          new Paragraph({ children: [new TextRun({ text: "If No — describe what occurred and what follow-up is planned:", bold: true, font: "Arial", size: 20 })] }),
          spacer(200), spacer(200)
        ]})] }),
        new TableRow({ children: [new TableCell({ borders, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [
          new Paragraph({ children: [new TextRun({ text: "Was an Unresolved Handoff Review Form completed?  ☐ Yes   ☐ No   ☐ Not applicable", bold: true, font: "Arial", size: 20 })] }),
          spacer(80)
        ]})] }),
        new TableRow({ children: [new TableCell({ borders, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [
          new Paragraph({ children: [new TextRun({ text: "Bridge Function Rating: Did the support bridge work as designed?  ☐ Yes, fully   ☐ Partially — describe:   ☐ No — describe:", bold: true, font: "Arial", size: 20 })] }),
          spacer(200), spacer(200)
        ]})] }),
      ]
    }),
    spacer(),
    new Table({
      width: { size: 9360, type: WidthType.DXA },
      columnWidths: [4680, 4680],
      rows: [
        new TableRow({ children: [labelCell("Facilitator Signature", 4680), blankCell(4680)] }),
        new TableRow({ children: [labelCell("Log Completed Date/Time", 4680), blankCell(4680)] }),
      ]
    }),
    pageBreak()
  ];
}

// ══════════════════════════════════════════════════════════════
// SECTION 7: Unresolved Handoff Review Form
// ══════════════════════════════════════════════════════════════
function section7() {
  return [
    sectionBanner("SECTION 7", "Unresolved Handoff Review Form", "Completed by: WRH Facilitator (initial) + WRH Staff / External Reviewer (review)"),
    spacer(),
    callout("TRIGGER: Complete this form any time a participant activation event was not fully resolved within the session — whether the Support Bridge was activated or not. 100% documentation rate required."),
    spacer(),
    h2("7.1  Initial Report — Completed by Facilitator Within 24 Hours"),
    spacer(80),
    formHeader([
      { label: "Facilitator Name" },
      { label: "Session Number / Date" },
      { label: "Participant ID (no names)" },
      { label: "Corresponding Activation Event Log #" },
    ]),
    spacer(80),
    new Table({
      width: { size: 9360, type: WidthType.DXA },
      columnWidths: [9360],
      rows: [
        new TableRow({ children: [new TableCell({ borders, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [
          new Paragraph({ children: [new TextRun({ text: "Describe why the situation was not resolved within the session:", bold: true, font: "Arial", size: 20 })] }),
          spacer(200), spacer(200), spacer(200)
        ]})] }),
        new TableRow({ children: [new TableCell({ borders, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [
          new Paragraph({ children: [new TextRun({ text: "What steps were taken before the session ended?", bold: true, font: "Arial", size: 20 })] }),
          spacer(200), spacer(200)
        ]})] }),
        new TableRow({ children: [new TableCell({ borders, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [
          new Paragraph({ children: [new TextRun({ text: "What is the planned follow-up? (Who, what, by when?)", bold: true, font: "Arial", size: 20 })] }),
          spacer(200), spacer(200)
        ]})] }),
      ]
    }),
    spacer(80),
    new Table({
      width: { size: 9360, type: WidthType.DXA },
      columnWidths: [4680, 4680],
      rows: [
        new TableRow({ children: [labelCell("Facilitator Signature", 4680), blankCell(4680)] }),
        new TableRow({ children: [labelCell("Submitted to WRH Reviewer Date/Time", 4680), blankCell(4680)] }),
      ]
    }),
    spacer(),
    sectionRule(),
    spacer(),
    h2("7.2  WRH Reviewer Response — Completed Within 48 Hours of Receipt"),
    spacer(80),
    new Table({
      width: { size: 9360, type: WidthType.DXA },
      columnWidths: [9360],
      rows: [
        new TableRow({ children: [new TableCell({ borders, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [
          new Paragraph({ children: [new TextRun({ text: "WRH Reviewer assessment of the facilitator's initial report:", bold: true, font: "Arial", size: 20 })] }),
          spacer(200), spacer(200)
        ]})] }),
        new TableRow({ children: [new TableCell({ borders, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [
          new Paragraph({ children: [new TextRun({ text: "Were the facilitator's in-session actions appropriate given scope?  ☐ Yes   ☐ No — explain:", bold: true, font: "Arial", size: 20 })] }),
          spacer(200), spacer(200)
        ]})] }),
        new TableRow({ children: [new TableCell({ borders, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [
          new Paragraph({ children: [new TextRun({ text: "Does this case require escalation beyond WRH?  ☐ No   ☐ Yes — action taken:", bold: true, font: "Arial", size: 20 })] }),
          spacer(200), spacer(200)
        ]})] }),
        new TableRow({ children: [new TableCell({ borders, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [
          new Paragraph({ children: [new TextRun({ text: "Final resolution status:  ☐ Resolved   ☐ Ongoing — reason:", bold: true, font: "Arial", size: 20 })] }),
          spacer(200), spacer(80)
        ]})] }),
      ]
    }),
    spacer(80),
    new Table({
      width: { size: 9360, type: WidthType.DXA },
      columnWidths: [4680, 4680],
      rows: [
        new TableRow({ children: [labelCell("WRH Reviewer Name", 4680), blankCell(4680)] }),
        new TableRow({ children: [labelCell("Reviewer Signature", 4680), blankCell(4680)] }),
        new TableRow({ children: [labelCell("Review Completed Date", 4680), blankCell(4680)] }),
      ]
    }),
    pageBreak()
  ];
}

// ══════════════════════════════════════════════════════════════
// SECTION 8: Site Performance Summary
// ══════════════════════════════════════════════════════════════
function section8() {
  return [
    sectionBanner("SECTION 8", "Site Performance Summary", "Completed by: Site Coordinator / Administrator at Pilot Close"),
    spacer(),
    body("This summary consolidates the Site Coordinator's direct observation of how the site performed throughout the pilot. It is paired with the Session Attendance Tracker and submitted to WRH for the Final Pilot Report."),
    spacer(),
    h2("8.1  Site Information"),
    formHeader([
      { label: "Site Name" },
      { label: "Site Type" },
      { label: "Site Coordinator Name" },
      { label: "Pilot Date Range" },
    ]),
    spacer(),
    h2("8.2  Site Readiness Gate Accuracy"),
    body("The Site Readiness Gate was completed prior to this pilot. Assess whether that gate accurately predicted site performance."),
    spacer(80),
    new Table({
      width: { size: 9360, type: WidthType.DXA },
      columnWidths: [4680, 1440, 1440, 1440, 1200],
      rows: [
        new TableRow({ children: [hCell("Readiness Gate Criterion", 4680), hCell("Gate Said Ready", 1440), hCell("Performed Well", 1440), hCell("Underperformed", 1440), hCell("N/A", 1200)] }),
        ...([
          "Qualified on-site support contact available each session",
          "Administrative authorization maintained throughout",
          "Space and privacy requirements met each session",
          "Facilitator met training and credential requirements",
          "Emergency/crisis response pathway remained active",
          "Site kept WRH informed of material changes",
        ].map((s, i) => new TableRow({ children: [
          cell(s, { w: 4680, shade: i % 2 === 0 ? C.white : C.rowAlt }),
          cell("☐", { w: 1440, align: AlignmentType.CENTER, shade: i % 2 === 0 ? C.white : C.rowAlt }),
          cell("☐", { w: 1440, align: AlignmentType.CENTER, shade: i % 2 === 0 ? C.white : C.rowAlt }),
          cell("☐", { w: 1440, align: AlignmentType.CENTER, shade: i % 2 === 0 ? C.white : C.rowAlt }),
          cell("☐", { w: 1200, align: AlignmentType.CENTER, shade: i % 2 === 0 ? C.white : C.rowAlt }),
        ]}))),
      ]
    }),
    spacer(),
    h2("8.3  Operational Observations"),
    spacer(80),
    new Table({
      width: { size: 9360, type: WidthType.DXA },
      columnWidths: [9360],
      rows: [
        new TableRow({ children: [new TableCell({ borders, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [
          new Paragraph({ children: [new TextRun({ text: "What operational conditions at this site supported successful delivery?", bold: true, font: "Arial", size: 20 })] }),
          spacer(240), spacer(240)
        ]})] }),
        new TableRow({ children: [new TableCell({ borders, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [
          new Paragraph({ children: [new TextRun({ text: "What operational conditions created barriers or problems?", bold: true, font: "Arial", size: 20 })] }),
          spacer(240), spacer(240)
        ]})] }),
        new TableRow({ children: [new TableCell({ borders, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [
          new Paragraph({ children: [new TextRun({ text: "If this site were to participate in a future cohort, what would need to change?", bold: true, font: "Arial", size: 20 })] }),
          spacer(240), spacer(240)
        ]})] }),
      ]
    }),
    spacer(),
    h2("8.4  Overall Site Readiness Gate Rating"),
    spacer(80),
    new Table({
      width: { size: 9360, type: WidthType.DXA },
      columnWidths: [6480, 2880],
      rows: [
        new TableRow({ children: [hCell("Rating", 6480), hCell("Select", 2880)] }),
        new TableRow({ children: [cell("Gate Accurate — site performed as predicted", { w: 6480 }), cell("☐", { w: 2880, align: AlignmentType.CENTER })] }),
        new TableRow({ children: [cell("Gate Partially Accurate — some gaps not predicted", { w: 6480, shade: C.rowAlt }), cell("☐", { w: 2880, align: AlignmentType.CENTER, shade: C.rowAlt })] }),
        new TableRow({ children: [cell("Gate Inaccurate — significant gaps not predicted", { w: 6480 }), cell("☐", { w: 2880, align: AlignmentType.CENTER })] }),
      ]
    }),
    spacer(80),
    new Table({
      width: { size: 9360, type: WidthType.DXA },
      columnWidths: [4680, 4680],
      rows: [
        new TableRow({ children: [labelCell("Site Coordinator Signature", 4680), blankCell(4680)] }),
        new TableRow({ children: [labelCell("Date Submitted", 4680), blankCell(4680)] }),
      ]
    }),
    pageBreak()
  ];
}

// ══════════════════════════════════════════════════════════════
// SECTION 9: Final Pilot Report Template
// ══════════════════════════════════════════════════════════════
function section9() {
  return [
    sectionBanner("SECTION 9", "Final Pilot Report Template", "Completed by: WRH Staff / External Reviewer"),
    spacer(),
    body("This report is the formal synthesis of all pilot data. It is completed after all forms are collected. It answers the eight Phase 1 evaluation questions and serves as the official record for the pilot."),
    spacer(),
    h2("9.1  Pilot Identification"),
    formHeader([
      { label: "Pilot Site Name" },
      { label: "Pilot Date Range" },
      { label: "Report Prepared By" },
      { label: "Report Date" },
      { label: "WRH Oversight Contact Review" },
    ]),
    spacer(),
    h2("9.2  Data Completeness Check"),
    body("Before writing the report, confirm all forms are received and complete. Do not proceed if any required form is missing."),
    spacer(80),
    new Table({
      width: { size: 9360, type: WidthType.DXA },
      columnWidths: [5040, 1440, 1440, 1440],
      rows: [
        new TableRow({ children: [hCell("Required Form", 5040), hCell("Received", 1440), hCell("Complete", 1440), hCell("Notes", 1440)] }),
        ...([
          "Pilot Evaluation Framework (Section 1)",
          "Participant Feedback Forms — all sessions (Section 2)",
          "Facilitator Fidelity Scoring Sheets — all sessions (Section 3)",
          "Session Attendance & Completion Tracker (Section 4)",
          "Activation Event Logs — all events (Section 5)",
          "Support Bridge Activation Logs — all activations (Section 6)",
          "Unresolved Handoff Review Forms — all unresolved events (Section 7)",
          "Site Performance Summary (Section 8)",
        ].map((s, i) => new TableRow({ children: [
          cell(s, { w: 5040, shade: i % 2 === 0 ? C.white : C.rowAlt }),
          cell("☐", { w: 1440, align: AlignmentType.CENTER, shade: i % 2 === 0 ? C.white : C.rowAlt }),
          cell("☐", { w: 1440, align: AlignmentType.CENTER, shade: i % 2 === 0 ? C.white : C.rowAlt }),
          cell("", { w: 1440, shade: i % 2 === 0 ? C.white : C.rowAlt }),
        ]}))),
      ]
    }),
    spacer(),
    h2("9.3  Eight Phase 1 Evaluation Questions"),
    body("Answer each question using data collected in the pilot. Cite specific metrics where possible."),
    spacer(80),

    ...[
      ["1. Was the curriculum delivered?", "Cite session delivery rate. Reference Facilitator Fidelity Scoring Sheets."],
      ["2. Did facilitators stay in scope?", "Cite fidelity percentage and number of scope breaches. Reference Section 3 findings."],
      ["3. Did participants engage without disclosure?", "Cite Participant Feedback Form results. Note any patterns."],
      ["4. Did activation events occur, and were they handled correctly?", "Cite total activation events. Assess documentation completeness and response appropriateness."],
      ["5. Did the Support Bridge work?", "Cite bridge activation count and success rate. Reference Section 6 logs."],
      ["6. Were unresolved handoffs documented?", "Cite count and documentation rate. Reference Section 7 forms."],
      ["7. Did the Site Readiness Gate accurately predict site performance?", "Reference Site Performance Summary (Section 8). Assess gate accuracy."],
      ["8. What needs revision before expansion?", "Identify specific gaps, protocol failures, or curriculum issues requiring revision."],
    ].flatMap(([q, prompt]) => [
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [9360],
        rows: [
          new TableRow({ children: [new TableCell({
            borders: noBorders,
            shading: { fill: C.lightBlue, type: ShadingType.CLEAR },
            margins: { top: 60, bottom: 60, left: 160, right: 160 },
            children: [new Paragraph({ children: [new TextRun({ text: q, bold: true, font: "Arial", size: 22, color: C.navy })] })]
          })] }),
          new TableRow({ children: [new TableCell({ borders, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [
            new Paragraph({ children: [new TextRun({ text: `Guidance: ${prompt}`, italic: true, font: "Arial", size: 18, color: C.gray })] }),
            spacer(200), spacer(200), spacer(200)
          ]})] }),
        ]
      }),
      spacer(80),
    ]),

    spacer(),
    h2("9.4  Summary Metrics Table"),
    spacer(80),
    new Table({
      width: { size: 9360, type: WidthType.DXA },
      columnWidths: [4680, 2340, 2340],
      rows: [
        new TableRow({ children: [hCell("Metric", 4680), hCell("Threshold", 2340), hCell("Actual", 2340)] }),
        ...([
          ["Session Delivery Rate", "≥ 85%"],
          ["Facilitator Scope Compliance Rate", "100%"],
          ["Activation Event Documentation Rate", "100%"],
          ["Support Bridge Response Rate", "≥ 90%"],
          ["Participant Feedback Return Rate", "≥ 70%"],
          ["Unresolved Handoff Documentation Rate", "100%"],
        ].map(([m, t], i) => new TableRow({ children: [
          cell(m, { w: 4680, shade: i % 2 === 0 ? C.white : C.rowAlt }),
          cell(t, { w: 2340, align: AlignmentType.CENTER, shade: i % 2 === 0 ? C.white : C.rowAlt }),
          cell("", { w: 2340, shade: i % 2 === 0 ? C.white : C.rowAlt }),
        ]}))),
      ]
    }),
    spacer(),
    h2("9.5  Report Sign-Off"),
    spacer(80),
    new Table({
      width: { size: 9360, type: WidthType.DXA },
      columnWidths: [4680, 4680],
      rows: [
        new TableRow({ children: [labelCell("Report Author Name", 4680), blankCell(4680)] }),
        new TableRow({ children: [labelCell("Signature", 4680), blankCell(4680)] }),
        new TableRow({ children: [labelCell("WRH Oversight Contact", 4680), blankCell(4680)] }),
        new TableRow({ children: [labelCell("Oversight Signature", 4680), blankCell(4680)] }),
        new TableRow({ children: [labelCell("Report Date", 4680), blankCell(4680)] }),
      ]
    }),
    pageBreak()
  ];
}

// ══════════════════════════════════════════════════════════════
// SECTION 10: Pilot Revision Decision Memo
// ══════════════════════════════════════════════════════════════
function section10() {
  return [
    sectionBanner("SECTION 10", "Pilot Revision Decision Memo", "Completed by: WRH Staff / External Reviewer — After Final Report"),
    spacer(),
    body("This memo is the official decision document. It is completed after the Final Pilot Report is reviewed. It determines whether WRH moves to expansion, requires revision, or halts."),
    spacer(),
    callout("DECISION STANDARD: Expansion may only be authorized if all six minimum thresholds were met AND no unresolved safety events remain. If either condition is unmet, the only authorized paths are Revision Required or Halt.", C.warnBg, C.warn),
    spacer(),
    h2("10.1  Memo Identification"),
    formHeader([
      { label: "Pilot Site" },
      { label: "Final Report Reference Date" },
      { label: "Memo Prepared By" },
      { label: "Memo Date" },
    ]),
    spacer(),
    h2("10.2  Threshold Review"),
    spacer(80),
    new Table({
      width: { size: 9360, type: WidthType.DXA },
      columnWidths: [4680, 1560, 1560, 1560],
      rows: [
        new TableRow({ children: [hCell("Metric", 4680), hCell("Threshold Met?", 1560), hCell("Actual Result", 1560), hCell("Note", 1560)] }),
        ...([
          "Session Delivery Rate ≥ 85%",
          "Facilitator Scope Compliance 100%",
          "Activation Event Documentation 100%",
          "Support Bridge Response Rate ≥ 90%",
          "Participant Feedback Return Rate ≥ 70%",
          "Unresolved Handoff Documentation 100%",
        ].map((m, i) => new TableRow({ children: [
          cell(m, { w: 4680, shade: i % 2 === 0 ? C.white : C.rowAlt }),
          cell("☐ Yes  ☐ No", { w: 1560, align: AlignmentType.CENTER, shade: i % 2 === 0 ? C.white : C.rowAlt }),
          cell("", { w: 1560, shade: i % 2 === 0 ? C.white : C.rowAlt }),
          cell("", { w: 1560, shade: i % 2 === 0 ? C.white : C.rowAlt }),
        ]}))),
      ]
    }),
    spacer(),
    h2("10.3  Unresolved Safety Events"),
    spacer(80),
    new Table({
      width: { size: 9360, type: WidthType.DXA },
      columnWidths: [6480, 2880],
      rows: [
        new TableRow({ children: [hCell("Safety Check", 6480), hCell("Status", 2880)] }),
        new TableRow({ children: [cell("All unresolved handoffs have been formally closed or escalated", { w: 6480 }), cell("☐ Yes   ☐ No", { w: 2880, align: AlignmentType.CENTER })] }),
        new TableRow({ children: [cell("No open activation events remain without documented resolution", { w: 6480, shade: C.rowAlt }), cell("☐ Yes   ☐ No", { w: 2880, align: AlignmentType.CENTER, shade: C.rowAlt })] }),
        new TableRow({ children: [cell("Pilot was not halted at any point during the cohort", { w: 6480 }), cell("☐ Yes   ☐ No", { w: 2880, align: AlignmentType.CENTER })] }),
      ]
    }),
    spacer(),
    h2("10.4  Revision Items Required"),
    body("List every item that must be revised before the next pilot cohort begins. If no revisions are required, state that explicitly."),
    spacer(80),
    new Table({
      width: { size: 9360, type: WidthType.DXA },
      columnWidths: [720, 4320, 2160, 2160],
      rows: [
        new TableRow({ children: [hCell("#", 720), hCell("Revision Required", 4320), hCell("Owner", 2160), hCell("Due Date", 2160)] }),
        ...[1,2,3,4,5].map((n, i) => new TableRow({ children: [
          cell(`${n}`, { w: 720, align: AlignmentType.CENTER, shade: i % 2 === 0 ? C.white : C.rowAlt }),
          cell("", { w: 4320, shade: i % 2 === 0 ? C.white : C.rowAlt }),
          cell("", { w: 2160, shade: i % 2 === 0 ? C.white : C.rowAlt }),
          cell("", { w: 2160, shade: i % 2 === 0 ? C.white : C.rowAlt }),
        ]}))
      ]
    }),
    spacer(),
    h2("10.5  Decision"),
    spacer(80),
    new Table({
      width: { size: 9360, type: WidthType.DXA },
      columnWidths: [1440, 7920],
      rows: [
        new TableRow({ children: [
          cell("☐", { w: 1440, align: AlignmentType.CENTER, shade: C.lightBlue }),
          new TableCell({ borders, shading: { fill: C.lightBlue, type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [
            new Paragraph({ children: [new TextRun({ text: "AUTHORIZED FOR EXPANSION", bold: true, font: "Arial", size: 22, color: C.navy })] }),
            new Paragraph({ children: [new TextRun({ text: "All thresholds met. No unresolved safety events. Revisions (if any) are minor and may be completed during preparation for the next cohort.", font: "Arial", size: 20 })] }),
          ]})
        ]}),
        new TableRow({ children: [
          cell("☐", { w: 1440, align: AlignmentType.CENTER, shade: C.rowAlt }),
          new TableCell({ borders, shading: { fill: C.rowAlt, type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [
            new Paragraph({ children: [new TextRun({ text: "REVISION REQUIRED BEFORE EXPANSION", bold: true, font: "Arial", size: 22, color: C.steel })] }),
            new Paragraph({ children: [new TextRun({ text: "One or more thresholds were not met, or revisions are significant enough to require a second review before expansion proceeds.", font: "Arial", size: 20 })] }),
          ]})
        ]}),
        new TableRow({ children: [
          cell("☐", { w: 1440, align: AlignmentType.CENTER, shade: C.warnBg }),
          new TableCell({ borders, shading: { fill: C.warnBg, type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [
            new Paragraph({ children: [new TextRun({ text: "HALT", bold: true, font: "Arial", size: 22, color: C.warn })] }),
            new Paragraph({ children: [new TextRun({ text: "Unresolved safety events remain, or the pilot data indicates the program cannot be run safely in its current form. Expansion is not authorized.", font: "Arial", size: 20 })] }),
          ]})
        ]}),
      ]
    }),
    spacer(),
    h2("10.6  Decision Rationale"),
    new Table({
      width: { size: 9360, type: WidthType.DXA },
      columnWidths: [9360],
      rows: [new TableRow({ children: [new TableCell({ borders, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [
        spacer(300), spacer(300), spacer(300), spacer(300)
      ]})] })]
    }),
    spacer(),
    h2("10.7  Authorization Signatures"),
    spacer(80),
    new Table({
      width: { size: 9360, type: WidthType.DXA },
      columnWidths: [4680, 4680],
      rows: [
        new TableRow({ children: [labelCell("Memo Author Name", 4680), blankCell(4680)] }),
        new TableRow({ children: [labelCell("Signature", 4680), blankCell(4680)] }),
        new TableRow({ children: [labelCell("WRH Oversight Contact", 4680), blankCell(4680)] }),
        new TableRow({ children: [labelCell("Oversight Signature", 4680), blankCell(4680)] }),
        new TableRow({ children: [labelCell("Decision Date", 4680), blankCell(4680)] }),
        new TableRow({ children: [labelCell("Next Review / Expansion Target Date", 4680), blankCell(4680)] }),
      ]
    }),
    pageBreak()
  ];
}

// ── Appendix ───────────────────────────────────────────────────
function appendix() {
  return [
    sectionBanner("APPENDIX", "Quick Reference: Roles, Triggers & Contacts", ""),
    spacer(),
    h2("A.1  Form Ownership Summary"),
    spacer(80),
    new Table({
      width: { size: 9360, type: WidthType.DXA },
      columnWidths: [1080, 3960, 2160, 2160],
      rows: [
        new TableRow({ children: [hCell("§", 1080), hCell("Form Name", 3960), hCell("Owner", 2160), hCell("Timing", 2160)] }),
        ...([
          ["1", "Pilot Evaluation Framework", "WRH Staff / Reviewer", "Before pilot starts"],
          ["2", "Participant Feedback Form", "Participants", "After final session"],
          ["3", "Facilitator Fidelity Scoring Sheet", "WRH Staff / Reviewer", "Per session observed"],
          ["4", "Session Attendance & Completion Tracker", "Site Coordinator", "Weekly + pilot close"],
          ["5", "Activation Event Log", "WRH Facilitator", "Within 24 hrs of event"],
          ["6", "Support Bridge Activation Log", "WRH Facilitator", "Within 24 hrs of activation"],
          ["7", "Unresolved Handoff Review Form", "Facilitator + Reviewer", "Within 24–48 hrs"],
          ["8", "Site Performance Summary", "Site Coordinator", "At pilot close"],
          ["9", "Final Pilot Report Template", "WRH Staff / Reviewer", "After all forms received"],
          ["10", "Pilot Revision Decision Memo", "WRH Staff / Reviewer", "After Final Report reviewed"],
        ].map(([n, f, o, t], i) => new TableRow({ children: [
          cell(n, { w: 1080, align: AlignmentType.CENTER, bold: true, shade: i % 2 === 0 ? C.white : C.rowAlt }),
          cell(f, { w: 3960, shade: i % 2 === 0 ? C.white : C.rowAlt }),
          cell(o, { w: 2160, shade: i % 2 === 0 ? C.white : C.rowAlt }),
          cell(t, { w: 2160, shade: i % 2 === 0 ? C.white : C.rowAlt }),
        ]}))),
      ]
    }),
    spacer(),
    h2("A.2  Immediate Escalation Triggers"),
    body("The following require same-day notification of WRH Oversight Contact and documentation in the Activation Event Log:"),
    bullet("Any facilitator scope breach"),
    bullet("Any Support Bridge failure to engage"),
    bullet("Any unresolved activation event at session end"),
    bullet("Any pilot halt condition met"),
    bullet("Site Coordinator departure without replacement"),
    spacer(),
    h2("A.3  Key Contacts"),
    formHeader([
      { label: "WRH Oversight Contact" },
      { label: "Contact Phone / Email" },
      { label: "On-Site Support Contact" },
      { label: "Support Contact Phone / Email" },
      { label: "Backup Support Contact" },
      { label: "Backup Phone / Email" },
    ]),
    spacer(),
    body("This document is version-controlled. Do not alter section numbering, threshold values, or decision criteria without written authorization from WRH oversight.", { italic: true, color: C.gray }),
  ];
}

// ══════════════════════════════════════════════════════════════
// BUILD DOCUMENT
// ══════════════════════════════════════════════════════════════

const doc = new Document({
  numbering: {
    config: [
      {
        reference: "bullets",
        levels: [{
          level: 0, format: LevelFormat.BULLET, text: "\u2022",
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } }
        }]
      },
      {
        reference: "numbers",
        levels: [{
          level: 0, format: LevelFormat.DECIMAL, text: "%1.",
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } }
        }]
      },
    ]
  },
  styles: {
    default: {
      document: { run: { font: "Arial", size: 22 } }
    },
    paragraphStyles: [
      {
        id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 32, bold: true, font: "Arial", color: C.navy },
        paragraph: { spacing: { before: 320, after: 160 }, outlineLevel: 0 }
      },
      {
        id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 26, bold: true, font: "Arial", color: C.steel },
        paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 1 }
      },
      {
        id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 22, bold: true, font: "Arial", color: C.gray },
        paragraph: { spacing: { before: 160, after: 80 }, outlineLevel: 2 }
      },
    ]
  },
  sections: [{
    properties: {
      page: {
        size: { width: 12240, height: 15840 },
        margin: { top: 1080, right: 1080, bottom: 1080, left: 1080 }
      }
    },
    headers: {
      default: new Header({
        children: [new Paragraph({
          border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: C.steel, space: 1 } },
          spacing: { after: 0 },
          tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
          children: [
            new TextRun({ text: "WRH  |  Pilot Operating & Evaluation Package", font: "Arial", size: 16, color: C.gray }),
            new TextRun({ text: "\t", font: "Arial" }),
            new TextRun({ text: "CONFIDENTIAL — Not for distribution", font: "Arial", size: 16, color: C.warn, bold: true }),
          ]
        })]
      })
    },
    footers: {
      default: new Footer({
        children: [new Paragraph({
          border: { top: { style: BorderStyle.SINGLE, size: 4, color: C.steel, space: 1 } },
          spacing: { before: 0 },
          tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
          children: [
            new TextRun({ text: "Master Document — Phase 1", font: "Arial", size: 16, color: C.gray }),
            new TextRun({ text: "\t", font: "Arial" }),
            new TextRun({ text: "Page ", font: "Arial", size: 16, color: C.gray }),
            new PageNumber({ font: "Arial", size: 16, color: C.gray }),
          ]
        })]
      })
    },
    children: [
      ...coverPage(),
      ...howToUse(),
      ...section1(),
      ...section2(),
      ...section3(),
      ...section4(),
      ...section5(),
      ...section6(),
      ...section7(),
      ...section8(),
      ...section9(),
      ...section10(),
      ...appendix(),
    ]
  }]
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync("/mnt/user-data/outputs/WRH_Pilot_Operating_Evaluation_Package_v1.docx", buffer);
  console.log("Done.");
}).catch(console.error);
