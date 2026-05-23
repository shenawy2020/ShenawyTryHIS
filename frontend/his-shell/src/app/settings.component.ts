import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div style="padding: 30px; font-family: sans-serif; background: #fff; height: 100%; border-radius: 8px;">
      <h2 style="color: #2c3e50; border-bottom: 2px solid #ecf0f1; padding-bottom: 10px;">⚙️ إعدادات النظام (إضافة موديول جديد ديناميكياً)</h2>
      <p style="color: #7f8c8d;">من هنا يمكنك تعريف شاشة أو موديول جديد في وقت التشغيل (Runtime) بدون تعديل الكود الأساسي.</p>

      <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-top: 20px; border: 1px solid #e9ecef;">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
          <div>
            <label style="display: block; font-weight: bold; margin-bottom: 5px;">اسم الموديول (كمعرف MFE)</label>
            <input type="text" [(ngModel)]="newModule.id" placeholder="مثال: his-patient-mfe" style="width: 100%; padding: 10px; border: 1px solid #bdc3c7; border-radius: 4px; box-sizing: border-box;">
          </div>
          <div>
            <label style="display: block; font-weight: bold; margin-bottom: 5px;">المسار (Path) يجب أن يكون فريداً</label>
            <input type="text" [(ngModel)]="newModule.path" placeholder="مثال: patient-2" style="width: 100%; padding: 10px; border: 1px solid #bdc3c7; border-radius: 4px; box-sizing: border-box;">
          </div>
          <div>
            <label style="display: block; font-weight: bold; margin-bottom: 5px;">عنوان الشاشة للمستخدم</label>
            <input type="text" [(ngModel)]="newModule.label" placeholder="مثال: الموارد البشرية" style="width: 100%; padding: 10px; border: 1px solid #bdc3c7; border-radius: 4px; box-sizing: border-box;">
          </div>
          <div>
            <label style="display: block; font-weight: bold; margin-bottom: 5px;">الأيقونة (إيموجي)</label>
            <input type="text" [(ngModel)]="newModule.icon" placeholder="مثال: 👥" style="width: 100%; padding: 10px; border: 1px solid #bdc3c7; border-radius: 4px; box-sizing: border-box;">
          </div>
          <div>
            <label style="display: block; font-weight: bold; margin-bottom: 5px;">رابط الـ MFE (Remote URL)</label>
            <select [(ngModel)]="newModule.remoteUrl" style="width: 100%; padding: 10px; border: 1px solid #bdc3c7; border-radius: 4px; box-sizing: border-box;">
              <option value="">-- اختر الرابط --</option>
              <option value="http://localhost:8081/remoteEntry.json">إدارة المرضى (8081)</option>
              <option value="http://localhost:8082/remoteEntry.json">الصيدلية (8082)</option>
              <option value="http://localhost:8083/remoteEntry.json">السنترال (8083)</option>
            </select>
          </div>
          <div>
            <label style="display: block; font-weight: bold; margin-bottom: 5px;">اللون الخاص بالكارت</label>
            <input type="color" [(ngModel)]="newModule.color" style="width: 100%; height: 40px; border: 1px solid #bdc3c7; border-radius: 4px; box-sizing: border-box;">
          </div>
          <div>
            <label style="display: block; font-weight: bold; margin-bottom: 5px;">الموديول المعروض (Exposed Module)</label>
            <input type="text" [(ngModel)]="newModule.exposedModule" placeholder="مثال: ./Component أو ./Inpatients" style="width: 100%; padding: 10px; border: 1px solid #bdc3c7; border-radius: 4px; box-sizing: border-box;">
          </div>
          <div>
            <label style="display: block; font-weight: bold; margin-bottom: 5px;">اسم الكومبوننت (Component Name)</label>
            <input type="text" [(ngModel)]="newModule.componentName" placeholder="مثال: AppComponent أو InpatientsComponent" style="width: 100%; padding: 10px; border: 1px solid #bdc3c7; border-radius: 4px; box-sizing: border-box;">
          </div>
          <div style="grid-column: span 2;">
            <label style="display: block; font-weight: bold; margin-bottom: 5px;">بيانات إضافية (Other Arguments)</label>
            <input type="text" [(ngModel)]="newModule.otherArguments" placeholder="اكتب أي بيانات لإرسالها لهذه الشاشة..." style="width: 100%; padding: 10px; border: 1px solid #bdc3c7; border-radius: 4px; box-sizing: border-box;">
          </div>
          <div style="grid-column: span 2;">
            <label style="display: block; font-weight: bold; margin-bottom: 5px;">وصف الشاشة</label>
            <input type="text" [(ngModel)]="newModule.description" placeholder="إدارة شؤون الموظفين..." style="width: 100%; padding: 10px; border: 1px solid #bdc3c7; border-radius: 4px; box-sizing: border-box;">
          </div>
        </div>
        
        <button (click)="saveModule()" style="background-color: #2980b9; color: white; border: none; padding: 12px 20px; font-size: 16px; border-radius: 4px; cursor: pointer; margin-top: 20px; font-weight: bold;">➕ إضافة الموديول وحفظ الإعدادات</button>
      </div>

      <h3 style="margin-top: 40px;">الموديولات المعرفة حالياً:</h3>
      <table style="width: 100%; border-collapse: collapse; margin-top: 10px; text-align: right;">
        <thead>
          <tr style="background-color: #ecf0f1; border-bottom: 2px solid #bdc3c7;">
            <th style="padding: 10px;">الأيقونة والاسم</th>
            <th style="padding: 10px;">المسار (Path)</th>
            <th style="padding: 10px;">بيانات (Args)</th>
            <th style="padding: 10px;">إجراءات</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let m of savedModules" style="border-bottom: 1px solid #eee;">
            <td style="padding: 10px;">{{ m.icon }} {{ m.label }}</td>
            <td style="padding: 10px; color: #7f8c8d; direction: ltr; text-align: right;">{{ m.path }}</td>
            <td style="padding: 10px; color: #7f8c8d;">{{ m.otherArguments || 'لا يوجد' }}</td>
            <td style="padding: 10px;">
              <button *ngIf="!m.isSystem" (click)="editModule(m)" style="background: #f1c40f; color: #fff; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; margin-left: 5px; font-weight: bold;">تعديل</button>
              <button *ngIf="m.id !== 'settings'" (click)="copyModule(m)" style="background: #3498db; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; margin-left: 5px;">نسخ</button>
              <button *ngIf="!m.isSystem" (click)="deleteModule(m.path)" style="background: #e74c3c; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">حذف</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `
})
export class SettingsComponent {
  newModule = {
    id: '',
    path: '',
    label: '',
    icon: '',
    description: '',
    color: '#3498db',
    remoteUrl: '',
    exposedModule: './Component',
    componentName: 'AppComponent',
    otherArguments: ''
  };

  savedModules: any[] = [];

  constructor() {
    this.loadModules();
  }

  loadModules() {
    const defaultModules = [
      { id: 'patient-mfe', path: 'patient', label: 'إدارة المرضى', icon: '👨‍⚕️', description: 'تسجيل المرضى.', color: '#1abc9c', remoteUrl: 'http://localhost:8081/remoteEntry.json', exposedModule: './Component', componentName: 'AppComponent', isSystem: true },
      { id: 'pharmacy-mfe', path: 'pharmacy', label: 'الصيدلية', icon: '💊', description: 'صرف الأدوية.', color: '#f39c12', remoteUrl: 'http://localhost:8082/remoteEntry.json', exposedModule: './Component', componentName: 'AppComponent', isSystem: true },
      { id: 'settings', path: 'settings', label: 'إعدادات النظام', icon: '⚙️', description: 'إضافة وإدارة الموديولات.', color: '#34495e', isSystem: true }
    ];
    
    const local = JSON.parse(localStorage.getItem('dynamic_modules') || '[]');
    this.savedModules = [...defaultModules, ...local];
  }

  editModule(m: any) {
    this.newModule = { ...m };
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  copyModule(m: any) {
    this.newModule = { ...m };
    this.newModule.path = m.path + '-copy';
    this.newModule.label = m.label + ' (نسخة)';
    // Remove isSystem so the copied one can be deleted
    delete (this.newModule as any).isSystem;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  saveModule() {
    if (!this.newModule.id || !this.newModule.remoteUrl) {
      alert('يجب إدخال المعرف والرابط (Remote URL) على الأقل!');
      return;
    }
    
    let local = JSON.parse(localStorage.getItem('dynamic_modules') || '[]');
    const existingIndex = local.findIndex((m: any) => m.path === this.newModule.path);
    
    if (existingIndex !== -1) {
      // تعديل
      local[existingIndex] = { ...this.newModule };
    } else {
      // إضافة جديدة
      local.push({ ...this.newModule });
    }
    
    localStorage.setItem('dynamic_modules', JSON.stringify(local));
    
    alert('تم الحفظ بنجاح! سيتم إعادة تحميل الصفحة لتطبيق التغييرات.');
    window.location.reload();
  }

  deleteModule(path: string) {
    if (!confirm('هل أنت متأكد من حذف هذا الموديول؟')) return;
    let local = JSON.parse(localStorage.getItem('dynamic_modules') || '[]');
    local = local.filter((m: any) => m.path !== path);
    localStorage.setItem('dynamic_modules', JSON.stringify(local));
    window.location.reload();
  }
}
