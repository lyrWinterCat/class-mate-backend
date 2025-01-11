"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = require("express");
const cors_1 = (0, tslib_1.__importDefault)(require("cors"));
const index_1 = (0, tslib_1.__importDefault)(require("./route/api/index"));
const index_2 = (0, tslib_1.__importDefault)(require("./route/user/index"));
const swagger_1 = require("../loaders/swagger");
const router = (0, express_1.Router)();
const corsOptions = {
    origin: "*",
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};
router.use((0, cors_1.default)(corsOptions));
router.get("/", (req, res) => {
    try {
        res.status(200).send({ message: "server-client connect success" });
    }
    catch (error) {
        res.status(500).send({ message: error.message });
    }
});
router.use('/api-docs', swagger_1.swaggerUI.serve, swagger_1.swaggerUI.setup(swagger_1.specs));
router.use("/api", 
// basicAuth({
//   unauthorizedResponse: getUnauthorizedResponse,
//   authorizer: authorizer,
//   authorizeAsync: true,
//   realm: "Imb4T3st4pp",
//   challenge: false,
// }),
index_1.default);
router.use("/user", index_2.default);
exports.default = router;
//# sourceMappingURL=index.js.map