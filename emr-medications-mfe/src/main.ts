import { initFederation } from '@angular-architects/native-federation';
fetch('federation.manifest.json').then(r=>r.json()).then(m=>initFederation(m)).catch(e=>console.error(e)).then(_=>import('./bootstrap')).catch(e=>console.error(e));
