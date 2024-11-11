import { routesV1 } from '@config/app.routes';
import { IdResponse } from '@libs/api/id.response.dto';
import type { AggregateID } from '@libs/ddd';
import { ArtistAlreadyExistsError } from '@modules/artist/domain/artist.errors';
import { Body, ConflictException as ConflictHttpException, Controller, HttpStatus, Inject, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ApiErrorResponse } from '@src/libs/api/api-error.response';
import { type Result, match } from 'oxide.ts';
import { CreateArtistCommand } from './create-artist.command';
import type { CreateArtistRequestDto } from './create-artist.request.dto';
import { CreateArtistService } from './create-artist.service';

@Controller(routesV1.version)
export class CreateArtistHttpController {
  constructor(@Inject(CommandBus) private readonly commandBus: CommandBus) {}

  @ApiOperation({ summary: 'Create a artist' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: IdResponse,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: ArtistAlreadyExistsError.message,
    type: ApiErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    type: ApiErrorResponse,
  })
  @Post(routesV1.artists.root)
  async create(@Body() body: CreateArtistRequestDto): Promise<IdResponse> {
    const command = new CreateArtistCommand(body);
    const result: Result<AggregateID, Error> = await this.commandBus.execute(command);
    return match(result, {
      Ok: (id: string) => new IdResponse(id),
      Err: (error: Error) => {
        if (error instanceof ArtistAlreadyExistsError) throw new ConflictHttpException(error.message);
        throw error;
      },
    });
  }
}
