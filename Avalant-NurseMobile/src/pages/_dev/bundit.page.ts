import { ApplicationRef, Component, NgZone, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms/forms';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { AppVersion } from '@ionic-native/app-version';
import { Facebook } from '@ionic-native/facebook';
import { File as IonicFileNative } from '@ionic-native/file';
import { GooglePlus } from '@ionic-native/google-plus';
import { ImagePicker } from '@ionic-native/image-picker';
import { LinkedIn } from '@ionic-native/linkedin';
import { TranslationService } from 'angular-l10n';
import {
	ActionSheetController,
	AlertController,
	IonicPage,
	LoadingController,
	NavController,
	Platform,
	Slides,
} from 'ionic-angular';
import { Observable } from 'rxjs/Observable';

import { AppState } from '../../app/app.state';
import { AppConstant } from '../../constants/app-constant';
import { CacheConstant } from '../../constants/cache';
import { SCMRestApi } from '../../constants/scm-rest-api';
import { EAFContext } from '../../eaf/eaf-context';
import { AuthenticationResponseModel } from '../../model/authentication/authentication-response.model';
import { ProvinceMasterModel } from '../../model/master-data/province.master.model';
import { YBatNationalityMasterModel } from '../../model/master-data/ybat-nationality.master.model';
import { UserModel } from '../../model/user/user.model';
import { YBatUserAttachmentModel } from '../../model/user/ybat.user-attachment.model';
import { AppServices } from '../../services/app-services';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { AvaCacheService } from '../../services/cache/cache.service';
import { EAFRestService } from '../../services/eaf-rest/eaf-rest.service';
import { HttpService, RequestContentType } from '../../services/http-services/http.service';
import { PictureService } from '../../services/picture-service/picture.service';
import { UserProfileService } from '../../services/userprofile/userprofile.service';
import { ObjectsUtil } from '../../utilities/objects.util';
import { SecurityUtil } from '../../utilities/security.util';
import { StringUtil } from '../../utilities/string.util';
import { ValidationUtil } from '../../utilities/validation.util';
import { AssignmentService } from '../../workforce/service/assignmentService';
import { LeaveService } from '../../workforce/service/leaveService';
import { WorkforceHttpService } from '../../workforce/service/workforceHttpService';
import { UserProfileAttachmentInfoPage } from '../user-profiles-page/attached-file-info/user-profile-attachment-info.page';

@IonicPage({
	segment: 'bundit',
	priority: 'high',
})
@Component({
	selector: 'bundit-page',
	templateUrl: 'bundit.page.html',
	styleUrls: ['/bundit.page.scss']
})

export class BunditPage {
	private buttonList: Array<ButtonItem> = [];
	constructor(
		public navCtrl: NavController,
		public httpService: HttpService,
		public authenticationService: AuthenticationService,
		public appState: AppState,
		public platform: Platform,
		public imagePicker: ImagePicker,
		public cacheService: AvaCacheService,
		public eafRestService: EAFRestService,
		public alertCtrl: AlertController,
		public actionSheetCtrl: ActionSheetController,
		public appVersion: AppVersion,
		public loadingCtrl: LoadingController,
		public userProfileService: UserProfileService,
		public validationUtil: ValidationUtil,
		public translation: TranslationService,
		public appService: AppServices,
		public androidPermissions: AndroidPermissions,
		public pictureService: PictureService,
		public ionFileNative: IonicFileNative,
		private _applicationRef: ApplicationRef,
		private _zone: NgZone,
		private googlePlus: GooglePlus,
		private fb: Facebook,
		private linkedin: LinkedIn,
		private wfHttpService: WorkforceHttpService,
		private leaveService: LeaveService,
		private assignmentService: AssignmentService,

	) {
		this.initializeData();
	}

	private getColorBtn(index) {
		let colorStr = "blanchedalmond blueviolet brown burlywood darkolivegreen darkorange darkorchid darkred darksalmon darkseagreen darkslateblue forestgreen fuchsia gainsboro ghostwhite goldenrod grey green olive olivedrab orange powderblue purple rebeccapurple red rosybrown royalblue whitesmoke yellow yellowgreen";
		let colorList = colorStr.split(" ");
		colorList = colorList.reverse();
		return index < colorList.length ? colorList[index] : colorList[index % colorList.length];
	}

	private EAF_HandShake() {
		this.eafRestService.handshakeWithEAF().subscribe(resp => {
		}, error => {
			console.warn('Error => ', error);
		});
	}

	private doAction(btnItm: ButtonItem): void {
		console.info("ℹ️ℹ️    btnItm:", btnItm);
		eval('this.' + btnItm.action);
	}
	private initializeData() {
		this.buttonList.push(new ButtonItem("getLeaveHistory", "getLeaveHistory()"));

		this.buttonList.push(new ButtonItem("DMPManualCache", "getDMPManualCache()"));

		this.buttonList.push(new ButtonItem("android-permissions", "getAndroidPermissions()"));

		this.buttonList.push(new ButtonItem("EAF_HandShake", "EAF_HandShake()"));
		// this.buttonList.push(new ButtonItem("getColorBtn", "getColorBtn()"));
		// this.buttonList.push(new ButtonItem("getMasterData Cache", "getMasterDataCache()", 55));

		this.buttonList.push(new ButtonItem("Login Admin :16", "login()"));

		this.buttonList.push(new ButtonItem("getDataBizUser", "getDataBizUser()"));
		// this.buttonList.push(new ButtonItem("Load Address User", "loadAddressUser()"));
		// this.buttonList.push(new ButtonItem("Update User Profile", "updateUserProfile()"));

		this.buttonList.push(new ButtonItem("Array Loop Each", "arrayTestEach()"));
		this.buttonList.push(new ButtonItem("Observe Chaining", "getObserveChaining()"));

		this.buttonList.push(new ButtonItem("ReLoad All Cachce", "loadAllCache()"));

		this.buttonList.push(new ButtonItem("Get Business User Manual", "getUserManual()"));

		this.buttonList.push(new ButtonItem("AddTab", "addTab()"));
		this.buttonList.push(new ButtonItem("RemoveTab", "removeTab()"));

		this.buttonList.push(new ButtonItem("FillString", "testFillString()"));

		this.buttonList.push(new ButtonItem("Compare Language Key", "gettingLanguageKey()"));

		this.buttonList.push(new ButtonItem("Display Server Msg", "displayServerMsg()"));

		// this.buttonList.push(new ButtonItem("Upload Image", "UploadImage()"));
		this.buttonList.push(new ButtonItem("GotoAttachemt", "GotoAttachemt()"));

		this.buttonList.push(new ButtonItem("Google", "signInGoogle()"));
		this.buttonList.push(new ButtonItem("Facebook", "signInFacebook()"));
		this.buttonList.push(new ButtonItem("Linkedin", "signInLinkedin()"));

		this.platformReady();
	}

	private signInFacebook() {
		// this.fb.login(['public_profile', 'user_friends', 'email', 'user_photos'])
		this.fb.api('/me?fields=id,name,email,picture.type(large)', ['public_profile', 'user_friends', 'email', 'user_photos'])
			.then((resp) => {
				console.log("facebook resp:", resp);
			}).catch((err) => {
				console.error("facebook err:", err);
			});
	}

	private signInGoogle() {
		this.googlePlus.login({})
			.then((resp) => {
				console.log("googlePlus resp:", resp);
			}).catch((err) => {
				console.error("googlePlus err:", err);
			});
	}

	private signInLinkedin() {
		this.linkedin.login(['r_basicprofile', 'r_emailaddress', 'rw_company_admin', 'w_share'], true)
			.then((resp) => {
				console.clear();
				console.log("linkedin login resp:", resp);
				let pathStr = ['id', 'first-name', 'last-name', 'picture-url', 'email-address'];
				this.linkedin.getRequest('people/~:(' + pathStr.join(',') + ')').then((people) => { console.log("people resp:", people); }).catch((errPeople) => { console.error("linkedin err:", errPeople); });
			}).catch((err) => {
				console.error("linkedin err:", err);
			});
	}

	private platformReady() {
		console.log("isServeChrome:", this.appService.isServeChrome());
		console.clear();
		this.platform.ready().then(() => {
			console.log("this._platform:", this.platform);
			let platformName = "android cordova core ios ipad iphone mobile mobileweb phablet tablet windows".split(' ');
			platformName.forEach(itm => {
				console.log("platformName:" + itm, this.platform.is(itm));
			});
		});
	}

	/***------------------------------------------------------------------------------ */
	private attachmentFilesList: YBatUserAttachmentModel[] = [];
	private GotoAttachemt(params?: string) {
		let loading = this.alertCtrl.create({
			message: 'Loading',
		});
		loading.present();

		this.userProfileService.getLoginManualServlet(this.appState.businessUser.id).subscribe((resp) => {
			this.appState.businessUser = resp;
			setTimeout(() => {
				loading.onDidDismiss(() => {
					// this.navCtrl.push(UserProfileAttachmentInfoPage, resp);
					this.navCtrl.setRoot(UserProfileAttachmentInfoPage, resp);
				});
				loading.dismiss();
			}, 1000);
		});
	}
	private addAttachment(params?: string) {
		if (this.appService.isServeChrome()) {
			let fileElem = document.getElementById('attachmentsInputId');
			fileElem && fileElem.click();
		} else {
			let _self = this;
			this.pictureService.requestPicture((imagePath) => {
				this.pictureService.getFileDirectory(imagePath).subscribe((fileObj) => {
					this.pictureService.getOrientation(fileObj, (imgResp) => {
						fileObj['orientation'] = imgResp;
						this.processFileReader(this.attachmentFilesList, this.pictureService.getFileExtension(fileObj.name), fileObj, (_resp) => {
							this.attachmentFilesList = _resp;
							console.warn('processFileReader _resp:', _resp);
						});
						console.warn('filesList:', this.attachmentFilesList);
					});
				});
			});
			// this.pictureService.requestPicture((imagePath) => {
			// 	this.attachmentFilesList.push()
			// 	// this.eafRestService.uploadFileV2(imagePath).subscribe((response) => {
			// 	// 	this.attachmentFilesList.
			// 	// });
			// });
		}
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
		console.log("removeAttachment index:", index);
		this.attachmentFilesList.splice(index, 1);
	}
	private UploadImage() {
		console.log("Start !!!!!!!");
		this.uploadingImage(this.attachmentFilesList, (respUploadImg) => {
			console.debug("%ccallbacked !!!", 'background-color:red;color:white', respUploadImg);
		});
		console.log("End !!!!!!!");
	}
	private getSelectedAttachments() {//browser,android
		let _self = this;
		let inputFileField = document.getElementById("attachmentsInputId");
		let filesList = [];
		if (inputFileField != null) {
			filesList = inputFileField['files'];
		}
		for (let idx = 0; idx < filesList.length; idx++) {
			let fileObj = filesList[idx];
			this.pictureService.getOrientation(fileObj, (imgResp) => {
				fileObj.orientation = imgResp;
				this.processFileReader(this.attachmentFilesList, this.pictureService.getFileExtension(fileObj.name), fileObj, (_resp) => {
					this.attachmentFilesList = _resp;
					console.warn('processFileReader _resp:', _resp);
				});
			});
			console.warn('fileObj:', fileObj);
		}
		console.warn('filesList:', this.attachmentFilesList);
	}

	private uploadingImage(attachFiles: any[], callback) {
		let uploadImg: YBatUserAttachmentModel[] = [];
		if (attachFiles && !ObjectsUtil.isEmptyObject(attachFiles)) {
			for (let index = 0; index < attachFiles.length; index++) {
				let itm = attachFiles[index];
				console.log("itm:", itm);
				let file = new File([itm.dataBLOB], itm.name);
				console.log("itm.data:", itm.data);
				console.log("file:", file);
				this.eafRestService.uploadFile(file).subscribe(resp => {
					let respItm = resp && resp.constructor == Array && resp.length > 0 && resp[0];
					console.log("uploadFile:", respItm);
					let attactItm: YBatUserAttachmentModel = new YBatUserAttachmentModel();
					if (this.appState.businessUser && this.appState.businessUser.id) {
						attactItm.businessUserId = this.appState.businessUser.id;
					} else {
						attactItm.businessUserId = "16";
					}

					attactItm.filePath = respItm.id;
					attactItm.fileName = respItm.fileName;
					attactItm.orgId = this.appState.currentOrganizationId;
					attactItm.seq = (uploadImg.length + 1).toString();
					uploadImg.push(attactItm);

					if (index == attachFiles.length - 1) {
						callback(uploadImg);
					}
				}, error => {
					console.warn('Error => ', error);
				});
			}
		} else {
			callback(uploadImg);
		}
	}
	//***************************Service Utils********************************* */
	private processFileReader = (filseArr: any, fileType: any, file: any, callback) => {
		let _self = this;
		if (file.size != null) {
			console.log('File size:', file.size / 1024);
		} else {
			console.warn('File size null');
		}
		let imgExtension = ['jpg', 'png', 'jpeg'];
		if (fileType && fileType != null && imgExtension.toString().indexOf(fileType.toLowerCase()) != -1) {
			let _file = file,
				fileType = file.type,
				reader = new FileReader();
			reader.onloadend = () => {
				let imageFile = new Image();
				imageFile.src = reader.result;
				imageFile.onload = () => {
					let maxWidth = ImageConstant.maxWidth,
						maxHeight = ImageConstant.maxHeight,
						imageWidth = imageFile.width,
						imageHeight = imageFile.height;
					if (imageWidth > imageHeight) {
						if (imageWidth > maxWidth) {
							imageHeight *= maxWidth / imageWidth;
							imageWidth = maxWidth;
						}
					} else {
						if (imageHeight > maxHeight) {
							imageWidth *= maxHeight / imageHeight;
							imageHeight = maxHeight;
						}
					}

					//Start Logic Rotating Image after shoot from camera
					let canvas = document.createElement('canvas');
					canvas.width = imageWidth;
					canvas.height = imageHeight;
					let ctx = canvas.getContext("2d");
					let srcOrientation = file.orientation;
					let isPortrait = false,
						isUpSideDown = false;
					switch (srcOrientation) {
						case 1: //แนวนอน ทางซ้าย -> ถูกต้อง
							ctx.transform(1, 0, 0, 1, 0, 0);
							break;
						case 2:
							ctx.transform(-1, 0, 0, 1, imageWidth, 0);
							break;
						case 3: //แนวนอน ทางขวา -> ถูกต้อง
							ctx.transform(-1, 0, 0, -1, imageWidth, imageHeight);
							break;
						case 4:
							ctx.transform(1, 0, 0, -1, 0, imageHeight);
							break;
						case 5:
							ctx.transform(0, 1, 1, 0, 0, 0);
							break;
						case 6: //แนวตั้ง ปกติ -> ผิด,แต่เพิ่มการปรับด้านล่าง -> ถูกแล้ว
							ctx.transform(0, 1, -1, 0, imageHeight, 0);
							isPortrait = true;
							break;
						case 7:
							ctx.transform(0, -1, -1, 0, imageHeight, imageWidth);
							break;
						case 8: //แนวตั้ง กลับหัว ->ผิด,แต่เพิ่มการปรับด้านล่าง -> ถูกแล้ว
							ctx.transform(0, -1, 1, 0, 0, imageWidth);
							isPortrait = true;
							isUpSideDown = true;
							break;
					}
					if (isPortrait) {
						canvas.height = imageWidth;
						canvas.width = imageHeight;
						if (isUpSideDown) {
							ctx.rotate(-0.5 * Math.PI); //แนวตั้งกลับหัว
							ctx.translate(-imageWidth, 0);
						} else {
							ctx.rotate(0.5 * Math.PI); //แนวตั้งปกติ
							ctx.translate(0, -imageHeight);
						}
						ctx.drawImage(imageFile, 0, 0, imageWidth, imageHeight);
						let _imageWidth = imageHeight;
						let _imageHeight = imageWidth;

						imageWidth = _imageWidth;
						imageHeight = _imageHeight;
					} else {
						ctx.drawImage(imageFile, 0, 0, imageWidth, imageHeight);
					}
					let finalFile = canvas.toDataURL(fileType);

					let fileItem = {
						dataBLOB: this.pictureService.dataURItoBlob(finalFile),
						dataURI: finalFile,
						type: finalFile,
						file: file,
						portrait: isPortrait,
						lanscape: !isPortrait,
						usd: isUpSideDown,
						name: file.name,
						width: imageWidth,
						height: imageHeight
					};
					filseArr.push(fileItem);
					callback(filseArr);
				};
			};
			reader.readAsDataURL(_file);
		}
		// return filseArr;
	}

	/***------------------------------------------------------------------------------ */

	private slidesTab: any[] = [];
	private addTab(): void {
		let tab = {
			id: this.slidesTab.length + 1,
			name: "TabNo. " + (this.slidesTab.length + 1)
		};
		this.slidesTab.push(tab);
	}

	private removeTab(): void {
		this.slidesTab.pop();
	}

	private btnWithButton(btn_type: number): boolean {
		let existBtn = this.buttonList.find(item => item.btn_type === btn_type);
		return !ObjectsUtil.isEmptyObject(existBtn);
	}

	private getMasterDataCache() {
		this.cacheService.getCacheMaster(CacheConstant.MS_PROVINCE, ProvinceMasterModel).subscribe(respData => {
			console.log("cacheProvince:", respData);
		}, error => {
			console.warn('Error => ', error);
		});
	}

	private loadAddressUser() {
		// this.userProfileService.get
		let userAddressList = this.appState.businessUser.userAddressList;
		console.log("userAddressList:", userAddressList, JSON.stringify(userAddressList));
	}
	private updateUserProfile() {
		// this.userProfileService.get
		this.userProfileService.updateUserProfile(this.appState.businessUser).subscribe(ressp => {
			console.log("updateUserProfile:", ressp);
		}, error => {
			console.warn('Error => ', error);
		});
	}

	private getDataBizUser() {
		// this.userProfileService.getBusinessUserM("admin");
	}

	private handleRespMessage(error) {
		console.error("error:", error);
		this.alertCtrl.create({
			message: `${error.message}`,
			buttons: [{
				text: 'Ok',
				handler: () => {
					console.log('Dismiss');
				}
			}]
		}).present();
	}

	private login() {
		let loading = this.loadingCtrl.create({
			content: 'SignIn processing...'
		});
		loading.present();
		let loginModel: UserModel = new UserModel();
		loginModel.memberEmail = 'admin';
		loginModel.password = '1234';
		this.authenticationService.loginRest(loginModel).subscribe((respData) => {
			console.info("resp:", respData);
			if (ObjectsUtil.isEmptyObject(respData)) {
				let errMsg = new Error("Email or Password is incorrect, please verify your input again !!!");
				this.handleRespMessage(errMsg);
			} else {
				this.appState.businessUser = respData;
				this.go2UserProfilesAndLoadOtherInfo();
			}
			loading.dismiss();
		}, errorResp => {
			this.handleRespMessage(errorResp);
			loading.dismiss();
		});
	}

	private generate(): string {
		let randomstring = Math.random().toString(8);//.slice(-8);
		console.log("generated:", randomstring);
		return randomstring;
	}

	private arrayTestEach() {
		let var2 = [];

		for (let i = 0; i < 200; i++) {
			var2.push({ id: var2.length + 1, name: this.generate() });
		}

		let idx = 0;
		var2.forEach(resItem => {
			console.log("[idx", idx, "] resItem:", resItem);
		});
		idx++;
		var2.forEach(resItem => {
			console.log("[idx", idx, "] resItem:", resItem);
		});
	}

	private go2UserProfilesAndLoadOtherInfo() {
		// this.userProfileService.getBusinessUserM(this.appState.businessUser.memberEmail);
		// this.userProfileService.getBusinessUserInfoByOrg('ybat');
		// setTimeout(() => {
		// 	this.navCtrl.setRoot(UserProfilePersonInfoPage, this.appState.businessUser);
		// }, 1000);
	}

	@ViewChild('pageSlider') private pageSlider: Slides;
	private tabs: any = '0';
	private changeWillSlide($event) {
		this.tabs = $event._snapIndex.toString();
	}
	private selectTab(index) {
		this.pageSlider.slideTo(index);
	}

	private getObserveChaining() {
		let idx = 0;
		let observableChain = Observable.create((observer) => {
			setTimeout(() => {
				observer.next(1);
				observer.complete();
			}, 1000);
		}).flatMap((result) => {
			console.log("observer[", idx++, "]", result);
			return Observable.create((observer) => {
				setTimeout(() => {
					observer.next(result + 2);
					observer.complete();
				}, 1000);
			});
		}).flatMap((result) => {
			console.log("observer[", idx++, "]", result);
			return Observable.create((observer) => {
				setTimeout(() => {
					observer.next(result + 3);
					observer.complete();
				}, 1000);
			});
		});
		observableChain.subscribe((finalResult) => {
			console.log("observer[", idx++, "]", finalResult);
			console.log("observableChain:", finalResult);
		}, error => {
			console.warn('Error => ', error);
		});
	}

	private getUserManual() {
		console.clear();
		console.clear;
		let userId = "16";//admin
		let languages = "";
		if (this.appState.businessUser) {
			userId = !StringUtil.isEmptyString(this.appState.businessUser.id) ? this.appState.businessUser.id : userId;
			languages = this.appState.businessUser.languages;
		}
		this.userProfileService.getLoginManualServlet(userId, languages).subscribe(respUserM => {
			this.appState.businessUser = respUserM;
			console.log("getLoginManualServlet resp:", respUserM);
			this.convertValueToString(respUserM);
			// this.navCtrl.setRoot(UserProfilePersonInfoPage);
		}, error => {
			console.warn('Error => ', error);
		});
	}

	private convertValueToString(obj: any): void {
		console.log("");
	}

	private loadAllCache() {
		console.log("CacheConst.CacheName:", CacheConstant);
		Object.keys(CacheConstant).forEach(key => {
			if (CacheConstant.hasOwnProperty(key)) {
				let cacheName = CacheConstant[key];
				let eafModuleM = EAFContext.EAF_MODULE_LIST.find(item => item.tableName == cacheName);
				this.cacheService.getCacheMaster(cacheName, eafModuleM.eafModuleClass).subscribe(resp => {
					console.log("cacheName:", cacheName, " ,data:", resp);
				}, error => {
					console.warn('Error => ', error);
				});
			}
		});
	}

	private testFillString() {
		let _body = { "MD1171819565": [{ "UPDATE": { "BUSINESS_USER": { "ID": "16", "SIGNINTYPE": "1", "SOCIALUSERNAME": "Admin-Arm", "SCMUSERNAME": "admin-Arm", "SCMPWD": "1234", "MEMBEREMAIL": "admin", "SOCIALPICPROFILE": "./assets/img/marty-avatar.png", "FOLLOWERAMT": 12, "FOLLOWINGAMT": 14, "SHOPAMT": 162, "SHOPFOLLOWINGAMT": 0, "CUSTFNAME": "Bundit3333", "CUSTLNAME": "Ngamkam333", "MOBILE": "0802806888", "ADDERID": "0", "CROPX": 0, "CROPY": 0, "CROPWIDTH": 0, "LANGUAGES": "EN", "MOBILEID": "&nbsp", "USERLAT": "20.287264999999998", "USERLONG": "99.80951833333332", "NOTSHAREASSIGN": 0, "USER_STATUS": "A", "BIRTH_DATE": "1992-02-01", "UPDATE_DATE": "2017-06-20", "UPDATE_BY": "Administrator", "TITLE_CODE": "001", "GENDER": "M", "NICK_NAME": "AbStBdNg", "TELEPHONE": "026339367", "CARD_ID": "1101100093133", "TITLE_NAME": "นาย", "SOCIALUSERID": null, "OFFICEPHONE": null, "ADDRESS": null, "CITY": null, "COUNTRY": null, "PROVINCE": null, "ZIPCODE": null } } }] };

		let fillObject = (body: any) => {
			Object.keys(body).forEach(propKey => {
				let elmVal = body[propKey];
				if (elmVal != null) {//Array
					if (elmVal.constructor == Object) {
						fillObject(elmVal);
					} else if (elmVal.constructor == Array) {
						fillObject(elmVal);
					} else if (elmVal.constructor == Number) {
						body[propKey] = elmVal + '';
					}
				}
			});
			return body;
		};
		console.log("_body:", _body);
		fillObject(_body);
		console.log("Filled _body:", _body);
	}

	private username: string = "";
	private password: string = "";
	private generatedMD5: string;
	private generateUserPassword() {
		this.generatedMD5 = SecurityUtil.encodePassword(this.username, this.password);
		console.log("EncodePassword:", this.generatedMD5);

		console.log("appVersion:", this.appVersion);
		console.log("getAppName:", this.appVersion.getAppName());
		console.log("getPackageName:", this.appVersion.getPackageName());
		console.log("getVersionCode:", this.appVersion.getVersionCode());
		console.log("getVersionNumber:", this.appVersion.getVersionNumber());
	}

	private loginSocialRest(authenticationRequest: UserModel) {
		let encodedPassword = SecurityUtil.encodePassword(authenticationRequest.memberEmail, authenticationRequest.password);
		return this.httpService.httpPost<AuthenticationResponseModel>(SCMRestApi.URL + '/loginDMP.do', {
			m: 'signInFromSCM'
		}, {
				scm_username: authenticationRequest.memberEmail,
				scm_pwd: encodedPassword,
			}, RequestContentType.APPLICATION_JSON).map(resp => {
				console.log("loginSocialRest resp:", resp);
				if (resp && resp.message === 'Ok') {
					throw new Error("You Account already Actived !!!!");
				} else if (resp && resp.message == "Need Email Activated") {
					console.warn('Fail loggin in : ', JSON.stringify(resp, null, 2));
					let userModel = new UserModel();
					return Object.assign(userModel, resp.object);
				} else {
					console.warn('Error loggin in : ', JSON.stringify(resp, null, 2));
					throw new Error(SCMRestApi.ERROR_CODES.INVALID_CREDIENTIAL);
				}
			});
	}
	private getActiveEmail(email: string, pwd: string) {
		let loginModel: UserModel = new UserModel();
		loginModel.memberEmail = email;
		loginModel.password = pwd;

		let loading = this.alertCtrl.create({ message: 'Loading...', });
		loading.present();
		this.loginSocialRest(loginModel).subscribe((respData) => {
			console.info("respData:", respData);
			if (respData.id && !StringUtil.isEmptyString(respData.id)) {
				let activedUrl = SCMRestApi.URL + '/loginDMP.do?m=emailActivate&uid=' + respData.id;
				this.httpService.httpGetObservable(activedUrl).subscribe(resp => {
					loading.dismiss();
					console.log("resp:", resp);
					this.alertCtrl.create({ message: 'You Account has been actived !!!!', }).present();
				});
			}
		}, (errorResp: Error) => {
			loading.dismiss();
			this.handleRespMessage({
				message: `${this.translation.translate(errorResp.message)}`
			});
		});
	}

	private gettingLanguageKey() {
		let langObject = {};
		let compareLangKey = () => {
			console.log("langObject:", langObject);
			let enLang = langObject['en'];
			let thLang = langObject['th'];

		};

		this.httpService.httpGet("./assets/locale/en.json").subscribe(resp => {
			langObject['en'] = resp;
		}, error => {
			console.warn('Error => ', error);
		}).add(() => {
			this.httpService.httpGet("./assets/locale/th.json").subscribe(resp => {
				langObject['th'] = resp;
			}, error => {
				console.warn('Error => ', error);
			}).add(compareLangKey);
		});
	}

	private dataForm: NgForm;
	private businessUser: UserModel = new UserModel();
	private ngModelOpt = { standalone: true };
	private validateForm(formData?: NgForm) {
		if (formData.form.valid == true) {
			console.log("%cPASS", 'font-size:3em;color:white;background:green');
		} else {
			this.validationUtil.displayInvalidRequireField(formData.form, "MSG.USERPROFIEL_P1.");
		}
	}

	private getDMPManualCache(): void {
		this.cacheService.getTitleMaster(AppConstant.CUSTOMER_TYPE.Individual).subscribe(resp => {
			console.log("getTitleMaster :", resp);
		}, error => {
			console.warn('Error => ', error);
		});

		this.cacheService.getCacheMaster(CacheConstant.ZYBAT_MS_NATIONALITY, YBatNationalityMasterModel).subscribe(resp => {
			console.log("nationalityList:", resp);
		}, error => {
			console.warn('Error => ', error);
		});

		// let params: any = {
		// 	reqCacheName: "ZYBAT_MS_NATIONALITY",
		// 	ENTITY_ID: "EN_170523144555661_v001",
		// };
		// this.cacheService.getDMPManualCache("DMPMobileCache", params).subscribe(resp => {
		// 	console.log("DMPMobileCache:", resp);
		// });
	}

	private displayServerMsg(): void {
		this.appService.displayServerMsg();
	}

	private reqIdx = 0;
	private dummyEmp: any[] = [];
	private getLeaveHistory(): void {

		let bizUSer = this.appState.businessUser;

		this.wfHttpService.employeeCode = bizUSer.employeeCode || bizUSer.userCode;

		this.assignmentService.getAllEmployee("")
			.do((resp) => {
				// console.log("getAllEmployee resp:", resp);
				if (resp && resp.length && resp.length > 0) {
					resp.forEach(itm => {
						this.dummyEmp.push(itm.employeeCode);
					});
				}
			})
			.subscribe(resp => {
				this.reqLeaveWithIndex(this.reqIdx);
			});
	}

	private reqLeaveWithIndex(idx: number): void {
		let empCode = this.dummyEmp[idx];
		this.leaveService.getHistoryRequest({ employeeCode: empCode }).subscribe((res) => {
			(res && res.length > 0) && console.log("[idx:" + idx + "] => getHistoryRequest [" + empCode + "] :", res && res.length);

			if ((idx + 1) < this.dummyEmp.length) {
				this.reqLeaveWithIndex(idx + 1);
			} else {
				console.log("Complete With Index :", idx);
			}
		});
	}

	private getAndroidPermissions(): void {
		let peremissionList = [
			this.androidPermissions.PERMISSION.CAMERA,
			this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE,
			this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE,
			this.androidPermissions.PERMISSION.LOCATION_HARDWARE,
		];
		peremissionList.forEach((peremissionItm) => {
			this.androidPermissions.checkPermission(peremissionItm)
				.then((success) => {
					console.log('Permission [' + peremissionItm + '] granted...');
				}, (err) => {
					this.androidPermissions.requestPermissions(peremissionItm);
				});
		});

		this.androidPermissions.requestPermissions(peremissionList);
	}
}

class ButtonItem {
	public name: string;
	public action: string;
	public btn_type?: number;
	constructor(_name: string, _action: string, _btn_type?: number) {
		this.name = _name;
		this.action = _action;
		if (_btn_type) {
			this.btn_type = _btn_type;
		}
	}
}
class ImageConstant {
	public static quality: 50; // 0-100
	public static maxWidth: 1024;
	public static maxHeight: 1024;
}