import SessionCommand from "../utils/SessionCommand";
declare class CleanCommand extends SessionCommand {
  static description: string;
  static flags: any;
  init(): Promise<void>;
  run(): Promise<void>;
}
export default CleanCommand;
