"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rmSync =
  exports.clone =
  exports.download =
  exports.downloadEditor =
  exports.decompress =
    void 0;
const fs = require("fs");
const p = require("path");
const shell = require("shelljs");
const cli_ux_1 = require("cli-ux");
const targz = require("targz");
const console_1 = require("../utils/console");
const https = require("https");
const errors_1 = require("../utils/errors");
// eslint-disable-next-line
const fetch = require("node-fetch");
exports.decompress = (sourcePath, destinationPath) =>
  new Promise((resolve, reject) => {
    console_1.default.debug("Decompressing " + sourcePath);
    targz.decompress(
      {
        src: sourcePath,
        dest: destinationPath,
      },
      function (err) {
        if (err) {
          console_1.default.error("Error when trying to decompress");
          reject(err);
        } else {
          console_1.default.info("Decompression finished successfully");
          resolve(/* */ "");
        }
      }
    );
  });
exports.downloadEditor = async (version, destination) => {
  // https://raw.githubusercontent.com/learnpack/coding-ide/master/dist/app.tar.gz
  // if(versions[version] === undefined) throw new Error(`Invalid editor version ${version}`)
  const resp2 = await fetch(
    `https://github.com/learnpack/coding-ide/blob/${version}/dist`,
    { method: "HEAD" }
  );
  if (!resp2.ok)
    throw errors_1.InternalError(
      `Coding Editor ${version} was not found on learnpack repository, check the config.editor.version property on learn.json`
    );
  console_1.default.info(
    "Downloading the LearnPack coding UI, this may take a minute..."
  );
  return exports.download(
    `https://github.com/learnpack/coding-ide/blob/${version}/dist/app.tar.gz?raw=true`,
    destination
  );
};
exports.download = (url, dest) => {
  console_1.default.debug("Downloading " + url);
  return new Promise((resolve, reject) => {
    const request = https.get(url, (response) => {
      if (response.statusCode === 200) {
        const file = fs.createWriteStream(dest, { flags: "wx" });
        file.on("finish", () => {
          resolve(true);
        });
        file.on("error", (err) => {
          file.close();
          if (err.code === "EEXIST") {
            console_1.default.debug("File already exists");
            resolve("File already exists");
          } else {
            console_1.default.debug("Error ", err.message);
            fs.unlink(dest, () => reject(err.message)); // Delete temp file
          }
        });
        response.pipe(file);
      } else if (response.statusCode === 302 || response.statusCode === 301) {
        // Console.debug("Servers redirected to "+response.headers.location)
        // Recursively follow redirects, only a 200 will resolve.
        if (response.headers.location) {
          exports
            .download(response.headers.location, dest)
            .then(() => resolve(/* */ ""))
            .catch((error) => {
              console_1.default.error(error);
              reject(error);
            });
        }
      } else {
        console_1.default.debug(
          `Server responded with ${response.statusCode}: ${response.statusMessage}`
        );
        reject(
          `Server responded with ${response.statusCode}: ${response.statusMessage}`
        );
      }
    });
    request.on("error", (err) => {
      reject(err.message);
    });
  });
};
exports.clone = (repository = "", folder = "./") =>
  new Promise((resolve, reject) => {
    if (!repository) {
      reject("Missing repository url for this package");
      // return false
    }
    cli_ux_1.cli.action.start("Verifying GIT...");
    if (!shell.which("git")) {
      reject("Sorry, this script requires git");
      // return false
    }
    cli_ux_1.cli.action.stop();
    let fileName = p.basename(repository);
    if (!fileName) {
      reject("Invalid repository information on package: " + repository);
      // return false
    }
    fileName = fileName.split(".")[0];
    if (fs.existsSync("./" + fileName)) {
      reject(
        `Directory ${fileName} already exists; Did you download this package already?`
      );
      // return false
    }
    cli_ux_1.cli.action.start(`Cloning repository ${repository}...`);
    if (shell.exec(`git clone ${repository}`).code !== 0) {
      reject("Error: Installation failed");
    }
    cli_ux_1.cli.action.stop();
    cli_ux_1.cli.action.start("Cleaning installation...");
    if (shell.exec(`rm -R -f ${folder}${fileName}/.git`).code !== 0) {
      reject("Error: removing .git directory");
    }
    cli_ux_1.cli.action.stop();
    resolve("Done");
  });
exports.rmSync = function (path) {
  let files = [];
  if (fs.existsSync(path)) {
    files = fs.readdirSync(path);
    for (const [, file] of files.entries()) {
      const curPath = path + "/" + file;
      if (fs.lstatSync(curPath).isDirectory()) {
        // recurse
        exports.rmSync(curPath);
      } else {
        // delete file
        fs.unlinkSync(curPath);
      }
    }
    fs.rmdirSync(path);
  }
};
exports.default = {
  download: exports.download,
  decompress: exports.decompress,
  downloadEditor: exports.downloadEditor,
  clone: exports.clone,
  rmSync: exports.rmSync,
};
