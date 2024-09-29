import z from 'zod';

const CatSchema = z.object({
  id: z.string(),
  url: z.string(),
  width: z.number().nullable(),
  height: z.number().nullable(),
  favourite: z.object({id: z.number()}).optional(),
  vote: z.object({id: z.number(), value: z.number()}).optional(),
});

export type Cat = z.infer<typeof CatSchema>;

export const CatListSchema = z.array(CatSchema);

export const MyAssetSchema = z.object({
  uri: z.string(),
  fileName: z.string(),
  type: z.string(),
});

export type MyAsset = z.infer<typeof MyAssetSchema>;

export const AddedFavouriteSchema = z.object({
  id: z.number(),
});

const VotesSchema = z.object({
  id: z.number(),
  sub_id: z.string().nullable(),
  image_id: z.string(),
  created_at: z.string().datetime(),
  value: z.number(),
});

export type Vote = z.infer<typeof VotesSchema>;

export const VotesListSchema = z.array(VotesSchema);

export const VotedSchema = z.object({
  id: z.number(),
  image_id: z.string(),
  sub_id: z.string().nullable(),
  value: z.number(),
});
