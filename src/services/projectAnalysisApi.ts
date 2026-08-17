export interface ClassificationResult {
  requestType: 'GENERIC' | 'PROJECT_SPECIFIC';
  confidence: number;
  targetEntity: string | null;
  projectType: string;
  reason: string;
}

export interface ExtractedCapability {
  capability: string;
  name: string;
  importance: 'Essential' | 'Recommended' | 'Optional';
  reason: string;
}

export interface ToolMatchResult {
  toolId: string;
  name: string;
  company: string;
  category: string;
  pricingLabel: string;
  relevanceScore: number;
  whyMatches: string;
  satisfiedCapabilities: string[];
  website: string;
}

export interface DiscoveredProject {
  name: string;
  websiteUrl: string;
  repositoryUrl: string;
  similarityPercentage: number;
  similarityLevel: 'Very High' | 'High' | 'Medium' | 'Low';
  whySimilar: string[];
  majorDifferences: string[];
  relevantFeatures: string[];
  stars?: number;
  language?: string;
  source: string;
}

export interface FullProjectAnalysisReport {
  timestamp: string;
  rawInput: string;
  classification: ClassificationResult;
  projectSummary: {
    category: string;
    complexityLevel: 'Low' | 'Medium' | 'High' | 'Very High';
    summary: string;
  };
  architectureSummary?: any;
  techStack?: any[];
  capabilities: ExtractedCapability[];
  recommendedTools: ToolMatchResult[];
  discoveredProjects: DiscoveredProject[];
  webDiscoveryStatus: 'completed' | 'skipped_generic' | 'fallback_no_results' | 'failed';
  buildBlueprint?: any[];
  differentiationEngine?: any;
  testingPlan?: any[];
  deploymentPlan?: any[];
  architectureNodes?: any[];
  securityRisks?: any[];
}

export async function requestIntelligentAnalysis(prompt: string): Promise<FullProjectAnalysisReport> {
  const response = await fetch('/api/project-analysis', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ prompt })
  });

  const rawText = await response.text();
  const trimmed = (rawText || '').trim();

  if (!response.ok || trimmed.startsWith('<') || trimmed.startsWith('<!DOCTYPE')) {
    throw new Error(`Server endpoint returned non-JSON fallback (HTTP ${response.status})`);
  }

  return JSON.parse(rawText);
}
