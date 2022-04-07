"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const console_1 = require("../utils/console");
const api_1 = require("../utils/api");
const validator_1 = require("validator");
const errors_1 = require("../utils/errors");
// import moment from 'moment'
const fs = require("fs");
const cli_ux_1 = require("cli-ux");
const storage = require("node-persist");
const Session = {
  sessionStarted: false,
  token: null,
  config: null,
  currentCohort: null,
  initialize: async function () {
    if (!this.sessionStarted) {
      if (!this.config) {
        throw errors_1.InternalError("Configuration not found");
      }
      if (!fs.existsSync(this.config.dirPath)) {
        fs.mkdirSync(this.config.dirPath);
      }
      await storage.init({ dir: `${this.config.dirPath}/.session` });
      this.sessionStarted = true;
    }
    return true;
  },
  setPayload: async function (value) {
    await this.initialize();
    await storage.setItem(
      "bc-payload",
      Object.assign({ token: this.token }, value)
    );
    console_1.default.debug(
      "Payload successfuly found and set for " + value.email
    );
    return true;
  },
  getPayload: async function () {
    await this.initialize();
    let payload = null;
    try {
      payload = await storage.getItem("bc-payload");
    } catch (error) {
      // TODO: Remove it
      console.log(error);
      console_1.default.debug("Error retriving session payload");
    }
    return payload;
  },
  isActive: function () {
    /* if (this.token) {
          return true
        } else {
          return false
        } */
    return !!this.token;
  },
  get: async function (configObj) {
    if (configObj && configObj.config) {
      this.config = configObj.config;
    }
    await this.sync();
    if (!this.isActive()) {
      return null;
    }
    const payload = await this.getPayload();
    return {
      payload,
      token: this.token,
    };
  },
  login: async function () {
    const email = await cli_ux_1.default.prompt("What is your email?");
    if (!validator_1.default.isEmail(email)) {
      throw errors_1.ValidationError("Invalid email");
    }
    const password = await cli_ux_1.default.prompt("What is your password?", {
      type: "hide",
    });
    const data = await api_1.default.login(email, password);
    if (data) {
      this.start({ token: data.token, payload: data });
    }
  },
  sync: async function () {
    const payload = await this.getPayload();
    if (payload) {
      this.token = payload.token;
    }
  },
  start: async function ({ token, payload = null }) {
    if (!token) {
      throw new Error("A token and email is needed to start a session");
    }
    this.token = token;
    if (payload && (await this.setPayload(payload))) {
      console_1.default.success(`Successfully logged in as ${payload.email}`);
    }
  },
  destroy: async function () {
    await storage.clear();
    this.token = null;
    console_1.default.success("You have logged out");
  },
};
exports.default = Session;
