import BaseCommand from "./BaseCommand";
import { IConfigManager } from "../models/config-manager";
export default class SessionCommand extends BaseCommand {
  session: any;
  configManager: IConfigManager | null;
  static flags: any;
  initSession(flags: any, _private?: boolean): Promise<void>;
  buildConfig(flags: any): Promise<void>;
  catch(err: any): Promise<void>;
}
