import { useState,useEffect } from "react";
import { useLocation } from "react-router-dom";
import Summary from "@/components/MacroTracker/summary.jsx"
import AiMealAnalyzer from "@/components/MacroTracker/AiMealAnalyzer.jsx"
import MealList from "@/components/MacroTracker/MealList.jsx"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
//import MacroProgress from "@/components/MacroTracker/MacroProgress.jsx"
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
<section className="px-6 py-20">
<div className="max-w-6xl mx-auto space-y-8">
<h1 className="text-3xl font-bold">
Macro Dashboard
</h1>
<Summary totalCalories={totalCalories}
totalProtein={totalProtein}
entries={entries}
targets={targets}/>
<div className="grid md:grid-cols-2 gap-6">
<AiMealAnalyzer
  aiInput={aiInput}
  setAiInput={setAiInput}
  analyzeWithAI={analyzeWithAI}
  aiLoading={aiLoading}
  aiResult={aiResult}
/>
<MealList targets={targets}
entries={entries}/>
</div>
<section>
  <Card>
<CardHeader>
<CardTitle>Daily Progress</CardTitle>
</CardHeader>

<CardContent className="space-y-4">

<div>
<p className="text-sm mb-1">Calories</p>
<Progress value={calorieProgress} />
</div>

<div>
<p className="text-sm mb-1">Protein</p>
<Progress value={proteinProgress} />
</div>

</CardContent>
</Card>
</section>
</div>
</section>
);
}

