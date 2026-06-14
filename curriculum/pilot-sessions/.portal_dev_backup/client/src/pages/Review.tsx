import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { Streamdown } from "streamdown";

const reviewContent = `# WRH Program Review & Suggestions

## Executive Summary

The What Really Happened (WRH) Pilot Deployment Package is a robust 30-session psychoeducational program designed for high-risk adult populations, particularly veterans and justice-involved individuals. The program demonstrates significant strengths in its instructional design and operational readiness. Several key areas for improvement exist, particularly concerning formal evaluation, comprehensive participant materials, and explicit facilitator training protocols.

## Strengths of the WRH Program

### Structured and Consistent Instructional Design

The program is meticulously organized into 30 sessions across three arcs ("The Machine," "The Drivers," and "The Interrupt & Restore"), each following a "Tactical Cockpit" layout. This consistent structure ensures predictable and repeatable delivery across facilitators and settings.

### Non-Exposure Psychoeducational Model

A significant strength is the program's commitment to a non-exposure model, which teaches participants about the mechanisms of trauma and stress responses without requiring them to recount personal traumatic experiences. This approach is crucial for safety, particularly in high-risk populations.

### Focus on Executive Function Restoration

Arc 3, "The Interrupt & Restore," directly addresses executive function challenges such as missed appointments, avoidant cycles, and shutdown responses. This focus is highly relevant for reentry and workforce readiness programs.

### Operational Readiness and Deployment Utility

The package is designed for "federal-grade environments" and addresses practical implementation challenges such as staff turnover and mixed-acuity groups. The inclusion of a "Facilitator Readiness Checklist" and comprehensive navigation tools underscores its operational focus.

### Unique "Systems Language" and Glossary

The program employs a distinct "systems language" (e.g., "The Hum," "The Pattern Veto," "The Ledger") that translates complex psychological concepts into understandable, operational terms. The provided glossary ensures consistency in terminology.

### Participant Safety Protocols

Explicit "Yellow Light" and "Red Light" safety protocols, along with a "Standardized Grounding Script" and the "Plan B Wallet Card," demonstrate a strong commitment to participant well-being and crisis management.

## Areas for Improvement

### 1. Formal Program Evaluation and Outcome Measurement

**Current State:** The program includes basic session-level observation notes but lacks a comprehensive evaluation framework.

**Recommendation:** Develop a robust evaluation plan that includes:
- Pre- and post-assessments for participants
- Validated measurement tools for key outcomes (executive function, self-regulation, avoidant behavior reduction)
- Fidelity monitoring to ensure consistent delivery
- Outcome tracking aligned with federal reporting requirements

**Impact:** This is critical for securing significant grant funding and demonstrating program effectiveness to institutional partners.

### 2. Comprehensive Participant Materials and Workbook

**Current State:** Beyond the "Plan B Wallet Card," there are limited take-home materials for participants.

**Recommendation:** Create a structured participant workbook that includes:
- Session summaries and key takeaways
- Space for personal reflection and notes
- Exercises for practicing the "tools" introduced in each session
- A glossary of terms
- Resources for ongoing support

**Impact:** Participants will have tangible resources for learning reinforcement and skill practice outside the session environment.

### 3. Explicit Facilitator Training and Certification Program

**Current State:** The "Facilitator Readiness Checklist" is valuable for session preparation but lacks a formal training and certification program.

**Recommendation:** Develop a comprehensive facilitator training curriculum that covers:
- Program philosophy and theoretical foundation
- Session delivery mechanics and the Tactical Cockpit structure
- Crisis intervention (Yellow/Red Light protocols)
- Ethical considerations and boundaries
- Fidelity monitoring and quality assurance
- Implement a certification process with observed practice and ongoing supervision

**Impact:** Ensures consistent, high-quality delivery and supports program scaling.

### 4. Translation of "Systems Language" for External Stakeholders

**Current State:** The program's unique terminology may pose a barrier to external stakeholders unfamiliar with the WRH approach.

**Recommendation:** Develop a "Funder-Friendly" Glossary or Crosswalk Document that:
- Translates key WRH terms into conventional, evidence-based terminology
- Explains how WRH concepts align with established psychological and behavioral health constructs
- Demonstrates alignment with recognized evidence-based practices (EBPs)

**Impact:** Improves communication with grant reviewers, institutional partners, and policymakers.

### 5. Integration of Evidence-Based Practices (EBPs)

**Current State:** While the program's mechanisms align with trauma-informed care principles, explicit linkage to recognized EBPs is limited.

**Recommendation:** Conduct a literature review to explicitly map WRH components to established EBPs in:
- Trauma recovery and recovery-oriented care
- Executive function training and cognitive-behavioral strategies
- Behavioral change and habit formation
- Provide an evidence-based rationale for the program's design

**Impact:** Strengthens the program's appeal to funders and institutional partners who prioritize evidence-based approaches.

## Strategic Recommendations

1. **Prioritize Evaluation Design:** Immediately begin developing a comprehensive evaluation plan with clear, measurable outcomes and validated assessment tools. This is the single most critical step for securing significant grant funding.

2. **Develop a Participant Workbook:** Create a structured workbook to accompany the 30 sessions, providing participants with tangible resources for learning reinforcement and skill practice.

3. **Formalize Facilitator Training:** Establish a clear training curriculum and certification process for WRH facilitators to ensure program fidelity and quality control as the program scales.

4. **Create a "Funder-Friendly" Communication Strategy:** Develop materials that translate the program's unique "systems language" into conventional, evidence-based terminology for external stakeholders.

5. **Proactively Engage with Funders:** For foundations like Bob Woodruff, leverage their feedback processes. For federal grants, attend webinars and engage with program officers where possible to clarify requirements and demonstrate alignment.

## Conclusion

The WRH Pilot Deployment Package represents a well-designed, operationally ready program with significant potential for impact. By addressing the areas outlined above, Capitol Contracts LLC can substantially enhance the program's appeal to funders and its overall impact on target populations.
`;

export default function Review() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      {/* Navigation */}
      <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Button onClick={() => navigate("/")} variant="ghost" className="text-amber-500">
            ← Back to Home
          </Button>
          <div className="text-xl font-bold text-amber-500">Program Review</div>
          <div />
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="prose prose-invert max-w-none">
          <Streamdown>{reviewContent}</Streamdown>
        </div>
      </div>
    </div>
  );
}
