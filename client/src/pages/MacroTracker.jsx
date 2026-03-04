import { useState,useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function MacroTracker() {
  const location = useLocation();
/* -------------------- STATE -------------------- */
  const [aiInput, setAiInput] = useState("");
const [aiLoading, setAiLoading] = useState(false);
const [aiResult, setAiResult] = useState(null);

  const [targets, setTargets] = useState({
    calories: "",
    protein: "",
  });

  const [entries, setEntries] = useState([]);

  const [entry, setEntry] = useState(() => {
  if (location.state) {
    return {
      name: location.state.name || "",
      calories: location.state.calories || "",
      protein: location.state.protein || "",
    };
  }

  return { name: "", calories: "", protein: "" };
});


  const [editingIndex, setEditingIndex] = useState(null);
  const [editDraft, setEditDraft] = useState({
    name: "",
    calories: "",
    protein: "",
  });
  


  /* -------------------- LOAD FROM STORAGE -------------------- */
  useEffect(() => {
    const savedTargets = localStorage.getItem("anabolick_targets");
    const savedEntries = localStorage.getItem("anabolick_entries");

    if (savedTargets) setTargets(JSON.parse(savedTargets));
    if (savedEntries) setEntries(JSON.parse(savedEntries));
  }, []);

  /* -------------------- SAVE TO STORAGE -------------------- */
  useEffect(() => {
    localStorage.setItem("anabolick_targets", JSON.stringify(targets));
  }, [targets]);

  useEffect(() => {
    localStorage.setItem("anabolick_entries", JSON.stringify(entries));
  }, [entries]);

  /* -------------------- DERIVED VALUES -------------------- */
  const totalCalories = entries.reduce(
    (sum, e) => sum + (e.calories || 0),
    0
  );

  const totalProtein = entries.reduce(
    (sum, e) => sum + (e.protein || 0),
    0
  );

  const calorieProgress =
    targets.calories
      ? Math.min((totalCalories / targets.calories) * 100, 100)
      : 0;

  const proteinProgress =
    targets.protein
      ? Math.min((totalProtein / targets.protein) * 100, 100)
      : 0;

  /* -------------------- HANDLERS -------------------- */
  const analyzeWithAI = async () => {
  if (!aiInput.trim()) return;

  try {
    setAiLoading(true);

    const response = await fetch("http://localhost:5000/analyze-text", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: aiInput }),
    });

    const data = await response.json();

    console.log("AI response:", data);

    setAiResult(data);
  if (data.totalCalories && data.totalProtein) {
  setEntries((prev) => [
    ...prev,
    {
      name: data.dishName || aiInput,
      calories: Number(data.totalCalories),
      protein: Number(data.totalProtein)
    }
  ]);

  setAiInput("");
}
  } catch (error) {
    console.error("AI request failed:", error);
  } finally {
    setAiLoading(false);
  }
};

  const handleTargetChange = (e) => {
    const { name, value } = e.target;
    setTargets((t) => ({ ...t, [name]: value }));
  };

  const handleEntryChange = (e) => {
    const { name, value } = e.target;
    setEntry((prev) => ({ ...prev, [name]: value }));
  };

  const addEntry = () => {
    if (!entry.name) return;

    setEntries((prev) => [
      ...prev,
      {
        ...entry,
        calories: Number(entry.calories),
        protein: Number(entry.protein),
      },
    ]);

    setEntry({ name: "", calories: "", protein: "" });
  };

  const deleteEntry = (index) => {
    setEntries((prev) => prev.filter((_, i) => i !== index));
  };

  const startEdit = (index) => {
    const e = entries[index];
    setEditingIndex(index);
    setEditDraft({
      name: e.name,
      calories: e.calories,
      protein: e.protein,
    });
  };
      const clearDay = () => {
  setEntries([]);
};

  const saveEdit = () => {
    setEntries((prev) =>
      prev.map((e, i) =>
        i === editingIndex
          ? {
              ...editDraft,
              calories: Number(editDraft.calories),
              protein: Number(editDraft.protein),
            }
          : e
      )
    );



    setEditingIndex(null);
    setEditDraft({ name: "", calories: "", protein: "" });
  };







  return (
 
    <section className=" relative px-6 py-24">
      <div className="max-w-5xl mx-auto space-y-16">

        {/* HEADER */}
        <header>
          <h1 className="text-3xl font-bold mb-2">Macro Tracker</h1>
          <p className="text-secondary">
            Track what matters. Nothing extra.
          </p>
        </header>

        {/* DAILY TARGETS */}
        <section className="p-6 rounded-xl border bg-white/70">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Calories
              </label>
              <input
                type="number"
                name="calories"
                value={targets.calories}
                onChange={handleTargetChange}
                placeholder="e.g. 2200"
                className="w-full rounded-lg border px-3 py-2"
              />
               </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Protein (g)
              </label>
              <input
                type="number"
                name="protein"
                value={targets.protein}
                onChange={handleTargetChange}
                placeholder="e.g. 160"
                className="w-full rounded-lg border px-3 py-2"
              />
            </div>
          </div>
            <p className="text-sm text-secondary mt-3">
            Not sure? Most lifters aim for <strong>2–2.2g protein/kg</strong> bodyweight.
          </p>

         
        </section>
{/* AI INPUT */}
<section className="p-6 rounded-xl border bg-white/70 mb-6">
  <h2 className="text-xl font-semibold mb-4">AI Meal Analyzer</h2>

  <textarea
    value={aiInput}
    onChange={(e) => setAiInput(e.target.value)}
    placeholder="Describe your meal... e.g. I ate chicken curry and rice"
    className="w-full rounded-lg border px-3 py-2"
  />

  <button
    onClick={analyzeWithAI}
    disabled={aiLoading}
    className="mt-4 rounded-full bg-accent text-white px-6 py-2 font-medium hover:bg-accent/50"
  >
    {aiLoading ? "Analyzing..." : "Analyze with AI"}
  </button>

  {aiResult && (
  <div className="mt-6 space-y-4">

    {/* Clean Display */}
    <div className="p-4 rounded-lg border bg-white">
      <h3 className="font-semibold text-lg mb-2">
        {aiResult.dishName}
      </h3>

      <p className="text-sm text-secondary mb-3">
        {aiResult.totalCalories} kcal · {aiResult.totalProtein}g protein
      </p>

      <ul className="text-sm space-y-1">
        {aiResult.ingredients?.map((ing, index) => (
          <li key={index} className="flex justify-between">
            <span>{ing.name}</span>
            <span className="text-secondary">{ing.grams}g</span>
          </li>
        ))}
      </ul>
    </div>

    {/* Raw JSON Debug */}
    <pre className="bg-black/5 p-4 rounded text-xs overflow-x-auto">
      {JSON.stringify(aiResult, null, 2)}
    </pre>

  </div>
)}

</section>

        {/* LOG ENTRY */}
        {/* LOG ENTRY */}
<section className="p-6 rounded-xl border bg-white/70">
  <h2 className="text-xl font-semibold mb-4">Log Food</h2>

  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
    <input
      type="text"
      name="name"
      value={entry.name}
      onChange={handleEntryChange}
      placeholder="Food name"
      className="rounded-lg border px-3 py-2 sm:col-span-2"
    />

    <input
      type="number"
      name="calories"
      value={entry.calories}
      onChange={handleEntryChange}
      placeholder="kcal"
      className="rounded-lg border px-3 py-2"
    />

    <input
      type="number"
      name="protein"
      value={entry.protein}
      onChange={handleEntryChange}
      placeholder="protein (g)"
      className="rounded-lg border px-3 py-2"
    />
  </div>

  <button
     type="button" onClick={addEntry}
    className="mt-4 rounded-full bg-accent text-white px-6 py-2 font-medium cursor-pointer hover:bg-accent/50"
  >
    Add entry
  </button>

  {/* ENTRY LIST */}
  {entries.length > 0 && (
    <ul className="mt-6 space-y-2">
      {entries.map((e, i) => (
        <li
          key={i}
          className="flex flex-col gap-2 rounded-lg bg-white px-4 py-2 border"
        >
          
    
  {editingIndex === i ? (
  <div className="flex gap-2 w-full">
    <input
      name="name"
      value={editDraft.name}
      onChange={(e) =>
        setEditDraft((d) => ({ ...d, name: e.target.value }))
      }
      className="border rounded px-2 py-1 flex-1"
    />
    <input
      type="number"
      name="calories"
      value={editDraft.calories}
      onChange={(e) =>
        setEditDraft((d) => ({ ...d, calories: e.target.value }))
      }
      className="border rounded px-2 py-1 w-24"
    />
    <input
      type="number"
      name="protein"
      value={editDraft.protein}
      onChange={(e) =>
        setEditDraft((d) => ({ ...d, protein: e.target.value }))
      }
      className="border rounded px-2 py-1 w-24"
    />

    <button
      type="button"
      onClick={saveEdit}
      className="text-sm text-accent"
    >
      Save
    </button>
   <button type="button" onClick={() => setEditingIndex(null)} className="text-secondary text-sm">Cancel</button>
  </div>
) : (
  <>
    <div>
      <p className="font-medium">{e.name}</p>
      <p className="text-sm text-secondary">
        {e.calories} kcal · {e.protein}g protein
      </p>
    </div>

    <div className="flex gap-3">
      <button
        type="button"
        onClick={() => startEdit(i)}
        className="text-sm text-secondary hover:text-black"
      >
        Edit
      </button>
      <button
        type="button"
        onClick={() => deleteEntry(i)}
        className="text-sm text-secondary hover:text-red-500"
      >
        Delete
      </button>
    </div>
  </>
)}

        </li>
        
      ))}
    </ul>
  )}
</section>


        {/* SUMMARY */}
        <section className="p-6 rounded-xl border bg-white/70">
  <h2 className="text-xl font-semibold mb-4">Today’s Summary</h2>

  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <div className="rounded-lg border p-4 bg-white">
  <p className="text-sm text-secondary mb-1">Calories</p>

  <p className="text-2xl font-bold mb-2">
    {totalCalories}
    {targets.calories && (
      <span className="text-base text-secondary">
        {" "} / {targets.calories}
      </span>
    )}
  </p>

  {targets.calories && (
    <div className="h-2 w-full rounded-full bg-black/10 overflow-hidden">
      <div
        className="h-full bg-accent"
        style={{ width: `${calorieProgress}%` }}
      />
    </div>
  )}
</div>


    <div className="rounded-lg border p-4 bg-white">
  <p className="text-sm text-secondary mb-1">Protein</p>

  <p className="text-2xl font-bold mb-2">
    {totalProtein}g
    {targets.protein && (
      <span className="text-base text-secondary">
        {" "} / {targets.protein}g
      </span>
    )}
  </p>

  {targets.protein && (
    <div className="h-2 w-full rounded-full bg-black/10 overflow-hidden">
      <div
        className="h-full bg-accent"
        style={{ width: `${proteinProgress}%` }}
      />
    </div>
  )}
</div>

  </div>
  <button type="button" className="mt-4 rounded-full bg-accent text-white px-6 py-2 font-medium cursor-pointer hover:bg-accent/50" onClick={clearDay} >Clear</button>
</section>

      </div>
    </section>
  );
}
