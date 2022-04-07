"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import {flags} from '@oclif/command'
const console_1 = require("../utils/console");
const SessionCommand_1 = require("../utils/SessionCommand");
class CleanCommand extends SessionCommand_1.default {
  async init() {
    const { flags } = this.parse(CleanCommand);
    await this.initSession(flags);
  }
  async run() {
    var _a;
    const { flags } = this.parse(CleanCommand);
    (_a = this.configManager) === null || _a === void 0 ? void 0 : _a.clean();
    console_1.default.success("Package cleaned successfully, ready to publish");
  }
}
CleanCommand.description = `Clean the configuration object
  ...
  Extra documentation goes here
  `;
CleanCommand.flags = {
  // name: flags.string({char: 'n', description: 'name to print'}),
};
exports.default = CleanCommand;
