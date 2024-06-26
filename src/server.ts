
import express from 'express'
import config from  './config/index'
import loaders from "./loaders/index";

const app:express.Application = express()
loaders(app)

const server = app.listen(config.server_port,()=>{
    console.log(`Server listening on port: ${config.server_port}`)
}) .on('error', (err) => {
    console.log(`${config.server_port} server error: ${err}`)
})
export default { server }

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