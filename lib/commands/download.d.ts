import { Command } from "@oclif/command";
declare class DownloadCommand extends Command {
  static description: string;
  static flags: any;
  static args: {
    name: string;
    required: boolean;
    description: string;
    hidden: boolean;
  }[];
  run(): Promise<null | undefined>;
}
export default DownloadCommand;
