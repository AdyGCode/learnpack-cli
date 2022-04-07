import { Command } from "@oclif/command";
declare class BaseCommand extends Command {
  catch(err: any): Promise<void>;
  init(): Promise<void>;
  finally(): Promise<void>;
  run(): Promise<void>;
}
export default BaseCommand;
