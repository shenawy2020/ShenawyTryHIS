import { Component, OnInit, ViewChild, ViewContainerRef, Type } from '@angular/core';
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
};

const ON_DEMAND_TABS = [
  { key: 'notes',       label: 'Progress Notes', icon: '📝', color: '#1976d2' },
  { key: 'medications', label: 'الأدوية',         icon: '💊', color: '#e65100' },
  { key: 'labs',        label: 'التحاليل',        icon: '🔬', color: '#6a1b9a' },
  { key: 'radiology',   label: 'الأشعة',          icon: '📷', color: '#01579b' },
];

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  template: `
<div style="height:100%;display:flex;flex-direction:column;background:#f0f4f8;font-family:'Segoe UI',sans-serif;direction:rtl;">

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
    <div style="flex:1;"></div>
    <span style="background:#e3f2fd;color:#1565c0;padding:6px 12px;border-radius:8px;font-size:12px;font-weight:bold;">
      🆔 PatientId: {{ patientId }}
    </span>
  </div>

  <!-- ON-DEMAND CONTENT -->
  <div style="margin:12px 16px;flex:1;background:white;border-radius:10px;overflow-y:auto;box-shadow:0 2px 8px rgba(0,0,0,0.08);min-height:200px;">
    <div *ngIf="!activeTab" style="display:flex;align-items:center;justify-content:center;height:100%;color:#888;font-size:14px;padding:40px;">
      ← اختر قسماً من الشريط أعلاه لعرض بياناته
    </div>
    <ng-container #onDemandHost></ng-container>
  </div>

</div>
  `,
})
export class AppComponent implements OnInit {
  @ViewChild('facesheetHost',  { read: ViewContainerRef, static: true }) facesheetHost!: ViewContainerRef;
  @ViewChild('vitalsHost',     { read: ViewContainerRef, static: true }) vitalsHost!: ViewContainerRef;
  @ViewChild('diseasesHost',   { read: ViewContainerRef, static: true }) diseasesHost!: ViewContainerRef;
  @ViewChild('historyHost',    { read: ViewContainerRef, static: true }) historyHost!: ViewContainerRef;
  @ViewChild('allergiesHost',  { read: ViewContainerRef, static: true }) allergiesHost!: ViewContainerRef;
  @ViewChild('onDemandHost',   { read: ViewContainerRef, static: true }) onDemandHost!: ViewContainerRef;

  patientId = '';
  activeTab = '';
  onDemandTabs = ON_DEMAND_TABS;
  private loadedOnDemand = new Set<string>();

  constructor(private route: ActivatedRoute) {}

  async ngOnInit() {
    // قراءة patientId من الـ route params أو queryParams
    this.patientId = this.route.snapshot.params?.['patientKey']
      || this.route.snapshot.queryParams?.['patientId']
      || 'P-001';

    // تحميل المكونات الأساسية (Always Visible)
    await this.loadInto('facesheet',  this.facesheetHost);
    await this.loadInto('vitals',     this.vitalsHost);
    await this.loadInto('diseases',   this.diseasesHost);
    await this.loadInto('history',    this.historyHost);
    await this.loadInto('allergies',  this.allergiesHost);
  }

  private async loadInto(key: string, host: ViewContainerRef) {
    try {
      const remoteUrl = EMR_REMOTES[key];
      const m = await loadRemoteModule({ remoteEntry: remoteUrl, exposedModule: './Component' });
      const comp: Type<any> = m['AppComponent'];
      host.clear();
      const ref = host.createComponent(comp);
      ref.instance.patientId = this.patientId;
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
