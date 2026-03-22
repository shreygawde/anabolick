import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

export default function AiMealAnalyzer({
  aiInput,
  setAiInput,
  analyzeWithAI,
  aiLoading,
  aiResult,
  addAiMeal // ✅ NEW PROP
}) {

  return (
    <Card>

      <CardHeader>
        <CardTitle>AI Meal Analyzer</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">

        {/* INPUT */}
        <Textarea
          value={aiInput}
          onChange={(e) => setAiInput(e.target.value)}
          placeholder="Describe your meal..."
        />

        <Button onClick={analyzeWithAI} disabled={aiLoading}>
          {aiLoading ? "Analyzing..." : "Analyze Meal"}
        </Button>

        {/* RESULT */}
        {aiResult && (
          <div className="p-4 border rounded-xl space-y-3">

            {/* DISH NAME */}
            <p className="font-semibold text-lg">
              {aiResult.dishName || "Unnamed Meal"}
            </p>

            {/* TOTALS */}
            <div className="text-sm text-muted-foreground">
              <p>
                {Math.round(aiResult.totals?.calories || 0)} kcal ·{" "}
                {Math.round(aiResult.totals?.protein || 0)}g protein ·{" "}
                {Math.round(aiResult.totals?.carbs || 0)}g carbs ·{" "}
                {Math.round(aiResult.totals?.fat || 0)}g fat
              </p>
            </div>

            {/* INGREDIENTS */}
            {aiResult.ingredients && (
              <div className="text-sm border-t pt-2 space-y-1">
                <p className="font-medium">Ingredients:</p>

                {aiResult.ingredients.map((ing, idx) => (
                  <div key={idx} className="flex justify-between">
                    <span>
                      {ing.name} ({ing.amount}{ing.unit})
                    </span>
                    <span className="text-muted-foreground">
                      {Math.round(ing.calories || 0)} kcal
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* ACTION */}
            <Button onClick={addAiMeal} className="w-full">
              Add Meal
            </Button>

          </div>
        )}

      </CardContent>

    </Card>
  )
}