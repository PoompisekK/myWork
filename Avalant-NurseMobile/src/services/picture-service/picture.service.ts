import { Injectable } from '@angular/core';
import { ToastController, AlertController, Platform, ActionSheetController, LoadingController } from 'ionic-angular';
import { Camera, PictureSourceType } from '@ionic-native/camera';
import { Transfer } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
import { File as ionFileNative, Entry, FileEntry, DirectoryEntry } from '@ionic-native/file';
import { Observable } from 'rxjs';
import { message } from '../../layout-module/components/form-control-base/validate';
import { StringUtil } from '../../utilities/string.util';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { Crop } from '@ionic-native/crop';
/**
 * Picture Service
 * 
 * @author NorrapatN
 * @since Mon Jul 24 2017
 */
@Injectable()
export class PictureService {

  public static CAMERA_CANCELLED = 'Camera cancelled.';
  private limitSizeImage: number = 2097152;
  constructor(
    private androidPermissions: AndroidPermissions,
    private platform: Platform,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private camera: Camera,
    private crop: Crop,
    private transfer: Transfer,
    private file: ionFileNative,
    private filePath: FilePath,
    private actionSheetCtrl: ActionSheetController,
    private loadingCtrl: LoadingController,
  ) {

  }

  public async requestPermissions() {
    if (this.platform.is('android')) {

      try {
        let permission = await this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.CAMERA);
        // console.log('Permission :', permission);
        return permission && permission.hasPermission;
      } catch (e) {
        return await this.androidPermissions.requestPermissions(this.androidPermissions.PERMISSION.CAMERA);
      }

    } else {
      return true;
    }
  }

  public requestPicture(callback?: (imagePath: string) => void, errorCallback?: (error: any) => void) {
    const actionSheet = this.actionSheetCtrl.create({
      title: 'Select Image Source',
      buttons: [
        {
          text: 'Load from Library',
          handler: () => {
            this.takePictureFromSource(this.camera.PictureSourceType.PHOTOLIBRARY).subscribe(result => {
              console.debug('💭 Take picture result :', result);
              callback && typeof callback === 'function' && callback(result);
            }, (error) => {
              // Ignore camera cancellation
              if (error !== PictureService.CAMERA_CANCELLED) {
                console.warn('⚠️ Error during take picture :', error);
                this.alertCtrl.create({
                  title: `Error taking picture via Photo library.`,
                  message: JSON.stringify(error),
                }).present();
                errorCallback && typeof errorCallback === 'function' && errorCallback(error);
                return Observable.throw(error);
              }
            });
          }
        },
        {
          text: 'Use Camera',
          handler: () => {
            this.takePictureFromSource(this.camera.PictureSourceType.CAMERA).subscribe(result => {
              console.debug('💭 Take picture result :', result);
              callback && typeof callback === 'function' && callback(result);

            }, (error) => {
              // Ignore camera cancellation
              if (error !== PictureService.CAMERA_CANCELLED) {
                console.warn('⚠️ Error during take picture :', error);
                this.alertCtrl.create({
                  title: `Error taking picture via Photo library.`,
                  message: JSON.stringify(error),
                }).present();
                errorCallback && typeof errorCallback === 'function' && errorCallback(error);
                return Observable.throw(error);
              }
            });
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    actionSheet.present().then(result => {
      // console.debug('Action sheet :', result);
    });
  }
  public takePictureFromSource(sourceType: PictureSourceType, isStoreLocal?: boolean): Observable<string> {
    // Android need to check permission before used !!
    return Observable.fromPromise(this.requestPermissions()).flatMap((result) => {

      console.debug('💭 Permission request result :', result);
      // console.log(sourceType);
      // Create options for the Camera Dialog
      let options = {
        quality: 80,
        sourceType: sourceType,
        saveToPhotoAlbum: false,
        correctOrientation: true,
        targetHeight: 1000,
        targetWidth: 1000
      };
      // Get the data of an image
      return Observable.fromPromise(this.camera.getPicture(options)).flatMap((imagePath) => {
        return Observable.fromPromise(this.cropImage(imagePath)).flatMap((imagePath) => {
          return Observable.fromPromise(this.file.resolveLocalFilesystemUrl(imagePath)).flatMap((entry) => {
            return Observable.fromPromise(this.createFileImageForCheckSize(entry)).flatMap((status) => {
              //after check size image <= 2MB (2097152B)
              // console.debug('response after check size :', status);
              if (status == "success") {
                // Return directly of original file path
                if (isStoreLocal !== true) {
                  // console.log("is not StoreLocal");
                  return Observable.of(imagePath);
                }
                let copyFileToLocalDir: Observable<Entry>;
                // Special handling for Android library
                if (this.platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
                  return Observable.fromPromise(this.filePath.resolveNativePath(imagePath))
                    .flatMap(filePath => {
                      let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
                      let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
                      return this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
                    });
                } else {
                  let currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
                  let correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
                  copyFileToLocalDir = this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
                }
                return copyFileToLocalDir.map((result => result.nativeURL));
              } else {
                // this.presentToast('ไฟล์ภาพเกินขนาด 2MB กรุณาเลือกรูปใหม่อีกครั้ง');
                return Observable.throw('ไฟล์ภาพเกินขนาด 2MB กรุณาเลือกรูปใหม่อีกครั้ง');
              }
            });
          });
        });
      });
    });
  }
  public createFileImageForCheckSize(entry): Promise<string> {
    //ไว้สำหรับ เช็คขนาดไฟล์เกิน เพียงอย่างเดียว
    return new Promise((resolve, reject) => {
      (<FileEntry>entry).file((file) => {
        // console.debug('file object from imagePath :', file);
        //image file limit size 2MB
        if (file.size <= this.limitSizeImage) {
          // console.debug('status check size image :', "success");
          resolve("success");
        } else {
          //case size exceeded
          resolve("failed");
        }
      });
    });
  }
  public cropImage(imagePath): Promise<string> {
    // after got imagePath will into crop process
    return Promise.resolve(this.crop.crop(imagePath));
  }
  // Create a new name for the image
  private createFileName() {
    let d = new Date(),
      n = d.getTime(),
      newFileName = n + ".jpg";
    return newFileName;
  }
  /**
   * Copy the image to a local folder
   * 
   * @param namePath Folder path
   * @param currentName File name
   * @param newFileName New file name
   */
  private copyFileToLocalDir(namePath, currentName, newFileName): Observable<Entry> {
    return Observable.fromPromise(this.file.copyFile(namePath, currentName, this.file.dataDirectory, newFileName));

    /* .then(success => {
      this.lastImage = newFileName;
      this.uploadImage();
    }, error => {
      this.presentToast('Error while storing file.');
    }); */
  }

  private presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

  // Always get the accurate path to your apps folder
  public pathForImage(img) {
    if (img === null) {
      return '';
    } else {
      return this.file.dataDirectory + img;
    }
  }

  /**
   * @param imageFullPath:string => input path response from callback "requestPicture"
   * @author Bundit.Ng
   */
  public getFileDirectory(imageFullPath: string): Observable<File> {

    //  imagePath : file:///storage/emulated/0/Android/data/com.avalant.ybat/cache/IMG_3337_c10665e9-efd4-4057-ae3e-e7a9ce633a9b_1024x1024.JPG?1500955447785
		/**
		 * this.file.applicationDirectory								: file:///android_asset/
		 * this.file.applicationStorageDirectory				: file:///data/user/0/com.avalant.ybat/
		 * this.file.cacheDirectory											: file:///data/user/0/com.avalant.ybat/cache/
		 * this.file.dataDirectory											: file:///data/user/0/com.avalant.ybat/files/
		 * this.file.externalApplicationStorageDirectory: file:///storage/emulated/0/Android/data/com.avalant.ybat/
		 * this.file.externalCacheDirectory							: file:///storage/emulated/0/Android/data/com.avalant.ybat/cache/
		 * this.file.externalDataDirectory							: file:///storage/emulated/0/Android/data/com.avalant.ybat/files/
		 * this.file.externalRootDirectory							: file:///storage/emulated/0/
		 */
    // return Observable.create((observer) => {
    //   let dataDirectory = this.file.externalCacheDirectory;
    //   console.log("dataDirectory:", dataDirectory);
    //   this.file.resolveDirectoryUrl(dataDirectory).then((directoryEntry) => {
    //     console.log("directoryEntry:", directoryEntry);
    //     return this.file.getFile(directoryEntry, this.getFileName(imageFullPath), { create: false });
    //   }).then((fileEntry) => {
    //     console.log("fileEntry:", fileEntry);
    //     return Observable.create((observer2) => {
    //       fileEntry.file(file => {
    //         console.log("file:", file);
    //         observer.next(file);
    //         observer.complete();
    //       })
    //     });
    //   });
    // });

    // return Observable.fromPromise(
    //   this.file.resolveDirectoryUrl(this.file.externalCacheDirectory)
    //     .then((directoryEntry) => {
    //       return this.file.getFile(directoryEntry, this.getFileName(imageFullPath), { create: false });
    //     }).then((fileEntry) => {
    //       fileEntry.file(file => {
    //         console.log("file:", file);
    //         return file;
    //       });
    //     })
    // );

    let observable = Observable.create((observer) => {
      let directory: string = null;
      if (this.platform.is('android')) {
        directory = this.file.externalCacheDirectory;
      } else if (this.platform.is('ios')) {
        directory = this.file.tempDirectory;
        // console.log("tempDirectory:", this.file.tempDirectory);
        // console.log("documentsDirectory:", this.file.documentsDirectory);
        // console.log("syncedDataDirectory:", this.file.syncedDataDirectory);
      }

      let tmpPath = imageFullPath.split('/');
      tmpPath.pop();
      directory = tmpPath.join('/');

      // console.log("=> directory:", directory);
      this.file.resolveDirectoryUrl(directory)
        .then((directoryEntry: DirectoryEntry) => {
          let fileName = this.getFileName(imageFullPath);
          // console.log("fileName:", fileName);
          // console.log("directoryEntry:", directoryEntry);
          return this.file.getFile(directoryEntry, fileName, { create: false });
        }).then((fileEntry: FileEntry) => {
          // console.log("fileEntry:", fileEntry);
          fileEntry.file((fileItm) => {
            // console.log("fileItm:", fileItm);
            observer.next(fileItm);
            observer.complete();
          });
        }).catch((error) => {
          console.error("Error:", error);
        });
    });
    return observable;
  }

  /**
   * @author Bundit.Ng
   * @param pathStr:string=> InputFullpath URI return Name Of Input Fullpath files
   */
  private getFileName(pathStr: string): string {
    if (!StringUtil.isEmptyString(pathStr)) {
      let endIdx = pathStr.split('/');
      let _pathStr = endIdx.pop();
      _pathStr = (_pathStr || "").split('?')[0];
      return _pathStr;
    } else {
      return "";
    }
  }

  public getOrientation = (file, callback) => {
    let reader = new FileReader();
    reader.onload = (e: Event) => {
      let view = new DataView(e.target['result']);
      if (view.getUint16(0, false) != 0xFFD8) return callback(-2);
      let length = view.byteLength,
        offset = 2;
      while (offset < length) {
        let marker = view.getUint16(offset, false);
        offset += 2;
        if (marker == 0xFFE1) {
          if (view.getUint32(offset += 2, false) != 0x45786966) return callback(-1);
          let little = view.getUint16(offset += 6, false) == 0x4949;
          offset += view.getUint32(offset + 4, little);
          let tags = view.getUint16(offset, little);
          offset += 2;
          for (let i = 0; i < tags; i++)
            if (view.getUint16(offset + (i * 12), little) == 0x0112)
              return callback(view.getUint16(offset + (i * 12) + 8, little));
        } else if ((marker & 0xFF00) != 0xFF00) break;
        else offset += view.getUint16(offset, false);
      }
      return callback(-1);
    };
    reader.readAsArrayBuffer(file);
  }

  /**
   * @param fileObject Blob
   * @augments callback (data:DataUri) => void
   */
  public convertFileToDataURi(fileObject: any, callback?: (resp) => void, errorCallback?: (errMsg) => void): void {
    const reader = new FileReader();
    reader.readAsDataURL(fileObject);
    reader.onload = () => callback && callback(reader.result);
    reader.onerror = (error) => errorCallback && errorCallback(error);
  }

  public getFileExtension = (filename) => {
    let ext = /^.+\.([^.]+)$/.exec(filename);
    return ext == null ? "" : ext[1].toLowerCase();
  }

  public dataURItoBlob = (dataURI) => {
    let binary = atob(dataURI.split(',')[1]);
    let array = [];
    for (let i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], { type: 'image/jpeg' });
  }
}
