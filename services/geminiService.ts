import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AnalysisReport } from "../types";

const SYSTEM_PROMPT = `
You are a senior investment partner at a top VC/PE firm with 20+ years of experience. 
Your task is to analyze the business plan PDF document provided by the user and output a rigorous investment due diligence report.
You must be critical, data-driven, and insightful.

**IMPORTANT: All text content (descriptions, summaries, reasons, lists) MUST be in Simplified Chinese (简体中文).**

Output JSON strictly matching the schema provided. 
If specific data (like exact financial numbers) is missing in the text, make reasonable professional estimates based on the industry context for the chart data points to demonstrate the potential trajectory, but note them as estimates in the text fields.

The specific JSON schema requires:
- executiveSummary: Key points and a verdict (Invest, Watch, Pass).
- marketAnalysis: Market size, CAGR, drivers, customerSegments (target audience), and 'growthChartData' (5 years forecast).
- competitiveLandscape: Competitors, Moat, Porter's 5 Forces analysis.
- swotAnalysis: Strengths, Weaknesses, Opportunities, Threats.
- companyAnalysis: Business model, product, team.
- financialAnalysis: 'revenueChartData' (historical/projected 5 years), key metrics, valuation.
- growthAndCatalysts: Strategy and catalysts.
- riskAssessment: List of specific risks with severity and mitigation.
- exitStrategy: Potential paths and returns.
- finalRecommendation: Investment thesis and tough questions for the founder.

Ensure the tone is professional, concise, and suitable for an Investment Committee memo.
`;

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove data url prefix (e.g. "data:application/pdf;base64,")
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

  // Define the schema using the enum-based Type system requested
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
      marketAnalysis: {
        type: Type.OBJECT,
        properties: {
          marketSize: { type: Type.STRING },
          cagr: { type: Type.STRING },
          drivers: { type: Type.ARRAY, items: { type: Type.STRING } },
          customerSegments: { type: Type.ARRAY, items: { type: Type.STRING } },
          summary: { type: Type.STRING },
          growthChartData: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                year: { type: Type.STRING },
                value: { type: Type.NUMBER },
              },
              required: ["year", "value"],
            },
          },
        },
        required: ["marketSize", "cagr", "drivers", "customerSegments", "growthChartData", "summary"],
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
          businessModel: { type: Type.STRING },
          productHighlight: { type: Type.STRING },
          teamAssessment: { type: Type.STRING },
        },
        required: ["businessModel", "productHighlight", "teamAssessment"],
      },
      financialAnalysis: {
        type: Type.OBJECT,
        properties: {
          valuationAssessment: { type: Type.STRING },
          summary: { type: Type.STRING },
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
        },
        required: ["valuationAssessment", "summary", "keyMetrics", "revenueChartData"],
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
          returnsPotential: { type: Type.STRING },
        },
        required: ["paths", "timeframe", "returnsPotential"],
      },
      finalRecommendation: {
        type: Type.OBJECT,
        properties: {
          decision: { type: Type.STRING },
          investmentThesis: { type: Type.STRING },
          keyQuestions: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ["decision", "investmentThesis", "keyQuestions"],
      },
    },
    required: [
      "executiveSummary",
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