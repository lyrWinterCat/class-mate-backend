"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = require("express");
const axios_1 = (0, tslib_1.__importDefault)(require("axios"));
const user_1 = require("./../../../../models/user");
const redis_1 = (0, tslib_1.__importDefault)(require("./../../../../loaders/redis"));
const jwt_1 = require("./../../../../loaders/jwt"); // JWT 생성 함수들
const cookie_parser_1 = (0, tslib_1.__importDefault)(require("cookie-parser")); // cookie-parser 임포트
require('dotenv').config();
const router = (0, express_1.Router)();
// cookie-parser 미들웨어 사용
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
        const userEmail = profile.email; // 사용자 이메일
        // 로컬 DB에서 사용자 확인
        const users = await (0, user_1.handleUserLogin)(userEmail);
        // JWT 생성
        const jwtToken = (0, jwt_1.generateAccessToken)({ email: userEmail }); // 사용자 이메일을 페이로드로 포함
        const refreshJwt = (0, jwt_1.generateRefreshToken)({ email: userEmail }); // 리프레시 토큰 생성
        // Redis에 네이버 토큰 및 사용자 정보 저장
        await redis_1.default.set(userEmail, JSON.stringify({
            naverAccessToken: accessToken,
            naverRefreshToken: refreshToken,
            profile: profile,
            refreshJwt: refreshJwt // 생성한 리프레시 JWT를 저장
        }));
        console.log(`Stored tokens for ${userEmail} in Redis.`);
        // JWT를 쿠키에 설정
        res.cookie('jwtToken', jwtToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 15 * 60 * 1000 // 쿠키 유효 시간 (15분)
        });
        if (users.length === 0) {
            // 등록되지 않은 회원
            res.status(200).json({
                data: {
                    isSignup: false
                },
                status: { code: 200, message: "User not registered, redirecting to signup" }
            });
        }
        else {
            // 등록된 회원
            res.status(200).json({
                data: {
                    isSignup: true
                },
                status: { code: 200, message: "User registered, redirecting to login" }
            });
        }
    }
    catch (error) {
        console.error('Error during Naver login:', error);
        res.status(500).send('Server error');
    }
});
exports.default = router;
/**
 * @swagger
 *  paths:
 *  /api/naverLogin:
 *    get:
 *      tags: [User]
 *      summary:  "Sends the Naver code to get refresh tokens, tokenId, user information."
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                naverCode:
 *                 type: string
 *                 example: "ThisIsNaverCodeExample"
 *      responses:
 *        200:
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  data:
 *                    type: object
 *                    properties:
 *                      tokenId:
 *                        type: string
 *                        example: "YOUR_TOKEN_ID_AAA_123BCD_efg456_test"
 *                      refreshToken:
 *                        type: string
 *                        example: "YOUR_REFRESH_TOKEN_this123test456refresh"
 *                      userEmail:
 *                        type: string
 *                        example: "yelim527@classmate.com"
 *                      userBirthDay:
 *                        type: string
 *                        example: "05-27"
 *                      userBirthYear:
 *                         type: string
 *                         example: "1995"
 *                  status:
 *                    type: object
 *                    properties:
 *                      code:
 *                        type: integer
 *                        example: 200
 *                      message:
 *                        type: string
 *                        example: "get user Info success"
 *                  meta:
 *                    type: object
 *                    properties:
 *                      redirect:
 *                        type: string
 *                        example: "/signup"
 *
 */
//# sourceMappingURL=index.js.map