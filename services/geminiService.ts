
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AnalysisReport } from "../types";

const SYSTEM_PROMPT = `
You are a senior investment partner at a top VC/PE firm (like Sequoia, Benchmark, or Andreessen Horowitz) with 20+ years of experience. 
Your task is to analyze the business plan PDF document provided by the user and output a **comprehensive, rigorously detailed** investment due diligence report.

**CRITICAL INSTRUCTIONS FOR CONTENT DEPTH & FORMATTING:**

1.  **DEEP DIVE SECTION (LAYERED CONTENT)**: 
    *   For each area (Tech, Product, Commercial, Ops), you must split the content into two parts:
        *   **Summary Points**: 3-5 concise, logically independent bullet points that capture the core value proposition.
        *   **Detailed Content**: The raw, high-density information (e.g., specific chemical formulas, full list of 20+ SKUs, detailed architectural diagrams text, complex pricing tables) that is too detailed for the main dashboard but essential for due diligence.
        *   **Button Label**: A short, context-aware label for the button that opens the details (e.g., "查看完整配方", "查看技术参数细节", "浏览产品矩阵").

2.  **MARKET ANALYSIS**: 
    *   **No Charts**: Do not generate chart data.
    *   **Tech Trends**: Instead, provide a detailed analysis of **Technological Trends** in this specific industry.

3.  **STRICT CHINESE FORMATTING**: 
    *   **Language**: Simplified Chinese (简体中文).
    *   **No Redundant English**.
    *   **Currency & Numbers**: Use Chinese units (万, 亿).

**Output JSON strictly matching the schema provided.**
`;

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
  });
};

export const analyzeBusinessPlan = async (file: File): Promise<AnalysisReport> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found");
  }

  const ai = new GoogleGenAI({ apiKey });

  const deepDiveItemSchema = {
    type: Type.OBJECT,
    properties: {
      summaryPoints: { 
        type: Type.ARRAY, 
        items: { type: Type.STRING },
        description: "3-5 concise, logically independent core points."
      },
      detailedContent: { 
        type: Type.STRING, 
        description: "The full, high-density detailed content (long text)." 
      },
      buttonLabel: { 
        type: Type.STRING, 
        description: "Label for the button, e.g., '查看技术详情'." 
      }
    },
    required: ["summaryPoints", "detailedContent", "buttonLabel"]
  };

  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      executiveSummary: {
        type: Type.OBJECT,
        properties: {
          coreViewpoints: { type: Type.ARRAY, items: { type: Type.STRING } },
          preliminaryVerdict: { type: Type.STRING, enum: ["Invest", "Watch", "Pass"] },
          verdictReason: { type: Type.STRING },
        },
        required: ["coreViewpoints", "preliminaryVerdict", "verdictReason"],
      },
      investmentHighlights: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            highlight: { type: Type.STRING },
            rating: { type: Type.STRING, enum: ["High", "Medium"] }
          },
          required: ["highlight", "rating"]
        },
      },
      businessDeepDive: {
        type: Type.OBJECT,
        properties: {
          technicalSolution: deepDiveItemSchema,
          productPortfolio: deepDiveItemSchema,
          commercializationPath: deepDiveItemSchema,
          operationalStrengths: deepDiveItemSchema,
        },
        required: ["technicalSolution", "productPortfolio", "commercializationPath", "operationalStrengths"],
      },
      marketAnalysis: {
        type: Type.OBJECT,
        properties: {
          marketSize: { type: Type.STRING },
          cagr: { type: Type.STRING },
          drivers: { type: Type.ARRAY, items: { type: Type.STRING } },
          customerSegments: { type: Type.ARRAY, items: { type: Type.STRING } },
          regulatoryEnvironment: { type: Type.STRING },
          marketPainPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
          techTrends: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Specific technical trends in the industry." },
          summary: { type: Type.STRING },
        },
        required: ["marketSize", "cagr", "drivers", "customerSegments", "techTrends", "summary", "regulatoryEnvironment", "marketPainPoints"],
      },
      competitiveLandscape: {
        type: Type.OBJECT,
        properties: {
          competitors: { type: Type.ARRAY, items: { type: Type.STRING } },
          moat: { type: Type.STRING },
          summary: { type: Type.STRING },
          portersFiveForces: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                aspect: { type: Type.STRING },
                strength: { type: Type.STRING, enum: ["Low", "Medium", "High"] },
                comment: { type: Type.STRING },
              },
              required: ["aspect", "strength", "comment"],
            },
          },
        },
        required: ["competitors", "moat", "portersFiveForces", "summary"],
      },
      swotAnalysis: {
        type: Type.OBJECT,
        properties: {
          strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
          weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
          opportunities: { type: Type.ARRAY, items: { type: Type.STRING } },
          threats: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ["strengths", "weaknesses", "opportunities", "threats"],
      },
      companyAnalysis: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          businessModel: { type: Type.STRING },
          productHighlight: { type: Type.STRING },
          teamAssessment: { type: Type.STRING },
          teamMembers: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                role: { type: Type.STRING },
                background: { type: Type.STRING }
              },
              required: ["name", "role", "background"]
            },
          }
        },
        required: ["name", "businessModel", "productHighlight", "teamAssessment", "teamMembers"],
      },
      financialAnalysis: {
        type: Type.OBJECT,
        properties: {
          valuationAssessment: { type: Type.STRING },
          summary: { type: Type.STRING },
          companyValuation: { type: Type.STRING },
          keyMetrics: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                label: { type: Type.STRING },
                value: { type: Type.STRING },
              },
              required: ["label", "value"],
            },
          },
          revenueChartData: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                year: { type: Type.STRING },
                revenue: { type: Type.NUMBER },
                profit: { type: Type.NUMBER },
              },
              required: ["year", "revenue", "profit"],
            },
          },
          comparables: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                code: { type: Type.STRING },
                valuation: { type: Type.STRING },
                multiples: { type: Type.STRING },
                description: { type: Type.STRING },
              },
              required: ["name", "code", "valuation", "multiples", "description"],
            }
          }
        },
        required: ["valuationAssessment", "summary", "keyMetrics", "revenueChartData", "companyValuation", "comparables"],
      },
      growthAndCatalysts: {
        type: Type.OBJECT,
        properties: {
          strategy: { type: Type.STRING },
          catalysts: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ["strategy", "catalysts"],
      },
      riskAssessment: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING },
          risks: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                category: { type: Type.STRING },
                risk: { type: Type.STRING },
                severity: { type: Type.STRING, enum: ["Low", "Medium", "High"] },
                mitigation: { type: Type.STRING },
              },
              required: ["category", "risk", "severity", "mitigation"],
            },
          },
        },
        required: ["summary", "risks"],
      },
      exitStrategy: {
        type: Type.OBJECT,
        properties: {
          paths: { type: Type.ARRAY, items: { type: Type.STRING } },
          timeframe: { type: Type.STRING },
          timeframeRationale: { type: Type.STRING },
          returnsPotential: { type: Type.STRING },
          returnsRationale: { type: Type.STRING },
        },
        required: ["paths", "timeframe", "timeframeRationale", "returnsPotential", "returnsRationale"],
      },
      finalRecommendation: {
        type: Type.OBJECT,
        properties: {
          decision: { type: Type.STRING },
          investmentThesis: { type: Type.STRING },
          dueDiligenceFocus: { 
            type: Type.ARRAY, 
            items: { 
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING },
                priority: { type: Type.STRING, enum: ["High", "Medium", "Low"] }
              },
              required: ["question", "priority"]
            },
          },
        },
        required: ["decision", "investmentThesis", "dueDiligenceFocus"],
      },
    },
    required: [
      "executiveSummary",
      "investmentHighlights",
      "businessDeepDive",
      "marketAnalysis",
      "competitiveLandscape",
      "swotAnalysis",
      "companyAnalysis",
      "financialAnalysis",
      "growthAndCatalysts",
      "riskAssessment",
      "exitStrategy",
      "finalRecommendation",
    ],
  };

  try {
    const base64Data = await fileToBase64(file);

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        { 
          role: "user", 
          parts: [
            { 
              inlineData: {
                mimeType: file.type,
                data: base64Data
              }
            },
            { text: "Analyze this business plan document." }
          ] 
        },
      ],
      config: {
        systemInstruction: SYSTEM_PROMPT,
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });

    const jsonText = response.text;
    if (!jsonText) {
      throw new Error("Empty response from AI");
    }

    return JSON.parse(jsonText) as AnalysisReport;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
