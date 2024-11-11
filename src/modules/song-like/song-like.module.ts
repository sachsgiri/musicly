import { Logger, Module, type Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { LikeSongCommandHandler } from './commands/like-song';
import { LikeSongHttpController } from './commands/like-song/like-song.http.controller';
import { SONG_LIKE_ENTITY_DB_MODEL_MAPPER, SongLikeEntityDbModelMapper } from './database/song-like.mapper';
import { SongLikeRepository } from './database/song-like.repository';

import { SONG_LIKE_REPOSITORY } from './database';
import { SONG_LIKE_ENTITY_RESPONSE_MAPPER, SongLikeEntityResponseMapper } from './dtos/song-like.mapper';

const httpControllers = [LikeSongHttpController];

const commandHandlers: Provider[] = [LikeSongCommandHandler];

const mappers: Provider[] = [
  {
    provide: SONG_LIKE_ENTITY_DB_MODEL_MAPPER,
    useClass: SongLikeEntityDbModelMapper,
  },
  {
    provide: SONG_LIKE_ENTITY_RESPONSE_MAPPER,
    useClass: SongLikeEntityResponseMapper,
  },
];

const repositories: Provider[] = [{ provide: SONG_LIKE_REPOSITORY, useClass: SongLikeRepository }];

@Module({
  imports: [CqrsModule],
  controllers: [...httpControllers],
  providers: [Logger, ...repositories, ...commandHandlers, ...mappers],
})
export class SongLikeModule {}
