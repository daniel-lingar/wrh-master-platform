# Security & Data Privacy Posture

This document outlines the security posture, data privacy model, and vulnerability reporting process for the WRH Master Platform.

WRH is designed for use in institutional, correctional, reentry, veteran-support, diversion, and peer-support environments where privacy, local control, and data minimization are essential.

---

## Data Privacy Posture

The WRH platform follows a **privacy-by-design** and **data-minimization** model.

The platform is designed so that pilot evaluation and engagement tracking can be performed without collecting unnecessary personal information from participants.

---

## Zero-PII / Zero-PHI Design Goal

The WRH evaluation tools are designed to avoid the collection, storage, or transmission of Protected Health Information, Personally Identifiable Information, or clinical treatment records.

The platform should not collect:

- Participant names
- Social Security numbers
- Dates of birth
- Medical record numbers
- Diagnosis information
- Treatment notes
- Case narratives
- Addresses
- Phone numbers
- Personal email addresses
- Health insurance information

Participant tracking, when needed, should be handled through anonymized identifiers, locally generated UUIDs, or institution-managed case identifiers controlled by the host organization.

The WRH platform itself should only capture non-identifying implementation data such as:

- Session completion
- Module progress
- Aggregate attendance counts
- Milestone completion
- Engagement timestamps
- Non-identifying pilot metrics

---

## Local-First Storage Architecture

WRH evaluation tooling is designed to support local-first deployment.

Depending on institutional requirements, evaluation data may be stored using local browser storage, local files, intranet-hosted storage, or a secure internal endpoint controlled by the host organization.

The platform does not require an external commercial cloud database for basic pilot operation.

Any networked or cloud-connected implementation should be reviewed and approved by the host organization’s security, compliance, or IT authority before deployment.

---

## Compliance Alignment

WRH is designed to minimize compliance risk by avoiding unnecessary collection of sensitive participant data.

However, final compliance obligations depend on the host institution, deployment environment, data configuration, and applicable law or policy.

Institutions should review WRH deployment against their own requirements, including but not limited to:

- HIPAA
- FERPA
- CJIS
- State correctional data policies
- Internal security rules
- Procurement data requirements
- Records-retention policies
- Local privacy laws

WRH is intended to integrate into existing institutional compliance frameworks without creating unnecessary new data exposure.

---

## Application Security

WRH utility tooling and evaluation scripts should follow standard application-security practices.

Expected safeguards include:

- Dependency review and routine package auditing
- Input sanitization
- Avoidance of unnecessary external scripts
- Local-first data handling where possible
- Least-privilege access design
- Institution-controlled access protections
- Restricted administrative views
- No public posting of pilot participant data
- No hardcoded passwords, secrets, API keys, or credentials

---

## Facilitator Access Control

Facilitator or administrator access should be controlled by the host institution.

Recommended controls include:

- Password-protected directories
- Institution-managed accounts
- Internal network restriction
- Device-level security
- Role-based access where available
- Secure storage of exported evaluation files
- No use of shared public devices for administrative review

---

## Vulnerability Reporting

If you discover a security vulnerability in WRH utility tooling, deployment logic, or evaluation scripts, please report it responsibly.

Do not open a public GitHub issue for security vulnerabilities.

Report vulnerabilities directly to:

**Capitol Contracts LLC**  
**Email:** bret_lingar@outlook.com  
**Subject Line:** WRH Security Vulnerability

We will review the report and respond as soon as reasonably possible.

---

## Operational Security for Facilitators

Institutional administrators should ensure that facilitators follow the host facility’s physical and digital security policies.

This includes secure handling of devices, printed materials, participant worksheets, exported pilot metrics, and any institution-managed identifiers used during implementation.

WRH materials should not be used to collect clinical disclosures, medical histories, criminal histories, or personal trauma narratives unless the host institution has separately authorized and secured that process.
