import { initFederation } from '@angular-architects/native-federation';

fetch('federation.manifest.json')
  .then(res => res.json())
  .then(manifest => {
    // Add dynamic modules from localStorage
    const localModules = JSON.parse(localStorage.getItem('dynamic_modules') || '[]');
    localModules.forEach((m: any) => {
      if (m.id && m.remoteUrl) {
        manifest[m.id] = m.remoteUrl;
      }
    });
    return initFederation(manifest);
  })
  .catch(err => console.error(err))
  .then(_ => import('./bootstrap'))
  .catch(err => console.error(err));
