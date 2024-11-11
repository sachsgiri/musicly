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
import { PlaySongCommand } from './play-song.command';
import type { PlaySongRequestDto } from './play-song.request.dto';

@Controller(routesV1.version)
export class PlaySongHttpController {
  constructor(
    @Inject(CommandBus)
    private readonly commandBus: CommandBus,
  ) {}

  // add the request context to the method
  @ApiOperation({ summary: 'Play a song' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: IdResponse,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    type: ApiErrorResponse,
  })
  @Post(routesV1.songs.play)
  @UseGuards(AuthGuard('jwt'))
  async create(@UserId() userId: UUID, @Body() body: PlaySongRequestDto): Promise<IdResponse> {
    const command = new PlaySongCommand({ ...body, userId });

    const result: Result<AggregateID, never> = await this.commandBus.execute(command);

    return match(result, {
      Ok: (id: string) => new IdResponse(id),
      Err: (error: Error) => {
        throw error;
      },
    });
  }
}
