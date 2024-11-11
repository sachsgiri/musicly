import { Logger, Module, type Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { PlaySongCommandHandler } from './commands/play-song';
import { PlaySongHttpController } from './commands/play-song/play-song.http.controller';
import { PLAYBACK_REPOSITORY } from './database';
import { PLAYBACK_ENTITY_DB_MODEL_MAPPER, PlaybackEntityDbModelMapper } from './database/playback.mapper';
import { PlaybackRepository } from './database/playback.repository';
import { PLAYBACK_ENTITY_RESPONSE_MAPPER, PlaybackEntityResponseMapper } from './dtos/playback.mapper';

const httpControllers = [PlaySongHttpController];

const commandHandlers: Provider[] = [PlaySongCommandHandler];

const mappers: Provider[] = [
  {
    provide: PLAYBACK_ENTITY_DB_MODEL_MAPPER,
    useClass: PlaybackEntityDbModelMapper,
  },
  {
    provide: PLAYBACK_ENTITY_RESPONSE_MAPPER,
    useClass: PlaybackEntityResponseMapper,
  },
];

const repositories: Provider[] = [{ provide: PLAYBACK_REPOSITORY, useClass: PlaybackRepository }];

@Module({
  imports: [CqrsModule],
  controllers: [...httpControllers],
  providers: [Logger, ...repositories, ...commandHandlers, ...mappers],
})
export class PlaybackModule {}
