import { ExceptionBase } from '@libs/exceptions';

export class SongAlreadyExistsError extends ExceptionBase {
  static readonly message = 'Song already exists';

  public readonly code = 'SONG.ALREADY_EXISTS';

  constructor(cause?: Error, metadata?: unknown) {
    super(SongAlreadyExistsError.message, cause, metadata);
  }
}

export class SongNotFoundError extends ExceptionBase {
  static readonly message = 'Song not found';

  public readonly code = 'SONG.NOT_FOUND';

  constructor(cause?: Error, metadata?: unknown) {
    super(SongNotFoundError.message, cause, metadata);
  }
}
