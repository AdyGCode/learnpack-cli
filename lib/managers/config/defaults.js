"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
  config: {
    port: 3000,
    editor: {
      mode: null,
      agent: null,
      version: null,
    },
    dirPath: "./.learn",
    configPath: "./learn.json",
    outputPath: "./.learn/dist",
    publicPath: "/preview",
    publicUrl: null,
    language: "auto",
    grading: "isolated",
    exercisesPath: "./",
    webpackTemplate: null,
    disableGrading: false,
    disabledActions: [],
    actions: [],
    entries: {
      html: "index.html",
      vanillajs: "index.js",
      react: "app.jsx",
      node: "app.js",
      python3: "app.py",
      java: "app.java",
    },
  },
  address: "http://localhost",
  currentExercise: null,
  exercises: [],
};
