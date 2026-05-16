import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
<div style="background:white;border-radius:10px;padding:14px;border-top:4px solid #d32f2f;height:100%;">
  <div style="font-weight:bold;color:#b71c1c;margin-bottom:10px;font-size:14px;">⚠️ الحساسيات</div>
  <div *ngFor="let a of allergies" style="padding:8px;margin-bottom:6px;background:#ffebee;border-radius:6px;border-right:3px solid #ef5350;display:flex;align-items:center;gap:8px;">
    <span style="font-size:18px;">🚫</span>
    <div>
      <div style="font-weight:bold;color:#c62828;font-size:13px;">{{ a.name }}</div>
      <div style="font-size:11px;color:#888;">{{ a.type }} · {{ a.severity }}</div>
    </div>
  </div>
  <div style="margin-top:8px;display:flex;gap:6px;">
    <input [(ngModel)]="newAllergy" placeholder="حساسية جديدة..." style="flex:1;padding:6px 8px;border:1px solid #ef9a9a;border-radius:6px;font-size:12px;">
    <button (click)="add()" style="background:#ef5350;color:white;border:none;padding:6px 10px;border-radius:6px;cursor:pointer;font-size:12px;">➕</button>
  </div>
</div>
  `
})
export class AppComponent implements OnInit {
  @Input() patientId: string = '';
  newAllergy = '';

  allergies = [
    { name: 'بنسلين', type: 'مضاد حيوي', severity: 'شديد' },
    { name: 'أسبرين', type: 'مسكن', severity: 'متوسط' }
  ];

  ngOnInit() {
    // Future: GET /api/patients/${this.patientId}/allergies
  }

  add() {
    if (this.newAllergy.trim()) {
      this.allergies.push({ name: this.newAllergy.trim(), type: 'غير محدد', severity: 'غير محدد' });
      this.newAllergy = '';
    }
  }
}
