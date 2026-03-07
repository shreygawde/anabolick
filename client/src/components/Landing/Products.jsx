import { useState, useEffect, useRef } from "react";
import MacroCard from "../MacroCard.jsx";
import { products } from "../../arrays/products.js";
export default function Products()
{
 const [index, setIndex] = useState(0);
 const CARD_WIDTH = 280;
 const GAP = 24;
 const getVisibleCards = () =>
 window.innerWidth < 640 ? 1 : 3;
 const [visibleCards, setVisibleCards] = useState(getVisibleCards());
 const maxIndex = products.length - visibleCards;
 
 useEffect(() => {
   const onResize = () => setVisibleCards(getVisibleCards());
   window.addEventListener("resize", onResize);
   return () => window.removeEventListener("resize", onResize);
 }, []);

 let startX = 0;
 const touchStartX = useRef(0);


 const onTouchStart = (e) => {
   touchStartX.current = e.touches[0].clientX;
 };

 const onTouchEnd = (e) => {
   const endX = e.changedTouches[0].clientX;
   const diff = touchStartX.current - endX;

   if (diff > 50 && index < maxIndex) setIndex((i) => i + 1);
   if (diff < -50 && index > 0) setIndex((i) => i - 1);
 };
 useEffect(() => {
   setIndex((i) => Math.min(i, products.length - visibleCards));
 }, [visibleCards]);

 return(
     
          <section className="px-6 py-24">
      <div className="max-w-7xl mx-auto">
    
        {/* HEADER ONLY */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-2">
            Products you can trust
          </h2>
          <p className="text-secondary">
            Honest scores based on ingredients, quality, and value.
          </p>
        </div>
        <div className=" relative pl-8 sm:pl-12">
        {/* SLIDER ROW */}
        <div className="relative flex justify-center ">
    
      {/* LEFT ARROW */}
      <button
        onClick={() => setIndex((i) => Math.max(i - 1, 0))}
        disabled={index === 0}
         className="hidden sm:flex absolute left-3 top-1/2 -translate-y-1/2
                 w-10 h-10 rounded-full border border-border bg-base
                 items-center justify-center z-20"
      >
        ←
      </button>
    
      {/* VIEWPORT */}
      <div
        className="overflow-hidden "
         onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
        style={{
          width: `${visibleCards * CARD_WIDTH + (visibleCards - 1) * GAP}px`,
        }}
      >
        <div
          className="flex gap-6 transition-transform duration-500 ease-out"
          style={{
            transform: `translateX(-${index * (CARD_WIDTH + GAP)}px)`,
          }}
        >
          {products.map((p, i) => (
            <div
              key={p.id}
              className={`min-w-[280px] max-w-[280px] transition-opacity duration-500 ${
                i < index || i >= index + visibleCards
                  ? "opacity-0"
                  : "opacity-100"
              }`}
            >
              <MacroCard {...p} />
            </div>
          ))}
        </div>
      </div>
    
      {/* RIGHT ARROW */}
      <button
        onClick={() => setIndex((i) => Math.min(i + 1, maxIndex))}
        disabled={index === maxIndex}
         className="hidden sm:flex absolute right-3 top-1/2 -translate-y-1/2
                 w-10 h-10 rounded-full border border-border bg-base
                 items-center justify-center z-20 "
      >
        →
      </button>
    
    </div>
    
        </div>
    
        {/* SEE ALL */}
        <div className="mt-10">
          <button className="text-white bg-accent rounded-full py-3 cursor-pointer hover:bg-accent/50 px-3 font-medium">
            See all products →
          </button>
        </div>
    
      </div>
    
    
    
              
             
          </section>
 );

}