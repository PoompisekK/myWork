import { ValidatorDirective } from '../app/directive/validation.directive';
import { IonDigitKeyboard } from '../components/ion-digit-keyboard/ion-digit-keyboard';
import { ImgSlidePipe } from '../pipes/cart/img-slide.pipe';
import { SumProductFeePipe } from '../pipes/cart/sum-product-fee.pipe';
import { SumProductPricePipe } from '../pipes/cart/sum-product-price.pipe';
import { ThaiDatePipeFromString } from '../pipes/cart/thai-date-from-string.pipe';
import { thaiDatePipe } from '../pipes/cart/thai-date.pipe';
import { BrandItemComponent } from './components/brand-item/brand-item.component';
import { DateTimeBe } from './components/datetime-be/datetime-be.component';
import { UearnFabsComponent } from './components/fabs/fabs.component';
import { UearnFabsController } from './components/fabs/fabs.controller';
import { HeaderBarComponent } from './components/header-bar/header-bar.component';
import { HeaderBarController } from './components/header-bar/header-bar.controller';
import { NumberSpinnerComponent } from './components/number-spinner/number-spinner.component';
import { OrderSuccessComponent } from './components/order-success/order-success.component';
import { ReadMoreComponent } from './components/read-more/read-more.component';
import { SelectOptionsListPopoverPage } from './components/select-popover/select-option.popover';
import { SlideMenuItemComponent } from './components/slide-menu/slide-menu-item.component';
import { SlideMenuComponent } from './components/slide-menu/slide-menu.component';
import { StepBarComponent } from './components/step-bar/step-bar.component';
import { Autoresize } from './directives/autoresize';
import { FocuserDirective } from './directives/focus-input.directive';
import { ImageSafeDirective } from './directives/img-safe/img-safe.directive';
import { IonSegmentHotfix } from './directives/ion-segment/ion-segment.directive';
import { ValidateInputDirective } from './directives/validate-input.directive';
import { BahtPipe } from './pipes/baht.pipe';
import { ImageKeyPipe } from './pipes/image-key.pipe';
import { KeysPipe } from './pipes/keys.pipe';
import { NumberOnlyPipe } from './pipes/number-only.pipe';
import { SafeStylePipe } from './pipes/safe-style.pipe';
import { SafeUrlPipe } from './pipes/safe-url.pipe';

/***
 * Layout Declarations file
 * @author NorrapatN
 * @since Tue May 16 2017
 */
export const LAYOUT_COMPONENTS: any[] = [
  // Components go here

  HeaderBarComponent,
  SelectOptionsListPopoverPage,
  NumberSpinnerComponent,
  OrderSuccessComponent,

  DateTimeBe,
  UearnFabsComponent,
  IonDigitKeyboard,
  BrandItemComponent,
  SlideMenuComponent,
  SlideMenuItemComponent,
  StepBarComponent,
  ReadMoreComponent,
];

export const LAYOUT_DIRECTIVES: any[] = [
  // Directives go here
  IonSegmentHotfix,
  Autoresize,
  ValidatorDirective,
  ValidateInputDirective,
  // MaskDirective,
  ImageSafeDirective,
  FocuserDirective,
];

export const LAYOUT_PIPES: any[] = [
  // Pipes go here
  KeysPipe,
  SafeUrlPipe,
  SafeStylePipe,
  ImageKeyPipe,
  SumProductPricePipe,
  SumProductFeePipe,
  ImgSlidePipe,
  NumberOnlyPipe,
  thaiDatePipe,
  ThaiDatePipeFromString,
  BahtPipe,
];

export const LAYOUT_ENTRY_COMPONENTS: any[] = [
  // Entry components

  HeaderBarComponent,
  SelectOptionsListPopoverPage,
  UearnFabsComponent,
  IonDigitKeyboard,
];

export const LAYOUT_DECLARATIONS: any[] = [
  ...LAYOUT_COMPONENTS,
  ...LAYOUT_DIRECTIVES,
  ...LAYOUT_PIPES,
];

export const LAYOUT_EXPORTS: any[] = [
  ...LAYOUT_COMPONENTS,
  ...LAYOUT_DIRECTIVES,
  ...LAYOUT_PIPES,
];

export const LAYOUT_PROVIDERS: any[] = [
  // Export
  // Providers/Services ?
  HeaderBarController,
  UearnFabsController,
];
