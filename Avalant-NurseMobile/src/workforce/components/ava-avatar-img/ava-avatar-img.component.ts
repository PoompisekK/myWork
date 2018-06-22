import { Component, Input, OnInit } from '@angular/core';

import { AnimateCss } from '../../../animations/animate-store';
import { isDev } from '../../../constants/environment';
import { AssignmentService } from '../../service/assignmentService';

@Component({
  selector: 'ava-avatar-img',
  templateUrl: 'ava-avatar-img.component.html',
  animations: [
    AnimateCss.peek(),
    AnimateCss.fade(100)
  ]
})
export class AvaAvatarImgComponent implements OnInit {
  @Input("srcPath") private srcPath: string;
  @Input("empStatus") private empStatus: string;
  constructor(
    private assignmentService: AssignmentService
  ) {

  }
  private showStatusDesc: boolean = false;
  public trigger(): void {
    this.showStatusDesc = !this.showStatusDesc;
    if (this.showStatusDesc == true) {
      setTimeout(() => {
        this.showStatusDesc = false;
      }, 3000);
    }
  }
  public getEmpStatus(): string {
    return this.assignmentService.getTaskStatus(this.empStatus);
  }
  public ngOnInit(): void {
    if (this.srcPath && ((this.srcPath || '').indexOf("?") == -1)) {
      this.srcPath = this.srcPath + ("?" + (new Date().getTime().toString()));
    }
    isDev() && console.log("this.srcPath :", this.srcPath);
  }
}