import { NextFunction, Request, Response } from 'express';
import hash from 'object-hash';
import { createClient, RedisClientType } from 'redis';
import zlib from 'zlib';

class RedisCache {
  private redisClient: RedisClientType | undefined;

  constructor() {
    this.initializeRedisClient();
  }

  private async initializeRedisClient(): Promise<void> {
    try {
      const redisUri = process.env.REDIS_URI;

      if (redisUri) {
        this.redisClient = createClient({
          url: redisUri,
        });

        this.redisClient.on('error', (error: Error) => {
          console.error('Redis client error:', error.message);
        });

        await this.redisClient.connect();
        console.log('🧱 Connected to Redis successfully!');
      } else {
        console.warn('🟡 Missing Redis URI configuration. Cannot initialize Redis client.');
      }
    } catch (error) {
      console.error('🟠 Failed to initialize Redis client:', error);
      await this.redisClient?.quit();
    }
  }

  private isRedisWorking(): boolean {
    return !!this.redisClient?.isOpen;
  }

  private requestToKey(req: Request): string {
    const reqDataToHash = {
      url: req.originalUrl,
      body: req.body,
    };
    return `${req.path}@${hash.sha1(reqDataToHash)}`;
  }

  public async writeData(
    key: string,
    data: string,
    options: { EX: number; NX: boolean },
    compress: boolean
  ): Promise<void> {
    if (this.isRedisWorking()) {
      let dataToCache = data;
      if (compress) {
        dataToCache = zlib.deflateSync(data).toString('base64');
      }

      try {
        // @ts-ignore
        await this.redisClient?.set(key, dataToCache, options);
      } catch (error) {
        console.error(`Failed to cache data for key=${key}:`, error);
      }
    }
  }

  public async readData(key: string, compressed: boolean): Promise<string | null> {
    if (!this.isRedisWorking()) return null;

    try {
      const cachedValue = await this.redisClient?.get(key);
      if (!cachedValue) {
        return null;
      }

      if (compressed) {
        return zlib.inflateSync(Buffer.from(cachedValue, 'base64')).toString();
      }

      return cachedValue;
    } catch (error) {
      console.error(`Failed to read data for key=${key}:`, error);
      return null;
    }
  }

  public cachingMiddleware(compression = true) {
    return async (req: Request, res: Response, next: NextFunction) => {
      if (this.isRedisWorking()) {
        const key = this.requestToKey(req);
        const expirationTime = parseInt(req.headers.ex as string, 10) || 60;

        const cachedValue = await this.readData(key, compression);

        if (cachedValue) {
          try {
            return res.json(JSON.parse(cachedValue));
          } catch {
            return res.send(cachedValue);
          }
        } else {
          const originalSend = res.send.bind(res);

          res.send = (data: any) => {
            if (res.statusCode.toString().startsWith('2')) {
              const options = { EX: expirationTime, NX: false };
              // Perform the caching asynchronously without affecting the response flow
              this.writeData(key, data, options, compression).catch((error) => {
                console.error('Error caching response:', error);
              });
            }

            // Send the response synchronously
            return originalSend(data);
          };
          next();
        }
      } else {
        next();
      }
    };
  }
}

export const redisCache = new RedisCache();
