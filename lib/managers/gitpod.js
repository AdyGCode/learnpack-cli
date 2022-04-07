"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const console_1 = require("../utils/console");
const shell = require("shelljs");
const socket_1 = require("./socket");
const fs = require("fs");
const Gitpod = {
  socket: null,
  config: null,
  initialized: false,
  hasGPCommand: false,
  init: function (config) {
    if (this.initialized) {
      return;
    }
    this.initialized = true;
    if (config) {
      this.config = config;
    }
    if (shell.exec("gp -h", { silent: true }).code === 0) {
      this.hasGPCommand = true;
      if (config) {
        config.address = shell
          .exec("gp url", { silent: true })
          .stdout.replace(/(\r\n|\n|\r)/gm, "");
      }
    } else {
      console_1.default.debug("Gitpod command line tool not found");
    }
  },
  openFiles: async function (files) {
    var _a;
    console_1.default.debug("Attempting to open files in gitpod mode", files);
    this.init(); // initilize gitpod config
    // gitpod will open files only on isolated mode
    if (
      !this.config ||
      ((_a = this.config.config) === null || _a === void 0
        ? void 0
        : _a.grading) !== "isolated"
    ) {
      console_1.default.debug(
        "Files cannot be automatically opened because we are not on isolated grading (only for isolated)"
      );
      socket_1.default.log("ready", ["Ready to compile or test..."]);
      return true;
    }
    if (this.hasGPCommand)
      for (const f of files.reverse()) {
        if (shell.exec(`gp open ${f}`).code > 0) {
          console_1.default.debug(`Error opening file ${f} on gitpod`);
        }
      }
    socket_1.default.log("ready", ["Ready to compile or test..."]);
  },
  setup(config) {
    this.init(config); // initilize gitpod config
    this.autosave("on");
  },
  autosave: async function (value = "on") {
    this.init(); // initilize gitpod config
    if (this.hasGPCommand) {
      if (!fs.existsSync("./.theia")) fs.mkdirSync("./.theia");
      if (!fs.existsSync("./.theia/settings.json")) {
        fs.writeFileSync(
          "./.theia/settings.json",
          JSON.stringify(
            {
              "editor.autoSave": value,
            },
            null,
            4
          )
        );
      }
    }
  },
};
exports.default = Gitpod;
