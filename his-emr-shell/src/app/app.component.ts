import { Component, OnInit, ViewChild, ViewContainerRef, Type, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { loadRemoteModule } from '@angular-architects/native-federation';

const EMR_REMOTES: Record<string, string> = {
  facesheet:   'http://localhost:8091/remoteEntry.json',
  vitals:      'http://localhost:8092/remoteEntry.json',
  diseases:    'http://localhost:8093/remoteEntry.json',
  history:     'http://localhost:8094/remoteEntry.json',
  allergies:   'http://localhost:8095/remoteEntry.json',
  notes:       'http://localhost:8096/remoteEntry.json',
  medications: 'http://localhost:8097/remoteEntry.json',
  labs:        'http://localhost:8098/remoteEntry.json',
  radiology:   'http://localhost:8099/remoteEntry.json',
  procedures:  'http://localhost:8100/remoteEntry.json',
  appointments: 'http://localhost:8101/remoteEntry.json',
};

const ON_DEMAND_TABS = [
  { key: 'notes',       label: 'Progress Notes', icon: '📝', color: '#1976d2' },
  { key: 'medications', label: 'الأدوية',         icon: '💊', color: '#e65100' },
  { key: 'labs',        label: 'التحاليل',        icon: '🔬', color: '#6a1b9a' },
  { key: 'radiology',   label: 'الأشعة',          icon: '📷', color: '#01579b' },
  { key: 'procedures',  label: 'الإجراءات',      icon: '🏥', color: '#33691e' },
  { key: 'appointments', label: 'المواعيد',       icon: '📅', color: '#0277bd' },
];

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  template: `
<div style="height:100%;display:flex;flex-direction:column;background:#f0f4f8;font-family:'Segoe UI',sans-serif;direction:rtl;">

  <!-- EMR TOP BAR (Improved Visibility) -->
  <div style="background:#2c3e50; color:white; padding:12px 20px; display:flex; justify-content:space-between; align-items:center; box-shadow:0 2px 5px rgba(0,0,0,0.2); border-bottom: 3px solid #3498db;">
    <div style="display:flex; align-items:center; gap:20px; flex:1;">
      <span style="font-weight:bold; font-size:18px; letter-spacing: 0.5px;">📁 ملف المريض الإلكتروني</span>
      
      <!-- Scrolling or Pulsing Message -->
      <div *ngIf="lastShellMessage" style="background:#f1c40f; color:#000; padding:6px 20px; border-radius:4px; font-size:14px; font-weight:bold; display:flex; align-items:center; gap:10px; border: 1px solid #d4ac0d; animation: slideIn 0.3s ease-out;">
        <span style="font-size:18px;">🔔</span>
        <span>رسالة من الإدارة: <b>{{ lastShellMessage }}</b></span>
        <button (click)="lastShellMessage=''" style="background:rgba(0,0,0,0.1); border:none; border-radius:50%; width:20px; height:20px; cursor:pointer; font-weight:bold; display:flex; align-items:center; justify-content:center;">&times;</button>
      </div>
    </div>
    
    <div style="display:flex; gap:12px; align-items:center;">
       <button (click)="sendMessageToShell()" style="background:#3498db; color:white; border:none; padding:8px 20px; border-radius:6px; cursor:pointer; font-size:13px; font-weight:bold; transition: background 0.2s;" onmouseover="this.style.background='#2980b9'" onmouseout="this.style.background='#3498db'">
        💬 إرسال رسالة للإدارة
      </button>
      <span style="background:#34495e; color:#bdc3c7; padding:6px 12px; border-radius:6px; font-size:12px; font-weight:bold; border: 1px solid #455a64;">
        🆔 {{ patientIdDisplay }}
      </span>
    </div>
  </div>

  <!-- FACESHEET (Always) -->
  <div style="padding:12px 16px 0;">
    <ng-container #facesheetHost></ng-container>
  </div>

  <!-- ALWAYS VISIBLE GRID -->
  <div style="padding:12px 16px;display:grid;grid-template-columns:repeat(4,1fr);gap:12px;">
    <ng-container #vitalsHost></ng-container>
    <ng-container #diseasesHost></ng-container>
    <ng-container #historyHost></ng-container>
    <ng-container #allergiesHost></ng-container>
  </div>

  <!-- ON-DEMAND TOOLBAR -->
  <div style="background:white;margin:0 16px;border-radius:10px;padding:10px 16px;box-shadow:0 2px 6px rgba(0,0,0,0.08);display:flex;gap:6px;flex-wrap:wrap;">
    <button *ngFor="let tab of onDemandTabs" (click)="loadOnDemand(tab.key)"
      [style.background]="activeTab===tab.key ? tab.color : '#f5f5f5'"
      [style.color]="activeTab===tab.key ? 'white' : '#555'"
      style="padding:8px 16px;border:none;border-radius:20px;cursor:pointer;font-size:13px;font-weight:bold;transition:all 0.2s;">
      {{ tab.icon }} {{ tab.label }}
    </button>
  </div>

  <!-- ON-DEMAND CONTENT -->
  <div style="margin:12px 16px;flex:1;background:white;border-radius:10px;overflow-y:auto;box-shadow:0 2px 8px rgba(0,0,0,0.08);min-height:200px;">
    <div *ngIf="!activeTab" style="display:flex;align-items:center;justify-content:center;height:100%;color:#888;font-size:14px;padding:40px;">
      ← اختر قسماً من الشريط أعلاه لعرض بياناته
    </div>
    <ng-container #onDemandHost></ng-container>
  </div>

</div>

<style>
@keyframes slideIn {
  from { transform: translateY(-20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
</style>
  `,
})
export class AppComponent implements OnInit {
  @ViewChild('facesheetHost',  { read: ViewContainerRef, static: true }) facesheetHost!: ViewContainerRef;
  @ViewChild('vitalsHost',     { read: ViewContainerRef, static: true }) vitalsHost!: ViewContainerRef;
  @ViewChild('diseasesHost',   { read: ViewContainerRef, static: true }) diseasesHost!: ViewContainerRef;
  @ViewChild('historyHost',    { read: ViewContainerRef, static: true }) historyHost!: ViewContainerRef;
  @ViewChild('allergiesHost',  { read: ViewContainerRef, static: true }) allergiesHost!: ViewContainerRef;
  @ViewChild('onDemandHost',   { read: ViewContainerRef, static: true }) onDemandHost!: ViewContainerRef;

  patientId = ''; // المعرف البرمجي (مثل patient-P001)
  patientIdDisplay = ''; // المعرف للعرض (مثل P001)
  activeTab = '';
  onDemandTabs = ON_DEMAND_TABS;
  lastShellMessage = '';

  constructor(private route: ActivatedRoute, private ngZone: NgZone) {}

  async ngOnInit() {
    // قراءة الـ Id من المسار
    this.patientId = this.route.snapshot.params?.['patientKey'] || 'patient-P001';
    this.patientIdDisplay = this.patientId.replace('patient-', '');

    await this.loadInto('facesheet',  this.facesheetHost);
    await this.loadInto('vitals',     this.vitalsHost);
    await this.loadInto('diseases',   this.diseasesHost);
    await this.loadInto('history',    this.historyHost);
    await this.loadInto('allergies',  this.allergiesHost);

    // الاستماع لرسائل الشيل الرئيسي
    window.addEventListener('HIS_SHELL_MESSAGE', (e: any) => {
      this.ngZone.run(() => {
        const target = e.detail.targetPatientId;
        // الفحص الآن أصبح دقيقاً بناءً على الـ Id الكامل للمسار
        if (target === this.patientId) {
          this.lastShellMessage = e.detail.content;
          console.log(`EMR Shell (${this.patientId}) received message!`);
        }
      });
    });
  }

  sendMessageToShell() {
    const msg = prompt('أدخل رسالة لإرسالها إلى إدارة النظام:');
    if (msg) {
      window.dispatchEvent(new CustomEvent('HIS_MFE_MESSAGE', {
        detail: { 
          content: msg, 
          from: `EMR (${this.patientIdDisplay})`, 
          time: new Date().toLocaleTimeString('ar-EG') 
        }
      }));
    }
  }

  private async loadInto(key: string, host: ViewContainerRef) {
    try {
      const remoteUrl = EMR_REMOTES[key];
      const m = await loadRemoteModule({ remoteEntry: remoteUrl, exposedModule: './Component' });
      const comp: Type<any> = m['AppComponent'];
      host.clear();
      const ref = host.createComponent(comp);
      ref.instance.patientId = this.patientIdDisplay; // تمرير المعرف المختصر للموديولات الداخلية
      ref.changeDetectorRef.detectChanges();
    } catch (e) {
      console.error(`Failed to load EMR module [${key}]:`, e);
    }
  }

  async loadOnDemand(key: string) {
    this.activeTab = key;
    this.onDemandHost.clear();
    await this.loadInto(key, this.onDemandHost);
  }
}
