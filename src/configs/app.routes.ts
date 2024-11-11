/**
 * Application routes with its version
 * https://github.com/Sairyss/backend-best-practices#api-versioning
 */

// Root
const songsRoot = 'songs';
const artistsRoot = 'artists';
const seederRoot = 'seeder';

// Api Versions
const v1 = 'v1';

export const routesV1 = {
  version: v1,
  seeder: {
    root: seederRoot,
    upload: `/${seederRoot}/upload`,
  },
  songs: {
    root: songsRoot,
    like: `/${songsRoot}/like`,
    play: `/${songsRoot}/play`,
    delete: `/${songsRoot}/:id`,
    mostPlayed: `/${songsRoot}/most-played`,
  },
  artists: {
    root: artistsRoot,
    like: `/${artistsRoot}/like`,
    unlike: `/${artistsRoot}/unlike`,
    mostLiked: `/${artistsRoot}/most-liked`,
    mostPopular: `/${artistsRoot}/most-popular`,
  },
};
