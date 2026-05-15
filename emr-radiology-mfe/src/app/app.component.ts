import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  template: `
<div style="padding:16px;height:100%;">
  <h3 style="color:#01579b;margin-bottom:14px;font-size:16px;">📷 نتائج الأشعة</h3>
  <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:12px;">
    <div *ngFor="let r of radiology" style="background:#e1f5fe;border-radius:10px;padding:14px;text-align:center;border:1px solid #b3e5fc;">
      <div style="font-size:36px;margin-bottom:8px;">🩻</div>
      <div style="font-weight:bold;font-size:13px;color:#01579b;">{{ r.name }}</div>
      <div style="font-size:11px;color:#888;margin-top:4px;">{{ r.date }}</div>
      <div style="margin-top:8px;font-size:12px;color:#555;background:white;padding:8px;border-radius:6px;text-align:right;">{{ r.result }}</div>
      <span [style.background]="r.status==='طبيعي'?'#e8f5e9':'#fff3e0'"
            [style.color]="r.status==='طبيعي'?'#2e7d32':'#e65100'"
            style="display:inline-block;margin-top:6px;padding:3px 10px;border-radius:12px;font-size:11px;font-weight:bold;">{{ r.status }}</span>
    </div>
  </div>
</div>
  `
})
export class AppComponent implements OnInit {
  @Input() patientId: string = '';

  radiology = [
    { name: 'صدر - أشعة سينية', date: '2026-05-10', result: 'لا توجد إشارات مرضية واضحة. حقول رئوية نظيفة.', status: 'طبيعي' },
    { name: 'MRI رأس', date: '2026-05-08', result: 'لا يوجد نزيف أو احتشاء. بنية دماغية سليمة.', status: 'طبيعي' },
    { name: 'CT بطن', date: '2026-04-20', result: 'كبد وطحال طبيعيان. كلية يسرى مصغرة قليلاً.', status: 'غير طبيعي' }
  ];

  ngOnInit() {
    // Future: GET /api/patients/${this.patientId}/radiology
  }
}
