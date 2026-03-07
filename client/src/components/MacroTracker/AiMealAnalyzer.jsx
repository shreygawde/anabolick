import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

export default function AiMealAnalyzer({
  aiInput,
  setAiInput,
  analyzeWithAI,
  aiLoading,
  aiResult
}) {

return (

<Card>

<CardHeader>
<CardTitle>AI Meal Analyzer</CardTitle>
</CardHeader>

<CardContent className="space-y-3">

<Textarea
value={aiInput}
onChange={(e)=>setAiInput(e.target.value)}
placeholder="Describe your meal..."
/>

<Button onClick={analyzeWithAI} disabled={aiLoading}>
{aiLoading ? "Analyzing..." : "Analyze Meal"}
</Button>

{aiResult && (
<div className="p-3 border rounded-lg">

<p className="font-semibold">{aiResult.dishName}</p>

<p className="text-sm text-muted-foreground">
{aiResult.totalCalories} kcal · {aiResult.totalProtein}g protein
</p>

</div>
)}

</CardContent>

</Card>

)

}