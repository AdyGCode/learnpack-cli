import SessionCommand from "../utils/SessionCommand";
declare class LoginCommand extends SessionCommand {
  static description: string;
  static flags: any;
  static args: {
    name: string;
    required: boolean;
    description: string;
    hidden: boolean;
  }[];
  init(): Promise<void>;
  run(): Promise<void>;
}
export default LoginCommand;
