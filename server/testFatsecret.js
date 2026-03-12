require("dotenv").config();
const axios = require("axios");
const { getAccessToken } = require("./services/fatsecretService");

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

  return response.data;
}

(async () => {
  const result = await searchFood("egg");
  console.log(JSON.stringify(result, null, 2));
})();