# 2024.06.12 swagger
npm install (swagger module 추가됨)
localhost:5000/api-docs 


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

> test db 생성 후 테스트 테이블

CREATE TABLE `test_table` (
  `user_name` varchar(200) DEFAULT NULL,
  `e_mail` varchar(500) NOT NULL,
  `password` varchar(500) DEFAULT NULL,
  `school_type` varchar(500) DEFAULT NULL,
  `school_name` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`e_mail`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

> 본인 설정값으로 .env 파일 DB 연결 세팅 바꿔주기

  / # MYSQL <br>
MYSQL_HOST = localhost <br>
MYSQL_USER = root <br>
MYSQL_PASSWORD = 1234 <br>
MYSQL_DATABASE = test <br>


> db 테스트 데이터 insert

INSERT INTO test.test_table
(user_name, e_mail, password, school_type, school_name)
VALUES('test1', 'test1@test.com', '12', '1', 'test');

INSERT INTO test.test_table
(user_name, e_mail, password, school_type, school_name)
VALUES('test2', 'test2@test.com', '123', '2', 'test');

INSERT INTO test.test_table
(user_name, e_mail, password, school_type, school_name)
VALUES('test3', 'test3@test.com', '1234', '3', 'test1');

INSERT INTO test.test_table
(user_name, e_mail, password, school_type, school_name)
VALUES('test4', 'test4@test.com', '12345', '1', 'test1');

## postman 테스트
> 기본 실행
- get / http://localhost:6000

> src/api/routes/user/signin에 대한 테스트 접속
- post / http://localhost:6000/user/signin

> DB 연결 테스트
- post / http://localhost:6000/user/test 
