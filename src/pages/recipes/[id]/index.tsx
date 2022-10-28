import { Ingredient, Recipe } from "@prisma/client";
import assert from "assert";
import { prisma } from "../../../server/db/client";
import { GetServerSidePropsContext } from "next";
import Base from "../../../components/base";
import { trpc } from "../../../utils/trpc";
import { useState } from "react";

export default function RecipeDetail({ recipe }: { recipe: Recipe }) {
  const query = trpc.recipe.getAllIngredients.useQuery({ recipeId: recipe.id });
  const ingredients = query.data || [];
  return (
    <Base>
      <h1>{recipe.name}</h1>
      <AddIngredient recipeId={recipe.id} onAdd={() => query.refetch()} />
      <h3 className="mt-4 underline">All Ingredients</h3>
      <IngredientList ingredients={ingredients} />
    </Base>
  );
}

function IngredientList({ ingredients }: { ingredients: Ingredient[] }) {
  return (
    <>
      {ingredients.map((item) => {
        return (
          <div key={item.id}>
            {item.name}: {item.quantity}
          </div>
        );
      })}
    </>
  );
}

function AddIngredient({
  recipeId,
  onAdd,
}: {
  recipeId: string;
  onAdd: () => void;
}) {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState(1);
  const mutation = trpc.recipe.addIngredient.useMutation();

  const handleMutation = () => {
    mutation.mutate({ recipeId, name, quantity });
    onAdd();
  };
  return (
    <div>
      <div>Name</div>
      <input
        type="text"
        value={name}
        onChange={(event) => setName(event.currentTarget.value)}
      />
      <div>Quantity</div>
      <input
        type="number"
        step="1"
        value={quantity}
        onChange={(event) => setQuantity(parseInt(event.currentTarget.value))}
      />
      <button onClick={handleMutation} className="btn block">
        create
      </button>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { id } = context.query;
  assert(typeof id === "string");
  const recipe = await prisma.recipe.findFirstOrThrow({ where: { id: id } });
  return { props: { recipe } };
}
