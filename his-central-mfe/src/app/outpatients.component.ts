import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-outpatients',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="background-color: #e3f2fd; padding: 20px; border-radius: 8px; border-right: 5px solid #2196f3; font-family: sans-serif; text-align: right; direction: rtl;">
      <h2 style="color: #1565c0; margin-top: 0;">🚶‍♂️ المرضى الخارجيين (Outpatients)</h2>
      <p style="color: #0d47a1;">سجل زيارات العيادات الخارجية والمواعيد المحجوزة اليوم.</p>
      <table style="width: 100%; border-collapse: collapse; margin-top: 15px; background: white;">
        <tr style="background-color: #bbdefb; color: #0d47a1;">
          <th style="padding: 10px; border: 1px solid #90caf9;">اسم المريض</th>
          <th style="padding: 10px; border: 1px solid #90caf9;">العيادة</th>
          <th style="padding: 10px; border: 1px solid #90caf9;">وقت الموعد</th>
          <th style="padding: 10px; border: 1px solid #90caf9;">الحالة</th>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #90caf9;">سارة أحمد</td>
          <td style="padding: 10px; border: 1px solid #90caf9;">عيادة العيون</td>
          <td style="padding: 10px; border: 1px solid #90caf9;">10:30 صباحاً</td>
          <td style="padding: 10px; border: 1px solid #90caf9; color: orange;">في الانتظار</td>
        </tr>
      </table>
      
      <div style="margin-top: 20px; padding: 15px; background: #e1bee7; border-radius: 8px; border: 2px dashed #8e24aa;">
        <label style="font-weight: bold; color: #4a148c; display: block; margin-bottom: 5px;">البيانات الإضافية الممررة (Other Arguments):</label>
        <input type="text" [value]="otherArguments || 'لا يوجد بيانات ممررة (Empty)'" readonly style="width: 100%; padding: 10px; border: 1px solid #ce93d8; border-radius: 4px; box-sizing: border-box; background: #fff; font-weight: bold; color: #333;">
      </div>

      <div style="margin-top: 20px; padding: 15px; background: #bbdefb; border-radius: 8px;">
        <label style="font-weight: bold; color: #0d47a1; display: block; margin-bottom: 5px;">ملاحظات الاستقبال (اختبار الحفظ):</label>
        <input type="text" placeholder="اكتب ملاحظة هنا للتحقق من حفظ البيانات عند التنقل..." style="width: 100%; padding: 10px; border: 1px solid #90caf9; border-radius: 4px; box-sizing: border-box;">
      </div>
    </div>
  `
})
export class OutpatientsComponent {
  otherArguments: string = '';

  constructor(private route: ActivatedRoute) {
    this.route.data.subscribe(data => {
      if (data['otherArguments']) {
        this.otherArguments = data['otherArguments'];
      }
    });
  }
}
