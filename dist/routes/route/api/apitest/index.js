"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = require("express");
const cors_1 = (0, tslib_1.__importDefault)(require("cors"));
const router = (0, express_1.Router)();
router.post("/test", (0, cors_1.default)(), async (req, res) => {
    try {
        console.log("api test 들어옴");
        console.log(req.body);
        res.status(200).send({ message: "Received data", data: req.body });
    }
    catch (error) {
        res.status(500).send({ message: error.message });
    }
});
exports.default = router;
//# sourceMappingURL=index.js.map