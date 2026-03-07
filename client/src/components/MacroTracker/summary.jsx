import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
export default function Summary({totalCalories,
    totalProtein, entries, targets

})
{
    return(
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

<Card>
<CardHeader>
<CardTitle>Calories</CardTitle>
</CardHeader>
<CardContent>
<p className="text-2xl font-bold">{totalCalories}</p>
</CardContent>
</Card>

<Card>
<CardHeader>
<CardTitle>Protein</CardTitle>
</CardHeader>
<CardContent>
<p className="text-2xl font-bold">{totalProtein}g</p>
</CardContent>
</Card>

<Card>
<CardHeader>
<CardTitle>Meals</CardTitle>
</CardHeader>
<CardContent>
<p className="text-2xl font-bold">{entries.length}</p>
</CardContent>
</Card>

<Card>
<CardHeader>
<CardTitle>Remaining Protein</CardTitle>
</CardHeader>
<CardContent>
<p className="text-2xl font-bold">
{targets.protein ? targets.protein - totalProtein : "-"}
</p>
</CardContent>
</Card>

</div>
    );
}