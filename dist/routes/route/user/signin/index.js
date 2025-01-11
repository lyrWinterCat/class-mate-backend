"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
require('dotenv').config();
const router = (0, express_1.Router)();
router.post("/signin", async (req, res) => {
    try {
        const { username, password } = req.body;
        res.status(200).json({
            status: 200,
            message: "login success",
        });
    }
    catch (error) {
        res.status(404).send({ message: error.message });
    }
});
exports.default = router;
//# sourceMappingURL=index.js.map