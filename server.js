import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.json());
app.use(express.static("public")); // Serve frontend

app.post("/api/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;
    
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: userMessage }],
      }),
    });
    
    const data = await response.json();
    
    console.log("🔎 OpenAI API Response:", JSON.stringify(data, null, 2)); // 👈 Debug log
    
    if (!data.choices || !data.choices[0]) {
      throw new Error("Invalid OpenAI response: " + JSON.stringify(data));
    }
    
    res.json({ reply: data.choices[0].message.content });
  } catch (err) {
    console.error("❌ OpenAI API Error:", err.message);
    res.status(500).json({ reply: "⚠️ AI request failed. Check server logs." });
  }
});

app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));