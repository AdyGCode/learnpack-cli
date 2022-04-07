"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const console_1 = require("../utils/console");
const SessionCommand_1 = require("../utils/SessionCommand");
const socket_1 = require("../managers/socket");
const server_1 = require("../managers/server");
const exercisesQueue_1 = require("../utils/exercisesQueue");
class TestCommand extends SessionCommand_1.default {
  async init() {
    const { flags } = this.parse(TestCommand);
    await this.initSession(flags);
  }
  async run() {
    var _a, _b, _c;
    const {
      args: { exerciseSlug },
    } = this.parse(TestCommand);
    // Build exercises index
    (_a = this.configManager) === null || _a === void 0
      ? void 0
      : _a.buildIndex();
    let exercises = [];
    // test all exercises
    !exerciseSlug
      ? (exercises =
          (_b = this.configManager) === null || _b === void 0
            ? void 0
            : _b.getAllExercises())
      : (exercises = [this.configManager.getExercise(exerciseSlug)]);
    const exercisesQueue = new exercisesQueue_1.default(exercises);
    const configObject =
      (_c = this.configManager) === null || _c === void 0 ? void 0 : _c.get();
    let hasFailed = false;
    let failedTestsCount = 0;
    let successTestsCount = 0;
    const testsToRunCount = exercisesQueue.size();
    configObject.config.testingFinishedCallback = ({ result }) => {
      if (result === "failed") {
        hasFailed = true;
        failedTestsCount++;
      } else {
        successTestsCount++;
      }
      if (exercisesQueue.isEmpty()) {
        console_1.default.info(
          `${testsToRunCount} test${testsToRunCount > 1 ? "s" : ""} runned`
        );
        console_1.default.success(
          `${successTestsCount} test${successTestsCount > 1 ? "s" : ""} passed`
        );
        console_1.default.error(
          `${failedTestsCount} test${failedTestsCount > 1 ? "s" : ""} failed`
        );
        process.exit(hasFailed ? 1 : 0);
      } else {
        exercisesQueue.pop().test(this.config, config, socket_1.default);
      }
    };
    const config =
      configObject === null || configObject === void 0
        ? void 0
        : configObject.config;
    const server = await server_1.default(
      configObject,
      this.configManager,
      true
    );
    socket_1.default.start(config, server, true);
    exercisesQueue.pop().test(this.config, config, socket_1.default);
  }
}
TestCommand.description = `Test exercises`;
TestCommand.args = [
  {
    name: "exerciseSlug",
    required: false,
    description: "The name of the exercise to test",
    hidden: false,
  },
];
exports.default = TestCommand;
