"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = (0, tslib_1.__importDefault)(require("express"));
const index_1 = (0, tslib_1.__importDefault)(require("./config/index"));
const index_2 = (0, tslib_1.__importDefault)(require("./loaders/index"));
const https_1 = (0, tslib_1.__importDefault)(require("https"));
const fs_1 = (0, tslib_1.__importDefault)(require("fs"));
const app = (0, express_1.default)();
(0, index_2.default)(app);
// SSL 인증서와 개인 키 로드
const sslOptions = {
    key: fs_1.default.readFileSync(index_1.default.ssl.keyPath),
    cert: fs_1.default.readFileSync(index_1.default.ssl.certPath), // 환경 변수에서 경로 가져오기
};
const server = https_1.default.createServer(sslOptions, app).listen(index_1.default.server_port, () => {
    console.log(`HTTPS Server listening on port: ${index_1.default.server_port}`);
}).on('error', (err) => {
    console.log(`${index_1.default.server_port} server error: ${err}`);
});
exports.default = { server };
// const server = app.listen(config.server_port,()=>{
//     console.log(`Server listening on port: ${config.server_port}`)
// }) .on('error', (err) => {
//     console.log(`${config.server_port} server error: ${err}`)
// })
//# sourceMappingURL=server.js.map