import express from "express";
import fetch from "node-fetch";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = process.env.PORT || 10000;

// Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.static(__dirname)); // Serve static files (index.html, css, js)

// API route for chatbot
app.post("/api/chat", async (req, res) => {
  const userMessage = req.body.message;
  
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, // ✅ use env var
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // or "gpt-4o"
        messages: [{ role: "user", content: userMessage }],
      }),
    });
    
    const data = await response.json();
    
    if (data.error) {
      return res.status(400).json({ reply: data.error.message });
    }
    
    const botReply = data.choices[0].message.content;
    res.json({ reply: botReply });
  } catch (error) {
    console.error("Error fetching from OpenAI:", error);
    res.status(500).json({ reply: "Server error, try again later." });
  }
});

// Fallback to index.html for frontend
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});