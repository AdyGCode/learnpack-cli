export declare type TAction =
  | "test"
  | "log"
  | "reload"
  | "ready"
  | "clean"
  | "ask";
export declare type ICallback = (...agrs: any[]) => any;
