import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app.module';
// import { isWebDev } from '../constants/environment';
import './custom-polyfills';

platformBrowserDynamic().bootstrapModule(AppModule);

/*
declare var Origami: any;

if (!isWebDev()) {
  // Enable FastClick
  var attachFastClick = Origami.fastclick;
  attachFastClick(document.body);
}
*/
