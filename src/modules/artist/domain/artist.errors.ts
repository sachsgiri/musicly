import { ExceptionBase } from '@libs/exceptions';

export class ArtistAlreadyExistsError extends ExceptionBase {
  static readonly message = 'Artist already exists';

  public readonly code = 'ARTIST.ALREADY_EXISTS';

  constructor(cause?: Error, metadata?: unknown) {
    super(ArtistAlreadyExistsError.message, cause, metadata);
  }
}
