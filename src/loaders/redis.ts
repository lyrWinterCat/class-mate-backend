import redis, { RedisClientOptions } from 'redis';

const client = redis.createClient({port: 6379, host: 'localhost'} as RedisClientOptions);

client.on('connect', () => {
    console.log('Connected to Redis');
});

client.on('error', (error) => {
    console.error('Error connecting to Redis:', error);
});

export default client;