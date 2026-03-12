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

  return response.data;
}

module.exports = { getAccessToken, searchFood };