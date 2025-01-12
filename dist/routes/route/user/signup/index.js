"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = require("express");
//db 연결
const db_1 = (0, tslib_1.__importDefault)(require("../../../../loaders/db"));
const user_1 = require("./../../../../models/user");
require('dotenv').config();
const router = (0, express_1.Router)();
// 라우터 테스트
router.post("/", async (req, res) => {
    try {
        res.status(200).send({ message: "user router is running!" });
    }
    catch (error) {
        res.status(404).send({ message: error.message });
    }
});
// DB 테스트
router.post("/dbConnect", async (req, res) => {
    try {
        const [rows] = await db_1.default.query('SELECT * FROM user_info');
        res.json(rows);
    }
    catch (error) {
        console.error('Error executing query: ', error);
        res.status(500).send('Server error');
    }
});
exports.default = router;
// 회원가입 페이지에서 프로필 요청
router.post("/profile", async (req, res) => {
});
// 회원가입 라우터
// front에서 schools 정보 배열로 묶어서 던져달라고 하기.
router.post("/signup", async (req, res) => {
    // 기존의 schoo1_id, schoo1_name, school1_type, school1_address 를 schools 배열로 묶어서 던져달라고 하기.
    // school1, 2, 3 정보 모두 그냥 배열로 묶어서.
    // 이런식으로 던져달라고 하기
    // {
    //   "data": {
    //     "user_email": "example@example.com",
    //     "user_name": "홍길동",
    //     "birth_date": "2000-01-01",
    //     "schools": [
    //       {
    //         "id": 1,
    //         "name": "서울초등학교",
    //         "type": "초등학교",
    //         "address": "서울특별시 강남구"
    //       },
    //       {
    //         "id": 2,
    //         "name": "부산중학교",
    //         "type": "중학교",
    //         "address": "부산광역시 해운대구"
    //       },
    //       {
    //         "id": 3,
    //         "name": "대구고등학교",
    //         "type": "고등학교",
    //         "address": "대구광역시 수성구"
    //       }
    //     ],
    //     "profile_path": "/path/to/profile/image.jpg"
    //   }
    // }
    const { user_email, user_name, birth_date, schools, // schools 배열을 통해 school1, school2, school3 정보를 수신
    profile_path } = req.body.data;
    // 요청 바디 검증
    const errors = [];
    if (!user_email || !/\S+@\S+\.\S+/.test(user_email)) {
        errors.push({ message: 'Invalid email format' });
    }
    if (!user_name) {
        errors.push({ message: 'Name is required' });
    }
    if (!birth_date || isNaN(Date.parse(birth_date))) {
        errors.push({ message: 'Invalid date format' });
    }
    // 학교 정보 검증
    if (!Array.isArray(schools) || schools.length === 0) {
        errors.push({ message: 'At least one school is required' });
    }
    else {
        schools.forEach((school, index) => {
            if (!school.id || typeof school.id !== 'number') {
                errors.push({ message: `School ID ${index + 1} is required` });
            }
            if (!school.name) {
                errors.push({ message: `School Name ${index + 1} is required` });
            }
            if (!school.type) {
                errors.push({ message: `School Type ${index + 1} is required` });
            }
            if (!school.address) {
                errors.push({ message: `School Address ${index + 1} is required` });
            }
        });
    }
    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }
    try {
        const schoolIds = []; // 학교 ID를 저장할 배열
        // 학교 정보 처리
        for (const school of schools) {
            const { id, name, type } = school;
            // 학교 정보가 DB에 존재하는지 확인
            const schoolExists = await (0, user_1.checkExistingSchool)(id);
            // 학교 정보가 없다면 insertSchoolInfo 함수를 사용하여 추가
            if (!schoolExists) {
                await (0, user_1.insertSchoolInfo)({
                    school_id: id,
                    school_name: name,
                    school_type: type,
                });
            }
            // 학교 ID를 배열에 추가
            schoolIds.push(id);
        }
        // 사용자 정보를 DB에 추가
        await (0, user_1.insertUserInfo)({
            user_email,
            user_name,
            birth_date,
            school1_id: schoolIds[0] || null,
            school2_id: schoolIds[1] || null,
            school3_id: schoolIds[2] || null,
            profile_path,
        });
        // 성공 응답
        res.status(200).json({ message: "User registration successful" });
    }
    catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
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
 *                school_id1:
 *                  type: string
 *                  example: 111
 *                school_type1:
 *                  type: string
 *                  example: 초등
 *                school_name1:
 *                  type: string
 *                  example: 친구초등학교
 *                school_id2:
 *                  type: string
 *                  example: 222
 *                school_type2:
 *                  type: string
 *                  example: 중
 *                school_name2:
 *                  type: string
 *                  example: 친구중학교
 *                school_id3:
 *                  type: string
 *                  example: 333
 *                school_type3:
 *                  type: string
 *                  example: 고
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
//# sourceMappingURL=index.js.map