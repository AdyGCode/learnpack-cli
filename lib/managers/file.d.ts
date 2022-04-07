export declare const decompress: (
  sourcePath: string,
  destinationPath: string
) => Promise<unknown>;
export declare const downloadEditor: (
  version: string | undefined,
  destination: string
) => Promise<unknown>;
export declare const download: (url: string, dest: string) => Promise<unknown>;
export declare const clone: (
  repository?: string,
  folder?: string
) => Promise<unknown>;
export declare const rmSync: (path: string) => void;
declare const _default: {
  download: (url: string, dest: string) => Promise<unknown>;
  decompress: (sourcePath: string, destinationPath: string) => Promise<unknown>;
  downloadEditor: (
    version: string | undefined,
    destination: string
  ) => Promise<unknown>;
  clone: (repository?: string, folder?: string) => Promise<unknown>;
  rmSync: (path: string) => void;
};
export default _default;
