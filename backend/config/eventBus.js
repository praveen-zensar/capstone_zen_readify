import Redis from 'ioredis';
import { createServiceLogger } from './logger.js';

let publisher = null;
let subscriber = null;
const channelHandlers = new Map();
let subscriberMessageListenerAttached = false;
const log = createServiceLogger('event-bus');

const getPublisher = () => {
  if (!publisher) {
    const redisUrl = process.env.REDIS_URL || 'redis://127.0.0.1:6379';
    publisher = new Redis(redisUrl);
    publisher.on('error', (err) => log.error('Redis Publisher Error', { error: err.message }));
    publisher.on('connect', () => log.info('Redis Publisher connected'));
  }
  return publisher;
};

const getSubscriber = () => {
  if (!subscriber) {
    const redisUrl = process.env.REDIS_URL || 'redis://127.0.0.1:6379';
    subscriber = new Redis(redisUrl);
    subscriber.on('error', (err) => log.error('Redis Subscriber Error', { error: err.message }));
    subscriber.on('connect', () => log.info('Redis Subscriber connected'));

    if (!subscriberMessageListenerAttached) {
      subscriber.on('message', (ch, message) => {
        const handlers = channelHandlers.get(ch) || [];
        if (!handlers.length) return;

        try {
          const payload = JSON.parse(message);
          handlers.forEach((handler) => handler(payload));
        } catch (err) {
          log.error('Failed to parse event payload', { channel: ch, error: err.message });
        }
      });
      subscriberMessageListenerAttached = true;
    }
  }
  return subscriber;
};

const publish = async (channel, message) => {
  const pub = getPublisher();
  await pub.publish(channel, JSON.stringify(message));
};

const subscribe = (channel, callback) => {
  const sub = getSubscriber();
  const existingHandlers = channelHandlers.get(channel) || [];
  channelHandlers.set(channel, [...existingHandlers, callback]);

  if (existingHandlers.length > 0) return;

  sub.subscribe(channel, (err) => {
    if (err) log.error('Failed to subscribe channel', { channel, error: err.message });
    else log.info('Subscribed to channel', { channel });
  });
};

export { publish, subscribe, getPublisher, getSubscriber };
