"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const CompilationError = (messages) => {
  const _err = new Error(messages);
  _err.status = 400;
  _err.stdout = messages;
  _err.type = "compiler-error";
  return _err;
};
exports.default = {
  CompilationError,
  default: async (_a) => {
    var { action } = _a,
      rest = tslib_1.__rest(_a, ["action"]);
    const stdout = await action.run(rest);
    return stdout;
  },
};
