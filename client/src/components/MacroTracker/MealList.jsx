import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
export default function MealList({targets,entries,deleteEntry})
{
    return(
    <Card>
<CardHeader>
<CardTitle>Today's Meals</CardTitle>
</CardHeader>

<CardContent>

<ul className="space-y-3">

{entries.map((e,i)=>(
<li
key={i}
className="flex justify-between items-center border rounded-lg p-3"
>

<div>
<p className="font-medium">{e.name}</p>
<p className="text-sm text-muted-foreground">
{e.calories} kcal · {e.protein}g protein
</p>
</div>

<Button
variant="destructive"
size="sm"
onClick={()=>deleteEntry(i)}
>
Delete
</Button>

</li>
))}

</ul>

</CardContent>
</Card>
    );
}