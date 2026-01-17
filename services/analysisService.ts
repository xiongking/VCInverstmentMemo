
import { AnalysisReport, ApiSettings, SearchSource } from "../types";
// @ts-ignore
import * as pdfjsDist from 'https://esm.sh/pdfjs-dist@2.16.105';

// Handle esm.sh export structure: access .default if available
const pdfjsLib = pdfjsDist.default || pdfjsDist;

// Initialize PDF.js worker
if (pdfjsLib.GlobalWorkerOptions) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://esm.sh/pdfjs-dist@2.16.105/build/pdf.worker.min.js';
}

const DEEPSEEK_API_URL = "https://api.deepseek.com/chat/completions";
const TAVILY_API_URL = "https://api.tavily.com/search";

// --- Helper: Extract Text from PDF ---
async function extractPdfText(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    // pdfjsLib.getDocument returns a task object with a promise property in v2
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    let fullText = '';
    
    // Limit to first 15 pages to ensure we capture the essence without blowing context too early
    const maxPages = Math.min(pdf.numPages, 15);
    
    for (let i = 1; i <= maxPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item: any) => item.str).join(' ');
        fullText += `--- Page ${i} ---\n${pageText}\n\n`;
    }
    return fullText;
  } catch (e) {
    console.error("PDF Extraction Failed", e);
    throw new Error("PDF parsing failed. Please ensure the file is a valid PDF.");
  }
}

// --- Helper: Tavily Search ---
// Now returns both the context string and the raw source objects
async function searchTavily(query: string, apiKey: string): Promise<{ context: string, sources: SearchSource[] }> {
  if (!apiKey || apiKey.length < 5) return { context: "", sources: [] };
  
  try {
    const response = await fetch(TAVILY_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: apiKey,
        query: query,
        search_depth: "advanced", // Use advanced for deeper results
        include_answer: true,
        max_results: 5 // Get more results per topic
      })
    });
    
    const data = await response.json();
    if (data.results) {
      const sources: SearchSource[] = data.results.map((r: any) => ({
        title: r.title,
        url: r.url
      }));

      const context = data.results.map((r: any) => `Source: ${r.title} (${r.url})\nSnippet: ${r.content}`).join("\n---\n");
      
      return { context, sources };
    }
    return { context: "", sources: [] };
  } catch (e) {
    console.warn(`Tavily search failed for query: ${query}`, e);
    return { context: "", sources: [] };
  }
}

// --- Helper: DeepSeek Chat ---
async function callDeepSeek(messages: any[], apiKey: string, jsonMode: boolean = true): Promise<string> {
  const response = await fetch(DEEPSEEK_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: "deepseek-chat", 
      messages: messages,
      temperature: 0.2, // Lower temperature for more analytical output
      response_format: jsonMode ? { type: "json_object" } : { type: "text" },
      max_tokens: 8000
    })
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`DeepSeek API Error: ${response.status} - ${err}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

// --- STORM IMPLEMENTATION: Generate Diligence Questions ---
async function generateStormQuestions(pdfText: string, apiKey: string): Promise<string[]> {
  const prompt = `
    You are a Lead Investor initiating a Due Diligence process (Storm Methodology).
    Read the following Business Plan snippet and identify 3-4 critical "Knowledge Gaps" or areas that need external validation.
    
    Focus on:
    1. Validation of Market Size (TAM) claims.
    2. Competitive Landscape (who are the REAL competitors outside this doc?).
    3. Technical or Regulatory Risks.
    
    Return a JSON object with a "queries" array containing 3-4 specific search queries optimized for a search engine.
    
    BP Snippet:
    ${pdfText.slice(0, 3000)}...
    
    Example Output:
    { "queries": ["Global market size of humanoid robots 2024 report", "Tesla Optimus vs Figure AI technical comparison", "China humanoid robot supply chain policy 2025"] }
  `;

  try {
    const res = await callDeepSeek([{ role: "user", content: prompt }], apiKey, true);
    const parsed = JSON.parse(res);
    return parsed.queries || ["Market analysis trends", "Competitor landscape", "Industry risks"];
  } catch (e) {
    console.warn("Storm Question Generation failed, using fallbacks.");
    return ["Industry market size and growth rate 2024", "Key competitors in this space", "Recent regulatory changes in this industry"];
  }
}

// --- MAIN ANALYSIS FUNCTION ---

const ANALYSIS_SYSTEM_PROMPT = `
You are a senior investment partner at a top VC/PE firm (like Sequoia, Benchmark, or Andreessen Horowitz).
Your task is to synthesize information from the Internal Business Plan and External Storm Research to produce a **rigorous, fact-based** Investment Memo.

**STORM SYNTHESIS INSTRUCTIONS:**
1.  **Fact-Check**: Explicitly contrast the "Company Claims" (from BP) with "External Reality" (from Search Context). If they differ, highlight the risk.
2.  **Deep Dive**: For technical/product sections, separate high-level summaries from deep technical specs.
3.  **Risk Analysis**: You MUST identify **6-8 distinct risks**. For each risk, specifically detail the 'impact' (e.g., potential revenue loss, legal fines) and a concrete 'mitigation' plan.
4.  **Due Diligence (Q&A)**:
    *   Generate **10-15 specific, high-priority questions** that an investment associate must answer before the Investment Committee (IC) meeting.
    *   **Specificity is key**: Do not ask generic questions like "Is the team good?". Ask "Verify CTO's previous tenure at [Competitor] and specifically their role in the [Project Name] launch." or "Request raw data for the 500-hour durability test mentioned on slide 12".
    *   **Reasoning**: For each question, provide a detailed explanation of *why* this verification is critical and what risk it addresses.
    *   Link questions to the **Risks** and **Market Gaps** identified.
5.  **Competitive Radar**: Identify 6 key dimensions of competition (e.g., Tech Moat, Cost Efficiency, Brand, Supply Chain, Team, Time-to-Market). Score the Target Company vs. Market Average (1-10 scale).

**FORMATTING RULES:**
*   Language: Simplified Chinese (简体中文).
*   Units: Use Chinese units (万, 亿).
*   Output: Valid JSON strictly matching the schema.

**SCHEMA DEFINITION**:
{
  "executiveSummary": { "coreViewpoints": ["string"], "preliminaryVerdict": "Invest" | "Watch" | "Pass", "verdictReason": "string" },
  "investmentHighlights": [{ "highlight": "string", "rating": "High" | "Medium" }],
  "businessDeepDive": {
     "technicalSolution": { "summaryPoints": ["string"], "detailedContent": "string", "buttonLabel": "string" },
     "productPortfolio": { "summaryPoints": ["string"], "detailedContent": "string", "buttonLabel": "string" },
     "commercializationPath": { "summaryPoints": ["string"], "detailedContent": "string", "buttonLabel": "string" },
     "operationalStrengths": { "summaryPoints": ["string"], "detailedContent": "string", "buttonLabel": "string" }
  },
  "marketAnalysis": {
    "marketSize": "string", "cagr": "string", "drivers": ["string"], "customerSegments": ["string"], "regulatoryEnvironment": "string", "marketPainPoints": ["string"], "summary": "string",
    "techTrends": [{ "name": "string", "description": "string", "maturity": "Emerging" | "Growth" | "Mature" }]
  },
  "competitiveLandscape": { 
    "competitors": ["string"], 
    "moat": "string", 
    "summary": "string", 
    "competitorComparison": [{ "dimension": "string", "companyScore": number, "competitorScore": number }],
    "portersFiveForces": [{ "aspect": "string", "strength": "Low" | "Medium" | "High", "comment": "string" }] 
  },
  "swotAnalysis": { "strengths": ["string"], "weaknesses": ["string"], "opportunities": ["string"], "threats": ["string"] },
  "companyAnalysis": { "name": "string", "businessModel": "string", "productHighlight": "string", "teamAssessment": "string", "teamMembers": [{ "name": "string", "role": "string", "background": "string" }] },
  "financialAnalysis": {
    "valuationAssessment": "string", "summary": "string", "companyValuation": "string",
    "keyMetrics": [{ "label": "string", "value": "string" }],
    "revenueChartData": [{ "year": "string", "revenue": number, "profit": number }],
    "comparables": [{ "name": "string", "code": "string", "valuation": "string", "multiples": "string", "description": "string" }]
  },
  "growthAndCatalysts": { "strategy": "string", "catalysts": ["string"] },
  "riskAssessment": { 
    "summary": "string", 
    "risks": [{ 
      "category": "string", 
      "risk": "string", 
      "impact": "string", 
      "severity": "Low" | "Medium" | "High", 
      "mitigation": "string" 
    }] 
  },
  "exitStrategy": { "paths": ["string"], "timeframe": "string", "timeframeRationale": "string", "returnsPotential": "string", "returnsRationale": "string" },
  "finalRecommendation": { "decision": "string", "investmentThesis": "string", "dueDiligenceFocus": [{ "question": "string", "reasoning": "string", "priority": "High" | "Medium" | "Low" }] }
}
`;

export const analyzeBusinessPlanDeepSeek = async (file: File, settings: ApiSettings): Promise<AnalysisReport> => {
  // Step 1: Extract Text
  console.log("Step 1: Extracting PDF Text...");
  const pdfText = await extractPdfText(file);
  const truncatedPdfText = pdfText.slice(0, 50000); 

  // Step 2: STORM - Perspective Discovery (Generate Questions)
  console.log("Step 2: STORM - Generating Multi-perspective Queries...");
  const stormQueries = await generateStormQuestions(truncatedPdfText, settings.deepSeekKey);
  console.log("Generated Storm Queries:", stormQueries);

  // Step 3: STORM - Parallel Retrieval
  console.log("Step 3: STORM - Executing Parallel Deep Search...");
  let combinedSearchContext = "";
  let allSearchSources: SearchSource[] = [];
  
  if (settings.tavilyKey) {
    const searchPromises = stormQueries.map(async (query) => {
       const { context, sources } = await searchTavily(query, settings.tavilyKey);
       return { context: `### Perspective: ${query}\n${context}\n`, sources };
    });
    
    const searchResults = await Promise.all(searchPromises);
    
    // Combine contexts
    combinedSearchContext = searchResults.map(r => r.context).join("\n\n");
    
    // Combine and Deduplicate Sources
    const seenUrls = new Set();
    searchResults.forEach(r => {
      r.sources.forEach(source => {
        if (!seenUrls.has(source.url)) {
          seenUrls.add(source.url);
          allSearchSources.push(source);
        }
      });
    });

  } else {
    combinedSearchContext = "No external search available (API Key missing). Relying solely on internal logic.";
  }

  // Step 4: STORM - Synthesis & Report Generation
  console.log("Step 4: DeepSeek Synthesis...");
  const userPrompt = `
    [INTERNAL DOCUMENT - BUSINESS PLAN]
    """
    ${truncatedPdfText}
    """

    [EXTERNAL STORM RESEARCH - GROUND TRUTH]
    """
    ${combinedSearchContext}
    """

    Based on the above, generate the Investment Memo JSON. 
    Critically compare the Internal Document claims against the External Storm Research.
  `;

  const finalRes = await callDeepSeek(
    [
      { role: "system", content: ANALYSIS_SYSTEM_PROMPT },
      { role: "user", content: userPrompt }
    ],
    settings.deepSeekKey,
    true
  );

  const cleanJson = finalRes.replace(/```json/g, "").replace(/```/g, "").trim();
  const parsedReport = JSON.parse(cleanJson);

  // Inject the actual search sources into the report
  return {
    ...parsedReport,
    searchSources: allSearchSources
  } as AnalysisReport;
};
