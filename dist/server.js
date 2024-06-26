"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = (0, tslib_1.__importDefault)(require("express"));
const index_1 = (0, tslib_1.__importDefault)(require("./config/index"));
const index_2 = (0, tslib_1.__importDefault)(require("./loaders/index"));
const app = (0, express_1.default)();
(0, index_2.default)(app);
const server = app.listen(index_1.default.server_port, () => {
    console.log(`Server listening on port: ${index_1.default.server_port}`);
}).on('error', (err) => {
    console.log(`${index_1.default.server_port} server error: ${err}`);
});
exports.default = { server };
// import express, { Request, Response, NextFunction } from 'express';
// import cors from 'cors';
// const app:express.Application = express();
// app.use(cors()); 
// //특정 서버만 허용하기
// /*app.use(cors({
//     origin: ['http://localhost:3000', 'http://example.com']
// }));
// */
// const port = 6000;
// interface Data{
//     id:number;
//     name:string;
// }
// const Send:Data = {
//     id:0,
//     name:'test'
// }
// app.get("/", (req: Request, res: Response) => {
//     res.status(200).json({
//         success: true,
//         data:Send
//     })
// });
// app.listen(port, () => {
//     console.log(`Server is running on port ${port}`);
//   });
//# sourceMappingURL=server.js.map