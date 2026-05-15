import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  template: `
<div style="padding:16px;height:100%;">
  <h3 style="color:#33691e;margin-bottom:14px;font-size:16px;">🏥 الإجراءات الطبية (Procedures)</h3>
  <div style="display:grid;grid-template-columns:1fr;gap:12px;">
    <div *ngFor="let p of procedures" style="padding:12px;background:#f1f8e9;border-radius:10px;border-right:5px solid #8bc34a;box-shadow:0 2px 4px rgba(0,0,0,0.05);">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;">
        <div>
          <div style="font-weight:bold;color:#33691e;font-size:14px;">{{ p.name }}</div>
          <div style="font-size:11px;color:#888;margin-top:2px;">📅 {{ p.date }} · 👨‍⚕️ {{ p.doctor }}</div>
        </div>
        <span [style.background]="p.status==='كتمل'?'#e8f5e9':'#fff3e0'"
              [style.color]="p.status==='كتمل'?'#2e7d32':'#e65100'"
              style="padding:3px 10px;border-radius:12px;font-size:11px;font-weight:bold;">{{ p.status }}</span>
      </div>
      <div style="margin-top:8px;font-size:12px;color:#555;background:white;padding:8px;border-radius:6px;border:1px solid #dcedc8;">
        {{ p.notes }}
      </div>
    </div>
  </div>
</div>
  `
})
export class AppComponent implements OnInit {
  @Input() patientId: string = '';

  procedures = [
    { name: 'قسطرة قلبية تشخيصية', date: '2024-01-15', doctor: 'د. أحمد سامي', status: 'كتمل', notes: 'تمت القسطرة بنجاح عبر الشريان الفخذي. لا توجد انسدادات حرجة.' },
    { name: 'تنظير معدة', date: '2023-08-20', doctor: 'د. ليلى محمود', status: 'كتمل', notes: 'التهاب بسيط في جدار المعدة. تم أخذ عينة للفحص.' },
    { name: 'خزعة كلى', date: '2022-11-05', doctor: 'د. وائل مصطفى', status: 'كتمل', notes: 'خزعة موجهة بالأشعة الصوتية. النتائج أظهرت اعتلال بسيط.' }
  ];

  ngOnInit() {}
}
