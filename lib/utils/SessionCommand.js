"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import { flags } from "@oclif/command";
const BaseCommand_1 = require("./BaseCommand");
const console_1 = require("./console");
const session_1 = require("../managers/session");
const index_1 = require("../managers/config/index");
const errors_1 = require("./errors");
class SessionCommand extends BaseCommand_1.default {
  constructor() {
    super(...arguments);
    this.session = null;
    this.configManager = null;
  }
  async initSession(flags, _private = false) {
    var _a;
    try {
      if (!this.configManager) {
        await this.buildConfig(flags);
      }
      this.session = await session_1.default.get(
        (_a = this.configManager) === null || _a === void 0 ? void 0 : _a.get()
      );
      if (this.session) {
        console_1.default.debug(
          `Session open for ${this.session.payload.email}.`
        );
      } else {
        if (_private)
          throw errors_1.AuthError(
            "You need to log in, run the following command to continue: $ learnpack login"
          );
        console_1.default.debug("No active session available", _private);
      }
    } catch (error) {
      console_1.default.error(error.message);
    }
  }
  async buildConfig(flags) {
    this.configManager = await index_1.default(flags);
  }
  async catch(err) {
    console_1.default.debug("COMMAND CATCH", err);
    throw err;
  }
}
exports.default = SessionCommand;
// SessionCommand.description = `Describe the command here
// ...
// Extra documentation goes here
// `
