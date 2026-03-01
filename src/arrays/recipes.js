import paneerImg from "../assets/apaneerbowl.png";
import pizza from "../assets/pizze.png"
import cheesecake from "../assets/cheesecake.png"
export const recipes = [
  {
    id: "paneer-bowl",
    title: "Anabolick Paneer Bowl",
    description: "Quick and filling with amazing macros.",
    protein: 45 ,
    calories: 478,
    preptime: "10 mins",

    ingredients: [
      "Paneer – 200g",
      "Onion – 1 medium",
      "Capsicum – 1 small",
      "Spices – to taste",
      "Oil – 1 tsp",
    ],

    steps: [
      "Heat a pan on medium heat.",
      "Add paneer cubes and dry roast for 3–4 minutes.",
      "Add oil, vegetables, and spices.",
      "Cook for 2–3 minutes and serve hot.",
    ],
    image: paneerImg,
  },

  {
    id: "cloud-pizza",
    title: "Anabolick Cloud Pizza",
    description: "Amazing macros for a fraction of the calories.",
    protein: 70,
    calories: 900,
    preptime: "40 mins",

    ingredients: [
      "Greek yogurt – 200g",
      "Eggs – 2",
      "Cheese – 100g",
      "Pizza sauce – 3 tbsp",
      "Seasoning – to taste",
    ],

    steps: [
      "Preheat oven to 180°C.",
      "Mix yogurt and eggs to form a batter.",
      "Spread batter on a baking tray and bake for 15 minutes.",
      "Add sauce, cheese, and toppings.",
      "Bake again for 10–15 minutes until golden.",
    ],
    image: pizza,
  },

  {
    id: "protein-cheesecake",
    title: "Anabolick Protein Cheesecake",
    description: "Truly the boss of protein desserts.",
    protein: 120,
    calories: 1000,
    preptime: "5 hours",

    ingredients: [
      "Greek yogurt – 500g",
      "Protein powder – 2 scoops",
      "Eggs – 3",
      "Sweetener – to taste",
      "Biscuit base or oats – optional",
    ],

    steps: [
      "Preheat oven to 170°C.",
      "Mix yogurt, protein powder, eggs, and sweetener.",
      "Pour mixture into a baking tin.",
      "Bake for 40–45 minutes.",
      "Let it cool and refrigerate for at least 4 hours before serving.",
    ],
    image: cheesecake,
  },

  {
    id: "protein-mousse",
    title: "Anabolick Protein Mousse",
    description: "Very filling and quick protein dessert.",
    protein: 50,
    calories: 260,
    preptime: "10 mins",

    ingredients: [
      "Greek yogurt – 200g",
      "Protein powder – 1 scoop",
      "Cocoa powder – 1 tbsp",
      "Sweetener – to taste",
    ],

    steps: [
      "Add all ingredients to a bowl.",
      "Whisk until smooth and fluffy.",
      "Taste and adjust sweetness.",
      "Chill for a few minutes and serve.",
    ],
  },
];
