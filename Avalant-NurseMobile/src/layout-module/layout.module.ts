import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, ModuleWithProviders, NgModule } from '@angular/core';
import { TranslationModule } from 'angular-l10n';
import { TextMaskModule } from 'angular2-text-mask';
import { IonicModule } from 'ionic-angular';

import { LAYOUT_DECLARATIONS, LAYOUT_ENTRY_COMPONENTS, LAYOUT_EXPORTS, LAYOUT_PROVIDERS } from './layout.declarations';

/**
 * Layout Module
 * 
 * Shared Layout module for application
 * 
 * @author NorrapatN
 * @since Tue May 16 2017
 */

@NgModule({
  imports: [
    // Import required angular modules
    IonicModule,
    CommonModule,
    TranslationModule, // don't use forChild -- It will new instantiate translation for child
    TextMaskModule
  ],
  exports: [
    // Expose any components
    ...LAYOUT_EXPORTS,
  ],
  declarations: [
    ...LAYOUT_DECLARATIONS,
  ],
  entryComponents: [
    ...LAYOUT_ENTRY_COMPONENTS,
  ],
  // providers: 
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
  ]
})
export class LayoutModule {

  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: LayoutModule,
      providers: [
        ...LAYOUT_PROVIDERS,
      ],
    };
  }
}
