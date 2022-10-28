import { router, publicProcedure } from "../trpc";
import { z } from "zod";

export const recipeRouter = router({
  getAllRecipes: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.recipe.findMany();
  }),
  getAllIngredients: publicProcedure
    .input(z.object({ recipeId: z.string().cuid() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.ingredient.findMany({
        where: { recipeId: input.recipeId },
      });
    }),
  addIngredient: publicProcedure
    .input(
      z.object({
        recipeId: z.string().cuid(),
        name: z.string().min(1, "Please provide a longer name."),
        quantity: z.number().min(1, "Please provide a larger quantity.").int("Must be an integer."),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.ingredient.create({ data: {...input} })
    })
    ,
  createRecipe: publicProcedure
    .input(z.object({ name: z.string().min(1, "Need a longer name.") }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.recipe.create({ data: { name: input.name } });
    }),
  getToday: publicProcedure.query(({}) => {
    return new Date();
  }),
});
