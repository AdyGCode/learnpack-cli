declare const _default: {
    getMatches: (reg: RegExp, content: string) => (string | null)[];
    cleanStdout: (buffer: string, inputs: string[]) => string;
    indent: (string: string, options: any, count?: number) => string;
    Console: {
        _debug: boolean;
        startDebug: () => void;
        log: (msg: string, ...args: any[]) => void;
        error: (msg: string, ...args: any[]) => void;
        success: (msg: string, ...args: any[]) => void;
        info: (msg: string, ...args: any[]) => void;
        help: (msg: string) => void;
        debug(...args: any[]): void;
    };
};
export default _default;
