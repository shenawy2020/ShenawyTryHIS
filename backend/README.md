# ⚙️ HIS Back-End Modular Monolith Ecosystem

Welcome to the **Hospital Information System (HIS) and Electronic Medical Records (EMR)** backend. This is a highly scalable, multi-tenant, and hybrid-deployable modular monolith built on **.NET 8** and **Entity Framework Core**.

---

## 🏛️ Architecture Overview

The backend uses a **Hybrid Modular Monolith** architecture. Each clinical module is built as an independent class library but has its own lightweight API container (Host). This provides the simplicity of a monolith during local development while allowing independent CI/CD pipelines and deployment scalability in production.

```
backend/
├── gateway/
│   └── HIS.Gateway/             # YARP-powered reverse proxy (Port 80)
├── identity/
│   └── HIS.Identity.API/        # Authentication & Tenant Administration (Port 5000)
├── shared/
│   └── HIS.Shared/              # Shared multi-tenancy core, data layers, and clients
└── modules/
    └── patient/
        ├── HIS.Modules.Patient/ # EMR Patient Clinical Business Logic Library
        └── HIS.Patient.API/     # Lightweight ASP.NET Core API Host (Port 5001)
```

---

## 🔑 Key Architectural Features

1. **Scalable Multi-Tenancy (Sole & Shared Modes):**
   * **Shared DB:** Smaller hospitals share a database instance, isolated via automatic EF Core Global Query Filters on `TenantId`.
   * **Isolated DB:** Major hospitals run on dedicated, isolated database instances for strict security and performance isolation.
2. **Global Patient Identity & Local MRN:**
   * Patients hold a unique global GUID (`CentralPatients`) across the entire platform.
   * Each hospital can issue and format its own medical record numbering system (`LocalPatientRecords.MRN`) independently.
3. **Dynamic Connection String Routing:**
   * The `TenantResolutionMiddleware` intercepts incoming requests, reads the `X-Tenant-Key` header, performs dynamic cached role checks, and connects the `TenantAwareDbContext` to the correct SQL Server database instance on-the-fly.
4. **Independent Deployability:**
   * Each module includes a small `Dockerfile` copying only the module and `HIS.Shared`. Changes in the Patient module trigger builds only for `his-patient-api` without rebuilding the rest of the monolith.

---

## 🛠️ Tech Stack & Dependencies

* **Framework:** .NET 8 (C#)
* **ORM:** Entity Framework Core 8 (SQL Server)
* **API Gateway:** YARP (Yet Another Reverse Proxy)
* **Event Bus:** MassTransit (In-Memory for development, swaps to RabbitMQ/Kafka)
* **Caches:** Microsoft Extensions Memory Cache

---

## 🚀 How to Run Locally

### Docker Compose
Run the entire backend ecosystem including SQL Server databases using a single command:
```bash
# From the root workspace directory
docker compose up --build
```

### Manual Run
Alternatively, you can run individual hosts locally using the .NET CLI:
```bash
# Start the Gateway
cd gateway/HIS.Gateway
dotnet run

# Start the Patient API
cd modules/patient/HIS.Patient.API
dotnet run
```
