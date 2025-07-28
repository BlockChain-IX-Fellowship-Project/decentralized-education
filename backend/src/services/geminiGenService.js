import { GoogleGenerativeAI } from "@google/generative-ai";
import 'dotenv/config';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash" // or "gemini-2.0-pro" if you want
});

export async function generateQuizWithGemini(transcript) {
  const prompt = `Generate a quiz with 5 multiple choice questions based on the following transcript.\nReturn ONLY a valid JSON object with no additional text, markdown, or code blocks.\nThe JSON must strictly follow this format:\n{\n  \"questions\": [\n    {\n      \"question\": \"string\",\n      \"options\": [\"string\", \"string\", \"string\", \"string\"],\n      \"correctAnswer\": \"string\"\n    }\n  ]\n}\n\nTranscript:\n${transcript}\n\nRemember: Return ONLY the JSON object, no markdown formatting or code blocks.`;
  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const quiz = JSON.parse(text);
    if (quiz.questions && Array.isArray(quiz.questions)) {
      return quiz.questions;
    }
    return [];
  } catch (err) {
    console.error('Gemini quiz generation error:', err);
    return [];
  }
}
