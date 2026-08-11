export interface RequirementItem {
  name: string;
  category: 'Core' | 'Optional' | 'Functional' | 'Non-Functional' | 'Infrastructure' | 'AI';
  description: string;
  status?: 'Inferred' | 'Explicit' | 'Unknown';
}

export interface ProjectUnderstanding {
  projectName?: string;
  category: string;
  targetUsers?: string[];
  problemSolved?: string;
  mainObjective?: string;
  expectedScale?: string;
  complexityLevel: 'Low' | 'Medium' | 'High' | 'Very High';
  requirements: RequirementItem[];
  unknownsOrClarifications?: string[];
}

export interface TechStackItem {
  layer: 'Frontend' | 'Backend' | 'Database' | 'Storage' | 'Authentication' | 'Deployment' | 'Infrastructure';
  recommendation: string;
  reason: string;
  advantages: string[];
  disadvantages: string[];
  alternative: string;
  whyAlternativeNotSelected: string;
}

export interface AICapability {
  capability: string;
  relevanceReason: string;
  importance: 'Essential' | 'Recommended' | 'Optional';
}

export interface EcosystemToolMatch {
  requirement: string;
  isEcosystemTool: boolean;
  toolId?: string;
  toolName: string;
  company?: string;
  pricingLabel?: string;
  website?: string;
  reason: string;
  capabilityMatched: string;
}

export interface SimilarProduct {
  name: string;
  websiteUrl: string;
  similarityLevel: 'Very High' | 'High' | 'Medium' | 'Low' | 'Very Low';
  similarityPercentage: number;
  whySimilar: string;
  majorDifferences: string[];
  relevantFeatures: string[];
  competitiveThreat?: 'High' | 'Medium' | 'Low';
  isLiveSource: boolean;
}

export interface OriginalityAnalysis {
  originalityRating: 'High Originality' | 'Moderate Originality' | 'Iterative Improvement' | 'Established Category';
  estimatedSimilarityScore: number;
  marketCompetitionLevel: 'Low' | 'Moderate' | 'High' | 'Saturated';
  technicalNovelty: string;
  potentialDifferentiation: string[];
  disclaimer: string;
}

export interface ArchitectureNode {
  id: string;
  name: string;
  layer: string;
  description: string;
  connectedTo: string[];
}

export interface SecurityRisk {
  category: string;
  riskLevel: 'Critical' | 'High' | 'Medium' | 'Low';
  description: string;
  mitigationStrategy: string;
}

export interface ComplexityItem {
  tier: string;
  level: 'Low' | 'Medium' | 'High' | 'Very High';
  explanation: string;
}

export interface CostComplexityAssessment {
  overallComplexity: 'Low' | 'Medium' | 'High' | 'Very High';
  tiers: ComplexityItem[];
  estimatedCostNotes: string;
}

export interface RoadmapPhase {
  phase: string;
  title: string;
  durationEstimate: string;
  keyDeliverables: string[];
}

export interface FinalVerdict {
  feasibilityScore: number;
  feasibilityRating: 'Feasible' | 'Highly Feasible' | 'Challenging' | 'High Risk';
  technicalComplexity: 'Low' | 'Medium' | 'High' | 'Very High';
  marketCompetition: string;
  originalitySummary: string;
  recommendedApproach: string;
  biggestRisk: string;
  bestFirstMVP: string;
  finalRecommendation: string;
}

export interface PricingTierProposal {
  tierName: string;
  pricePoint: string;
  description: string;
  targetAudience: string;
}

export interface FinancialProjections {
  monetizationModel: string;
  suggestedTiers: PricingTierProposal[];
  estMonthlyInfraCost: string;
  estTokenCostPerUser: string;
  cacStrategy: string;
  breakEvenTarget: string;
}

export interface ComplianceItem {
  regulation: string;
  status: 'Required' | 'Recommended' | 'Conditional';
  impactDescription: string;
  requiredAction: string;
}

export interface PromptArchitecture {
  systemPromptTitle: string;
  roleDefinition: string;
  inputFormat: string;
  outputGuards: string[];
  rawPromptTemplate: string;
}

export interface ThirdPartyAPIItem {
  name: string;
  category: 'Payment' | 'Messaging' | 'Vector DB' | 'AI Inference' | 'Analytics' | 'Storage';
  purpose: string;
  integrationDifficulty: 'Easy' | 'Moderate' | 'Complex';
  websiteUrl: string;
}

export interface UserJourneyStep {
  stepNumber: number;
  stageName: string;
  userAction: string;
  systemBehavior: string;
  aiInvolvement: string;
}

export interface ArchitectureTypeSummary {
  classification: 'Frontend-Only (Client-Side)' | 'Frontend + API Proxy / Serverless' | 'Full-Stack (Frontend + Backend + DB)';
  isFrontendOnly: boolean;
  requiresBackend: boolean;
  requiresDatabase: boolean;
  requiresStorage: boolean;
  requiresAuth: boolean;
  reasoning: string;
}

export interface CompleteAnalysisReport {
  timestamp: string;
  rawInput: string;
  understanding: ProjectUnderstanding;
  architectureSummary: ArchitectureTypeSummary;
  techStack: TechStackItem[];
  aiStack: AICapability[];
  ecosystemTools: EcosystemToolMatch[];
  existingProducts: SimilarProduct[];
  searchDisclaimer: string;
  existsOnInternetSummary?: string;
  architectureNodes: ArchitectureNode[];
  securityRisks: SecurityRisk[];
}
