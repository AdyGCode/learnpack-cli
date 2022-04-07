"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import  {Command, flags} from '@oclif/command'
// import { prompt } from "enquirer"
// import fetch from 'node-fetch'
const SessionCommand_1 = require("../utils/SessionCommand");
const session_1 = require("../managers/session");
// import Console from '../utils/console'
// import { replace } from 'node-emoji'
// import { validURL } from "../utils/validators"
// const BaseCommand from '../utils/BaseCommand');
class LogoutCommand extends SessionCommand_1.default {
  async init() {
    const { flags } = this.parse(LogoutCommand);
    await this.initSession(flags);
  }
  async run() {
    // const {flags, args} = this.parse(LogoutCommand)
    session_1.default.destroy();
  }
}
LogoutCommand.description = `Describe the command here
  ...
  Extra documentation goes here
  `;
LogoutCommand.flags = {
  // name: flags.string({char: 'n', description: 'name to print'}),
};
LogoutCommand.args = [
  {
    name: "package",
    required: false,
    description: "The unique string that identifies this package on learnpack",
    hidden: false,
  },
];
exports.default = LogoutCommand;
