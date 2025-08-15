import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const app = express();                  // create an Express application
const port = process.env.PORT || 3000;  // set port

// Middleware
app.use(cors());                   // allow cross-origin requests (frontend-backend)
app.use(express.json());           // parsing JSON bodies
app.use(express.static('public')); // serve static files from 'public' directory

// Gemini setup
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

app.listen(port, () => {
    console.log(`Gemini chatbot running on http://localhost:${port}`);
});

// Route
app.post('/api/chat', async (req, res) => {
    const userMessage = req.body.message;

    if (!userMessage) {
        return res.status(400).json({ reply: "Message is required." });
    }

    try {
        const result = await model.generateContent(userMessage);
        const response = await result.response;
        const text = response.text();

        res.json({ reply: text });
    }   catch (err) {
        console.error(err);
        res.status(500).json({ reply: "Something went wrong." });
    }
});