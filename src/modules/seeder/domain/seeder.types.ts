export type ArtistData = {
  name: string;
  role: 'primary' | 'feat';
};

export type SongData = {
  title: string;
  dateAdded: string;
  artists: { id: string; role: 'primary' | 'feat' }[];
};
