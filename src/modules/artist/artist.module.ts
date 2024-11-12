import { Logger, Module, type Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { TopListCacheModule } from '../top-list-cache/top-list-cache.module';
import { TOP_100_LIKED_ARTISTS_CACHE, TOP_100_POPULAR_ARTISTS_CACHE } from './artist.di-tokens';
import { CreateArtistCommandHandler } from './commands/create-artist/create-artist.command.handler';
import { CreateArtistHttpController } from './commands/create-artist/create-artist.http.controller';
import { CreateArtistService } from './commands/create-artist/create-artist.service';
import { DecreaseLikeCountCommandHandler } from './commands/decrease-like-count';
import { DecreaseLikeCountOnArtistLikedDomainEventHandler } from './commands/decrease-like-count/decrease-like-count-on-user-unliked-artist-domain-event.handler';
import { DecreaseSongLikeCountCommandHandler } from './commands/decrease-song-like-count/decrease-like-count.command.handler';
import { IncreaseLikeCountCommandHandler } from './commands/increase-like-count';
import { IncreaseLikeCountOnArtistLikedDomainEventHandler } from './commands/increase-like-count/increase-like-count-on-user-liked-artist-domain-event.handler';
import { IncreaseSongLikeCountCommandHandler } from './commands/increase-song-like-count/increase-like-count.command.handler';
import { ARTIST_ENTITY_DB_MODEL_MAPPER, ArtistEntityDbModelMapper } from './database/artist.mapper';
import { ArtistRepository } from './database/artist.repository';
import { ARTIST_REPOSITORY } from './database/artist.repository.port';
import { ARTIST_ENTITY_RESPONSE_MAPPER, ArtistEntityResponseMapper } from './dtos/artist.mapper';
import { FindMostLikedArtistsHttpController } from './queries/find-most-liked-artists/find-most-liked-artists.http.controller';
import { FindMostLikedArtistsQueryHandler } from './queries/find-most-liked-artists/find-most-liked-artists.query-handler';
import { FindMostPopularArtistsHttpController } from './queries/find-most-popular-artists/find-most-popular-artists.http.controller';
import { FindMostPopularArtistsQueryHandler } from './queries/find-most-popular-artists/find-most-popular-artists.query-handler';

const httpControllers = [CreateArtistHttpController, FindMostLikedArtistsHttpController, FindMostPopularArtistsHttpController];

const domainEventHandlers: Provider[] = [
  IncreaseLikeCountOnArtistLikedDomainEventHandler,
  DecreaseLikeCountOnArtistLikedDomainEventHandler,
];

const commandHandlers: Provider[] = [
  CreateArtistCommandHandler,
  IncreaseLikeCountCommandHandler,
  DecreaseLikeCountCommandHandler,
  IncreaseSongLikeCountCommandHandler,
  DecreaseSongLikeCountCommandHandler,
];

const queryHandlers: Provider[] = [FindMostLikedArtistsQueryHandler, FindMostPopularArtistsQueryHandler];

const mappers: Provider[] = [
  {
    provide: ARTIST_ENTITY_DB_MODEL_MAPPER,
    useClass: ArtistEntityDbModelMapper,
  },
  {
    provide: ARTIST_ENTITY_RESPONSE_MAPPER,
    useClass: ArtistEntityResponseMapper,
  },
];

const repositories: Provider[] = [{ provide: ARTIST_REPOSITORY, useClass: ArtistRepository }];

@Module({
  imports: [
    CqrsModule,
    TopListCacheModule.register(TOP_100_LIKED_ARTISTS_CACHE, 100, 'top100LikedArtists'),
    TopListCacheModule.register(TOP_100_POPULAR_ARTISTS_CACHE, 100, 'top100PopularArtists'),
  ],
  controllers: [...httpControllers],
  providers: [Logger, ...repositories, ...domainEventHandlers, ...queryHandlers, ...commandHandlers, ...mappers, CreateArtistService],
  exports: [CreateArtistService],
})
export class ArtistModule {}
