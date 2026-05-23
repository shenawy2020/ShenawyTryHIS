import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

// ==================== MOCK DATA ====================
const MOCK_PATIENTS: Record<string, any> = {
  default: {
    id: 'P-001', name: 'محمد أحمد علي', age: 42, gender: 'ذكر',
    bloodType: 'A+', phone: '01012345678',
    allergies: ['بنسلين', 'أسبرين'],
    vitals: { bp: '120/80', pulse: 72, temp: 36.5, spo2: 98, rr: 16, weight: 78, height: 175 },
    diseases: [
      { name: 'ضغط الدم', since: '2020', status: 'نشط', severity: 'متوسط' },
      { name: 'سكري نوع 2', since: '2019', status: 'نشط', severity: 'خفيف' }
    ],
    history: [
      { date: '2024-01', event: 'قسطرة قلبية', doctor: 'د. أحمد سامي' },
      { date: '2023-06', event: 'عملية زائدة', doctor: 'د. سامي خالد' }
    ],
    notes: [
      { date: '2026-05-15', author: 'د. علي', content: 'المريض يشكو من صداع متكرر. تم طلب أشعة MRI.' },
      { date: '2026-05-10', author: 'د. علي', content: 'تم تعديل جرعة دواء الضغط. المتابعة بعد أسبوعين.' }
    ],
    medications: [
      { name: 'Metformin 500mg', dose: 'مرتين يومياً', since: '2019', status: 'جارية' },
      { name: 'Amlodipine 5mg', dose: 'مرة يومياً', since: '2020', status: 'جارية' }
    ],
    labs: [
      { test: 'HbA1c', value: '7.2%', date: '2026-05-01', normal: '< 7%', flag: 'high' },
      { test: 'Creatinine', value: '1.1 mg/dl', date: '2026-05-01', normal: '0.7-1.3', flag: 'normal' },
      { test: 'CBC - WBC', value: '8.5 K/uL', date: '2026-05-01', normal: '4.5-11', flag: 'normal' }
    ]
  }
};

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
<div style="font-family:'Segoe UI',sans-serif;direction:rtl;height:100%;background:#f0f4f8;display:flex;flex-direction:column;">

  <!-- ===== PATIENT HEADER BAR ===== -->
  <div style="background:linear-gradient(135deg,#1a237e,#283593);color:white;padding:12px 20px;display:flex;align-items:center;gap:20px;flex-wrap:wrap;box-shadow:0 3px 10px rgba(0,0,0,0.3);">
    <div style="font-size:40px;">🧑‍⚕️</div>
    <div style="flex:1;">
      <div style="font-size:20px;font-weight:bold;">{{ patient.name }}</div>
      <div style="font-size:13px;opacity:0.85;margin-top:4px;display:flex;gap:15px;flex-wrap:wrap;">
        <span>🆔 {{ patient.id }}</span>
        <span>🎂 {{ patient.age }} سنة</span>
        <span>{{ patient.gender === 'ذكر' ? '♂️' : '♀️' }} {{ patient.gender }}</span>
        <span>🩸 {{ patient.bloodType }}</span>
        <span>📞 {{ patient.phone }}</span>
      </div>
    </div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;">
      <span *ngFor="let a of patient.allergies" style="background:#ef5350;color:white;padding:4px 10px;border-radius:20px;font-size:12px;font-weight:bold;">
        ⚠️ {{ a }}
      </span>
    </div>
    <div style="background:rgba(255,255,255,0.15);padding:6px 14px;border-radius:8px;font-size:12px;">
      📋 Other Args: <strong>{{ otherArguments || 'لا يوجد' }}</strong>
    </div>
  </div>

  <!-- ===== ALWAYS VISIBLE SECTION ===== -->
  <div style="padding:12px 16px;display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px;">

    <!-- VITALS CARD -->
    <div style="background:white;border-radius:10px;padding:14px;box-shadow:0 2px 8px rgba(0,0,0,0.08);border-top:4px solid #e53935;">
      <div style="font-weight:bold;color:#c62828;margin-bottom:10px;font-size:15px;">❤️ العلامات الحيوية</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:13px;">
        <div style="background:#fef9f9;padding:8px;border-radius:6px;text-align:center;">
          <div style="color:#666;font-size:11px;">الضغط</div>
          <div style="font-weight:bold;color:#c62828;font-size:16px;">{{ patient.vitals.bp }}</div>
        </div>
        <div style="background:#fff8f8;padding:8px;border-radius:6px;text-align:center;">
          <div style="color:#666;font-size:11px;">النبض</div>
          <div style="font-weight:bold;color:#e53935;font-size:16px;">{{ patient.vitals.pulse }} bpm</div>
        </div>
        <div style="background:#fff8f8;padding:8px;border-radius:6px;text-align:center;">
          <div style="color:#666;font-size:11px;">الحرارة</div>
          <div style="font-weight:bold;color:#f57c00;font-size:16px;">{{ patient.vitals.temp }}°C</div>
        </div>
        <div style="background:#f3fdf3;padding:8px;border-radius:6px;text-align:center;">
          <div style="color:#666;font-size:11px;">التشبع O₂</div>
          <div style="font-weight:bold;color:#2e7d32;font-size:16px;">{{ patient.vitals.spo2 }}%</div>
        </div>
        <div style="background:#f9f9f9;padding:8px;border-radius:6px;text-align:center;">
          <div style="color:#666;font-size:11px;">الوزن</div>
          <div style="font-weight:bold;color:#1565c0;font-size:15px;">{{ patient.vitals.weight }} kg</div>
        </div>
        <div style="background:#f9f9f9;padding:8px;border-radius:6px;text-align:center;">
          <div style="color:#666;font-size:11px;">الطول</div>
          <div style="font-weight:bold;color:#1565c0;font-size:15px;">{{ patient.vitals.height }} cm</div>
        </div>
      </div>
    </div>

    <!-- DISEASES CARD -->
    <div style="background:white;border-radius:10px;padding:14px;box-shadow:0 2px 8px rgba(0,0,0,0.08);border-top:4px solid #f57c00;">
      <div style="font-weight:bold;color:#e65100;margin-bottom:10px;font-size:15px;">🏥 الأمراض النشطة</div>
      <div *ngFor="let d of patient.diseases" style="padding:8px;margin-bottom:6px;background:#fff8f3;border-radius:6px;border-right:3px solid #ff7043;">
        <div style="font-weight:bold;font-size:13px;">{{ d.name }}</div>
        <div style="font-size:11px;color:#888;margin-top:2px;">منذ {{ d.since }} · 
          <span [style.color]="d.severity==='متوسط'?'#f57c00':'#43a047'">{{ d.severity }}</span>
        </div>
      </div>
    </div>

    <!-- HISTORY CARD -->
    <div style="background:white;border-radius:10px;padding:14px;box-shadow:0 2px 8px rgba(0,0,0,0.08);border-top:4px solid #7b1fa2;">
      <div style="font-weight:bold;color:#6a1b9a;margin-bottom:10px;font-size:15px;">📖 التاريخ المرضي</div>
      <div *ngFor="let h of patient.history" style="padding:8px;margin-bottom:6px;background:#faf3ff;border-radius:6px;border-right:3px solid #ab47bc;">
        <div style="font-weight:bold;font-size:13px;">{{ h.event }}</div>
        <div style="font-size:11px;color:#888;margin-top:2px;">{{ h.date }} · {{ h.doctor }}</div>
      </div>
    </div>

    <!-- ALLERGIES CARD -->
    <div style="background:white;border-radius:10px;padding:14px;box-shadow:0 2px 8px rgba(0,0,0,0.08);border-top:4px solid #d32f2f;">
      <div style="font-weight:bold;color:#b71c1c;margin-bottom:10px;font-size:15px;">⚠️ الحساسيات</div>
      <div *ngIf="patient.allergies.length === 0" style="color:#888;font-size:13px;">لا توجد حساسيات مسجلة</div>
      <div *ngFor="let a of patient.allergies" style="padding:10px;margin-bottom:8px;background:#ffebee;border-radius:8px;border-right:3px solid #ef5350;display:flex;align-items:center;gap:8px;">
        <span style="font-size:20px;">🚫</span>
        <div>
          <div style="font-weight:bold;color:#c62828;font-size:14px;">{{ a }}</div>
          <div style="font-size:11px;color:#888;">حساسية موثقة — تجنب الإعطاء</div>
        </div>
      </div>
      <div style="margin-top:10px;">
        <input type="text" [(ngModel)]="newAllergy" placeholder="إضافة حساسية جديدة..."
          style="width:100%;padding:8px;border:1px solid #ef9a9a;border-radius:6px;font-size:13px;box-sizing:border-box;">
        <button (click)="addAllergy()" style="margin-top:6px;width:100%;background:#ef5350;color:white;border:none;padding:6px;border-radius:6px;cursor:pointer;font-size:12px;">
          ➕ إضافة
        </button>
      </div>
    </div>

  </div>

  <!-- ===== ON-DEMAND TOOLBAR ===== -->
  <div style="background:white;margin:0 16px;border-radius:10px;padding:10px 16px;box-shadow:0 2px 6px rgba(0,0,0,0.08);display:flex;gap:6px;flex-wrap:wrap;">
    <button *ngFor="let tab of onDemandTabs" (click)="activeOnDemand = tab.key"
      [style.background]="activeOnDemand===tab.key ? tab.color : '#f5f5f5'"
      [style.color]="activeOnDemand===tab.key ? 'white' : '#555'"
      style="padding:8px 16px;border:none;border-radius:20px;cursor:pointer;font-size:13px;font-weight:bold;transition:all 0.2s;display:flex;align-items:center;gap:6px;">
      {{ tab.icon }} {{ tab.label }}
    </button>
  </div>

  <!-- ===== ON-DEMAND CONTENT ===== -->
  <div style="margin:12px 16px;flex:1;overflow-y:auto;">

    <!-- PROGRESS NOTES -->
    <div *ngIf="activeOnDemand==='notes'" style="background:white;border-radius:10px;padding:16px;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
      <h3 style="color:#1565c0;margin-bottom:14px;">📝 Progress Notes</h3>
      <div style="margin-bottom:14px;padding:12px;background:#f5f9ff;border-radius:8px;">
        <textarea [(ngModel)]="newNote" rows="3" placeholder="اكتب ملاحظة طبية جديدة..."
          style="width:100%;border:1px solid #90caf9;border-radius:6px;padding:8px;font-size:13px;box-sizing:border-box;resize:vertical;font-family:inherit;"></textarea>
        <button (click)="addNote()" style="margin-top:8px;background:#1565c0;color:white;border:none;padding:8px 20px;border-radius:6px;cursor:pointer;font-size:13px;">💾 حفظ الملاحظة</button>
      </div>
      <div *ngFor="let n of patient.notes" style="padding:12px;margin-bottom:8px;background:#f8fbff;border-radius:8px;border-right:4px solid #1976d2;">
        <div style="display:flex;justify-content:space-between;margin-bottom:6px;">
          <span style="font-weight:bold;color:#1565c0;">{{ n.author }}</span>
          <span style="font-size:12px;color:#888;">{{ n.date }}</span>
        </div>
        <div style="font-size:13px;color:#333;">{{ n.content }}</div>
      </div>
    </div>

    <!-- MEDICATIONS -->
    <div *ngIf="activeOnDemand==='meds'" style="background:white;border-radius:10px;padding:16px;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
      <h3 style="color:#e65100;margin-bottom:14px;">💊 الأدوية الحالية</h3>
      <table style="width:100%;border-collapse:collapse;font-size:13px;">
        <thead>
          <tr style="background:#fff3e0;">
            <th style="padding:10px;text-align:right;border-bottom:2px solid #ffb74d;">اسم الدواء</th>
            <th style="padding:10px;text-align:right;border-bottom:2px solid #ffb74d;">الجرعة</th>
            <th style="padding:10px;text-align:right;border-bottom:2px solid #ffb74d;">منذ</th>
            <th style="padding:10px;text-align:right;border-bottom:2px solid #ffb74d;">الحالة</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let m of patient.medications" style="border-bottom:1px solid #f5f5f5;">
            <td style="padding:10px;font-weight:bold;">{{ m.name }}</td>
            <td style="padding:10px;color:#555;">{{ m.dose }}</td>
            <td style="padding:10px;color:#888;">{{ m.since }}</td>
            <td style="padding:10px;"><span style="background:#e8f5e9;color:#2e7d32;padding:3px 10px;border-radius:12px;font-size:12px;">{{ m.status }}</span></td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- LAB RESULTS -->
    <div *ngIf="activeOnDemand==='labs'" style="background:white;border-radius:10px;padding:16px;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
      <h3 style="color:#6a1b9a;margin-bottom:14px;">🔬 نتائج التحاليل</h3>
      <table style="width:100%;border-collapse:collapse;font-size:13px;">
        <thead>
          <tr style="background:#f3e5f5;">
            <th style="padding:10px;text-align:right;border-bottom:2px solid #ce93d8;">الاختبار</th>
            <th style="padding:10px;text-align:right;border-bottom:2px solid #ce93d8;">النتيجة</th>
            <th style="padding:10px;text-align:right;border-bottom:2px solid #ce93d8;">المعدل الطبيعي</th>
            <th style="padding:10px;text-align:right;border-bottom:2px solid #ce93d8;">التاريخ</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let l of patient.labs" style="border-bottom:1px solid #f5f5f5;">
            <td style="padding:10px;font-weight:bold;">{{ l.test }}</td>
            <td style="padding:10px;">
              <span [style.color]="l.flag==='high'?'#c62828':l.flag==='low'?'#1565c0':'#2e7d32'"
                    [style.font-weight]="l.flag!=='normal'?'bold':'normal'">
                {{ l.value }} {{ l.flag==='high' ? '▲' : l.flag==='low' ? '▼' : '✓' }}
              </span>
            </td>
            <td style="padding:10px;color:#888;font-size:12px;">{{ l.normal }}</td>
            <td style="padding:10px;color:#888;font-size:12px;">{{ l.date }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- RADIOLOGY -->
    <div *ngIf="activeOnDemand==='radiology'" style="background:white;border-radius:10px;padding:16px;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
      <h3 style="color:#01579b;margin-bottom:14px;">📷 نتائج الأشعة</h3>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:12px;">
        <div *ngFor="let r of ['صدر - أشعة سينية','MRI رأس','CT بطن']" style="background:#e1f5fe;border-radius:8px;padding:14px;text-align:center;">
          <div style="font-size:40px;margin-bottom:8px;">🩻</div>
          <div style="font-weight:bold;font-size:13px;color:#01579b;">{{ r }}</div>
          <div style="font-size:11px;color:#888;margin-top:4px;">2026-05-10</div>
          <div style="margin-top:8px;font-size:12px;color:#555;background:white;padding:6px;border-radius:6px;">لا توجد إشارات مرضية واضحة</div>
        </div>
      </div>
    </div>

    <!-- PROCEDURES -->
    <div *ngIf="activeOnDemand==='procedures'" style="background:white;border-radius:10px;padding:16px;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
      <h3 style="color:#33691e;margin-bottom:14px;">🏥 الإجراءات الطبية</h3>
      <div *ngFor="let p of ['قسطرة قلبية — 2024-01-15','تنظير معدة — 2023-08-20','خزعة كلى — 2022-11-05']"
        style="padding:12px;margin-bottom:8px;background:#f1f8e9;border-radius:8px;border-right:4px solid #8bc34a;font-size:13px;">
        🔧 {{ p }}
      </div>
    </div>

    <!-- APPOINTMENTS -->
    <div *ngIf="activeOnDemand==='appointments'" style="background:white;border-radius:10px;padding:16px;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
      <h3 style="color:#0277bd;margin-bottom:14px;">📅 المواعيد</h3>
      <div *ngFor="let ap of [
        {date:'2026-05-20',time:'10:00',doctor:'د. أحمد سامي',dept:'القلب'},
        {date:'2026-05-28',time:'12:30',doctor:'د. ليلى محمود',dept:'الباطنة'}
      ]" style="padding:12px;margin-bottom:8px;background:#e3f2fd;border-radius:8px;display:flex;justify-content:space-between;align-items:center;">
        <div>
          <div style="font-weight:bold;font-size:13px;">{{ ap.dept }} — {{ ap.doctor }}</div>
          <div style="font-size:12px;color:#555;margin-top:3px;">📅 {{ ap.date }} &nbsp; 🕐 {{ ap.time }}</div>
        </div>
        <span style="background:#1976d2;color:white;padding:4px 10px;border-radius:12px;font-size:12px;">مؤكد</span>
      </div>
    </div>

  </div>

</div>
  `,
  styles: []
})
export class AppComponent implements OnInit {
  patient: any = MOCK_PATIENTS['default'];
  otherArguments: string = '';
  activeOnDemand: string = 'notes';
  newNote: string = '';
  newAllergy: string = '';

  onDemandTabs = [
    { key: 'notes', label: 'Progress Notes', icon: '📝', color: '#1976d2' },
    { key: 'meds', label: 'الأدوية', icon: '💊', color: '#e65100' },
    { key: 'labs', label: 'التحاليل', icon: '🔬', color: '#6a1b9a' },
    { key: 'radiology', label: 'الأشعة', icon: '📷', color: '#01579b' },
    { key: 'procedures', label: 'الإجراءات', icon: '🏥', color: '#33691e' },
    { key: 'appointments', label: 'المواعيد', icon: '📅', color: '#0277bd' },
  ];

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.otherArguments = this.route.snapshot.data?.['otherArguments'] || '';
    this.route.data.subscribe(data => {
      this.otherArguments = data?.['otherArguments'] || '';
    });
    // In future: use patientId to fetch from API
    // const patientId = this.route.snapshot.queryParams['patientId'];
  }

  addNote() {
    if (!this.newNote.trim()) return;
    this.patient.notes.unshift({ date: new Date().toISOString().split('T')[0], author: 'الطبيب المعالج', content: this.newNote });
    this.newNote = '';
  }

  addAllergy() {
    if (!this.newAllergy.trim()) return;
    this.patient.allergies.push(this.newAllergy.trim());
    this.newAllergy = '';
  }
}
