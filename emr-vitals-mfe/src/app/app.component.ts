import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
<div style="background:white;border-radius:10px;padding:14px;border-top:4px solid #e53935;height:100%;">
  <div style="font-weight:bold;color:#c62828;margin-bottom:10px;font-size:14px;">❤️ العلامات الحيوية</div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:13px;">
    <div *ngFor="let v of vitals" style="background:#fef9f9;padding:8px;border-radius:6px;text-align:center;border:1px solid #ffcdd2;">
      <div style="color:#888;font-size:11px;">{{ v.label }}</div>
      <div [style.color]="v.color" style="font-weight:bold;font-size:16px;">{{ v.value }}</div>
    </div>
  </div>
  <div style="margin-top:10px;display:flex;gap:8px;">
    <button (click)="addVitals()" style="flex:1;background:#e53935;color:white;border:none;padding:6px;border-radius:6px;cursor:pointer;font-size:12px;">➕ إضافة قراءة</button>
  </div>
</div>
  `
})
export class AppComponent implements OnInit {
  @Input() patientId: string = '';

  vitals = [
    { label: 'الضغط', value: '120/80 mmHg', color: '#c62828' },
    { label: 'النبض', value: '72 bpm', color: '#e53935' },
    { label: 'الحرارة', value: '36.5°C', color: '#f57c00' },
    { label: 'التشبع O₂', value: '98%', color: '#2e7d32' },
    { label: 'الوزن', value: '78 kg', color: '#1565c0' },
    { label: 'الطول', value: '175 cm', color: '#1565c0' }
  ];

  ngOnInit() {
    // Future: GET /api/patients/${this.patientId}/vitals
  }

  addVitals() {
    const newVitals = {
      bp: '130/85',
      pulse: 75,
      temp: 37.2,
      o2: 99,
      timestamp: new Date().toLocaleTimeString('ar-EG')
    };
    
    // إرسال حدث عالمي ليسمعه الموديولات الأخرى (مثل موديول الملاحظات)
    const event = new CustomEvent('EMR_VITALS_UPDATED', { 
      detail: { 
        patientId: this.patientId,
        vitals: newVitals
      } 
    });
    window.dispatchEvent(event);
    
    alert('تم تحديث العلامات الحيوية وإبلاغ النظام!');
  }
}
