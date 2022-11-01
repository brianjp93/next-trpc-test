import { router, publicProcedure } from "../trpc";
import * as z from "yup";
import { createRecipeValidationSchema } from "../../../validators/recipe";
import { TRPCError } from "@trpc/server";

export const recipeRouter = router({
  getAllRecipes: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.recipe.findMany();
  }),
  getAllIngredients: publicProcedure
    .input(z.object({ recipeId: z.string().required() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.ingredient.findMany({
        where: { recipeId: input.recipeId },
      });
    }),
  addIngredient: publicProcedure
    .input(
      z.object({
        recipeId: z.string().required(),
        name: z.string().min(1, "Please provide a longer name.").required(),
        quantity: z
          .number()
          .min(1, "Please provide a larger quantity.")
          .integer()
          .required(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.ingredient.create({ data: { ...input } });
    }),
  createRecipe: publicProcedure
    .input(createRecipeValidationSchema)
    .mutation(async ({ ctx, input }) => {
      const recipe = await ctx.prisma.recipe.findFirst({
        where: { name: input.name },
      });
      if (recipe) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "A recipe with this name already exists.",
        });
      }
      return ctx.prisma.recipe.create({ data: { name: input.name } });
    }),
  getToday: publicProcedure.query(({}) => {
    return new Date();
  }),
});
