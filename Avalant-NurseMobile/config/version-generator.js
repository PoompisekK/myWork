/****
 * Version No. Generator
 * 
 * @author NorrapatN
 * @since Thu Aug 03 2017
 * @contribute Bundit.Ng
 * @since  Tue Apr 17 2018
 * Copyright (c) 2018 Avalant Co.,Ltd.
 **/

const childProcess = require('child_process');
let git = "";

try {
    git = childProcess.execSync('git rev-parse --short HEAD');
    git = git.toString().trim()
} catch (error) {
    // console.warn("Error :", error);
}

const now = new Date();

function zeroPad(num) {
    return ('0' + num).substr(-2);
}


// Version config
const major = '0';
const minor = '1';
const build = now.getFullYear() + zeroPad(now.getMonth() + 1) + zeroPad(now.getDate()) +
    '.' + zeroPad(now.getHours()) + zeroPad(now.getMinutes());

const versionNo = [major, minor, build].join('.');

const versionDirName = "versions";

try { childProcess.execSync(" IF NOT EXISt \".\\"+versionDirName+"\" mkdir \".\\"+versionDirName+"\" "); } catch (error) { }
try { childProcess.execSync(" del .\\"+versionDirName+"\\*.version /q /s  "); } catch (error) { }
try { childProcess.execSync(" echo  . > ./"+versionDirName+"/"+build+".version"); } catch (error) { }

const version = versionNo + ' - git~' + git;

console.log();
console.log('\x1b[1m -- Version of this build is \x1b[32m' + versionNo + '\x1b[0m : \x1b[36mgit~' + git + '\x1b[0m -- ');
console.log();

module.exports = (function () {
    return `'${version}'`;
})();