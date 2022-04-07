"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TEST_SERVER = void 0;
const express = require("express");
// eslint-disable-next-line
const cors = require("cors");
const console_1 = require("../../utils/console");
const routes_1 = require("./routes");
const cli_ux_1 = require("cli-ux");
async function default_1(configObj, configManager, isTestingEnvironment = false) {
    const { config } = configObj;
    const app = express();
    const server = require("http").Server(app);
    app.use(cors());
    // app.use(function(req, res, next) {
    //     res.header("Access-Control-Allow-Origin", "*")
    //     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    //     res.header("Access-Control-Allow-Methods", "GET,PUT")
    //     next()
    // })
    // add all needed endpoints
    await routes_1.default(app, configObj, configManager);
    server.listen(isTestingEnvironment ? 5000 : config === null || config === void 0 ? void 0 : config.port, function () {
        if (!isTestingEnvironment) {
            console_1.default.success(`Exercises are running 😃 Open your browser to start practicing!`);
            console_1.default.success(`\n            Open the exercise on this link:`);
            console_1.default.log(`            ${config === null || config === void 0 ? void 0 : config.publicUrl}`);
            if ((config === null || config === void 0 ? void 0 : config.editor.mode) === "standalone")
                cli_ux_1.default.open(`${config.publicUrl}`);
        }
    });
    const sockets = new Set();
    server.on("connection", (socket) => {
        sockets.add(socket);
        server.once("close", () => {
            sockets.delete(socket);
        });
    });
    /**
     * Forcefully terminates HTTP server.
     */
    server.terminate = (callback) => {
        for (const socket of sockets) {
            socket.destroy();
            sockets.delete(socket);
        }
        server.close(callback);
    };
    return server;
}
exports.default = default_1;
