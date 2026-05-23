import { Component, OnInit, ViewChild, ViewContainerRef, Type, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { loadRemoteModule } from '@angular-architects/native-federation';

export interface LabResult {
  testName: string;
  result: string;
  normalRange: string;
  flag: 'H' | 'L' | 'N';
  status: string;
}

const MOCK_LAB_RESULTS: Record<string, LabResult[]> = {
  'P-001': [
    { testName: 'HbA1c (مستودع السكر)', result: '7.8 %', normalRange: '4.0 - 5.6 %', flag: 'H', status: 'نهائي' },
    { testName: 'Fasting Blood Sugar (سكر صائم)', result: '142 mg/dL', normalRange: '70 - 100 mg/dL', flag: 'H', status: 'نهائي' },
    { testName: 'Creatinine (وظائف الكلى)', result: '1.2 mg/dL', normalRange: '0.6 - 1.3 mg/dL', flag: 'N', status: 'نهائي' },
    { testName: 'Cholesterol (الكوليسترول)', result: '210 mg/dL', normalRange: '< 200 mg/dL', flag: 'H', status: 'نهائي' }
  ],
  'P-002': [
    { testName: 'CBC - WBC (كريات الدم البيضاء)', result: '11.8 K/uL', normalRange: '4.5 - 11.0 K/uL', flag: 'H', status: 'نهائي' },
    { testName: 'Hemoglobin (الهيموجلوبين)', result: '11.2 g/dL', normalRange: '12.0 - 16.0 g/dL', flag: 'L', status: 'نهائي' },
    { testName: 'ESR (سرعة الترسيب)', result: '22 mm/hr', normalRange: '0 - 20 mm/hr', flag: 'H', status: 'نهائي' }
  ],
  'P-003': [
    { testName: 'Troponin I (إنزيمات القلب)', result: '2.4 ng/mL', normalRange: '< 0.04 ng/mL', flag: 'H', status: 'عاجل جداً' },
    { testName: 'CK-MB', result: '18 ng/mL', normalRange: '< 5 ng/mL', flag: 'H', status: 'عاجل جداً' },
    { testName: 'Potassium (البوتاسيوم)', result: '5.2 mEq/L', normalRange: '3.5 - 5.1 mEq/L', flag: 'H', status: 'نهائي' }
  ]
};

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="padding: 24px; font-family: 'Segoe UI', Tahoma, sans-serif; direction: rtl; background: #f8fafc; min-height: 90vh;">
      
      <!-- Top Title Bar -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; border-bottom: 2px solid #cbd5e1; padding-bottom: 12px;">
        <h2 style="color: #4a154b; margin: 0; display: flex; align-items: center; gap: 10px;">
          <span>🔬 موديول المختبر والتحاليل (Laboratory MFE)</span>
        </h2>
        <span style="background: #e2e8f0; color: #475569; padding: 6px 12px; border-radius: 8px; font-size: 12px; font-weight: bold; border: 1px solid #cbd5e1;">
          مستقل | Port 8102
        </span>
      </div>

      <!-- Shared Components Section Container -->
      <div style="margin-bottom: 20px;">
        <div style="background: #ebf8ff; border: 1px solid #bee3f8; color: #2b6cb0; padding: 8px 15px; border-radius: 8px; font-size: 12px; font-weight: bold; margin-bottom: 10px; display: inline-flex; align-items: center; gap: 8px;">
          <span>💡 يتم تحميل المكونات التالية ديناميكياً من المكتبة المشتركة (Shared Library Port 8200)</span>
        </div>
        
        <!-- Search placeholder -->
        <ng-container #searchHost></ng-container>

        <!-- Banner placeholder -->
        <ng-container #bannerHost></ng-container>
      </div>

      <!-- Laboratory Results Table -->
      <div style="background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.02); margin-top: 15px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
          <h3 style="margin: 0; color: #334155; font-size: 16px;">📋 نتائج تحاليل المريض الحالي</h3>
          <span style="background: #f1f5f9; color: #64748b; font-size: 11px; padding: 4px 10px; border-radius: 6px; font-weight: bold;">
            آخر تحديث: قبل قليل
          </span>
        </div>

        <table style="width: 100%; border-collapse: collapse; text-align: right; font-size: 13px;">
          <thead>
            <tr style="background: #f8fafc; border-bottom: 2px solid #cbd5e1;">
              <th style="padding: 12px 10px; color: #475569;">اسم التحليل</th>
              <th style="padding: 12px 10px; color: #475569;">النتيجة</th>
              <th style="padding: 12px 10px; color: #475569;">المعدل الطبيعي</th>
              <th style="padding: 12px 10px; color: #475569; text-align: center;">حالة النتيجة</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let r of labResults" style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 12px 10px; font-weight: 600; color: #1e293b;">{{ r.testName }}</td>
              <td style="padding: 12px 10px; font-weight: bold;">
                <span [style.color]="r.flag === 'H' ? '#d32f2f' : r.flag === 'L' ? '#0284c7' : '#16a34a'">
                  {{ r.result }}
                  {{ r.flag === 'H' ? '▲ (مرتفع)' : r.flag === 'L' ? '▼ (منخفض)' : '✓ (طبيعي)' }}
                </span>
              </td>
              <td style="padding: 12px 10px; color: #64748b;">{{ r.normalRange }}</td>
              <td style="padding: 12px 10px; text-align: center;">
                <span [style.background]="r.status.includes('عاجل') ? '#fee2e2' : '#f1f5f9'"
                      [style.color]="r.status.includes('عاجل') ? '#991b1b' : '#475569'"
                      style="padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: bold; border: 1px solid rgba(0,0,0,0.05);">
                  {{ r.status }}
                </span>
              </td>
            </tr>
            <tr *ngIf="labResults.length === 0">
              <td colspan="4" style="padding: 30px; text-align: center; color: #94a3b8; font-size: 14px;">
                🚫 الرجاء اختيار مريض من شريط البحث المشترك أعلاه لعرض تحاليله الطبية.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  `
})
export class AppComponent implements OnInit {
  @ViewChild('searchHost', { read: ViewContainerRef, static: true }) searchHost!: ViewContainerRef;
  @ViewChild('bannerHost', { read: ViewContainerRef, static: true }) bannerHost!: ViewContainerRef;

  currentPatientId = 'P-001';
  labResults: LabResult[] = [];
  bannerRef: any = null;

  constructor(private ngZone: NgZone) {}

  async ngOnInit() {
    this.loadResults();

    // 1. Load shared components from Port 8200
    await this.loadSharedSearch();
    await this.loadSharedBanner();

    // 2. Listen to custom selected event globally to support decoupled messaging!
    window.addEventListener('HIS_SHARED_PATIENT_SELECTED', (e: any) => {
      this.ngZone.run(() => {
        const p = e.detail;
        console.log('Lab MFE got selected patient from shared component:', p);
        this.currentPatientId = p.id;
        this.loadResults();
        
        // Update input of dynamic PatientBannerComponent
        if (this.bannerRef) {
          this.bannerRef.instance.patientId = p.id;
          this.bannerRef.changeDetectorRef.detectChanges();
        }
      });
    });
  }

  loadResults() {
    this.labResults = MOCK_LAB_RESULTS[this.currentPatientId] || [];
  }

  async loadSharedSearch() {
    try {
      const m = await loadRemoteModule({
        remoteEntry: 'http://localhost:8200/remoteEntry.json',
        exposedModule: './PatientSearch'
      });
      const comp: Type<any> = m['PatientSearchComponent'];
      this.searchHost.clear();
      const ref = this.searchHost.createComponent(comp);
      ref.changeDetectorRef.detectChanges();
    } catch (e) {
      console.error('Failed to load shared PatientSearchComponent:', e);
    }
  }

  async loadSharedBanner() {
    try {
      const m = await loadRemoteModule({
        remoteEntry: 'http://localhost:8200/remoteEntry.json',
        exposedModule: './PatientBanner'
      });
      const comp: Type<any> = m['PatientBannerComponent'];
      this.bannerHost.clear();
      this.bannerRef = this.bannerHost.createComponent(comp);
      this.bannerRef.instance.patientId = this.currentPatientId;
      this.bannerRef.changeDetectorRef.detectChanges();
    } catch (e) {
      console.error('Failed to load shared PatientBannerComponent:', e);
    }
  }
}
