import type { ArtistResponseDto } from '@modules/artist/dtos/artist.response.dto';
import type { IdResponse } from '@src/libs/api/id.response.dto';
import { iReceiveAnErrorWithStatusCode } from '@tests/shared/shared-steps';
import { ApiClient } from '@tests/test-utils/api-client';
import { TestContext } from '@tests/test-utils/test-context';
import { defineFeature, loadFeature } from 'jest-cucumber';
import { type DatabasePool, sql } from 'slonik';
import { getConnectionPool } from '../../setup/jest-setup-after-env';
import { type CreateArtistTestContext, givenArtistProfileData, iSendARequestToCreateAArtist } from '../artist-shared-steps';

const feature = loadFeature('tests/artist/create-artist/create-artist.feature');

/**
 * e2e test implementing a Gherkin feature file
 * https://github.com/Sairyss/backend-best-practices#testing
 */

defineFeature(feature, (test) => {
  let pool: DatabasePool;
  const apiClient = new ApiClient();

  beforeAll(() => {
    pool = getConnectionPool();
  });

  afterEach(async () => {
    await pool.query(sql`TRUNCATE "artists"`);
  });

  test('I can create a artist', ({ given, when, then }) => {
    const ctx = new TestContext<CreateArtistTestContext>();

    givenArtistProfileData(given, ctx);

    iSendARequestToCreateAArtist(when, ctx);

    then('I receive my artist ID', () => {
      const response = ctx.latestResponse as IdResponse;
      expect(typeof response.id).toBe('string');
    });
  });

  test('I try to create a artist with invalid data', ({ given, when, then }) => {
    const ctx = new TestContext<CreateArtistTestContext>();

    givenArtistProfileData(given, ctx);

    iSendARequestToCreateAArtist(when, ctx);

    iReceiveAnErrorWithStatusCode(then, ctx);
  });
});
