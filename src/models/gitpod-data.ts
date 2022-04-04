import {Server} from 'socket.io'
import {IConfigObj} from './config'

export type TFile = string;

export interface IGitpodData {
  files: Array<TFile>;
}

export interface IGitpod {
  socket: Server | null;
  config: IConfigObj | null;
  initialized: boolean;
  hasGPCommand: boolean;
  init: (config?: IConfigObj) => void;
  openFiles: (files: Array<TFile>) => Promise<boolean | undefined>;
  setup: (config?: IConfigObj) => void;
  autosave: (value: string) => void;
}
