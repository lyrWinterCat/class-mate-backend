# 깃 커밋 테스트
원격 깃 커밋 테스트입니다

# 2024.12.04
라우터 공사했습니다.
기존의 GET:http://localhost:5000/user/naverLogin 은 
> GET : http://localhost:5000/api/naverLogin
으로 이사했습니다.

* signup 라우터가 새롭게 만들어졌어요!
POST : http://localhost:5000/user/signup
입니다. 
참고 라우터는 /src/routes/route/user/signup/index.ts 입니다.
일단 req.body.data 에서 데이터 받아오는건데... 이건 오늘 얘기해보죠

* DB 테이블 생성 수정했습니다. DB 세팅 부분 다시 봐주시고, 
테이블 만들어주세요.
예시 데이터 쿼리문도 같이 넣어놨습니다. 디비 연결 테스트 시 참고해주세요.

# 2024.06.12 swagger
npm install (swagger module 추가됨)
localhost:5000/api-docs 

## 네이버 로그인 api 명세 코드 위치 
/src/routes/route/api/naverLogin/index.ts
front server 실행 - 네이버로그인 버튼 클릭 - session storage의 naverUserCode를 const naverCode에 붙여넣기 - backend 코드 실행 - postman의 GET:http://localhost:5000/api/naverLogin 실행

> 결과로 네이버 로그인 프로필 결과가 뜬다면 당신은 최고입니다 ㅇㅅㅇb


# 프로젝트 세팅
> 프로젝트 설치
- npm install
- npx tsc 

> 프로젝트 실행 시 터미널 2개
- npm run watch
- node dist/server.js

>  프로젝트 구조 
- api : router(api/user) / middleware 
- config : .env 파일값 세팅
- controller : router, services 모델 컨트롤러 (사용 고민중..)
- env : .env 설정값 입력
- interface : 타입 인터페이스, DTO (사용 고민중)
- loaders : express, mysql, loggers, 등 모듈 연결 
- models : 데이터베이스 모델
- services : 데이터베이스 모델 관련 서비스로직
- utils : 유틸 함수 관련

## DB 세팅
- mysql 다운로드 (8.0.37)
- dbeaver 다운로드

> test db 생성 후 생성해야 할 테이블

CREATE TABLE school_info (
    school_id INT PRIMARY KEY,
    school_name VARCHAR(100) NOT NULL,
    school_type VARCHAR(50) NOT NULL
);

CREATE TABLE user_info (
    user_email VARCHAR(100) PRIMARY KEY,
    user_name VARCHAR(50) NOT NULL,
    birth_date DATE NOT NULL,
    school1_id INT,
    school2_id INT,
    school3_id INT,
    profile_path VARCHAR(255),
    chat_no INT,
    FOREIGN KEY (school1_id) REFERENCES school_info(school_id),
    FOREIGN KEY (school2_id) REFERENCES school_info(school_id),
    FOREIGN KEY (school3_id) REFERENCES school_info(school_id)
);

INSERT INTO school_info (school_id, school_name, school_type) VALUES
(1, '친구초등학교', '초등학교'),
(2, '행복중학교', '중학교'),
(3, '미래고등학교', '고등학교'),
(4, '늘푸른초등학교', '초등학교'),
(5, '꿈나무중학교', '중학교');

INSERT INTO user_info (user_email, user_name, birth_date, school1_id, school2_id, school3_id, profile_path, chat_no) VALUES
('user1@example.com', '김철수', '2005-03-15', 1, NULL, NULL, '/profiles/user1.jpg', 1001),
('user2@example.com', '이영희', '2004-07-22', 2, 3, NULL, '/profiles/user2.jpg', 1002),
('user3@example.com', '박민수', '2006-09-10', 1, NULL, NULL, '/profiles/user3.jpg', 1003),
('user4@example.com', '정하나', '2003-12-05', 4, 5, NULL, '/profiles/user4.jpg', 1004),
('user5@example.com', '최지현', '2005-05-18', 3, NULL, NULL, '/profiles/user5.jpg', 1005);



> 본인 설정값으로 .env 파일 DB 연결 세팅 바꿔주기

  / # MYSQL <br>
MYSQL_HOST = localhost <br>
MYSQL_USER = root <br>
MYSQL_PASSWORD = 1234 <br>
MYSQL_DATABASE = test <br>


## postman 테스트
> 기본 실행
- get / http://localhost:5000

> src/api/routes/user/signin에 대한 테스트 접속
- post / http://localhost:5000/user/signin

> DB 연결 테스트
- post / http://localhost:5000/user/test 
