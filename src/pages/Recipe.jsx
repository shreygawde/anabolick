import { useState } from "react";
import { useParams,useNavigate } from "react-router-dom";
import { recipes } from "../arrays/recipes";

export default function Recipe()
{
    const { id } = useParams();
    const recipe = recipes.find((r) => r.id === id);
    const [servings, setServings] = useState(1);
    const {
  title,
  description,
  protein,
  calories,
  preptime,
  ingredients,
  steps,
  image,
} = recipe;
const navigate = useNavigate();
const handleAddToTracker = () => {
  navigate("/MacroTracker", {
    state: {
      name: servings > 1 ? `${title} x${servings}` : title,
      calories: calories * servings,
      protein: protein * servings,
    },
  });
};



    
    if (!recipe) {
  return <p>Recipe not found.</p>;
}


    return(

    <div className=" relative px-6 py-24    max-w-7xl ">
        <header>
          <h1 className="text-3xl font-bold mb-2">{title}</h1>
          <p className="text-secondary">
            {description}
          </p>
         <img src={image} alt={title} className="w-70 h-70 object-cover rounded-2xl mt-5 mb-4"></img>
        </header>
        <ul className="flex flex-col gap-2">
                <li className="text-lg font-bold text-black">Protein:<span className="text-flesh">{protein} grams</span></li>
                <li className="text-md font-semibold text-black/90">Calories:{calories} kcal</li>
                <li>Prep Time:{preptime}</li>
            </ul>
            <div className="flex items-center gap-4 mt-6">
  <span className="text-sm text-secondary">Servings</span>

  <button
    onClick={() => setServings((s) => Math.max(1, s - 1))}
    className="w-8 h-8 rounded-full border"
  >
    −
  </button>

  <span className="font-medium">{servings}</span>

  <button
    onClick={() => setServings((s) => s + 1)}
    className="w-8 h-8 rounded-full border"
  >
    +
  </button>
</div>

            <button
  onClick={handleAddToTracker}
  className="mt-6 rounded-full bg-accent text-white px-6 py-3 font-medium mb-1"
>
  Add to today’s log
</button>

            <section>
  <h2 className="text-xl font-semibold mb-2">Ingredients</h2>
  <ul className="list-disc pl-5 space-y-1">
    {ingredients.map((item, i) => (
      <li key={i}>{item}</li>
    ))}
  </ul>
</section>
<section>
  <h2 className="text-xl font-semibold mb-2">Steps</h2>
  <ol className="list-decimal pl-5 space-y-2">
    {steps.map((step, i) => (
      <li key={i}>{step}</li>
    ))}
  </ol>
</section>



    </div>
);
}