import type { UUID } from 'node:crypto';
import { routesV1 } from '@config/app.routes';
import { IdResponse } from '@libs/api/id.response.dto';
import type { AggregateID } from '@libs/ddd';
import { Body, ConflictException as ConflictHttpException, Controller, HttpStatus, Inject, Post, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ApiErrorResponse } from '@src/libs/api/api-error.response';
import { UserId } from '@src/modules/auth/user-id.decorator';
import { type Result, match } from 'oxide.ts';
import { ArtistLikeAlreadyExistsError } from '../../domain/artist-like.errors';
import { LikeArtistCommand } from './like-artist.command';
import type { LikeArtistRequestDto } from './like-artist.request.dto';

@Controller(routesV1.version)
export class LikeArtistHttpController {
  constructor(@Inject(CommandBus) private readonly commandBus: CommandBus) {}

  @ApiOperation({ summary: 'Like a artist' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: IdResponse,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: ArtistLikeAlreadyExistsError.message,
    type: ApiErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    type: ApiErrorResponse,
  })
  @Post(routesV1.artists.like)
  @UseGuards(AuthGuard('jwt'))
  async create(@UserId() userId: UUID, @Body() body: LikeArtistRequestDto): Promise<IdResponse> {
    const command = new LikeArtistCommand({ ...body, userId });

    const result: Result<AggregateID, ArtistLikeAlreadyExistsError> = await this.commandBus.execute(command);

    return match(result, {
      Ok: (id: string) => new IdResponse(id),
      Err: (error: Error) => {
        if (error instanceof ArtistLikeAlreadyExistsError) throw new ConflictHttpException(error.message);
        throw error;
      },
    });
  }
}
