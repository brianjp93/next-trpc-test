import { router, publicProcedure } from "../trpc";
import { z } from "zod";

export const recipeRouter = router({
  getAllRecipes: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.recipe.findMany();
  }),
  createRecipe: publicProcedure
    .input(z.object({ name: z.string().min(1, "Need a longer name.") }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.recipe.create({ data: { name: input.name } });
    }),
  getToday: publicProcedure.query(({}) => {
    return new Date();
  }),
});
