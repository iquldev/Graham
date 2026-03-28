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
  "sites": [{"title": "string", "description": "4-6 sentences summary"}]
}
Answer in the same language as the query. No sources, no URLs, no links, no AI mentions, no markdown, no extra text.`
        }]
      }]
    });

    const text = response.text;

    if (!text) throw new Error("Empty AI response");

    const jsonResponse = JSON.parse(text);

    const quickAnswer = jsonResponse.quickAnswer;
    const sites = Array.isArray(jsonResponse.sites)
      ? jsonResponse.sites
          .map((site) => ({
            title:
              typeof site.title === "string" && site.title.trim()
                ? site.title.trim()
                : "",
            description:
              typeof site.description === "string"
                ? site.description.trim()
                : "",
          }))
          .filter((site) => site.title && site.description)
      : [];

    if (
      !quickAnswer ||
      typeof quickAnswer.title !== "string" ||
      typeof quickAnswer.info !== "string"
    ) {
      throw new Error("Invalid JSON structure from AI");
    }

    const result = { quickAnswer: { title: quickAnswer.title.trim(), info: quickAnswer.info.trim() }, sites };
    await useStorage().setItem(cacheKey, result, { ttl: 86400 });

    return {
      success: true,
      data: result,
    };
  } catch (error: any) {
    console.error("API Error:", error);

    if (error.status === 429 || error.message?.includes("quota")) {
      return {
        success: true,
        isDemo: true,
        data: {
          quickAnswer: { title: "Demo Mode", info: "API limits have been reached. Please try again in a few minutes." },
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
