import express from 'express';
import cors from 'cors';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distPath = path.join(__dirname, 'dist');

// Middleware
app.use(cors()); // Allow frontend to communicate with backend
app.use(express.json());

app.use(express.static(distPath));

app.get('/', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

// Initialize Google AI on the server side (if configured)
const geminiApiKey = process.env.GEMINI_API_KEY;
const genAI = geminiApiKey ? new GoogleGenAI({ apiKey: geminiApiKey }) : null;

/**
 * Endpoint: /api/submit
 * Purpose: Securely forwards form data to Power Apps without exposing the URL/Secret to the client.
 */
app.post('/api/submit', async (req, res) => {
  try {
    const POWER_APPS_URL = process.env.POWER_APPS_URL
      || 'https://prod-41.usgovtexas.logic.azure.us:443/workflows/2a2d0954fe8f4e0ea0361f210b0cf02f/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=-zGSUyY1Q1ZlU-GOCrvh_LiWNIWI02oMvhRCwrK7hBg';
    const POWER_APPS_SECRET = process.env.POWER_APPS_SECRET;

    if (!POWER_APPS_URL) {
      // Simulation mode if no URL is configured
      console.log('Simulating submission:', req.body);
      await new Promise(resolve => setTimeout(resolve, 1500));
      return res.status(200).json({ success: true, message: 'Simulated submission successful' });
    }

    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };

    if (POWER_APPS_SECRET) {
      headers['X-Api-Key'] = POWER_APPS_SECRET;
    }

    const response = await fetch(POWER_APPS_URL, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(req.body)
    });

    if (!response.ok) {
      throw new Error(`Power Apps responded with status: ${response.status}`);
    }

    const data = await response.json().catch(() => ({})); // Handle cases where response body is empty
    return res.status(200).json(data);

  } catch (error) {
    console.error('Submission error:', error);
    return res.status(500).json({ error: 'Failed to submit data.' });
  }
});

/**
 * Endpoint: /api/refine
 * Purpose: Uses Gemini API to refine text without exposing the API Key to the browser.
 */
app.post('/api/refine', async (req, res) => {
  try {
    if (!genAI) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is not configured.' });
    }

    const { text, category, role } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    const prompt = `
      You are a professional communication assistant for the NYC Department of Correction.
      A user (${role}) is writing an inquiry regarding "${category}".
      
      The user's rough draft is:
      "${text}"
      
      Please rewrite this message to be formal, clear, polite, and concise. 
      Keep the tone respectful and professional. 
      Do not invent new facts, just polish the language and structure.
      Return ONLY the rewritten message text.
    `;

    const response = await genAI.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return res.status(200).json({ refinedText: response.text.trim() });

  } catch (error) {
    console.error('Gemini error:', error);
    return res.status(500).json({ error: 'Failed to refine text.' });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
