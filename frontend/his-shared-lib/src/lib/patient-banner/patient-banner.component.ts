import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface PatientData {
  id: string;
  name: string;
  mrn: string;
  age: number;
  gender: string;
  room: string;
  diagnosis: string;
  doctor: string;
  status: string;
  statusColor: string;
  admissionDate: string;
}

const MOCK_PATIENTS: Record<string, PatientData> = {
  'P-001': {
    id: 'P-001',
    name: 'محمد عبدالله الشناوي',
    mrn: 'MRN-10825',
    age: 45,
    gender: 'ذكر',
    room: 'غرفة 302 - سرير A',
    diagnosis: 'مرض السكري النوع الثاني + ارتفاع ضغط الدم الشرياني',
    doctor: 'د. علي محمد حسن (استشاري باطنة)',
    status: 'مستقر',
    statusColor: '#2e7d32',
    admissionDate: '2026-05-10'
  },
  'P-002': {
    id: 'P-002',
    name: 'سارة أحمد علي',
    mrn: 'MRN-20412',
    age: 32,
    gender: 'أنثى',
    room: 'غرفة 104 - سرير B',
    diagnosis: 'ربو شعبي حاد (Acute Asthma)',
    doctor: 'د. أحمد صبحي (أخصائي صدرية)',
    status: 'تحت الملاحظة',
    statusColor: '#f57c00',
    admissionDate: '2026-05-15'
  },
  'P-003': {
    id: 'P-003',
    name: 'خالد عبد الرحمن عيسى',
    mrn: 'MRN-90432',
    age: 61,
    gender: 'ذكر',
    room: 'العناية المركزة - سرير 3',
    diagnosis: 'احتشاء عضلة القلب الحاد (Acute Myocardial Infarction)',
    doctor: 'د. يوسف شريف (استشاري جراحة قلب)',
    status: 'حرج',
    statusColor: '#d32f2f',
    admissionDate: '2026-05-16'
  }
};

@Component({
  selector: 'his-patient-banner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%); color: white; padding: 15px 20px; border-radius: 12px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; direction: rtl; box-shadow: 0 4px 15px rgba(0,0,0,0.15); border: 2px solid #3b5998; position: relative; overflow: hidden; margin-bottom: 15px;">
      
      <!-- Shared Library Stamp Ribbon -->
      <div style="position: absolute; left: -35px; top: 15px; background: #e91e63; color: white; padding: 4px 40px; transform: rotate(-45deg); font-size: 11px; font-weight: bold; box-shadow: 0 2px 4px rgba(0,0,0,0.25); text-transform: uppercase; z-index: 2; border: 1px dashed white;">
        Shared Component 💎
      </div>

      <!-- Main Info Row -->
      <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; margin-left: 60px;">
        <div style="display: flex; align-items: center; gap: 15px;">
          <div style="background: rgba(255,255,255,0.2); width: 55px; height: 55px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 28px; border: 2px solid rgba(255,255,255,0.4);">
            {{ currentPatient.gender === 'ذكر' ? '👨' : '👩' }}
          </div>
          <div>
            <h2 style="margin: 0 0 5px; font-size: 20px; font-weight: bold; letter-spacing: 0.5px;">{{ currentPatient.name }}</h2>
            <div style="display: flex; gap: 15px; font-size: 13px; color: #cbd5e0;">
              <span>🆔 رقم الملف: <b>{{ currentPatient.mrn }}</b></span>
              <span>🎂 العمر: <b>{{ currentPatient.age }} سنة</b></span>
              <span>🚻 النوع: <b>{{ currentPatient.gender }}</b></span>
            </div>
          </div>
        </div>

        <div style="display: flex; align-items: center; gap: 10px; margin-top: 5px;">
          <span [style.background]="currentPatient.statusColor" style="color: white; padding: 5px 15px; border-radius: 20px; font-size: 12px; font-weight: bold; border: 1px solid rgba(255,255,255,0.3); box-shadow: 0 2px 5px rgba(0,0,0,0.2);">
            {{ currentPatient.status }}
          </span>
          <span style="background: rgba(255,255,255,0.15); padding: 5px 12px; border-radius: 6px; font-size: 11px; font-weight: 500; border: 1px solid rgba(255,255,255,0.2);">
            📂 مكتبة المكونات المشتركة
          </span>
        </div>
      </div>

      <!-- Details Divider -->
      <hr style="border: 0; border-top: 1px solid rgba(255,255,255,0.15); margin: 12px 0 10px;">

      <!-- Medical Details Row -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px; font-size: 13px;">
        <div>
          <span style="color: #a0aec0;">🩺 التشخيص الطبي:</span>
          <div style="font-weight: 600; margin-top: 2px;">{{ currentPatient.diagnosis }}</div>
        </div>
        <div>
          <span style="color: #a0aec0;">🏥 موقع المريض:</span>
          <div style="font-weight: 600; margin-top: 2px;">{{ currentPatient.room }}</div>
        </div>
        <div>
          <span style="color: #a0aec0;">👨‍⚕️ الطبيب المعالج:</span>
          <div style="font-weight: 600; margin-top: 2px;">{{ currentPatient.doctor }}</div>
        </div>
        <div>
          <span style="color: #a0aec0;">📅 تاريخ الدخول:</span>
          <div style="font-weight: 600; margin-top: 2px;">{{ currentPatient.admissionDate }}</div>
        </div>
      </div>

    </div>
  `
})
export class PatientBannerComponent implements OnChanges {
  @Input() patientId: string = 'P-001';
  currentPatient: PatientData = MOCK_PATIENTS['P-001'];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['patientId']) {
      const pid = this.patientId || 'P-001';
      // Normalize input e.g. "patient-P001" or "P-001" or "P001"
      let normalizedId = pid;
      if (pid.startsWith('patient-')) {
        normalizedId = pid.replace('patient-', 'P-');
      } else if (pid.startsWith('P0')) {
        normalizedId = pid.replace('P0', 'P-0');
      } else if (!pid.includes('-')) {
        normalizedId = pid.slice(0, 1) + '-' + pid.slice(1);
      }
      
      this.currentPatient = MOCK_PATIENTS[normalizedId] || MOCK_PATIENTS['P-001'];
    }
  }
}
