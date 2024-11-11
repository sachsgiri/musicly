import { Logger, Module, type Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { LikeArtistCommandHandler } from './commands/like-artist';
import { LikeArtistHttpController } from './commands/like-artist/like-artist.http.controller';
import { ARTIST_LIKE_REPOSITORY } from './database';
import { ARTIST_LIKE_ENTITY_DB_MODEL_MAPPER, ArtistLikeEntityDbModelMapper } from './database/artist-like.mapper';
import { ArtistLikeRepository } from './database/artist-like.repository';
import { ARTIST_LIKE_ENTITY_RESPONSE_MAPPER, ArtistLikeEntityResponseMapper } from './dtos/artist-like.mapper';

const httpControllers = [LikeArtistHttpController];

const commandHandlers: Provider[] = [LikeArtistCommandHandler];

const mappers: Provider[] = [
  {
    provide: ARTIST_LIKE_ENTITY_RESPONSE_MAPPER,
    useClass: ArtistLikeEntityResponseMapper,
  },
  {
    provide: ARTIST_LIKE_ENTITY_DB_MODEL_MAPPER,
    useClass: ArtistLikeEntityDbModelMapper,
  },
];

const repositories: Provider[] = [{ provide: ARTIST_LIKE_REPOSITORY, useClass: ArtistLikeRepository }];

@Module({
  imports: [CqrsModule],
  controllers: [...httpControllers],
  providers: [Logger, ...repositories, ...commandHandlers, ...mappers],
})
export class ArtistLikeModule {}
