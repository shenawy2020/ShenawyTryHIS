import { RouteReuseStrategy, ActivatedRouteSnapshot, DetachedRouteHandle } from '@angular/router';

export class CustomRouteReuseStrategy implements RouteReuseStrategy {
  private handlers: { [key: string]: DetachedRouteHandle } = {};

  private getKey(route: ActivatedRouteSnapshot): string | undefined {
    if (!route.routeConfig?.path) return undefined;
    // لمسارات EMR الديناميكية، نستخدم المسار الكامل مع الـ params
    if (route.routeConfig.path === 'emr/:patientKey') {
      return `emr/${route.params['patientKey']}`;
    }
    return route.routeConfig.path;
  }

  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    return this.getKey(route) !== undefined;
  }

  store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
    const key = this.getKey(route);
    if (key !== undefined) {
      this.handlers[key] = handle;
    }
  }

  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    const key = this.getKey(route);
    return key !== undefined && !!this.handlers[key];
  }

  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
    const key = this.getKey(route);
    if (!key) return null;
    return this.handlers[key] || null;
  }

  shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    // لمسارات EMR، نفرّق بين مرضى مختلفين
    if (future.routeConfig?.path === 'emr/:patientKey') {
      return future.params['patientKey'] === curr.params['patientKey'];
    }
    return future.routeConfig === curr.routeConfig;
  }

  public removeCachedRoute(path: string): void {
    if (this.handlers[path]) {
      try {
        const handle: any = this.handlers[path];
        if (handle?.componentRef) handle.componentRef.destroy();
      } catch (e) {
        console.error('Error destroying component:', e);
      }
      delete this.handlers[path];
    }
  }
}
