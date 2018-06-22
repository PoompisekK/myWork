import { Pipe, PipeTransform } from '@angular/core';
import { EventModel } from '../model/event.model';
import { AssignmentModel } from '../model/assignment.model';
import { ContsVariables } from '../global/contsVariables';
@Pipe({ name: 'employeeStatus'})
export class EmployeeStatus implements PipeTransform  {
  constructor(
  ) {}
  public transform(status: string) {
        let styleCssForStatus;
        console.log(status);
        if(status=="S0006"){
            styleCssForStatus = "employee-accept";
        }else{
            styleCssForStatus = "employee-deny";
        }
        console.log(styleCssForStatus);
        return styleCssForStatus;
  }
}