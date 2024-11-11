import { Readable } from 'node:stream';
import { CreateArtistService } from '@modules/artist/commands/create-artist/create-artist.service';
import { CreateSongService } from '@modules/song/commands/create-song/create-song.service';
import { InjectQueue, Processor, WorkerHost } from '@nestjs/bullmq';
import { Inject, Injectable, type OnModuleInit } from '@nestjs/common';
import { ArtistRole } from '@src/modules/song/domain/song.types';
import type { Job, Queue } from 'bullmq';
import * as csvParser from 'csv-parser';

@Injectable()
export class SeederCsvProcessorProducer implements OnModuleInit {
  constructor(
    @InjectQueue('seederQueue') private readonly queue: Queue,
    @Inject(CreateArtistService)
    private readonly artistCreationService: CreateArtistService,
    @Inject(CreateSongService)
    private readonly songCreationService: CreateSongService,
  ) {}

  onModuleInit() {}

  /**
   * Producer method to process CSV file and enqueue rows to BullMQ.
   * @param file - The uploaded CSV file
   */
  async processCsvFile(file: Express.Multer.File): Promise<void> {
    const stream = Readable.from(file.buffer);

    stream
      .pipe(csvParser())
      .on('data', async (row) => {
        await this.queue.add('processRow', row, {
          removeOnComplete: true,
          removeOnFail: true,
        });
      })
      .on('end', () => {});
  }
}
