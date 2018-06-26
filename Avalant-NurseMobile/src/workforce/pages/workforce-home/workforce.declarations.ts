import { Camera } from '@ionic-native/camera';
import { DatePicker as DatePickerIonicNative } from '@ionic-native/date-picker';
import { Diagnostic } from '@ionic-native/diagnostic';
import { File } from '@ionic-native/file';
import { FileChooser } from '@ionic-native/file-chooser';
import { FileTransfer } from '@ionic-native/file-transfer';
import { Geolocation } from '@ionic-native/geolocation';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { OpenNativeSettings } from '@ionic-native/open-native-settings';
import { ElasticModule } from 'angular2-elastic';
import { TooltipsModule } from 'ionic-tooltips';
import { SuperTabs } from 'ionic2-super-tabs';
import { ScheduleModule } from 'primeng/primeng';

import {
    AppNavHeaderComponent,
    CloseModalViewCtrlDirective,
    GotoNotiPageDirective,
} from '../../../components/app-nav-header/app-nav-header.component';
import { CalendarDatePicker } from '../../../components/calendar-date-picker/calendar-date-picker';
import { GoogleStaticMapComponent } from '../../../components/google-static-map/google-static-map';
import { CustomAlertPopupPage } from '../../../pages/custom-alert-popup/custom-alert-popup.page';
import { HelpPage } from '../../../pages/help-page/help.page';
import { SettingPasswordPage } from '../../../pages/setting-password-page/setting-password-page';
import { TasksDetailPage } from '../../../pages/tasks-detail-page/tasks-detail-page';
import { TasksPage } from '../../../pages/tasks-page/tasks-page';
import { AppLoadingService } from '../../../services/app-loading-service/app-loading.service';
import { CalendarDatePickerService } from '../../../services/calendar-date-picker-service/calendar-date-picker-service';
import { AvaAvatarImgComponent } from '../../components/ava-avatar-img/ava-avatar-img.component';
import { DateStyleDisplayComponent } from '../../components/date-style-display/date-style-display.component';
import { SelectOptionsListPopoverPage } from '../../components/select-popover/select-option.popover';
import { AssignTaskColorStatus } from '../../pipe/assignTaskColorStatus.pipe';
import { EmployeeColorStatus } from '../../pipe/employeeColorStatus.pipe';
import { EmployeeStatus } from '../../pipe/employeeStatus.pipe';
import { LoadImgModule } from '../../pipe/loadImgPipe.module';
import { RangeDateTime } from '../../pipe/rangeDateTime.pipe';
import { ApproveService } from '../../service/approveService';
import { AssignmentService } from '../../service/assignmentService';
import { BenefitService } from '../../service/benefitService';
import { ChartJSService } from '../../service/charjsService';
import { CheckInOutService } from '../../service/checkInOutService';
import { ExpenseService } from '../../service/expenseService';
import { HttpRequestWFService } from '../../service/httpRequestWFService';
import { LeaveService } from '../../service/leaveService';
import { MeetingService } from '../../service/meetingService';
import { PaySlipService } from '../../service/paySlipService';
import { WorkforceHttpService } from '../../service/workforceHttpService';
import { WorkforceService } from '../../service/workforceService';
import { AdminPage } from '../admin-page/admin-page';
import { AdminViewEventPage } from '../admin-page/admin-viewEvent-page/admin-viewEvent-page';
import { ApproveExpensePage } from '../approve-tabs-page/approve-expense-page/approve-expense-page';
import { ApproveRejectModalPage } from '../approve-tabs-page/approve-reject-modal/approve-reject-modal';
import { ApproveTabPage } from '../approve-tabs-page/approve-tabs-page';
import {
    AssignmentCreateEventPage,
} from '../assignment-page/assignment-event-pages/assignment-createEvent-page/assignment-createEvent-page';
import {
    AssignmentEditEventPage,
} from '../assignment-page/assignment-event-pages/assignment-editEvent-page/assignment-editEvent-page';
import {
    AssignmentTurnInPage,
} from '../assignment-page/assignment-event-pages/assignment-turn-in-page/assignment-turn-in-page';
import {
    AssignmentViewEventPage,
} from '../assignment-page/assignment-event-pages/assignment-viewEvent-page/assignment-viewEvent-page';
import { AssignmentPage } from '../assignment-page/assignment-page';
import { BenefitDetailPage } from '../benefit-detail-page/benefit-detail-page';
import { BenefitPage } from '../benefit-page/benefit-page';
import {
    CalendarCreateEventPage,
} from '../calendar-page/calendar-event-pages/calendar-createEvent-page/calendar-createEvent-page';
import {
    CalendarViewEventPage,
} from '../calendar-page/calendar-event-pages/calendar-viewEvent-page/calendar-viewEvent-page';
import { CalendarPage } from '../calendar-page/calendar-page';
import { CheckInOutHistoryPage } from '../check-in&out-history-page/check-in&out-history-page';
import { CheckInOutSuccesssPage } from '../check-in&out.page/check-in&out-success-page/check-in&out-success-page';
import { CheckInOut } from '../check-in&out.page/check-in&out.page';
import { ClaimMenu } from '../claim-menu-page/claim-menu-page';
import { ClaimMotorStep1 } from '../claim-motor-step1/claim-motor-step1';
import { ClaimMotorStep2 } from '../claim-motor-step2/claim-motor-step2';
import { ClaimMotorStep3 } from '../claim-motor-step3/claim-motor-step3';
import { ClaimStep4 } from '../claim-step4/claim-step4';
import { DashboardChartPage } from '../dashboards-page/dashboard-chart/dashboard-chart';
import { DashboardsPage } from '../dashboards-page/dashboards-page';
import { EventsCalendarPage } from '../events-calendar/events-calendar-comp';
import { ExpenseCreatePage } from '../expense-create-page/expense-create-page';
import { ExpenseItemAddPage } from '../expense-create-page/expense-item-add-page';
import { ExpenseViewDetailPage } from '../expense-create-page/expense-view-detail-page';
import { ExpensePage } from '../expense-page/expense-page';
import { ExpenseViewItemDetailPage } from '../expense-view-item-detail-page/expense-view-item-detail-page';
import { ExpenseViewPage } from '../expense-view-page/expense-view-page';
import { GoogleMap } from '../google-map/google-map';
import { LeaveCreateDetailPage } from '../leave-page/leave-createDetail-pages/leave-createDetail-page';
import { LeaveDetailPage } from '../leave-page/leave-detail-pages/leave-detail-page';
import { LeaveViewEventPage } from '../leave-page/leave-event-pages/leave-viewEvent-page/leave-viewEvent-page';
import { LeavePage } from '../leave-page/leave-page';
import { ListPage } from '../list/list';
import { GoogleMapForMeeting } from '../meeting-page/googleMapForMeeting/googleMapForMeeting';
import { MeetingDetailPage } from '../meeting-page/meeting-detail-page/meeting-detail-page';
import { MeetingAddMemberPage } from '../meeting-page/meeting-event-pages/meeting-createEvent-page/meeting-add-member-page';
import {
    MeetingCreateEventPage,
} from '../meeting-page/meeting-event-pages/meeting-createEvent-page/meeting-createEvent-page';
import { MeetingEditEventPage } from '../meeting-page/meeting-event-pages/meeting-editEvent-page/meeting-editEvent-page';
import { MeetingViewEventPage } from '../meeting-page/meeting-event-pages/meeting-viewEvent-page/meeting-viewEvent-page';
import { MeetingPage } from '../meeting-page/meeting-page';
import { MenuPage } from '../menu-page/menu-page';
import { NotiPage } from '../noti-page/noti-page';
import { AssessmentSummaryPage } from '../patients-acuity-evaluation/assessment-summary/assessment-summary.page';
import { InspectionTypesPage } from '../patients-acuity-evaluation/inspection-types/inspection-type.page';
import { PatientAcuityEvaluationPage } from '../patients-acuity-evaluation/patients-acuity-evaluation.page';
import { PatientsQuestionsPage } from '../patients-acuity-evaluation/patients-questions/patients-questions.page';
import { PayRollPage } from '../payroll-page/payroll-page';
import { ShiftCreatePage } from '../shift-page/shift-create-page/shift-create-page';
import { ShiftPage } from '../shift-page/shift-page';
import { ShiftSwapCreatePage } from '../shift-page/shift-swap-create-page/shift-swap-create-page';
import { ShopCartStep1 } from '../shop-cart-step1/shop-cart-step1';
import { ShopCartStep2 } from '../shop-cart-step2/shop-cart-step2';
import { ShopCartStep3 } from '../shop-cart-step3/shop-cart-step3';
import { ShopCartStep4 } from '../shop-cart-step4/shop-cart-step4';
import { ShopDetailPage } from '../shop-detail-page/shop-detail-page';
import { ShopHomePage } from '../shop-home-page/shop-home-page';
import { ShopeMenuPage } from '../shop-menu-page/shop-menu-page';
import { TimeLine } from '../timeline/timeline';
import { LeaveSummaryPage } from '../user-profile-detail/leave-summary-page/leave-summary-page';
import { MyProfilePage } from '../user-profile-detail/my-profile-page/my-profile-page';
import { PersonalConditionPage } from '../user-profile-detail/personal-condition-page/personal-condition-page';
import { SkillPage } from '../user-profile-detail/skill-page/skill-page';
import { timeRecordingPage } from '../user-profile-detail/time-recording-page/time-recording-page';
import { UserProfileDetailPage } from '../user-profile-detail/user-profile-detail';
import { WorkingHoursSummaryPage } from '../user-profile-detail/working-hours-summary-page/working-hours-summary-page';
import { WorkForceHomePage } from './workforce-home.page';

/**
 * @author Bundit.Ng
 * @since  Fri Mar 30 2018
 * Copyright (c) 2018 Avalant Co.,Ltd.
 */

export const WORKFORCE_COMPONENTS = [
    GoogleStaticMapComponent,
    AppNavHeaderComponent,
    DateStyleDisplayComponent,
    AvaAvatarImgComponent,
    SelectOptionsListPopoverPage,
];

export const WORKFORCE_PAGES = [
    AdminPage,
    AdminViewEventPage,
    ApproveExpensePage,
    ApproveRejectModalPage,
    ApproveTabPage,
    AssignmentCreateEventPage,
    AssignmentEditEventPage,
    AssignmentPage,
    AssignmentTurnInPage,
    AssignmentViewEventPage,
    BenefitDetailPage,
    BenefitPage,
    CalendarCreateEventPage,
    CalendarDatePicker,
    CalendarPage,
    CalendarViewEventPage,
    CheckInOut,
    CheckInOutHistoryPage,
    CheckInOutSuccesssPage,
    ClaimMenu,
    ClaimMotorStep1,
    ClaimMotorStep2,
    ClaimMotorStep3,
    ClaimStep4,
    CustomAlertPopupPage,
    EventsCalendarPage,
    ExpenseCreatePage,
    ExpenseItemAddPage,
    ExpensePage,
    ExpenseViewDetailPage,
    ExpenseViewItemDetailPage,
    ExpenseViewPage,
    GoogleMap,
    GoogleMapForMeeting,
    HelpPage,
    LeaveCreateDetailPage,
    LeaveDetailPage,
    LeavePage,
    LeaveViewEventPage,
    ListPage,
    MeetingAddMemberPage,
    MeetingCreateEventPage,
    MeetingDetailPage,
    MeetingEditEventPage,
    MeetingPage,
    MeetingViewEventPage,
    MenuPage,
    NotiPage,
    PayRollPage,
    SettingPasswordPage,
    ShopCartStep1,
    ShopCartStep2,
    ShopCartStep3,
    ShopCartStep4,
    ShopDetailPage,
    ShopeMenuPage,
    ShopHomePage,
    TasksDetailPage,
    TasksPage,
    TimeLine,
    PatientAcuityEvaluationPage,
    InspectionTypesPage,
    PatientsQuestionsPage,
    AssessmentSummaryPage,
    UserProfileDetailPage,
    WorkForceHomePage,
    SelectOptionsListPopoverPage,
    ShiftPage,
    DashboardsPage,
    DashboardChartPage,
    ShiftCreatePage,
    ShiftSwapCreatePage,
    MyProfilePage,
    PersonalConditionPage,
    SkillPage,
    LeaveSummaryPage,
    timeRecordingPage,
    WorkingHoursSummaryPage,
];

export const WORKFORCE_PIPES = [
    AssignTaskColorStatus,
    EmployeeColorStatus,
    EmployeeStatus,
    RangeDateTime,
];

export const WORKFORCE_DIRECTIVE = [
    GotoNotiPageDirective,
    CloseModalViewCtrlDirective,
];

export const WORKFORCE_PROVIDERS = [
    AppLoadingService,
    ApproveService,
    AssignmentService,
    BenefitService,
    CalendarDatePickerService,
    Camera,
    ChartJSService,
    CheckInOutService,
    DatePickerIonicNative,
    Diagnostic,
    ExpenseService,
    File,
    FileChooser,
    FileTransfer,
    Geolocation,
    HttpRequestWFService,
    LeaveService,
    LocationAccuracy,
    MeetingService,
    OpenNativeSettings,
    PaySlipService,
    SuperTabs,
    WorkforceHttpService,
    WorkforceService,
];

export const WORKFORCE_EXPORTS = [
    ...WORKFORCE_PAGES,
];

export const WORKFORCE_DECLARATIONS = [
    ...WORKFORCE_COMPONENTS,
    ...WORKFORCE_DIRECTIVE,
    ...WORKFORCE_PAGES,
    ...WORKFORCE_PIPES,
];

export const WORKFORCE_MODULES = [
    ElasticModule,
    ScheduleModule,
    TooltipsModule,
    LoadImgModule,
];