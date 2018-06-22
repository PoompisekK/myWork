import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { AssignmentService } from '../service/assignmentService';
import { isDev } from '../../constants/environment';
import { AppConstant } from '../../constants/app-constant';
import { HCMRestApi } from '../../constants/hcm-rest-api';

@Pipe({ name: 'loadImg' })
export class LoadImgPipe implements PipeTransform {
  private static colorList: string[];
  private static employeeList: any[];
  constructor(
    private sanitizer: DomSanitizer,
    private assignmentService: AssignmentService,
  ) {
  }

  private isValidImgFileExt(_extImg: string[], _imageUserURL: any): boolean {
    for (let i = 0; i < _extImg.length; i++) {
      let ext = _extImg[i];
      if (((_imageUserURL || '').toString()).indexOf(ext) > -1) {
        return true;
      }
    }
    return false;
  }

  public transform(empCodeOrImgURL: string, args) {
    let extImg = [".jpg", ".jpeg", ".png", ".svg", ".bmp", ".gif"];
    let isCorrectImgPath = this.isValidImgFileExt(extImg, empCodeOrImgURL);
    isDev() && console.log("isCorrectImgPath :", isCorrectImgPath, ", imageUserURL:", empCodeOrImgURL, "args :", args);
    if (isCorrectImgPath) {
      return empCodeOrImgURL;
    } else {
      return HCMRestApi.getHCMImageUrl(empCodeOrImgURL);
    }
  }
}