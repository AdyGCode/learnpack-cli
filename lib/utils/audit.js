"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const console_1 = require("./console");
// eslint-disable-next-line
const fetch = require("node-fetch");
const fs = require("fs");
exports.default = {
  // This function checks if a url is valid.
  isUrl: async (url, errors, counter) => {
    const regexUrl = /(https?:\/\/[\w./-]+)/gm;
    counter.links.total++;
    if (!regexUrl.test(url)) {
      counter.links.error++;
      errors.push({
        exercise: undefined,
        msg: `The repository value of the configuration file is not a link: ${url}`,
      });
      return false;
    }
    const res = await fetch(url, { method: "HEAD" });
    if (!res.ok) {
      counter.links.error++;
      errors.push({
        exercise: undefined,
        msg: `The link of the repository is broken: ${url}`,
      });
    }
    return true;
  },
  checkForEmptySpaces: (str) => {
    const isEmpty = true;
    for (const letter of str) {
      if (letter !== " ") {
        return false;
      }
    }
    return isEmpty;
  },
  checkLearnpackClean: (configObj, errors) => {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    if (
      (((_a = configObj.config) === null || _a === void 0
        ? void 0
        : _a.outputPath) &&
        fs.existsSync(
          (_b = configObj.config) === null || _b === void 0
            ? void 0
            : _b.outputPath
        )) ||
      fs.existsSync(
        `${
          (_c = configObj.config) === null || _c === void 0
            ? void 0
            : _c.dirPath
        }/_app`
      ) ||
      fs.existsSync(
        `${
          (_d = configObj.config) === null || _d === void 0
            ? void 0
            : _d.dirPath
        }/reports`
      ) ||
      fs.existsSync(
        `${
          (_e = configObj.config) === null || _e === void 0
            ? void 0
            : _e.dirPath
        }/resets`
      ) ||
      fs.existsSync(
        `${
          (_f = configObj.config) === null || _f === void 0
            ? void 0
            : _f.dirPath
        }/app.tar.gz`
      ) ||
      fs.existsSync(
        `${
          (_g = configObj.config) === null || _g === void 0
            ? void 0
            : _g.dirPath
        }/config.json`
      ) ||
      fs.existsSync(
        `${
          (_h = configObj.config) === null || _h === void 0
            ? void 0
            : _h.dirPath
        }/vscode_queue.json`
      )
    ) {
      errors.push({
        exercise: undefined,
        msg: "You have to run learnpack clean command",
      });
    }
  },
  findInFile: (types, content) => {
    const regex = {
      relativeImages:
        /!\[.*]\s*\((((\.\/)?(\.{2}\/){1,5})(.*\/)*(.[^\s/]*\.[A-Za-z]{2,4})\S*)\)/gm,
      externalImages: /!\[.*]\((https?:\/(\/[^)/]+)+\/?)\)/gm,
      markdownLinks: /(\s)+\[.*]\((https?:\/(\/[^)/]+)+\/?)\)/gm,
      url: /(https?:\/\/[\w./-]+)/gm,
      uploadcare: /https:\/\/ucarecdn.com\/(?:.*\/)*([\w./-]+)/gm,
    };
    const validTypes = Object.keys(regex);
    if (!Array.isArray(types)) types = [types];
    const findings = {};
    for (const type of types) {
      if (!validTypes.includes(type)) throw new Error("Invalid type: " + type);
      else findings[type] = {};
    }
    for (const type of types) {
      let m;
      while ((m = regex[type].exec(content)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (m.index === regex.lastIndex) {
          regex.lastIndex++;
        }
        // The result can be accessed through the `m`-variable.
        // m.forEach((match, groupIndex) => values.push(match));
        findings[type][m[0]] = {
          content: m[0],
          absUrl: m[1],
          mdUrl: m[2],
          relUrl: m[6],
        };
      }
    }
    return findings;
  },
  // This function checks if there are errors, and show them in the console at the end.
  showErrors: (errors, counter) => {
    return new Promise((resolve, reject) => {
      if (errors) {
        if (errors.length > 0) {
          console_1.default.log("Checking for errors...");
          for (const [i, error] of errors.entries())
            console_1.default.error(
              `${i + 1}) ${error.msg} ${
                error.exercise ? `(Exercise: ${error.exercise})` : ""
              }`
            );
          console_1.default.error(
            ` We found ${errors.length} errors among ${counter.images.total} images, ${counter.links.total} link, ${counter.readmeFiles} README files and ${counter.exercises} exercises.`
          );
          process.exit(1);
        } else {
          console_1.default.success(
            `We didn't find any errors in this repository among ${counter.images.total} images, ${counter.links.total} link, ${counter.readmeFiles} README files and ${counter.exercises} exercises.`
          );
          process.exit(0);
        }
      } else {
        reject("Failed");
      }
    });
  },
  // This function checks if there are warnings, and show them in the console at the end.
  showWarnings: (warnings) => {
    return new Promise((resolve, reject) => {
      if (warnings) {
        if (warnings.length > 0) {
          console_1.default.log("Checking for warnings...");
          for (const [i, warning] of warnings.entries())
            console_1.default.warning(
              `${i + 1}) ${warning.msg} ${
                warning.exercise ? `File: ${warning.exercise}` : ""
              }`
            );
        }
        resolve("SUCCESS");
      } else {
        reject("Failed");
      }
    });
  },
};
