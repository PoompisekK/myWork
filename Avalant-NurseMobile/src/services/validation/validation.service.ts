/**
 * @author Vitaya
 * @since 24-05-17
 * Desc: User With ValidatorUtilDirective
 */

import { Injectable } from '@angular/core';
import { Observer } from "rxjs/Rx";
import { Observable } from "rxjs/Observable";

@Injectable()
export class ValidationService {

    private saveStatusObservable: Observable<boolean>;
    private saveStatusObserver: Observer<boolean>;

    private validatorData: Array<Object> = [];
    private beSaved = false;
    public isValid = true;

    constructor() {
        this.saveStatusObservable = new Observable<boolean>((observer: any) => this.saveStatusObserver = observer).share();
    }

    public getSavedStatus() {
        return this.beSaved;
    }

    public setSavedStatus() {
        this.beSaved = true;
        if (this.saveStatusObserver)
            this.saveStatusObserver.next(this.beSaved);
    }

    public getSavedStatusObservable() {
        return this.saveStatusObservable;
    }

    public addValidationMember(id, member: any) {
        let data = {
            id: id,
            content: member
        };
        let dub = this.checkDuplicated(id);
        if (!dub) {
            this.validatorData.push(data);
        } else {
            dub["content"] = member;
        }
    }
    public removeValidationMember(id) {
        let data = this.validatorData.find(data => data["id"] == id);
        if (data) {
            this.validatorData.splice(this.validatorData.indexOf(data), 1);
        }
    }
    public setExistMember(id, data) {
        for (let index in this.validatorData) {
            if (this.validatorData[index]["id"] == id) {
                this.validatorData[index]["content"] = data;
            }
        }
    }

    private checkDuplicated(id) {
        //let isNotDub = false;
        let data = this.validatorData.find(data => data["id"] == id);
        // for (let valid in this.validatorData) {
        //     if (id == valid["id"]) {
        //         console.log("Test Dupped");
        //         isNotDub = true;
        //     }
        // }
        return data;
    }

    public getValidationMember() {
        // console.log("Test Members=>", this.validatorData);
    }

    public checkValidate(callbackValidate: (data: boolean) => void) {
        let isValid = true;
        for (let member of this.validatorData) {
            if (member["content"].invalid) {
                //console.log(member)
                isValid = false;
            }

        }
        callbackValidate(isValid);
    }

}