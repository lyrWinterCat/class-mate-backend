import { Router, Request, Response } from 'express';
import axios from 'axios';
import { User, handleUserLogin } from './../../../../models/user';
import client from './../../../../loaders/redis';
import { generateAccessToken, generateRefreshToken } from './../../../../loaders/jwt';
import cookieParser from 'cookie-parser';
require('dotenv').config();

const router = Router();
router.use(cookieParser());

router.post("/naverLogin", async (req: Request, res: Response) => {
  const clientId = process.env.NAVER_CLIENT_ID;
  const clientSecret = process.env.NAVER_CLIENT_SECRET;
  const naverCode = req.body.code;

  try {
    // 네이버 API에서 엑세스 토큰 가져오기
    const responseData = await axios.get(
      `https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id=${clientId}&client_secret=${clientSecret}&code=${naverCode}&state=test`
    );
    const accessToken = responseData.data.access_token;
    const refreshToken = responseData.data.refresh_token;

    // 프로필 정보 가져오기
    const profileResponse = await axios.get('https://openapi.naver.com/v1/nid/me', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Naver-Client-Id': clientId,
        'Naver-Client-Secret': clientSecret
      },
    });

    const profile = profileResponse.data.response;
    const userEmail = profile.email;

    // 로컬 DB에서 사용자 확인
    const users = await handleUserLogin(userEmail);

    // JWT 토큰 생성
    const jwtToken = generateAccessToken({ email: userEmail });
    const refreshJwt = generateRefreshToken({ email: userEmail });

    // Redis에 사용자 정보 저장 (7일 만료)
    await client.set(userEmail, JSON.stringify({
        naverAccessToken: accessToken,
        naverRefreshToken: refreshToken,
        profile: profile,
        refreshJwt: refreshJwt
      }), {
        EX: 7 * 24 * 60 * 60  // 7일
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
        data:{
            isSignup:false,
            email: userEmail,
            profile:profile
        },
        status:{
            code: 202,
            message:"Registration required, redirecting to signup"
        }
    });

  } catch (error) {
    console.error('Error during Naver login:', error);
    res.status(500).json({
      status: { 
        code: 500, 
        message: "Server error during login process" 
      }
    });
  }
});

export default router;
