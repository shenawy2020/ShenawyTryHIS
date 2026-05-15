import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-inpatients',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="background-color: #fce4ec; padding: 20px; border-radius: 8px; border-right: 5px solid #e91e63; font-family: sans-serif; text-align: right; direction: rtl;">
      <h2 style="color: #c2185b; margin-top: 0;">🛏️ المرضى الداخليين (Inpatients)</h2>
      <p style="color: #880e4f;">عرض قائمة المرضى المنومين في المستشفى وحالتهم الحالية.</p>
      <table style="width: 100%; border-collapse: collapse; margin-top: 15px; background: white;">
        <tr style="background-color: #f8bbd0; color: #880e4f;">
          <th style="padding: 10px; border: 1px solid #f48fb1;">اسم المريض</th>
          <th style="padding: 10px; border: 1px solid #f48fb1;">رقم الغرفة</th>
          <th style="padding: 10px; border: 1px solid #f48fb1;">الطبيب المتابع</th>
          <th style="padding: 10px; border: 1px solid #f48fb1;">الحالة</th>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #f48fb1;">محمد عبد الله</td>
          <td style="padding: 10px; border: 1px solid #f48fb1;">204 (عناية)</td>
          <td style="padding: 10px; border: 1px solid #f48fb1;">د. خالد</td>
          <td style="padding: 10px; border: 1px solid #f48fb1; color: green;">مستقر</td>
        </tr>
      </table>
      
      <div style="margin-top: 20px; padding: 15px; background: #e1bee7; border-radius: 8px; border: 2px dashed #8e24aa;">
        <label style="font-weight: bold; color: #4a148c; display: block; margin-bottom: 5px;">البيانات الإضافية الممررة (Other Arguments):</label>
        <input type="text" [value]="otherArguments || 'لا يوجد بيانات ممررة (Empty)'" readonly style="width: 100%; padding: 10px; border: 1px solid #ce93d8; border-radius: 4px; box-sizing: border-box; background: #fff; font-weight: bold; color: #333;">
      </div>

      <div style="margin-top: 20px; padding: 15px; background: #f8bbd0; border-radius: 8px;">
        <label style="font-weight: bold; color: #880e4f; display: block; margin-bottom: 5px;">ملاحظات الطبيب (اختبار الحفظ):</label>
        <input type="text" placeholder="اكتب ملاحظة هنا للتحقق من حفظ البيانات عند التنقل..." style="width: 100%; padding: 10px; border: 1px solid #f48fb1; border-radius: 4px; box-sizing: border-box;">
      </div>
    </div>
  `
})
export class InpatientsComponent {
  otherArguments: string = '';

  constructor(private route: ActivatedRoute) {
    this.route.data.subscribe(data => {
      if (data['otherArguments']) {
        this.otherArguments = data['otherArguments'];
      }
    });
  }
}
