import { Component, OnInit, Optional, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  template: `
<div style="padding:20px; font-family: 'Segoe UI', sans-serif; direction: rtl; background: #e8f5e9; border-radius: 12px; border: 2px solid #4caf50; min-height: 400px;">
  
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

    <!-- Incoming Requests -->
    <div style="padding: 15px; background: white; border-radius: 10px; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
      <h3 style="color: #388e3c; font-size: 16px; margin-top: 0;">📋 الطلبات الواردة</h3>
      <p style="font-size: 13px; color: #888;">لا يوجد طلبات جديدة حالياً.</p>
    </div>
  </div>
</div>

<style>
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
</style>
  `
})
export class AppComponent implements OnInit {
  otherArguments: string = '';
  shellMessage: string = '';

  constructor(@Optional() private route: ActivatedRoute, private ngZone: NgZone) {}

  ngOnInit() {
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
