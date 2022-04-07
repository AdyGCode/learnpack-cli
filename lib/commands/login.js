"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SessionCommand_1 = require("../utils/SessionCommand");
const session_1 = require("../managers/session");
const console_1 = require("../utils/console");
class LoginCommand extends SessionCommand_1.default {
  async init() {
    const { flags } = this.parse(LoginCommand);
    await this.initSession(flags);
  }
  async run() {
    /* const {flags, args} = */ this.parse(LoginCommand);
    try {
      await session_1.default.login();
    } catch (error) {
      console_1.default.error("Error trying to authenticate");
      console_1.default.error(error.message || error);
    }
  }
}
LoginCommand.description = `Describe the command here
  ...
  Extra documentation goes here
  `;
LoginCommand.flags = {
  // name: flags.string({char: 'n', description: 'name to print'}),
};
LoginCommand.args = [
  {
    name: "package",
    required: false,
    description: "The unique string that identifies this package on learnpack",
    hidden: false,
  },
];
exports.default = LoginCommand;
