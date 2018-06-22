# Nurse Mobile Application
**Digital Marketing Platform - Mobile**

Copyright (c) 2017 Avalant Co., Ltd.

***Note**: It easy to read by formatted text on VSCode. You need to install **Markdown Shortcuts** extension.

To install now just CTRL+P and paste this command below.
```
ext install markdown-shortcuts
```

## Dependencies setup

```
npm install -g cordova ionic
npm install
```
~~npm install --dev~~

**NOTE 1:** If you are experiencing in node-gyp problem of something can't build. Try to run this command before try again.
```
npm install -g windows-build-tools@latest
```

**NOTE 2:** For first time you need to make a copy of ENV example files.


**Copy file like this.**

`.env-example --> .env`

`.dev-mobile.env --> .dev-mobile.env`

Make one for production too : `.prod-mobile.env`

**NOTE 3:** For dev environment we will use Ionic server proxy to communicate with Services. By set URIs in '.env' file to http://localhost:8100 (proxy).
You can change proxy target in **ionic.config.json**

## NPM Commands

### Ionic Dev Serv
NOTE: This application will run as development environment by using variables from ".env" file.

```
npm start
```

### Ionic Build & Mobile deploy
For debugging mode
**NOTE:** This application will run as mobile development environment by using variables from ".dev-mobile.env"

```
npm run ionic:android
```
For production mode
**NOTE:** This application will run as mobile production environment by using variables from ".prod-mobile.env"

```
npm run ionic:android:prod
```

## Cordova setup

### Adding platform
#### For Android
```
cordova platform add android
```

Sometime you may experienced in problems, Remove and re-add it maybe can fix it.
```
cordova platform rm android
```
And then re-add your platform.

#### For iOS
```
cordova platform add ios
```

## Facebook SDK setting up
### Android
```
cordova plugin add cordova-plugin-facebook4 --variable APP_ID=1627901700857050 --variable APP_NAME=UEARN-Mobile --save
```

## Google Maps API Keys
iOS : ```AIzaSyB3-gCuYEDPVb-WvRFl-MqyTcdCSuiLDtw```

Android : ```AIzaSyBaXi8KSOrwVqDLOtluiBNcvKUS0yLufbs```

## cordova-plugin-crop (Use external custom plugin)
Use my own plugin we can customizable such as Aspect ratio.

install with this followed commands
```
npm i https://github.com/icharge/cordova-plugin-crop --save 
cordova plugin add https://github.com/icharge/cordova-plugin-crop.git
```
If you already have original plugin then you need to remove it first by
```
npm uninstall https://github.com/icharge/cordova-plugin-crop --save 
cordova plugin rm cordova-plugin-crop
```

## Known issues

### **Ajax requests always 404 (from disk cache)**
This sh*t problem made me a HOT HEAD man.
That's it I found solution for this problem. Take a look on this [link](https://stackoverflow.com/questions/30161952/ionic-angular-how-to-avoid-the-404-not-found-from-cache-after-post-reque)

`I also added **Content-Security-Policy** into index.html file. So you don't need to change it anyway. or you know what are you doing there.`

try this commands from that thread.
```
cordova plugin remove cordova-plugin-whitelist
cordova plugin add cordova-plugin-whitelist
```

### A "Chip is not defined" --- [ชิปหาย]! (Built and Runtime on mobile)
`2017-07-13`

Just use `@ionic/app-scripts` module at version `1.3.0` only!. For future if they fixed this issue you can change it by yourself. But for now don't waste your time like me to test it.

```npm install @ionic/app-scripts@1.3.0 --save-dev```

### Deeplinks issue on build production
Just still use `@angular/**` at version `4.1.3` !





### **Generate HasheKeys and Release HashKeys for android app Facebook**

@since 2017-08-22
@author Bundit.Ng





Download [OpenSSL](https://code.google.com/archive/p/openssl-for-windows/downloads)

จากนั้นสร้าง Folder ไว้ที่ ```C:\OpenSSL\``` แล้ว Extract ไว้ใน ```C:\OpenSSL\...```

ตรวจสอบพาธให้ถูกต้อง จะต้องได้ ```"C:\OpenSSL\bin\openssl.exe"```


**Command For Generate Debug HashKeys** Output is key for **Facebook**

```
keytool -exportcert -alias androiddebugkey -keystore "C:\Users\%username%\.android\debug.keystore" | openssl sha1 -binary | openssl base64
```

<!-- Optional : ```" > facebook-Debug-Hashkey.hashkey" ``` append after command for create as text file -->

Default Password is : **android**

**Command For Generate Release HashKeys** Output is key for **Facebook**

```
keytool -exportcert -alias nurse-app -keystore "D:\CFD\DMPMobile\KeyStore\nurse-release-key.keystore" | openssl sha1 -binary | openssl base64
```

Password is : **P@ssw0rd**

<!-- Optional : ```" > facebook-Release-Hashkey.hashkey" ``` append after command for create as text file -->

![D:\CFD\DMPMobile\readme_hashKey.png](.\ReadMe\readme_hashKey.png)
