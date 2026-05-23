# 🖥️ HIS Front-End Micro-Frontend (MFE) Ecosystem

Welcome to the **Hospital Information System (HIS) and Electronic Medical Records (EMR)** frontend workspace. This repository features a highly modular, decoupled **Micro-Frontend (MFE)** architecture built on Angular, designed for extreme scalability, independent deployments, and a premium interactive user experience.

---

## 🏛️ Architecture Overview

The frontend is structured around a **Shell & Module** pattern, allowing different clinical modules to run, build, and deploy independently while rendering seamlessly as a unified application for the end user.

```
frontend/
├── his-shell/                   # The primary shell container (orchestrates MFEs)
├── his-shared-lib/              # Shared components, styles, state, and services
├── his-emr-shell/               # EMR specific sub-shell
│
├── Modules (Micro-Frontends):
│   ├── his-patient-mfe/         # Patient Registration & Portal
│   ├── his-lab-mfe/             # Laboratory Management
│   ├── his-pharmacy-mfe/        # Pharmacy & Dispensing Operations
│   ├── his-central-mfe/         # Platform Administration
│   └── emr-*-mfe/               # EMR specialized micro-frontends (Allergies, Vitals, Notes, etc.)
```

---

## 🎨 Design & Aesthetics
Our user interface is designed to provide a premium, modern user experience:
* **Tailored Themes:** Sleek dark-mode and glassmorphic medical control panels utilizing deep blue, mint green, and clean amber accents.
* **Micro-Animations:** Fluid transitions, interactive hover effects, and loading skeleton frames to give the app a responsive and alive feel.
* **Responsiveness:** Adapts dynamically from reception tablets and bedside devices to high-resolution physician workstation monitors.

---

## 🛠️ Getting Started

### Prerequisites
* **Node.js:** v18.x or v20.x
* **Angular CLI:** `npm install -g @angular/cli`

### Installation
Run npm install in each project directory or use a workspace script to restore dependencies globally:
```bash
# Go to shared library and build it first
cd his-shared-lib
npm install
npm run build

# Run your target project, e.g. the Shell
cd ../his-shell
npm install
npm run start
```

### Running Locally
To launch the complete shell and pull micro-frontends dynamically:
1. Start the **Shared Library** build compiler.
2. Start the core **Shell** (`his-shell`) on its designated port.
3. Start the clinical module MFEs on their designated ports.

---

## 🚀 Deployment & CI/CD
Each micro-frontend can be built and deployed independently without affecting the rest of the application:
* Build command: `npm run build --prod`
* Artifact outputs can be hosted in static asset servers (e.g. AWS S3, Nginx, or Azure Blob Storage).
* The Core Shell resolves MFE bundle URIs dynamically at runtime.
