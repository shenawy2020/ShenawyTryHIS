import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatientBannerComponent } from '../lib/patient-banner/patient-banner.component';
import { PatientSearchComponent } from '../lib/patient-search/patient-search.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, PatientBannerComponent, PatientSearchComponent],
  template: `
    <div style="padding: 20px; font-family: sans-serif; direction: rtl;">
      <h1>المكتبة المشتركة لـ HIS (Shared Component Library)</h1>
      <hr>
      <h2>مكون البحث المشترك:</h2>
      <his-patient-search (patientSelected)="selectedPatient = $event"></his-patient-search>
      
      <div style="margin-top: 30px;">
        <h2>مكون بانر المريض المشترك:</h2>
        <his-patient-banner [patientId]="selectedPatient ? selectedPatient.id : 'P-001'"></his-patient-banner>
      </div>
    </div>
  `
})
export class AppComponent {
  selectedPatient: any = null;
}
