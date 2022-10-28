import { useState } from "react";
import { trpc } from "../../utils/trpc";

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
    <div className="container mx-auto mt-4 px-4">
      <h1>Recipes</h1>

      <RecipeCreator />

      <h1 className="mt-10 text-xl">All Recipes</h1>
      {recipes.map((x) => {
        return <div key={x.id}>{x.name}</div>;
      })}
    </div>
  );
}

export function RecipeCreator() {
  const [name, setName] = useState("");
  const recipesQuery = useRecipes();
  const handleCreate = () => {
    create.mutate({ name });
    setName("");
  };
  const create = trpc.recipe.createRecipe.useMutation({
    onSuccess: () => recipesQuery.refetch(),
  });

  return (
    <>
      <input
        type="name"
        value={name}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            handleCreate();
          }
        }}
        onChange={(event) => setName(event.currentTarget.value)}
      />
      <button
        className="border-stroke-white mx-2 rounded-md border border-solid px-2"
        onClick={() => handleCreate()}
      >
        Create
      </button>

      {create.error?.message && <pre>Error: {create.error?.message}</pre>}
    </>
  );
}
