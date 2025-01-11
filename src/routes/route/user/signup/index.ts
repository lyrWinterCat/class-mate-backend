import { Router, Request, Response } from 'express';
import axios from 'axios';
import {User, School, insertSchoolInfo, insertUserInfo, checkExistingSchool } from './../../../../models/user';
require('dotenv').config();
const router = Router();

//db test
import pool from '../../../../loaders/db'
import { RowDataPacket } from 'mysql2';
import { error } from 'console';


// 라우터 테스트
router.post("/", async (req: Request, res: Response) => {
  try {
    res.status(200).send({ message: "user router is running!" });
  } catch (error) {
    res.status(404).send({ message: (error as Error).message });
  }
});

// DB 테스트
router.post("/test", async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query('SELECT * FROM user_info');
    res.json(rows);
  } catch (error) {
    console.error('Error executing query: ', error);
    res.status(500).send('Server error');
  }
});
export default router;

// 회원가입 라우터
router.post("/signup", async (req: Request, res: Response) => {
  const { user_email, user_name, birth_date, 
    school1_id, school1_name, school1_type, school1_address, profile_path } = req.body.data; // school2, 3이 있을 경우 추가

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
  if (!school1_id || typeof school1_id !== 'number') {
    errors.push({ message: 'School ID 1 is required' });
  }
  if (!school1_name) {
    errors.push({ message: 'School Name 1 is required' });
  }
  if (!school1_type) {
    errors.push({ message: 'School Type 1 is required' });
  }
  if (!school1_address) {
    errors.push({ message: 'School Address 1 is required' });
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  try {
    // 학교 정보가 DB에 존재하는지 확인
    const schoolExists = await checkExistingSchool(school1_id);

    // 학교 정보가 없다면 insertSchoolInfo 함수를 사용하여 추가
    if (!schoolExists) {
      await insertSchoolInfo({
        school_id: school1_id,
        school_name: school1_name,
        school_type: school1_type,
      });
    }

    // 사용자 정보를 DB에 추가
    await insertUserInfo({
      user_email,
      user_name,
      birth_date,
      school1_id,
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


