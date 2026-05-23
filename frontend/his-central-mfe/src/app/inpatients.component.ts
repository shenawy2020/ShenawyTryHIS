import { Component, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

const INPATIENTS = [
  { id: 'IP001', name: 'محمد عبد الله سالم', room: '204 (عناية)', doctor: 'د. خالد محمود', dept: 'الباطنة', days: 3, status: 'مستقر', statusColor: '#2e7d32', bg: '#e8f5e9' },
  { id: 'IP002', name: 'فريدة حسن علي', room: '112 (جراحة)', doctor: 'د. سامي إبراهيم', dept: 'الجراحة', days: 1, status: 'بعد العملية', statusColor: '#f57c00', bg: '#fff3e0' },
  { id: 'IP003', name: 'كريم أحمد ناصر', room: '305 (قلب)', doctor: 'د. علي الدسوقي', dept: 'القلب', days: 5, status: 'حرج', statusColor: '#c62828', bg: '#ffebee' },
  { id: 'IP004', name: 'منى عبد الرحمن', room: '201 (نساء)', doctor: 'د. ليلى صالح', dept: 'النساء والتوليد', days: 2, status: 'مستقر', statusColor: '#2e7d32', bg: '#e8f5e9' },
  { id: 'IP005', name: 'أحمد جمال الدين', room: '410 (عظام)', doctor: 'د. وائل مصطفى', dept: 'العظام', days: 7, status: 'تحسن', statusColor: '#1565c0', bg: '#e3f2fd' },
  { id: 'IP006', name: 'هناء سيد النجار', room: '108 (أعصاب)', doctor: 'د. نادية فؤاد', dept: 'الأعصاب', days: 4, status: 'مستقر', statusColor: '#2e7d32', bg: '#e8f5e9' },
];

@Component({
  selector: 'app-inpatients',
  standalone: true,
  imports: [CommonModule],
  template: `
<div style="background:#fce4ec;padding:16px;border-radius:10px;border-right:5px solid #e91e63;font-family:'Segoe UI',sans-serif;direction:rtl;">

  <!-- Header -->
  <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;">
    <h2 style="color:#c2185b;margin:0;font-size:18px;">🛏️ المرضى الداخليين (Inpatients)</h2>
    <span style="background:#e91e63;color:white;padding:4px 14px;border-radius:20px;font-size:13px;font-weight:bold;">{{ patients.length }} مريض</span>
  </div>

  <!-- Other Args -->
  <div style="margin-bottom:12px;padding:10px 14px;background:#e1bee7;border-radius:8px;border:2px dashed #8e24aa;font-size:13px;">
    <span style="font-weight:bold;color:#4a148c;">Other Arguments:</span>
    <span style="color:#333;margin-right:6px;">{{ otherArguments || 'لا يوجد' }}</span>
  </div>

  <!-- Table -->
  <div style="background:white;border-radius:10px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
    <table style="width:100%;border-collapse:collapse;font-size:13px;">
      <thead>
        <tr style="background:#c2185b;color:white;">
          <th style="padding:10px 14px;text-align:right;font-weight:600;">المريض</th>
          <th style="padding:10px 14px;text-align:right;font-weight:600;">الغرفة</th>
          <th style="padding:10px 14px;text-align:right;font-weight:600;">الطبيب</th>
          <th style="padding:10px 14px;text-align:right;font-weight:600;">الأيام</th>
          <th style="padding:10px 14px;text-align:center;font-weight:600;">الحالة</th>
          <th style="padding:10px 14px;text-align:center;font-weight:600;">EMR</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let p of patients" [style.background]="'white'"
          style="border-bottom:1px solid #fce4ec;transition:background 0.2s;"
          onmouseover="this.style.background='#fce4ec'" onmouseout="this.style.background='white'">
          <td style="padding:10px 14px;">
            <div style="font-weight:bold;color:#333;">{{ p.name }}</div>
            <div style="font-size:11px;color:#888;margin-top:2px;">{{ p.id }} · {{ p.dept }}</div>
          </td>
          <td style="padding:10px 14px;color:#555;">{{ p.room }}</td>
          <td style="padding:10px 14px;color:#555;">{{ p.doctor }}</td>
          <td style="padding:10px 14px;text-align:center;">
            <span style="background:#fce4ec;color:#c2185b;padding:3px 8px;border-radius:12px;font-size:12px;font-weight:bold;">{{ p.days }} يوم</span>
          </td>
          <td style="padding:10px 14px;text-align:center;">
            <span [style.background]="p.bg" [style.color]="p.statusColor"
              style="padding:4px 10px;border-radius:12px;font-size:12px;font-weight:bold;">{{ p.status }}</span>
          </td>
          <td style="padding:10px 14px;text-align:center;">
            <button (click)="openEMR(p)"
              style="background:linear-gradient(135deg,#1565c0,#0d47a1);color:white;border:none;padding:7px 14px;border-radius:8px;cursor:pointer;font-size:12px;font-weight:bold;transition:all 0.2s;box-shadow:0 2px 6px rgba(21,101,192,0.3);"
              onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
              📋 فتح EMR
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- Notes Test -->
  <div style="margin-top:14px;padding:12px;background:#f8bbd0;border-radius:8px;">
    <label style="font-weight:bold;color:#880e4f;display:block;margin-bottom:5px;font-size:13px;">ملاحظات الطبيب (اختبار حفظ الحالة):</label>
    <input type="text" placeholder="اكتب ملاحظة — ستُحفظ عند التنقل بين التبويبات..." style="width:100%;padding:8px;border:1px solid #f48fb1;border-radius:4px;box-sizing:border-box;font-size:13px;">
  </div>
</div>
  `
})
export class InpatientsComponent {
  otherArguments = '';
  patients = INPATIENTS;

  constructor(@Optional() private route: ActivatedRoute) {
    if (this.route) {
      this.route.data.subscribe(data => {
        this.otherArguments = data?.['otherArguments'] || '';
      });
    }
  }

  openEMR(patient: any) {
    window.parent.postMessage({ type: 'OPEN_EMR', patientId: patient.id, patientName: patient.name }, '*');
  }
}
