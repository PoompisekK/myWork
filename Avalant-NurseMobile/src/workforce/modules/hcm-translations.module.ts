import { HCMTranslateDirective } from './hcm-translate.directive';
import { HCMTranslatePipe } from './hcm-translate.pipe';
import { HCMTranslationProvider } from './hcm-translation.provider';
import { HCMTranslationService } from './hcm-translation.service';

const HCM_COMPONENTS: any[] = [
    // Components go here
];

const HCM_DIRECTIVES: any[] = [
    // Directives go here
    HCMTranslateDirective
];

const HCM_PIPES: any[] = [
    // Pipes go here
    HCMTranslatePipe,
];

export const HCM_ENTRY_COMPONENTS: any[] = [
    // Entry components
];

export const HCM_PROVIDERS: any[] = [
    HCMTranslationService,
    HCMTranslationProvider,
];

export const HCM_DECLARATIONS: any[] = [
    ...HCM_COMPONENTS,
    ...HCM_DIRECTIVES,
    ...HCM_PIPES,
];

export const HCM_EXPORTS: any[] = [
    ...HCM_COMPONENTS,
    ...HCM_DIRECTIVES,
    ...HCM_PIPES,
];