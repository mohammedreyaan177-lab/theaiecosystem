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
  relevanceScore?: number;
}

export interface SimilarProduct {
  name: string;
  websiteUrl: string;
  repositoryUrl?: string;
  similarityLevel: 'Very High' | 'High' | 'Medium' | 'Low' | 'Very Low';
  similarityPercentage: number;
  whySimilar: string;
  whySimilarList?: string[];
  majorDifferences: string[];
  relevantFeatures: string[];
  competitiveThreat?: 'High' | 'Medium' | 'Low';
  isLiveSource: boolean;
  stars?: number;
  language?: string;
  source?: string;
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

export interface DiscoveredGuide {
  title: string;
  url: string;
  type: 'OFFICIAL_DOCS' | 'TUTORIAL' | 'VIDEO' | 'GITHUB_EXAMPLE' | 'ARTICLE';
  source: string;
  relevance: number;
  whyUseful: string;
}

export interface BuildPhase {
  phaseNumber: number;
  title: string;
  goal: string;
  dependencies: string[];
  tasks: string[];
  likelyFiles: string[];
  expectedResult: string;
  testCases: string[];
  guides: DiscoveredGuide[];
}

export interface ComparisonMatrixItem {
  feature: string;
  existingProjectsHas: boolean;
  userProjectHas: boolean;
  status: string;
}

export interface DifferentiationOpportunity {
  rank: number;
  title: string;
  impactLevel: 'HIGH IMPACT' | 'MEDIUM IMPACT' | 'LOW IMPACT';
  whyValue: string;
  implementationComplexity: string;
  relevantCapabilities: string[];
}

export interface ReferenceGuidanceItem {
  projectName: string;
  repositoryUrl: string;
  stars: number;
  architectureUtility: string;
  ethicalNote: string;
}

export interface DifferentiationEngineResult {
  matrix: ComparisonMatrixItem[];
  differentiators: DifferentiationOpportunity[];
  referenceGuidance: ReferenceGuidanceItem[];
  antiCopyingPolicy: string;
}

export interface TestingPlanItem {
  category: string;
  testName: string;
  command: string;
}

export interface DeploymentChecklistItem {
  step: number;
  action: string;
  recommendation: string;
}

export interface CompleteAnalysisReport {
  timestamp: string;
  rawInput: string;
  classification?: ClassificationResult;
  understanding: ProjectUnderstanding;
  architectureSummary?: ArchitectureTypeSummary;
  techStack: TechStackItem[];
  aiStack: AICapability[];
  capabilities?: ExtractedCapability[];
  ecosystemTools: EcosystemToolMatch[];
  recommendedTools?: ToolMatchResult[];
  existingProducts: SimilarProduct[];
  discoveredProjects?: DiscoveredProject[];
  searchDisclaimer: string;
  existsOnInternetSummary?: string;
  webDiscoveryStatus?: 'completed' | 'skipped_generic' | 'fallback_no_results' | 'failed';
  buildBlueprint?: BuildPhase[];
  differentiationEngine?: DifferentiationEngineResult;
  testingPlan?: TestingPlanItem[];
  deploymentPlan?: DeploymentChecklistItem[];
  architectureNodes: ArchitectureNode[];
  securityRisks: SecurityRisk[];
}
