
import { GoogleGenAI, Type } from "@google/genai";
import { KeywordAnalysis, DomainAnalysis } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const KEYWORD_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    mainKeyword: {
      type: Type.OBJECT,
      properties: {
        keyword: { type: Type.STRING },
        volume: { type: Type.NUMBER },
        difficulty: { type: Type.NUMBER },
        cpc: { type: Type.NUMBER },
        intent: { type: Type.STRING },
        trend: { type: Type.ARRAY, items: { type: Type.NUMBER } }
      },
      required: ["keyword", "volume", "difficulty", "cpc", "intent", "trend"]
    },
    variations: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          keyword: { type: Type.STRING },
          intent: { type: Type.STRING },
          volume: { type: Type.NUMBER },
          difficulty: { type: Type.NUMBER }
        }
      }
    },
    questions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          keyword: { type: Type.STRING },
          intent: { type: Type.STRING },
          volume: { type: Type.NUMBER },
          difficulty: { type: Type.NUMBER }
        }
      }
    },
    related: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          keyword: { type: Type.STRING },
          intent: { type: Type.STRING },
          volume: { type: Type.NUMBER },
          difficulty: { type: Type.NUMBER }
        }
      }
    },
    serp: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          rank: { type: Type.NUMBER },
          title: { type: Type.STRING },
          url: { type: Type.STRING },
          as: { type: Type.NUMBER },
          traffic: { type: Type.NUMBER },
          keywords: { type: Type.NUMBER }
        }
      }
    }
  },
  required: ["mainKeyword", "variations", "questions", "related", "serp"]
};

const DOMAIN_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    domain: { type: Type.STRING },
    authorityScore: { type: Type.NUMBER },
    organicTraffic: { type: Type.NUMBER },
    backlinks: { type: Type.NUMBER },
    displayAds: { type: Type.NUMBER },
    trafficTrend: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          month: { type: Type.STRING },
          value: { type: Type.NUMBER }
        }
      }
    },
    topKeywords: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          keyword: { type: Type.STRING },
          pos: { type: Type.NUMBER },
          volume: { type: Type.NUMBER },
          traffic: { type: Type.NUMBER }
        }
      }
    },
    mainCompetitors: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          domain: { type: Type.STRING },
          commonKeywords: { type: Type.NUMBER },
          traffic: { type: Type.NUMBER }
        }
      }
    }
  },
  required: ["domain", "authorityScore", "organicTraffic", "backlinks", "trafficTrend", "topKeywords", "mainCompetitors"]
};

export const fetchKeywordAnalysis = async (keyword: string, region: string = 'US'): Promise<KeywordAnalysis> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Analyze keyword "${keyword}" specifically for the ${region} market. Provide current 2024 metrics including search volume, difficulty, and intent.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: KEYWORD_SCHEMA,
      tools: [{ googleSearch: {} }]
    }
  });
  return JSON.parse(response.text);
};

export const fetchDomainAnalysis = async (domain: string, region: string = 'US'): Promise<DomainAnalysis> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Perform a detailed Domain Overview analysis for "${domain}" in the ${region} market. 
    Provide Authority Score (0-100), estimated monthly organic traffic for this region, estimated backlinks, top organic keywords (pos 1-10), and main competitors in the same country. 
    Use real-world search data.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: DOMAIN_SCHEMA,
      tools: [{ googleSearch: {} }]
    }
  });
  return JSON.parse(response.text);
};
