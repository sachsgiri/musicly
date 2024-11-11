import { type DynamicModule, Module, type Provider } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { cacheConfig } from '@src/configs/config';
import Redis from 'ioredis';
import { TopListCache } from './top-list-cache.provider';

@Module({})
export class TopListCacheModule {
  static register(provide: symbol, size: number, key: string): DynamicModule {
    const topListCacheProvider: Provider = {
      provide,
      useFactory: () => {
        const redisClient = new Redis({
          host: cacheConfig.host,
          port: cacheConfig.port,
        });
        return new TopListCache(redisClient, size, key);
      },
    };

    return {
      module: TopListCacheModule,
      providers: [topListCacheProvider],
      exports: [topListCacheProvider],
    };
  }
}
