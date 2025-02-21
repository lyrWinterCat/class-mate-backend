"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = require("express");
const user_1 = require("./../../../../models/user");
const jwt_1 = require("./../../../../loaders/jwt");
const cookie_parser_1 = (0, tslib_1.__importDefault)(require("cookie-parser"));
const school_1 = require("./../../../../models/school"); // school 정보 조회 함수 필요
const router = (0, express_1.Router)();
router.use((0, cookie_parser_1.default)());
router.get('/mypage', async (req, res) => {
    try {
        const token = req.cookies.jwtToken;
        if (!token) {
            return res.status(401).json({
                status: { code: 401, message: "로그인이 필요합니다." }
            });
        }
        const decodedToken = (0, jwt_1.verifyToken)(token);
        const userEmail = decodedToken.email;
        // DB에서 유저 정보 조회
        const users = await (0, user_1.handleUserLogin)(userEmail);
        if (users.length === 0) {
            return res.status(404).json({
                status: { code: 404, message: "사용자를 찾을 수 없습니다." }
            });
        }
        // 학교 정보 조회
        const schoolInfos = await Promise.all([
            users[0].school1_id && (0, school_1.getSchoolInfo)(users[0].school1_id),
            users[0].school2_id && (0, school_1.getSchoolInfo)(users[0].school2_id),
            users[0].school3_id && (0, school_1.getSchoolInfo)(users[0].school3_id)
        ]);
        // 유저 정보 반환
        res.status(200).json({
            data: {
                user: {
                    email: users[0].user_email,
                    name: users[0].user_name,
                    birth_date: users[0].birth_date,
                    profile_path: users[0].profile_path,
                    chat_no: users[0].chat_no,
                    schools: schoolInfos.filter(school => school !== null)
                }
            },
            status: { code: 200, message: "사용자 정보 조회 성공" }
        });
    }
    catch (error) {
        res.status(403).json({
            status: { code: 403, message: "유효하지 않은 인증 정보입니다." }
        });
    }
});
exports.default = router;
//# sourceMappingURL=index.js.map