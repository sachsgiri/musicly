import { Controller, HttpException, HttpStatus, Inject, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { routesV1 } from '@src/configs/app.routes';
import { SeederCsvProcessorProducer } from '../application/seeder-csv-processor.producer';

@Controller(routesV1.version)
export class SeederController {
  constructor(
    @Inject(SeederCsvProcessorProducer)
    private readonly seederService: SeederCsvProcessorProducer,
  ) {}

  @Post(routesV1.seeder.upload)
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 20 * 1024 * 1024 } })) // 20 MB limit
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new HttpException('File not provided', HttpStatus.BAD_REQUEST);
    }
    await this.seederService.processCsvFile(file);
  }
}
