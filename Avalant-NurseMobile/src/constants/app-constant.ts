/**
 * @author Bundit.Ng
 * @since  Wed May 31 2017
 * Copyright (c) 2017 Avalant Co.,Ltd.
 */

module OrganizeCode {
    export const ORG_DEFAULT = { code: "dmp", id: '1' };
    export const ORG_YBAT = { code: "ybat", id: '2' };
    export const ORG_AEK = { code: "aek", id: '5' };
    export const ORG_WORKFORCE = { code: "workforce", id: '47' };
}
module AddressType {
    export const SHIPPING: string = "1";
    export const HOME: string = "2";
    export const MAILING: string = "3";
    export const BUSINESS: string = "4";
    export const OFFICE: string = "5";
    export const SENDDOC: string = "6";

}
module Language {
    export const THAI = "TH";
    export const ENGLISH = "EN";
}

module SignInType {
    export const DMP: string = "1";
    export const SOCIAL: string = "2";
    export const WORKFORCE: string = OrganizeCode.ORG_WORKFORCE.id;

    export const WEB_APPLICATION: string = "1";
    export const MOBILE_APPLICATION: string = "2";
    export const FACEBOOK: string = "3";
    export const GOOGLEPLUS: string = "4";
    export const LINKEDIN: string = "5";
}

module ResponseConstEAF {
    export const MessageConstEAF = {
        MESSAGE_OK_SAVE: "Ok Save."
    };
    export const StatusConstEAF = {
        SUCCESS: "Success.",
        FAILED: "Fialed.",

        SUCCESS_LIST: ('Success success Success. 1 s S SUCCESS'.toLowerCase()).split(' '),
        FAILED_LIST: ('Fail Failed. Failed failed fialed Fialed. 0 f F FAIL'.toLowerCase()).split(' '),

        OKAY_LIST: 'ok okay'.split(' '),
    };

    export function isSuccess(value: string) {
        return ResponseConstEAF.StatusConstEAF.SUCCESS_LIST.indexOf((value || '').toLowerCase()) > -1;
    }
    export function isFailed(value: string) {
        return ResponseConstEAF.StatusConstEAF.FAILED_LIST.indexOf((value || '').toLowerCase()) > -1;
    }
    export function isOkay(value: string): boolean {
        return ResponseConstEAF.StatusConstEAF.OKAY_LIST.indexOf((value || '').toLowerCase()) > -1;
    }
}
module SocialSignInType {
    export const FACEBOOK = "facebook";
    export const LINKEDIN = "linkedin";
    export const GOOGLE = "google";

    export module WORKFORCE_APP {
        export const PLAY_STORE = "com.avalant.workforce";
        export const APP_STORE = "";
    }
    export module YBAT_APP {
        export const PLAY_STORE = "com.avalant.ybat";
        export const APP_STORE = "id1255389731";
    }
    export module LINKEDIN_APP {
        export const PLAY_STORE = "com.linkedin.android";
        export const APP_STORE = "id288429040";
    }
    export module FACEBOOK_APP {
        export const PLAY_STORE = "com.facebook.katana";
        export const APP_STORE = "id284882215";
    }
}
module YBATConst {
    export const CONTACTTYPE_PARENT = "P";
    export const CONTACTTYPE_EMERGENCY = "E";
}
module ProductFavoriteType {
    export const FAVORITE = "F";
    export const UN_FAVORITE = "UF";

    export const WISHLIST = "W";
    export const UN_WISHLIST = "UW";
}

module LocalStorageKeyModule {
    export const UEARN_LANGUAGE_VERSION_KEY = "cache-language-version";

    export const STORED_CACHES = "storedCaches";
    export const EMPLOYEE_CODE = "UserEmployeeCode";
    export const HCM_USER_AUTH = "HCMUserAuth";
    export const BUSINESS_USER = "_businessuser";
    export const SHIPPING_LIST = "_shippinglist";
    export const CART = "cart";
    export const CACHE_LANGUAGE = "cache-language-";
    export const CURRENT_ORGANIZATION_ID = "currentOrganizationId";
}

module NavParamsKeyModule {
    export const ORGANIZATION_ID = "organizationId";
}

/**
 * NorrapatN: Use Union types for compare between Number and String type.
 * 
 * Example:
 *   let shopType: string = '1';  // String type
 *   // AppConstant.SHOP_TYPE_MS.STORE = 1 ; is number type.
 *   AppConstant.SHOP_TYPE_MS.STORE == shopType;  // true - *use double equal sign!
 */
module ShopType {
    export const STORE: string | number = 1;
    export const DONATE: string | number = 2;
    export const GROUP_EVENT: string | number = 3;
    export const FUNDING: string | number = 4;
    export const COURSE_EVENT: string | number = 5;
    export const PRIVILEGE: string | number = 6;
    export const GARAGE: string | number = 8; // SKIP 7, Its HARDED CODE to except from OneWEB Entity config, Shit.
}

module ModalEventsSubscribe {
    export const CALENDAR_TASK_CREATE: string = "CALENDAR_TASK_CREATE";
    export const CALENDAR_MEETING_CREATE: string = "CALENDAR_MEETING_CREATE";
    export const MEETING_CREATE: string = "MEETING_CREATE";
    export const REJECT_LEAVE: string = "REJECT_LEAVE";
    export const EXPENSE_CREATE: string = "EXPENSE_CREATE_PAGE";
    export const LEAVE_CREATE: string = "LEAVE_CREATE_PAGE";
    export const SHIFT_CREATE: string = "SHIFT_CREATE_PAGE";
    export const RELOAD_IMAGE_PROFILE: string = "RELOAD_IMAGE_PROFILE";
}

const APP_VERSION = ENV.APP_VERSION;

export class AppConstant {

    public static readonly EVENTS_SUBSCRIBE = ModalEventsSubscribe;
    public static readonly LOCAL_STORAGE_KEY = LocalStorageKeyModule;

    public static readonly APP_DEBOUNCE_LOADING_TIME: number = 1000;
    public static readonly APP_DEBOUNCE_SEARCH_TIME: number = 500;
    public static readonly APP_VERSION: string = APP_VERSION;

    public static readonly SIGNIN_TYPE = SignInType;
    public static readonly LANGUAGE = Language;
    public static readonly ADDRESS_TYPE = AddressType;
    public static readonly EAF_RESPONSE_CONST = ResponseConstEAF;
    public static readonly ORGANIZE_CODE = OrganizeCode;
    public static readonly YBATConst = YBATConst;
    public static readonly NavParamsKey = NavParamsKeyModule;
    public static readonly SocialSignInType = SocialSignInType;
    public static readonly LINKEDIN_APP = SocialSignInType.LINKEDIN_APP;
    public static readonly FACEBOOK_APP = SocialSignInType.FACEBOOK_APP;
    public static readonly YBAT_APP = SocialSignInType.YBAT_APP;
    public static readonly WORKFORCE_APP = SocialSignInType.WORKFORCE_APP;

    public static readonly PRODUCT_FAVORITE_TYPE = ProductFavoriteType;

    // public static readonly DEFAULT_PAGE = 'TabPage'; // Use Ionic Page deeplink
    public static readonly DEFAULT_PAGE = 'WorkForceHomePage'; // Use Ionic Page deeplink

    public static isSuccess = ResponseConstEAF.isSuccess;
    public static isFail = ResponseConstEAF.isFailed;
    public static isOkay = ResponseConstEAF.isOkay;

    public static readonly DEFAULT_ORG_PARAMS = {
        ORG_AVA: { organizationId: OrganizeCode.ORG_DEFAULT.id },
        ORG_YBAT: { organizationId: OrganizeCode.ORG_YBAT.id },
        ORG_WORKFORCE: { organizationId: OrganizeCode.ORG_WORKFORCE.id },
    };

    public static readonly Status = {
        SUCCESS: 'success',
        ERROR: 'error',
        INFO: 'info',
        WARNING: 'warning',

        FAIL: 'fail',

        RECOVER: 'Recover Password',
    };

    public static readonly FLAG = {
        YES: "Y",
        NO: "N",

        ACTIVE: "A",      //เปิดใช้งาน
        INACTIVE: "I",    //ไม่ใช้งาน
        DEACTIVATE: "D",  //ยกเลิกการใช้งาน
    };

    public static readonly SHOP_TYPE_MS = ShopType;

    public static readonly SHOP_TYPE = {

        "1": "store",
        "2": "donate",
        "3": "group-event",
        "4": "funding",
        "5": "course",
        "6": "privilege",
    };

    public static readonly CUSTOMER_TYPE = {
        "Individual": 'I',
        "Company": 'C'
    };

    public static readonly PRODUCT_ATTRIBUTE_TYPES = {
        "BEGIN_DATE": "1",
        "END_DATE": "2",
        "ANNOUNCEMENT_START_DATE": "3",
        "ANNOUNCEMENT_END_DATE": "4",
        "GL_CODE": "5",
        "MEMBERSHIP_IS_LIFTLONG_FLAG": "6",
        "MEMBERSHIP_PERIOD": "7",
        "MEMBERSHIP_MONTH_PERIOD": "8",
        "PLACE": "9",
        "BRANCH": "10",
        "BUILDING": "11",
        "APPLICATION_TYPE": "12",
        "APPROVER_TYPE": "13",
        "FAMILY_COURSE": "14",
        "PARTICIPANT_AGE_FROM": "15",
        "PARTICIPANT_AGE_TO": "16",
        "REQUIRE_ATTACH_DOCUMENT": "17",
        "PARTICIPANT_GENDER": "18",
        "APPROVERS_TYPE": "19",
        "NEVER_JOINED_IN_YEARS": "20",
        "SHIRT_SIZE": "21",
        "GENERAL__PARTICIPANT_QUOTA": "22",
        "VIP_PARTICIPANT_QUOTA": "23",
        "PRIVILEGE_PARTICIPANT_QUOTA": "24",
        "SPARE_PARTICIPANT_QUOTA": "25",
        "COURSE_CHARACTERISTICS": "26",
        "SHIRT_COLOR": "41",
        "RESERVATION_BEGIN_DATE": "61",
        "RESERVATION_END_DATE": "62",
        "RESERVED_PERSON_LIMIT": "81",
        "RESERVED_HOUR_PERIOD_FROM": "141",
        "RESERVED_MINUTE_PERIOD_FROM": "142",
        "RESERVED_HOUR_PERIOD_TO": "161",
        "RESERVED_MINUTE_PERIOD_TO": "162",
    };

    public static readonly ZERO_BAHT_TH: string = '0 ฿';
    public static readonly ZERO = 0;

    public static readonly PAYMENT = {
        KBANK: {
            RESPONSE_CODES: {
                '00': {
                    title: 'Approved',
                    description: 'Payment Completed',
                },
                '01': {
                    title: 'Refer to card issuer',
                    description: 'Give cardholder contacts issuer bank',
                },
                '03': {
                    title: 'Invalid Merchant ID',
                    description: 'Please contact KBank',
                },
                '05': {
                    title: 'Do not honor',
                    description: 'Cardholder input invalid card information. Ex. Expiry date, CVV2 or card number. Give cardholder contacts issuer bank.',
                },
                '12': {
                    title: 'Invalid transaction',
                    description: 'Please contact KBank',
                },
                '13': {
                    title: 'Invalid Amount',
                    description: 'Payment amount must more than 0.1',
                },
                '14': {
                    title: 'Invalid Card Number',
                    description: 'Please check all digits of card no.',
                },
                '17': {
                    title: 'Customer Cancellation',
                    description: 'Customers click at cancel button in payment page when they make transaction. Customers have to make new payment transaction.',
                },
                '19': {
                    title: 'Re-enter transaction',
                    description: 'Duplicate payment. Please contact KBank',
                },
                '30': {
                    title: 'Format Error',
                    description: 'Transaction format error. Please contact KBank',
                },
                '41': {
                    title: 'Lost Card - Pick up',
                    description: 'Lost Card and Cardholder give up.',
                },
                '43': {
                    title: 'Stolen Card - Pick up',
                    description: 'Stolen Card and Cardholder give up.',
                },
                '50': {
                    title: 'Invalid Payment Condition',
                    description: 'Ex. Session time out or invalid VbV Password: ask cardholders to try ma again and complete transaction within 15 minutes with correct card information.',
                },
                '51': {
                    title: 'Insufficient Funds',
                    description: 'Not enough credit limit to pay. Please contact issuer',
                },
                '54': {
                    title: 'Expired Card',
                    description: 'Cardholder key in invalid expiry date',
                },
                '58': {
                    title: 'Transaction not Permitted to Terminal',
                    description: 'Issuer does not allow to pay with debit card (Visa Electron, MasterCard Electron)',
                },
                '91': {
                    title: 'Issuer or Switch is Inoperative',
                    description: 'Issuer system is not available to authorize payment',
                },
                '94': {
                    title: 'Duplicate Transaction',
                    description: 'Please inform KBank to investigate',
                },
                '96': {
                    title: 'System Malfunction',
                    description: 'Issuer bank system cannot give a service',
                },
                'xx': {
                    title: 'Transaction Timeout',
                    description: 'Cannot receive response code from issuer with in the time limit',
                },
            },
            URL: {
                APPROVED: '/DMPManualServletUnAuth?key=PaymentFrontService',
            },
        },

    };

    public static readonly ORDER_LINE_TYPE = {
        PRODUCT: 1,
        PERSON: 2,
        GIFT: 3,
        SHIPPING: 4,
    };

    public static mapShopTabTitleKeyByShopTypeId(shopTypeID: string): string {
        let titleMap = {
            '1': 'COMMON.HOME.PRODUCT',
            '2': 'COMMON.HOME.DONATION',
            '3': 'COMMON.HOME.GROUP',
            '4': 'COMMON.HOME.FUNDING',
            '5': 'COMMON.HOME.COURSE',
            '6': 'COMMON.HOME.PRIVILEGE',
        };
        return titleMap[shopTypeID];
    }

    public static mapShopTabTitleKeyByShopId(shopID: string): string {
        let titleMap = {
            '406': 'COMMON.HOME.PRODUCT',
            '476': 'COMMON.HOME.DONATION',
            '477': 'COMMON.HOME.GROUP',
            '475': 'COMMON.HOME.COURSE',
            '470': 'COMMON.HOME.PRIVILEGE',
        };
        return titleMap[shopID];
    }

    /**
     * Order Status
     * 
     * @description
     *  MS_LIST_BOX_MASTER : FIELD_ID = 81
     */
    public static ORDER_STATUS = {
        WAITING_FOR_PAYMENT: '1',
        PAYMENT_TRANSACTION_FAILED: '2',
        CONFIRMED_PAYMENT: '3',
        SHIPPED: '4',
        PAYMENT_COMPLETEDF: '5',
        CANCELLED: '6',
    };

}
