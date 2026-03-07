import MacroCard from "../components/MacroCard.jsx";
import { products } from "../arrays/products.js";
export default function Products() {
        return(
<section className=" relative px-6 py-24">
      <div className="max-w-7xl mx-auto space-y-16">
        <h1 className="text-4xl font-bold mb-2">Products</h1>
        <p className="text-primary"> Honest scores based on ingredients, quality, and value.</p>
        <div  className="grid grid-cols-1 md:grid-cols-3 gap-11 max-w-5xl mx-auto ">
                {products.map((r)=>(
               <MacroCard key={r.no} {...r}/> 
              
              
            ))}
            </div>
      </div>
      </section>
      );
}