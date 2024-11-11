import type { UUID } from 'node:crypto';
import { routesV1 } from '@config/app.routes';
import { IdResponse } from '@libs/api/id.response.dto';
import type { AggregateID, EntityResponseMapper } from '@libs/ddd';
import { Body, ConflictException as ConflictHttpException, Controller, HttpStatus, Inject, Post, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ApiErrorResponse } from '@src/libs/api/api-error.response';
import { UserId } from '@src/modules/auth/user-id.decorator';
import { type Result, match } from 'oxide.ts';
import type { SongLikeEntity } from '../../domain/song-like.entity';
import { SongLikeAlreadyExistsError } from '../../domain/song-like.errors';
import { SONG_LIKE_ENTITY_RESPONSE_MAPPER } from '../../dtos/song-like.mapper';
import type { SongLikeResponseDto } from '../../dtos/song-like.response.dto';
import { LikeSongCommand } from './like-song.command';
import type { LikeSongRequestDto } from './like-song.request.dto';

@Controller(routesV1.version)
export class LikeSongHttpController {
  constructor(
    @Inject(CommandBus)
    private readonly commandBus: CommandBus,
    @Inject(SONG_LIKE_ENTITY_RESPONSE_MAPPER)
    private readonly responseMapper: EntityResponseMapper<SongLikeEntity, SongLikeResponseDto>,
  ) {}

  // add the request context to the method
  @ApiOperation({ summary: 'Like a song' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: IdResponse,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: SongLikeAlreadyExistsError.message,
    type: ApiErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    type: ApiErrorResponse,
  })
  @Post(routesV1.songs.like)
  @UseGuards(AuthGuard('jwt'))
  async create(@UserId() userId: UUID, @Body() body: LikeSongRequestDto): Promise<SongLikeResponseDto> {
    const { songId } = body;

    const command = new LikeSongCommand({ songId: songId as UUID, userId });

    const result: Result<SongLikeEntity, SongLikeAlreadyExistsError> = await this.commandBus.execute(command);

    return match(result, {
      Ok: (entity: SongLikeEntity) => this.responseMapper.toResponse(entity),
      Err: (error: Error) => {
        if (error instanceof SongLikeAlreadyExistsError) {
          throw new ConflictHttpException(error.message);
        }
        throw error;
      },
    });
  }
}
