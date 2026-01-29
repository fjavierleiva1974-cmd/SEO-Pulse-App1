
export enum Intent {
  INFORMATIONAL = 'Informational',
  NAVIGATIONAL = 'Navigational',
  COMMERCIAL = 'Commercial',
  TRANSACTIONAL = 'Transactional'
}

export interface KeywordMetric {
  keyword: string;
  volume: number;
  difficulty: number;
  cpc: number;
  intent: Intent;
  trend: number[];
}

export interface KeywordIdea {
  keyword: string;
  intent: Intent;
  volume: number;
  difficulty: number;
}

export interface SERPResult {
  rank: number;
  title: string;
  url: string;
  as: number;
  traffic: number;
  keywords: number;
}

export interface KeywordAnalysis {
  mainKeyword: KeywordMetric;
  variations: KeywordIdea[];
  questions: KeywordIdea[];
  related: KeywordIdea[];
  serp: SERPResult[];
}

export interface DomainAnalysis {
  domain: string;
  authorityScore: number;
  organicTraffic: number;
  backlinks: number;
  displayAds: number;
  trafficTrend: { month: string; value: number }[];
  topKeywords: { keyword: string; pos: number; volume: number; traffic: number }[];
  mainCompetitors: { domain: string; commonKeywords: number; traffic: number }[];
}

export type ViewMode = 'keyword-overview' | 'domain-overview';

export interface SearchHistory {
  query: string;
  type: ViewMode;
  timestamp: number;
}
