import { Component, OnInit, Input, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  template: `
<div style="padding:16px;height:100%;">
  <h3 style="color:#e65100;margin-bottom:14px;font-size:16px;">💊 الأدوية الحالية</h3>
  
  <!-- Pharmacy Alerts (Improved visibility) -->
  <div *ngIf="pharmacyAlert" style="margin-bottom:15px; padding:12px; background:#fff3e0; border:2px solid #ff9800; border-radius:8px; display:flex; align-items:center; gap:12px; animation: flash 1s infinite alternate;">
    <span style="font-size:24px;">⚠️</span>
    <div style="font-size:14px; color:#e65100;">
      <strong>تنبيه عاجل من الصيدلية:</strong> دواء <b>{{ pharmacyAlert.medication }}</b> غير متوفر حالياً بالمخزن. يرجى مراجعة الخطة العلاجية.
      <br><small>توقيت التنبيه: {{ pharmacyAlert.time }}</small>
    </div>
  </div>

  <table style="width:100%;border-collapse:collapse;font-size:13px;">
    <thead>
      <tr style="background:#fff3e0;">
        <th style="padding:10px;text-align:right;border-bottom:2px solid #ffb74d;">اسم الدواء</th>
        <th style="padding:10px;text-align:right;border-bottom:2px solid #ffb74d;">الجرعة</th>
        <th style="padding:10px;text-align:right;border-bottom:2px solid #ffb74d;">منذ</th>
        <th style="padding:10px;text-align:center;border-bottom:2px solid #ffb74d;">الحالة</th>
      </tr>
    </thead>
    <tbody>
      <tr *ngFor="let m of medications" style="border-bottom:1px solid #f5f5f5;">
        <td style="padding:10px;font-weight:bold;">
          {{ m.name }}
          <span *ngIf="pharmacyAlert?.medication?.includes(m.name)" style="color:#d32f2f; font-size:11px; font-weight:bold;">(⚠️ غير متوفر)</span>
        </td>
        <td style="padding:10px;color:#555;">{{ m.dose }}</td>
        <td style="padding:10px;color:#888;">{{ m.since }}</td>
        <td style="padding:10px;text-align:center;">
          <span [style.background]="m.status==='جارية'?'#e8f5e9':'#fff3e0'"
                [style.color]="m.status==='جارية'?'#2e7d32':'#e65100'"
                style="padding:3px 10px;border-radius:12px;font-size:12px;font-weight:bold;">{{ m.status }}</span>
        </td>
      </tr>
    </tbody>
  </table>
</div>

<style>
@keyframes flash {
  from { border-color: #ff9800; box-shadow: 0 0 5px #ff9800; }
  to { border-color: #f44336; box-shadow: 0 0 10px #f44336; }
}
</style>
  `
})
export class AppComponent implements OnInit {
  @Input() patientId: string = '';
  pharmacyAlert: any = null;

  medications = [
    { name: 'Metformin 500mg', dose: 'مرتين يومياً مع الأكل', since: '2019', status: 'جارية' },
    { name: 'Amlodipine 5mg', dose: 'مرة يومياً', since: '2020', status: 'جارية' },
    { name: 'Lisinopril 10mg', dose: 'مرة يومياً', since: '2021', status: 'جارية' },
    { name: 'Panadol 500mg', dose: 'عند اللزوم', since: '2024', status: 'جارية' }
  ];

  constructor(private ngZone: NgZone) {}

  ngOnInit() {
    // الاستماع لتنبيهات الصيدلية مع ضمان تحديث الواجهة
    window.addEventListener('PHARMACY_STOCK_ALERT', (e: any) => {
      this.ngZone.run(() => {
        this.pharmacyAlert = e.detail;
        console.log('Medications MFE received Pharmacy Alert:', e.detail);
      });
    });
  }
}
