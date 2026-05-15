export interface AppMenu {
  id: string;
  path: string;
  label: string;
  icon: string;
  description: string;
  color: string;
  remoteUrl?: string;
  exposedModule?: string;
  componentName?: string;
  otherArguments?: string;
}

const defaultMenus: AppMenu[] = [
  { 
    id: 'patient-mfe', 
    path: 'patient', 
    label: 'إدارة المرضى', 
    icon: '👨‍⚕️', 
    description: 'تسجيل وإدارة بيانات المرضى وتاريخهم الطبي بكل سهولة.',
    color: '#1abc9c',
    remoteUrl: 'http://localhost:8081/remoteEntry.json',
    exposedModule: './Component',
    componentName: 'AppComponent'
  },
  { 
    id: 'pharmacy-mfe', 
    path: 'pharmacy', 
    label: 'الصيدلية', 
    icon: '💊', 
    description: 'صرف الأدوية والروشتات ومتابعة التأمين الطبي.',
    color: '#f39c12',
    remoteUrl: 'http://localhost:8082/remoteEntry.json',
    exposedModule: './Component',
    componentName: 'AppComponent'
  },
  { 
    id: 'settings', 
    path: 'settings', 
    label: 'إعدادات الموديولات', 
    icon: '⚙️', 
    description: 'شاشة متقدمة لإضافة وربط Micro Frontends جديدة بالنظام.',
    color: '#34495e'
  }
];

// دمج الموديولات الأساسية مع الموديولات المضافة ديناميكياً من قبل المستخدم
const localModules = JSON.parse(localStorage.getItem('dynamic_modules') || '[]');
export const PREDEFINED_MENUS: AppMenu[] = [...defaultMenus, ...localModules];
