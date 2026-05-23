# 🏛️ Hospital Information System (HIS) & Electronic Medical Records (EMR)

Welcome to the unified master repository of the **HIS & EMR Platform**. This enterprise-grade health operations system is built on a highly modular and modern software architecture, separating frontend user experiences and backend business logic for high performance, dynamic multi-tenancy, and medical record portability.

---

## 📁 Repository Directory Structure

The repository is structured logically to simplify operations, development, and independent micro-frontend or micro-host deployment pipelines:

```
ShenawyTryHIS/ (Root)
├── 📂 docs/                     # 📄 Complete architectural blueprints and documentation
│   └── HIS_BACKEND_COMPLETE_ARCHITECTURE_V2.md   # Master V2 Architectural Roadmap
│
├── 📂 frontend/                 # 🖥️ Angular Micro-Frontend (MFE) ecosystem
│   ├── his-shell/               # Core shell dashboard orchestrator
│   ├── his-shared-lib/          # Shared clinical widgets, styles, and core services
│   └── (Micro-frontends)        # Dedicated MFEs: patient, lab, pharmacy, vital, EMR, etc.
│
├── 📂 backend/                  # ⚙️ .NET 8 Hybrid Multi-Tenant Modular Monolith
│   ├── gateway/                 # YARP gateway proxy routing
│   ├── identity/                # Authentication, Token Signings, Tenant Provisions
│   ├── shared/                  # TenantAwareDbContext and custom middlewares
│   └── modules/                 # Decoupled Class Libraries and Lightweight Hosts
│
├── 📄 docker-compose.yml        # Multi-container local orchestration manifest
└── 📄 README.md                 # This master ecosystem guide
```

---

## 🧭 Navigating the Workspace

Detailed sub-system documentation and instructions are available in their respective directories:

* 🖥️ **[Front-End Ecosystem Guide](file:///e:/HealthOperations_Anti/frontend/README.md):** Learn how the Angular Micro-Frontends (MFEs) communicate, build, run, and share layouts using module federation.
* ⚙️ **[Back-End Architecture Guide](file:///e:/HealthOperations_Anti/backend/README.md):** Deep-dive into database context isolation, dynamic SQL Server connection string resolution, caching mechanisms, and micro-host configurations.
* 🏛️ **[Detailed V2 Master Architectural Roadmap](file:///e:/HealthOperations_Anti/docs/HIS_BACKEND_COMPLETE_ARCHITECTURE_V2.md):** The ultimate reference for the entire system, detailing clinical shadow synchronization schemas, dynamic global patient identities, local hospital Medical Record Numbering (MRN) flows, and security guidelines.

---

## 🚀 Running the Full Stack Locally

To spin up the entire development environment:

### Step 1: Fire up the Backend and Databases
Ensure you have Docker and Docker Compose installed. Execute the following command from the root folder:
```bash
docker compose up --build
```
This boots up:
* **SQL Server Containers:** Automatically provisions schemas and seeds roles for Platform Admins, Hospital Group Admins, and Reception/Clinical Staff.
* **YARP API Gateway (Port 80/443):** Acts as the single entry point.
* **Clinical Micro-Hosts:** Identity, Patient EMR API, Labs, Pharmacy APIs.

### Step 2: Fire up the Frontend Shell and MFEs
Navigate into the frontend projects, compile the shared components, and start your target services:
```bash
# Compile shared widgets and styles first
cd frontend/his-shared-lib
npm install && npm run build

# Start the core dashboard Shell
cd ../his-shell
npm install && npm start
```

---

## 🔒 Platform Principles
Our system adheres to four uncompromised core principles:
1. **Strong Multi-Tenancy Isolation:** Zero data leaks between medical groups or individual hospitals.
2. **Zero Cross-Module Database Joins:** Maintains clean microservice-style boundaries inside a modular monolith codebase.
3. **Universal Patient Identity:** Unique global GUIDs connect medical histories across hospitals while letting each hospital define its custom sequential **MRN** format locally.
4. **Independent Deployability:** Lightweight Dockerfiles compile and push clinical modules independently, avoiding monolithic deployment lock-ins.
