import { Pipe, PipeTransform } from '@angular/core';

import { ContsVariables } from '../global/contsVariables';

@Pipe({
    name: 'employeeColorStatus'
})
export class EmployeeColorStatus implements PipeTransform {
    constructor(
    ) { }
    public transform(status: string) {
        if (status == ContsVariables.StatusAssigment.ACCEPTED) {
            return "employee-accept";
        } else if (status == ContsVariables.StatusAssigment.OPEN) {
            return "employee-wait";
        } else if (status == ContsVariables.StatusAssigment.DENIED) {
            return "employee-deny";
        }
        return null;
    }
}