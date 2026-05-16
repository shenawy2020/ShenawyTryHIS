import { Component, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

const OUTPATIENTS = [
  { id: 'OP001', name: 'سارة أحمد محمد', clinic: 'عيادة العيون', time: '10:30 ص', doctor: 'د. هالة كمال', status: 'في الانتظار', statusColor: '#f57c00', bg: '#fff3e0' },
  { id: 'OP002', name: 'عمر حسام الدين', clinic: 'عيادة الجلدية', time: '11:00 ص', doctor: 'د. منى رشدي', status: 'تم الكشف', statusColor: '#2e7d32', bg: '#e8f5e9' },
  { id: 'OP003', name: 'دينا محمود فريد', clinic: 'عيادة الأطفال', time: '11:30 ص', doctor: 'د. أسامة حلمي', status: 'في الانتظار', statusColor: '#f57c00', bg: '#fff3e0' },
  { id: 'OP004', name: 'طارق عبد الفتاح', clinic: 'عيادة القلب', time: '12:00 م', doctor: 'د. علي الدسوقي', status: 'ملغي', statusColor: '#c62828', bg: '#ffebee' },
  { id: 'OP005', name: 'ياسمين وليد', clinic: 'عيادة الباطنة', time: '12:30 م', doctor: 'د. خالد نور', status: 'قادم', statusColor: '#1565c0', bg: '#e3f2fd' },
  { id: 'OP006', name: 'حسام رمضان', clinic: 'عيادة العظام', time: '01:00 م', doctor: 'د. وائل مصطفى', status: 'في الانتظار', statusColor: '#f57c00', bg: '#fff3e0' },
];

@Component({
  selector: 'app-outpatients',
  standalone: true,
  imports: [CommonModule],
  template: `
<div style="background:#e3f2fd;padding:16px;border-radius:10px;border-right:5px solid #2196f3;font-family:'Segoe UI',sans-serif;direction:rtl;">

  <!-- Header -->
  <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;">
    <h2 style="color:#1565c0;margin:0;font-size:18px;">🚶‍♂️ المرضى الخارجيين (Outpatients)</h2>
    <span style="background:#2196f3;color:white;padding:4px 14px;border-radius:20px;font-size:13px;font-weight:bold;">{{ patients.length }} مريض</span>
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
        <tr style="background:#1565c0;color:white;">
          <th style="padding:10px 14px;text-align:right;font-weight:600;">المريض</th>
          <th style="padding:10px 14px;text-align:right;font-weight:600;">العيادة</th>
          <th style="padding:10px 14px;text-align:right;font-weight:600;">الموعد</th>
          <th style="padding:10px 14px;text-align:right;font-weight:600;">الطبيب</th>
          <th style="padding:10px 14px;text-align:center;font-weight:600;">الحالة</th>
          <th style="padding:10px 14px;text-align:center;font-weight:600;">EMR</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let p of patients" style="border-bottom:1px solid #e3f2fd;transition:background 0.2s;"
          onmouseover="this.style.background='#e3f2fd'" onmouseout="this.style.background='white'">
          <td style="padding:10px 14px;">
            <div style="font-weight:bold;color:#333;">{{ p.name }}</div>
            <div style="font-size:11px;color:#888;margin-top:2px;">{{ p.id }}</div>
          </td>
          <td style="padding:10px 14px;color:#555;">{{ p.clinic }}</td>
          <td style="padding:10px 14px;color:#1565c0;font-weight:bold;">{{ p.time }}</td>
          <td style="padding:10px 14px;color:#555;">{{ p.doctor }}</td>
          <td style="padding:10px 14px;text-align:center;">
            <span [style.background]="p.bg" [style.color]="p.statusColor"
              style="padding:4px 10px;border-radius:12px;font-size:12px;font-weight:bold;">{{ p.status }}</span>
          </td>
          <td style="padding:10px 14px;text-align:center;">
            <button (click)="openEMR(p)"
              style="background:linear-gradient(135deg,#c2185b,#880e4f);color:white;border:none;padding:7px 14px;border-radius:8px;cursor:pointer;font-size:12px;font-weight:bold;transition:all 0.2s;box-shadow:0 2px 6px rgba(194,24,91,0.3);"
              onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
              📋 فتح EMR
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- Notes Test -->
  <div style="margin-top:14px;padding:12px;background:#bbdefb;border-radius:8px;">
    <label style="font-weight:bold;color:#0d47a1;display:block;margin-bottom:5px;font-size:13px;">ملاحظات الاستقبال (اختبار حفظ الحالة):</label>
    <input type="text" placeholder="اكتب ملاحظة — ستُحفظ عند التنقل بين التبويبات..." style="width:100%;padding:8px;border:1px solid #90caf9;border-radius:4px;box-sizing:border-box;font-size:13px;">
  </div>
</div>
  `
})
export class OutpatientsComponent {
  otherArguments = '';
  patients = OUTPATIENTS;

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
