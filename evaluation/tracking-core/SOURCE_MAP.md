# WRH Pilot Operating & Evaluation Package — Source Map

**Program Administrator:** Capitol Contracts LLC  
**Program:** What Really Happened™ (WRH)  
**Repository:** `daniel-lingar/WRH-PILOT-OPERATING---EVALUATION`  

---

## Purpose

This source map explains how the WRH Pilot Operating & Evaluation Package connects to the larger WRH system.

This repository is the **pilot evidence layer**. It does not replace the curriculum source and it does not replace the public deployment portal. It exists to run a controlled pilot, document what happens, measure implementation honestly, and identify required revisions before WRH scales.

---

## Three-Repo Architecture

```text
wrh-master-curriculum
        ↓
What-Really-Happened
        ↓
WRH-PILOT-OPERATING---EVALUATION
```

---

## Repository Roles

| Repository | Role | Use |
| :--- | :--- | :--- |
| `daniel-lingar/wrh-master-curriculum` | Raw curriculum source | Source text, session architecture, facilitator materials, Part I-IV curriculum logic |
| `daniel-lingar/What-Really-Happened` | Live public deployment portal | Public-facing explanation of WRH, curriculum navigation, operations, risk governance, and source map |
| `daniel-lingar/WRH-PILOT-OPERATING---EVALUATION` | Pilot operations and evidence layer | Pre-registered pilot framework, field forms, support bridge logs, site review, final report, and revision decision memo |

---

## Relationship to the Curriculum Source

The pilot package does not contain the full WRH curriculum.

The curriculum source remains in:

```text
daniel-lingar/wrh-master-curriculum
```

That repository contains the raw instructional material, session structure, operational toolkit, and source documentation.

This pilot package measures whether selected WRH materials can be delivered safely and consistently at an approved site.

---

## Relationship to the Live WRH Portal

The public WRH deployment portal remains in:

```text
daniel-lingar/What-Really-Happened
```

That portal explains:

- what WRH is
- how the curriculum is structured
- how operations are organized
- how risk governance controls deployment
- how the pilot package connects to the larger system

The portal should link to this pilot package from:

- `risk-governance.html`
- `operations.html`
- `source-map.html`

---

## Relationship to Risk Governance

Risk Governance answers the deployment-control question:

> **Is the site ready to run WRH?**

The pilot package answers the evaluation question:

> **What happened when WRH was run at the site?**

The two layers work together.

A site should not enter a WRH pilot unless the Site Readiness Gate has confirmed that the agency has:

- a named support lead
- a backup support lead
- an escalation procedure
- a participant refusal procedure
- a participant departure procedure
- a documentation chain
- a follow-up owner
- authority to activate the agency crisis pathway when required

---

## Relationship to the Closed-Loop Support Bridge

The Closed-Loop Support Bridge is the safety pathway used when participant activation requires support beyond normal curriculum delivery.

The pilot package documents this bridge through:

- `02_Field_Forms/Activation_Event_Log.md`
- `02_Field_Forms/Support_Bridge_Activation_Log.md`
- `02_Field_Forms/Unresolved_Handoff_Review_Form.md`

The core rule is:

> A referral is not a connection. A connection is a connection.

The bridge is not complete until the participant is connected, stabilized, transferred to the agency pathway, emergency procedure is activated, or the unresolved status is documented and escalated according to agency policy.

---

## Pilot Evidence Chain

The pilot package follows this evidence chain:

```text
01_Pilot_Framework/Pilot_Evaluation_Framework.md
        ↓
02_Field_Forms/Participant_Feedback_Form.md
02_Field_Forms/Facilitator_Fidelity_Scoring_Sheet.md
02_Field_Forms/Session_Attendance_Completion_Tracker.md
02_Field_Forms/Activation_Event_Log.md
02_Field_Forms/Support_Bridge_Activation_Log.md
02_Field_Forms/Unresolved_Handoff_Review_Form.md
        ↓
03_Site_Review/Site_Performance_Summary.md
03_Site_Review/Final_Pilot_Report_Template.md
        ↓
04_Revision_Decisions/Pilot_Revision_Decision_Memo.md
```

---

## Package Zones

### Zone 1 — Pilot Framework

Defines the evaluation rules before the pilot begins.

Primary file:

- `01_Pilot_Framework/Pilot_Evaluation_Framework.md`

### Zone 2 — Field Forms

Captures what happens during live delivery.

Primary files:

- `02_Field_Forms/Participant_Feedback_Form.md`
- `02_Field_Forms/Facilitator_Fidelity_Scoring_Sheet.md`
- `02_Field_Forms/Session_Attendance_Completion_Tracker.md`
- `02_Field_Forms/Activation_Event_Log.md`
- `02_Field_Forms/Support_Bridge_Activation_Log.md`
- `02_Field_Forms/Unresolved_Handoff_Review_Form.md`

### Zone 3 — Site Review

Aggregates field data into site-level operational findings.

Primary files:

- `03_Site_Review/Site_Performance_Summary.md`
- `03_Site_Review/Final_Pilot_Report_Template.md`

### Zone 4 — Revision Decisions

Determines what must happen before continuation or expansion.

Primary file:

- `04_Revision_Decisions/Pilot_Revision_Decision_Memo.md`

---

## What This Package Measures

This package measures:

- whether WRH was delivered as designed
- whether facilitators stayed inside non-clinical scope
- whether participants engaged without required trauma disclosure
- whether activation events were documented
- whether the Closed-Loop Support Bridge functioned
- whether unresolved handoffs were identified and reviewed
- whether the site readiness gate accurately predicted site performance
- what must change before continuation or expansion

---

## What This Package Does Not Measure

This package does not measure or claim:

- PTSD treatment
- complex PTSD treatment
- suicide prevention outcomes
- addiction treatment outcomes
- clinical symptom reduction
- therapeutic effectiveness
- replacement of licensed clinical care

---

## Core Standard

**A pilot is not a performance. A pilot is a stress test.**

The purpose of this package is to find out whether WRH can run safely once, measure honestly, and improve before it scales.

---

## Public Links

WRH Pilot Operating & Evaluation Portal:

https://daniel-lingar.github.io/WRH-PILOT-OPERATING---EVALUATION/

WRH Pilot Repository:

https://github.com/daniel-lingar/WRH-PILOT-OPERATING---EVALUATION

WRH Live Deployment Portal:

https://daniel-lingar.github.io/What-Really-Happened/

WRH Master Curriculum Source:

https://github.com/daniel-lingar/wrh-master-curriculum
