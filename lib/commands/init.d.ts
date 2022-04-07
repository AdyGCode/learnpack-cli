import BaseCommand from "../utils/BaseCommand";
declare class InitComand extends BaseCommand {
  static description: string;
  static flags: {
    grading: import("@oclif/parser/lib/flags").IBooleanFlag<void>;
  };
  run(): Promise<void>;
}
export default InitComand;
