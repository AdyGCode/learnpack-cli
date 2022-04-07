"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const fs = require("fs");
const shell = require("shelljs");
const console_1 = require("../../utils/console");
const watcher_1 = require("../../utils/watcher");
const errors_1 = require("../../utils/errors");
const defaults_1 = require("./defaults");
const exercise_1 = require("./exercise");
const file_1 = require("../file");
/* exercise folder name standard */
// eslint-disable-next-line
const fetch = require("node-fetch");
// eslint-disable-next-line
const chalk = require("chalk");
/* exercise folder name standard */
const getConfigPath = () => {
  const possibleFileNames = [
    "learn.json",
    ".learn/learn.json",
    "bc.json",
    ".breathecode/bc.json",
  ];
  const config = possibleFileNames.find((file) => fs.existsSync(file)) || null;
  if (config && fs.existsSync(".breathecode"))
    return { config, base: ".breathecode" };
  if (config === null)
    throw errors_1.NotFoundError(
      "learn.json file not found on current folder, is this a learnpack package?"
    );
  return { config, base: ".learn" };
};
const getExercisesPath = (base) => {
  const possibleFileNames = ["./exercises", base + "/exercises", "./"];
  return possibleFileNames.find((file) => fs.existsSync(file)) || null;
};
const getGitpodAddress = () => {
  if (shell.exec("gp -h", { silent: true }).code === 0) {
    return shell
      .exec("gp url", { silent: true })
      .stdout.replace(/(\r\n|\n|\r)/gm, "");
  }
  console_1.default.debug("Gitpod command line tool not found");
  return "http://localhost";
};
exports.default = async ({ grading, mode, disableGrading, version }) => {
  var _a, _b;
  const confPath = getConfigPath();
  console_1.default.debug("This is the config path: ", confPath);
  let configObj = {};
  if (confPath) {
    const bcContent = fs.readFileSync(confPath.config);
    let hiddenBcContent = {};
    if (fs.existsSync(confPath.base + "/config.json")) {
      hiddenBcContent = fs.readFileSync(confPath.base + "/config.json");
      hiddenBcContent = JSON.parse(hiddenBcContent);
      if (!hiddenBcContent)
        throw new Error(
          `Invalid ${confPath.base}/config.json syntax: Unable to parse.`
        );
    }
    const jsonConfig = JSON.parse(`${bcContent}`);
    if (!jsonConfig)
      throw new Error(`Invalid ${confPath.config} syntax: Unable to parse.`);
    let session;
    // add using id to the installation
    if (!jsonConfig.session) {
      session = Math.floor(Math.random() * 10000000000000000000);
    } else {
      session = jsonConfig.session;
      delete jsonConfig.session;
    }
    configObj = deepMerge(hiddenBcContent, {
      config: jsonConfig,
      session: session,
    });
    console_1.default.debug("Content from the configuration .json ", configObj);
  } else {
    throw errors_1.ValidationError(
      "No learn.json file has been found, make sure you are in the folder"
    );
  }
  configObj = deepMerge(defaults_1.default || {}, configObj, {
    config: {
      grading:
        grading ||
        ((_a = configObj.config) === null || _a === void 0
          ? void 0
          : _a.grading),
      configPath: confPath.config,
    },
  });
  if (configObj.config) {
    configObj.config.outputPath = confPath.base + "/dist";
  }
  console_1.default.debug(
    "This is your configuration object: ",
    Object.assign(Object.assign({}, configObj), {
      exercises: configObj.exercises
        ? configObj.exercises.map((e) => e.slug)
        : [],
    })
  );
  // auto detect agent (if possible)
  if (shell.which("gp") && configObj && configObj.config) {
    configObj.config.editor.agent = "gitpod";
    configObj.address = getGitpodAddress();
    configObj.config.publicUrl = `https://${configObj.config.port}-${
      (_b = configObj.address) === null || _b === void 0 ? void 0 : _b.slice(8)
    }`;
  } else if (configObj.config && !configObj.config.editor.agent) {
    configObj.config.editor.agent = "localhost";
  }
  if (configObj.config && !configObj.config.publicUrl)
    configObj.config.publicUrl = `${configObj.address}:${configObj.config.port}`;
  // Assign default editor mode if not set already
  if (configObj.config && mode !== null) {
    configObj.config.editor.mode = mode || "vscode";
  }
  if (configObj.config && !configObj.config.editor.mode)
    configObj.config.editor.mode =
      configObj.config.editor.agent === "localhost" ? "standalone" : "preview";
  if (version && configObj.config) configObj.config.editor.version = version;
  else if (configObj.config && configObj.config.editor.version === null) {
    console_1.default.debug("Config version not found, downloading default.");
    const resp = await fetch(
      "https://raw.githubusercontent.com/learnpack/coding-ide/learnpack/package.json"
    );
    const packageJSON = await resp.json();
    configObj.config.editor.version = packageJSON.version || "1.0.72";
  }
  if (configObj.config) {
    configObj.config.dirPath = "./" + confPath.base;
    configObj.config.exercisesPath = getExercisesPath(confPath.base) || "./";
  }
  return {
    validLanguages: {},
    get: () => configObj,
    validateEngine: function (language, server, socket) {
      // eslint-disable-next-line
      const alias = (_l) => {
        const map = {
          python3: "python",
        };
        if (map[_l]) return map[_l];
        return _l;
      };
      // decode aliases
      language = alias(language);
      if (this.validLanguages[language]) return true;
      console_1.default.debug(`Validating engine for ${language} compilation`);
      let result = shell.exec("learnpack plugins", { silent: true });
      if (
        result.code === 0 &&
        result.stdout.includes(`learnpack-${language}`)
      ) {
        this.validLanguages[language] = true;
        return true;
      }
      console_1.default.info(
        `Language engine for ${language} not found, installing...`
      );
      result = shell.exec(`learnpack plugins:install learnpack-${language}`, {
        silent: true,
      });
      if (result.code === 0) {
        socket.log(
          "compiling",
          "Installing the python compiler, you will have to reset the exercises after installation by writing on your terminal: $ learnpack run"
        );
        console_1.default.info(
          `Successfully installed the ${language} exercise engine, \n please start learnpack again by running the following command: \n ${chalk.white(
            "$ learnpack start"
          )}\n\n `
        );
        server.terminate();
        return false;
      }
      this.validLanguages[language] = false;
      socket.error(`Error installing ${language} exercise engine`);
      console_1.default.error(`Error installing ${language} exercise engine`);
      console_1.default.log(result.stdout);
      throw errors_1.InternalError(
        `Error installing ${language} exercise engine`
      );
    },
    clean: () => {
      if (configObj.config) {
        if (configObj.config.outputPath) {
          file_1.rmSync(configObj.config.outputPath);
        }
        file_1.rmSync(configObj.config.dirPath + "/_app");
        file_1.rmSync(configObj.config.dirPath + "/reports");
        file_1.rmSync(configObj.config.dirPath + "/.session");
        file_1.rmSync(configObj.config.dirPath + "/resets");
        // clean tag gz
        if (fs.existsSync(configObj.config.dirPath + "/app.tar.gz"))
          fs.unlinkSync(configObj.config.dirPath + "/app.tar.gz");
        if (fs.existsSync(configObj.config.dirPath + "/config.json"))
          fs.unlinkSync(configObj.config.dirPath + "/config.json");
        if (fs.existsSync(configObj.config.dirPath + "/vscode_queue.json"))
          fs.unlinkSync(configObj.config.dirPath + "/vscode_queue.json");
      }
    },
    getExercise: (slug) => {
      console_1.default.debug("ExercisePath Slug", slug);
      const exercise = (configObj.exercises || []).find(
        (ex) => ex.slug === slug
      );
      if (!exercise)
        throw errors_1.ValidationError(`Exercise ${slug} not found`);
      return exercise;
    },
    getAllExercises: () => {
      return configObj.exercises;
    },
    startExercise: function (slug) {
      const exercise = this.getExercise(slug);
      // set config.json with current exercise
      configObj.currentExercise = exercise.slug;
      this.save();
      // eslint-disable-next-line
      exercise.files.forEach((f) => {
        if (configObj.config) {
          const _path = configObj.config.outputPath + "/" + f.name;
          if (f.hidden === false && fs.existsSync(_path)) fs.unlinkSync(_path);
        }
      });
      return exercise;
    },
    noCurrentExercise: function () {
      configObj.currentExercise = null;
      this.save();
    },
    reset: (slug) => {
      var _a;
      if (
        configObj.config &&
        !fs.existsSync(`${configObj.config.dirPath}/resets/` + slug)
      )
        throw errors_1.ValidationError(
          "Could not find the original files for " + slug
        );
      const exercise = (configObj.exercises || []).find(
        (ex) => ex.slug === slug
      );
      if (!exercise)
        throw errors_1.ValidationError(
          `Exercise ${slug} not found on the configuration`
        );
      if (configObj.config) {
        for (const fileName of fs.readdirSync(
          `${configObj.config.dirPath}/resets/${slug}/`
        )) {
          const content = fs.readFileSync(
            `${
              (_a = configObj.config) === null || _a === void 0
                ? void 0
                : _a.dirPath
            }/resets/${slug}/${fileName}`
          );
          fs.writeFileSync(`${exercise.path}/${fileName}`, content);
        }
      }
    },
    buildIndex: function () {
      var _a, _b;
      console_1.default.info("Building the exercise index...");
      const isDirectory = (source) => {
        var _a;
        const name = path.basename(source);
        if (
          name ===
          path.basename(
            ((_a =
              configObj === null || configObj === void 0
                ? void 0
                : configObj.config) === null || _a === void 0
              ? void 0
              : _a.dirPath) || ""
          )
        )
          return false;
        // ignore folders that start with a dot
        if (name.charAt(0) === "." || name.charAt(0) === "_") return false;
        return fs.lstatSync(source).isDirectory();
      };
      const getDirectories = (source) =>
        fs
          .readdirSync(source)
          .map((name) => path.join(source, name))
          .filter(isDirectory);
      // add the .learn folder
      if (!fs.existsSync(confPath.base)) fs.mkdirSync(confPath.base);
      // add the outout folder where webpack will publish the the html/css/js files
      if (
        configObj.config &&
        configObj.config.outputPath &&
        !fs.existsSync(configObj.config.outputPath)
      )
        fs.mkdirSync(configObj.config.outputPath);
      // TODO: we could use npm library front-mater to read the title of the exercises from the README.md
      const grupedByDirectory = getDirectories(
        ((_a =
          configObj === null || configObj === void 0
            ? void 0
            : configObj.config) === null || _a === void 0
          ? void 0
          : _a.exercisesPath) || ""
      );
      configObj.exercises =
        grupedByDirectory.length > 0
          ? grupedByDirectory.map((path, position) =>
              exercise_1.exercise(path, position, configObj)
            )
          : [
              exercise_1.exercise(
                ((_b =
                  configObj === null || configObj === void 0
                    ? void 0
                    : configObj.config) === null || _b === void 0
                  ? void 0
                  : _b.exercisesPath) || "",
                0,
                configObj
              ),
            ];
      this.save();
    },
    watchIndex: function (onChange) {
      var _a;
      if (configObj.config && !configObj.config.exercisesPath)
        throw errors_1.ValidationError(
          "No exercises directory to watch: " + configObj.config.exercisesPath
        );
      this.buildIndex();
      watcher_1
        .default(
          ((_a =
            configObj === null || configObj === void 0
              ? void 0
              : configObj.config) === null || _a === void 0
            ? void 0
            : _a.exercisesPath) || ""
        )
        .then((/* eventname, filename */) => {
          console_1.default.debug("Changes detected on your exercises");
          this.buildIndex();
          if (onChange) onChange();
        })
        .catch((error) => {
          throw error;
        });
    },
    save: () => {
      console_1.default.debug("Saving configuration with: ", configObj);
      // remove the duplicates form the actions array
      // configObj.config.actions = [...new Set(configObj.config.actions)];
      if (configObj.config) {
        configObj.config.translations = [
          ...new Set(configObj.config.translations),
        ];
        fs.writeFileSync(
          configObj.config.dirPath + "/config.json",
          JSON.stringify(configObj, null, 4)
        );
      }
    },
  };
};
function deepMerge(...sources) {
  let acc = {};
  for (const source of sources) {
    if (Array.isArray(source)) {
      if (!Array.isArray(acc)) {
        acc = [];
      }
      acc = [...source];
    } else if (source instanceof Object) {
      // eslint-disable-next-line
      for (let [key, value] of Object.entries(source)) {
        if (value instanceof Object && key in acc) {
          value = deepMerge(acc[key], value);
        }
        if (value !== undefined)
          acc = Object.assign(Object.assign({}, acc), { [key]: value });
      }
    }
  }
  return acc;
}
