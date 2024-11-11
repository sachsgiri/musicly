// All properties that a Artist has
export interface ArtistProps {
  name: string;
  totalSongLikes: number;
  totalLikes: number;
  totalPlays: number;
}

// Properties that are needed for a artist creation
export interface CreateArtistProps {
  name: string;
}
