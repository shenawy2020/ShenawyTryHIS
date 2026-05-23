import { Routes } from '@angular/router';
import { loadRemoteModule } from '@angular-architects/native-federation';
import { DashboardComponent } from './dashboard.component';
import { SettingsComponent } from './settings.component';
import { PREDEFINED_MENUS } from './menus.config';

export const routes: Routes = [
  { path: '', pathMatch: 'full', component: DashboardComponent },
  { path: 'settings', component: SettingsComponent }
];

// مسارات القائمة الجانبية (patient, pharmacy, central)
PREDEFINED_MENUS.forEach(menu => {
  if (menu.path !== 'settings') {
    routes.push({
      path: menu.path,
      loadComponent: () =>
        loadRemoteModule(menu.id, menu.exposedModule || './Component')
          .then((m) => m[menu.componentName || 'AppComponent'])
          .catch(err => { console.error(`Error loading ${menu.id}:`, err); return DashboardComponent; }),
      data: { otherArguments: menu.otherArguments || '' }
    });
  }
});

// ══════════════════════════════════════════════════
// EMR Shell — يُفتح داخل HIS Shell كـ Tab منفصل
// كل مريض له مسار خاص: /emr/patient-P001
// ══════════════════════════════════════════════════
routes.push({
  path: 'emr/:patientKey',
  loadComponent: () =>
    loadRemoteModule('emr-shell', './Component')
      .then((m) => m['AppComponent'])
      .catch(err => { console.error('Error loading EMR Shell:', err); return DashboardComponent; }),
  data: {}
});
