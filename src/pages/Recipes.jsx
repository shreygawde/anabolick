import { Link } from "react-router-dom";
import { recipes } from "../arrays/recipes";
import Tile from "../components/Tile";
export default function Recipes()
{
    return(
<section className=" relative px-6 py-24">
      <div className="max-w-7xl mx-auto space-y-16">
        <h1 className="text-4xl font-bold mb-2">Recipes</h1>
        <p className="text-primary">Every Macro desrves its place in our recipes</p>
        <div  className="grid grid-cols-1 md:grid-cols-3 gap-11 max-w-6xl mx-auto auto-rows-fr">
                {recipes.map((r)=>(
                   <Link key={r.id} to={`/recipes/${r.id}`}>
               <Tile key={r.no} {...r}/> 
               </Link>
              
              
            ))}
            </div>
      </div>
      </section>
      );
}