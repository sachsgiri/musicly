import type { Mutable } from '@src/libs/types';
import type { CreateArtistRequestDto } from '@src/modules/artist/commands/create-artist/create-artist.request.dto';
import { ApiClient } from '@tests/test-utils/api-client';
import type { TestContext } from '@tests/test-utils/test-context';
import type { DefineStepFunction } from 'jest-cucumber';

/**
 * Test steps that are shared between multiple artist tests
 */

export type CreateArtistTestContext = {
  createArtistDto: Mutable<CreateArtistRequestDto>;
};

export const givenArtistProfileData = (given: DefineStepFunction, ctx: TestContext<CreateArtistTestContext>): void => {
  given(/^artist profile data$/, (table: CreateArtistRequestDto[]) => {
    ctx.context.createArtistDto = table[0];
  });
};

export const iSendARequestToCreateAArtist = (when: DefineStepFunction, ctx: TestContext<CreateArtistTestContext>): void => {
  when('I send a request to create a artist', async () => {
    const response = await new ApiClient().createArtist(ctx.context.createArtistDto);
    ctx.latestResponse = response;
  });
};
