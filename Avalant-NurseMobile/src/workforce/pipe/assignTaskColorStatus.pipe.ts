import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'assignTaskColorStatus'
})
export class AssignTaskColorStatus implements PipeTransform {
    constructor(
    ) { }
    public transform(status: string) {
        if (status == "S0006") {
            return "assign-open";
        } else if (status == "S0007") {
            return "assign-onProcess";
        } else if (status == "S0008") {
            return "assign-done";
        } else if (status == "S0030") {
            return "assign-cancel";
        }
        return null;
    }
}