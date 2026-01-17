
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
  strength: '低' | '中' | '高' | 'Low' | 'Medium' | 'High'; // Support both for safety
  comment: string;
}

export interface CompetitiveDimension {
  dimension: string; 
  companyScore: number; 
  competitorScore: number; 
}

export interface RiskItem {
  category: string;
  risk: string;
  impact: string; 
  severity: '高' | '中' | '低' | 'High' | 'Medium' | 'Low';
  mitigation: string;
}

export interface HighlightItem {
  highlight: string;
  rating: '高' | '中' | 'High' | 'Medium';
}

export interface TeamMember {
  name: string;
  role: string;
  background: string;
}

export interface DueDiligenceItem {
  question: string;
  reasoning: string; 
  priority: '高' | '中' | '低' | 'High' | 'Medium' | 'Low';
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
  summaryPoints: string[]; 
  detailedContent: string; 
  buttonLabel: string; 
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
  maturity: '萌芽期' | '成长期' | '成熟期' | 'Emerging' | 'Growth' | 'Mature';
}

export interface SearchSource {
  title: string;
  url: string;
}

export interface AnalysisReport {
  executiveSummary: {
    coreViewpoints: string[];
    preliminaryVerdict: 'Invest' | 'Watch' | 'Pass'; // Keep internal logic English, map to Chinese in UI
    verdictReason: string;
  };
  investmentHighlights: HighlightItem[];
  businessDeepDive: BusinessDeepDive;
  marketAnalysis: {
    marketSize: string;
    cagr: string;
    drivers: string[];
    customerSegments: string[];
    regulatoryEnvironment: string;
    marketPainPoints: string[];
    techTrends: TechTrendItem[]; 
    summary: string;
  };
  competitiveLandscape: {
    competitors: string[];
    moat: string;
    competitorComparison: CompetitiveDimension[]; 
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
  searchSources?: SearchSource[]; 
}

export interface HistoryItem {
  id: string;
  fileName: string;
  timestamp: number;
  report: AnalysisReport;
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
