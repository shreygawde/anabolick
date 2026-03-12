const axios = require("axios");

async function getAccessToken() {

  const response = await axios.post(
    "https://oauth.fatsecret.com/connect/token",
    new URLSearchParams({
      grant_type: "client_credentials",
      scope: "basic"
    }),
    {
      auth: {
        username: process.env.FATSECRET_CLIENT_ID,
        password: process.env.FATSECRET_CLIENT_SECRET
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    }
  );

  return response.data.access_token;
}

async function searchFood(query) {

  const token = await getAccessToken();

  const response = await axios.get(
    "https://platform.fatsecret.com/rest/server.api",
    {
      params: {
        method: "foods.search",
        search_expression: query,
        format: "json"
      },
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

const foodsRaw = response.data?.foods?.food;

if (!foodsRaw) {
  return [];
}

const foods = Array.isArray(foodsRaw) ? foodsRaw : [foodsRaw];

// Prefer generic foods
let candidates = foods.filter(food => food.food_type === "Generic");

// If none exist, fall back to brand foods
if (candidates.length === 0) {
  candidates = foods;
}

return candidates.slice(0, 5).map(food => ({
  id: food.food_id,
  name: food.food_name,
  brand: food.brand_name || null
}));
}

module.exports = { getAccessToken, searchFood };