const Redis = require('ioredis');

let publisher = null;
let subscriber = null;

const getPublisher = () => {
  if (!publisher) {
    const redisUrl = process.env.REDIS_URL || 'redis://127.0.0.1:6379';
    publisher = new Redis(redisUrl);
    publisher.on('error', (err) => console.error('Redis Publisher Error:', err.message));
    publisher.on('connect', () => console.log('Redis Publisher connected'));
  }
  return publisher;
};

const getSubscriber = () => {
  if (!subscriber) {
    const redisUrl = process.env.REDIS_URL || 'redis://127.0.0.1:6379';
    subscriber = new Redis(redisUrl);
    subscriber.on('error', (err) => console.error('Redis Subscriber Error:', err.message));
    subscriber.on('connect', () => console.log('Redis Subscriber connected'));
  }
  return subscriber;
};

const publish = async (channel, message) => {
  const pub = getPublisher();
  await pub.publish(channel, JSON.stringify(message));
};

const subscribe = (channel, callback) => {
  const sub = getSubscriber();
  sub.subscribe(channel, (err) => {
    if (err) console.error(`Failed to subscribe to ${channel}:`, err.message);
    else console.log(`Subscribed to channel: ${channel}`);
  });
  sub.on('message', (ch, message) => {
    if (ch === channel) {
      callback(JSON.parse(message));
    }
  });
};

module.exports = { publish, subscribe, getPublisher, getSubscriber };
