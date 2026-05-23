import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface PatientSearchResult {
  id: string;
  name: string;
  mrn: string;
  age: number;
  gender: string;
}

@Component({
  selector: 'his-patient-search',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; direction: rtl; box-shadow: 0 4px 6px rgba(0,0,0,0.05); position: relative; overflow: hidden; border-top: 4px solid #48bb78; margin-bottom: 20px;">
      
      <!-- Shared Tag -->
      <span style="position: absolute; left: 10px; top: 10px; background: #e6fffa; color: #319795; font-size: 10px; font-weight: bold; padding: 2px 8px; border-radius: 4px; border: 1px solid #b2f5ea;">
        Shared Component 💎
      </span>

      <h3 style="margin: 0 0 12px; color: #2d3748; font-size: 15px; display: flex; align-items: center; gap: 8px;">
        <span>🔍 البحث الذكي عن المريض</span>
      </h3>

      <!-- Input and Search Area -->
      <div style="display: flex; gap: 8px;">
        <input 
          #searchInput
          (input)="onSearch(searchInput.value)"
          type="text" 
          placeholder="ابحث باسم المريض أو رقم الملف (MRN)..." 
          style="flex: 1; padding: 10px 14px; border: 1px solid #cbd5e0; border-radius: 8px; font-size: 13px; outline: none; transition: border-color 0.2s;"
          onfocus="this.style.borderColor='#48bb78'"
          onblur="this.style.borderColor='#cbd5e0'"
        />
        <button 
          (click)="onSearch(searchInput.value)"
          style="background: #48bb78; color: white; border: none; padding: 10px 20px; border-radius: 8px; font-size: 13px; font-weight: bold; cursor: pointer; transition: background 0.2s;"
          onmouseover="this.style.background='#38a169'"
          onmouseout="this.style.background='#48bb78'"
        >
          بحث
        </button>
      </div>

      <!-- Results Area -->
      <div *ngIf="results.length > 0" style="margin-top: 12px; border: 1px solid #edf2f7; border-radius: 8px; overflow: hidden; max-height: 200px; overflow-y: auto; box-shadow: inset 0 2px 4px rgba(0,0,0,0.02);">
        <div 
          *ngFor="let p of results" 
          (click)="selectPatient(p)"
          style="display: flex; justify-content: space-between; align-items: center; padding: 10px 14px; border-bottom: 1px solid #edf2f7; cursor: pointer; transition: background 0.15s; font-size: 13px;"
          onmouseover="this.style.background='#f7fafc'"
          onmouseout="this.style.background='white'"
        >
          <div style="display: flex; align-items: center; gap: 10px;">
            <span style="font-size: 18px;">{{ p.gender === 'ذكر' ? '👨' : '👩' }}</span>
            <div>
              <strong style="color: #2d3748;">{{ p.name }}</strong>
              <div style="font-size: 11px; color: #a0aec0;">🎂 {{ p.age }} سنة | 🚻 {{ p.gender }}</div>
            </div>
          </div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="background: #edf2f7; color: #4a5568; font-size: 11px; padding: 3px 8px; border-radius: 4px; font-family: monospace; font-weight: bold;">
              {{ p.mrn }}
            </span>
            <button 
              style="background: #ebf8ff; color: #2b6cb0; border: 1px solid #bee3f8; padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: 600; cursor: pointer;"
            >
              اختيار
            </button>
          </div>
        </div>
      </div>

      <!-- No Results / Prompt -->
      <div *ngIf="results.length === 0 && searchInput.value" style="margin-top: 12px; padding: 12px; text-align: center; color: #718096; font-size: 12px; background: #f7fafc; border-radius: 8px; border: 1px dashed #e2e8f0;">
        ⚠️ لم يتم العثور على نتائج تطابق المريض المكتوب.
      </div>
    </div>
  `
})
export class PatientSearchComponent implements OnInit {
  @Output() patientSelected = new EventEmitter<PatientSearchResult>();

  allPatients: PatientSearchResult[] = [
    { id: 'P-001', name: 'محمد عبدالله الشناوي', mrn: 'MRN-10825', age: 45, gender: 'ذكر' },
    { id: 'P-002', name: 'سارة أحمد علي', mrn: 'MRN-20412', age: 32, gender: 'أنثى' },
    { id: 'P-003', name: 'خالد عبد الرحمن عيسى', mrn: 'MRN-90432', age: 61, gender: 'ذكر' }
  ];

  results: PatientSearchResult[] = [];

  ngOnInit() {
    // Show all by default
    this.results = [...this.allPatients];
  }

  onSearch(query: string) {
    if (!query) {
      this.results = [...this.allPatients];
      return;
    }
    const q = query.toLowerCase();
    this.results = this.allPatients.filter(p => 
      p.name.toLowerCase().includes(q) || p.mrn.toLowerCase().includes(q)
    );
  }

  selectPatient(patient: PatientSearchResult) {
    this.patientSelected.emit(patient);
    // Emitting a custom DOM event so that non-Angular / independent shells can also capture it!
    window.dispatchEvent(new CustomEvent('HIS_SHARED_PATIENT_SELECTED', {
      detail: patient
    }));
  }
}
