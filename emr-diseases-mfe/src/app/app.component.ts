import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  template: `
<div style="background:white;border-radius:10px;padding:14px;border-top:4px solid #f57c00;height:100%;">
  <div style="font-weight:bold;color:#e65100;margin-bottom:10px;font-size:14px;">🏥 الأمراض النشطة</div>
  <div *ngFor="let d of diseases" style="padding:8px;margin-bottom:6px;background:#fff8f3;border-radius:6px;border-right:3px solid #ff7043;">
    <div style="font-weight:bold;font-size:13px;color:#333;">{{ d.name }}</div>
    <div style="font-size:11px;color:#888;margin-top:2px;">
      منذ {{ d.since }} ·
      <span [style.color]="d.severity==='شديد'?'#c62828':d.severity==='متوسط'?'#f57c00':'#2e7d32'">{{ d.severity }}</span>
      · {{ d.status }}
    </div>
  </div>
</div>
  `
})
export class AppComponent implements OnInit {
  @Input() patientId: string = '';

  diseases = [
    { name: 'ضغط الدم المرتفع', since: '2020', status: 'نشط', severity: 'متوسط' },
    { name: 'سكري نوع 2', since: '2019', status: 'نشط', severity: 'خفيف' },
    { name: 'قصور كلوي مزمن', since: '2022', status: 'تحت المراقبة', severity: 'متوسط' }
  ];

  ngOnInit() {
    // Future: GET /api/patients/${this.patientId}/diseases
  }
}
