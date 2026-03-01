import { useRef,useEffect } from "react";
import { Link } from "react-router-dom";
import Products from "../components/Landing/Products";
import Recipes from "../components/Landing/Recipes";
import Tracker from "../components/Landing/Tracker";
export default function Home({heroRef}) {
   return (
    <>
      {/* HERO */}
      <section  ref={heroRef} className="flex items-center justify-center text-center px-6 py-16 md:py-24 bg-accent min-h-[100vh]">
        <nav className="absolute top-0 left-0 w-full px-6 py-4">
  <div className="max-w-full mx-auto flex justify-between items-center">
    <h1 className="text-white font-bold text-xl">ANABO<span className="font-bold text-red-200">LICK</span></h1>
   <ul className="flex gap-6 text-lg text-white font-bold">
         <li className="hover:text-red-500 transition"><Link to="/">Home</Link></li>
          <li className="hover:text-red-500 transition"><Link to="/MacroTracker">Track</Link></li>
          <li className="hover:text-red-500 transition"><Link to="/Products">Products</Link></li>
          <li className="hover:text-red-500 transition"><Link to="/Recipes">Recipes</Link></li>
        </ul>
  </div>
</nav>

        <div className="max-w-3xl">
          <h2 className="text-4xl sm:text-5xl md:text-8xl font-extrabold mb-4 tracking-tight text-white">
            ANABO<span className="text-red-200">LICK</span>
          </h2>
          <p className="text-white mb-8 font-semibold">
            High-protein, low-calorie — built for performance.
          </p>
          <button className="bg-red-400 text-white px-8 py-4 rounded-full cursor-pointer font-semibold hover:bg-red-400/60" onClick={() => {
    if (heroRef.current) {
      window.scrollTo({
        top: heroRef.current.offsetHeight,
        behavior: "smooth",
      });
    }
  }} >
            Explore Concepts
          </button>
        </div>
      </section>
      <Tracker/>
      <Products/>
      <Recipes/>

     
     
    </>
  );
}

