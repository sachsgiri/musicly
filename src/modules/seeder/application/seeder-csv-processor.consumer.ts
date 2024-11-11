import type { Job } from 'bullmq';

import { CreateArtistService } from '@modules/artist/commands/create-artist/create-artist.service';
import { CreateSongService } from '@modules/song/commands/create-song/create-song.service';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Inject, Injectable, type OnModuleInit } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ArtistRole } from '@src/modules/song/domain/song.types';

@Injectable()
@Processor('seederQueue')
export class SeederCsvProcessorConsumer extends WorkerHost implements OnModuleInit {
  constructor(
    @Inject(CreateArtistService)
    private readonly artistCreationService: CreateArtistService,
    @Inject(CreateSongService)
    private readonly songCreationService: CreateSongService,
    @Inject(CommandBus)
    private readonly commandBus: CommandBus,
  ) {
    super();
  }

  onModuleInit() {}
  static parseArtists(artistStr: string) {
    const roles = ['Feat.', '[+]'];
    const artists: { name: string; role: ArtistRole }[] = [];
    roles.map((role) => {
      const parts = artistStr.split(role);

      if (parts.length > 1 && role === 'Feat.') {
        artists.push({ name: parts[0].trim(), role: ArtistRole.MAIN });
        artists.push({ name: parts[1].trim(), role: ArtistRole.FEATURED });
      }
      if (parts.length > 1 && role === '[+]') {
        artists.push(...parts.map((part) => ({ name: part.trim(), role: ArtistRole.MAIN })));
      }
    });

    if (artists.length === 0) {
      artists.push({ name: artistStr, role: ArtistRole.MAIN });
    }

    return artists;
  }

  async process(job: Job): Promise<void> {
    const row = job.data;
    // Parse artists from the CSV row
    console.log(`Processing row: ${JSON.stringify(row)}`);

    // check if song is already in the database
    const song = await this.songCreationService.findOneByImportId(+row.id);
    if (song.isSome()) {
      console.log(`Skipping row for song: ${row.title}`);
      return;
    }
    const artists = SeederCsvProcessorConsumer.parseArtists(row.artist);
    const artistIds = await Promise.all(
      artists.map(async (artist) => {
        const found = await this.artistCreationService.findOneByName(artist.name);

        if (found.isSome()) {
          return found.unwrap().id;
        }

        const result = await this.artistCreationService.create({
          name: artist.name,
        });

        return result.unwrapOrElse(() => {
          throw new Error('Failed to create artist');
        });
      }),
    );

    console.log(`Processed row for artists: ${artists.map((artist) => artist.name).join(', ')}`);

    // Prepare song data using the artist IDs
    const songData = {
      title: row.title,
      importId: +row.id,
      dateAdded: new Date(row.date_added),
      artists: artistIds.map((id, index) => ({
        id,
        role: artists[index].role,
      })),
    };

    await this.songCreationService.create(songData);
    console.log(`Processed row for song: ${songData.title}`);
  }
}
