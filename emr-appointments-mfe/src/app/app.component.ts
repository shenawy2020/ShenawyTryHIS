import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  template: `
<div style="padding:16px;height:100%;">
  <h3 style="color:#0277bd;margin-bottom:14px;font-size:16px;">📅 المواعيد القادمة والسابقة</h3>
  <div style="display:grid;grid-template-columns:1fr;gap:12px;">
    <div *ngFor="let ap of appointments" 
      [style.background]="ap.type==='قادم'?'#e3f2fd':'#f5f5f5'"
      style="padding:12px;border-radius:10px;display:flex;justify-content:space-between;align-items:center;border:1px solid #bbdefb;box-shadow:0 2px 4px rgba(0,0,0,0.05);">
      <div>
        <div style="font-weight:bold;font-size:14px;color:#01579b;">{{ ap.dept }} — {{ ap.doctor }}</div>
        <div style="font-size:12px;color:#555;margin-top:4px;">📅 {{ ap.date }} &nbsp; 🕐 {{ ap.time }}</div>
        <div style="font-size:11px;color:#888;margin-top:2px;">📍 {{ ap.location }}</div>
      </div>
      <div style="text-align:center;">
        <span [style.background]="ap.type==='قادم'?'#1976d2':'#9e9e9e'"
              style="color:white;padding:4px 12px;border-radius:12px;font-size:11px;font-weight:bold;display:block;margin-bottom:6px;">{{ ap.type }}</span>
        <button *ngIf="ap.type==='قادم'" style="background:white;color:#1976d2;border:1px solid #1976d2;padding:4px 8px;border-radius:6px;font-size:10px;cursor:pointer;font-weight:bold;">تعديل</button>
      </div>
    </div>
  </div>
</div>
  `
})
export class AppComponent implements OnInit {
  @Input() patientId: string = '';

  appointments = [
    { date: '2026-05-20', time: '10:00 ص', doctor: 'د. أحمد سامي', dept: 'القلب', location: 'المبنى أ - الدور الثاني', type: 'قادم' },
    { date: '2026-05-28', time: '12:30 م', doctor: 'د. ليلى محمود', dept: 'الباطنة', location: 'المبنى ب - الدور الأول', type: 'قادم' },
    { date: '2026-04-15', time: '09:00 ص', doctor: 'د. هالة كمال', dept: 'العيون', location: 'المبنى ج - الدور الأرضي', type: 'سابق' }
  ];

  ngOnInit() {}
}
