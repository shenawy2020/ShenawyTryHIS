import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
<div style="padding:16px;height:100%;">
  <h3 style="color:#1565c0;margin-bottom:14px;font-size:16px;">📝 Progress Notes</h3>
  <div style="margin-bottom:14px;padding:12px;background:#f5f9ff;border-radius:8px;border:1px solid #90caf9;">
    <textarea [(ngModel)]="newNote" rows="3" placeholder="اكتب ملاحظة طبية جديدة..."
      style="width:100%;border:1px solid #90caf9;border-radius:6px;padding:8px;font-size:13px;box-sizing:border-box;resize:vertical;font-family:inherit;"></textarea>
    <button (click)="save()" style="margin-top:8px;background:#1565c0;color:white;border:none;padding:8px 20px;border-radius:6px;cursor:pointer;font-size:13px;">💾 حفظ</button>
  </div>
  <div *ngFor="let n of notes" style="padding:12px;margin-bottom:8px;background:#f8fbff;border-radius:8px;border-right:4px solid #1976d2;">
    <div style="display:flex;justify-content:space-between;margin-bottom:6px;">
      <span style="font-weight:bold;color:#1565c0;font-size:13px;">{{ n.author }}</span>
      <span style="font-size:11px;color:#888;">{{ n.date }}</span>
    </div>
    <div style="font-size:13px;color:#333;line-height:1.5;">{{ n.content }}</div>
  </div>
</div>
  `
})
export class AppComponent implements OnInit {
  @Input() patientId: string = '';
  newNote = '';

  notes = [
    { date: '2026-05-15', author: 'د. علي محمد', content: 'المريض يشكو من صداع متكرر منذ أسبوع. تم طلب أشعة MRI وتحاليل دم شاملة.' },
    { date: '2026-05-10', author: 'د. علي محمد', content: 'تم تعديل جرعة دواء الضغط إلى 10mg يومياً. المتابعة بعد أسبوعين.' }
  ];

  ngOnInit() {
    // الاستماع لتحديثات العلامات الحيوية من الموديولات الأخرى
    window.addEventListener('EMR_VITALS_UPDATED', (event: any) => {
      if (event.detail.patientId === this.patientId) {
        const v = event.detail.vitals;
        const vitalsText = `\n[تحديث تلقائي للعلامات الحيوية - ${v.timestamp}]:\n` +
                          `- الضغط: ${v.bp}\n- النبض: ${v.pulse}\n- الحرارة: ${v.temp}\n- الأكسجين: ${v.o2}%\n`;
        this.newNote += vitalsText;
        console.log('Received Vitals in Notes:', v);
      }
    });
  }

  save() {
    if (this.newNote.trim()) {
      this.notes.unshift({ date: new Date().toISOString().split('T')[0], author: 'الطبيب المعالج', content: this.newNote });
      this.newNote = '';
    }
  }
}
