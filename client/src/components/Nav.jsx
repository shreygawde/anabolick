import { useState,useEffect } from "react";
import { Link } from "react-router-dom";
export default function Nav({show}) {
  



  return (
     
  

 <nav
  className={`
    fixed top-0 left-0 w-full z-50
    transition-all duration-300 ease-out
    ${show
      ? "translate-y-0 pointer-events-auto opacity-100"
      : "-translate-y-full opacity-0 pointer-events-none"}
    bg-white/90 backdrop-blur border-b
  `}
>

  <div className="max-w-full mx-auto px-6 py-4 flex justify-between">

        <h1 className="text-black text-2xl font-bold tracking-wider">ANABO<span className="text-red-200">LICK</span></h1>
        <ul className="flex gap-6 text-lg text-black font-bold">
          <li className="hover:text-red-500 transition"><Link to="/">Home</Link></li>
          <li className="hover:text-red-500 transition"><Link to="/MacroTracker">Track</Link></li>
          <li className="hover:text-red-500 transition"><Link to="/Products">Products</Link></li>
          <li className="hover:text-red-500 transition"><Link to="/Recipes">Recipes</Link></li>
        </ul>
        </div>
      </nav>
     
  );
}