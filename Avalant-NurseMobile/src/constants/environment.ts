export const IONIC_ENV = ENV.IONIC_ENV;

export function isDev() {
    return IONIC_ENV == 'dev' || (<string>IONIC_ENV).startsWith('dev');
}

export function isEmptyObject(object: any): boolean {
    return !object || object === null || object === undefined;
}

export function toRaw(object: any) {
    return JSON.parse(JSON.stringify(object));
}

export function isWebDev() {
    return IONIC_ENV == 'dev';
}

export function isChromeDev() {
    return document.URL.startsWith('http') || document.URL.startsWith('https');
}

export function stringify(instr: any, lvl?: number) {
    return JSON.stringify(instr, null, lvl || 2);
}

export class AppLog {
    public static info(...args: any[]) {
        let nextArgs: any = (args || []);
        let firstArg = nextArgs.shift();
        console.info(firstArg.toString(), stringify(nextArgs));
    }
    public static log(...args: any[]) {
        let nextArgs: any = (args || []);
        let firstArg = nextArgs.shift();
        console.log(firstArg.toString(), stringify(nextArgs));
    }
}
