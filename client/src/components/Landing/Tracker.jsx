import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
export default function Tracker()
{ 
  const [step, setStep] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY;
      const sectionTop = document.getElementById("macro-tracker").offsetTop;
      const sectionHeight = document.getElementById("macro-tracker").offsetHeight;

      const progress = (scrollY - sectionTop) / sectionHeight;

      if (progress < 0.25) setStep(0);
      else if (progress < 0.5) setStep(1);
      else if (progress < 0.75) setStep(2);
      else setStep(3);
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

 return(
   <section
      id="macro-tracker"
      className="relative min-h-[400vh] px-6"
    >
      <div className="sticky top-0 h-screen flex items-center max-w-5xl mx-auto">
        <TrackerStep step={step} />
      </div>
    </section>
 );
}

function TrackerStep({ step }) {
  const steps = [
    {
      title: "Set your intent",
      text: "Decide your goal. Protein comes first.",
    },
    {
      title: "Log meals",
      text: "Track protein as you eat. No friction.",
    },
    {
      title: "See progress",
      text: "Watch your day add up in real time.",
    },
    {
      title: "Start tracking",
      text: "Open the macro tracker and begin.",
    },
  ];

  return (
    <div className="w-full grid md:grid-cols-2 gap-12 items-center">
      {/* Left: Text */}
      <div>
        <h2 className="text-4xl font-bold mb-4">
          {steps[step].title}
        </h2>
        <p className="text-lg text-secondary">
          {steps[step].text}
        </p>

        {step === 3 && (
          <Link
            to="/MacroTracker"
            className="inline-block mt-6 bg-accent text-white px-6 py-3 rounded-full cursor-pointer hover:bg-accent/50"
          >
            Open Macro Tracker
          </Link>
        )}
      </div>

      {/* Right: Visual placeholder */}
      <div className="h-64 rounded-2xl bg-elevated flex items-center justify-center text-muted">
        Step {step + 1} visual
      </div>
    </div>
  );
}
