import { Router, Request, Response } from 'express';
import axios from 'axios';

//db test
import pool from '../../../../loaders/db'
const router = Router();

router.get("/naverLoginTest", async (req: Request, res: Response) => {
  try {
    const accessToken = req.headers.authorization; // 네이버로그인으로부터 받은 액세스 토큰
    const profileResponse = await axios.get('https://openapi.naver.com/v1/nid/me', {
      headers: { 'Authorization': `Bearer ${accessToken}` },
    });

    const profile = profileResponse.data.response; // 프로필 정보
    const email = profile.email; 
    const name = profile.name; 
    const gender = profile.gender;
    const age = profile.age;
    const birthday = profile.birthday;
    const birthyear = profile.birthyear;

    res.status(200).json({
      status: 200,
      message: "get naver Login successfully",
      data: email, name, gender, age, birthday, birthyear
    });
  } catch (error) {
    res.status(500).send({ message: (error as Error).message });
  }
},


router.post("/signup", async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    res.status(200).json({
        status: 200,
        message: "login success",
      });
    
  } catch (error) {
    res.status(404).send({ message: (error as Error).message });
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
router.post("/test", async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query('SELECT * FROM test_table');
    res.json(rows);
  } catch (error) {
    console.error('Error executing query: ', error);
    res.status(500).send('Server error');
  }
});
export default router;