"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const console_1 = require("../utils/console");
const fs = require("fs");
// import em from "events"
const XXH = require("xxhashjs");
// possible events to dispatch
const events = {
  START_EXERCISE: "start_exercise",
  INIT: "initializing",
  RUNNING: "configuration_loaded",
  END: "connection_ended",
  RESET_EXERCISE: "reset_exercise",
  OPEN_FILES: "open_files",
  OPEN_WINDOW: "open_window",
  INSTRUCTIONS_CLOSED: "instructions_closed",
};
let options = {
  path: null,
  create: false,
};
let lastHash = null;
let watcher = null; // subscribe to file and listen to changes
let actions = null; // action queue
const loadDispatcher = (opts) => {
  actions = [{ name: "initializing", time: now() }];
  console_1.default.debug(`Loading from ${opts.path}`);
  let exists = fs.existsSync(opts.path);
  if (opts.create) {
    if (exists) actions.push({ name: "reset", time: now() });
    fs.writeFileSync(opts.path, JSON.stringify(actions), { flag: "w" });
    exists = true;
  }
  if (!exists)
    throw new Error(`Invalid queue path, missing file at: ${opts.path}`);
  let incomingActions = [];
  try {
    const content = fs.readFileSync(opts.path, "utf-8");
    incomingActions = JSON.parse(content);
    if (!Array.isArray(incomingActions)) incomingActions = [];
  } catch (_a) {
    incomingActions = [];
    console_1.default.debug("Error loading VSCode Actions file");
  }
  console_1.default.debug("Actions load ", incomingActions);
  return incomingActions;
};
// eslint-disable-next-line
const enqueue = (name, data = undefined) => {
  if (!Object.values(events).includes(name)) {
    console_1.default.debug(`Invalid event ${name}`);
    throw new Error(`Invalid action ${name}`);
  }
  if (!actions) actions = [];
  actions.push({ name, time: now(), data: data });
  console_1.default.debug(
    `EMIT -> ${name}:Exporting changes to ${options.path}`
  );
  return fs.writeFileSync(options.path || "", JSON.stringify(actions));
};
const now = () => {
  const hrTime = process.hrtime();
  // eslint-disable-next-line
  const htTime0 = hrTime[0] * 1000000;
  return (htTime0 + hrTime[1]) / 1000;
};
const loadFile = (filePath) => {
  if (!fs.existsSync(filePath))
    throw new Error(`No queue.json file to load on ${filePath}`);
  const content = fs.readFileSync(filePath, "utf8");
  const newHash = XXH.h32(content, 43981).toString(16);
  const isUpdated = lastHash !== newHash;
  lastHash = newHash;
  const incomingActions = JSON.parse(content);
  return { isUpdated, incomingActions };
};
const dequeue = () => {
  // first time dequeue loads
  if (!actions) actions = [];
  const { isUpdated, incomingActions } = loadFile(options.path || "");
  if (!isUpdated) {
    /**
     * make sure no tasks are executed from the queue by matching both
     * queues (the incoming with current one)
     */
    actions = incomingActions;
    console_1.default.debug(
      `No new actions to process: ${actions.length}/${incomingActions.length}`
    );
    return null;
  }
  // do i need to reset actions to zero?
  if (actions.length > 0 && actions[0].time !== incomingActions[0].time) {
    actions = [];
  }
  const action = incomingActions[incomingActions.length - 1];
  console_1.default.debug("Dequeing action ", action);
  actions.push(action);
  return action;
};
const pull = (callback) => {
  console_1.default.debug("Pulling actions");
  let incoming = dequeue();
  while (incoming) {
    callback(incoming);
    incoming = dequeue();
  }
};
const reset = (callback) => {
  console_1.default.debug("Queue reseted");
  actions = [];
  if (fs.existsSync(options.path || "")) {
    fs.writeFileSync(options.path || "", "[]");
    callback();
  }
};
const onPull = (callback) => {
  // eslint-disable-next-line
  const chokidar = require("chokidar");
  console_1.default.debug("Starting to listen...");
  try {
    loadFile(options.path || "");
  } catch (_a) {
    console_1.default.debug(
      "No previeues queue file, waiting for it to be created..."
    );
  }
  if (!watcher) {
    console_1.default.debug(`Watching ${options.path}`);
    watcher = chokidar.watch(`${options.path}`, {
      persistent: true,
    });
  } else console_1.default.debug("Already watching queue path");
  watcher.on("add", () => pull(callback)).on("change", () => pull(callback));
  return true;
};
const onReset = (callback) => {
  // eslint-disable-next-line
  const chokidar = require("chokidar");
  if (!watcher) {
    console_1.default.debug(`Watching ${options.path}`);
    watcher = chokidar.watch(`${options.path}`, {
      persistent: true,
    });
  }
  watcher.on("unlink", () => reset(callback));
  return true;
};
exports.default = {
  events,
  dispatcher: (opts = {}) => {
    if (!actions) {
      options = Object.assign(Object.assign({}, options), opts);
      console_1.default.debug("Initializing queue dispatcher", options);
      actions = loadDispatcher(options);
    }
    return { enqueue, events };
  },
  listener: (opts = {}) => {
    if (!actions) {
      options = Object.assign(Object.assign({}, options), opts);
      console_1.default.debug("Initializing queue listener", options);
    }
    return { onPull, onReset, events };
  },
};
