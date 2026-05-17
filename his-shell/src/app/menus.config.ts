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
    id: 'lab-mfe', 
    path: 'lab', 
    label: 'المختبر والتحاليل', 
    icon: '🔬', 
    description: 'عرض نتائج التحاليل والتحكم الكامل في العينات الطبية.',
    color: '#6a1b9a',
    remoteUrl: 'http://localhost:8102/remoteEntry.json',
    exposedModule: './Component',
    componentName: 'AppComponent'
  },
  { 
    id: 'central-mfe', 
    path: 'inpatients', 
    label: 'المرضى الداخليين', 
    icon: '🛏️', 
    description: 'متابعة المرضى المنومين وتوزيع الغرف.',
    color: '#e91e63',
    remoteUrl: 'http://localhost:8083/remoteEntry.json',
    exposedModule: './Inpatients',
    componentName: 'InpatientsComponent'
  },
  { 
    id: 'central-mfe', 
    path: 'outpatients', 
    label: 'المرضى الخارجيين', 
    icon: '🚶‍♂️', 
    description: 'مواعيد العيادات الخارجية وحجوزات اليوم.',
    color: '#2196f3',
    remoteUrl: 'http://localhost:8083/remoteEntry.json',
    exposedModule: './Outpatients',
    componentName: 'OutpatientsComponent'
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
