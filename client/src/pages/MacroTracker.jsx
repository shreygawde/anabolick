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

  const [targets, setTargets] = useState({
    calories: "",
    protein: "",
  });

  const [entries, setEntries] = useState([]);
  const [summary, setSummary] = useState(null);
  const [weekData, setWeekData] = useState([]);

  /* -------------------- INITIAL ENTRY -------------------- */
  const [entry] = useState(() => {
    if (location.state) {
      return {
        name: location.state.name || "",
        calories: location.state.calories || "",
        protein: location.state.protein || "",
        carbs: location.state.carbs || "",
        fat: location.state.fat || "",
      };
    }
    return { name: "", calories: "", protein: "", carbs: "", fat: "" };
  });

  /* -------------------- FETCH SUMMARY -------------------- */
  const fetchSummary = async () => {
    try {
      const res = await fetch("/summary");
      const data = await res.json();

      setSummary(data);

      // initialize targets once
      if (data?.targets) {
        setTargets(data.targets);
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
    } catch (err) {
      console.error("Saving targets failed:", err);
    }
  };

  /* -------------------- HANDLERS -------------------- */

  const handleTargetChange = (e) => {
    const { name, value } = e.target;

    const updated = {
      ...targets,
      [name]: value,
    };

    setTargets(updated);
    saveTargets(updated);
  };

  // 🔥 Analyze ONLY
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

  // 🔥 Add meal → then refresh backend
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

      // 🔥 refresh from backend (source of truth)
      await fetchSummary();
      await fetchWeekly();

      setAiResult(null);
      setAiInput("");
    } catch (err) {
      console.error("Adding meal failed:", err);
    }
  };

  const deleteEntry = async (index) => {
    // optional: hook this to backend delete later
    setEntries((prev) => prev.filter((_, i) => i !== index));

    await fetchSummary();
    await fetchWeekly();
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

        {/* SUMMARY (FROM BACKEND ONLY) */}
        <Summary
          totalCalories={summary?.totals?.calories || 0}
          totalProtein={summary?.totals?.protein || 0}
          targets={targets}
        />

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
                value={targets.calories}
                onChange={handleTargetChange}
                placeholder="2000"
              />
            </div>

            <div>
              <p className="text-sm mb-1">Protein Target</p>
              <Input
                type="number"
                name="protein"
                value={targets.protein}
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
            targets={targets}
            entries={summary?.meals || []} // 🔥 from backend
            deleteEntry={deleteEntry}
          />
        </div>

        {/* PROGRESS (FROM BACKEND ONLY) */}
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