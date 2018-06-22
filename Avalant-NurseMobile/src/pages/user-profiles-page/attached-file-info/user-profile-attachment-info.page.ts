import { Component, Input, OnInit, forwardRef, Inject } from '@angular/core';
import { NavController, NavParams, ViewController, NavOptions, Platform, AlertController, LoadingController, Loading } from 'ionic-angular';
import { ImagePicker } from '@ionic-native/image-picker';
import { Diagnostic } from '@ionic-native/diagnostic';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { OrganizationPage } from '../../organization-page/organization.page';
import { UserProfileService } from '../../../services/userprofile/userprofile.service';
import { UserModel } from '../../../model/user/user.model';
import { TranslationService } from "angular-l10n";
import { AppState } from '../../../app/app.state';
import { AppConstant } from '../../../constants/app-constant';
import { EAFRestService } from '../../../services/eaf-rest/eaf-rest.service';
import { ObjectsUtil } from '../../../utilities/objects.util';
import { YBatUserAttachmentModel } from '../../../model/user/ybat.user-attachment.model';
import { EAFRestApi } from '../../../constants/eaf-rest-api';
import { StringUtil } from '../../../utilities/string.util';
import { PictureService } from '../../../services/picture-service/picture.service';
import { ArraysUtil } from '../../../utilities/arrays.util';
import { AppServices } from '../../../services/app-services';

@Component({
  selector: 'user-profile-attachment-info-page',
  templateUrl: 'user-profile-attachment-info.page.html',
  styleUrls: ['/user-profile-attachment-info.page.scss']
})
export class UserProfileAttachmentInfoPage implements OnInit {
  private attachmentFilesList: YBatUserAttachmentModel[] = [];
  private attachmentFilesDeletedList: YBatUserAttachmentModel[] = [];
  private businessUserM: UserModel;
  constructor(
    public navCtrl: NavController,
    public viewCtrl: ViewController,
    public navParams: NavParams,
    public _platform: Platform,
    public _Diagnostic: Diagnostic,
    private imagePicker: ImagePicker,
    private alertCtrl: AlertController,
    @Inject(forwardRef(() => UserProfileService)) public userProfileService: UserProfileService,
    public loadingCtrl: LoadingController,
    public translationService: TranslationService,
    public appState: AppState,
    public appService: AppServices,
    public eafRestService: EAFRestService,
    public pictureService: PictureService,
  ) {
    this.businessUserM = this.navParams.data;
  }
  public ngOnInit() {
    let ybatUserInM = this.businessUserM.ybatUserInfoM;
    let attachList = ObjectsUtil.clone(ybatUserInM.ybatUserAttachmentInfoList);
    attachList && attachList.forEach(item => {
      item["type"] = EAFRestApi.getImageUrl(item.filePath);
    });
    this.attachmentFilesList = attachList.filter((itm) => itm.status == 'A');
    console.info("%cybatUserAttachmentInfoList:", 'background:blue;color:white', attachList);
  }

  private imagePreview(imageItem: any) {//browser,android
    let alert = this.alertCtrl.create({
      cssClass: 'preview-image-popup',
      message: `
        <div class="preview-image">
        <img class="preview-image" src="${imageItem.type}" > 
        </div>
      `,
      buttons: ['Close']
    });
    alert.present();
  }

  private removeAttachment(index: any) {//browser,android
    // console.log("removeAttachment index:", index);
    let removeItem = this.attachmentFilesList[index];
    removeItem.status = 'D';
    if (!StringUtil.isEmptyString(removeItem.attachDocumentId)) {
      this.attachmentFilesDeletedList.push(removeItem);
    }
    this.attachmentFilesList.splice(index, 1);
    // console.log("removed list:", this.attachmentFilesDeletedList);
  }

  public loadingPopup: Loading;

  public updateUserProfile(loading: Loading) {

    // if (!ArraysUtil.isEmptyArray(this.attachmentFilesList)) {
    //   this.businessUserM.socialPicProfile = this.attachmentFilesList[0].filePath;
    // }

    this.userProfileService.updateUserProfile(this.businessUserM).subscribe(respUpdate => {
      // console.log("▶️▶️respUpdate:", respUpdate);
      this.alertCtrl.create({
        message: this.translationService.translate('COMMON.USERPROFILE.UPDATED_COMPLETE'),
        buttons: [
          this.translationService.translate('COMMON.BUTTON.DONE'),
        ]
      }).present().then(() => {
        loading.dismiss();
        this.updateUserProfileComplete();
      });
    }, error => {
      console.warn('Error => ', error);
    });
  }

  private saveUserProfile() {
    // let alerMsg = null;
    // if (this.appService.isServeChrome() == true || (!ArraysUtil.isEmptyArray(this.attachmentFilesList) && this.attachmentFilesList.length == 1)) {
    let loading = this.loadingCtrl.create({
      content: this.translationService.translate('COMMON.USERPROFILE.UPDATING_PROFILE') + '...'
    });
    loading.present();
    this.businessUserM.ybatUserInfoM.ybatUserAttachmentInfoList = (this.attachmentFilesList || []).concat((this.attachmentFilesDeletedList || []));
    this.updateUserProfile(loading);
    // } else {
    //   alerMsg = this.alertCtrl.create({ message: this.translationService.translate('COMMON.USERPROFILE.INPUT_ONE_ATTACHMENT') + '...', });
    //   alerMsg.present();
    // }
  }

  private updateUserProfileComplete() {
    this.userProfileService.getLoginManualServlet(this.businessUserM.id).subscribe((resp) => {
      this.appState.businessUser = resp;
      this.navCtrl.setRoot(AppConstant.DEFAULT_PAGE);
    });
  }

  private getImagePath = (fileItm: YBatUserAttachmentModel): string => {
    return EAFRestApi.getImageUrl(fileItm.filePath);
  }

  private imagePickerAttachment = () => {
    let uploadImg = this.attachmentFilesList;
    this.pictureService.requestPicture((imagePath) => {
      this.eafRestService.uploadFileV2(imagePath).subscribe((response) => {
        // console.log("uploadFileV2 response:", response);
        if (!ArraysUtil.isEmptyArray(response)) {
          let respItm = response[0];
          let attactItm: YBatUserAttachmentModel = new YBatUserAttachmentModel();
          attactItm.businessUserId = this.businessUserM.id;
          attactItm.filePath = respItm.id;
          attactItm.fileName = respItm.fileName;
          attactItm.orgId = this.appState.currentOrganizationId;
          attactItm.status = "A";
          attactItm.seq = (uploadImg.length + 1).toString();
          uploadImg.push(attactItm);
        } else {
          console.error("Error uploadFileV2 response is null:", response);
        }
      });
    });
  }

  private backBtn() {
    this.navCtrl.canGoBack() && this.navCtrl.pop();
  }
}

class ImageConstant {
  public static quality: 50; // 0-100
  public static maxWidth: 1024;
  public static maxHeight: 1024;
}
