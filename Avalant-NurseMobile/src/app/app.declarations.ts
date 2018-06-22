import { ProductInfoSlidesComponent } from '../components/product-info-slides/product-info-slides.component';
import { StorePopular } from '../components/store-popular/store-popular';
import { NinePage } from '../pages/_dev/nine.page';
import { NinePage2 } from '../pages/_dev/nine2.page';
import { OrderPaymentPage } from '../pages/payment-page/order-payment.page';
import { PaymentSuccessPage } from '../pages/payment-page/payment-success.page';
import { PaymentComponent } from '../pages/payment-page/payment.page';
import {
  UserProfileAttachmentInfoPage,
} from '../pages/user-profiles-page/attached-file-info/user-profile-attachment-info.page';
import { UserProfileContactInfoPage } from '../pages/user-profiles-page/contact-info/user-profile-contact-info.page';
import { UserProfileGeneralInfoPage } from '../pages/user-profiles-page/general-info/user-profile-general-info.page';
import { UserProfilePersonInfoPage } from '../pages/user-profiles-page/personal-info/user-profile-person-info.page';
import { UserProfileSpecifyInfoPage } from '../pages/user-profiles-page/specification-info/user-profile-specify-info.page';
import { MyApp } from './app.component';
import { DynamicStatusBarDirective } from './directive/dynamic-statusbar.directive';
import { CartPipe } from '../pipes/cart/cart.pipe';
import { ShopTypePipe } from '../pipes/cart/shop-type.pipe';
import { SettingsPage } from '../pages/settings-page/settings.page';

/***
 * One place Declarations
 * @author NorrapatN
 * @since Thu May 18 2017
 */

export const APP_PAGES: any[] = [
  SettingsPage,
  NinePage,
  NinePage2,
  UserProfilePersonInfoPage,
  UserProfileGeneralInfoPage,
  UserProfileContactInfoPage,
  UserProfileSpecifyInfoPage,
  UserProfileAttachmentInfoPage,
  OrderPaymentPage,
  PaymentSuccessPage,
];

export function getPageByPath(path: string): any {
  const PAGE = {
    'shop': 'StorePage',
    'donation': 'DonationPage',
    'group-event': 'GroupEventPage',
    'funding': null, // TODO: 
    'course': 'CoursePage',
    'privilege': 'PrivilegePage', // TODO: 
  };

  return PAGE[path];
}

export const APP_COMPONENTS: any[] = [
  MyApp,
  ProductInfoSlidesComponent,
  PaymentComponent,
  PaymentSuccessPage,
  StorePopular,
];

export const APP_DIRECTIVES: any[] = [
  DynamicStatusBarDirective,
];

export const APP_PIPES: any[] = [
  CartPipe,
  ShopTypePipe,
];

export const APP_ENTRY_COMPONENTS: any[] = [
  ...APP_PAGES
];

export const APP_DECLARATIONS: any[] = [
  ...APP_PAGES,
  ...APP_COMPONENTS,
  ...APP_DIRECTIVES,
  ...APP_PIPES,

];
