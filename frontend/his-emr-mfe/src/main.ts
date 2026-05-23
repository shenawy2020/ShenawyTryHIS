import { initFederation } from '@angular-architects/native-federation';

fetch('federation.manifest.json')
  .then(res => res.json())
  .then(manifest => initFederation(manifest))
  .catch(err => console.error(err))
  .then(_ => import('./bootstrap'))
  .catch(err => console.error(err));
