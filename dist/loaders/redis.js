"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const redis_1 = (0, tslib_1.__importDefault)(require("redis"));
const client = redis_1.default.createClient({ port: 6379, host: 'localhost' });
client.on('connect', () => {
    console.log('Connected to Redis');
});
client.on('error', (error) => {
    console.error('Error connecting to Redis:', error);
});
exports.default = client;
//# sourceMappingURL=redis.js.map