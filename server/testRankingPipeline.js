require("dotenv").config();

const { searchFood } = require("./services/fatsecretService");
const chooseBestFood = require("./services/foodRankingService");

async function testPipeline() {

  const ingredient = "egg";

  console.log("Ingredient:", ingredient);
  console.log("\nSearching FatSecret...\n");

  const candidates = await searchFood(ingredient);

  console.log("Candidates:");
  console.log(candidates);

  if (!candidates.length) {
    console.log("\nNo candidates found.");
    return;
  }

  console.log("\nSending candidates to AI for ranking...\n");

  const selectedFood = await chooseBestFood(
    ingredient,
    candidates
  );

  console.log("Selected Food:");
  console.log(selectedFood);

}

testPipeline().catch(err => {
  console.error("Pipeline error:", err.message);
});