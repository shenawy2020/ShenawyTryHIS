import { Component, OnInit, Optional, NgZone, ViewChild, ViewContainerRef, Type } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { loadRemoteModule } from '@angular-architects/native-federation';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  template: `
<div style="padding:20px; font-family: 'Segoe UI', sans-serif; direction: rtl; background: #e8f5e9; border-radius: 12px; border: 2px solid #4caf50; min-height: 500px;">
  
  <!-- Header -->
  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
    <h2 style="color: #2e7d32; margin: 0;">🏥 موديول الصيدلية (Pharmacy MFE)</h2>
    <div style="display: flex; gap: 10px;">
      <button (click)="sendMessageToShell()" 
              style="background: #2e7d32; color: white; border: none; padding: 8px 20px; border-radius: 6px; cursor: pointer; font-weight: bold; transition: background 0.2s;"
              onmouseover="this.style.background='#1b5e20'" onmouseout="this.style.background='#2e7d32'">
        💬 مراسلة الإدارة
      </button>
    </div>
  </div>

  <!-- Messages from Shell -->
  <div *ngIf="shellMessage" style="margin-bottom: 20px; padding: 12px; background: #fff9c4; border: 1px solid #fbc02d; border-radius: 8px; display: flex; justify-content: space-between; align-items: center; animation: fadeIn 0.3s;">
    <div style="font-size: 14px;">
      <strong style="color: #f57f17;">📩 رسالة واردة من الإدارة:</strong> {{ shellMessage }}
    </div>
    <button (click)="shellMessage=''" style="background:none; border:none; color:#f57f17; cursor:pointer; font-size:18px;">&times;</button>
  </div>

  <!-- Shared Library Section -->
  <div style="background: #ffffff; border: 1px dashed #4caf50; border-radius: 10px; padding: 15px; margin-bottom: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.02);">
    <div style="font-size: 11px; color: #2e7d32; font-weight: bold; margin-bottom: 10px;">
      💎 مكونات مستوردة من المكتبة المشتركة (Shared Library Port 8200):
    </div>
    
    <!-- Shared PatientSearch Component Place -->
    <ng-container #searchHost></ng-container>

    <!-- Shared PatientBanner Component Place -->
    <ng-container #bannerHost></ng-container>
  </div>

  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
    <!-- Stock Management -->
    <div style="padding: 15px; background: white; border-radius: 10px; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
      <h3 style="color: #388e3c; font-size: 16px; margin-top: 0;">📦 إدارة المخزون</h3>
      <p style="font-size: 13px; color: #666;">أرسل تنبيهاً فورياً لكافة أطباء الـ EMR عند نقص دواء:</p>
      <button (click)="notifyStockOut('Panadol 500mg')" 
              style="width: 100%; background: #e65100; color: white; border: none; padding: 10px; border-radius: 6px; cursor: pointer; font-weight: bold; margin-bottom: 10px;">
        📢 تنبيه بنقص Panadol
      </button>
      <button (click)="notifyStockOut('Insulin Glargine')" 
              style="width: 100%; background: #e65100; color: white; border: none; padding: 10px; border-radius: 6px; cursor: pointer; font-weight: bold;">
        📢 تنبيه بنقص Insulin
      </button>
    </div>

    <!-- Incoming Requests (Context-driven based on selected patient) -->
    <div style="padding: 15px; background: white; border-radius: 10px; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
      <h3 style="color: #388e3c; font-size: 16px; margin-top: 0;">📋 الروشتات والطلبات الواردة للمريض</h3>
      <div *ngIf="selectedPatientName" style="background: #e8f5e9; border: 1px solid #c8e6c9; padding: 10px; border-radius: 6px; font-size: 13px;">
        📌 روشتة نشطة للمريض: <strong>{{ selectedPatientName }}</strong>
        <ul style="margin: 8px 0 0; padding-right: 20px; line-height: 1.6;">
          <li>Panadol 500mg (عند اللزوم)</li>
          <li>Metformin 500mg (مرتين يومياً)</li>
        </ul>
        <button style="margin-top: 10px; background: #2e7d32; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-weight: bold; font-size: 11px;">
          ✓ صرف الروشتة للمريض
        </button>
      </div>
      <div *ngIf="!selectedPatientName" style="font-size: 13px; color: #888; text-align: center; padding: 20px;">
        🚫 الرجاء البحث واختيار مريض من شريط البحث المشترك أعلاه لعرض وتجهيز روشتته.
      </div>
    </div>
  </div>
</div>

<style>
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
</style>
  `
})
export class AppComponent implements OnInit {
  @ViewChild('searchHost', { read: ViewContainerRef, static: true }) searchHost!: ViewContainerRef;
  @ViewChild('bannerHost', { read: ViewContainerRef, static: true }) bannerHost!: ViewContainerRef;

  otherArguments: string = '';
  shellMessage: string = '';
  currentPatientId = 'P-001';
  selectedPatientName = '';
  bannerRef: any = null;

  constructor(@Optional() private route: ActivatedRoute, private ngZone: NgZone) {}

  async ngOnInit() {
    if (this.route) {
      this.route.data.subscribe(data => {
        this.otherArguments = data?.['otherArguments'] || '';
      });
    }

    // الاستماع لرسائل الشيل الرئيسي مع NgZone
    window.addEventListener('HIS_SHELL_MESSAGE', (e: any) => {
      this.ngZone.run(() => {
        if (!e.detail.targetPatientId) {
          this.shellMessage = e.detail.content;
        }
      });
    });

    // تحميل المكونات المشتركة
    await this.loadSharedSearch();
    await this.loadSharedBanner();

    // الاستماع لاختيار المريض من مكون البحث المشترك
    window.addEventListener('HIS_SHARED_PATIENT_SELECTED', (e: any) => {
      this.ngZone.run(() => {
        const p = e.detail;
        console.log('Pharmacy MFE got selected patient:', p);
        this.currentPatientId = p.id;
        this.selectedPatientName = p.name;
        
        // تحديث البانر المشترك
        if (this.bannerRef) {
          this.bannerRef.instance.patientId = p.id;
          this.bannerRef.changeDetectorRef.detectChanges();
        }
      });
    });
  }

  async loadSharedSearch() {
    try {
      const m = await loadRemoteModule({
        remoteEntry: 'http://localhost:8200/remoteEntry.json',
        exposedModule: './PatientSearch'
      });
      const comp: Type<any> = m['PatientSearchComponent'];
      this.searchHost.clear();
      const ref = this.searchHost.createComponent(comp);
      ref.changeDetectorRef.detectChanges();
    } catch (e) {
      console.error('Failed to load shared search inside Pharmacy:', e);
    }
  }

  async loadSharedBanner() {
    try {
      const m = await loadRemoteModule({
        remoteEntry: 'http://localhost:8200/remoteEntry.json',
        exposedModule: './PatientBanner'
      });
      const comp: Type<any> = m['PatientBannerComponent'];
      this.bannerHost.clear();
      this.bannerRef = this.bannerHost.createComponent(comp);
      this.bannerRef.instance.patientId = this.currentPatientId;
      this.bannerRef.changeDetectorRef.detectChanges();
    } catch (e) {
      console.error('Failed to load shared banner inside Pharmacy:', e);
    }
  }

  notifyStockOut(medName: string) {
    const alertData = { 
      medication: medName, 
      status: 'OUT_OF_STOCK',
      from: 'Pharmacy Dept',
      time: new Date().toLocaleTimeString('ar-EG')
    };

    // 1. إرسال للموديولات الطبية (EMR)
    window.dispatchEvent(new CustomEvent('PHARMACY_STOCK_ALERT', { detail: alertData }));

    // 2. إرسال للشيل الرئيسي لإظهار الإشعار في الأعلى
    window.dispatchEvent(new CustomEvent('HIS_MFE_MESSAGE', {
      detail: { 
        content: `🚨 تنبيه عاجل: نقص في مخزون ${medName}`, 
        from: 'الصيدلية', 
        time: alertData.time 
      }
    }));

    alert(`تم إرسال التنبيه بنقص ${medName} للنظام والشيل الرئيسي.`);
  }

  sendMessageToShell() {
    const msg = prompt('أدخل الرسالة التي تود إرسالها إلى إدارة النظام:');
    if (msg) {
      window.dispatchEvent(new CustomEvent('HIS_MFE_MESSAGE', {
        detail: { 
          content: msg, 
          from: 'الصيدلية (Pharmacy)', 
          time: new Date().toLocaleTimeString('ar-EG') 
        }
      }));
    }
  }
}
