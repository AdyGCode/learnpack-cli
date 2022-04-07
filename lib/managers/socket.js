"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
const console_1 = require("../utils/console");
const fileQueue_1 = require("../utils/fileQueue");
const SocketManager = {
  socket: null,
  config: null,
  allowedActions: [],
  possibleActions: ["build", "reset", "test", "tutorial"],
  isTestingEnvironment: false,
  actionCallBacks: {
    clean: (_, s) => {
      s.logs = [];
    },
  },
  addAllowed: function (actions) {
    var _a, _b;
    if (!Array.isArray(actions)) actions = [actions];
    // avoid adding the "test" action if grading is disabled
    if (
      actions.includes("test") &&
      ((_b =
        (_a = this.config) === null || _a === void 0
          ? void 0
          : _a.disabledActions) === null || _b === void 0
        ? void 0
        : _b.includes("test"))
    ) {
      actions = actions.filter((a) => a !== "test");
    }
    this.allowedActions = [
      ...(this.allowedActions || []).filter((a) => !actions.includes(a)),
      ...actions,
    ];
  },
  removeAllowed: function (actions) {
    if (!Array.isArray(actions)) {
      actions = [actions];
    }
    this.allowedActions = (this.allowedActions || []).filter(
      (a) => !actions.includes(a)
    );
  },
  start: function (config, server, isTestingEnvironment = false) {
    var _a, _b, _c, _d;
    this.config = config;
    this.isTestingEnvironment = isTestingEnvironment;
    this.socket = new socket_io_1.Server(server, { allowEIO3: true });
    this.allowedActions =
      ((_b =
        (_a = this.config) === null || _a === void 0
          ? void 0
          : _a.disabledActions) === null || _b === void 0
        ? void 0
        : _b.includes("test")) ||
      ((_c = this.config) === null || _c === void 0
        ? void 0
        : _c.disableGrading)
        ? this.possibleActions.filter((a) => {
            var _a, _b;
            return (
              !((_b =
                (_a = this.config) === null || _a === void 0
                  ? void 0
                  : _a.disabledActions) === null || _b === void 0
                ? void 0
                : _b.includes(a)) && a !== "test"
            );
          })
        : this.possibleActions.filter((a) => {
            var _a;
            return !((_a = this.allowedActions) === null || _a === void 0
              ? void 0
              : _a.includes(a));
          });
    if (
      ((_d = this.config) === null || _d === void 0 ? void 0 : _d.grading) ===
      "incremental"
    ) {
      this.removeAllowed("reset");
    }
    if (this.socket) {
      this.socket.on("connection", (socket) => {
        console_1.default.debug(
          "Connection with client successfully established",
          this.allowedActions
        );
        if (!this.isTestingEnvironment) {
          this.log("ready", ["Ready to compile or test..."]);
        }
        socket.on("compiler", ({ action, data }) => {
          this.emit("clean", "pending", ["Working..."]);
          if (typeof data.exerciseSlug === "undefined") {
            this.log("internal-error", ["No exercise slug specified"]);
            console_1.default.error("No exercise slug especified");
            return;
          }
          if (
            this.actionCallBacks &&
            typeof this.actionCallBacks[action] === "function"
          ) {
            this.actionCallBacks[action](data);
          } else {
            this.log("internal-error", ["Uknown action " + action]);
          }
        });
      });
    }
  },
  on: function (action, callBack) {
    if (this.actionCallBacks) {
      this.actionCallBacks[action] = callBack;
    }
  },
  clean: function (_ = "pending", logs = []) {
    this.emit("clean", "pending", logs);
  },
  ask: function (questions = []) {
    return new Promise((resolve, _) => {
      this.emit("ask", "pending", ["Waiting for input..."], questions);
      this.on("input", ({ inputs }) => {
        // Workaround to fix issue because null inputs
        let isNull = false;
        // eslint-disable-next-line
        inputs.forEach((input) => {
          if (input === null) {
            isNull = true;
          }
        });
        if (!isNull) {
          resolve(inputs);
        }
      });
    });
  },
  reload: function (files = null, exercises = null) {
    this.emit(
      "reload",
      (files === null || files === void 0 ? void 0 : files.join("")) ||
        "" /* TODO: Check it out this */,
      exercises
    );
  },
  openWindow: function (url = "") {
    fileQueue_1.default
      .dispatcher()
      .enqueue(fileQueue_1.default.events.OPEN_WINDOW, url);
    this.emit(
      fileQueue_1.default.events.OPEN_WINDOW,
      "ready",
      [`Opening ${url}`],
      [],
      [],
      url
    );
  },
  log: function (status, messages = [], report = [], data = null) {
    this.emit("log", status, messages, [], report, data);
    console_1.default.log(messages);
  },
  emit: function (
    action,
    status = "ready",
    logs = [],
    inputs = [],
    report = [],
    data = null
  ) {
    var _a, _b, _c, _d, _e, _f;
    if (
      ((_a = this.config) === null || _a === void 0 ? void 0 : _a.compiler) &&
      ["webpack", "vanillajs", "vue", "react", "css", "html"].includes(
        (_b = this.config) === null || _b === void 0 ? void 0 : _b.compiler
      )
    ) {
      if (["compiler-success", "compiler-warning"].includes(status))
        this.addAllowed("preview");
      if (["compiler-error"].includes(status) || action === "ready")
        this.removeAllowed("preview");
    }
    if (
      ((_c = this.config) === null || _c === void 0 ? void 0 : _c.grading) ===
      "incremental"
    ) {
      this.removeAllowed("reset");
    }
    // eslint-disable-next-line
    (_e =
      (_d = this.config) === null || _d === void 0
        ? void 0
        : _d.disabledActions) === null || _e === void 0
      ? void 0
      : _e.forEach((a) => this.removeAllowed(a));
    (_f = this.socket) === null || _f === void 0
      ? void 0
      : _f.emit("compiler", {
          action,
          status,
          logs,
          allowed: this.allowedActions,
          inputs,
          report,
          data,
        });
  },
  ready: function (message) {
    this.log("ready", [message]);
  },
  success: function (type, stdout) {
    const types = ["compiler", "testing"];
    if (!types.includes(type))
      this.fatal(`Invalid socket success type "${type}" on socket`);
    else if (stdout === "")
      this.log(type + "-success", ["No stdout to display on the console"]);
    else this.log(type + "-success", [stdout]);
  },
  error: function (type, stdout) {
    console.error("Socket error: " + type, stdout);
    this.log(type, [stdout]);
    if (this.isTestingEnvironment) {
      this.onTestingFinished({
        result: "failed",
      });
    }
  },
  fatal: function (msg) {
    this.log("internal-error", [msg]);
    throw msg;
  },
  onTestingFinished: function (result) {
    var _a;
    if (
      (_a = this.config) === null || _a === void 0
        ? void 0
        : _a.testingFinishedCallback
    ) {
      this.config.testingFinishedCallback(result);
    }
  },
};
exports.default = SocketManager;
