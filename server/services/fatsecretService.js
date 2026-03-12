const axios = require("axios");
const { getAccessToken } = require("./fatsecretService"); // if same file adjust later

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

module.exports = { getAccessToken, searchFood };