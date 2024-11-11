import { Module } from '@nestjs/common';

import { BullModule } from '@nestjs/bullmq';
import { Injectable, Scope } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ArtistModule } from '../artist/artist.module';
import { SongModule } from '../song/song.module';
import { SeederCsvProcessorConsumer } from './application/seeder-csv-processor.consumer';
import { SeederCsvProcessorProducer } from './application/seeder-csv-processor.producer';
import { SeederController } from './infrastructure/seeder.controller';

@Module({
  imports: [
    CqrsModule,
    BullModule.registerQueue({
      name: 'seederQueue',
    }),
    ArtistModule,
    SongModule,
  ],
  controllers: [SeederController],
  providers: [SeederCsvProcessorProducer, SeederCsvProcessorConsumer],
})
export class SeederModule {}
