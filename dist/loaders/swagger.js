"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.specs = exports.swaggerUI = void 0;
const tslib_1 = require("tslib");
const swagger_ui_express_1 = (0, tslib_1.__importDefault)(require("swagger-ui-express"));
exports.swaggerUI = swagger_ui_express_1.default;
const swagger_jsdoc_1 = (0, tslib_1.__importDefault)(require("swagger-jsdoc"));
const options = {
    swaggerDefinition: {
        openapi: "3.0.0",
        info: {
            version: "1.0.0",
            title: "CLASS MATE API",
            description: "CLASS MATE API SERVER TEST",
            license: {
                name: "MIT",
                url: "https://spdx.org/licenses/MIT.html",
            },
            contact: {
                name: "이예림",
                url: "http://naver.com",
                email: "yelim527@naver.com",
            },
        },
        servers: [
            //https 테스트
            { url: `http://localhost:5000` },
            //원래소스
            // { url: `http://localhost:${global.port}` },
            //원래주석
            // { url: `http://localhost:${global.port}/api` },
        ],
    },
    apis: [
        "./src/api/routes/*.ts",
        "./src/api/routes/*/*.ts",
        "./src/api/routes/*/*/*.ts",
        "./src/api/routes/*/*/*/*.ts",
        "./src/api/routes/*/*/*/*/*.ts",
    ],
};
const specs = (0, swagger_jsdoc_1.default)(options);
exports.specs = specs;
//# sourceMappingURL=swagger.js.map