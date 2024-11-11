import { match } from 'oxide.ts';

import { routesV1 } from '@config/app.routes';
import { IdResponse } from '@libs/api/id.response.dto';
import { SongAlreadyExistsError } from '@modules/song/domain/song.errors';
import { Body, ConflictException as ConflictHttpException, Controller, HttpStatus, Inject, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ApiErrorResponse } from '@src/libs/api/api-error.response';

import type { CreateSongRequestDto } from './create-song.request.dto';
import { CreateSongService } from './create-song.service';

@Controller(routesV1.version)
export class CreateSongHttpController {
  constructor(
    @Inject(CreateSongService)
    private readonly createSongService: CreateSongService,
  ) {}

  @ApiOperation({ summary: 'Create a song' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: IdResponse,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: SongAlreadyExistsError.message,
    type: ApiErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    type: ApiErrorResponse,
  })
  @Post(routesV1.songs.root)
  async create(@Body() body: CreateSongRequestDto): Promise<IdResponse> {
    const result = await this.createSongService.create(body);

    return match(result, {
      Ok: (id: string) => new IdResponse(id),
      Err: (error: Error) => {
        if (error instanceof SongAlreadyExistsError) throw new ConflictHttpException(error.message);
        throw error;
      },
    });
  }
}
