import SessionCommand from "../utils/SessionCommand";
declare class TestCommand extends SessionCommand {
  init(): Promise<void>;
  run(): Promise<void>;
}
export default TestCommand;
