import express from 'express';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';

const app = express();
const PORT =  3000;

app.use(cors(
  {
    origin: '*'
  }
));
app.use(express.json());

const genAI = new GoogleGenerativeAI('AIzaSyARYgcY-n6AHSl0KtTNRshYMEaMeLEvMlU');
const model = genAI.getGenerativeModel({ model: 'gemini-1.0-pro-001' });

app.post('/generate-insight', async (req, res) => {
  try {
    const { moodValue, moodDescription } = req.body;

    const prompt = `Act as a compassionate mental health expert. A user reported their daily mood:
Mood Rating: ${moodValue}/5
Mood Description: ${moodDescription}.
Provide actionable insights to help improve their well-being and suggest positive changes in a concise manner.`;

    const result = await model.generateContent(prompt);
    const responseText = await result.response.text();

    // Remove Markdown formatting
    const cleanedResponse = responseText.replace(/\*\*|^\*\s*/gm, '');

    res.json({ insight: cleanedResponse });
  } catch (error) {
    console.error('Error generating AI insights:', error);
    res.status(500).json({ error: 'Unable to fetch insights' });
  }
});

app.listen(3000, '0.0.0.0', () => {
  console.log('Server running on all network interfaces');
});

export default app;