# MediUnify Captain — Module Workflow Documentation & System Specification

==================================================
1. MODULE / APPLICATION NAME
==================================================

* **Exact Application Name:** `MediUnify Captain`
* **Internal Codebase Package Name:** `mediunify-captain` (`v1.0.0`)
* **Portal Classification:** Healthcare Field Logistics & Home Phlebotomy Execution Portal (`Captain Portal`)
* **Platform Architecture:** Hybrid Web & Mobile App (React 19 + Vite 6 Single Page Application wrapped with Expo React Native WebView and Capacitor configurations for Android & iOS mobile environments)

==================================================
2. LOGIN / USER ROLES
==================================================

The module implements two distinct operational fleet captain roles, each with dedicated profile schemas, state machines, operational metrics, and specialized verification workflows:

--------------------------------------------------
Role 1: Pharmacy Fleet Captain (`captainType: 'pharmacy'`)
--------------------------------------------------
* **Default Profile in System:** Arjun Verma (Captain ID: `CAP-PH-8492`)
* **Vehicle / Equipment:** Hero Splendor EV (`KA-09-EA-3829`), Insulated Cold Pouch (`CB-MYS-042`)
* **Credential / Authorization:** Verified Certified Drug Logistics Agent (`DL-KA-2024-91823`)
* **What the Role Can Access:**
  * Prescription drug dispatches assigned from offline retail pharmacy partners (e.g., Apollo Pharmacy, MedPlus, Care Pharmacy).
  * Fulfilling store information, address, itemized medicine manifests, unit quantities, and bill subtotals.
  * Pharmacy counter handover verification screen (`/pharmacy-pickup`) with pre-generated 4-digit Handover OTP.
  * Patient doorstep delivery screen (`/pharmacy-delivery`) with patient SMS OTP validation, Cash on Delivery (COD) cash collection, and doorstep photo capture.
  * Pharmacy Fleet metrics on Home Dashboard, Pharmacy Task Queue, isolated Task History, and Earnings Ledger.
* **Main Responsibilities:**
  * Accept assigned prescription medicine orders from partner pharmacies.
  * Travel to fulfilling retail pharmacies and present 4-digit handover OTPs to pharmacists.
  * Inspect tamper-evident parcel packaging, verify medicine quantities, and capture parcel proof photos.
  * Transport Schedule H/H1 drugs and cold-chain items (e.g., Insulin 2°C–8°C) to patient addresses.
  * Receive patient SMS verification OTP at the doorstep, collect Cash on Delivery (COD) if applicable, capture delivery photo proof, and complete order handover.
* **Pages/Features Available:**
  * Home Dashboard (`/home`) with Pharmacy metrics, active trip lock, and duty toggle (`ONLINE`/`OFFLINE`).
  * Pharmacy Task Queue (`/tasks`) with filtering (`ALL`, `NEW`, `IN PROGRESS`, `DONE`) and search.
  * Task Details (`/tasks/:id`) with medicine bill manifests and step-by-step progress timeline.
  * GPS Navigation Map (`/navigation`) with 2-leg routing (Leg 1: To Pharmacy; Leg 2: To Patient Doorstep).
  * Pharmacy Pickup Handover Screen (`/pharmacy-pickup`).
  * Pharmacy Delivery Handover Screen (`/pharmacy-delivery`).
  * Task History (`/task-history`), Earnings Ledger (`/earnings`), Notifications (`/notifications`), Profile (`/profile`), and Settings (`/settings`).

--------------------------------------------------
Role 2: Diagnostic Lab Fleet Captain (`captainType: 'lab'`)
--------------------------------------------------
* **Default Profile in System:** Dr. Sneha Patil (DMLT) (Captain ID: `CAP-LAB-5104`)
* **Vehicle / Equipment:** Ather 450X (`KA-09-EV-7140`), Temperature-monitored carrier box (`3.6°C`)
* **Credential / Authorization:** Verified Certified NABL Phlebotomist (`MLT-NABL-2023-4410`)
* **What the Role Can Access:**
  * Home diagnostic blood/plasma collection assignments booked by patients or diagnostic centres.
  * Diagnostic package details, sample types, patient fasting status, needle gauge instructions, and required vacutainer tube types (SST Gold, Fluoride Grey, EDTA Lavender, Plain Red).
  * Direct doorstep turn-by-turn navigation map routing to patient residence.
  * Diagnostic Sample Collection screen (`/sample-collection`) with Patient Identity OTP validation, multi-tube checklists, specimen barcode tagging, live camera Barcode Scanner modal, sample count touch stepper, cold-box sensor confirmation, and photo capture.
  * Lab Collection metrics on Home Dashboard, Lab Task Queue, isolated Task History, and Earnings Ledger.
* **Main Responsibilities:**
  * Receive home diagnostic blood/plasma collection assignments booked by patients or clinics.
  * Review test requirements, patient age/fasting state, and required vacutainer tube types.
  * Navigate to patient home addresses via turn-by-turn route maps.
  * Validate patient identity via 4-digit patient OTP.
  * Perform venipuncture according to NABL safety protocols, check off collected tubes, scan/enter specimen barcode tags, confirm specimen counts, verify cold-box storage temperature (2°C–8°C), and capture specimen vial photos.
  * Deliver biological samples to the diagnostic pathology laboratory for analysis.
* **Pages/Features Available:**
  * Home Dashboard (`/home`) with Diagnostic Collection metrics, cold-box sensor status, and duty toggle.
  * Lab Test Queue (`/tasks`) with status filtering and multi-attribute search.
  * Task Details (`/tasks/:id`) with diagnostic specifications and collection timeline.
  * GPS Navigation Map (`/navigation`) with doorstep routing.
  * Diagnostic Sample Collection Screen (`/sample-collection`).
  * Task History (`/task-history`), Earnings Ledger (`/earnings`), Notifications (`/notifications`), Profile (`/profile`), and Settings (`/settings`).

==================================================
3. COMPLETE END-TO-END WORKFLOW
==================================================

Application Launch (Splash Screen)
       ↓
Login / Registration Page (Select Role: Pharmacy Captain OR Lab Captain)
       ↓
Home Dashboard (Duty Status Toggle: ONLINE / OFFLINE)
       ↓
View Assigned Tasks Queue (/tasks) OR View Active Task Highlight (/home)
       ↓
Select Task & Open Task Details (/tasks/:id)
       ↓
Accept Task
       ↓
========================================================================================
BRANCH A: PHARMACY DELIVERY WORKFLOW           BRANCH B: DIAGNOSTIC LAB WORKFLOW
========================================================================================
Start Navigation (Leg 1: To Pharmacy)          Start Navigation (To Patient Address)
       ↓                                              ↓
En Route: Status -> GOING_TO_PHARMACY          En Route: Status -> ON_THE_WAY
       ↓                                              ↓
Arrive at Pharmacy: Status ->                  Arrive at Patient: Status ->
ARRIVED_AT_PHARMACY                            ARRIVED
       ↓                                              ↓
Pharmacy Pickup Screen (/pharmacy-pickup)      Sample Collection Screen (/sample-collection)
       ↓                                              ↓
Step 1: Present 4-Digit Handover OTP           Step 1: Patient Identity Verification
to Pharmacist at Store Counter                 (Enter Patient SMS OTP)
       ↓                                              ↓
Step 2: Inspect Tamper-Evident Seal,           Step 2: Diagnostic Collection Checklist
Check Medicines, Capture Photo Proof           (Check Vacutainer Tubes: SST, EDTA, Fluoride)
       ↓                                              ↓
Confirm Pickup: Status ->                      Step 3: Barcode Tagging (Scan Barcode via
ORDER_PICKED_UP                                Camera Scanner Modal OR Manual Entry)
       ↓                                              ↓
Start Navigation (Leg 2: To Patient)           Step 4: Specimen Count Stepper + Carrier
       ↓                                       Cold-Box Confirmation (3.4°C - 3.6°C)
En Route: Status -> GOING_TO_PATIENT                  ↓
       ↓                                       Step 5: Capture Specimen Photo Proof
Arrive at Patient Doorstep: Status ->                 ↓
ARRIVED_AT_PATIENT                             Confirm Collection: Status ->
       ↓                                       COLLECTED
Pharmacy Delivery Screen (/pharmacy-delivery)         ↓
       ↓                                       Complete Task: Status ->
Step 1: Receive Patient SMS 4-Digit OTP        COMPLETED
and Validate via Doorstep OTP Input                   ↓
       ↓                                       Audio Chime + Confetti Triggered
Step 2: Collect Cash on Delivery (if COD),            ↓
Capture Doorstep Handover Photo Proof          Auto-Add to Completed Task History &
       ↓                                       Increment Daily/Weekly Earnings
Confirm Delivery: Status -> DELIVERED
       ↓
Complete Order: Status -> COMPLETED
========================================================================================
                                       ↓
                             Return to Dashboard (/home)
                                       ↓
                     Review Task History (/task-history)
                                       ↓
                   View Payouts & Ledger (/earnings)

==================================================
4. PAGE-WISE WORKFLOW
==================================================

--------------------------------------------------
Page 1: Splash Screen (`/`)
--------------------------------------------------
* **Purpose:** Initial branding splash screen and auto-authentication router.
* **How user reaches this page:** Default root route upon launching the application.
* **Information displayed:** MediUnify logo, tagline "Healthcare at Your Doorstep", "CAPTAIN APPLICATION" badge, animated pulse ring, version tag (`v2.4`), and loading spinner.
* **Actions/Buttons available:**
  * Auto-redirect timeout (2400ms).
  * `Proceed to Login` button.
* **What happens when performed:** Evaluates `isAuthenticated` in `AuthContext`. If true, navigates to `/home`; if false, navigates to `/login`.
* **Where navigated next:** `/home` or `/login`.
* **Status changes:** None.

--------------------------------------------------
Page 2: Login Page (`/login`)
--------------------------------------------------
* **Purpose:** Fleet role selection and Captain authentication.
* **How user reaches this page:** From Splash screen or after logging out.
* **Information displayed:** MediUnify logo, sign-in header, role selector cards (*Pharmacy Fleet* vs *Lab Test Fleet*), identifier input (email/mobile), password input with visibility toggle, *Remember me* checkbox, and *Forgot Password?* link.
* **Actions/Buttons available:**
  * `Select Fleet Role` buttons (*Pharmacy Fleet* / *Lab Test Fleet*).
  * `Mobile Number / Email` field.
  * `Password` input with `Show/Hide` toggle.
  * `Forgot Password?` link (shows alert confirming password reset OTP dispatched to registered mobile).
  * `Remember me` checkbox toggle.
  * `SIGN IN AS PHARMACY CAPTAIN / LAB CAPTAIN` submit button.
  * `Register as Captain` link.
* **What happens when performed:** Sets `isAuthenticated = true`, records `dutyStatus = 'ONLINE'`, persists profile to `localStorage`, plays audio success chime, and navigates.
* **Where navigated next:** `/home` on success; `/register` via registration link.
* **Status changes:** Duty status set to `ONLINE`.

--------------------------------------------------
Page 3: Registration Page (`/register`)
--------------------------------------------------
* **Purpose:** Digital onboarding form for new fleet captains.
* **How user reaches this page:** Click *Register as Captain* from the Login page.
* **Information displayed:** Onboarding header, Demo Auto-fill buttons (*Fill Pharmacy Captain*, *Fill Lab Test Captain*), multi-field registration form, role selector.
* **Actions/Buttons available:**
  * `Back to Login` link.
  * `Demo Auto-fill` buttons (populates valid mock data for pharmacy or lab captain).
  * Input fields: Full Name, Phone, Email, Password, Confirm Password, Date of Birth, Gender, Full Street Address, City, State, Pincode, ID Document Type dropdown, ID / Registration Number, Fleet Role radio selector.
  * `SUBMIT CAPTAIN APPLICATION` button.
* **What happens when performed:** Validates password matching, creates a new captain ID (`CAP-PH-xxxx` or `CAP-LAB-xxxx`), saves profile into `localStorage`, plays success audio chime, displays success banner, and navigates back to `/login` after 2000ms.
* **Where navigated next:** `/login`.
* **Status changes:** None.

--------------------------------------------------
Page 4: Home Dashboard (`/home`)
--------------------------------------------------
* **Purpose:** Command center displaying real-time duty status, fleet metrics, quick utility shortcuts, active trip prompt, and role-specific safety guidelines.
* **How user reaches this page:** Post-login, via sidebar/bottom nav `Home` link, or upon trip completion.
* **Information displayed:**
  * Captain welcome banner with name, ID, vehicle details, star rating, sector, and duty status indicator.
  * Duty availability pill (`ONLINE` / `OFFLINE`).
  * 4 Quick Utility shortcuts: *Task Queue*, *Earnings*, *History*, *Support SOS Helpline*.
  * 4 Operational KPI Cards:
    * Pharmacy: *Today's Orders*, *Completed*, *Pending*, *Today's Earnings*.
    * Lab: *Today's Collections*, *Collected*, *Pending*, *Today's Earnings*.
  * Active Task In Progress Card (if any order is incomplete): Task ID, Status badge, Cold-chain / Cold-box badge, Trip Fee (₹), Patient details, Phone with Call trigger, Route details, ETA, Distance, and action buttons.
  * Empty State Card (if all tasks completed): Confirmation banner and *Check Task Queue* button.
  * Healthcare Safety Protocol card (Schedule H drug guidelines for pharmacy; NABL venipuncture guidelines for lab).
* **Actions/Buttons available:**
  * `Go Online / Go Offline` toggle button.
  * `Phone Mode / Desktop View` device frame preview switcher.
  * `Call` patient button (launches `tel:` link).
  * `Workflow Steps` button -> opens `/tasks/:id`.
  * `To Pharmacy / To Patient / Start GPS` direct navigation button -> automatically sets travel status and opens `/navigation`.
  * `Support SOS` button (shows 24/7 MediUnify fleet dispatch hotline modal).
* **Where navigated next:** `/tasks/:id`, `/navigation`, `/tasks`, `/earnings`, `/task-history`.
* **Status changes:**
  * Duty toggle switches `dutyStatus` between `ONLINE` and `OFFLINE`.
  * Starting navigation from home updates task status to `GOING_TO_PHARMACY` (pharmacy leg 1) or `ON_THE_WAY` (lab).

--------------------------------------------------
Page 5: My Tasks Page (`/tasks`)
--------------------------------------------------
* **Purpose:** Central list and filter view of all assigned, active, and completed orders.
* **How user reaches this page:** Sidebar/bottom navigation `Tasks` link, or from dashboard shortcut.
* **Information displayed:** Header with role icon and description, search bar, status count filter tabs (`All`, `New`, `In Progress`, `Done`), reset sample tasks button, list of `TaskCard` components.
* **Actions/Buttons available:**
  * Search input: filters by patient name, task ID, medication name, or test package.
  * Filter pills: switches view between `ALL`, `ASSIGNED`, `IN_PROGRESS`, `COMPLETED`.
  * `Reset Sample Tasks` button: reloads default mock tasks and clears local overrides.
  * Card-level buttons on each task:
    * `View Order / View Details` -> opens `/tasks/:id`.
    * `To Pharmacy / To Patient / Navigate` -> opens `/navigation`.
    * `Call` button on patient phone number.
* **Where navigated next:** `/tasks/:id` or `/navigation`.
* **Status changes:** Starting navigation from card sets status to `GOING_TO_PHARMACY`, `GOING_TO_PATIENT`, or `ON_THE_WAY`.

--------------------------------------------------
Page 6: Task Details Page (`/tasks/:id`)
--------------------------------------------------
* **Purpose:** In-depth order view containing patient profile, order contents, step-by-step progress timeline, payout fee, and status transition controls.
* **How user reaches this page:** Clicking any task from Home, Tasks list, BottomNav, or Active Trip banner.
* **Information displayed:**
  * Top navigation back link (or Trip Lock banner if order is in progress).
  * Headline Card: Task ID, type, medicines / test package name, booking reference, scheduled collection/delivery time, captain earning fee.
  * Sticky primary progression action bar.
  * Patient Information Card: name, age, gender, phone number with `Call` button, destination address.
  * Fulfilling Pharmacy Card (Pharmacy role): store name, pickup address, store phone with `Call` button, itemized medicines list with individual quantities, unit prices, total bill, and payment mode (`PREPAID` vs `CASH ON DELIVERY`).
  * Diagnostic Sample Specifications Card (Lab role): test package name, sample type, required vacutainer tubes, special patient instructions (fasting status, needle gauge).
  * Status Timeline (`StatusTimeline` component): visual stepped chain showing completed, active, and pending stages with timestamps.
  * Field Security Verification card: lists reference OTP values.
* **Actions/Buttons available:**
  * Primary Dynamic Progression Action Button (label and target change depending on current status):
    * *Pharmacy:* `ACCEPT PICKUP TASK` -> `START NAVIGATION (TO PHARMACY)` -> `I HAVE ARRIVED AT PHARMACY` -> `VERIFY PHARMACY PICKUP` -> `START DELIVERY (TO PATIENT)` -> `I HAVE ARRIVED AT PATIENT` -> `VERIFY DELIVERY` -> `COMPLETE ORDER`.
    * *Lab:* `ACCEPT TASK` -> `START NAVIGATION (TO PATIENT)` -> `I HAVE ARRIVED AT LOCATION` -> `VERIFY PATIENT & COLLECT SAMPLE` -> `VERIFY SAMPLE LABELS & OTP` -> `COMPLETE TASK`.
  * Route Navigation Map button (`Route Map` / `Patient Route` / `Pharmacy Route`).
  * `Call Patient` and `Call Store` buttons.
* **Where navigated next:** `/navigation`, `/pharmacy-pickup`, `/pharmacy-delivery`, `/sample-collection`.
* **Status changes:** Updates task status across every stage of the lifecycle.

--------------------------------------------------
Page 7: Live GPS Navigation Page (`/navigation`)
--------------------------------------------------
* **Purpose:** Turn-by-turn interactive map interface routing the Captain to the target destination.
* **How user reaches this page:** Clicking navigation buttons from Home, Task Card, Task Details, or BottomNav.
* **Information displayed:**
  * Header showing current navigation leg (Leg 1: To Pharmacy vs Leg 2: To Patient Doorstep).
  * Interactive Leaflet Map with real-time waypoint polyline, custom destination pin, animated captain vehicle marker puck, and pulse rings.
  * Turn-by-turn maneuver banner with icons, distance countdown, and street directions.
  * Trip statistics bar: speed (km/h), distance remaining, ETA (mins), traffic conditions.
  * Destination card: recipient name, full address with `Copy Address` button, contact phone with direct `Call` button.
* **Actions/Buttons available:**
  * `Back to Task Details` link.
  * `Simulate Route / Pause Simulation` button (moves vehicle marker smoothly along waypoints from 0% to 100%).
  * `I HAVE ARRIVED AT DESTINATION` button (triggers arrival modal/callback).
  * `Open in Google Maps` button (external link to `https://www.google.com/maps/search/?api=1&query=...`).
  * `Copy Address` button.
  * `Call Contact` button.
* **Where navigated next:**
  * Pharmacy Leg 1 arrival -> `/pharmacy-pickup?taskId=...`.
  * Pharmacy Leg 2 arrival -> `/pharmacy-delivery?taskId=...`.
  * Lab arrival -> `/sample-collection?taskId=...`.
* **Status changes:**
  * Entering page auto-updates status to `GOING_TO_PHARMACY`, `GOING_TO_PATIENT`, or `ON_THE_WAY`.
  * Clicking arrival updates status to `ARRIVED_AT_PHARMACY`, `ARRIVED_AT_PATIENT`, or `ARRIVED`.

--------------------------------------------------
Page 8: Pharmacy Pickup Page (`/pharmacy-pickup`)
--------------------------------------------------
* **Purpose:** Verification at the retail pharmacy counter before taking custody of medication packages.
* **How user reaches this page:** From Navigation page upon reaching pharmacy, or via Task Details action button.
* **Information displayed:** Pharmacy name, pickup address, task ID, order items checklist, cold chain refrigeration requirement.
* **Multi-step sub-workflow:**
  * **Step 1: OTP Handover (`OTP_VERIFY`):**
    * Displays 4-digit Handover OTP (`GeneratedOTPDisplay`).
    * Explains: *"Give this 4-digit code to the pharmacist at the store counter. The pharmacist enters this code in their terminal to authorize order handover."*
    * Includes countdown validity timer (5:00 min), `Generate New Code` button, and `Copy Code` button.
    * Action button: `PHARMACIST VERIFIED & PACKAGE HANDED OVER`.
  * **Step 2: Package Inspection & Proof Capture (`PROOF`):**
    * Tamper-Evident Safety Seal checkbox.
    * Photo Proof Capture component (`CameraProofCapture` with live camera or presets).
    * Pickup notes / remarks text field.
    * Action button: `CONFIRM PICKUP & PROCEED TO PATIENT`.
  * **Step 3: Pickup Confirmation (`DONE`):**
    * Success check icon, custody confirmation banner, and destination summary.
    * Action button: `START NAVIGATION TO PATIENT`.
* **Where navigated next:** `/navigation?taskId=...&dest=patient`.
* **Status changes:**
  * Step 1 completion -> sets status to `ARRIVED_AT_PHARMACY` with `verifiedPickupOtp`.
  * Step 2 submission -> sets status to `ORDER_PICKED_UP`, stores `pickupProofImage` and `pickupRemarks`.

--------------------------------------------------
Page 9: Pharmacy Delivery Page (`/pharmacy-delivery`)
--------------------------------------------------
* **Purpose:** Doorstep handover verification to the patient, OTP validation, COD reconciliation, and digital proof logging.
* **How user reaches this page:** From Navigation page upon reaching patient address, or via Task Details action button.
* **Information displayed:** Patient name, delivery address, phone number, order ID, payment mode, and total bill amount. Safety warning banner if pharmacy pickup was bypassed.
* **Multi-step sub-workflow:**
  * **Step 1: Doorstep Patient OTP Verification (`OTP_VERIFY`):**
    * Prompts Captain: *"Receive the 4-digit security OTP from the patient (sent via SMS) to verify delivery."*
    * 4-digit segmented input (`OTPInput`) with auto-advance and demo auto-fill button.
    * Action button: `VERIFY OTP & CAPTURE PROOF`.
  * **Step 2: Proof & Payment Collection (`CONFIRMATION`):**
    * Cash Collection checkbox (if COD: confirms cash amount collected).
    * Single Handover Photo Proof capture (`CameraProofCapture`).
    * Delivery remarks text field.
    * Action button: `CONFIRM ORDER DELIVERED`.
  * **Step 3: Delivery Success Celebration (`SUCCESS`):**
    * Success checkmark icon, summary breakdown (Order ID, Patient Name, Completion Time, Trip Payout `+₹160`).
    * Action button: `BACK TO HOME`.
* **Where navigated next:** `/home`.
* **Status changes:**
  * Step 1 validation -> sets status to `ARRIVED_AT_PATIENT` with `verifiedDeliveryOtp`.
  * Step 2 submission -> sets status to `DELIVERED`, stores `deliveryProofImage` and `deliveryRemarks`.
  * Step 3 click -> sets status to `COMPLETED`, adds record to `task_history`, and increments earnings.

--------------------------------------------------
Page 10: Diagnostic Sample Collection Page (`/sample-collection`)
--------------------------------------------------
* **Purpose:** Home phlebotomy execution screen verifying patient identity, collecting biological specimens, scanning barcode tags, confirming cold-box conditions, and logging collection proofs.
* **How user reaches this page:** From Navigation page upon reaching patient location, or via Task Details action button.
* **Information displayed:** Patient confirmation card, booking reference, test name, scheduled time, patient age/gender, and NABL Specimen Protocol badge.
* **Multi-step sub-workflow:**
  * **Stage 1: Patient Identity Verification (`VERIFY`):**
    * Prompt: *"Confirm identity using Patient Security OTP sent to patient phone."*
    * 4-digit segmented `OTPInput` with validation and demo auto-fill helper.
    * Action button: `VERIFY PATIENT & PROCEED TO SAMPLE DRAW`.
  * **Stage 2: Sample Checklist, Barcode & Storage (`COLLECT`):**
    * Vacutainer Tube Checklist: interactive toggle for each tube (e.g., *SST Gel Clot Activator 5ml*, *Fluoride Vacutainer 2ml*, *EDTA Vacutainer 3ml*).
    * Specimen Barcode Tag input with `Scan` button that opens the `BarcodeScannerModal` (supports live camera scanner with WebRTC/BarcodeDetector API, preset barcodes, and file upload).
    * Samples Collected Touch Stepper (`-` and `+` buttons to set count between 1 and 8 tubes).
    * Carrier Cold-Box Status confirmation banner: displays sensor temperature (`3.4°C`).
    * Phlebotomist Remarks textarea.
    * Camera photo proof capture component (`CameraProofCapture`).
    * Action button: `CONFIRM SAMPLE COLLECTION`.
  * **Stage 3: Collection Success Celebration (`SUCCESS`):**
    * Success checkmark, barcode tag confirmation, task ID, and earnings badge (`+₹190`).
    * Action button: `COMPLETE TASK`.
* **Where navigated next:** `/tasks`.
* **Status changes:**
  * Stage 1 validation -> sets status to `ARRIVED`.
  * Stage 2 submission -> sets status to `COLLECTED`, stores `barcode`, `sampleCount`, `proofImage`, and `collectionRemarks`.
  * Stage 3 click -> sets status to `COMPLETED`, moves task to `task_history`, triggers audio complete fanfare, and updates earnings.

--------------------------------------------------
Page 11: Task History Page (`/task-history`)
--------------------------------------------------
* **Purpose:** Archived record of all completed and cancelled orders with drill-down details and proof viewer.
* **How user reaches this page:** Sidebar/bottom navigation `Task History` link, or dashboard shortcut.
* **Information displayed:** Completed orders filtered strictly by the logged-in captain's role (`pharmacy` vs `lab`), search input, status filter buttons (`All Records`, `Completed`, `Cancelled`), task history cards showing task title, patient name, address, completion time, earnings pill, and rating.
* **Actions/Buttons available:**
  * Search input: filters by patient name, ID, or title.
  * Status filter pills: `ALL`, `COMPLETED`, `CANCELLED`.
  * Card click: opens detailed History Modal with full proof image preview, completion timestamp, patient details, and earnings breakdown.
  * Modal `Close` button.
* **Where navigated next:** Stays on page (modal overlay).
* **Status changes:** None (read-only audit ledger).

--------------------------------------------------
Page 12: Earnings & Settlements Page (`/earnings`)
--------------------------------------------------
* **Purpose:** Financial ledger tracking trip commissions, surge incentives, weekly payouts, and transaction history.
* **How user reaches this page:** Sidebar/bottom navigation `Earnings` link, or dashboard shortcut.
* **Information displayed:**
  * 4 Summary Financial Cards:
    * *Today's Earnings* (total ₹, completed tasks count, hours online).
    * *This Week* (total ₹, weekly bonus breakdown).
    * *This Month* (total ₹, total monthly assignments completed).
    * *Total Lifetime Earnings* (cumulative processed earnings).
  * Filter tabs for transaction ledger (`ALL`, `COMPLETED`, `PENDING`).
  * Ledger list showing task ID, service type, patient name, date, payout fee, and settlement status badge.
* **Actions/Buttons available:**
  * Ledger filter tabs (`ALL`, `COMPLETED`, `PENDING`).
* **Where navigated next:** Stays on page.
* **Status changes:** None.

--------------------------------------------------
Page 13: Notifications & Alerts Page (`/notifications`)
--------------------------------------------------
* **Purpose:** Message center for operational alerts, dispatch notifications, cold chain warnings, and payout credits.
* **How user reaches this page:** Header bell icon, sidebar/bottom navigation `Notifications` link.
* **Information displayed:** List of role-filtered alerts (`task`, `alert`, `earnings`, `payment`), timestamp, unread indicator dots, and message bodies.
* **Actions/Buttons available:**
  * `Mark All as Read` button.
  * `Clear All` button.
  * Filter pills: `All`, `Unread`, `Tasks`, `Payouts & Bonuses`.
  * Individual notification row click: calls `markAsRead(id)`.
* **Where navigated next:** Stays on page.
* **Status changes:** Marks notification item state as read/unread in `localStorage`.

--------------------------------------------------
Page 14: Captain Profile Page (`/profile`)
--------------------------------------------------
* **Purpose:** Displays captain identity, vehicle details, professional credentials, ratings, and editable personal details.
* **How user reaches this page:** Header profile avatar, sidebar/bottom navigation `Profile` link.
* **Information displayed:**
  * Profile header with avatar, name, fleet role badge, captain ID, joined date.
  * Performance stat cards: Star rating (★ `4.95`) and Completed Trips count.
  * Professional Verification Badge:
    * Pharmacy: *Drug Distribution & Courier Logistics Authorization* (Ref: `DL-KA-2024-91823`), vehicle details, cold bag ID (`CB-MYS-042`).
    * Lab: *NABL Certified Phlebotomist Credential* (Ref: `MLT-NABL-2023-4410`), cold-box sensor temp (`3.6°C`), biohazard kit inspection status.
  * Personal & Contact Information form (Full Name, Phone Number, Email, Street Address, City, Vehicle Model & Plate).
* **Actions/Buttons available:**
  * `Edit Profile / Cancel` button (toggles form between read-only and edit mode).
  * Form inputs in edit mode: Full Name, Phone, Email, Address, City, Vehicle.
  * `SAVE PROFILE CHANGES` submit button.
  * `Update Photo` camera button on avatar (shows simulated photo update alert).
  * `Log Out` button (opens logout confirmation modal).
* **Where navigated next:** Stays on page; navigates to `/login` if logged out.
* **Status changes:** Saves updated profile fields to `localStorage`.

--------------------------------------------------
Page 15: Settings Page (`/settings`)
--------------------------------------------------
* **Purpose:** Operations preferences, display layout controls, security settings, and legal disclosures.
* **How user reaches this page:** Sidebar navigation `Settings` link.
* **Information displayed:**
  * Section 1: Captain Preferences (*Captain Profile & Documents* link; *Device Presentation Frame* toggle).
  * Section 2: Security & Support (*Change Password* row; *Fleet Help & Emergency Dispatch Support* row; *Terms & Healthcare Privacy Policy* row).
  * Section 3: *Logout Session* card.
* **Actions/Buttons available:**
  * Navigation link to `/profile`.
  * `Toggle Frame` button (switches between responsive browser view and smartphone hardware frame preview).
  * `Change Password` click -> opens Change Password modal (Current Password, New Password, Confirm Password, `UPDATE PASSWORD` button).
  * `Fleet Help & Support` click -> opens 24/7 Operations Command Center modal with phone helpline, cold-chain emergency contact, and simulated WhatsApp chat link.
  * `Terms & Privacy Policy` click -> opens regulatory compliance modal detailing HIPAA/DISHA compliance and cold-chain transport regulations.
  * `Logout Session` button -> opens `ConfirmationModal`.
* **Where navigated next:** Modal overlays; `/login` on confirmed logout.
* **Status changes:** None.

==================================================
5. FORM / DATA FLOW
==================================================

--------------------------------------------------
Form 1: Captain Sign In Form (`Login.jsx`)
--------------------------------------------------
* **Fields Captured:**
  * `captainType`: Radio/button selector (`pharmacy` | `lab`) [Required]
  * `identifier`: Mobile number or email string [Required]
  * `password`: Password string [Required]
  * `rememberMe`: Boolean checkbox [Optional]
* **Submit Action:** Calls `login(captainType, credentials)` via `AuthContext`.
* **Where Submitted Information Goes:** Written to browser `localStorage` under keys `mediunify_auth`, `mediunify_captain_type`, and `mediunify_duty_status`.
* **What Happens After Submission:** Authenticates session, sets duty status to `ONLINE`, plays success chime, and navigates to `/home`.
* **Which Other Role/Application Uses It:** Session states are read across all pages and route guards.

--------------------------------------------------
Form 2: Captain Registration Form (`Register.jsx`)
--------------------------------------------------
* **Fields Captured:**
  * `name`: Full Name [Required]
  * `phone`: 10-digit mobile number [Required]
  * `email`: Email address [Required]
  * `password` & `confirmPassword`: Passwords [Required]
  * `dob`: Date of birth string [Required]
  * `gender`: `Male` | `Female` | `Other` [Required]
  * `address`: Street address [Required]
  * `city`, `state`, `pincode`: Location strings [Required]
  * `idType`: Identification type dropdown [Required]
  * `idNumber`: Official license / ID number [Required]
  * `captainType`: `pharmacy` | `lab` [Required]
* **Submit Action:** Validates matching passwords; calls `register(formData)` in `AuthContext`.
* **Where Submitted Information Goes:** Stored in `localStorage` under `mediunify_profile_${captainType}`.
* **What Happens After Submission:** Generates unique ID (`CAP-PH-xxxx` or `CAP-LAB-xxxx`), shows success banner, and redirects to `/login`.
* **Which Other Role/Application Uses It:** Profile data populates headers, profile screens, and duty badges.

--------------------------------------------------
Form 3: Pharmacy Pickup Counter Handover Form (`PharmacyPickup.jsx`)
--------------------------------------------------
* **Fields Captured:**
  * `pharmacyOtp`: 4-digit code presented to pharmacist [Pre-generated/Required]
  * `tamperCheck`: Boolean confirmation of tamper-evident package seal [Required]
  * `proofImage`: Base64 image captured via camera or selected from presets [Optional/Recommended]
  * `remarks`: Text string of captain inspection notes [Optional]
* **Submit Action:** Calls `updateTaskStatus(taskId, 'ORDER_PICKED_UP', { pickupProofImage, pickupRemarks })`.
* **Where Submitted Information Goes:** Updated in active task object within `TaskContext` and persisted to `localStorage` (`mediunify_pharmacy_tasks`).
* **What Happens After Submission:** Advances status to `ORDER_PICKED_UP` and authorizes departure to patient address.
* **Which Other Role/Application Uses It:** Pharmacist verifies handover; delivery stage checks for verified pickup before allowing doorstep drop.

--------------------------------------------------
Form 4: Pharmacy Delivery Doorstep Handover Form (`PharmacyDelivery.jsx`)
--------------------------------------------------
* **Fields Captured:**
  * `deliveryOtp`: 4-digit security code received from patient [Required]
  * `paymentCollected`: Boolean confirming cash collected for COD orders [Required if COD]
  * `proofImage`: Single doorstep delivery photo proof [Optional/Recommended]
  * `remarks`: Handover notes string [Optional]
* **Submit Action:** Calls `updateTaskStatus(taskId, 'DELIVERED', { deliveryProofImage, paymentCollected, deliveryRemarks })`, then `updateTaskStatus(taskId, 'COMPLETED')`.
* **Where Submitted Information Goes:** Task object updated to `COMPLETED`; appended to `mediunify_task_history` in `localStorage`; earnings incremented.
* **What Happens After Submission:** Unlocks trip lock, logs completion time, triggers completion fanfare chime, and navigates back to `/home`.
* **Which Other Role/Application Uses It:** Audit history and financial settlement ledger.

--------------------------------------------------
Form 5: Diagnostic Sample Collection Form (`SampleCollection.jsx`)
--------------------------------------------------
* **Fields Captured:**
  * `otp`: 4-digit patient security code received from patient [Required]
  * `tubesChecked`: Key-value object marking each vacutainer tube collected (`tube_sst_1`, `tube_fbs_1`, etc.) [Required]
  * `barcodeInput`: Alphanumeric specimen barcode tag [Required]
  * `sampleCount`: Number of tubes collected (stepper 1–8) [Required]
  * `proofImage`: Base64 photograph of barcoded vials [Optional/Recommended]
  * `remarks`: Phlebotomist venipuncture and patient fasting observation notes [Optional]
* **Submit Action:** Calls `updateTaskStatus(taskId, 'COLLECTED', { proofImage, sampleCount, barcode, collectionRemarks })`, then `updateTaskStatus(taskId, 'COMPLETED')`.
* **Where Submitted Information Goes:** Persisted to `localStorage` (`mediunify_lab_tasks` & `mediunify_task_history`); earnings incremented.
* **What Happens After Submission:** Completes assignment, releases active trip lock, triggers audio chime, and navigates back to `/tasks`.
* **Which Other Role/Application Uses It:** Laboratory receiving counter / pathology accessioning department for specimen intake.

--------------------------------------------------
Form 6: Captain Profile Edit Form (`Profile.jsx`)
--------------------------------------------------
* **Fields Captured:**
  * `name`: Full Name [Required]
  * `phone`: Phone number [Required]
  * `email`: Email address [Required]
  * `address`: Street address [Required]
  * `city`: City name [Required]
  * `vehicle`: Vehicle model and registration plate [Required]
* **Submit Action:** Calls `updateProfile(formData)` via `AuthContext`.
* **Where Submitted Information Goes:** Saved to `mediunify_profile_${captainType}` in `localStorage`.
* **What Happens After Submission:** Refreshes header, sidebar, profile views, and displays success banner.
* **Which Other Role/Application Uses It:** Displayed on patient and pharmacy interfaces as assigned driver identity.

--------------------------------------------------
Form 7: Change Password Modal Form (`Settings.jsx`)
--------------------------------------------------
* **Fields Captured:**
  * `currentPassword`: String [Required]
  * `newPassword`: String [Required]
  * `confirmPassword`: String [Required]
* **Submit Action:** Form submit handler inside `SettingsPage`.
* **Where Submitted Information Goes:** Validates password matching client-side; shows confirmation alert/modal.
* **What Happens After Submission:** Resets modal fields and displays confirmation banner.
* **Which Other Role/Application Uses It:** Client-side only.

==================================================
6. STATUS FLOW
==================================================

--------------------------------------------------
1. Pharmacy Delivery Order Status Lifecycle
--------------------------------------------------

ASSIGNED
   ↓ (Captain reviews assignment in /tasks or /tasks/:id and accepts)
ACCEPTED
   ↓ (Captain clicks 'Start Navigation' or 'Workflow Steps')
GOING_TO_PHARMACY
   ↓ (Captain arrives at retail pharmacy store)
ARRIVED_AT_PHARMACY
   ↓ (Pharmacist validates Captain's handover OTP; Captain inspects sealed package)
ORDER_PICKED_UP
   ↓ (Captain starts navigation to patient delivery address)
GOING_TO_PATIENT
   ↓ (Captain arrives at patient doorstep)
ARRIVED_AT_PATIENT
   ↓ (Patient provides SMS OTP; Captain collects COD cash & takes delivery photo)
DELIVERED
   ↓ (Captain taps 'Complete Order')
COMPLETED

* **Detailed Pharmacy Status Breakdown:**

* `Status: ASSIGNED`
  → How created: Initial task assignment from pharmacy store.
  → Who changes it: Pharmacy Captain.
  → Action causing change: Clicks *Accept Pickup Task* or starts GPS navigation.
  → Next status: `ACCEPTED` or `GOING_TO_PHARMACY`.
  → Who can see it: Pharmacy Captain.

* `Status: ACCEPTED`
  → How created: Captain acknowledges dispatch.
  → Who changes it: Pharmacy Captain.
  → Action causing change: Clicks *Start Navigation (To Pharmacy)*.
  → Next status: `GOING_TO_PHARMACY`.
  → Who can see it: Pharmacy Captain.

* `Status: GOING_TO_PHARMACY`
  → How created: Captain departs for retail pharmacy store.
  → Who changes it: Pharmacy Captain.
  → Action causing change: Clicks *I Have Arrived At Pharmacy* or GPS arrival.
  → Next status: `ARRIVED_AT_PHARMACY`.
  → Who can see it: Pharmacy Captain.

* `Status: ARRIVED_AT_PHARMACY`
  → How created: Captain reaches store counter.
  → Who changes it: Pharmacy Captain.
  → Action causing change: Presents OTP, inspects tamper seal, and submits pickup form.
  → Next status: `ORDER_PICKED_UP`.
  → Who can see it: Pharmacy Captain.

* `Status: ORDER_PICKED_UP`
  → How created: Package verified & handed over at counter.
  → Who changes it: Pharmacy Captain.
  → Action causing change: Clicks *Start Navigation to Patient*.
  → Next status: `GOING_TO_PATIENT`.
  → Who can see it: Pharmacy Captain.

* `Status: GOING_TO_PATIENT`
  → How created: Captain departs pharmacy towards patient.
  → Who changes it: Pharmacy Captain.
  → Action causing change: Clicks *I Have Arrived At Patient* or GPS arrival.
  → Next status: `ARRIVED_AT_PATIENT`.
  → Who can see it: Pharmacy Captain.

* `Status: ARRIVED_AT_PATIENT`
  → How created: Captain reaches patient doorstep.
  → Who changes it: Pharmacy Captain.
  → Action causing change: Enters patient SMS OTP, collects payment, and submits delivery form.
  → Next status: `DELIVERED`.
  → Who can see it: Pharmacy Captain.

* `Status: DELIVERED`
  → How created: Doorstep verification and proof photo completed.
  → Who changes it: Pharmacy Captain.
  → Action causing change: Clicks *Complete Order / Back to Home*.
  → Next status: `COMPLETED`.
  → Who can see it: Pharmacy Captain.

* `Status: COMPLETED`
  → How created: Final order closure.
  → Who changes it: Terminal state.
  → Next status: Moves to History.
  → Who can see it: Pharmacy Captain (in Task History and Earnings).

--------------------------------------------------
2. Diagnostic Phlebotomy Lab Status Lifecycle
--------------------------------------------------

ASSIGNED
   ↓ (Captain reviews diagnostic booking in /tasks or /tasks/:id and accepts)
ACCEPTED
   ↓ (Captain clicks 'Start Navigation')
ON_THE_WAY
   ↓ (Captain arrives at patient residence)
ARRIVED
   ↓ (Patient OTP validated, vacutainer tubes filled, barcode scanned, cold-box confirmed)
COLLECTED
   ↓ (Optional intermediate quality verification in Task Details)
VERIFIED
   ↓ (Captain completes task)
COMPLETED

* **Detailed Lab Status Breakdown:**

* `Status: ASSIGNED`
  → How created: Initial home phlebotomy booking assigned.
  → Who changes it: Lab Captain.
  → Action causing change: Clicks *Accept Task* or starts GPS navigation.
  → Next status: `ACCEPTED` or `ON_THE_WAY`.
  → Who can see it: Lab Captain.

* `Status: ACCEPTED`
  → How created: Captain acknowledges booking.
  → Who changes it: Lab Captain.
  → Action causing change: Clicks *Start Navigation (To Patient)*.
  → Next status: `ON_THE_WAY`.
  → Who can see it: Lab Captain.

* `Status: ON_THE_WAY`
  → How created: Captain departs for patient address.
  → Who changes it: Lab Captain.
  → Action causing change: Clicks *I Have Arrived* on GPS Map or Details.
  → Next status: `ARRIVED`.
  → Who can see it: Lab Captain.

* `Status: ARRIVED`
  → How created: Captain reaches patient residence.
  → Who changes it: Lab Captain.
  → Action causing change: Validates patient OTP, checks tubes, scans barcode tag.
  → Next status: `COLLECTED`.
  → Who can see it: Lab Captain.

* `Status: COLLECTED`
  → How created: Specimen collection complete & stored in cold box.
  → Who changes it: Lab Captain.
  → Action causing change: Clicks verification step in Task Details or Complete button.
  → Next status: `VERIFIED` or `COMPLETED`.
  → Who can see it: Lab Captain.

* `Status: VERIFIED`
  → How created: Specimen labeling and NABL protocol verified.
  → Who changes it: Lab Captain.
  → Action causing change: Clicks *Complete Task* button.
  → Next status: `COMPLETED`.
  → Who can see it: Lab Captain.

* `Status: COMPLETED`
  → How created: Final task closure.
  → Who changes it: Terminal state.
  → Next status: Moves to History.
  → Who can see it: Lab Captain (in Task History and Earnings).

--------------------------------------------------
3. Operational & Duty Statuses
--------------------------------------------------
* `ONLINE`: Captain is available for assignments. Green indicator; dispatches enabled.
* `OFFLINE`: Captain session paused. Grey indicator; dispatches disabled.
* `activeOrder` (Trip Lock): Active lock engaged whenever an order is in progress (`ASSIGNED` < status < `COMPLETED`). Restricts navigation to active trip screens until delivery/collection is finished.
* `CANCELLED`: Terminal state recorded in Task History when an order is aborted (e.g., patient collected from clinic directly); cancellation compensation fee recorded.

==================================================
7. CROSS-APPLICATION / CROSS-ROLE FLOW
==================================================

1. Patient (MediUnify Patient App)
   → Submits medicine delivery or diagnostic lab booking request.
   → Fulfilling Pharmacy / Laboratory receives request.
   → Order is prepared and dispatched.
   → Captain Application receives assignment notification.
   → Captain accepts assignment.

2. Pharmacy Counter Handover Flow:
   Captain
   → Arrives at partner pharmacy store.
   → Presents 4-digit Handover OTP (`task.pharmacyOtp`).
   → Pharmacist verifies OTP in pharmacy system and hands over sealed package.
   → Captain inspects tamper-evident seal and confirms pickup.
   → Status updated to `ORDER_PICKED_UP`.

3. Patient Doorstep Handover Flow:
   Captain
   → Navigates to patient address.
   → Requests 4-digit SMS OTP from patient (`task.deliveryOtp`).
   → Patient provides OTP code.
   → Captain enters OTP into app and confirms COD cash collection (if applicable).
   → Captain captures doorstep photo proof.
   → Status updated to `DELIVERED` and `COMPLETED`.
   → Patient receives delivery confirmation; Captain's earnings are credited.

4. Phlebotomy Specimen Intake Flow:
   Captain
   → Validates patient identity via SMS OTP (`task.otp`).
   → Collects blood/plasma samples and applies barcode tag (`MED-BC-904812`).
   → Confirms cold-box carrier temperature (2°C–8°C).
   → Transports specimen to central pathology laboratory for diagnostic accessioning.

==================================================
8. NOTIFICATIONS
==================================================

* **Notification 1:**
  → Trigger: New pharmacy delivery dispatch assigned.
  → Sender / Source: MediUnify Dispatch Engine.
  → Receiver: Pharmacy Fleet Captain (`captainType: 'pharmacy'`).
  → Message: *"New Pharmacy Delivery Assigned — Order PH-30510 ready at Apollo Pharmacy Gokulam for Rohan Nambiar."*
  → When it appears: On initial task assignment in the task feed.

* **Notification 2:**
  → Trigger: Cold-chain medicine handling alert.
  → Sender / Source: Drug Safety Protocol Engine.
  → Receiver: Pharmacy Fleet Captain (`captainType: 'pharmacy'`).
  → Message: *"Cold-Chain Insulin Dispatch Alert — Order PH-30511 contains Insulin Glargine. Maintain coolbox between 2°C - 8°C."*
  → When it appears: Immediately upon assignment of orders with refrigerated pharmaceuticals.

* **Notification 3:**
  → Trigger: Diagnostic home phlebotomy assignment.
  → Sender / Source: Diagnostic Laboratory Engine.
  → Receiver: Lab Fleet Captain (`captainType: 'lab'`).
  → Message: *"New Phlebotomy Sample Collection — Task LAB-20101 assigned: Rajeshwari Kulkarni for Fasting Glucose & Lipid Profile."*
  → When it appears: On initial lab booking assignment.

* **Notification 4:**
  → Trigger: Daily performance milestone achieved.
  → Sender / Source: Incentive & Rewards Engine.
  → Receiver: All Captains (`all`).
  → Message: *"Daily Performance Incentive Milestone! — Congratulations! You earned ₹150 bonus for completing 4 on-time dispatches."*
  → When it appears: After completing required shift dispatch quota.

* **Notification 5:**
  → Trigger: Weekly settlement payout disbursement.
  → Sender / Source: Financial Settlements Service.
  → Receiver: All Captains (`all`).
  → Message: *"Weekly Payout Processed — ₹5,280 credited to your Bank account (A/c ending in 4108)."*
  → When it appears: Upon weekly settlement batch processing.

==================================================
9. SEARCH / FILTER / MANAGEMENT FEATURES
==================================================

* **Task Search (`/tasks`):**
  Real-time string matching across Patient Name, Task ID, Medication Name, and Diagnostic Test Name.
* **Task Status Filtering (`/tasks`):**
  Status tabs: `ALL`, `ASSIGNED` (*New*), `IN_PROGRESS` (*In Progress*), `COMPLETED` (*Done*).
* **History Search (`/task-history`):**
  Case-insensitive search across past Patient Names, Order IDs, and Package Titles.
* **History Status Filter (`/task-history`):**
  Status tabs: `ALL`, `COMPLETED`, `CANCELLED`.
* **Ledger Filter (`/earnings`):**
  Transaction status tabs: `ALL`, `COMPLETED`, `PENDING`.
* **Notifications Filter (`/notifications`):**
  Category tabs: `ALL`, `UNREAD`, `TASKS`, `PAYOUTS & BONUSES`.
* **Reset Sample Tasks (`/tasks`, Sidebar):**
  Restores default initial tasks from `mockData.js` and resets browser `localStorage`.
* **Role Isolation Filter (`TaskHistory`, `Notifications`):**
  Filters history and notifications based on active role (`pharmacy` vs `lab`).
* **Profile Edit & Save (`/profile`):**
  Toggles edit mode; updates name, phone, email, address, vehicle plate; saves to `localStorage`.
* **Duty Toggle (Header, `/home`):**
  Switches availability between `ONLINE` and `OFFLINE` (blocked if active order is in progress).
* **Device Presentation Switcher (Top Banner, Header, `/settings`):**
  Toggles between responsive browser view and smartphone hardware shell.
* **Direct Phone Dialer (Home, Task Cards, Details, Map):**
  Click-to-call links triggering `tel:` protocol for patient or pharmacy contacts.
* **Turn-by-Turn GPS Simulation (`/navigation`):**
  Interactive route playback controls with progressive vehicle puck movement, ETA countdown, and speed tracking.
* **Live Camera Barcode Scanner (`/sample-collection`):**
  WebRTC camera viewfinder with native `BarcodeDetector` API, flash torch, camera switcher, presets, and audio beep.
* **Photo Proof Capture (Pickup, Delivery, Collection):**
  Live camera capture with GPS coordinates and date/time watermark banner.
* **Touch Stepper (`/sample-collection`):**
  Touch-friendly increment/decrement control for specimen tube counts (1–8).

==================================================
10. COMPLETE USER JOURNEY
==================================================

* **Actor:** Captain Arjun Verma (Pharmacy Delivery Captain)
  → **Action:** Signs into MediUnify Captain application as *Pharmacy Captain*.
  → **System:** Sets status to `ONLINE`, loads dashboard, and highlights active assignment `#PH-30510` for patient Rohan Nambiar.
  → **Actor:** Clicks `Workflow Steps`, reviews order, and taps `ACCEPT PICKUP TASK` followed by `START NAVIGATION (TO PHARMACY)`.
  → **System:** Status changes to `GOING_TO_PHARMACY`, engages **Trip Lock**, and launches GPS Navigation routing to Apollo Pharmacy Gokulam.
  → **Actor:** Arrives at pharmacy and taps `I HAVE ARRIVED AT PHARMACY`.
  → **System:** Status updates to `ARRIVED_AT_PHARMACY` and opens the Pharmacy Pickup screen.
  → **Actor:** Presents 4-digit code `4921` to pharmacist.
  → **Next Actor:** Pharmacist at store counter verifies code and releases medicine parcel.
  → **Actor:** Inspects tamper seal, snaps parcel photo, and taps `CONFIRM PICKUP & PROCEED TO PATIENT`.
  → **System:** Status advances to `ORDER_PICKED_UP` and starts GPS route navigation to patient's address at Brigade Symphony.
  → **Actor:** Arrives at patient address and taps `I HAVE ARRIVED AT PATIENT`.
  → **System:** Status updates to `ARRIVED_AT_PATIENT` and opens the Pharmacy Delivery screen.
  → **Next Actor:** Patient Rohan Nambiar provides the 4-digit SMS OTP `6385`.
  → **Actor:** Enters OTP into verification keypad, confirms prepaid status, captures doorstep photo, and taps `CONFIRM ORDER DELIVERED`.
  → **System:** Status transitions to `DELIVERED`, then `COMPLETED`. Plays completion fanfare, logs `₹160` payout to daily earnings, appends order to Task History, and releases Trip Lock.

==================================================
11. CURRENT IMPLEMENTATION GAPS
==================================================

*The following items represent features visible or referenced in the code that are simulated, incomplete, or rely on client-side mocks:*

1. **Standalone SignaturePad Not Integrated:**
   A full digital canvas signature component exists at `src/components/verification/SignaturePad.jsx`, but is not imported or used in `/pharmacy-delivery` or `/sample-collection`. The delivery workflow explicitly notes: *"Capture a single photo of the parcel handed over to the patient to complete this delivery. Digital signature is not required."*
2. **Client-Side Mock Data & LocalStorage Persistence Only:**
   The application operates entirely on client-side React Context (`TaskContext`, `AuthContext`, `NotificationContext`) backed by browser `localStorage`. There is no active REST/GraphQL API or WebSocket connection to a live remote dispatch server.
3. **Simulated OTP Generation & Verification:**
   OTP values (`pharmacyOtp`, `deliveryOtp`, `otp`) are pre-populated strings in `mockData.js`. The SMS delivery mechanism is simulated, and OTP input components contain demo auto-fill shortcuts.
4. **Static External Helper Links:**
   * *Forgot Password?* on the login screen displays a JavaScript `alert()` confirming that a reset OTP was dispatched, rather than navigating to a dedicated reset screen.
   * *Support SOS Helpline* opens a modal with static support phone numbers rather than an integrated in-app VoIP or ticket dispatch system.
   * *Camera Update on Profile Avatar* triggers a simulated browser alert (`"Photo update dialog simulated: Camera/Gallery upload"`) rather than opening a file selector.
5. **Simulated Turn-by-Turn GPS Navigation:**
   Route coordinates are fixed waypoints within Mysuru, Karnataka (`[12.3082, 76.6542]` to `[12.2980, 76.6385]`). GPS tracking is simulated via a timer loop rather than streaming live device geolocation from `navigator.geolocation.watchPosition()`.
6. **Settings Modal Forms are Client-Side Stubs:**
   The *Change Password* modal inside Settings validates inputs client-side and resets form fields without modifying the stored authentication password.
7. **Task Cancellation Workflow Not Actionable by Captain:**
   While `CANCELLED` status exists in `StatusBadge.jsx`, `mockData.js`, and `TaskHistory.jsx`, there is no button or flow allowing the Captain to cancel an active task in `TaskDetails.jsx`.

==================================================
12. FINAL WORKFLOW SUMMARY
==================================================

The **MediUnify Captain** module is an enterprise-grade field operations application designed for dual-role healthcare fulfillment: **Pharmacy Prescription Delivery** and **Diagnostic Phlebotomy Sample Collection**. Upon authenticating into a designated fleet role, the Captain manages their active shift through a real-time command dashboard featuring automated route locking, GPS turn-by-turn navigation, and role-specific verification gates. Pharmacy deliveries follow a verified two-leg chain: counter handover via Captain OTP, tamper-seal photo inspection, doorstep patient SMS OTP validation, COD cash collection, and electronic proof of delivery. Diagnostic phlebotomy tasks execute an ISO/NABL-compliant workflow: patient identity verification, multi-vacutainer tube checklists, live camera specimen barcode scanning, carrier cold-box temperature validation (2°C–8°C), and biological vial proof capture. Completed assignments automatically feed into an immutable audit history ledger, dynamically calculating driver earnings and performance incentives.
