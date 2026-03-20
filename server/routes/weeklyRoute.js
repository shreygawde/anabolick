const express = require("express");
const router = express.Router();
const supabase = require("../supabaseClient");

router.get("/", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("meals")
      .select("calories, created_at");

    if (error) throw error;

    const target = 2000;

    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const weeklyMap = {};

    // initialize all days
    days.forEach(day => {
      weeklyMap[day] = 0;
    });

    // sum calories per day
    data.forEach(meal => {
      const date = new Date(meal.created_at);
      const day = days[date.getDay()];

      weeklyMap[day] += meal.calories || 0;
    });

    // convert to UI format
    const result = days.map(day => {
      const total = weeklyMap[day];

      let status = null;

      if (total === 0) {
        status = null;
      } else if (total < target * 0.9) {
        status = "under";
      } else if (total <= target * 1.1) {
        status = "near";
      } else {
        status = "over";
      }

      return { day, status };
    });

    res.json(result);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Weekly summary failed" });
  }
});

module.exports = router;