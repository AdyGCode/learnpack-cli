"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const console_1 = require("../utils/console");
const storage = require("node-persist");
const cli_ux_1 = require("cli-ux");
const HOST = "https://learnpack.herokuapp.com";
// eslint-disable-next-line
const _fetch = require("node-fetch");
const fetch = async (url, options = {}) => {
    const headers = { "Content-Type": "application/json" };
    let session = null;
    try {
        session = await storage.getItem("bc-payload");
        if (session.token && session.token !== "" && !url.includes("/token"))
            headers.Authorization = "Token " + session.token;
    }
    catch (_a) { }
    try {
        const resp = await _fetch(url, Object.assign(Object.assign({}, options), { headers: Object.assign(Object.assign({}, headers), options.headers) }));
        if (resp.status >= 200 && resp.status < 300)
            return await resp.json();
        if (resp.status === 401)
            throw APIError("Invalid authentication credentials", 401);
        else if (resp.status === 404)
            throw APIError("Package not found", 404);
        else if (resp.status >= 500)
            throw APIError("Impossible to connect with the server", 500);
        else if (resp.status >= 400) {
            const error = await resp.json();
            if (error.detail || error.error) {
                throw APIError(error.detail || error.error);
            }
            else if (error.nonFieldErrors) {
                throw APIError(error.nonFieldErrors[0], error);
            }
            else if (typeof error === "object") {
                if (Object.keys(error).length > 0) {
                    const key = error[Object.keys(error)[0]];
                    throw APIError(`${key}: ${error[key][0]}`, error);
                }
            }
            else {
                throw APIError("Uknown error");
            }
        }
        else
            throw APIError("Uknown error");
    }
    catch (error) {
        console_1.default.error(error.message);
        throw error;
    }
};
const login = async (identification, password) => {
    try {
        cli_ux_1.default.action.start("Looking for credentials...");
        await cli_ux_1.default.wait(1000);
        const data = await fetch(`${HOST}/v1/auth/token/`, {
            body: JSON.stringify({ identification, password }),
            method: "post",
        });
        cli_ux_1.default.action.stop("ready");
        return data;
    }
    catch (error) {
        console_1.default.error(error.message);
        console_1.default.debug(error);
    }
};
const publish = async (config) => {
    const keys = [
        "difficulty",
        "language",
        "skills",
        "technologies",
        "slug",
        "repository",
        "author",
        "title",
    ];
    const payload = {};
    for (const k of keys)
        config[k] ? (payload[k] = config[k]) : null;
    try {
        console.log("Package to publish:", payload);
        cli_ux_1.default.action.start("Updating package information...");
        await cli_ux_1.default.wait(1000);
        const data = await fetch(`${HOST}/v1/package/${config.slug}`, {
            method: "PUT",
            body: JSON.stringify(payload),
        });
        cli_ux_1.default.action.stop("ready");
        return data;
    }
    catch (error) {
        console.log("payload", payload);
        console_1.default.error(error.message);
        console_1.default.debug(error);
        throw error;
    }
};
const update = async (config) => {
    try {
        cli_ux_1.default.action.start("Updating package information...");
        await cli_ux_1.default.wait(1000);
        const data = await fetch(`${HOST}/v1/package/`, {
            method: "POST",
            body: JSON.stringify(config),
        });
        cli_ux_1.default.action.stop("ready");
        return data;
    }
    catch (error) {
        console_1.default.error(error.message);
        console_1.default.debug(error);
        throw error;
    }
};
const getPackage = async (slug) => {
    try {
        cli_ux_1.default.action.start("Downloading package information...");
        await cli_ux_1.default.wait(1000);
        const data = await fetch(`${HOST}/v1/package/${slug}`);
        cli_ux_1.default.action.stop("ready");
        return data;
    }
    catch (error) {
        if (error.status === 404)
            console_1.default.error(`Package ${slug} does not exist`);
        else
            console_1.default.error(`Package ${slug} does not exist`);
        console_1.default.debug(error);
        throw error;
    }
};
const getLangs = async () => {
    try {
        cli_ux_1.default.action.start("Downloading language options...");
        await cli_ux_1.default.wait(1000);
        const data = await fetch(`${HOST}/v1/package/language`);
        cli_ux_1.default.action.stop("ready");
        return data;
    }
    catch (error) {
        if (error.status === 404)
            console_1.default.error("Package slug does not exist");
        else
            console_1.default.error("Package slug does not exist");
        console_1.default.debug(error);
        throw error;
    }
};
const getAllPackages = async ({ lang = "", slug = "", }) => {
    try {
        cli_ux_1.default.action.start("Downloading packages...");
        await cli_ux_1.default.wait(1000);
        const data = await fetch(`${HOST}/v1/package/all?limit=100&language=${lang}&slug=${slug}`);
        cli_ux_1.default.action.stop("ready");
        return data;
    }
    catch (error) {
        console_1.default.error(`Package ${slug} does not exist`);
        console_1.default.debug(error);
        throw error;
    }
};
const APIError = (error, code) => {
    const message = error.message || error;
    const _err = new Error(message);
    _err.status = code || 400;
    return _err;
};
exports.default = { login, publish, update, getPackage, getLangs, getAllPackages };
