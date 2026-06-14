# WRH Portal Development TODO

## Phase 1: Architecture & Schema
- [x] Design database schema for sessions, arcs, resources, and grants
- [x] Extract and structure 30-session curriculum data from GitHub materials
- [x] Plan tRPC procedures and data models
- [x] Define dark theme color palette and design tokens

## Phase 2: Database & Data
- [x] Create Drizzle schema for sessions, arcs, resources, grants
- [x] Generate and apply database migrations
- [x] Seed 30-session curriculum data
- [x] Seed facilitator resources (Checklist, Glossary, Plan B, Capability Statement)
- [x] Seed grant opportunities data

## Phase 3: Backend (tRPC Procedures)
- [x] Create procedures for fetching all arcs with sessions
- [x] Create procedure for fetching single session with full Tactical Cockpit content
- [x] Create procedures for facilitator resources (checklist, glossary, plan B, capability)
- [x] Create procedures for grant opportunities listing
- [x] Create procedure for program review and suggestions
- [x] Add vitest tests for all procedures

## Phase 4: Frontend Pages
- [x] Build landing page with WRH mission, target populations, and Capitol Contracts branding
- [x] Build curriculum browser page with Arc organization and session listing
- [x] Build session detail page with Tactical Cockpit layout (Anchor, Hook, Mechanism, Mirror, Shift)
- [x] Build facilitator resources page with four resource sections
- [x] Build grant opportunities tracker page with filtering and links
- [x] Build program review and suggestions page
- [x] Build responsive navigation header

## Phase 5: Styling & Theme
- [x] Implement dark theme with high-contrast colors
- [x] Apply tactical, professional aesthetic across all pages
- [x] Ensure responsive design for mobile, tablet, desktop
- [x] Add Capitol Contracts LLC branding throughout
- [x] Test accessibility and contrast ratios

## Phase 6: Testing
- [x] Test all navigation paths and links
- [x] Test session detail page rendering with all Tactical Cockpit segments
- [x] Test responsive design on multiple devices
- [x] Test data loading and error states
- [x] Verify all Arc names and segment labels match specification

## Phase 7: Deployment
- [ ] Create final checkpoint
- [ ] Deploy to production
- [ ] Verify all pages are accessible and functional
