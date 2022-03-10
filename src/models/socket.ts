import { IConfig } from "./config";
import { Server } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { TAction, ICallback } from "./action";
import { TStatus } from "./status";

export interface ISocket {
  socket: any;
  config: IConfig | null;
  allowedActions: Array<TAction> | null;
  actionCallBacks: { [key: string]: ICallback };
  isTestingEnvironment: boolean;
  addAllowed: (actions: any) => void;
  removeAllowed: (actions: any) => void;
  start: (config: IConfig, server: any, isTestingEnvironment: boolean) => void;
  on: (action: any, callBack: any) => void;
  clean: (_: string, logs: Array<any>) => void;
  ask: (questions: Array<string>) => void;
  reload: (files: Array<string> | null, exercises: Array<string>) => void;
  openWindow: (id: string) => void;
  log: (
    status: TStatus,
    messages?: string | Array<string>,
    report?: Array<string>,
    data?: any
  ) => void;
  emit: (
    action: TAction,
    status: TStatus | string,
    logs: string | Array<string>,
    inputs?: Array<string>,
    report?: Array<string>,
    data?: any
  ) => void;
  ready: (message: string) => void;
  error: (type: any, stdout: string) => void;
  fatal: (msg: string) => void;
  success: (type: any, stdout: string) => void;
  onTestingFinished: (obj: any) => void;
}
