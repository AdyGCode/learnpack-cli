import SessionCommand from "../utils/SessionCommand";
export default class StartCommand extends SessionCommand {
  static description: string;
  static flags: any;
  init(): Promise<void>;
  run(): Promise<void>;
}
