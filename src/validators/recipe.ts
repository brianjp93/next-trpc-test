import * as z from 'yup'

export const createRecipeValidationSchema = z.object({
  name: z.string().trim().min(1, "Need a longer name.").required(),
});
export type CreateRecipe = typeof createRecipeValidationSchema.__outputType
