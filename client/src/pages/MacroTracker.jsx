import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import Summary from "@/components/MacroTracker/summary.jsx";
import AiMealAnalyzer from "@/components/MacroTracker/AiMealAnalyzer.jsx";
import MealList from "@/components/MacroTracker/MealList.jsx";
import WeeklyStrip from "@/components/MacroTracker/WeeklyStrip.jsx";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";

export default function MacroTracker() {
  const location = useLocation();

  /* -------------------- STATE -------------------- */
  const [aiInput, setAiInput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState(null);

  const [summary, setSummary] = useState(null);
  const [weekData, setWeekData] = useState([]);

  // 🔥 UI-only editable targets (NOT source of truth)
  const [editableTargets, setEditableTargets] = useState({
    calories: "",
    protein: "",
  });

  /* -------------------- FETCH SUMMARY -------------------- */
  const fetchSummary = async () => {
    try {
      const res = await fetch("/summary");
      const data = await res.json();

      setSummary(data);

      // sync editable inputs from backend
      if (data?.targets) {
        setEditableTargets(data.targets);
      }
    } catch (err) {
      console.error("Summary fetch failed:", err);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  /* -------------------- FETCH WEEKLY -------------------- */
  const fetchWeekly = async () => {
    try {
      const res = await fetch("/weekly");
      const data = await res.json();
      setWeekData(data);
    } catch (err) {
      console.error("Weekly fetch failed:", err);
    }
  };

  useEffect(() => {
    fetchWeekly();
  }, []);

  /* -------------------- SAVE TARGETS -------------------- */
  const saveTargets = async (newTargets) => {
    try {
      await fetch("/user/targets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTargets),
      });

      // refresh backend truth
      fetchSummary();
    } catch (err) {
      console.error("Saving targets failed:", err);
    }
  };

  const handleTargetChange = async (e) => {
  const { name, value } = e.target;

  const updated = {
    ...editableTargets,
    [name]: value,
  };

  setEditableTargets(updated); // smooth UX
  await saveTargets(updated);  // backend truth
};

  /* -------------------- AI -------------------- */
  const analyzeWithAI = async () => {
    if (!aiInput.trim()) return;

    try {
      setAiLoading(true);

      const response = await fetch("/analyze-text", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: aiInput }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("AI error:", data);
        return;
      }

      setAiResult(data);
    } catch (error) {
      console.error("AI request failed:", error);
    } finally {
      setAiLoading(false);
    }
  };

  /* -------------------- ADD MEAL -------------------- */
  const addAiMeal = async () => {
    if (!aiResult?.totals) return;

    try {
      await fetch("/meals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: aiResult.dishName || aiInput,
          calories: aiResult.totals.calories,
          protein: aiResult.totals.protein,
          carbs: aiResult.totals.carbs,
          fat: aiResult.totals.fat,
        }),
      });

      // 🔥 refresh everything
      await fetchSummary();
      await fetchWeekly();

      setAiResult(null);
      setAiInput("");
    } catch (err) {
      console.error("Adding meal failed:", err);
    }
  };

  /* -------------------- DELETE MEAL -------------------- */
  const deleteEntry = async (id) => {
    try {
      await fetch(`/meals/${id}`, {
        method: "DELETE",
      });

      await fetchSummary();
      await fetchWeekly();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  /* -------------------- UI -------------------- */

  return (
    <section className="px-6 py-20">
      <div className="max-w-6xl mx-auto space-y-8">

        <h1 className="text-3xl font-bold">Macro Dashboard</h1>

        {/* WEEKLY */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <WeeklyStrip weekData={weekData} />
          </CardContent>
        </Card>

        {/* SUMMARY */}
        {summary && (
  <Summary
    totalCalories={summary.totals.calories}
    totalProtein={summary.totals.protein}
    targets={summary.targets}
  />
)}

        {/* TARGETS */}
        <Card>
          <CardHeader>
            <CardTitle>Daily Targets</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div>
              <p className="text-sm mb-1">Calories Target</p>
              <Input
                type="number"
                name="calories"
                value={editableTargets.calories}
                onChange={handleTargetChange}
                placeholder="2000"
              />
            </div>

            <div>
              <p className="text-sm mb-1">Protein Target</p>
              <Input
                type="number"
                name="protein"
                value={editableTargets.protein}
                onChange={handleTargetChange}
                placeholder="150"
              />
            </div>
          </CardContent>
        </Card>

        {/* AI + MEALS */}
        <div className="grid md:grid-cols-2 gap-6">
          <AiMealAnalyzer
            aiInput={aiInput}
            setAiInput={setAiInput}
            analyzeWithAI={analyzeWithAI}
            aiLoading={aiLoading}
            aiResult={aiResult}
            addAiMeal={addAiMeal}
          />

          <MealList
            targets={summary?.targets}
            entries={summary?.meals || []}
            deleteEntry={deleteEntry}
          />
        </div>

        {/* PROGRESS */}
        <Card>
          <CardHeader>
            <CardTitle>Daily Progress</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div>
              <p className="text-sm mb-1">Calories</p>
              <Progress value={summary?.progress?.calories || 0} />
            </div>

            <div>
              <p className="text-sm mb-1">Protein</p>
              <Progress value={summary?.progress?.protein || 0} />
            </div>
          </CardContent>
        </Card>

      </div>
    </section>
  );
}