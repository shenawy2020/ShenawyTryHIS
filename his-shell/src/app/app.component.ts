import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { RouterOutlet, RouterLink, Router, NavigationEnd, RouteReuseStrategy } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CustomRouteReuseStrategy } from './custom-route-reuse-strategy';
import { PREDEFINED_MENUS } from './menus.config';

export interface Tab {
  path: string;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, OnDestroy {
  menus = PREDEFINED_MENUS;
  tabs: Tab[] = [];
  activePath: string = '';
  messages: any[] = [];

  constructor(
    public router: Router, 
    private routeReuseStrategy: RouteReuseStrategy,
    private ngZone: NgZone
  ) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const path = event.urlAfterRedirects.split('?')[0].replace(/^\//, '');
        this.activePath = path;
        this.addTabIfNeeded(path);
      }
    });
  }

  ngOnInit() {
    window.addEventListener('message', this.handleEMRMessage);
    
    window.addEventListener('HIS_MFE_MESSAGE', (e: any) => {
      this.ngZone.run(() => {
        this.messages.unshift(e.detail);
        if (this.messages.length > 5) this.messages.pop();
        console.log('Shell received message:', e.detail);
      });
    });
  }

  ngOnDestroy() {
    window.removeEventListener('message', this.handleEMRMessage);
  }

  handleEMRMessage = (event: MessageEvent) => {
    if (event.data?.type === 'OPEN_EMR') {
      const { patientId, patientName } = event.data;
      const path = `emr/patient-${patientId}`;
      if (!this.tabs.find(t => t.path === path)) {
        this.tabs.push({ path, label: patientName || `مريض ${patientId}`, icon: '👤' });
      }
      this.router.navigate([path], { queryParams: { patientId, patientName } });
    }
  };

  addTabIfNeeded(path: string) {
    const exists = this.tabs.find(t => t.path === path);
    if (!exists) {
      if (path === '') {
        this.tabs.unshift({ path: '', label: 'الداشبورد', icon: '🏠' });
        return;
      }
      if (path.startsWith('emr/')) return;

      const predefinedMenu = this.menus.find(m => m.path === path);
      if (predefinedMenu) {
        this.tabs.push({
          path: predefinedMenu.path,
          label: predefinedMenu.label,
          icon: predefinedMenu.icon
        });
      }
    }
  }

  closeTab(path: string, event: Event) {
    event.stopPropagation();
    event.preventDefault();
    this.tabs = this.tabs.filter(t => t.path !== path);
    const strategy = this.routeReuseStrategy as CustomRouteReuseStrategy;
    if (strategy.removeCachedRoute) strategy.removeCachedRoute(path);
    if (this.activePath === path) {
      if (this.tabs.length > 0) {
        this.router.navigate(['/' + this.tabs[this.tabs.length - 1].path]);
      } else {
        this.router.navigate(['/']);
      }
    }
  }

  refreshTab(path: string, event: Event) {
    event.stopPropagation();
    event.preventDefault();
    const strategy = this.routeReuseStrategy as CustomRouteReuseStrategy;
    if (this.activePath === path) {
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        if (strategy.removeCachedRoute) strategy.removeCachedRoute(path);
        this.router.navigate(['/' + path]);
      });
    } else {
      if (strategy.removeCachedRoute) strategy.removeCachedRoute(path);
      this.router.navigate(['/' + path]);
    }
  }
  
  sendGlobalMessage() {
    const msg = prompt('أدخل الرسالة التي تود إرسالها:');
    if (msg) {
      let targetPatientId = null;
      // تحسين استخراج الـ Id ليتطابق مع ما يتم استقباله في الـ EMR
      if (this.activePath.startsWith('emr/')) {
        targetPatientId = this.activePath.split('/').pop(); // سيأخذ patient-P001 مثلاً
      }

      window.dispatchEvent(new CustomEvent('HIS_SHELL_MESSAGE', { 
        detail: { 
          content: msg, 
          from: 'Main Shell', 
          targetPatientId: targetPatientId,
          time: new Date().toLocaleTimeString('ar-EG') 
        } 
      }));
    }
  }
}
