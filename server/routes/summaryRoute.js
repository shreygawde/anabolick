const express = require("express");
const router = express.Router();
const supabase = require("../supabaseClient");

const { getUser } = require("../services/db/userService");
const today = new Date();

const startOfDay = new Date(
  today.getFullYear(),
  today.getMonth(),
  today.getDate()
);

const endOfDay = new Date(
  today.getFullYear(),
  today.getMonth(),
  today.getDate() + 1
);

router.get("/", async (req, res) => {
  try {
    const { data: meals, error } = await supabase
  .from("meals")
  .select("calories, protein, created_at")
  .gte("created_at", startOfDay.toISOString())
  .lt("created_at", endOfDay.toISOString());
    const user = await getUser();

    const totals = meals.reduce(
      (acc, m) => {
        acc.calories += m.calories || 0;
        acc.protein += m.protein || 0;
        return acc;
      },
      { calories: 0, protein: 0 }
    );

    const targets = {
      calories: user.calorie_target || 2000,
      protein: user.protein_target || 150
    };

    const progress = {
      calories: targets.calories
        ? Math.min((totals.calories / targets.calories) * 100, 100)
        : 0,
      protein: targets.protein
        ? Math.min((totals.protein / targets.protein) * 100, 100)
        : 0
    };

    res.json({ totals, targets, progress });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Summary failed" });
  }
});

module.exports = router;