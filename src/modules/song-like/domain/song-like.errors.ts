import { ExceptionBase } from '@libs/exceptions';

export class SongLikeAlreadyExistsError extends ExceptionBase {
  static readonly message = 'SongLike already exists';

  public readonly code = 'SONG_LIKE.ALREADY_EXISTS';

  constructor(cause?: Error, metadata?: unknown) {
    super(SongLikeAlreadyExistsError.message, cause, metadata);
  }
}
