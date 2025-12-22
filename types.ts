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
  severity: 'High' | 'Medium' | 'Low';
  mitigation: string;
}

export interface SWOTAnalysis {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

export interface AnalysisReport {
  executiveSummary: {
    coreViewpoints: string[];
    preliminaryVerdict: 'Invest' | 'Watch' | 'Pass';
    verdictReason: string;
  };
  marketAnalysis: {
    marketSize: string;
    cagr: string;
    drivers: string[];
    customerSegments: string[];
    growthChartData: MarketChartData[];
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
    businessModel: string;
    productHighlight: string;
    teamAssessment: string;
  };
  financialAnalysis: {
    revenueChartData: FinancialChartData[];
    keyMetrics: { label: string; value: string }[];
    valuationAssessment: string;
    summary: string;
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
    returnsPotential: string;
  };
  finalRecommendation: {
    decision: string;
    investmentThesis: string;
    keyQuestions: string[];
  };
}

export enum AppStatus {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  COMPLETE = 'COMPLETE',
  ERROR = 'ERROR',
}