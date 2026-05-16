# معمارية التواصل بين الموديولات (MFE Communication Architecture)

هذا المستند يوضح التصور الاحترافي لكيفية تبادل البيانات والتواصل بين موديولات نظام HIS/EMR المعتمد على Micro-Frontends.

## 1. الأهداف الأساسية
- **الاستقلالية (Independence)**: يجب أن يعمل كل موديول دون الحاجة لوجود الموديولات الأخرى في الذاكرة.
- **فك الارتباط (Decoupling)**: لا يجب أن يعرف موديول (أ) أي تفاصيل برمجية عن موديول (ب).
- **السرعة (Performance)**: التواصل يجب أن يكون لحظياً في المتصفح دون الحاجة للرجوع للسيرفر في كل عملية.

---

## 2. مستويات التواصل الثلاثة

### المستوى الأول: ناقل الأحداث العالمي (Global Event Bus)
يستخدم للإشعارات اللحظية (Reactive updates).
- **الآلية**: `window.dispatchEvent` مع `CustomEvent`.
- **مثال**: `EMR_VITALS_UPDATED`, `EMR_ALLERGY_ALERT`.
- **متى يستخدم**: عندما يحتاج موديول لإخبار الموديولات الأخرى بوقوع حدث (مثلاً: تم حفظ ملاحظة جديدة، قم بتحديث القائمة لديك).

### المستوى الثاني: السياق المشترك (Shared Context)
يستخدم لمشاركة الحالة (State) الخاصة بالمريض الحالي.
- **الآلية**: `BehaviorSubject` يتم تصديره من موديول مركزي (مثل الـ Shell).
- **البيانات المشتركة**: `PatientId`, `VisitId`, `Language`.
- **متى يستخدم**: لضمان أن كل الموديولات المفتوحة تعرض بيانات نفس المريض المختار.

### المستوى الثالث: حقن الخدمات المتبادل (Service Injection)
يستخدم لاستدعاء وظائف برمجية معقدة من موديول آخر.
- **الآلية**: `Module Federation Exposed Services`.
- **مثال**: استدعاء `BillingService.calculateItemPrice()` من داخل موديول الصيدلية.
- **متى يستخدم**: لمشاركة المنطق البرمجي (Logic) وتجنب تكرار الكود.

---

## 3. اصطلاحات التسمية للأحداث (Event Naming)
يتم اتباع النمط: `[DOMAIN]:[MODULE]:[ACTION]`
- `HIS:EMR:PATIENT_SYNC`
- `HIS:EMR:LAB_RESULT_READY`
- `HIS:SHELL:TAB_CLOSED`

---

## 4. نموذج التنفيذ (Implementation Example)

```typescript
// إرسال حدث (Sender)
window.dispatchEvent(new CustomEvent('EMR_VITALS_UPDATED', { 
  detail: { patientId: 'P001', data: { temp: 37.5 } } 
}));

// استقبال حدث (Receiver)
window.addEventListener('EMR_VITALS_UPDATED', (e: any) => {
  console.log('Vitals received:', e.detail.data);
});
```
