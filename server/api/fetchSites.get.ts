import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export default defineEventHandler(async (event) => {
  try {
    const query = (getQuery(event).query as string)?.trim();

    if (!query || query.length > 300) {
      throw createError({
        statusCode: 400,
        message: "Invalid query. Provide a string up to 300 characters.",
      });
    }

    const cacheKey = `graham_list:${Buffer.from(query).toString('base64')}`;
    const cached = await useStorage().getItem(cacheKey);
    if (cached) return { success: true, data: cached, cached: true };

    const model = ai.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
      }
    });

    const prompt = `You are Graham, a search engine. Query: ${query}. 
    Return a list of 5-7 relevant items in JSON format: 
    {"info": [{"source": "string", "url": "valid URL or #", "title": "string", "description": "4-6 sentences summary"}]}. 
    Rules: Answer in the same language as the query. No AI mentions. Strict JSON output.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    if (!text) throw new Error("Empty AI response");

    const jsonResponse = JSON.parse(text);

    if (!jsonResponse.info || !Array.isArray(jsonResponse.info)) {
      throw new Error("Invalid JSON structure: missing info array");
    }

    await useStorage().setItem(cacheKey, jsonResponse.info, { ttl: 86400 });

    return {
      success: true,
      data: jsonResponse.info,
    };
  } catch (error: any) {
    console.error("API Error:", error);
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Internal server error",
    });
  }
});
