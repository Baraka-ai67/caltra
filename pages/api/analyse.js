export const config = {
  api: {
    bodyParser: false,
  },
};

import formidable from "formidable";

export default async function handler(req, res) {
  const form = new formidable.IncomingForm();

  form.parse(req, async (err, fields, files) => {
    const fs = require("fs");
    const imageBytes = fs.readFileSync(files.file.filepath);

    // ---- AI FOOD DETECTION MODEL ----
    const hfResp = await fetch(
      "https://api-inference.huggingface.co/modelsardaocak/llava-1.5-7b-food-calorie-estimator",
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_TOKEN}`,
          "Content-Type": "application/octet-stream",
        },
        method: "POST",
        body: imageBytes,
      }
    );

    const predictions = await hfResp.json();

    // Extract top 1 food item
    const food = predictions[0]?.label || "Unknown";

    // ---- USDA CALORIE LOOKUP ----
    const usdaResp = await fetch(
      `https://api.nal.usda.gov/fdc/v1/foods/search?query=${food}&api_key=${process.env.USDA_API}`
    );

    const foodData = await usdaResp.json();

    res.status(200).json({
      detected_food: food,
      calories_info: foodData,
    });
  });
}
