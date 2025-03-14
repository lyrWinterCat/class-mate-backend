"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = require("express");
const index_1 = (0, tslib_1.__importDefault)(require("./naverLogin/index"));
const router = (0, express_1.Router)();
router.post("/", async (req, res) => {
    try {
        res.status(200).send({ message: "api router is running!" });
    }
    catch (error) {
        res.status(404).send({ message: error.message });
    }
});
router.use("/", index_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map