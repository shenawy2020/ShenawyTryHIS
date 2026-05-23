import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  template: `
<div style="background:white;border-radius:10px;padding:14px;border-top:4px solid #7b1fa2;height:100%;">
  <div style="font-weight:bold;color:#6a1b9a;margin-bottom:10px;font-size:14px;">📖 التاريخ المرضي</div>
  <div *ngFor="let h of history" style="padding:8px;margin-bottom:6px;background:#faf3ff;border-radius:6px;border-right:3px solid #ab47bc;">
    <div style="font-weight:bold;font-size:13px;color:#333;">{{ h.event }}</div>
    <div style="font-size:11px;color:#888;margin-top:2px;">{{ h.date }} · {{ h.doctor }} · {{ h.dept }}</div>
  </div>
</div>
  `
})
export class AppComponent implements OnInit {
  @Input() patientId: string = '';

  history = [
    { event: 'قسطرة قلبية', date: '2024-01', doctor: 'د. أحمد سامي', dept: 'القلب' },
    { event: 'عملية زائدة', date: '2023-06', doctor: 'د. سامي خالد', dept: 'الجراحة' },
    { event: 'تنظير معدة', date: '2022-11', doctor: 'د. ليلى محمود', dept: 'الجهاز الهضمي' }
  ];

  ngOnInit() {
    // Future: GET /api/patients/${this.patientId}/history
  }
}
