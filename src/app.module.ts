import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { CqrsModule } from '@nestjs/cqrs';
import { EventEmitterModule } from '@nestjs/event-emitter';
import * as Joi from 'joi';
import { RequestContextModule } from 'nestjs-request-context';
import { SlonikModule } from 'nestjs-slonik';

import { ExceptionInterceptor } from '@libs/application/interceptors/exception.interceptor';
import { BullModule } from '@nestjs/bullmq';
import { ContextInterceptor } from './libs/application/context/ContextInterceptor';
import { ArtistLikeModule } from './modules/artist-like/artist-like.module';
import { ArtistModule } from './modules/artist/artist.module';
import { AuthModule } from './modules/auth';
import { PlaybackModule } from './modules/playback/playback.module';
import { SeederModule } from './modules/seeder/seeder.module';
import { SongLikeModule } from './modules/song-like/song-like.module';
import { SongModule } from './modules/song/song.module';

const interceptors = [
  {
    provide: APP_INTERCEPTOR,
    useClass: ContextInterceptor,
  },
  {
    provide: APP_INTERCEPTOR,
    useClass: ExceptionInterceptor,
  },
];

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validationSchema: Joi.object({
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_NAME: Joi.string().required(),
        REDIS_HOST: Joi.string().required(),
        REDIS_PORT: Joi.number().required(),
      }),
    }),
    EventEmitterModule.forRoot(),
    RequestContextModule,
    SlonikModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        connectionUri: `postgres://${configService.get<string>('DB_USERNAME')}:${configService.get<string>('DB_PASSWORD')}@${configService.get<string>('DB_HOST')}:${configService.get<string>('DB_PORT')}/${configService.get<string>('DB_NAME')}`,
      }),
    }),
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        connection: {
          host: configService.get<string>('REDIS_HOST'),
          port: configService.get<number>('REDIS_PORT'),
        },
      }),
    }),
    CqrsModule,
    // Modules
    AuthModule,
    ArtistModule,
    PlaybackModule,
    SongLikeModule,
    SongModule,
    SeederModule,
    ArtistLikeModule,
    //UserModule,
  ],
  controllers: [],
  providers: [...interceptors],
})
export class AppModule {}
