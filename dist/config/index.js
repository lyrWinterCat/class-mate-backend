"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const dotenv_1 = require("dotenv");
const path_1 = (0, tslib_1.__importDefault)(require("path"));
// const env_dir = `../env/.env.${process.env.NODE_ENV || 'development'}`
// config({path: path.join(__dirname,env_dir)})
const envPath = path_1.default.join(__dirname, '../../src/env/.env');
const result = (0, dotenv_1.config)({ path: envPath });
if (result.error) {
    throw result.error;
}
exports.default = {
    //서버포트
    server_port: process.env.PORT,
    //Log winston level
    logs: {
        level: process.env.LOG_LEVEL || 'silly',
    },
    // api 라우터 경로
    api: {
        prefix: '/',
    },
    // jwt secret
    jwt_secret: process.env.JWT_SECRET,
    mysql_config: {
        HOST: process.env.MYSQL_HOST,
        USER: process.env.MYSQL_USER,
        PASSWORD: process.env.MYSQL_PASSWORD,
        dialect: 'mysql',
        DB: process.env.MYSQL_DATABASE,
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        },
        logging: process.env.MYSQL_LOGGING
    },
};
//# sourceMappingURL=index.js.map