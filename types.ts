
export interface MarketChartData {
  year: string;
  value: number;
}

export interface FinancialChartData {
  year: string;
  revenue: number;
  profit: number;
}

export interface PortersForce {
  aspect: string;
  strength: 'Low' | 'Medium' | 'High';
  comment: string;
}

export interface RiskItem {
  category: string;
  risk: string;
  impact: string; // Detailed description of the potential business impact
  severity: 'High' | 'Medium' | 'Low';
  mitigation: string;
}

export interface HighlightItem {
  highlight: string;
  rating: 'High' | 'Medium';
}

export interface TeamMember {
  name: string;
  role: string;
  background: string;
}

export interface DueDiligenceItem {
  question: string;
  priority: 'High' | 'Medium' | 'Low';
}

export interface SWOTAnalysis {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

export interface ComparableCompany {
  name: string;
  code: string;
  valuation: string;
  multiples: string;
  description: string;
}

export interface DeepDiveItem {
  summaryPoints: string[]; // Logically independent core points
  detailedContent: string; // Full detailed content for the floating window
  buttonLabel: string; // Context-aware label (e.g., "View Technical Specs")
}

export interface BusinessDeepDive {
  technicalSolution: DeepDiveItem; 
  productPortfolio: DeepDiveItem;  
  commercializationPath: DeepDiveItem; 
  operationalStrengths: DeepDiveItem; 
}

export interface TechTrendItem {
  name: string;
  description: string;
  maturity: 'Emerging' | 'Growth' | 'Mature';
}

export interface SearchSource {
  title: string;
  url: string;
}

export interface AnalysisReport {
  executiveSummary: {
    coreViewpoints: string[];
    preliminaryVerdict: 'Invest' | 'Watch' | 'Pass';
    verdictReason: string;
  };
  investmentHighlights: HighlightItem[];
  // New Section: Business Deep Dive with Layered Content
  businessDeepDive: BusinessDeepDive;
  marketAnalysis: {
    marketSize: string;
    cagr: string;
    drivers: string[];
    customerSegments: string[];
    regulatoryEnvironment: string;
    marketPainPoints: string[];
    techTrends: TechTrendItem[]; // Updated to structured object array
    summary: string;
  };
  competitiveLandscape: {
    competitors: string[];
    moat: string;
    portersFiveForces: PortersForce[];
    summary: string;
  };
  swotAnalysis: SWOTAnalysis;
  companyAnalysis: {
    name: string;
    businessModel: string;
    productHighlight: string;
    teamAssessment: string;
    teamMembers: TeamMember[];
  };
  financialAnalysis: {
    revenueChartData: FinancialChartData[];
    keyMetrics: { label: string; value: string }[];
    valuationAssessment: string;
    summary: string;
    companyValuation: string;
    comparables: ComparableCompany[];
  };
  growthAndCatalysts: {
    strategy: string;
    catalysts: string[];
  };
  riskAssessment: {
    risks: RiskItem[];
    summary: string;
  };
  exitStrategy: {
    paths: string[];
    timeframe: string;
    timeframeRationale: string;
    returnsPotential: string;
    returnsRationale: string;
  };
  finalRecommendation: {
    decision: string;
    investmentThesis: string;
    dueDiligenceFocus: DueDiligenceItem[];
  };
  searchSources?: SearchSource[]; // New field for external references
}

export enum AppStatus {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  COMPLETE = 'COMPLETE',
  ERROR = 'ERROR',
}

export interface ApiSettings {
  deepSeekKey: string;
  tavilyKey: string;
}

export const DEFAULT_SETTINGS: ApiSettings = {
  deepSeekKey: "sk-e61e02ac831c487d880725e7cc6d3567",
  tavilyKey: "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"
};
