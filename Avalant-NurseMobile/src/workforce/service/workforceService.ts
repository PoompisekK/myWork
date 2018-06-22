import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Camera, PictureSourceType } from '@ionic-native/camera';
import { FileChooser } from '@ionic-native/file-chooser';
import { FilePath } from '@ionic-native/file-path';
import { FileTransfer, FileTransferObject, FileUploadOptions, FileUploadResult } from '@ionic-native/file-transfer';
import { ActionSheetController, AlertController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';

import { ContsVariables } from '../global/contsVariables';
import { CheckInOutModel } from '../model/checkInOut.model';
import { EventModel } from '../model/event.model';
import { LeaveModel } from '../model/leave.model';
import { userProfileModel } from '../model/workforce.model';

@Injectable()
export class WorkforceService {
    private checkInOut: CheckInOutModel;
    private leaves: LeaveModel[] = new Array<LeaveModel>();
    private events: EventModel[] = new Array<EventModel>();
    private place: any = {
        name: null,
        coords: {
            lat: null,
            lng: null
        }
    };
    private loading: any;
    public static CAMERA_CANCELLED = 'Camera cancelled.';
    public static SELECTION_CANCELLED = 'Selection cancelled.';
    private _employeeCode: string;
    private _userProfile: userProfileModel = new userProfileModel();
    constructor(
        private actionSheetCtrl: ActionSheetController,
        private alertCtrl: AlertController,
        private camera: Camera,
        private fileChooser: FileChooser,
        private filePath: FilePath,
        private fileTransfer: FileTransfer,
        private http: Http,
    ) {

    }

    set userProfile(userData: userProfileModel) {
        this._userProfile = userData;
    }
    get userProfile() {
        return this._userProfile;
    }
    public checkIn(enTranceTime: CheckInOutModel) {
        this.checkInOut = enTranceTime;
    }
    public saveLeave(leave: LeaveModel) {

        this.leaves.push(leave);
    }
    public saveEventCalendar(event: EventModel) {
        this.events.push(event);
    }
    set seletedPlace(place: any) {
        this.place = place;
    }
    get DataCheckIn() {
        return this.checkInOut;
    }
    get DataLeaves() {
        return this.leaves;
    }
    get DataEvents() {
        return this.events;
    }
    get seletedPlace() {
        return this.place;
    }

    public getFilePath(resp: any): string {
        let respFile = resp.path || resp.name && resp.name instanceof Array && resp.name.length > 0 && resp.name[0] || resp.name || resp;
        return respFile;
    }

    public requestPicture(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.actionSheetCtrl.create({
                // title: 'เลือกรูปจากแหล่งที่มา',
                title: 'Choose image from',
                buttons: [
                    {
                        // text: 'ไลบรารี่',
                        text: 'Libraries',
                        handler: () => {
                            this.takePictureFromSource(this.camera.PictureSourceType.PHOTOLIBRARY).subscribe(imagePath => {
                                // this.loading = this.loadingCtrl.create({
                                //     content: 'ระบบกำลังประมวลผล รอสักครู่...'
                                // });
                                // this.loading.present();
                                let fileName = this.getFileName(imagePath);
                                let file = { path: imagePath, name: fileName };
                                // this.loading.dismiss();
                                resolve(file);
                                // this.uploadFileTranfer(imagePath).then((res) => {
                                //     this.loading.dismiss();
                                //     resolve(res);
                                //     console.log("res form file tranfer", res)
                                // }).catch((err) => {
                                //     console.warn(err);
                                //     this.loading.dismiss();
                                // });
                            }, (error) => {
                                if (error !== WorkforceService.CAMERA_CANCELLED && error !== WorkforceService.SELECTION_CANCELLED) {
                                    if (this.loading) {
                                        this.loading.dismiss();
                                    }
                                    console.log('⚠️ Error during take picture :', error);
                                    this.alertCtrl.create({
                                        title: `Caution`,
                                        // message: `เกิดข้อผิดพลาดขณะเลือกรูป`,
                                        message: `Choose image fail`,
                                    }).present();
                                    reject(error);
                                }

                            });
                        }
                    },
                    {
                        // text: 'กล้อง',
                        text: 'Camera',
                        handler: () => {
                            this.takePictureFromSource(this.camera.PictureSourceType.CAMERA).subscribe(imagePath => {
                                let fileName = this.getFileName(imagePath);
                                let file = { path: imagePath, name: fileName };
                                resolve(file);
                                // this.loading = this.loadingCtrl.create({
                                //     content: 'ระบบกำลังประมวลผล รอสักครู่...'
                                // });
                                // this.loading.present();
                                // this.uploadFileTranfer(imagePath).then((res) => {
                                //     resolve(res);

                                // }).catch((err) => {
                                //     console.warn(err);
                                //     this.loading.dismiss();
                                // });
                            }, (error) => {
                                if (error !== WorkforceService.CAMERA_CANCELLED) {
                                    if (this.loading) {
                                        this.loading.dismiss();
                                    }
                                    console.log('⚠️ Error during take picture :', error);
                                    this.alertCtrl.create({
                                        title: `Caution`,
                                        // message: `เกิดข้อผิดพลาดขณะเลือกรูป`,
                                        message: `Choose image fail`,
                                    }).present();
                                    reject(error);
                                }
                            });
                        }
                    },
                    {
                        text: 'Cancel',
                        role: 'cancel'
                    }
                ]
            }).present();
        });
    }
    public takePictureFromSource(sourceType: PictureSourceType, isStoreLocal?: boolean): Observable<string> {
        const options = {
            quality: 80,
            sourceType: sourceType,
            saveToPhotoAlbum: true,
            correctOrientation: true
        };
        return Observable.fromPromise(this.camera.getPicture(options));
    }
    public uploadFileTranfer(path: string, name: string, type: string): Promise<FileUploadResult> {
        return new Promise((resolve, reject) => {
            console.log(path);
            console.log(name);
            // let fileName = this.getFileName(path);
            // console.info("fileName", fileName);
            // console.info("filePath", path);
            const options: FileUploadOptions = {
                params: {
                    type: type
                },
                fileKey: 'file',
                fileName: name,
                chunkedMode: false
            };
            const fileTransfer: FileTransferObject = this.fileTransfer.create();
            // resolve(fileTransfer);
            fileTransfer.upload(path, ContsVariables.HCMRestService + "/file/upload", options)
                .then((data) => {
                    resolve(data);
                }, (err) => {
                    reject(err);
                });
        });
    }

    public openFile(): Observable<any> {
        return Observable.create((observer) => {
            try {
                this.openFileChooser().subscribe(respFileUri => {
                    this.filePath.resolveNativePath(respFileUri).then((_nativeFilePath: string) => {
                        const tmpFileName: string = new Date().getTime().toString();
                        observer.next(new File([_nativeFilePath], tmpFileName));
                        observer.complete();
                    }).catch(error => {
                        console.error("resolveNativePath : ", error);
                        observer.error(error);
                        observer.complete();
                    });
                }, (error => {
                    console.error("openFileChooser fileUri : ", error);
                    observer.error(error);
                    observer.complete();
                }));
            } catch (e) {
                observer.error(e);
                observer.complete();
            }
        });
    }

    private openFileChooser(): Observable<string> {
        return Observable.create((observer) => {
            this.fileChooser.open().then((fileUri) => {
                console.log("fileUri : ", fileUri);
                observer.next(fileUri);
                observer.complete();
            }).catch((error) => {
                console.error("fileUri : ", error);
                observer.error(error);
                observer.complete();
            });
        });
    }

    private getFileName(pathStr: string): string {
        if (!(pathStr.toString().trim() === '' && pathStr.toString().trim().length == 0)) {
            let endIdx = pathStr.split('/');
            let _pathStr = endIdx.pop();
            _pathStr = (_pathStr || "").split('?')[0];
            return _pathStr;
        } else {
            return "";
        }
    }
    public getPicturesPlaceSearch(photoreference: string): Observable<any> {
        // let params = new URLSearchParams();
        // params.set('q', messageInput);

        return this.http.get("https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=" + "ChIJN1t_tDeuEmsRUsoyG83frY4" + "&key=" + ContsVariables.googleKey);
    }

    // public getEmployeeProfile(employeeCode: string): Observable<userProfileModel> {
    // // return this.httpReqWFService.postParamsService("/personalinfo/getEmployeeProfile", {}, true);
    // }

}