import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PlacePage } from './place.page';
import { TranslationModule } from "angular-l10n";

@NgModule({
  declarations: [
    PlacePage,
  ],
  imports: [
    IonicPageModule.forChild(PlacePage),
    TranslationModule.forChild(),
  ],
  exports: [
    PlacePage
  ]
})
export class PlacePageModule {}
