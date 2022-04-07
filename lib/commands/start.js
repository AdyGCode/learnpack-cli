"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import path from "path";
const command_1 = require("@oclif/command");
const SessionCommand_1 = require("../utils/SessionCommand");
const console_1 = require("../utils/console");
const socket_1 = require("../managers/socket");
const fileQueue_1 = require("../utils/fileQueue");
const file_1 = require("../managers/file");
const misc_1 = require("../utils/misc");
const server_1 = require("../managers/server");
class StartCommand extends SessionCommand_1.default {
  // 🛑 IMPORTANT
  // Every command that will use the configManager needs this init method
  async init() {
    const { flags } = this.parse(StartCommand);
    await this.initSession(flags);
  }
  async run() {
    var _a, _b, _c;
    // get configuration object
    const configObject =
      (_a = this.configManager) === null || _a === void 0 ? void 0 : _a.get();
    const config =
      configObject === null || configObject === void 0
        ? void 0
        : configObject.config;
    if (configObject) {
      const { config } = configObject;
      // build exerises
      (_b = this.configManager) === null || _b === void 0
        ? void 0
        : _b.buildIndex();
      console_1.default.debug(
        `Grading: ${
          config === null || config === void 0 ? void 0 : config.grading
        } ${
          (
            (_c =
              config === null || config === void 0
                ? void 0
                : config.disabledActions) === null || _c === void 0
              ? void 0
              : _c.includes("test")
          )
            ? "(disabled)"
            : ""
        }, editor: ${
          config === null || config === void 0 ? void 0 : config.editor.mode
        } ${
          config === null || config === void 0 ? void 0 : config.editor.version
        }, for ${
          Array.isArray(
            configObject === null || configObject === void 0
              ? void 0
              : configObject.exercises
          )
            ? configObject === null || configObject === void 0
              ? void 0
              : configObject.exercises.length
            : 0
        } exercises found`
      );
      // download app and decompress
      await file_1.downloadEditor(
        config === null || config === void 0 ? void 0 : config.editor.version,
        `${
          config === null || config === void 0 ? void 0 : config.dirPath
        }/app.tar.gz`
      );
      console_1.default.info(
        "Decompressing LearnPack UI, this may take a minute..."
      );
      await file_1.decompress(
        `${
          config === null || config === void 0 ? void 0 : config.dirPath
        }/app.tar.gz`,
        `${
          config === null || config === void 0 ? void 0 : config.dirPath
        }/_app/`
      );
      // listen to socket commands
      if (config && this.configManager) {
        const server = await server_1.default(configObject, this.configManager);
        const dispatcher = fileQueue_1.default.dispatcher({
          create: true,
          path: `${config.dirPath}/vscode_queue.json`,
        });
        socket_1.default.start(config, server, false);
        socket_1.default.on("open", (data) => {
          console_1.default.debug("Opening these files: ", data);
          const files = misc_1.prioritizeHTMLFile(data.files);
          dispatcher.enqueue(dispatcher.events.OPEN_FILES, files);
          socket_1.default.ready("Ready to compile...");
        });
        socket_1.default.on("open_window", (data) => {
          console_1.default.debug("Opening window: ", data);
          dispatcher.enqueue(dispatcher.events.OPEN_WINDOW, data);
          socket_1.default.ready("Ready to compile...");
        });
        socket_1.default.on("reset", (exercise) => {
          var _a;
          try {
            (_a = this.configManager) === null || _a === void 0
              ? void 0
              : _a.reset(exercise.exerciseSlug);
            dispatcher.enqueue(
              dispatcher.events.RESET_EXERCISE,
              exercise.exerciseSlug
            );
            socket_1.default.ready("Ready to compile...");
          } catch (error) {
            socket_1.default.error(
              "compiler-error",
              error.message || "There was an error reseting the exercise"
            );
            setTimeout(
              () => socket_1.default.ready("Ready to compile..."),
              2000
            );
          }
        });
        // socket.on("preview", (data) => {
        //   Console.debug("Preview triggered, removing the 'preview' action ")
        //   socket.removeAllowed("preview")
        //   socket.log('ready',['Ready to compile...'])
        // })
        socket_1.default.on("build", async (data) => {
          var _a;
          const exercise =
            (_a = this.configManager) === null || _a === void 0
              ? void 0
              : _a.getExercise(data.exerciseSlug);
          if (
            !(exercise === null || exercise === void 0
              ? void 0
              : exercise.language)
          ) {
            socket_1.default.error(
              "compiler-error",
              "Impossible to detect language to build for " +
                data.exerciseSlug +
                "..."
            );
            return;
          }
          socket_1.default.log(
            "compiling",
            "Building exercise " +
              data.exerciseSlug +
              " with " +
              exercise.language +
              "..."
          );
          await this.config.runHook("action", {
            action: "compile",
            socket: socket_1.default,
            configuration: config,
            exercise,
          });
        });
        socket_1.default.on("test", async (data) => {
          var _a, _b;
          const exercise =
            (_a = this.configManager) === null || _a === void 0
              ? void 0
              : _a.getExercise(data.exerciseSlug);
          if (
            !(exercise === null || exercise === void 0
              ? void 0
              : exercise.language)
          ) {
            socket_1.default.error(
              "compiler-error",
              "Impossible to detect engine language for testing for " +
                data.exerciseSlug +
                "..."
            );
            return;
          }
          if (
            (config === null || config === void 0
              ? void 0
              : config.disabledActions.includes("test")) ||
            (config === null || config === void 0
              ? void 0
              : config.disableGrading)
          ) {
            socket_1.default.ready("Grading is disabled on configuration");
            return true;
          }
          socket_1.default.log(
            "testing",
            "Testing your exercise using the " + exercise.language + " engine."
          );
          await this.config.runHook("action", {
            action: "test",
            socket: socket_1.default,
            configuration: config,
            exercise,
          });
          (_b = this.configManager) === null || _b === void 0
            ? void 0
            : _b.save();
          return true;
        });
        const terminate = () => {
          console_1.default.debug("Terminating Learnpack...");
          server.terminate(() => {
            var _a;
            (_a = this.configManager) === null || _a === void 0
              ? void 0
              : _a.noCurrentExercise();
            dispatcher.enqueue(dispatcher.events.END);
            process.exit();
          });
        };
        server.on("close", terminate);
        process.on("SIGINT", terminate);
        process.on("SIGTERM", terminate);
        process.on("SIGHUP", terminate);
        // finish the server startup
        setTimeout(() => dispatcher.enqueue(dispatcher.events.RUNNING), 1000);
        // start watching for file changes
        // eslint-disable-next-line
        if (StartCommand.flags.watch)
          this.configManager.watchIndex((_exercises) =>
            socket_1.default.reload(null, _exercises)
          );
      }
    }
  }
}
exports.default = StartCommand;
StartCommand.description =
  "Runs a small server with all the exercise instructions";
StartCommand.flags = Object.assign(
  Object.assign({}, SessionCommand_1.default.flags),
  {
    port: command_1.flags.string({ char: "p", description: "server port" }),
    host: command_1.flags.string({ char: "h", description: "server host" }),
    disableGrading: command_1.flags.boolean({
      char: "D",
      description: "disble grading functionality",
      default: false,
    }),
    // disableGrading: flags.boolean({char: 'dg', description: 'disble grading functionality', default: false }),
    watch: command_1.flags.boolean({
      char: "w",
      description: "Watch for file changes",
      default: false,
    }),
    editor: command_1.flags.string({
      char: "e",
      description: "[standalone, gitpod]",
      options: ["standalone", "gitpod"],
    }),
    version: command_1.flags.string({
      char: "v",
      description: "E.g: 1.0.1",
      default: undefined,
    }),
    grading: command_1.flags.string({
      char: "g",
      description: "[isolated, incremental]",
      options: ["isolated", "incremental"],
    }),
    debug: command_1.flags.boolean({
      char: "d",
      description: "debugger mode for more verbage",
      default: false,
    }),
  }
);
