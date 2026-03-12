require("dotenv").config();

const { searchFood } = require("./services/fatsecretService");

(async () => {

  const result = await searchFood("egg");

  console.log(JSON.stringify(result, null, 2));

})();