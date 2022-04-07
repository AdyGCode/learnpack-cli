declare const _default: {
  CompilationError: {
    CompilationError: (messages: string) => import("../models/errors").IError;
    default: ({ action, ...rest }: any) => Promise<any>;
  };
  TestingError: {
    TestingError: (messages: string) => import("../models/errors").IError;
    default: (args: any) => Promise<any>;
  };
  Utils: {
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
  plugin: (
    pluginConfig: import("../models/plugin-config").IPluginConfig
  ) => (args: any) => Promise<any>;
};
export default _default;
