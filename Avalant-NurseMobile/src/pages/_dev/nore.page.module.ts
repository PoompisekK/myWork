import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslationModule } from 'angular-l10n';
import { LayoutModule } from '../../layout-module/layout.module';
import { NoreTestPage } from './nore.page';

/**
 * Nore page module
 * @author NorrapatN
 * @since Fri Jul 07 2017
 */
@NgModule({
  imports: [
    IonicPageModule.forChild(NoreTestPage),
    TranslationModule,
    LayoutModule,
  ],
  declarations: [
    NoreTestPage,
  ]
})
export class NorePageModule {

}
