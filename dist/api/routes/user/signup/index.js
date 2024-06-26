"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = require("express");
//db test
const db_1 = (0, tslib_1.__importDefault)(require("../../../../loaders/db"));
const router = (0, express_1.Router)();
router.post("/signup", (req, res) => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
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
}));
/**
 * @swagger
 *  paths:
 *  /user/signup:
 *    post:
 *      tags: [User]
 *      summary:  "signup at the class mate server"
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                e_mail:
 *                  example: test@test.com
 *                name:
 *                  example: 김철수
 *                birthday:
 *                  type: string
 *                  format: date
 *                  example: 1999-01-01
 *                school_type1:
 *                  type: string
 *                  example: 1
 *                school_name1:
 *                  type: string
 *                  example: 친구초등학교
 *                school_type2:
 *                  type: string
 *                  example: 2
 *                school_name2:
 *                  type: string
 *                  example: 친구중학교
 *                school_type3:
 *                  type: string
 *                  example: 3
 *                school_name3:
 *                  type: string
 *                  example: 친구고등학교
 *
 *      responses:
 *        200:
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                    example: "success"
 *
 */
//dbtest
router.post("/test", (req, res) => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
    try {
        const [rows] = yield db_1.default.query('SELECT * FROM test_table');
        res.json(rows);
    }
    catch (error) {
        console.error('Error executing query: ', error);
        res.status(500).send('Server error');
    }
}));
exports.default = router;
//# sourceMappingURL=index.js.map