import SessionCommand from "../utils/SessionCommand";
declare class AuditCommand extends SessionCommand {
  init(): Promise<void>;
  run(): Promise<void>;
}
export default AuditCommand;
