import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

// Chat endpoint
app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;
    
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "meta-llama/llama-3.1-8b-instruct:free", // free model
        messages: [{ role: "user", content: message }],
      }),
    });
    
    const data = await response.json();
    
    if (data.error) {
      return res.status(400).json({ error: data.error.message });
    }
    
    res.json({
      reply: data.choices[0].message.content,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Start server
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`✅ Server running on ${PORT}`));