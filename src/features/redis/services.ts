import { createClient, RedisClientType, SetOptions } from 'redis';
import hash from 'object-hash';
import zlib from 'zlib';
import { Request, Response, NextFunction, RequestHandler } from 'express';

let redisClient: RedisClientType | undefined;

// Redis initialization
export async function initializeRedisClient(): Promise<void> {
  const redisUrl = process.env['REDIS_URL'];
  if (!redisUrl) {
    console.warn('Redis: REDIS_URL not set — running without cache.');
    return;
  }

  redisClient = createClient({
    url: redisUrl,
    socket: {
      // How long to wait for the initial TCP handshake
      connectTimeout: 10_000,

      // Exponential backoff: 200 ms → 400 → 800 → … capped at 30 s.
      // After 10 failed attempts the client stops retrying and the app
      // continues to run without the cache.
      reconnectStrategy: (retries: number) => {
        if (retries >= 10) {
          console.error('⛔  Redis: max reconnect attempts reached — running without cache.');
          return new Error('Redis max reconnect attempts reached');
        }
        const delay = Math.min(200 * 2 ** retries, 30_000);
        console.warn(`🔄  Redis: reconnect attempt ${retries + 1} in ${delay}ms`);
        return delay;
      },

      // Send TCP keepalives every 10 s so dead connections are detected quickly
      keepAlive: 10_000,

      // Disable Nagle's algorithm for lower command latency
      noDelay: true,
    },
  }) as RedisClientType;

  redisClient.on('error', (err: Error) => console.error('Redis error:', err.message));
  redisClient.on('reconnecting', () => console.warn('Redis: reconnecting…'));
  // redisClient.on('ready', () => console.log('Redis: ready'));

  try {
    await redisClient.connect();
    console.log('🗂️  Redis connected successfully');
  } catch (err) {
    console.error(
      '🚫  Redis: failed to connect —',
      (err as Error).message,
      '— running without cache.'
    );
    // Discard the broken client so isRedisWorking() returns false and all
    // cache operations are skipped cleanly until the server is restarted.
    redisClient = undefined;
  }
}

// Helpers
function isRedisWorking(): boolean {
  return !!redisClient?.isOpen;
}

function requestToKey(req: Request): string {
  const reqDataToHash = { url: req.originalUrl, body: req.body as unknown };
  return `${req.path}@${hash.sha1(reqDataToHash)}`;
}

// Core read / write with 3 s timeouts so a slow Redis never hangs a request
export async function writeData(
  key: string,
  data: string,
  options: SetOptions,
  compress: boolean
): Promise<void> {
  if (!isRedisWorking()) return;

  const dataToCache = compress ? zlib.deflateSync(data).toString('base64') : data;

  try {
    const timeout = new Promise<void>((_, reject) =>
      setTimeout(() => reject(new Error('Redis write timeout')), 3_000)
    );
    await Promise.race([
      redisClient!.set(key, dataToCache, options).then(() => undefined),
      timeout,
    ]);
  } catch (e) {
    console.error(`Redis writeData failed for key=${key}:`, (e as Error).message);
  }
}

export async function readData(key: string, compressed = false): Promise<string | undefined> {
  if (!isRedisWorking()) return undefined;

  try {
    const timeout = new Promise<null>((_, reject) =>
      setTimeout(() => reject(new Error('Redis read timeout')), 3_000)
    );
    const cachedValue = await Promise.race([redisClient!.get(key), timeout]);
    if (!cachedValue) return undefined;

    if (compressed) {
      return zlib.inflateSync(Buffer.from(cachedValue, 'base64')).toString();
    }
    return cachedValue;
  } catch (e) {
    console.error(`Redis readData failed for key=${key}:`, (e as Error).message);
    return undefined;
  }
}

// HTTP caching middleware
export function redisCachingMiddleware(compression = true): RequestHandler {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (!isRedisWorking()) {
      next();
      return;
    }

    const generatedKey = requestToKey(req);
    const key = (process.env['REDIS_KEY_PREFIX'] ?? '') + generatedKey;
    const expirationTime = Number(req.headers['ex']) || 5;

    const cachedValue = await readData(key, compression);
    if (cachedValue) {
      try {
        res.json(JSON.parse(cachedValue));
      } catch {
        res.send(cachedValue);
      }
      return;
    }

    const originalSend = res.send.bind(res) as typeof res.send;

    res.send = function (data: Parameters<typeof res.send>[0]) {
      res.send = originalSend;
      if (res.statusCode.toString().startsWith('2')) {
        void writeData(key, data as string, { EX: expirationTime }, compression);
      }
      return originalSend(data);
    };

    next();
  };
}

// Redis management utilities
export async function allRedisKeys(): Promise<string[]> {
  if (!isRedisWorking()) return [];
  return redisClient!.keys('*');
}

export async function deleteAllRedisKeys(): Promise<void> {
  if (!isRedisWorking()) return;
  await redisClient!.flushAll();
}

export async function getRedisServerInfo(): Promise<string> {
  if (!isRedisWorking()) return 'Redis not connected';
  return redisClient!.info();
}
