import { Routes, Route, useLocation } from "react-router-dom";
import { useRef, useEffect, useState } from "react";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import MacroTracker from "./pages/MacroTracker";
import Products from "./pages/Products";
import Recipes from "./pages/Recipes";
import Recipe from "./pages/Recipe";

export default function App() {
  const location = useLocation();
  const isHome = location.pathname === "/";

  const heroRef = useRef(null);
  const [showMainNav, setShowMainNav] = useState(false);

  useEffect(() => {
  if (!isHome) {
    setShowMainNav(true);
    return;
  }

  
  window.scrollTo(0, 0);

  const onScroll = () => {
    if (!heroRef.current) return;
    setShowMainNav(window.scrollY > heroRef.current.offsetHeight);
  };

  
  onScroll();

  window.addEventListener("scroll", onScroll);
  return () => window.removeEventListener("scroll", onScroll);
}, [isHome]);
  return (
    <div className="min-h-screen bg-base flex flex-col">
      <Nav show={showMainNav} />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home heroRef={heroRef} />} />
          <Route path="/MacroTracker" element={<MacroTracker />} />
          <Route path="/Products" element={<Products />} />
          <Route path="/Recipes" element={<Recipes />} />
          <Route path="/recipes/:id" element={<Recipe />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}
