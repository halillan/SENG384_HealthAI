# HealthAI Requirements Draft (Unified & Updated)

This document contains all the extracted requirements and UI/UX updates based on the current implementation of HealthAI. You can copy these sections directly into your `SRS_V1_HealthAI_COMPLETE.docx` file.

---

## 3. Functional Requirements (FR)

| ID | Requirement Description | Priority | Source |
| :--- | :--- | :--- | :--- |
| **FR-01** | **Domain Validation:** The system shall strictly enforce .edu / .edu.tr domain verification for both Registration and Login to ensure institutional integrity. | High | AuthGateway.tsx |
| **FR-10** | **Post Initiation:** Doctors or Engineers shall be able to initiate a project post defining clinical/technical needs. | High | Project Brief |
| **FR-11** | **Post Editing:** Authors shall be able to edit their posts after creation. | Medium | Project Brief |
| **FR-12** | **Post Removal:** Authors shall be able to delete their own posts. | High | Project Brief |
| **FR-20** | **Data Restriction:** The system shall prevent users from uploading technical documentation or patient data to the platform directly. | High | Project Brief |
| **FR-60** | **Identity Migration:** Users shall be able to request professional role changes via a formal "Identity Migration Protocol" for admin review. | High | ProfilePage.tsx |
| **FR-61** | **Content Moderation:** Admins shall be able to force-remove inappropriate posts with mandatory logging in the System Audit Trail. | High | AdminDashboard.tsx |
| **FR-62** | **System Audit:** The system shall maintain an unalterable activity log exportable as CSV for GDPR compliance. | Medium | AdminDashboard.tsx |
| **FR-63** | **Secure Collaboration:** The system shall support encrypted messaging and project-bound file sharing (NDA/Datasets). | High | MessagesTab.tsx |
| **FR-64** | **Project Roadmap:** Users shall be able to track collaboration progress via interactive milestones and live progress tracking. | Medium | MessagesTab.tsx |
| **FR-65** | **Identity Verification:** Users shall upload institutional credentials (PDF/JPG) to unlock high-tier platform features (e.g. creating posts). | High | ProfilePage.tsx |
| **FR-66** | **Privacy Controls:** Users shall be able to mask sensitive contact info (Email/Institution) from unverified members of the network. | Medium | ProfilePage.tsx |
| **FR-67** | **Video Conferencing:** The system shall provide an end-to-end encrypted video meeting interface for clinical consultations. | Medium | MessagesTab.tsx |

---

## 5. Non-Functional Requirements (NFR)
### 5.4 Usability
- **High-End Visual Identity:** The system must provide a premium user experience utilizing motion libraries (e.g., Framer Motion) for smooth landing-to-auth scroll transitions and real-time input validation feedback. 
  - **Metric/Target:** UI animations (shakes, transitions) execute at 60 FPS without frame drops, and 100% of form inputs provide real-time visual feedback.

---

## 7. User Interface (UI)
### 7.1 Interface Design Rules
- **Modern Medical SaaS Aesthetic:** The platform utilizes a custom-branded identity with Slate backgrounds and Medical Blue accents to convey trust and technology.
- **Split-Screen Gateway:** The authentication flow uses a 2-column split-screen; left side for AI-generated branding visuals, right side for minimal forms.
- **Shadcn UI & Accessibility:** Strict utilization of Shadcn UI components for WCAG 2.1 accessibility and consistent visual language.
- **Complexity Reduction:** Complex workflows (Post Creation, Identity Migration, Verification) utilize Stepper components and clear multi-step modals to reduce cognitive load.
- **AdminOS Dashboard:** A specialized moderation interface with real-time system metrics, user status management (Active/Suspended), and resource tracking.
- **Collaboration Hub:** A unified messaging interface with integrated project roadmap tracking, asset management panels, and video call overlays.

---

## Appendix B: UI Mockups & Screenshots
- **[Insert Screenshot: Split-Screen Gateway]** - Demonstrating the visual identity and real-time validation.
- **[Insert Screenshot: 3-step Create Post Form]** - Demonstrating the Stepper component and clean UI.
- **[Insert Screenshot: Admin Command Center]** - Demonstrating the moderation and audit logging tools.
- **[Insert Screenshot: Project Roadmap & Messaging Hub]** - Demonstrating the collaboration features.
- **[Insert Screenshot: Professional Identity / Verification Page]** - Demonstrating the credential upload and privacy controls.
