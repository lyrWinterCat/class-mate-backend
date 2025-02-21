
import express from 'express'
import config from  './config/index'
import loaders from "./loaders/index";
import https from 'https';
import fs from 'fs';

const app:express.Application = express()
loaders(app)

// SSL 인증서와 개인 키 로드
const sslOptions = {
    key: fs.readFileSync(config.ssl.keyPath), // 환경 변수에서 경로 가져오기
    cert: fs.readFileSync(config.ssl.certPath), // 환경 변수에서 경로 가져오기
};

//https 서버
const server = https.createServer(sslOptions, app).listen(config.server_port, () => {
    console.log(`HTTPS Server listening on port: ${config.server_port}`);
}).on('error', (err) => {
    console.log(`${config.server_port} server error: ${err}`);
});


//http 서버
// const server = app.listen(config.server_port,()=>{
//     console.log(`Server listening on port: ${config.server_port}`)
// }) .on('error', (err) => {
//     console.log(`${config.server_port} server error: ${err}`)
// })

export default { server }


