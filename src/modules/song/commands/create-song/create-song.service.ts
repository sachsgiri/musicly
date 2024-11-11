import { ConflictException, Inject, Injectable } from '@nestjs/common';
import type { AggregateID } from '@src/libs/ddd';
import { Err, Ok, type Option, type Result } from 'oxide.ts';
import { UniqueIntegrityConstraintViolationError } from 'slonik';
import { SONG_REPOSITORY, type SongRepositoryPort } from '../../database/song.repository.port';
import { SongEntity } from '../../domain/song.entity';
import { SongAlreadyExistsError } from '../../domain/song.errors';
import type { CreateSongRequestDto } from './create-song.request.dto';

@Injectable()
export class CreateSongService {
  constructor(
    @Inject(SONG_REPOSITORY)
    protected readonly songRepo: SongRepositoryPort,
  ) {}

  async create(command: CreateSongRequestDto): Promise<Result<AggregateID, Error>> {
    const song = SongEntity.create({
      importId: command.importId,
      artists: command.artists,
      title: command.title,
      dateAdded: command.dateAdded,
    });

    try {
      await this.songRepo.transaction(async () => this.songRepo.insertWithJsonb(song));
      return Ok(song.id);
    } catch (error: any) {
      if (error instanceof ConflictException || error instanceof UniqueIntegrityConstraintViolationError) {
        return Err(new SongAlreadyExistsError(error));
      }
      throw error;
    }
  }

  async findOneByImportId(importId: number): Promise<Option<SongEntity>> {
    return this.songRepo.findOneByImportId(importId);
  }
}
