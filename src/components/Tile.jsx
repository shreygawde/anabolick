export default function Tile({
  title,
  description,
  protein,
  calories,
  preptime = [],
  image,
})
{
    return(
        <div className="flex flex-col p-6 gap-4 rounded-xl bg-white/70 border border-border h-full">
            <h2 className="flex justify-center text-center text-primary font-bold text-2xl">{title}</h2>
            <p className="text-center min-h-[48px]">
  {description}
</p>

           <img src={image} alt={title} className="w-full aspect-[4/3] object-cover rounded-2xl"/>

            <ul className="flex flex-col gap-2">
                <li className="text-lg font-bold text-black">Protein:<span className="text-flesh">{protein} grams</span></li>
                <li className="text-md font-semibold text-black/90">Calories:{calories} kcal</li>
                <li>Prep Time:{preptime}</li>
            </ul>
            <button className="mt-auto text-white bg-accent rounded-full py-2">View recipe</button>
        </div>
    )
}