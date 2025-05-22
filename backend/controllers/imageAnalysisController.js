// controllers/imageAnalysisController.js
require("dotenv").config();
const OpenAI = require("openai");
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const ImageAnalysis = require("../models/ImageAnalysis");

exports.create = async (req, res) => {
  try {
    const base64 = req.body.image;
    const imageUrl = `data:image/jpeg;base64,${base64}`;

    // note the call under chat.completions.create
    const gptRes = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Analyze this melon leaf image briefly:
              1. Is the plant healthy?
              2. Short description of the leaf condition.
              3. List any potential concerns.
              Respond in a short, bullet-point format without repeating the questions. Write direct observations only. 
              Always start the concern line with "Concerns:" (do not use any other variation).
              If the image is too unclear to answer properly, respond only once with "- Unable to determine, please provide a clearer image." Otherwise, answer normally.`,
            },
            {
              type: "image_url",
              image_url: { url: imageUrl },
            },
          ],
        },
      ],
      max_tokens: 500,
    });

    // extract the content
    const analysis = gptRes.choices[0].message.content;

    // save to Mongo
    const record = await ImageAnalysis.create({
      image: base64,
      description: analysis,
    });

    return res.json({
      success: true,
      _id: record._id,
      timestamp: record.timestamp,
      description: analysis,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: err.message });
  }
};

exports.list = async (_, res) => {
  try {
    const recent = await ImageAnalysis.find().sort({ timestamp: -1 }).limit(20);
    return res.json(recent);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    await ImageAnalysis.findByIdAndDelete(id);
    return res.json({ success: true });
  } catch (err) {
    console.error("Delete error:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
};
