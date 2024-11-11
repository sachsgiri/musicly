import { ExceptionBase } from '@libs/exceptions';

export class ArtistLikeAlreadyExistsError extends ExceptionBase {
  static readonly message = 'Artist has been already liked';

  public readonly code = 'ARTIST_LIKE.ALREADY_EXISTS';

  constructor(cause?: Error, metadata?: unknown) {
    super(ArtistLikeAlreadyExistsError.message, cause, metadata);
  }
}

export class ArtistLikeNotFoundError extends ExceptionBase {
  static readonly message = 'Artist was not liked';

  public readonly code = 'ARTIST_LIKE.NOT_FOUND';

  constructor(cause?: Error, metadata?: unknown) {
    super(ArtistLikeNotFoundError.message, cause, metadata);
  }
}
