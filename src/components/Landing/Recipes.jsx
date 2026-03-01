import Tile from "../Tile.jsx";
import { recipes } from "../../arrays/recipes.js";
export default function Recipes()
{
    return(
         <section className="px-6 py-24">
        <div className="max-w-7xl mx-auto mb-12">
      <h2 className="text-3xl font-bold mb-2">
        Anabolick Recipies
      </h2>
      <p className="text-secondary">
        Each Macro deserves its place in our recipies.
      </p>
      
        
      <div  className="grid grid-cols-1 md:grid-cols-2 gap-11 max-w-4xl mx-auto ">
        {recipes.map((r)=>(
       <Tile key={r.no} {...r}/> 
      
      
    ))}
    </div>
    </div>
      </section>
    )
}