const express = require("express");
const router = express.Router();
const supabase = require("../supabaseClient");

router.post("/targets", async (req, res) => {
  const { calories, protein } = req.body;

  const { data, error } = await supabase
    .from("users")
    .update({
      calorie_target: calories,
      protein_target: protein
    })
    .eq("id", (await supabase.from("users").select("id").limit(1).single()).data.id);

  if (error) return res.status(500).json({ error });

  res.json({ success: true });
});

module.exports = router;