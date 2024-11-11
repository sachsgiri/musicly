import type { UUID } from 'node:crypto';
import { routesV1 } from '@config/app.routes';
import { IdResponse } from '@libs/api/id.response.dto';
import type { AggregateID } from '@libs/ddd';
import { Body, Controller, HttpStatus, Inject, Post, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ApiErrorResponse } from '@src/libs/api/api-error.response';
import { UserId } from '@src/modules/auth/user-id.decorator';
import { type Result, match } from 'oxide.ts';
import { ArtistLikeNotFoundError } from '../../domain/artist-like.errors';
import { UnlikeArtistCommand } from './unlike-artist.command';
import type { UnlikeArtistRequestDto } from './unlike-artist.request.dto';

@Controller(routesV1.version)
export class UnlikeArtistHttpController {
  constructor(@Inject(CommandBus) private readonly commandBus: CommandBus) {}

  @ApiOperation({ summary: 'Unlike a artist' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: IdResponse,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: ArtistLikeNotFoundError.message,
    type: ApiErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    type: ApiErrorResponse,
  })
  @Post(routesV1.artists.unlike)
  @UseGuards(AuthGuard('jwt'))
  async create(@UserId() userId: UUID, @Body() body: UnlikeArtistRequestDto): Promise<IdResponse> {
    const command = new UnlikeArtistCommand({ ...body, userId });

    const result: Result<AggregateID, never> = await this.commandBus.execute(command);

    return match(result, {
      Ok: (id: string) => new IdResponse(id),
      Err: (error: Error) => {
        throw error;
      },
    });
  }
}
