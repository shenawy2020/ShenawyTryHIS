import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  template: `
<div style="padding:16px;height:100%;">
  <h3 style="color:#e65100;margin-bottom:14px;font-size:16px;">💊 الأدوية الحالية</h3>
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
        <td style="padding:10px;font-weight:bold;">{{ m.name }}</td>
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
  `
})
export class AppComponent implements OnInit {
  @Input() patientId: string = '';

  medications = [
    { name: 'Metformin 500mg', dose: 'مرتين يومياً مع الأكل', since: '2019', status: 'جارية' },
    { name: 'Amlodipine 5mg', dose: 'مرة يومياً', since: '2020', status: 'جارية' },
    { name: 'Lisinopril 10mg', dose: 'مرة يومياً', since: '2021', status: 'جارية' },
    { name: 'Aspirin 81mg', dose: 'مرة يومياً', since: '2020', status: 'موقوف' }
  ];

  ngOnInit() {
    // Future: GET /api/patients/${this.patientId}/medications
  }
}
