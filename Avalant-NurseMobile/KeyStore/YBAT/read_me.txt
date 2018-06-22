Key password P@ssw0rd

keytool -genkey -v -keystore SpeeDi.keystore -alias SpeeDi -keyalg RSA -keysize 2048 -validity 10000

keytool -list -v -keystore SpeeDi.keystore

P@ssw0rd

-----------------------------------------------------------------------------

- การบิวด์ครั้งต่อไปให้ใช้ไฟล์ release-signing.properties นำไปวางที่  <Project-path>\platforms\android\
- เปิดไฟล์ release-signing.properties ขึ้นมา ตรวจสอบว่า PATH storeFile: ชี้ไปที่   *.keystore ที่ถูกต้อง
- จากนั้น  สั่ง cordova build android --release 


จะได APK ที่สามารถ Upload ขึ้น PlayStore ได้ทันที




jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore D:\CFD\DMPMobile\KeyStore\ybat-release-key.keystore D:\CFD\DMPMobile\platforms\android\build\outputs\apk\android-release-unsigned.apk ybat-app