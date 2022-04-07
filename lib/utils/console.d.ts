declare const _default: {
    _debug: boolean;
    startDebug: () => void;
    log: (msg: string | Array<string>, ...args: Array<any>) => void;
    error: (msg: string, ...args: Array<any>) => void;
    success: (msg: string, ...args: Array<any>) => void;
    info: (msg: string, ...args: Array<any>) => void;
    help: (msg: string) => void;
    debug(...args: Array<any>): void;
    warning: (msg: string) => void;
};
export default _default;
