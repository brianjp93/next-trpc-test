import Link from "next/link";
import { trpc } from "../../utils/trpc";
import Base from "../../components/base";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { createRecipeValidationSchema } from "../../validators/recipe";

function useRecipes() {
  return trpc.recipe.getAllRecipes.useQuery(undefined, {
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
}

export default function Recipes() {
  const recipesQuery = useRecipes();
  const recipes = recipesQuery.data || [];

  return (
    <Base>
      <h1>Recipes</h1>

      <RecipeCreator onCreate={recipesQuery.refetch} />

      <h1 className="mt-10 text-xl">All Recipes</h1>
      {recipes.map((x) => {
        return (
          <div key={x.id}>
            <Link href={`/recipes/${x.id}/`}>{x.name}</Link>
          </div>
        );
      })}
    </Base>
  );
}

export function RecipeCreator({ onCreate }: { onCreate?: () => void }) {
  const create = trpc.recipe.createRecipe.useMutation({
    onSuccess: () => onCreate && onCreate(),
  });

  return (
    <>
      <Formik
        onSubmit={async (values, { setErrors }) => {
          await create
            .mutateAsync(values)
            .catch((error) => setErrors({ name: error?.message }));
        }}
        validationSchema={createRecipeValidationSchema}
        initialValues={{ name: "" }}
      >
        {({ isValid }) => (
          <Form>
            <label htmlFor="name">Recipe Name</label>
            <Field name="name" type="text" />
            <ErrorMessage name="name" />

            <button
              type="submit"
              disabled={!isValid || create.isLoading}
              className="border-stroke-white mx-2 rounded-md border border-solid px-2"
            >
              Create
            </button>
          </Form>
        )}
      </Formik>
    </>
  );
}
