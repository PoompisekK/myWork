import { Directive, ElementRef, Input, Output, EventEmitter, Renderer, style } from '@angular/core';
import { NgControl } from '@angular/forms';
import { Subject } from "rxjs/Subject";
import { ValidationService } from "../../services/validation/validation.service";
import { Subscription } from 'rxjs';

@Directive({ selector: '[vtValidator]' })
export class ValidatorDirective {
    private statusChange$: Subscription;
    private validationMember = [];

    @Input('id') 
    public id: string;
    @Input('name') 
    public name: string;

    @Input('chkbox') 
    public chkbox = false;

    @Input('vtValidator')
    public validate;

    @Output('vtValidatorChange')
    public validator: EventEmitter<boolean> = new EventEmitter();

    constructor(private renderer: Renderer, private el: ElementRef, private formControl: NgControl,
        private validationService: ValidationService) {

    }

    public ngOnInit() {
        //console.log("ValidationDirective")
        this.statusChange$ = this.formControl.statusChanges
            .subscribe(change => {
                //console.log("statusChanges",change)
                this.validationService.addValidationMember(this.id, this.formControl);

                //this.validatorService.checkValidate(validateResult => {
                this.validator.emit(this.formControl.valid);
                //});

            }, error => {
                console.warn('Error => ', error);
            });
        // if(this.el.nativeElement.type=="select-one"){
        //     this.validatorService.getSavedStatusObservable()
        //     .takeUntil(this.ngUnsubscribe)
        //     .subscribe(result=>{

        //         if(result){
        //             this.renderer.setElementClass(this.el.nativeElement.parentElement, "overide-require-border", false);
        //         }
        //     });
        // }

    }

    public ngAfterViewChecked() {
        // if(this.el.nativeElement.type=="select-one"){
        //     this.checkIsBeSavedAndPristineSelect()
        // }else{
        //     this.checkIsBeSavedAndPristine();
        // }

    }

    public ngOnDestroy() {
        //console.log("destroy")
        this.validationService.removeValidationMember(this.id);
        // this.ngUnsubscribe.next();
        // this.ngUnsubscribe.complete();
        this.statusChange$ && this.statusChange$.unsubscribe();
    }

}
