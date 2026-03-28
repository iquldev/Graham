import { GoogleGenAI } from "@google/genai";

const client = new GoogleGenAI({ apiKey: process.env.API_KEY });

export default defineEventHandler(async (event) => {
  try {
    const query = (getQuery(event).query as string)?.trim();

    if (!query || query.length > 300) {
      throw createError({
        statusCode: 400,
        message: "Invalid query length (1-300 chars)",
      });
    }

    const cacheKey = `graham_all:${Buffer.from(query).toString("base64")}`;
    const cached = await useStorage().getItem(cacheKey);
    if (cached) {
      return { success: true, data: cached, cached: true };
    }

    const response = await client.models.generateContent({
      model: "gemini-2.5-flash-lite",
      config: {
        responseMimeType: "application/json",
      },
      contents: [{
        role: "user",
        parts: [{
          text: `You are Graham, a search engine. Query: ${query}.
Return valid JSON only with two fields:
{
  "quickAnswer": {"title": "short title", "info": "2-3 sentences"},
  "sites": [{"source": "string", "url": "valid URL or #", "title": "string", "description": "4-6 sentences summary"}]
}
Answer in the same language as the query. No AI mentions, no markdown, no extra text.`
        }]
      }]
    });

    const text = response.text;

    if (!text) throw new Error("Empty AI response");

    const jsonResponse = JSON.parse(text);

    if (
      !jsonResponse.quickAnswer ||
      typeof jsonResponse.quickAnswer.title !== "string" ||
      typeof jsonResponse.quickAnswer.info !== "string" ||
      !Array.isArray(jsonResponse.sites)
    ) {
      throw new Error("Invalid JSON structure from AI");
    }

    await useStorage().setItem(cacheKey, jsonResponse, { ttl: 86400 });

    return {
      success: true,
      data: jsonResponse,
    };
  } catch (error: any) {
    console.error("API Error:", error);

    if (error.status === 429 || error.message?.includes("quota")) {
      return {
        success: true,
        isDemo: true,
        data: {
          quickAnswer: { title: "Demo Mode", info: "Лимиты API исчерпаны. Попробуйте через пару минут!" },
          sites: []
        }
      };
    }

    throw createError({
      statusCode: error.status || 500,
      message: error.message || "Internal server error",
    });
  }
});
