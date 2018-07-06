* required
- node js
- window build tools
- android sdk tools

extract files and open cmd in directory then

1. execute command "npm i" to install associate node_modules

2. execute command "cordova platform add android@6.2.3" on windows,
	(only on macOs) execute command "cordova platform add ios@4.5.4" on macOs
	
3. execute command "npm run ibuild-prod-u" to build source code ,wait untill get message "uglifyjs finished" then press Ctrl+c to exit command if need

4. execute command "npm run android:build:prod" for get Android APK (debug-apk),
   (only on macOs) execute command "npm run android:build:ios" for get ios ipa,
