import React, { useState } from 'react';
import { CompleteAnalysisReport } from '../types';
import { runProjectAnalysis, ToolData } from '../services/analysisEngine';
import { requestIntelligentAnalysis } from '../../services/projectAnalysisApi';
import { ProjectAnalysisForm } from './ProjectAnalysisForm';
import { LoadingAnalysisView } from './LoadingAnalysisView';
import { AnalysisResultsView } from './AnalysisResultsView';
import { BrainCircuit, AlertCircle, RotateCcw } from 'lucide-react';
import '../styles/projectAnalysis.css';

interface ProjectAnalysisPageProps {
  tools?: ToolData[];
  categories?: any[];
}

export const ProjectAnalysisPage: React.FC<ProjectAnalysisPageProps> = ({ tools = [] }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [report, setReport] = useState<CompleteAnalysisReport | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleStartAnalysis = async (userPrompt: string) => {
    setIsLoading(true);
    setErrorMsg(null);

    try {
      // Try backend intelligent analysis API first
      const fullReport = await requestIntelligentAnalysis(userPrompt);

      // Map backend report to CompleteAnalysisReport structure
      const mappedReport: CompleteAnalysisReport = {
        timestamp: fullReport.timestamp,
        rawInput: fullReport.rawInput,
        classification: fullReport.classification,
        architectureSummary: fullReport.architectureSummary,
        understanding: {
          category: fullReport.projectSummary.category,
          complexityLevel: fullReport.projectSummary.complexityLevel,
          requirements: (fullReport.capabilities || []).map(c => ({
            name: c.name,
            category: 'Core',
            description: c.reason,
            status: 'Explicit'
          }))
        },
        techStack: fullReport.techStack || [
          {
            layer: 'Frontend',
            recommendation: 'React / Next.js with TypeScript & Tailwind CSS',
            reason: 'High-performance interactive web application framework.',
            advantages: ['Server-side rendering', 'Component modularity'],
            disadvantages: ['Framework learning curve'],
            alternative: 'Vite + React SPA',
            whyAlternativeNotSelected: 'Next.js provides hybrid rendering and API proxies.'
          }
        ],
        aiStack: (fullReport.capabilities || []).map(c => ({
          capability: c.name,
          relevanceReason: c.reason,
          importance: c.importance
        })),
        capabilities: fullReport.capabilities,
        ecosystemTools: (fullReport.recommendedTools || []).map(t => ({
          requirement: t.satisfiedCapabilities.join(', '),
          isEcosystemTool: true,
          toolId: t.toolId,
          toolName: t.name,
          company: t.company,
          pricingLabel: t.pricingLabel,
          website: t.website,
          reason: t.whyMatches,
          capabilityMatched: t.satisfiedCapabilities.join(', '),
          relevanceScore: t.relevanceScore
        })),
        recommendedTools: fullReport.recommendedTools,
        existingProducts: (fullReport.discoveredProjects || []).map(p => ({
          name: p.name,
          websiteUrl: p.websiteUrl,
          repositoryUrl: p.repositoryUrl,
          similarityLevel: p.similarityLevel,
          similarityPercentage: p.similarityPercentage,
          whySimilar: p.whySimilar.join(' '),
          whySimilarList: p.whySimilar,
          majorDifferences: p.majorDifferences,
          relevantFeatures: p.relevantFeatures,
          isLiveSource: true,
          stars: p.stars,
          language: p.language,
          source: p.source
        })),
        discoveredProjects: fullReport.discoveredProjects,
        searchDisclaimer: fullReport.classification.requestType === 'PROJECT_SPECIFIC'
          ? `Discovered ${fullReport.discoveredProjects.length} real open-source repositories and online projects related to ${fullReport.classification.targetEntity || 'your target'}.`
          : 'Generic request category analyzed. Web discovery skipped for general application concepts.',
        existsOnInternetSummary: fullReport.classification.reason,
        webDiscoveryStatus: fullReport.webDiscoveryStatus,
        buildBlueprint: fullReport.buildBlueprint,
        differentiationEngine: fullReport.differentiationEngine,
        testingPlan: fullReport.testingPlan,
        deploymentPlan: fullReport.deploymentPlan,
        architectureNodes: (fullReport.architectureNodes && fullReport.architectureNodes.length > 0)
          ? fullReport.architectureNodes
          : fullReport.architectureSummary?.isFrontendOnly
          ? [
              { id: '1', name: 'Web Client SPA', layer: 'Frontend Tier', description: 'React SPA / Client-side App', connectedTo: ['2'] },
              { id: '2', name: 'Static CDN Hosting', layer: 'Deployment Tier', description: 'Vercel / Cloudflare Pages CDN', connectedTo: [] }
            ]
          : [
              { id: '1', name: 'Web Client', layer: 'Frontend', description: 'React SPA / Next.js frontend', connectedTo: ['2'] },
              { id: '2', name: 'API Server', layer: 'Backend', description: 'Express REST API gateway', connectedTo: ['3', '4'] },
              { id: '3', name: 'Postgres DB', layer: 'Database', description: 'Relational database persistence', connectedTo: [] },
              { id: '4', name: 'AI Services', layer: 'AI Inference', description: 'Ecosystem AI models & vector APIs', connectedTo: [] }
            ],
        securityRisks: (fullReport.securityRisks && fullReport.securityRisks.length > 0)
          ? fullReport.securityRisks
          : [
              { category: 'Authentication & API Security', riskLevel: 'Medium', description: 'API key exposure or unauthenticated endpoints.', mitigationStrategy: 'Enforce environment variables server-side and CORS restrictions.' }
            ]
      };

      setReport(mappedReport);
    } catch (apiErr) {
      console.warn('[Project Analysis] API fallback to local analysis:', apiErr);
      try {
        const fallbackResult = await runProjectAnalysis(userPrompt, tools);
        setReport(fallbackResult);
      } catch (err: any) {
        console.error('Project Analysis Error:', err);
        setErrorMsg('An unexpected error occurred while analyzing your project. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setReport(null);
    setErrorMsg(null);
  };

  return (
    <div className="project-analysis-page">
      <div className="page-heading compact">
        <div>
          <p className="eyebrow">
            <BrainCircuit size={13} /> TECHNICAL EVALUATION ENGINE
          </p>
          <h1>Project Analysis</h1>
          <p className="page-subtitle">
            Describe your project idea to analyze required capabilities, capability-driven AI tool recommendations, and web project discovery.
          </p>
        </div>
      </div>

      {errorMsg && (
        <div className="analysis-error-banner">
          <AlertCircle size={18} />
          <div>
            <b>Analysis Engine Warning:</b>
            <p>{errorMsg}</p>
          </div>
          <button type="button" className="button small" onClick={handleReset}>
            <RotateCcw size={13} /> Try Again
          </button>
        </div>
      )}

      {isLoading ? (
        <LoadingAnalysisView />
      ) : report ? (
        <AnalysisResultsView report={report} onReset={handleReset} />
      ) : (
        <ProjectAnalysisForm onSubmit={handleStartAnalysis} isLoading={isLoading} />
      )}
    </div>
  );
};

export default ProjectAnalysisPage;
