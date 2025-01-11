"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
require("reflect-metadata");
const express_1 = (0, tslib_1.__importDefault)(require("express"));
const cookie_parser_1 = (0, tslib_1.__importDefault)(require("cookie-parser"));
const path_1 = (0, tslib_1.__importDefault)(require("path"));
const index_1 = (0, tslib_1.__importDefault)(require("../config/index"));
const index_2 = (0, tslib_1.__importDefault)(require("../routes/index"));
const cors_1 = (0, tslib_1.__importDefault)(require("cors"));
const hpp_1 = (0, tslib_1.__importDefault)(require("hpp"));
exports.default = (app) => {
    // front url
    const whitelist = ['http://localhost:3000'];
    //cors 설정
    const corsOptions = {
        origin(origin, callback) {
            const isWhitelisted = origin && whitelist.indexOf(origin) !== -1;
            callback(null, isWhitelisted);
        },
        credentials: true,
    };
    app.use((0, cors_1.default)(corsOptions));
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded({ extended: true }));
    app.use((0, cookie_parser_1.default)());
    app.use(express_1.default.static(path_1.default.join(path_1.default.resolve(), '..', 'public')));
    app.use((0, hpp_1.default)());
    //라우터 연결
    app.use(index_1.default.api.prefix, index_2.default);
};
//# sourceMappingURL=express.js.map