"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.askPackage = void 0;
const enquirer_1 = require("enquirer");
const console_1 = require("../utils/console");
const api_1 = require("../utils/api");
exports.askPackage = async () => {
  console_1.default.info("No package was specified");
  const languages = await api_1.default.getLangs();
  return new Promise((resolve, reject) => {
    if (languages.length === 0) {
      // reject(new Error('No categories available'))
      reject("No categories available");
      // return null;
    }
    // let packages = []
    enquirer_1
      .prompt([
        {
          type: "select",
          name: "lang",
          message: "What language do you want to practice?",
          choices: languages.map((l) => ({
            message: l.title,
            name: l.slug,
          })),
        },
      ])
      .then(({ lang }) => {
        return (async () => {
          const response = await api_1.default.getAllPackages({ lang });
          const packages = response.results;
          if (packages.length === 0) {
            const error = new Error(`No packages found for language ${lang}`);
            console_1.default.error(error.message); // TODO: Look this
            return error;
          }
          return enquirer_1.prompt([
            {
              type: "select",
              name: "pack",
              message: "Choose one of the packages available",
              choices: packages.map((l) => ({
                message: `${l.title}, difficulty: ${l.difficulty}, downloads: ${
                  l.downloads
                } ${
                  l.skills.length > 0 ? `(Skills: ${l.skills.join(",")})` : ""
                }`,
                name: l.slug,
              })),
            },
          ]);
        })();
      })
      .then((resp) => {
        if (!resp) reject(resp.message || resp);
        else resolve(resp.pack);
      })
      .catch((error) => {
        console_1.default.error(error.message || error);
      });
  });
};
exports.default = { askPackage: exports.askPackage };
