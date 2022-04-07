"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InternalError = exports.AuthError = exports.TestingError = exports.CompilerError = exports.NotFoundError = exports.ValidationError = exports.getSolution = void 0;
const console_1 = require("./console");
// eslint-disable-next-line
const fetch = require("node-fetch");
let solutions = null;
const uknown = {
    video: 'https://www.youtube.com/watch?v=gD1Sa99GiE4',
    message: 'Uknown internal error',
    slug: 'uknown',
    gif: 'https://github.com/breatheco-de/breathecode-cli/blob/master/docs/errors/uknown.gif?raw=true',
};
exports.getSolution = (slug) => {
    if (!slug) {
        console_1.default.debug('Getting solution templates from the learnpack repository');
    }
    else {
        console_1.default.debug(`Getting solution for ${slug}`, solutions);
    }
    if (!solutions) {
        console_1.default.debug('Fetching for errors.json on github');
        fetch('https://raw.githubusercontent.com/breatheco-de/breathecode-cli/master/docs/errors/errors.json')
            .then((r) => r.json())
            .then(function (_s) {
            solutions = _s;
        });
        return uknown;
    }
    return typeof solutions[slug || ''] === 'undefined' || !slug ?
        uknown :
        solutions[slug];
};
exports.ValidationError = (error) => {
    const message = error.message || error;
    const _err = new Error(message);
    _err.status = 400;
    _err.type = 'validation-error';
    const sol = exports.getSolution(error.slug);
    _err.video = sol.video;
    _err.gif = sol.gif;
    _err.message = typeof message === 'string' ? message : sol.message;
    return _err;
};
exports.NotFoundError = (error) => {
    const message = error.message || error;
    const _err = new Error(message);
    _err.status = 400;
    _err.type = 'not-found-error';
    const sol = exports.getSolution(error.slug);
    _err.video = sol.video;
    _err.gif = sol.gif;
    _err.message = typeof message === 'string' ? message : sol.message;
    return _err;
};
exports.CompilerError = (error) => {
    const message = error.message || error;
    const _err = new Error(message);
    _err.status = 400;
    _err.type = 'compiler-error';
    const sol = exports.getSolution(error.slug);
    _err.video = sol.video;
    _err.gif = sol.gif;
    _err.message = typeof message === 'string' ? message : sol.message;
    return _err;
};
exports.TestingError = (error) => {
    const message = error.message || error;
    const _err = new Error(message);
    _err.status = 400;
    _err.type = 'testing-error';
    return _err;
};
exports.AuthError = (error) => {
    const message = error.message || error;
    const _err = new Error(message);
    _err.status = 403;
    _err.type = 'auth-error';
    return _err;
};
exports.InternalError = (error) => {
    const message = error.message || error;
    const _err = new Error(message);
    _err.status = 500;
    _err.type = 'internal-error';
    const sol = exports.getSolution(error.slug);
    _err.video = sol.video;
    _err.gif = sol.gif;
    _err.message = typeof message === 'string' ? message : sol.message;
    return _err;
};
exports.getSolution();
exports.default = {
    ValidationError: exports.ValidationError,
    CompilerError: exports.CompilerError,
    TestingError: exports.TestingError,
    NotFoundError: exports.NotFoundError,
    InternalError: exports.InternalError,
    AuthError: exports.AuthError,
};
