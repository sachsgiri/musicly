import { Logger, Module, type Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { TopListCacheModule } from '../top-list-cache/top-list-cache.module';
import { CreateSongCommandHandler } from './commands/create-song/create-song.command.handler';
import { CreateSongHttpController } from './commands/create-song/create-song.http.controller';
import { CreateSongService } from './commands/create-song/create-song.service';
import { DecreaseLikeCountCommandHandler } from './commands/decrease-like-count';
import { DecreaseLikeCountOnSongLikedDomainEventHandler } from './commands/decrease-like-count/decrease-like-count-on-user-unliked-song-domain-event.handler';
import { IncreaseLikeCountCommandHandler } from './commands/increase-like-count';
import { IncreaseLikeCountOnSongLikedDomainEventHandler } from './commands/increase-like-count/increase-like-count-on-user-liked-song-domain-event.handler';
import { IncreasePlayCountCommandHandler } from './commands/increase-play-count';
import { IncreasePlayCountOnSongPlayedDomainEventHandler } from './commands/increase-play-count/increase-play-count-on-user-played-song-domain-event.handler';
import { SONG_ENTITY_DB_MODEL_MAPPER, SongEntityDbModelMapper } from './database/song.mapper';
import { SongRepository } from './database/song.repository';
import { SONG_REPOSITORY } from './database/song.repository.port';
import { SONG_ENTITY_RESPONSE_MAPPER, SongEntityResponseMapper } from './dtos/song.mapper';
import { FindMostPlayedSongsHttpController } from './queries/find-most-played-songs/find-most-played-songs.http.controller';
import { FindMostPlayedSongsQueryHandler } from './queries/find-most-played-songs/find-most-played-songs.query-handler';
import { TOP_100_LIKED_SONGS_CACHE, TOP_100_PLAYED_SONGS_CACHE, TOP_100_POPULAR_SONGS_CACHE } from './song.di-tokens';

const httpControllers = [CreateSongHttpController, FindMostPlayedSongsHttpController];

const commandHandlers: Provider[] = [
  IncreaseLikeCountCommandHandler,
  DecreaseLikeCountCommandHandler,
  CreateSongCommandHandler,
  IncreasePlayCountCommandHandler,
];

const queryHandlers: Provider[] = [FindMostPlayedSongsQueryHandler];

const domainEventHandlers: Provider[] = [
  IncreaseLikeCountOnSongLikedDomainEventHandler,
  DecreaseLikeCountOnSongLikedDomainEventHandler,
  IncreasePlayCountOnSongPlayedDomainEventHandler,
];

const mappers: Provider[] = [
  {
    provide: SONG_ENTITY_RESPONSE_MAPPER,
    useClass: SongEntityResponseMapper,
  },
  { provide: SONG_ENTITY_DB_MODEL_MAPPER, useClass: SongEntityDbModelMapper },
];

const repositories: Provider[] = [{ provide: SONG_REPOSITORY, useClass: SongRepository }];

@Module({
  imports: [
    CqrsModule,
    TopListCacheModule.register(TOP_100_LIKED_SONGS_CACHE, 10, 'top10LikedSongs'),
    TopListCacheModule.register(TOP_100_PLAYED_SONGS_CACHE, 10, 'top10PlayedSongs'),
    TopListCacheModule.register(TOP_100_POPULAR_SONGS_CACHE, 10, 'top10PopularSongs'),
  ],
  controllers: [...httpControllers],
  providers: [Logger, ...repositories, ...queryHandlers, ...commandHandlers, ...domainEventHandlers, ...mappers, CreateSongService],
  exports: [CreateSongService],
})
export class SongModule {}
