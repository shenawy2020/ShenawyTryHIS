# 🏛️ المرجع المعماري الشامل والنهائي
## HIS Backend — .NET Core Hybrid Deployable Modular Architecture
### Multi-Tenant · Multi-Instance · Multi-Hospital · Independently Deployable Modules

> **هذا المستند هو المرجع الوحيد للمشروع — يجمع كل ما تم الاتفاق عليه**

---

## 📋 فهرس المحتويات

1. [الفلسفة والمبادئ الأساسية](#1-الفلسفة-والمبادئ-الأساسية)
2. [الهيكل العام للمنظومة](#2-الهيكل-العام-للمنظومة)
3. [السيناريوهات الأربعة الحقيقية](#3-السيناريوهات-الأربعة-الحقيقية)
4. [قاعدة البيانات المركزية — Central DB](#4-قاعدة-البيانات-المركزية)
5. [التسلسل الهرمي للمستخدمين — 3 مستويات](#5-التسلسل-الهرمي-للمستخدمين)
6. [الربط بين Central وTenant DBs](#6-الربط-بين-central-وtenant-dbs)
7. [تسجيل قاعدة بيانات جديدة وإضافة مستشفى](#7-تسجيل-قاعدة-بيانات-جديدة-وإضافة-مستشفى)
8. [طبقة الوصول للبيانات — DAL](#8-طبقة-الوصول-للبيانات)
9. [الـ Deploy المستقل لكل موديول](#9-الـ-deploy-المستقل-لكل-موديول)
10. [التواصل بين الموديولات — Cross-Module Communication](#10-التواصل-بين-الموديولات)
11. [هيكل الـ Solution وخطة التنفيذ](#11-هيكل-الـ-solution-وخطة-التنفيذ)

---

## 1. الفلسفة والمبادئ الأساسية

### المعادلة الذهبية للتصميم

```
استقلالية Deploy الميكروسيرفيسز
+
بساطة تطوير المونوليث
= HIS Deployable Modular Architecture
```

### القواعد الخمس التي لا تُكسر

| # | القاعدة | التفصيل |
|:---:|:---|:---|
| **1** | **عزل البيانات** | لا يوجد JOIN بين جداول موديولين مختلفين أبداً |
| **2** | **عزل الكود** | لا يوجد Project Reference من موديول لآخر أبداً |
| **3** | **GUID الموحد** | نفس الـ GUID يُستخدم PK في Central وTenant لتجنب Cross-DB Joins |
| **4** | **الـ Middleware يقرأ التوكن مرة واحدة** | كل المعلومات تُخزَّن في `ITenantContextAccessor` للـ Request |
| **5** | **كل موديول = Library + Host خفيف** | الـ Host مجرد `Program.cs` + `Dockerfile` فقط |

---

## 2. الهيكل العام للمنظومة

```mermaid
graph TD
    USER["👤 المستخدم"] --> MFE["Angular Micro-Frontends\n(Ports 8080+)"]
    MFE -->|"JWT + X-Tenant-Key header"| GW

    subgraph BACKEND["🖥️ Backend — كل خدمة Container مستقل"]
        GW["🔀 HIS.Gateway\n(YARP)\nPort: 80"]
        AUTH["🔐 HIS.Identity.API\nPort: 5000"]
        PAT["👤 HIS.Patient.API\nPort: 5001"]
        LAB["🔬 HIS.Lab.API\nPort: 5002"]
        PHA["💊 HIS.Pharmacy.API\nPort: 5003"]
        EMR["📋 HIS.EMR.API\nPort: 5004"]

        GW -->|"/api/auth/*"| AUTH
        GW -->|"/api/patients/*"| PAT
        GW -->|"/api/lab/*"| LAB
        GW -->|"/api/pharmacy/*"| PHA
        GW -->|"/api/emr/*"| EMR
    end

    subgraph DBS["🗄️ Databases"]
        CDB[("Central DB\nHIS_Central\n─────\nالمصادقة والتنسيق")]
        SDB[("Shared Tenant DB\n─────\nمستشفيات متوسطة\nبفلتر TenantId")]
        IDB1[("Isolated DB A\n─────\nمستشفى ضخمة\nمعزولة تماماً")]
        IDB2[("Isolated DB B\n─────\nمستشفى ضخمة\nمعزولة تماماً")]
    end

    AUTH --> CDB
    PAT & LAB & PHA & EMR --> CDB
    PAT & LAB & PHA & EMR --> SDB
    PAT & LAB & PHA & EMR --> IDB1
    PAT & LAB & PHA & EMR --> IDB2
```

---

## 3. السيناريوهات الأربعة الحقيقية

| # | السيناريو | المثال الواقعي | الحل التقني |
|:---:|:---|:---|:---|
| **1** | مستشفيات متوسطة/صغيرة متعددة | مستشفى القناة + السلام + الرحمة | **Shared DB** + EF Global Filter بـ `TenantId` |
| **2** | مستشفى ضخمة وحيدة | مستشفى جامعة القاهرة | **Isolated DB** مستقلة — `SoleTenant` بدون Filter |
| **3** | مستشفى ضخمة تضم أخرى لاحقاً | جامعة القاهرة ← ينضم مركز القلب | **Isolated DB** تتحول لـ `SharedTenant` داخل نفس الـ Instance |
| **4** | مستخدم يعمل في أكثر من مستشفى | د. أحمد في السلام ومركز القلب | **UserTenantRoles** Many-to-Many بأدوار مختلفة |

---

## 4. قاعدة البيانات المركزية

### مخطط الـ ER الكامل (7 جداول)

```mermaid
erDiagram
    CentralUsers {
        Guid     Id            PK
        string   Email         UK
        string   PasswordHash
        string   FullName
        string   Phone
        UserType UserType      "HospitalUser=0, GroupAdmin=1, SystemAdmin=2"
        bool     IsActive
        datetime CreatedAt
    }

    HospitalGroups {
        Guid   Id             PK
        string Name
        string ContractCode
        int    MaxHospitals   "null = unlimited"
        string SubscriptionTier "Basic/Pro/Enterprise"
        bool   IsActive
        datetime CreatedAt
    }

    DatabaseInstances {
        Guid   Id              PK
        string InstanceName
        string ConnectionString "مُشفَّر"
        string InstanceType    "Shared/Isolated"
        string Region
        bool   IsReady
        bool   IsActive
    }

    Tenants {
        Guid   Id              PK
        string TenantKey       UK
        string DisplayName
        string LogoUrl
        Guid   DatabaseInstanceId FK
        Guid   GroupId           FK
        string TenantMode      "SoleTenant/SharedTenant"
        bool   IsActive
        datetime CreatedAt
    }

    UserTenantRoles {
        Guid     Id         PK
        Guid     UserId     FK
        Guid     TenantId   FK
        string   RoleName   "Doctor/Nurse/Receptionist/..."
        string   Department "ICU/ER/Cardiology/..."
        bool     IsActive
        datetime JoinedAt
        datetime ExpiresAt  "null = دائم"
    }

    GroupAdminAssignments {
        Guid  Id              PK
        Guid  UserId          FK
        Guid  GroupId         FK
        bool  CanAddHospitals
        bool  CanAssignUsers
        bool  CanViewReports
        datetime AssignedAt
        Guid  AssignedByUserId FK
    }

    RefreshTokens {
        Guid     Id        PK
        Guid     UserId    FK
        string   Token
        datetime ExpiresAt
        bool     IsRevoked
        string   CreatedByIp
    }

    CentralUsers    ||--o{ UserTenantRoles      : "HospitalUser ←→ المستشفيات"
    CentralUsers    ||--o{ GroupAdminAssignments : "GroupAdmin ←→ المجموعات"
    CentralUsers    ||--o{ RefreshTokens         : "tokens"
    HospitalGroups  ||--o{ Tenants              : "تحتوي على"
    HospitalGroups  ||--o{ GroupAdminAssignments : "يديرها"
    DatabaseInstances||--o{ Tenants             : "تستضيف"
    Tenants         ||--o{ UserTenantRoles       : "بها مستخدمون"
```

---

## 5. التسلسل الهرمي للمستخدمين

### الهرم الكامل

```mermaid
graph TD
    SA["🔴 SystemAdmin\n─────────────────────\n• يرى ويتحكم في كل شيء\n• ينشئ HospitalGroups\n• ينشئ GroupAdmins\n• يسجل DatabaseInstances\n• يشغّل EF Migrations\n• يرى إحصائيات المنصة"]

    GA["🟡 GroupAdmin\n─────────────────────\n• يدير مجموعة مستشفيات\n• يضيف مستشفيات للمجموعة\n• يعين HospitalUsers\n• يرى تقارير مجموعاته\n• يمكن أن يدير أكثر من مجموعة"]

    HU["🟢 HospitalUser\n─────────────────────\n• دكتور / ممرض / صيدلاني / مختبر\n• استقبال / محاسبة / إدارة\n• يعمل في مستشفى أو أكثر\n• صلاحيات مختلفة في كل مستشفى"]

    SA -->|"ينشئ ويدير"| GA
    GA -->|"يعين ويدير"| HU
    SA -.->|"صلاحية مباشرة"| HU
```

### جدول الصلاحيات التفصيلي

| الصلاحية | 🟢 HospitalUser | 🟡 GroupAdmin | 🔴 SystemAdmin |
|:---|:---:|:---:|:---:|
| عمل طبي داخل مستشفى | مستشفياته فقط | ✅ | ✅ |
| رؤية بيانات المرضى | مستشفياته فقط | مجموعاته فقط | الكل |
| إضافة مستشفى | ❌ | ✅ في مجموعاته | ✅ |
| تعيين موظف | ❌ | ✅ في مجموعاته | ✅ |
| إنشاء HospitalGroup | ❌ | ❌ | ✅ |
| إنشاء GroupAdmin | ❌ | ❌ | ✅ |
| تسجيل DB Instance | ❌ | ❌ | ✅ |
| إلغاء تفعيل مستشفى | ❌ | ✅ في مجموعاته | ✅ |
| تقارير المنصة كاملة | ❌ | مجموعاته فقط | ✅ |

### توليد الـ JWT لكل نوع مستخدم

```csharp
// HIS.Identity/Application/Services/AuthService.cs
public async Task<LoginResponseDto> LoginAsync(LoginRequestDto request)
{
    var user = await _centralDb.CentralUsers
        .FirstOrDefaultAsync(u => u.Email == request.Email && u.IsActive)
        ?? throw new UnauthorizedException("بيانات الدخول غير صحيحة.");

    if (!VerifyPassword(request.Password, user.PasswordHash))
        throw new UnauthorizedException("بيانات الدخول غير صحيحة.");

    var baseClaims = new List<Claim>
    {
        new(ClaimTypes.NameIdentifier, user.Id.ToString()),
        new(ClaimTypes.Email, user.Email),
        new(ClaimTypes.Name, user.FullName),
        new("user_type", user.UserType.ToString()),
    };

    return user.UserType switch
    {
        // ─── HospitalUser ──────────────────────────────────────────────────
        UserType.HospitalUser => await BuildHospitalUserResponse(user, baseClaims),
        // ─── GroupAdmin ────────────────────────────────────────────────────
        UserType.GroupAdmin   => await BuildGroupAdminResponse(user, baseClaims),
        // ─── SystemAdmin ───────────────────────────────────────────────────
        UserType.SystemAdmin  => await BuildSystemAdminResponse(user, baseClaims),
        _                     => throw new InvalidOperationException()
    };
}

private async Task<LoginResponseDto> BuildHospitalUserResponse(CentralUser user, List<Claim> claims)
{
    var userTenants = await _centralDb.UserTenantRoles
        .Include(utr => utr.Tenant)
        .Where(utr => utr.UserId == user.Id && utr.IsActive && utr.Tenant.IsActive)
        .Where(utr => utr.ExpiresAt == null || utr.ExpiresAt > DateTime.UtcNow)
        .ToListAsync();

    // كل مستشفى = claim مستقل يحمل الدور والقسم
    foreach (var ut in userTenants)
    {
        claims.Add(new Claim("tenant_key",                    ut.Tenant.TenantKey));
        claims.Add(new Claim($"role_{ut.Tenant.TenantKey}",  ut.RoleName));
        claims.Add(new Claim($"dept_{ut.Tenant.TenantKey}",  ut.Department));
    }

    return new LoginResponseDto
    {
        AccessToken      = GenerateJwtToken(claims),
        RefreshToken     = await GenerateRefreshToken(user.Id),
        UserType         = UserType.HospitalUser,
        AllowedHospitals = userTenants.Select(ut => new HospitalSummaryDto
        {
            TenantKey   = ut.Tenant.TenantKey,
            DisplayName = ut.Tenant.DisplayName,
            LogoUrl     = ut.Tenant.LogoUrl,
            UserRole    = ut.RoleName,
            Department  = ut.Department
        }).ToList()
    };
}
```

---

## 6. الربط بين Central وTenant DBs

### المبدأ: نفس الـ GUID في كل مكان

```mermaid
flowchart LR
    subgraph CDB["🗄️ Central DB"]
        CU["CentralUsers\nId: ❶ GUID-USER-123"]
        TN["Tenants\nId: ❷ GUID-TENANT-ABC"]
    end

    subgraph TDB["🏥 Tenant DB"]
        TU["TenantUsers (Shadow)\nId: ❶ GUID-USER-123\n← نفس الـ GUID!"]
        HP["HospitalProfiles\nTenantId: ❷ GUID-TENANT-ABC\n← نفس الـ GUID!"]
        PT["Patients\nCreatedByUserId: ❶ GUID-USER-123\n← FK محلي — لا Cross-DB Query!"]
    end

    CU -->|"UserAssignedToTenantEvent"| TU
    TN -->|"TenantProvisionedEvent"| HP
    TU --> PT
```

### جدول `TenantUsers` (Shadow User داخل Tenant DB)

| Column | Type | Description |
|:---|:---|:---|
| `Id` | `Guid` PK | **نفس** `CentralUsers.Id` تماماً |
| `FullName` | `NVarChar(200)` | للعرض المحلي |
| `RoleName` | `NVarChar(100)` | الدور في هذه المستشفى |
| `Department` | `NVarChar(100)` | القسم |
| `TenantId` | `Guid` | معرف المستشفى (للـ Shared Instances) |
| `IsActive` | `Bit` | نشط في هذه المستشفى |
| `SyncedAt` | `DateTime` | آخر مزامنة |

### جدول `HospitalProfiles` (داخل Tenant DB)

| Column | Type | Description |
|:---|:---|:---|
| `TenantId` | `Guid` PK | **نفس** `Tenants.Id` في Central DB |
| `Name` | `NVarChar(200)` | الاسم الرسمي |
| `LicenseNumber` | `NVarChar(50)` | رقم الترخيص الوزاري |
| `Address` | `NVarChar(500)` | العنوان |
| `TotalBeds` | `Int` | عدد الأسرة |
| `LogoUrl` | `NVarChar(500)` | الشعار للطباعة |
| `SubscriptionTier` | `Enum` | `Basic/Pro/Enterprise` |

### آلية المزامنة عبر الأحداث

```csharp
// عند إضافة مستخدم لمستشفى → يُطلق حدث → يُنشأ Shadow User في Tenant DB
public class UserAssignedToTenantEventHandler : IConsumer<UserAssignedToTenantEvent>
{
    public async Task Consume(ConsumeContext<UserAssignedToTenantEvent> context)
    {
        var ev = context.Message;
        var tenantCtx = await _tenantRegistry.GetTenantContextAsync(ev.TenantId);
        
        using var tenantDb = _tenantDbFactory.CreateFor(tenantCtx);
        var existing = await tenantDb.TenantUsers.FindAsync(ev.UserId);
        
        if (existing is null)
        {
            tenantDb.TenantUsers.Add(new TenantUser
            {
                Id         = ev.UserId,        // ← نفس الـ GUID من Central
                FullName   = ev.FullName,
                RoleName   = ev.RoleName,
                Department = ev.Department,
                TenantId   = ev.TenantId,
                IsActive   = true,
                SyncedAt   = DateTime.UtcNow
            });
        }
        else
        {
            existing.RoleName   = ev.RoleName;
            existing.Department = ev.Department;
            existing.SyncedAt   = DateTime.UtcNow;
        }
        
        await tenantDb.SaveChangesAsync();
    }
}
```

---

## 7. تسجيل قاعدة بيانات جديدة وإضافة مستشفى

### 7.1 تسجيل Instance جديدة

```mermaid
flowchart TD
    A["👨‍💼 SystemAdmin\nيُدخل Connection String"] --> B["اختبار الاتصال\nSELECT 1"]
    B -->|"❌ فشل"| ERR["خطأ: عنوان SQL Server خاطئ"]
    B -->|"✅ نجح"| C["حفظ DatabaseInstance\nفي Central DB\nIsReady = false"]
    C --> D["تشغيل EF Migrations\nعلى الـ DB الجديدة\n(إنشاء كل الجداول)"]
    D --> E["تحديث IsReady = true\nIsActive = true"]
    E --> F["✅ Instance جاهزة\nلاستقبال المستشفيات"]
```

```csharp
// HIS.Identity/Application/Services/TenantProvisioningService.cs
public async Task<ProvisioningResult> RegisterDatabaseInstanceAsync(RegisterInstanceCommand cmd, CancellationToken ct)
{
    if (!await TestConnectionAsync(cmd.ConnectionString))
        return ProvisioningResult.Failed("لا يمكن الاتصال بقاعدة البيانات.");

    var instance = new DatabaseInstance
    {
        Id               = Guid.NewGuid(),
        InstanceName     = cmd.InstanceName,
        ConnectionString = _encryptor.Encrypt(cmd.ConnectionString),
        InstanceType     = cmd.Type,
        Region           = cmd.Region,
        IsReady          = false,
        IsActive         = false
    };
    _centralDb.DatabaseInstances.Add(instance);
    await _centralDb.SaveChangesAsync(ct);

    await RunMigrationsAsync(cmd.ConnectionString); // ينشئ الجداول

    instance.IsReady  = true;
    instance.IsActive = true;
    await _centralDb.SaveChangesAsync(ct);

    return ProvisioningResult.Success(instance.Id);
}
```

---

### 7.2 إضافة مستشفى جديدة — 3 سيناريوهات

#### السيناريو A: مستشفى جديدة على Shared Instance موجودة (الأسهل)

```mermaid
sequenceDiagram
    actor Admin
    participant CDB as Central DB
    participant SDB as Shared DB
    participant Bus as Event Bus

    Admin->>CDB: INSERT Tenants (TenantKey='al-salam', InstanceId=SHARED-INST, Mode=SharedTenant)
    CDB-->>Admin: TenantId = NEW-GUID

    Admin->>Bus: TenantProvisionedEvent { TenantId=NEW-GUID }
    Bus->>SDB: INSERT HospitalProfiles (TenantId=NEW-GUID, Name='مستشفى السلام')

    Admin->>CDB: INSERT UserTenantRoles (UserId=ADMIN-GUID, TenantId=NEW-GUID, Role=HospitalAdmin)
    Admin->>Bus: UserAssignedToTenantEvent
    Bus->>SDB: INSERT TenantUsers (Id=ADMIN-GUID, TenantId=NEW-GUID)

    Note over SDB: ✅ الآن أي request بـ X-Tenant-Key: al-salam\nيصل للـ Shared DB ويُفلتَر تلقائياً بـ TenantId=NEW-GUID
```

#### السيناريو B: مستشفى ضخمة على Instance معزولة جديدة

```mermaid
sequenceDiagram
    actor Admin
    participant CDB as Central DB
    participant NewDB as New Isolated DB
    participant Bus as Event Bus

    Admin->>CDB: INSERT DatabaseInstances (ConnectionString='Server=cairo-uni;...')
    Admin->>NewDB: EF Migrations (إنشاء كل الجداول)
    Admin->>CDB: UPDATE DatabaseInstances SET IsReady=true
    Admin->>CDB: INSERT Tenants (TenantKey='cairo-uni', InstanceId=NEW-INST, Mode=SoleTenant)
    CDB-->>Admin: TenantId = CAIRO-UNI-GUID

    Admin->>Bus: TenantProvisionedEvent { TenantId=CAIRO-UNI-GUID, IsSole=true }
    Bus->>NewDB: INSERT HospitalProfiles (TenantId=CAIRO-UNI-GUID, ...)
    Bus->>NewDB: INSERT TenantUsers (مدير المستشفى)

    Note over NewDB: ✅ DB معزولة تماماً\nبدون TenantId Filter (SoleTenant)
```

#### السيناريو C: مستشفى ضخمة تضم مستشفى جديدة على نفس الـ Instance

```mermaid
sequenceDiagram
    actor Admin
    participant CDB as Central DB
    participant IDB as Isolated DB (Cairo-Uni)
    participant Mig as Migration Service

    Note over IDB: الوضع الحالي: SoleTenant — بدون TenantId في الجداول

    Admin->>CDB: UPDATE Tenants SET TenantMode='SharedTenant' WHERE TenantKey='cairo-uni'
    Admin->>CDB: INSERT Tenants (TenantKey='heart-center', InstanceId=CAIRO-UNI-INST, Mode=SharedTenant)
    CDB-->>Admin: TenantId = HEART-GUID

    Admin->>Mig: طلب Growth Migration
    Mig->>IDB: ALTER TABLE Patients ADD TenantId UNIQUEIDENTIFIER NULL
    Mig->>IDB: ALTER TABLE LabOrders ADD TenantId UNIQUEIDENTIFIER NULL
    Note over IDB: (كل الجداول الطبية)
    Mig->>IDB: UPDATE Patients SET TenantId = 'CAIRO-UNI-GUID' WHERE TenantId IS NULL
    Note over IDB: كل البيانات القديمة محمية بـ TenantId الأصلي

    Mig->>IDB: INSERT HospitalProfiles (TenantId=HEART-GUID, Name='مركز القلب')

    Note over IDB: ✅ كل مستشفى ترى بياناتها فقط\nEF Global Filter مُفعَّل للاثنين
```

> [!CAUTION]
> Growth Migration تُنفَّذ في Maintenance Window مع Full Backup مسبق.

---

## 8. طبقة الوصول للبيانات

### الإجابة النهائية: كيف تعمل الموديولات مع DB؟

```mermaid
flowchart TD
    REQ["HTTP Request\nJWT + X-Tenant-Key: al-salam"] --> MW

    subgraph MIDDLEWARE["TenantResolutionMiddleware (مرة واحدة فقط لكل Request)"]
        MW["1. يتحقق من JWT\n2. يتحقق أن المستخدم له صلاحية هذه المستشفى\n3. يجلب TenantContext من Cache أو Central DB\n4. يضعه في ITenantContextAccessor"]
    end

    MW --> CTRL["Controller\n(يحقن المدير المطلوب)"]
    CTRL --> SVC["Module Service"]
    SVC --> REPO["Module Repository"]
    REPO --> DBCTX["Module DbContext\n(مثال: LabDbContext)"]

    DBCTX -->|"يرث من"| BASE["🏗️ TenantAwareDbContext‹T›\n(HIS.Shared)\n────────────────────────\n• يقرأ ConnectionString من ITenantContextAccessor\n• يُطبق Global Query Filter تلقائياً\n• يكتب TenantId + CreatedBy عند الحفظ"]

    BASE --> ACCESSOR["ITenantContextAccessor\n(Scoped — يحمل TenantContext)"]
    ACCESSOR -->|"populated by"| MW
    BASE --> DB["SQL Server\n(الـ Instance الصح تلقائياً)"]
```

### Middleware الكامل

```csharp
// HIS.Shared/Middleware/TenantResolutionMiddleware.cs
public class TenantResolutionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly IMemoryCache _cache;

    public TenantResolutionMiddleware(RequestDelegate next, IMemoryCache cache)
        => (_next, _cache) = (next, cache);

    public async Task InvokeAsync(HttpContext ctx,
                                   ITenantContextAccessor accessor,
                                   CentralDbContext centralDb)
    {
        // استثناء المسارات العامة
        if (ctx.Request.Path.StartsWithSegments("/api/auth"))
        {
            await _next(ctx); return;
        }

        // 1. قراءة مفتاح المستشفى من الـ Header
        if (!ctx.Request.Headers.TryGetValue("X-Tenant-Key", out var tenantKey))
        {
            ctx.Response.StatusCode = 400;
            await ctx.Response.WriteAsync("X-Tenant-Key header is required.");
            return;
        }

        // 2. التحقق من صلاحية المستخدم على هذه المستشفى (من الـ JWT Claims)
        var allowedTenants = ctx.User.Claims
            .Where(c => c.Type == "tenant_key")
            .Select(c => c.Value)
            .ToHashSet();

        // SystemAdmin له صلاحية على كل شيء
        var isSystemAdmin = ctx.User.HasClaim("scope", "system:admin:full");

        if (!isSystemAdmin && !allowedTenants.Contains(tenantKey.ToString()))
        {
            ctx.Response.StatusCode = 403;
            await ctx.Response.WriteAsync($"Not authorized for tenant '{tenantKey}'.");
            return;
        }

        // 3. جلب TenantContext من Cache أو قاعدة البيانات المركزية
        var cacheKey = $"tenant_ctx_{tenantKey}";
        if (!_cache.TryGetValue(cacheKey, out TenantContext? tenantContext))
        {
            var tenant = await centralDb.Tenants
                .Include(t => t.DatabaseInstance)
                .FirstOrDefaultAsync(t => t.TenantKey == tenantKey.ToString() && t.IsActive);

            if (tenant is null)
            {
                ctx.Response.StatusCode = 404;
                await ctx.Response.WriteAsync($"Tenant '{tenantKey}' not found.");
                return;
            }

            tenantContext = new TenantContext
            {
                TenantId         = tenant.Id,
                TenantKey        = tenant.TenantKey,
                ConnectionString = _encryptor.Decrypt(tenant.DatabaseInstance.ConnectionString),
                Mode             = tenant.TenantMode,
                CurrentUserId    = Guid.Parse(ctx.User.FindFirstValue(ClaimTypes.NameIdentifier)!),
                UserRole         = ctx.User.FindFirstValue($"role_{tenant.TenantKey}") ?? "Viewer"
            };

            _cache.Set(cacheKey, tenantContext, TimeSpan.FromMinutes(15));
        }

        // 4. تسجيل في الـ Accessor — متاح لكل DbContext في هذا الـ Request
        accessor.TenantContext = tenantContext;

        await _next(ctx);
    }
}
```

### الـ Base Class (القلب النابض للمنظومة)

```csharp
// HIS.Shared/Data/TenantAwareDbContext.cs
public abstract class TenantAwareDbContext<TContext> : DbContext
    where TContext : DbContext
{
    protected readonly ITenantContextAccessor TenantAccessor;

    protected TenantAwareDbContext(ITenantContextAccessor tenantAccessor)
        => TenantAccessor = tenantAccessor;

    // ─── 1. الاتصال بالقاعدة الصحيحة ────────────────────────────────────────
    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        if (optionsBuilder.IsConfigured) return;

        var connStr = TenantAccessor.TenantContext?.ConnectionString
            ?? throw new InvalidOperationException("Tenant context not set.");

        optionsBuilder.UseSqlServer(connStr, sql =>
        {
            sql.CommandTimeout(30);
            sql.EnableRetryOnFailure(3);
        });
    }

    // ─── 2. الفلتر التلقائي (يُطبَّق فقط على الـ SharedTenant) ──────────────
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        var isSole     = TenantAccessor.TenantContext?.Mode == TenantMode.SoleTenant;
        var tenantId   = TenantAccessor.TenantContext?.TenantId ?? Guid.Empty;

        if (!isSole)
        {
            foreach (var entityType in modelBuilder.Model.GetEntityTypes())
            {
                if (!typeof(ITenantEntity).IsAssignableFrom(entityType.ClrType)) continue;

                var param      = Expression.Parameter(entityType.ClrType, "e");
                var prop       = Expression.Property(param, nameof(ITenantEntity.TenantId));
                var constant   = Expression.Constant(tenantId);
                var equals     = Expression.Equal(prop, constant);
                var lambda     = Expression.Lambda(equals, param);

                modelBuilder.Entity(entityType.ClrType).HasQueryFilter(lambda);
            }
        }
    }

    // ─── 3. الكتابة التلقائية للـ TenantId والـ Audit Fields ─────────────────
    public override async Task<int> SaveChangesAsync(CancellationToken ct = default)
    {
        var tenantCtx = TenantAccessor.TenantContext
            ?? throw new InvalidOperationException("Cannot save without tenant context.");

        var now = DateTime.UtcNow;

        foreach (var entry in ChangeTracker.Entries())
        {
            if (entry.Entity is ITenantEntity te && entry.State == EntityState.Added)
                te.TenantId = tenantCtx.TenantId;

            if (entry.Entity is IAuditableEntity ae)
            {
                if (entry.State == EntityState.Added)
                {
                    ae.CreatedAt       = now;
                    ae.CreatedByUserId = tenantCtx.CurrentUserId;
                }
                else if (entry.State == EntityState.Modified)
                {
                    ae.UpdatedAt       = now;
                    ae.UpdatedByUserId = tenantCtx.CurrentUserId;
                }
            }
        }

        return await base.SaveChangesAsync(ct);
    }
}
```

### كيف يستخدم كل موديول الـ Base Class

```csharp
// HIS.Modules.Laboratory/Infrastructure/LabDbContext.cs
// اللي بيكتبه المطور هو تعريف الجداول فقط — الباقي تلقائي!
public class LabDbContext : TenantAwareDbContext<LabDbContext>
{
    public LabDbContext(ITenantContextAccessor accessor) : base(accessor) { }

    public DbSet<LabOrder>       LabOrders   => Set<LabOrder>();
    public DbSet<LabResult>      LabResults  => Set<LabResult>();
    public DbSet<TenantUser>     TenantUsers => Set<TenantUser>();
    public DbSet<HospitalProfile> Hospital   => Set<HospitalProfile>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder); // ← الفلتر التلقائي من الـ Base
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(LabDbContext).Assembly);
    }
}
```

---

## 9. الـ Deploy المستقل لكل موديول

### المبدأ: Library + Host خفيف

```
كل موديول =
┌─────────────────────────────────────────┐
│ 📦 HIS.Modules.Laboratory               │
│    (كل Business Logic)                  │
│    Domain / Application / Infrastructure │
│    ← لا يتغير عند الفصل أبداً          │
└─────────────────────────────────────────┘
              +
┌─────────────────────────────────────────┐
│ 📦 HIS.Lab.API (30 سطر فقط)             │
│    Program.cs + Dockerfile               │
│    ← الـ Shell الخفيف للتشغيل           │
└─────────────────────────────────────────┘
```

### الـ Host الخفيف

```csharp
// HIS.Lab.API/Program.cs
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddHISShared(builder.Configuration);
builder.Services.AddHISAuthentication(builder.Configuration);
builder.Services.AddLaboratoryModule(builder.Configuration); // سطر واحد!
builder.Services.AddControllers();
builder.Services.AddSwaggerGen();

var app = builder.Build();
app.UseAuthentication();
app.UseTenantResolution();
app.UseAuthorization();
app.MapControllers();
app.Run();
```

### Dockerfile لكل موديول

```dockerfile
# HIS.Lab.API/Dockerfile
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY ["shared/HIS.Shared/HIS.Shared.csproj", "shared/HIS.Shared/"]
COPY ["modules/laboratory/HIS.Modules.Laboratory/HIS.Modules.Laboratory.csproj",
      "modules/laboratory/HIS.Modules.Laboratory/"]
COPY ["modules/laboratory/HIS.Lab.API/HIS.Lab.API.csproj",
      "modules/laboratory/HIS.Lab.API/"]

RUN dotnet restore "modules/laboratory/HIS.Lab.API/HIS.Lab.API.csproj"

COPY shared/HIS.Shared/                             shared/HIS.Shared/
COPY modules/laboratory/HIS.Modules.Laboratory/     modules/laboratory/HIS.Modules.Laboratory/
COPY modules/laboratory/HIS.Lab.API/                modules/laboratory/HIS.Lab.API/

RUN dotnet publish "modules/laboratory/HIS.Lab.API/HIS.Lab.API.csproj" \
    -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "HIS.Lab.API.dll"]
```

### سيناريو الـ Deploy المستقل الكامل

```mermaid
sequenceDiagram
    participant DEV as 👨‍💻 المطور
    participant CI  as CI/CD Pipeline
    participant REG as Docker Registry
    participant PROD as Production

    Note over PROD: his-patient ✅ his-lab ✅ his-pharmacy ✅

    DEV->>DEV: اكتشف Bug في حساب النتائج في Lab Module
    DEV->>DEV: صلح الـ Bug في HIS.Modules.Laboratory
    DEV->>CI: git push → branch: fix/lab-result-calculation

    Note over CI: paths filter يكتشف تغيير في modules/laboratory/**
    CI->>CI: dotnet build HIS.Lab.API
    CI->>CI: dotnet test HIS.Modules.Laboratory.Tests
    CI->>REG: docker build his-lab:v1.2.1
    CI->>REG: docker push his-lab:v1.2.1

    CI->>PROD: docker service update --image his-lab:v1.2.1 his-lab

    Note over PROD: his-patient ✅ لم يتأثر أبداً<br/>his-lab 🔄 يُحدَّث (30 ثانية)<br/>his-pharmacy ✅ لم يتأثر أبداً

    PROD-->>DEV: ✅ Lab v1.2.1 شغّال
```

### CI/CD لكل موديول (GitHub Actions)

```yaml
# .github/workflows/lab-module.yml
name: Lab Module CI/CD

on:
  push:
    paths:
      - 'modules/laboratory/**'  # يُشغَّل فقط لو تغير Lab
      - 'shared/HIS.Shared/**'   # أو لو تغير الـ Shared

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Build & Test
        run: |
          dotnet build modules/laboratory/HIS.Lab.API/HIS.Lab.API.csproj
          dotnet test modules/laboratory/HIS.Modules.Laboratory.Tests/
      - name: Docker Build & Push
        run: |
          docker build -f modules/laboratory/HIS.Lab.API/Dockerfile \
            -t his-lab:${{ github.sha }} .
          docker push his-lab:${{ github.sha }}
      - name: Deploy Lab Only
        run: |
          docker service update --image his-lab:${{ github.sha }} his-lab
          # ← his-patient, his-pharmacy, his-gateway لم تتأثر أبداً
```

---

## 10. التواصل بين الموديولات

### الأنواع الثلاثة للتواصل

```mermaid
graph LR
    subgraph TYPES["أنواع التواصل بين الموديولات"]
        A["🟢 النوع 1: Shadow Data\n(الأساسي — 90% من الحالات)\nبيانات مكررة محلياً\nبدون أي استدعاء"]
        B["🟡 النوع 2: HTTP Typed Client\n(الثانوي — 9% من الحالات)\nاستعلام مباشر بين Containers\nعند الحاجة لبيانات حديثة"]
        C["🔴 النوع 3: Event Bus\n(غير متزامن — 1% من الحالات)\nإطلاق أحداث للتزامن\nبدون انتظار استجابة"]
    end
```

---

### النوع 1: Shadow Data (الأساسي — بدون أي استدعاء)

**المبدأ:** كل موديول يحتفظ بنسخة مصغرة من البيانات التي يحتاجها من الموديولات الأخرى.

```mermaid
flowchart LR
    subgraph PATIENT["Patient Module DB"]
        PT_TABLE["Patients\n─────────────\nId: P001\nFullName: علي محمد\nMRN: 10825\nTenantId: T-ABC"]
    end

    subgraph LAB["Lab Module DB"]
        LAB_PT["LabPatients (Shadow)\n─────────────────────\nId: P001 ← نفس الـ GUID!\nFullName: علي محمد\nMRN: 10825\nTenantId: T-ABC\n(يُنشأ عبر Event)"]

        LAB_ORD["LabOrders\n─────────────\nId: ORD001\nPatientId: P001 → FK إلى LabPatients\nTestType: CBC\nTenantId: T-ABC"]
    end

    PT_TABLE -->|"PatientCreatedEvent\n(أو PatientUpdatedEvent)"| LAB_PT
    LAB_PT --> LAB_ORD
```

```csharp
// مثال: طلب تحليل للمريض P001 في موديول المختبر
// لا يوجد أي HTTP call لموديول المرضى!
public async Task<LabOrderDto> CreateLabOrderAsync(CreateLabOrderCommand cmd)
{
    // بيانات المريض موجودة محلياً في LabPatients (Shadow)
    var patient = await _labDb.LabPatients.FindAsync(cmd.PatientId)
        ?? throw new NotFoundException($"Patient {cmd.PatientId} not found in lab records.");

    var order = new LabOrder
    {
        Id        = Guid.NewGuid(),
        PatientId = patient.Id,      // FK محلي — بدون Cross-DB
        TestType  = cmd.TestType,
        OrderedBy = cmd.DoctorId,
        Status    = LabOrderStatus.Pending,
        // TenantId يُكتب تلقائياً من TenantAwareDbContext.SaveChangesAsync
    };

    _labDb.LabOrders.Add(order);
    await _labDb.SaveChangesAsync();

    return order.ToDto(patient); // كل البيانات محلية ✅
}
```

---

### النوع 2: HTTP Typed Client (للحالات التي تحتاج بيانات حديثة جداً)

```mermaid
sequenceDiagram
    participant PHA as Pharmacy Module
    participant PAT as Patient Module

    Note over PHA,PAT: الصيدلاني يريد التحقق من الحساسيات قبل صرف دواء
    Note over PHA,PAT: (الحساسيات بيانات حساسة — لازم أحدث نسخة)

    PHA->>PAT: GET /api/patients/{id}/allergies\n+ JWT + X-Tenant-Key
    PAT->>PAT: يجلب الحساسيات من قاعدة بياناته
    PAT-->>PHA: AllergyListDto { ... }
    PHA->>PHA: يتحقق من التعارض مع الدواء
```

```csharp
// HIS.Shared/Clients/IPatientModuleClient.cs
public interface IPatientModuleClient
{
    Task<AllergyListDto?>       GetPatientAllergiesAsync(Guid patientId, string tenantKey, CancellationToken ct = default);
    Task<PatientSummaryDto?>    GetPatientSummaryAsync(Guid patientId, string tenantKey, CancellationToken ct = default);
    Task<ActiveMedicationsDto?> GetActiveMedicationsAsync(Guid patientId, string tenantKey, CancellationToken ct = default);
}

// HIS.Shared/Clients/PatientModuleClient.cs
public class PatientModuleClient : IPatientModuleClient
{
    private readonly HttpClient _http;
    private readonly ITenantContextAccessor _tenantAccessor;

    public PatientModuleClient(HttpClient http, ITenantContextAccessor accessor)
        => (_http, _tenantAccessor) = (http, accessor);

    public async Task<AllergyListDto?> GetPatientAllergiesAsync(
        Guid patientId, string tenantKey, CancellationToken ct)
    {
        // يُمرَّر نفس الـ JWT والـ Tenant Header للموديول الآخر
        _http.DefaultRequestHeaders.Remove("X-Tenant-Key");
        _http.DefaultRequestHeaders.Add("X-Tenant-Key", tenantKey);

        return await _http.GetFromJsonAsync<AllergyListDto>(
            $"/api/patients/{patientId}/allergies", ct);
    }
}

// HIS.Pharmacy.API/Program.cs — التسجيل
builder.Services.AddHttpClient<IPatientModuleClient, PatientModuleClient>(client =>
{
    client.BaseAddress = new Uri(builder.Configuration["Services:PatientUrl"]!);
    client.Timeout = TimeSpan.FromSeconds(10);
})
.AddStandardResilienceHandler(); // Retry + Circuit Breaker تلقائي

// في docker-compose.yml:
// Services__PatientUrl=http://his-patient:5001
```

**الاستخدام في الـ Pharmacy:**
```csharp
// HIS.Modules.Pharmacy/Application/Services/PrescriptionService.cs
public async Task<PrescriptionResult> DispenseMedicationAsync(DispenseCommand cmd)
{
    var tenantKey = _tenantAccessor.TenantContext!.TenantKey;

    // جلب الحساسيات من Patient Module مباشرةً (بيانات حساسة = لازم أحدث نسخة)
    var allergies = await _patientClient.GetPatientAllergiesAsync(cmd.PatientId, tenantKey);

    // التحقق من التعارض
    if (allergies?.Items.Any(a => a.SubstanceName == cmd.DrugName) == true)
        throw new AllergyConflictException($"تحذير: المريض لديه حساسية من {cmd.DrugName}");

    // صرف الدواء
    var prescription = new Prescription { ... };
    _pharmacyDb.Prescriptions.Add(prescription);
    await _pharmacyDb.SaveChangesAsync();

    return PrescriptionResult.Success(prescription);
}
```

---

### النوع 3: Event Bus (للمزامنة غير المتزامنة)

```mermaid
flowchart LR
    PAT_SVC["Patient Service\nيُنشئ مريضاً جديداً"] -->|"PatientCreatedEvent\n{ PatientId, Name, MRN }"| BUS["📮 Event Bus\n(MassTransit In-Memory\n→ RabbitMQ لاحقاً)"]

    BUS --> LAB_L["Lab Module Listener\n← ينشئ LabPatient (Shadow)"]
    BUS --> PHA_L["Pharmacy Module Listener\n← ينشئ PharmacyPatient (Shadow)"]
    BUS --> EMR_L["EMR Module Listener\n← ينشئ EMRPatient (Shadow)"]
```

```csharp
// HIS.Modules.Patient/Application/Events/PatientCreatedEvent.cs
public record PatientCreatedEvent(
    Guid   PatientId,
    string FullName,
    string MRN,
    Guid   TenantId,
    string TenantKey
);

// إطلاق الحدث بعد حفظ المريض
public class CreatePatientCommandHandler
{
    public async Task<Guid> Handle(CreatePatientCommand cmd, CancellationToken ct)
    {
        var patient = new Patient { Id = Guid.NewGuid(), ... };
        _db.Patients.Add(patient);
        await _db.SaveChangesAsync(ct);

        // إطلاق الحدث — لا ننتظر الاستجابة (Fire and Forget)
        await _eventBus.PublishAsync(new PatientCreatedEvent(
            patient.Id,
            patient.FullName,
            patient.MRN,
            _tenantAccessor.TenantContext!.TenantId,
            _tenantAccessor.TenantContext!.TenantKey
        ), ct);

        return patient.Id;
    }
}

// الاستماع في Lab Module
public class PatientCreatedEventHandler : IConsumer<PatientCreatedEvent>
{
    public async Task Consume(ConsumeContext<PatientCreatedEvent> ctx)
    {
        var ev = ctx.Message;
        var tenantCtx = await _registry.GetTenantContextAsync(ev.TenantId);
        using var labDb = _dbFactory.CreateFor(tenantCtx);

        labDb.LabPatients.Add(new LabPatient
        {
            Id       = ev.PatientId,  // نفس الـ GUID!
            FullName = ev.FullName,
            MRN      = ev.MRN,
            TenantId = ev.TenantId
        });
        await labDb.SaveChangesAsync();
    }
}
```

---

### سيناريو واقعي كامل: طلب تحليل دم للمريض علي محمد

```mermaid
sequenceDiagram
    actor DR as 👨‍⚕️ دكتور أحمد
    participant FE as Angular Shell
    participant GW as API Gateway
    participant LAB as Lab Module
    participant PAT as Patient Module

    Note over DR: يريد طلب تحليل CBC للمريض علي محمد

    DR->>FE: يبحث عن المريض (MRN: 10825)
    FE->>GW: GET /api/lab/patients/search?mrn=10825\n+ JWT + X-Tenant-Key: al-salam

    GW->>LAB: توجيه الطلب

    Note over LAB: يبحث في LabPatients (Shadow) محلياً
    LAB->>LAB: SELECT * FROM LabPatients WHERE MRN='10825' AND TenantId=@T
    LAB-->>FE: { patientId: P001, name: 'علي محمد', mrn: '10825' } ✅

    DR->>FE: يختار التحليل CBC ويضغط "طلب تحليل"
    FE->>GW: POST /api/lab/orders\n{ patientId: P001, testType: CBC }

    GW->>LAB: توجيه الطلب
    LAB->>LAB: إنشاء LabOrder في قاعدة بياناته
    Note over LAB: بدون أي HTTP call لـ Patient Module!
    LAB-->>FE: { orderId: ORD001, status: Pending }

    Note over DR: المريض يذهب للمختبر — الممرضة تسجل النتائج

    DR->>FE: POST /api/lab/orders/ORD001/results\n{ HGB: 12.5, WBC: 7.2 }
    FE->>GW: توجيه الطلب
    GW->>LAB: إدخال النتائج
    LAB->>LAB: UPDATE LabOrders SET Status=Completed + INSERT LabResults

    Note over LAB: إطلاق حدث غير متزامن
    LAB->>LAB: PublishAsync(LabResultReadyEvent { orderId, patientId, ... })

    Note over FE: الفرونت إند يُحدَّث تلقائياً عبر SignalR/Polling
    LAB-->>FE: { status: Completed, results: [{CBC: Normal}] }
```

---

## 11. هيكل الـ Solution وخطة التنفيذ

### الهيكل الكامل للمشاريع

```
his-backend/
│
├── 📄 HIS.Backend.sln
│
├── 📁 gateway/
│   └── 📦 HIS.Gateway                      ← YARP — 10 سطر فقط
│       ├── appsettings.json                 ← تعريف الـ Routes
│       ├── Program.cs
│       └── Dockerfile
│
├── 📁 identity/
│   └── 📦 HIS.Identity.API                 ← Auth Service مستقل
│       ├── Domain/
│       │   └── Entities/
│       │       ├── CentralUser.cs
│       │       ├── Tenant.cs
│       │       ├── DatabaseInstance.cs
│       │       ├── HospitalGroup.cs
│       │       ├── UserTenantRole.cs
│       │       ├── GroupAdminAssignment.cs
│       │       └── RefreshToken.cs
│       ├── Application/
│       │   ├── Commands/
│       │   │   ├── LoginCommand + Handler
│       │   │   ├── RegisterUserCommand + Handler
│       │   │   ├── AssignUserToTenantCommand + Handler
│       │   │   └── ProvisionDatabaseInstanceCommand + Handler
│       │   └── Queries/
│       │       └── GetUserTenantsQuery + Handler
│       ├── Infrastructure/
│       │   ├── CentralDbContext.cs
│       │   └── Migrations/
│       ├── Presentation/
│       │   ├── AuthController.cs
│       │   └── GroupManagementController.cs
│       ├── Program.cs
│       └── Dockerfile
│
├── 📁 shared/
│   └── 📦 HIS.Shared                       ← المكتبة المشتركة الوحيدة
│       ├── Tenancy/
│       │   ├── ITenantContextAccessor.cs
│       │   ├── TenantContextAccessor.cs
│       │   └── TenantContext.cs
│       ├── Data/
│       │   └── TenantAwareDbContext.cs      ← Base Class الأساسي
│       ├── Interfaces/
│       │   ├── ITenantEntity.cs
│       │   └── IAuditableEntity.cs
│       ├── Middleware/
│       │   └── TenantResolutionMiddleware.cs
│       ├── Authorization/
│       │   └── HISPolicies.cs
│       ├── Clients/
│       │   ├── IPatientModuleClient.cs      ← HTTP Client للتواصل بين الموديولات
│       │   └── PatientModuleClient.cs
│       ├── Events/
│       │   ├── PatientCreatedEvent.cs
│       │   ├── LabResultReadyEvent.cs
│       │   └── UserAssignedToTenantEvent.cs
│       └── Extensions/
│           └── HISSharedExtensions.cs       ← AddHISShared() Extension Method
│
└── 📁 modules/
    │
    ├── 📁 patient/
    │   ├── 📦 HIS.Modules.Patient           ← Library (كل الكود الطبي)
    │   │   ├── Domain/
    │   │   │   └── Entities/
    │   │   │       ├── Patient.cs           ← implements ITenantEntity, IAuditableEntity
    │   │   │       └── PatientAllergy.cs
    │   │   ├── Application/
    │   │   │   ├── Commands/
    │   │   │   └── Queries/
    │   │   ├── Infrastructure/
    │   │   │   ├── PatientDbContext.cs      ← يرث من TenantAwareDbContext
    │   │   │   └── Migrations/
    │   │   └── Presentation/
    │   │       └── PatientsController.cs
    │   └── 📦 HIS.Patient.API               ← Host خفيف
    │       ├── Program.cs
    │       └── Dockerfile
    │
    ├── 📁 laboratory/
    │   ├── 📦 HIS.Modules.Laboratory
    │   │   ├── Domain/Entities/
    │   │   │   ├── LabOrder.cs
    │   │   │   ├── LabResult.cs
    │   │   │   └── LabPatient.cs            ← Shadow من Patient Module
    │   │   ├── Application/
    │   │   ├── Infrastructure/
    │   │   │   ├── LabDbContext.cs
    │   │   │   └── Migrations/
    │   │   └── Presentation/
    │   │       └── LabController.cs
    │   └── 📦 HIS.Lab.API
    │       ├── Program.cs
    │       └── Dockerfile
    │
    ├── 📁 pharmacy/
    │   ├── 📦 HIS.Modules.Pharmacy
    │   └── 📦 HIS.Pharmacy.API
    │
    └── 📁 emr/
        ├── 📦 HIS.Modules.EMR
        └── 📦 HIS.EMR.API
```

---

### Docker Compose الكامل

```yaml
# docker-compose.yml
services:

  central-db:
    image: mcr.microsoft.com/mssql/server:2022-latest
    environment:
      SA_PASSWORD: "${DB_SA_PASSWORD}"
      ACCEPT_EULA: "Y"
    ports: ["1433:1433"]
    volumes: ["central-db-data:/var/opt/mssql"]
    healthcheck:
      test: /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P "${DB_SA_PASSWORD}" -Q "SELECT 1"
      interval: 10s
      retries: 10

  his-gateway:
    build: { context: ., dockerfile: gateway/HIS.Gateway/Dockerfile }
    ports: ["80:8080", "443:8443"]
    depends_on: [his-identity]

  his-identity:
    build: { context: ., dockerfile: identity/HIS.Identity.API/Dockerfile }
    environment:
      ConnectionStrings__CentralDb: "Server=central-db;Database=HIS_Central;User Id=sa;Password=${DB_SA_PASSWORD};TrustServerCertificate=True"
      Jwt__SecretKey: "${JWT_SECRET_KEY}"
      Jwt__Issuer: "his-platform"
      Jwt__Audience: "his-clients"
      Jwt__ExpiryMinutes: "60"
    depends_on:
      central-db: { condition: service_healthy }

  his-patient:
    build: { context: ., dockerfile: modules/patient/HIS.Patient.API/Dockerfile }
    environment:
      ConnectionStrings__CentralDb: "Server=central-db;Database=HIS_Central;..."
      Jwt__SecretKey: "${JWT_SECRET_KEY}"
      Services__PatientUrl: "http://his-patient:5001"
    depends_on: [central-db, his-identity]

  his-lab:
    build: { context: ., dockerfile: modules/laboratory/HIS.Lab.API/Dockerfile }
    environment:
      ConnectionStrings__CentralDb: "Server=central-db;Database=HIS_Central;..."
      Jwt__SecretKey: "${JWT_SECRET_KEY}"
      Services__PatientUrl: "http://his-patient:5001"
    depends_on: [central-db, his-identity]

  his-pharmacy:
    build: { context: ., dockerfile: modules/pharmacy/HIS.Pharmacy.API/Dockerfile }
    environment:
      ConnectionStrings__CentralDb: "Server=central-db;Database=HIS_Central;..."
      Jwt__SecretKey: "${JWT_SECRET_KEY}"
      Services__PatientUrl: "http://his-patient:5001"
    depends_on: [central-db, his-identity]

  his-emr:
    build: { context: ., dockerfile: modules/emr/HIS.EMR.API/Dockerfile }
    environment:
      ConnectionStrings__CentralDb: "Server=central-db;Database=HIS_Central;..."
      Jwt__SecretKey: "${JWT_SECRET_KEY}"
    depends_on: [central-db, his-identity]

volumes:
  central-db-data:
```

---

### خطة التنفيذ التدريجية

```mermaid
gantt
    title HIS Backend — Implementation Roadmap
    dateFormat  YYYY-MM-DD

    section المرحلة 1 — الأساس (أسبوعان)
    HIS.Shared: Interfaces + TenantAwareDbContext    :s1, 2025-06-01, 3d
    TenantResolutionMiddleware                        :s2, after s1, 2d
    HIS.Identity.API: Login + JWT + Tenant Registry  :s3, after s2, 4d
    HIS.Gateway: YARP Setup                          :s4, after s3, 1d
    Central DB Migrations + Seed                     :s5, after s4, 2d
    Docker Compose الأساسي                           :s6, after s5, 1d

    section المرحلة 2 — أول موديول (أسبوع)
    HIS.Modules.Patient (كامل)                       :p1, after s6, 4d
    HIS.Patient.API + Dockerfile + CI/CD             :p2, after p1, 1d
    اختبار الـ Deploy المستقل                        :p3, after p2, 1d

    section المرحلة 3 — بقية الموديولات (أسبوعان)
    Lab + Pharmacy + EMR Modules                     :m1, after p3, 6d
    Event Bus Setup (MassTransit In-Memory)           :m2, after m1, 2d
    Shadow Data Sync بين الموديولات                  :m3, after m2, 2d

    section المرحلة 4 — النضج
    Health Checks + Centralized Logging              :n1, after m3, 2d
    Integration Tests                                :n2, after n1, 3d
    GroupAdmin + SystemAdmin Panels                  :n3, after n2, 4d
```

---

## 📊 ملخص القرارات الكاملة

| القرار | التفصيل |
|:---|:---|
| **Framework** | .NET 8 + ASP.NET Core WebAPI |
| **ORM** | Entity Framework Core 8 + SQL Server |
| **Authentication** | JWT Bearer + Refresh Tokens |
| **Gateway** | YARP Reverse Proxy |
| **Event Bus** | MassTransit (In-Memory → RabbitMQ لاحقاً) |
| **Cross-Module HTTP** | Typed HttpClient مع Resilience Handler |
| **Central DB** | 7 جداول: Users, Groups, Instances, Tenants, UserRoles, GroupAdmins, Tokens |
| **Tenant Isolation** | EF Global Query Filter (SharedTenant) / بدون فلتر (SoleTenant) |
| **User Linking** | Shadow User بنفس الـ GUID — لا Cross-DB Joins |
| **Hospital Linking** | HospitalProfile بنفس الـ TenantId GUID |
| **DAL Pattern** | TenantAwareDbContext Base Class — DbContext مستقل لكل موديول |
| **Deployment** | كل موديول = Library + Host خفيف + Container مستقل |
| **CI/CD** | GitHub Actions مع paths filter — يُشغَّل فقط للموديول المتغير |
| **User Types** | 3 مستويات: HospitalUser / GroupAdmin / SystemAdmin |
| **Tenancy Modes** | SoleTenant (بدون Filter) / SharedTenant (مع Filter) |
| **Growth Migration** | إضافة TenantId لجداول SoleTenant عند انضمام مستشفى جديدة |

> [!IMPORTANT]
> **الخطوة التالية:** بعد الموافقة على هذا التصور الكامل، سنبدأ في إنشاء هيكل الـ Solution الفعلي داخل مجلد `his-backend` مع أول `Migration` للـ Central DB وكل ملفات الـ C# الأساسية.
