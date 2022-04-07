"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const console_1 = require("../../utils/console");
const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const socket_1 = require("../socket");
const fileQueue_1 = require("../../utils/fileQueue");
// import gitpod from '../gitpod'
const exercise_1 = require("../config/exercise");
const withHandler = (func) => (req, res) => {
  try {
    func(req, res);
  } catch (error) {
    console_1.default.debug(error);
    const _err = {
      message: error.message || "There has been an error",
      status: error.status || 500,
      type: error.type || null,
    };
    console_1.default.error(_err.message);
    // send rep to the server
    res.status(_err.status);
    res.json(_err);
  }
};
async function default_1(app, configObject, configManager) {
  const { config, exercises } = configObject;
  const dispatcher = fileQueue_1.default.dispatcher({
    create: true,
    path: `${
      config === null || config === void 0 ? void 0 : config.dirPath
    }/vscode_queue.json`,
  });
  app.get(
    "/config",
    withHandler((_, res) => {
      res.json(configObject);
    })
  );
  /**
       * TODO: replicate a socket action, the request payload must be passed to the socket as well
    
     const jsonBodyParser = bodyParser.json()
     
     type ISocketActions = "addAllowed" | "removeAllowed" | "start" | "on" | "clean" | "ask" | "reload" | "openWindow" | "log" | "emit" | "ready" | "error" | "fatal" | "success" | "onTestingFinished";
     
     app.post('/socket/:actionName', jsonBodyParser, withHandler((req, res) => {
       if (socket[req.params.actionName as ISocketActions] instanceof Function) {
         socket[req.params.actionName as ISocketActions](req.body ? req.body.data : null)
         res.json({ "details": "Socket call executed sucessfully" })
        } else res.status(400).json({ "details": `Socket action ${req.params.actionName} not found` })
      }))
    */
  // symbolic link to maintain path compatiblity
  const fetchStaticAsset = withHandler((req, res) => {
    const filePath = `${
      config === null || config === void 0 ? void 0 : config.dirPath
    }/assets/${req.params.filePath}`;
    if (!fs.existsSync(filePath))
      throw new Error("File not found: " + filePath);
    const content = fs.readFileSync(filePath);
    res.write(content);
    res.end();
  });
  app.get(
    `${
      (config === null || config === void 0
        ? void 0
        : config.dirPath.indexOf("./")) === 0
        ? config.dirPath.slice(1)
        : config === null || config === void 0
        ? void 0
        : config.dirPath
    }/assets/:filePath`,
    fetchStaticAsset
  );
  app.get("/assets/:filePath", fetchStaticAsset);
  app.get(
    "/exercise",
    withHandler((_, res) => {
      res.json(exercises);
    })
  );
  app.get(
    "/exercise/:slug/readme",
    withHandler(({ params: { slug }, query: { lang } }, res) => {
      const excercise = configManager.getExercise(slug);
      if (excercise) {
        const readme = excercise.getReadme(lang || null);
        res.json(readme);
      } else {
        res.status(400);
      }
    })
  );
  app.get(
    "/exercise/:slug/report",
    withHandler(({ params: { slug } }, res) => {
      const report = configManager.getExercise(slug).getTestReport();
      res.json(JSON.stringify(report));
    })
  );
  app.get(
    "/exercise/:slug",
    withHandler((req, res) => {
      var _a, _b, _c, _d;
      // no need to re-start exercise if it's already started
      if (
        configObject.currentExercise &&
        req.params.slug === configObject.currentExercise
      ) {
        const exercise = configManager.getExercise(req.params.slug);
        res.json(exercise);
        return;
      }
      const exercise = configManager.startExercise(req.params.slug);
      dispatcher.enqueue(dispatcher.events.START_EXERCISE, req.params.slug);
      // eslint-disable-next-line
      const entries = new Set(
        Object.keys(
          config === null || config === void 0 ? void 0 : config.entries
        ).map((lang) =>
          config === null || config === void 0 ? void 0 : config.entries[lang]
        )
      );
      // if we are in incremental grading, the entry file can by dinamically detected
      // based on the changes the student is making during the exercise
      if (
        (config === null || config === void 0 ? void 0 : config.grading) ===
        "incremental"
      ) {
        const scanedFiles = fs.readdirSync("./");
        // update the file hierarchy with updates
        exercise.files = [
          ...exercise.files.filter((f) => f.name.includes("test.")),
          ...exercise_1.filterFiles(scanedFiles),
        ];
        console_1.default.debug(`Exercise updated files: `, exercise.files);
      }
      const detected = exercise_1.detect(
        configObject,
        exercise.files
          .filter((fileName) => entries.has(fileName.name))
          .map((f) => f.name || f)
      );
      // if a new language for the testing engine is detected, we replace it
      // if not we leave it as it was before
      if (
        (config === null || config === void 0 ? void 0 : config.language) &&
        !["", "auto"].includes(
          config === null || config === void 0 ? void 0 : config.language
        )
      ) {
        console_1.default.debug(
          `Exercise language ignored, instead imported from configuration ${
            config === null || config === void 0 ? void 0 : config.language
          }`
        );
        exercise.language =
          detected === null || detected === void 0 ? void 0 : detected.language;
      } else if (
        (detected === null || detected === void 0
          ? void 0
          : detected.language) &&
        (!(config === null || config === void 0 ? void 0 : config.language) ||
          (config === null || config === void 0 ? void 0 : config.language) ===
            "auto")
      ) {
        console_1.default.debug(
          `Switching to ${detected.language} engine in this exercise`
        );
        exercise.language = detected.language;
      }
      // WARNING: has to be the FULL PATH to the entry path
      // We need to detect entry in both gradings: Incremental and Isolate
      exercise.entry =
        detected === null || detected === void 0 ? void 0 : detected.entry;
      console_1.default.debug(
        `Exercise detected entry: ${
          detected === null || detected === void 0 ? void 0 : detected.entry
        } and language ${exercise.language}`
      );
      if (
        !exercise.graded ||
        (config === null || config === void 0
          ? void 0
          : config.disableGrading) ||
        ((_a =
          config === null || config === void 0
            ? void 0
            : config.disabledActions) === null || _a === void 0
          ? void 0
          : _a.includes("test"))
      ) {
        socket_1.default.removeAllowed("test");
      } else {
        socket_1.default.addAllowed("test");
      }
      if (
        !exercise.entry ||
        ((_b =
          config === null || config === void 0
            ? void 0
            : config.disabledActions) === null || _b === void 0
          ? void 0
          : _b.includes("build"))
      ) {
        socket_1.default.removeAllowed("build");
      } else {
        socket_1.default.addAllowed("build");
      }
      if (
        exercise.files.filter(
          (f) =>
            !f.name.toLowerCase().includes("readme.") &&
            !f.name.toLowerCase().includes("test.")
        ).length === 0 ||
        ((_c =
          config === null || config === void 0
            ? void 0
            : config.disabledActions) === null || _c === void 0
          ? void 0
          : _c.includes("reset"))
      ) {
        socket_1.default.removeAllowed("reset");
      } else if (
        !((_d =
          config === null || config === void 0
            ? void 0
            : config.disabledActions) === null || _d === void 0
          ? void 0
          : _d.includes("reset"))
      ) {
        socket_1.default.addAllowed("reset");
      }
      socket_1.default.log("ready");
      res.json(exercise);
    })
  );
  app.get(
    "/exercise/:slug/file/:fileName",
    withHandler((req, res) => {
      res.write(
        configManager.getExercise(req.params.slug).getFile(req.params.fileName)
      );
      res.end();
    })
  );
  const textBodyParser = bodyParser.text();
  app.put(
    "/exercise/:slug/file/:fileName",
    textBodyParser,
    withHandler((req, res) => {
      // const result =
      configManager
        .getExercise(req.params.slug)
        .saveFile(req.params.fileName, req.body);
      res.end();
    })
  );
  if (config === null || config === void 0 ? void 0 : config.outputPath) {
    app.use("/preview", express.static(config.outputPath));
  }
  app.use(
    "/",
    express.static(
      `${config === null || config === void 0 ? void 0 : config.dirPath}/_app`
    )
  );
}
exports.default = default_1;
