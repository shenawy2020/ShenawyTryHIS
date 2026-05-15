import { Routes } from '@angular/router';
import { loadRemoteModule } from '@angular-architects/native-federation';

import { DashboardComponent } from './dashboard.component';
import { SettingsComponent } from './settings.component';
import { PREDEFINED_MENUS } from './menus.config';

export const routes: Routes = [
  { path: '', pathMatch: 'full', component: DashboardComponent },
  { path: 'settings', component: SettingsComponent }
];

// تسجيل موديولات القائمة الجانبية
PREDEFINED_MENUS.forEach(menu => {
  if (menu.path !== 'settings') {
    routes.push({
      path: menu.path,
      loadComponent: () =>
        loadRemoteModule(menu.id, menu.exposedModule || './Component')
          .then((m) => m[menu.componentName || 'AppComponent'])
          .catch(err => {
            console.error(`Error loading remote module ${menu.id}:`, err);
            return DashboardComponent;
          }),
      data: { otherArguments: menu.otherArguments || '' }
    });
  }
});

// ==========================================
// مسار EMR الديناميكي: /emr/patient-{id}
// يُفتح برمجياً عند الضغط على مريض من القائمة
// ==========================================
routes.push({
  path: 'emr/:patientKey',
  loadComponent: () =>
    loadRemoteModule('emr-mfe', './Component')
      .then((m) => m['AppComponent'])
      .catch(err => {
        console.error('Error loading EMR module:', err);
        return DashboardComponent;
      }),
  data: {}
});
