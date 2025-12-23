
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AnalysisReport } from "../types";

const SYSTEM_PROMPT = `
You are a senior investment partner at a top VC/PE firm (like Sequoia, Benchmark, or Andreessen Horowitz) with 20+ years of experience. 
Your task is to analyze the business plan PDF document provided by the user and output a **comprehensive, rigorously detailed** investment due diligence report.

**CRITICAL INSTRUCTIONS FOR CONTENT DEPTH & FORMATTING:**

1.  **DEEP DIVE SECTION (NEW & CRITICAL)**: You must create a "Deep Business & Tech Analysis" section. 
    *   **Do NOT summarize** this section into bullet points. Use long, descriptive paragraphs.
    *   **Technical Solution**: Extract specific technical parameters, patents, architecture, or scientific principles mentioned.
    *   **Product Portfolio**: List specific product names, SKUs, or service lines with their detailed descriptions.
    *   **Commercialization**: Explain *exactly* how they sell, price, and deliver (sales channels, unit economics if avail).
2.  **TEAM MEMBERS**: Extract **ALL** available details for core team members. Include full background, past companies, education.
3.  **STRICT CHINESE FORMATTING (CRITICAL)**: 
    *   **Language**: All output must be in Simplified Chinese (简体中文).
    *   **No Redundant English**: Do NOT include English translations in brackets for Chinese terms. 
        *   **Correct**: "科创板", "纳斯达克". 
        *   **Incorrect**: "科创板(Star Market)", "人工智能(AI)".
    *   **Currency & Numbers**: Use **Chinese units** (万, 亿) strictly. **NEVER** use "M", "K", "B" suffixes with currency symbols like "¥".
        *   **Correct**: "1500万元", "4亿元", "1000万美元", "投后估值4000万".
        *   **Incorrect**: "¥15M", "¥400M", "$10M", "1500万(≈¥15M)".
    *   **Valuation Conversion**: If the valuation is NOT in CNY, provide the converted CNY value in brackets using Chinese units (e.g., "1000万美元 (约7200万元)").
4.  **COMPARABLE COMPANIES**: If a comparable company is private/unlisted, the 'code' field MUST be "未上市".
5.  **EXIT STRATEGY**: Provide both the Timeframe and Returns Potential, and for **BOTH**, provide a detailed "Rationale" (calculation basis or market logic).

**Output JSON strictly matching the schema provided.**

The specific JSON schema requires:
- executiveSummary: Key points and a verdict.
- investmentHighlights: List of 4-6 highlights with ratings.
- companyAnalysis: Name, high-level summaries, and teamMembers.
- **businessDeepDive**: Detailed Tech, Product, Commercialization, Operations. (Detailed strings).
- marketAnalysis: Size, CAGR, Drivers, regulatoryEnvironment, marketPainPoints, summary.
- competitiveLandscape: Competitors, Moat, Detailed Porter's 5 Forces.
- swotAnalysis: SWOT.
- financialAnalysis: Metrics, valuation (w/ conversion), comparables (code="未上市" if private).
- growthAndCatalysts: Strategy.
- riskAssessment: Detailed risks with Chinese Categories.
- exitStrategy: Paths, timeframe, **timeframeRationale**, returnsPotential, **returnsRationale**.
- finalRecommendation: Thesis and dueDiligenceFocus.
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
            highlight: { type: Type.STRING, description: "A specific, detailed highlight (2-3 sentences)." },
            rating: { type: Type.STRING, enum: ["High", "Medium"] }
          },
          required: ["highlight", "rating"]
        },
        description: "List of 4-6 key investment highlights with impact ratings."
      },
      businessDeepDive: {
        type: Type.OBJECT,
        properties: {
          technicalSolution: { type: Type.STRING, description: "Extremely detailed description of technology/IP/Architecture (200+ words)." },
          productPortfolio: { type: Type.STRING, description: "Detailed list and description of products/services (200+ words)." },
          commercializationPath: { type: Type.STRING, description: "Detailed business model, sales strategy, pricing (200+ words)." },
          operationalStrengths: { type: Type.STRING, description: "Operations, supply chain, manufacturing, or delivery capabilities." },
        },
        required: ["technicalSolution", "productPortfolio", "commercializationPath", "operationalStrengths"],
      },
      marketAnalysis: {
        type: Type.OBJECT,
        properties: {
          marketSize: { type: Type.STRING, description: "Use Chinese units (e.g. 100亿元)." },
          cagr: { type: Type.STRING },
          drivers: { type: Type.ARRAY, items: { type: Type.STRING } },
          customerSegments: { type: Type.ARRAY, items: { type: Type.STRING } },
          regulatoryEnvironment: { type: Type.STRING, description: "Analysis of policy and regulation." },
          marketPainPoints: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of key market pain points." },
          summary: { type: Type.STRING, description: "A detailed paragraph (100+ words) analyzing industry structure." },
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
        required: ["marketSize", "cagr", "drivers", "customerSegments", "growthChartData", "summary", "regulatoryEnvironment", "marketPainPoints"],
      },
      competitiveLandscape: {
        type: Type.OBJECT,
        properties: {
          competitors: { type: Type.ARRAY, items: { type: Type.STRING } },
          moat: { type: Type.STRING, description: "Detailed analysis of the competitive moat." },
          summary: { type: Type.STRING, description: "Detailed competitive analysis." },
          portersFiveForces: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                aspect: { type: Type.STRING, description: "Must be in Chinese (e.g., 供应商议价能力). NO English." },
                strength: { type: Type.STRING, enum: ["Low", "Medium", "High"] },
                comment: { type: Type.STRING, description: "Full detailed explanation, NO truncation." },
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
          name: { type: Type.STRING, description: "The full name of the company being analyzed." },
          businessModel: { type: Type.STRING, description: "Summary of business model." },
          productHighlight: { type: Type.STRING, description: "Summary of product highlight." },
          teamAssessment: { type: Type.STRING, description: "Critical assessment of team completeness." },
          teamMembers: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                role: { type: Type.STRING },
                background: { type: Type.STRING, description: "Detailed bio, history, education, previous companies." }
              },
              required: ["name", "role", "background"]
            },
            description: "List of specific team members found in the document."
          }
        },
        required: ["name", "businessModel", "productHighlight", "teamAssessment", "teamMembers"],
      },
      financialAnalysis: {
        type: Type.OBJECT,
        properties: {
          valuationAssessment: { type: Type.STRING },
          summary: { type: Type.STRING },
          companyValuation: { type: Type.STRING, description: "Valuation using Chinese units (万/亿). No English symbols like 'M'." },
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
                code: { type: Type.STRING, description: "Stock code or '未上市' if private." },
                valuation: { type: Type.STRING, description: "Use Chinese units (万/亿)." },
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
                category: { type: Type.STRING, description: "Risk Category in Chinese (e.g. 市场风险, 研发风险)." },
                risk: { type: Type.STRING, description: "Detailed explanation of the risk." },
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
          paths: { type: Type.ARRAY, items: { type: Type.STRING, description: "No English redundancy." } },
          timeframe: { type: Type.STRING },
          timeframeRationale: { type: Type.STRING, description: "Reasoning for the estimated timeframe." },
          returnsPotential: { type: Type.STRING },
          returnsRationale: { type: Type.STRING, description: "Basis for returns calculation." },
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
                question: { type: Type.STRING, description: "A detailed paragraph explaining the concern." },
                priority: { type: Type.STRING, enum: ["High", "Medium", "Low"] }
              },
              required: ["question", "priority"]
            },
            description: "10-15 specific check points with priorities." 
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
