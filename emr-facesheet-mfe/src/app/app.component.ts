import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  template: `
<div style="background:linear-gradient(135deg,#1a237e,#283593);color:white;padding:14px 20px;display:flex;align-items:center;gap:16px;flex-wrap:wrap;border-radius:10px;">
  <div style="font-size:44px;">🧑‍⚕️</div>
  <div style="flex:1;">
    <div style="font-size:20px;font-weight:bold;">{{ patient.name }}</div>
    <div style="font-size:13px;opacity:0.85;margin-top:4px;display:flex;gap:16px;flex-wrap:wrap;">
      <span>🆔 {{ patient.id }}</span>
      <span>🎂 {{ patient.age }} سنة</span>
      <span>{{ patient.gender==='ذكر'?'♂️':'♀️' }} {{ patient.gender }}</span>
      <span>🩸 {{ patient.bloodType }}</span>
      <span>📞 {{ patient.phone }}</span>
    </div>
  </div>
  <div style="display:flex;gap:8px;flex-wrap:wrap;">
    <span *ngFor="let a of patient.allergies" style="background:#ef5350;color:white;padding:4px 10px;border-radius:20px;font-size:12px;font-weight:bold;">⚠️ {{ a }}</span>
  </div>
</div>
  `
})
export class AppComponent implements OnInit {
  @Input() patientId: string = '';

  patient = {
    id: 'P-001', name: 'محمد أحمد علي', age: 42, gender: 'ذكر',
    bloodType: 'A+', phone: '01012345678',
    allergies: ['بنسلين', 'أسبرين']
  };

  ngOnInit() {
    // Future: fetch from API using this.patientId
    // GET /api/patients/${this.patientId}
  }
}
