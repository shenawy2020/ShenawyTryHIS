import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PREDEFINED_MENUS } from './menus.config';
import { loadRemoteModule } from '@angular-architects/native-federation';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="padding: 20px; color: #2c3e50; font-family: sans-serif;">
      
      <!-- Top Component: Inpatients -->
      <div style="margin-bottom: 30px;">
        <ng-container *ngComponentOutlet="inpatientsComponent"></ng-container>
        <div *ngIf="!inpatientsComponent" style="padding: 20px; background: #f8d7da; color: #721c24; border-radius: 5px;">جاري تحميل مكون المرضى الداخليين... تأكد أن موديول Central يعمل.</div>
      </div>

      <div style="text-align: center; margin-bottom: 40px; border-top: 2px dashed #bdc3c7; border-bottom: 2px dashed #bdc3c7; padding: 30px 0; background: white; border-radius: 8px;">
        <h1 style="font-size: 32px; color: #34495e; margin-bottom: 10px;">🏥 مرحباً بك في نظام HIS</h1>
        <p style="font-size: 16px; color: #7f8c8d;">اختر الموديول الذي ترغب بفتحه من القائمة أدناه لتشغيله في تبويب منفصل</p>
        
        <div style="display: flex; justify-content: center; gap: 20px; margin-top: 30px; flex-wrap: wrap;">
          <div *ngFor="let menu of menus" 
               (click)="openModule(menu.path)"
               [style.border-top-color]="menu.color"
               style="background: #f4f6f8; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); width: 200px; border-top: 4px solid; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s;"
               onmouseover="this.style.transform='translateY(-3px)'; this.style.boxShadow='0 8px 12px rgba(0,0,0,0.1)'"
               onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 4px rgba(0,0,0,0.05)'">
               
            <h2 style="margin: 0 0 10px 0; font-size: 18px;">{{ menu.icon }} {{ menu.label }}</h2>
            <p style="color: #95a5a6; margin: 0; line-height: 1.4; font-size: 12px;">{{ menu.description }}</p>
          </div>
        </div>
      </div>

      <!-- Bottom Component: Outpatients -->
      <div style="margin-top: 30px;">
        <ng-container *ngComponentOutlet="outpatientsComponent"></ng-container>
        <div *ngIf="!outpatientsComponent" style="padding: 20px; background: #cce5ff; color: #004085; border-radius: 5px;">جاري تحميل مكون المرضى الخارجيين...</div>
      </div>

    </div>
  `
})
export class DashboardComponent implements OnInit {
  menus = PREDEFINED_MENUS;
  inpatientsComponent: any;
  outpatientsComponent: any;

  constructor(private router: Router) {}

  async ngOnInit() {
    try {
      const m1 = await loadRemoteModule({
        remoteEntry: 'http://localhost:8083/remoteEntry.json',
        exposedModule: './Inpatients'
      });
      this.inpatientsComponent = m1.InpatientsComponent;
    } catch (e) {
      console.error('Error loading Inpatients:', e);
    }

    try {
      const m2 = await loadRemoteModule({
        remoteEntry: 'http://localhost:8083/remoteEntry.json',
        exposedModule: './Outpatients'
      });
      this.outpatientsComponent = m2.OutpatientsComponent;
    } catch (e) {
      console.error('Error loading Outpatients:', e);
    }
  }

  openModule(path: string) {
    this.router.navigate(['/' + path]);
  }
}
