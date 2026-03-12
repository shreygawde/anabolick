require("dotenv").config();
const { getAccessToken } = require("./services/fatsecretService");

(async () => {
  const token = await getAccessToken();
  console.log("Token:", token);
})();