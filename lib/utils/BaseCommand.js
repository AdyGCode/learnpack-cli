"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = require("@oclif/command");
const console_1 = require("./console");
const readline_1 = require("readline");
// import SessionManager from '../managers/session'
class BaseCommand extends command_1.Command {
  async catch(err) {
    console_1.default.debug("COMMAND CATCH", err);
    throw err;
  }
  async init() {
    const { flags, args } = this.parse(BaseCommand);
    console_1.default.debug("COMMAND INIT");
    console_1.default.debug("These are your flags: ", flags);
    console_1.default.debug("These are your args: ", args);
    // quick fix for listening to the process termination on windows
    if (process.platform === "win32") {
      const rl = readline_1.createInterface({
        input: process.stdin,
        output: process.stdout,
      });
      rl.on("SIGINT", function () {
        // process.emit('SIGINT')
        // process.emit('SIGINT')
      });
    }
    process.on("SIGINT", function () {
      console_1.default.debug("Terminated (SIGINT)");
      process.exit();
    });
  }
  async finally() {
    console_1.default.debug("COMMAND FINALLY");
    // called after run and catch regardless of whether or not the command errored
  }
  async run() {
    // console.log('running my command')
  }
}
exports.default = BaseCommand;
