import type { ApiErrorResponse } from '@src/libs/api/api-error.response';
import type { CreateArtistTestContext } from '@tests/artist/artist-shared-steps';
import type { TestContext } from '@tests/test-utils/test-context';
import type { DefineStepFunction } from 'jest-cucumber';

/**
 * Test steps that can be shared between all tests
 */

export const iReceiveAnErrorWithStatusCode = (then: DefineStepFunction, ctx: TestContext<CreateArtistTestContext>): void => {
  then(/^I receive an error "(.*)" with status code (\d+)$/, async (errorMessage: string, statusCode: string) => {
    const apiError = ctx.latestResponse as ApiErrorResponse;
    expect(apiError.statusCode).toBe(Number.parseInt(statusCode));
    expect(apiError.error).toBe(errorMessage);
  });
};
