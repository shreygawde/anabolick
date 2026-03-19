import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
export default function MacroProgress()
{
    return(
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
    );
}