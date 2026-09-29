const express = require("express");
const multer = require("multer");
const { GoogleGenAI } = require("@google/genai");

const router = express.Router();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const upload = multer({
  storage: multer.memoryStorage(),
});

// Wait helper
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Gemini request with automatic retry
async function generateWithRetry(contents, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Gemini attempt ${attempt}/${maxRetries}`);

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: contents,
      });

      return response;
    } catch (error) {
      console.error(`Gemini attempt ${attempt} failed:`);

      const errorMessage = error.message || "";
      const errorString = JSON.stringify(error);

      const isTemporaryError =
        errorMessage.includes("503") ||
        errorMessage.includes("UNAVAILABLE") ||
        errorString.includes('"code":503') ||
        errorString.includes("UNAVAILABLE");

      // If it isn't a temporary server error, stop immediately
      if (!isTemporaryError) {
        throw error;
      }

      // If this was the last attempt, throw the error
      if (attempt === maxRetries) {
        throw error;
      }

      // Wait before trying again
      const delay = attempt * 3000;

      console.log(
        `Gemini is temporarily unavailable. Retrying in ${
          delay / 1000
        } seconds...`
      );

      await wait(delay);
    }
  }
}

router.post("/", upload.single("image"), async (req, res) => {
  try {
    // Check image
    if (!req.file) {
      return res.status(400).json({
        message: "Please upload a waste image.",
      });
    }

    console.log("Image received:", req.file.originalname);

    // Convert image to Base64
    const base64Image = req.file.buffer.toString("base64");

    const prompt = `
You are EcoGuard, an AI waste management assistant.

Analyze the uploaded image and identify the main waste item.

Return ONLY valid JSON using exactly these fields:

{
  "wasteType": "string",
  "category": "Recyclable | Organic | Hazardous | E-Waste | General Waste",
  "confidence": number,
  "bin": "string",
  "disposal": "string",
  "environmentalImpact": "string"
}

Rules:
- wasteType: identify the main waste item.
- category: choose the most appropriate category.
- confidence: number from 0 to 100.
- bin: recommend the appropriate waste bin.
- disposal: give simple practical disposal instructions.
- environmentalImpact: briefly explain the environmental impact.
- If the image is unclear, give your best estimate and use a lower confidence.
- Do not include Markdown.
- Do not include explanations outside the JSON.
- Return JSON only.
`;

    // Image + prompt
    const contents = [
      {
        inlineData: {
          data: base64Image,
          mimeType: req.file.mimetype,
        },
      },
      {
        text: prompt,
      },
    ];

    // Call Gemini with retry protection
    const response = await generateWithRetry(contents);

    let text = response.text;

    console.log("Gemini raw response:", text);

    if (!text) {
      throw new Error("Gemini returned an empty response.");
    }

    // Remove Markdown code fences
    text = text
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    // Find JSON object
    const firstBrace = text.indexOf("{");
    const lastBrace = text.lastIndexOf("}");

    if (firstBrace === -1 || lastBrace === -1) {
      throw new Error("Gemini did not return valid JSON.");
    }

    const jsonText = text.substring(firstBrace, lastBrace + 1);

    let result;

    try {
      result = JSON.parse(jsonText);
    } catch (parseError) {
      console.error("JSON parsing failed:", jsonText);

      throw new Error("Gemini returned an invalid JSON response.");
    }

    // Validate fields
    const requiredFields = [
      "wasteType",
      "category",
      "confidence",
      "bin",
      "disposal",
      "environmentalImpact",
    ];

    const missingFields = requiredFields.filter(
      (field) =>
        result[field] === undefined ||
        result[field] === null ||
        result[field] === ""
    );

    if (missingFields.length > 0) {
      throw new Error(
        `Gemini response is missing: ${missingFields.join(", ")}`
      );
    }

    // Validate confidence
    let confidence = Number(result.confidence);

    if (Number.isNaN(confidence)) {
      confidence = 50;
    }

    confidence = Math.max(0, Math.min(100, confidence));

    // Final clean result
    result = {
      wasteType: String(result.wasteType),
      category: String(result.category),
      confidence: confidence,
      bin: String(result.bin),
      disposal: String(result.disposal),
      environmentalImpact: String(result.environmentalImpact),
    };

    console.log("Final AI result:", result);

    res.json({
      message: "Waste image analyzed successfully!",
      result: result,
    });
  } catch (error) {
    console.error("Detection error:", error);

    res.status(500).json({
      message: "Failed to analyze waste image.",
      error: error.message,
    });
  }
});

module.exports = router;