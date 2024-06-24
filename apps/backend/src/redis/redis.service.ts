import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly redis: Redis;
  private readonly logger = new Logger(RedisService.name);
  private readonly DEFAULT_TTL = 300; // 5 minutes

  constructor(private config: ConfigService) {
    this.redis = new Redis(config.get<string>('REDIS_URL', 'redis://localhost:6379'), {
      lazyConnect: true,
      retryStrategy: (times) => {
        if (times > 3) {
          this.logger.warn('Redis connection failed, operating without cache');
          return null;
        }
        return Math.min(times * 200, 2000);
      },
    });

    this.redis.on('connect', () => this.logger.log('Redis connected'));
    this.redis.on('error', (err) => this.logger.warn(`Redis error: ${err.message}`));
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await this.redis.get(key);
      return value ? JSON.parse(value) : null;
    } catch {
      return null;
    }
  }

  async set(key: string, value: unknown, ttl = this.DEFAULT_TTL): Promise<void> {
    try {
      await this.redis.set(key, JSON.stringify(value), 'EX', ttl);
    } catch {
      // Silently fail if Redis is unavailable
    }
  }

  async del(key: string): Promise<void> {
    try {
      await this.redis.del(key);
    } catch {
      // Silently fail
    }
  }

  async delPattern(pattern: string): Promise<void> {
    try {
      const keys = await this.redis.keys(pattern);
      if (keys.length > 0) {
        await this.redis.del(...keys);
      }
    } catch {
      // Silently fail
    }
  }

  async onModuleDestroy() {
    await this.redis.quit();
  }
}
