export default function WeeklyStrip({ weekData }) {

  function getColor(status) {
    switch (status) {
      case "under":
        return "bg-green-500"
      case "near":
        return "bg-yellow-400"
      case "over":
        return "bg-red-500"
      default:
        return "bg-gray-400"
    }
  }

  return (
    <div className="flex justify-between items-center max-w-xl mx-auto">
      {weekData.map((day) => (
        <div key={day.day} className="flex flex-col items-center gap-1">

          <div
            className={`w-8 h-8 rounded-full ${getColor(day.status)}`}
          />

          <p className="text-xs text-muted-foreground">
            {day.day}
          </p>

        </div>
      ))}
    </div>
  )
}