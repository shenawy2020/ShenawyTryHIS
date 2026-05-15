import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  template: `
<div style="padding:16px;height:100%;">
  <h3 style="color:#6a1b9a;margin-bottom:14px;font-size:16px;">🔬 نتائج التحاليل</h3>
  <table style="width:100%;border-collapse:collapse;font-size:13px;">
    <thead>
      <tr style="background:#f3e5f5;">
        <th style="padding:10px;text-align:right;border-bottom:2px solid #ce93d8;">الاختبار</th>
        <th style="padding:10px;text-align:right;border-bottom:2px solid #ce93d8;">النتيجة</th>
        <th style="padding:10px;text-align:right;border-bottom:2px solid #ce93d8;">المعدل الطبيعي</th>
        <th style="padding:10px;text-align:center;border-bottom:2px solid #ce93d8;">التاريخ</th>
      </tr>
    </thead>
    <tbody>
      <tr *ngFor="let l of labs" style="border-bottom:1px solid #f5f5f5;">
        <td style="padding:10px;font-weight:bold;">{{ l.test }}</td>
        <td style="padding:10px;">
          <span [style.color]="l.flag==='H'?'#c62828':l.flag==='L'?'#1565c0':'#2e7d32'"
                [style.font-weight]="l.flag!=='N'?'bold':'normal'">
            {{ l.value }} {{ l.flag==='H'?'▲':l.flag==='L'?'▼':'✓' }}
          </span>
        </td>
        <td style="padding:10px;color:#888;font-size:12px;">{{ l.normal }}</td>
        <td style="padding:10px;color:#888;font-size:12px;text-align:center;">{{ l.date }}</td>
      </tr>
    </tbody>
  </table>
</div>
  `
})
export class AppComponent implements OnInit {
  @Input() patientId: string = '';

  labs = [
    { test: 'HbA1c', value: '7.2%', normal: '< 7%', flag: 'H', date: '2026-05-01' },
    { test: 'Creatinine', value: '1.1 mg/dl', normal: '0.7–1.3', flag: 'N', date: '2026-05-01' },
    { test: 'CBC - WBC', value: '8.5 K/uL', normal: '4.5–11', flag: 'N', date: '2026-05-01' },
    { test: 'Hemoglobin', value: '10.2 g/dl', normal: '13.5–17.5', flag: 'L', date: '2026-05-01' },
    { test: 'eGFR', value: '55 mL/min', normal: '> 60', flag: 'L', date: '2026-05-01' }
  ];

  ngOnInit() {
    // Future: GET /api/patients/${this.patientId}/labs
  }
}
