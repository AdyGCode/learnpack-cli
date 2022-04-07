"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const enquirer_1 = require("enquirer");
const SessionCommand_1 = require("../utils/SessionCommand");
const console_1 = require("../utils/console");
const api_1 = require("../utils/api");
const validators_1 = require("../utils/validators");
// eslint-disable-next-line
const fetch = require("node-fetch");
class PublishCommand extends SessionCommand_1.default {
  async init() {
    const { flags } = this.parse(PublishCommand);
    await this.initSession(flags, true);
  }
  async run() {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    const { flags, args } = this.parse(PublishCommand);
    // avoid annonymus sessions
    // eslint-disable-next-line
    if (!this.session) return;
    console_1.default.info(
      `Session found for ${this.session.payload.email}, publishing the package...`
    );
    const configObject =
      (_a = this.configManager) === null || _a === void 0 ? void 0 : _a.get();
    if (
      ((_b =
        configObject === null || configObject === void 0
          ? void 0
          : configObject.config) === null || _b === void 0
        ? void 0
        : _b.slug) === undefined ||
      !((_c = configObject.config) === null || _c === void 0 ? void 0 : _c.slug)
    ) {
      throw new Error(
        "The package is missing a slug (unique name identifier), please check your learn.json file and make sure it has a 'slug'"
      );
    }
    if (
      !validators_1.validURL(
        (_e =
          (_d =
            configObject === null || configObject === void 0
              ? void 0
              : configObject.config) === null || _d === void 0
            ? void 0
            : _d.repository) !== null && _e !== void 0
          ? _e
          : ""
      )
    ) {
      throw new Error(
        "The package has a missing or invalid 'repository' on the configuration file, it needs to be a Github URL"
      );
    } else {
      const validateResp = await fetch(
        (_f = configObject.config) === null || _f === void 0
          ? void 0
          : _f.repository,
        {
          method: "HEAD",
        }
      );
      if (!validateResp.ok || validateResp.status !== 200) {
        throw new Error(
          `The specified repository URL on the configuration file does not exist or its private, only public repositories are allowed at the moment: ${
            (_g = configObject.config) === null || _g === void 0
              ? void 0
              : _g.repository
          }`
        );
      }
    }
    // start watching for file changes
    try {
      await api_1.default.publish(
        Object.assign(Object.assign({}, configObject), {
          author: this.session.payload.user_id,
        })
      );
      console_1.default.success(
        `Package updated and published successfully: ${
          (_h = configObject.config) === null || _h === void 0
            ? void 0
            : _h.slug
        }`
      );
    } catch (error) {
      if (error.status === 404) {
        const answer = await enquirer_1.prompt([
          {
            type: "confirm",
            name: "create",
            message: `Package with slug ${
              (_j = configObject.config) === null || _j === void 0
                ? void 0
                : _j.slug
            } does not exist, do you want to create it?`,
          },
        ]);
        if (answer) {
          await api_1.default.update(
            Object.assign(Object.assign({}, configObject), {
              author: this.session.payload.user_id,
            })
          );
          console_1.default.success(
            `Package created and published successfully: ${
              (_k = configObject.config) === null || _k === void 0
                ? void 0
                : _k.slug
            }`
          );
        } else {
          console_1.default.error("No answer from server");
        }
      } else {
        console_1.default.error(error.message);
      }
    }
  }
}
PublishCommand.description = `Describe the command here
  ...
  Extra documentation goes here
  `;
PublishCommand.flags = {
  // name: flags.string({char: 'n', description: 'name to print'}),
};
PublishCommand.args = [
  {
    name: "package",
    required: false,
    description: "The unique string that identifies this package on learnpack",
    hidden: false,
  },
];
exports.default = PublishCommand;
