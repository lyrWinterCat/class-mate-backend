import {config} from 'dotenv'
import path from "path";

// const env_dir = `../env/.env.${process.env.NODE_ENV || 'development'}`
// config({path: path.join(__dirname,env_dir)})
const envPath = path.join(__dirname, '../../src/env/.env');
const result = config({ path: envPath });

if (result.error) {
    throw result.error;
  }

export default {
    //서버포트
    server_port: process.env.PORT!,
    //Log winston level
    logs:{
        level:process.env.LOG_LEVEL || 'silly'  as string,
    },
    // api 라우터 경로
    api: {
        prefix: '/'  as string,
    },
    // jwt secret
    jwt_secret: process.env.JWT_SECRET as string,
    mysql_config:{
        HOST:process.env.MYSQL_HOST  as string,
        USER:process.env.MYSQL_USER  as string,
        PASSWORD:process.env.MYSQL_PASSWORD  as string,
        dialect:'mysql',
        DB:process.env.MYSQL_DATABASE  as string,
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        },
        logging:process.env.MYSQL_LOGGING
    },

}
