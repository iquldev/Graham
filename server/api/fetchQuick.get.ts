import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export default defineEventHandler(async (event) => {
  try {
    const query = (getQuery(event).query as string)?.trim();

    if (!query || query.length > 300) {
      throw createError({
        statusCode: 400,
        message: "Invalid query length (1-300 chars)",
      });
    }

    const cacheKey = `graham:${Buffer.from(query).toString('base64')}`;
    const cached = await useStorage().getItem(cacheKey);
    if (cached) return { success: true, data: cached, cached: true };

    const model = ai.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
      }
    });

    const prompt = `You are Graham, a search engine. Query: ${query}. 
    Provide a brief summary in JSON: {"title": "short title", "info": "2-3 sentences"}. 
    Answer in the same language as the query. No AI mentions.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    if (!text) throw new Error("Empty AI response");

    const jsonResponse = JSON.parse(text);

    await useStorage().setItem(cacheKey, jsonResponse, { ttl: 86400 });

    return {
      success: true,
      data: jsonResponse,
    };
  } catch (error: any) {
    console.error("API Error:", error);
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Internal server error",
    });
  }
});
