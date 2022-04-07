"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = require("@oclif/command");
const BaseCommand_1 = require("../utils/BaseCommand");
// eslint-disable-next-line
const fs = require("fs-extra");
const prompts = require("prompts");
const cli_ux_1 = require("cli-ux");
const eta = require("eta");
const console_1 = require("../utils/console");
const errors_1 = require("../utils/errors");
const defaults_1 = require("../managers/config/defaults");
const path = require("path");
class InitComand extends BaseCommand_1.default {
  async run() {
    const { flags } = this.parse(InitComand);
    // if the folder/file .learn or .breathecode aleady exists
    await alreadyInitialized();
    const choices = await prompts([
      {
        type: "select",
        name: "grading",
        message: "Is the auto-grading going to be isolated or incremental?",
        choices: [
          {
            title: "Incremental: Build on top of each other like a tutorial",
            value: "incremental",
          },
          { title: "Isolated: Small separated exercises", value: "isolated" },
          {
            title: "No grading: No feedback or testing whatsoever",
            value: null,
          },
        ],
      },
      {
        type: "text",
        name: "title",
        initial: "My Interactive Tutorial",
        message: "Title for your tutorial? Press enter to leave as it is",
      },
      {
        type: "text",
        name: "description",
        initial: "",
        message: "Description for your tutorial? Press enter to leave blank",
      },
      {
        type: "select",
        name: "difficulty",
        message: "How difficulty will be to complete the tutorial?",
        choices: [
          { title: "Begginer (no previous experience)", value: "beginner" },
          { title: "Easy (just a bit of experience required)", value: "easy" },
          {
            title: "Intermediate (you need experience)",
            value: "intermediate",
          },
          { title: "Hard (master the topic)", value: "hard" },
        ],
      },
      {
        type: "text",
        name: "duration",
        initial: "1",
        message: "How many hours avg it takes to complete (number)?",
        validate: (value) => {
          const n = Math.floor(Number(value));
          return (
            n !== Number.POSITIVE_INFINITY && String(n) === value && n >= 0
          );
        },
      },
    ]);
    const packageInfo = Object.assign(
      Object.assign({}, defaults_1.default.config),
      {
        grading: choices.grading,
        difficulty: choices.difficulty,
        duration: parseInt(choices.duration),
        description: choices.description,
        title: choices.title,
        slug: choices.title
          .toLowerCase()
          .replace(/ /g, "-")
          .replace(/[^\w-]+/g, ""),
      }
    );
    cli_ux_1.default.action.start("Initializing package");
    const languages = ["en", "es"];
    const templatesDir = path.resolve(
      __dirname,
      "../utils/templates/" + choices.grading || "no-grading"
    );
    if (!fs.existsSync(templatesDir))
      throw errors_1.ValidationError(
        `Template ${templatesDir} does not exists`
      );
    await fs.copySync(templatesDir, "./");
    // Creating README files
    // eslint-disable-next-line
    languages.forEach((language) => {
      const readmeFilename = `README${language !== "en" ? `.${language}` : ""}`;
      fs.writeFileSync(
        `./${readmeFilename}.md`,
        eta.render(
          fs.readFileSync(
            path.resolve(__dirname, `${templatesDir}/${readmeFilename}.ejs`),
            "utf-8"
          ),
          packageInfo
        )
      );
      if (fs.existsSync(`./${readmeFilename}.ejs`))
        fs.removeSync(`./${readmeFilename}.ejs`);
    });
    if (!fs.existsSync("./.gitignore"))
      fs.copyFile(
        path.resolve(__dirname, "../utils/templates/gitignore.txt"),
        "./.gitignore"
      );
    fs.writeFileSync("./learn.json", JSON.stringify(packageInfo, null, 2));
    cli_ux_1.default.action.stop();
    console_1.default.success(`😋 Package initialized successfully`);
    console_1.default.help(
      `Start the exercises by running the following command on your terminal: $ learnpack start`
    );
  }
}
InitComand.description =
  "Create a new learning package: Book, Tutorial or Exercise";
InitComand.flags = Object.assign(
  Object.assign({}, BaseCommand_1.default.flags),
  { grading: command_1.flags.help({ char: "h" }) }
);
const alreadyInitialized = () =>
  new Promise((resolve, reject) => {
    fs.readdir("./", function (err, files) {
      files = files.filter((f) =>
        [".learn", "learn.json", "bc.json", ".breathecode"].includes(f)
      );
      if (err) {
        reject(errors_1.ValidationError(err.message));
        throw errors_1.ValidationError(err.message);
      } else if (files.length > 0) {
        reject(
          errors_1.ValidationError(
            "It seems the package is already initialized because we've found the following files: " +
              files.join(",")
          )
        );
        throw errors_1.ValidationError(
          "It seems the package is already initialized because we've found the following files: " +
            files.join(",")
        );
      }
      resolve(false);
    });
  });
exports.default = InitComand;
