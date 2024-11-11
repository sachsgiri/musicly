import { ConflictException, Inject, Injectable } from '@nestjs/common';
import type { AggregateID } from '@src/libs/ddd';
import { Err, Ok, type Option, type Result } from 'oxide.ts';
import { ARTIST_REPOSITORY, type ArtistRepositoryPort } from '../../database/artist.repository.port';
import { ArtistEntity } from '../../domain/artist.entity';
import { ArtistAlreadyExistsError } from '../../domain/artist.errors';
import type { CreateArtistRequestDto } from './create-artist.request.dto';

@Injectable()
export class CreateArtistService {
  constructor(
    @Inject(ARTIST_REPOSITORY)
    private readonly artistRepo: ArtistRepositoryPort,
  ) {}

  async create(message: CreateArtistRequestDto): Promise<Result<AggregateID, Error>> {
    const artist = ArtistEntity.create({
      name: message.name,
    });

    try {
      await this.artistRepo.transaction(async () => this.artistRepo.insert(artist));
      return Ok(artist.id);
    } catch (error: any) {
      if (error instanceof ConflictException) {
        return Err(new ArtistAlreadyExistsError(error));
      }
      throw error;
    }
  }

  async findOneByName(name: string): Promise<Option<ArtistEntity>> {
    return this.artistRepo.findOneByName(name);
  }
}
