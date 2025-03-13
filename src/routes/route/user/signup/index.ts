import { Router, Request, Response } from 'express';
//db 연결
import pool from '../../../../loaders/db'
import {User, insertUserInfo } from './../../../../models/user';
import {insertSchoolInfo, checkExistingSchool } from './../../../../models/school';
import client from '../../../../loaders/redis';
import { v4 as uuidv4 } from 'uuid';
import nodemailer from 'nodemailer';

require('dotenv').config();
const router = Router();

// 라우터 테스트
router.post("/test", async (req: Request, res: Response) => {
  try {
    res.status(200).send({ message: "user router is running!" });
  } catch (error) {
    res.status(404).send({ message: (error as Error).message });
  }
});

// DB 테스트
router.post("/dbConnect", async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query('SELECT * FROM user_info');
    res.json(rows);
  } catch (error) {
    console.error('Error executing query: ', error);
    res.status(500).send('Server error');
  }
});
export default router;

// 회원가입 페이지에서 프로필 요청
router.post("/profile", async (req: Request, res: Response) => {
  
});

// 회원가입 페이지에서 이메일 인증 요청

// 랜덤 인증 코드 생성 함수 (8자리 영문+숫자)
const generateVerificationCode = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
};

// Nodemailer 설정 (Gmail 사용)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Gmail 계정
    pass: process.env.EMAIL_PASS  // 앱 비밀번호
  }
});

// 이메일 전송 함수
const sendVerificationEmail = async (email: string, code: string) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: '이메일 인증 코드',
    text: `회원가입을 완료하려면 다음 인증 코드를 입력하세요: ${code}`
  };
  await transporter.sendMail(mailOptions);
};

router.post("/sendEmailCode", async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    return res.status(400).json({ message: '유효한 이메일을 입력하세요.' });
  }

  try {
    const verificationCode = generateVerificationCode();
    await sendVerificationEmail(email, verificationCode);

    // Redis에 이메일 인증 코드 저장 (10분 후 자동 만료)
    await client.setEx(`email_verification:${email}`, 600, verificationCode);

    res.status(200).json({ message: '인증 코드가 이메일로 전송되었습니다.' });
  } catch (error) {
    console.error('Email sending error:', error);
    res.status(500).json({ message: '이메일 전송 중 오류가 발생했습니다.' });
  }
});

router.post("/verifyEmailCode", async (req: Request, res: Response) => {
  const { email, code } = req.body;

  if (!email || !code) {
    return res.status(400).json({ message: '이메일과 인증 코드를 입력하세요.' });
  }

  try {
    const storedCode = await client.get(`email_verification:${email}`);

    if (!storedCode) {
      return res.status(400).json({ message: '인증 코드가 만료되었거나 존재하지 않습니다.' });
    }

    if (storedCode !== code) {
      return res.status(400).json({ message: '인증 코드가 올바르지 않습니다.' });
    }

    // 인증 성공 후 Redis에서 해당 코드 삭제
    await client.del(`email_verification:${email}`);

    res.status(200).json({ message: '이메일 인증 성공', verified: true });
  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }

});


// 회원가입 라우터
// front에서 schools 정보 배열로 묶어서 던져달라고 하기.
router.post("/signup", async (req: Request, res: Response) => {

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

  const { user_email, user_name, birth_date, 
    schools, // schools 배열을 통해 school1, school2, school3 정보를 수신
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
  } else {
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
      const schoolExists = await checkExistingSchool(id);

      // 학교 정보가 없다면 insertSchoolInfo 함수를 사용하여 추가
      if (!schoolExists) {
        await insertSchoolInfo({
          school_id: id,
          school_name: name,
          school_type: type,
        });
      }
      
      // 학교 ID를 배열에 추가
      schoolIds.push(id);
    }

    // 사용자 정보를 DB에 추가
    await insertUserInfo({
      user_email,
      user_name,
      birth_date,
      school1_id: schoolIds[0] || null, // 첫 번째 학교 ID 저장
      school2_id: schoolIds[1] || null, // 두 번째 학교 ID 저장
      school3_id: schoolIds[2] || null, // 세 번째 학교 ID 저장
      profile_path,
    } as User);

    // 성공 응답
    res.status(200).json({ message: "User registration successful" });
  } catch (error) {
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


