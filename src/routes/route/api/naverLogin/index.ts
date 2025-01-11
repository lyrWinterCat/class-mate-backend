import { Router, Request, Response } from 'express';
import axios from 'axios';
import {User, mapRowToUser, handleUserLogin } from './../../../../models/user';
require('dotenv').config();
const router = Router();

router.post("/naverLogin", async (req: Request, res: Response) => {
  const clientId = process.env.NAVER_CLIENT_ID;
  const clientSecret = process.env.NAVER_CLIENT_SECRET;
  const naverCode = req.body.code;
  // const naverCode = 'JfiVqZ8eVQUzvNMa9R'
  console.log(naverCode);

  try {
    // 네이버 API에서 엑세스 토큰 가져오기
    const responseData = await axios.get(`https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id=${clientId}&client_secret=${clientSecret}&code=${naverCode}&state=test`);
    const accessToken = responseData.data.access_token; // 네이버로그인으로부터 받은 액세스 토큰
    const refreshToken = responseData.data.refresh_token; // 네이버로그인으로부터 받은 리프레시 토큰

    console.log(accessToken);
    console.log(refreshToken);

    //토큰 삭제 요청
    // const deleteToken = await axios.get('https://nid.naver.com/oauth2.0/token?grant_type=delete&client_id=4u8hcGhasnAClRSqoPm9&client_secret=EXJUoBOvzb&access_token=AAAAOLbFVtv5ezsyw3JyXY03VfRBjeOj36aTvVoqsewCqtehR5TGCVkE3hv1Cidd7hV3lDwKUoWMAFvQRdYpSFX5bgk&service_provider=NAVER')
    // console.log('accessToken delete');

    // 프로필 정보 가져오기
    const profileResponse = await axios.get('https://openapi.naver.com/v1/nid/me', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Naver-Client-Id': clientId,
        'Naver-Client-Secret': clientSecret
      },
    });

    const profile = profileResponse.data.response; // 프로필 정보
    console.log(profile);

    // 받아온 profile에서 email로 db 검색
    const userEmail = profile.email;
    const users = await handleUserLogin(userEmail);
    
    try {
      if (users.length === 0) {
        res.status(200).json({ 
          data: {
            profile: profile,
            refreshToken: refreshToken,
            redirect: "/signup",
            isSignup: false 
          },
          status: { code: 200, message: "get userInfo success, go to signup page" }
        });
      } else {
        res.status(200).json({ 
          data: {
            refreshToken: refreshToken,
            redirect: "/login-main",
            isSignup: true // 또는 필요한 값을 여기에 넣습니다.
          },
          status: { code: 200, message: "already signup, go to login-sucess page" }
        });
      }
    } catch (error) {
      res.status(500).send({ error: 'Internal Server Error' });
    }

  } catch (error) {
    res.status(500).send('Server error');
  }
});


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

export default router;  