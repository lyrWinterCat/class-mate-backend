"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = require("express");
const axios_1 = (0, tslib_1.__importDefault)(require("axios"));
const user_1 = require("./../../../../models/user");
const redis_1 = (0, tslib_1.__importDefault)(require("./../../../../loaders/redis"));
const jwt_1 = require("./../../../../loaders/jwt");
const cookie_parser_1 = (0, tslib_1.__importDefault)(require("cookie-parser"));
require('dotenv').config();
const router = (0, express_1.Router)();
router.use((0, cookie_parser_1.default)());
router.post("/naverLogin", async (req, res) => {
    const clientId = process.env.NAVER_CLIENT_ID;
    const clientSecret = process.env.NAVER_CLIENT_SECRET;
    const naverCode = req.body.code;
    try {
        // 네이버 API에서 엑세스 토큰 가져오기
        const responseData = await axios_1.default.get(`https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id=${clientId}&client_secret=${clientSecret}&code=${naverCode}&state=test`);
        const accessToken = responseData.data.access_token;
        const refreshToken = responseData.data.refresh_token;
        // 프로필 정보 가져오기
        const profileResponse = await axios_1.default.get('https://openapi.naver.com/v1/nid/me', {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Naver-Client-Id': clientId,
                'Naver-Client-Secret': clientSecret
            },
        });
        const profile = profileResponse.data.response;
        const userEmail = profile.email;
        // 로컬 DB에서 사용자 확인
        const users = await (0, user_1.handleUserLogin)(userEmail);
        // JWT 토큰 생성
        const jwtToken = (0, jwt_1.generateAccessToken)({ email: userEmail });
        const refreshJwt = (0, jwt_1.generateRefreshToken)({ email: userEmail });
        // Redis에 사용자 정보 저장 (7일 만료)
        await redis_1.default.set(userEmail, JSON.stringify({
            naverAccessToken: accessToken,
            naverRefreshToken: refreshToken,
            profile: profile,
            refreshJwt: refreshJwt
        }), {
            EX: 7 * 24 * 60 * 60 // 7일
        });
        // JWT 액세스 토큰을 쿠키에 설정
        res.cookie('jwtToken', jwtToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 15 * 60 * 1000 // 15분
        });
        // 리프레시 토큰을 쿠키에 설정
        res.cookie('refreshToken', refreshJwt, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7일
        });
        // 응답 전송
        res.status(200).json({
            data: {
                isSignup: true,
                email: userEmail,
                profile: profile
            },
            status: {
                code: 200,
                message: "Login successful, redirecting to main"
            }
        });
        res.status(202).json({
            data: {
                isSignup: false,
                email: userEmail,
                profile: profile
            },
            status: {
                code: 202,
                message: "Registration required, redirecting to signup"
            }
        });
    }
    catch (error) {
        console.error('Error during Naver login:', error);
        res.status(500).json({
            status: {
                code: 500,
                message: "Server error during login process"
            }
        });
    }
});
exports.default = router;
//# sourceMappingURL=index_fixing.js.map