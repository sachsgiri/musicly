import { z } from 'zod';

export const songLikeSchema = z.object({
  id: z.string().uuid(),
  song_id: z.string().uuid(),
  user_id: z.string().uuid(),
  created_at: z.preprocess((val: any) => new Date(val), z.date()),
});

export type SongLikeModel = z.TypeOf<typeof songLikeSchema>;
