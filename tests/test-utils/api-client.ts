import type { CreateArtistRequestDto } from '@modules/artist/commands/create-artist/create-artist.request.dto';
import { routesV1 } from '@src/configs/app.routes';
import type { IdResponse } from '@src/libs/api/id.response.dto';
import { getHttpServer } from '@tests/setup/jest-setup-after-env';

export class ApiClient {
  private url = `/${routesV1.version}/${routesV1.artists.root}`;

  async createArtist(dto: CreateArtistRequestDto): Promise<IdResponse> {
    const response = await getHttpServer().post(this.url).send(dto);
    return response.body;
  }
}
