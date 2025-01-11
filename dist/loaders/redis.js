"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = require("redis");
const client = (0, redis_1.createClient)({
    url: 'redis://localhost:6379'
});
client.on('connect', () => {
    console.log('Connected to Redis');
});
client.on('error', (error) => {
    console.error('Error connecting to Redis:', error);
});
// 비동기 함수 정의
const connectRedis = async () => {
    await client.connect();
};
// 비동기 함수 호출
connectRedis().catch(console.error);
exports.default = client;
// import redis, { RedisClientOptions } from 'redis';
// const client = redis.createClient({port: 6379, host: 'localhost'} as RedisClientOptions);
// client.on('connect', () => {
//     console.log('Connected to Redis');
// });
// client.on('error', (error) => {
//     console.error('Error connecting to Redis:', error);
// });
// export default client;
//# sourceMappingURL=redis.js.map