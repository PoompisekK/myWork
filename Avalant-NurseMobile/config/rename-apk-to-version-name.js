/**
 * @author Bundit.Ng
 * @since  Wed Mar 21 2018
 * Copyright (c) 2018 Avalant Co.,Ltd.
 */

const childProcess = require('child_process');
const folderName = "versions";
let filesName = "";
try {
    filesName = childProcess.execSync(" dir /b /a-d \".\\" + folderName + "\\*.version ");
} catch (error) {}

console.log("version name :" + filesName);
let appName = "nurse-app-";

let filesNameDebug = appName + (filesName.toString()).replace(".version", "-debug.apk");
let filesNameRelease = appName + (filesName.toString()).replace(".version", "-release.apk");

const path = ".\\platforms\\android\\build\\outputs\\apk\\";
try {
    childProcess.execSync(" copy " + path + "android-debug.apk  " + path + filesNameDebug);
    console.log("to file Name :" + filesNameDebug);
} catch (error) {}
try {
    childProcess.execSync(" copy " + path + "android-release.apk  " + path + filesNameRelease);
    console.log("to file Name :" + filesNameRelease);
} catch (error) {}