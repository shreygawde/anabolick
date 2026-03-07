export default function MacroCard({
  name,
  category,
  score,
  verdict,
  stats = [],
}) {
  const scoreColor =
    score >= 8
      ? "text-accent"
      : score >= 6
      ? "text-yellow-600"
      : "text-flesh";

  return (
    <div className="relative bg-elevated border border-border rounded-2xl p-6 shadow-sm flex flex-col h-full gap-4 ">
      
      {/* TOP ROW */}
      <div className="flex items-center justify-left">
        <div>
          <span className={`text-3xl font-bold ${scoreColor}`}>
            {score}
          </span>
          <span className="text-secondary text-sm ml-1">/10</span>
        </div>

        <span className=" absolute top-4 right-4 text-xs uppercase tracking-wide text-secondary bg-base/80 backdrop-blur px-2 py-1 rounded-md">
          {category}
        </span>
      </div>

      {/* NAME */}
      <div>
        <h3 className="text-lg font-semibold leading-tight">
          {name}
        </h3>
        <p className="text-secondary text-sm mt-1">
          {verdict}
        </p>
      </div>

      {/* STATS */}
      <ul className="text-sm text-secondary space-y-1">
        {stats.map((stat, i) => (
          <li key={i}>• {stat}</li>
        ))}
      </ul>

      {/* CTA */}
      <button className="mt-auto text-sm font-medium text-accent hover:underline">
        View details
      </button>
    </div>
  );
}
