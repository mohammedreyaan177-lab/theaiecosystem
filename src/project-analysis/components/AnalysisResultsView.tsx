import React, { useState } from 'react';
import { CompleteAnalysisReport } from '../types';
import { TechStackSection } from './TechStackSection';
import { AIStackSection } from './AIStackSection';
import { ToolMatchingSection } from './ToolMatchingSection';
import { ExistingProductsSection } from './ExistingProductsSection';
import { ArchitectureSection } from './ArchitectureSection';
import { SecuritySection } from './SecuritySection';
import { BuildBlueprintSection } from './BuildBlueprintSection';
import { DifferentiationSection } from './DifferentiationSection';
import { TestingDeploymentSection } from './TestingDeploymentSection';
import { 
  RotateCcw, 
  Printer, 
  Server, 
  BrainCircuit, 
  Boxes, 
  Globe, 
  Network, 
  Download,
  Target,
  Layers,
  Rocket,
  Sparkles
} from 'lucide-react';

interface AnalysisResultsViewProps {
  report: CompleteAnalysisReport;
  onReset: () => void;
}

type TabKey = 
  | 'all' 
  | 'blueprint'
  | 'differentiation'
  | 'products'
  | 'tech' 
  | 'tools' 
  | 'testing'
  | 'architecture';

export const AnalysisResultsView: React.FC<AnalysisResultsViewProps> = ({ report, onReset }) => {
  const [activeTab, setActiveTab] = useState<TabKey>('all');

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(report, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `project_analysis.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const tabs: { key: TabKey; label: string; icon: React.FC<{ size?: number }> }[] = [
    { key: 'all', label: 'Full Technical Report', icon: Sparkles },
    { key: 'blueprint', label: 'Build Blueprint & Guides', icon: Layers },
    { key: 'differentiation', label: 'Product Differentiation', icon: Sparkles },
    { key: 'products', label: 'Web Discovery & Existing Projects', icon: Globe },
    { key: 'tools', label: 'AI Tool Recommendations', icon: Boxes },
    { key: 'tech', label: 'Recommended Tech Stack', icon: Server },
    { key: 'testing', label: 'Testing & Deployment', icon: Rocket },
    { key: 'architecture', label: 'Architecture & Security', icon: Network }
  ];

  const classification = report.classification || {
    requestType: 'GENERIC',
    confidence: 0.95,
    targetEntity: null,
    reason: 'Generic application concept analysis.'
  };

  return (
    <div className="analysis-results-container">
      <div className="results-toolbar">
        <div className="results-title-summary">
          <span className="eyebrow">TECHNICAL EVALUATION COMPLETE</span>
          <h2>Project Technical Analysis Report</h2>
          <p className="timestamp">Generated on {new Date(report.timestamp).toLocaleString()}</p>
        </div>

        <div className="results-actions">
          <button type="button" className="button" onClick={onReset}>
            <RotateCcw size={15} /> New Search
          </button>
          <button type="button" className="button" onClick={handleDownloadJSON} title="Download structured JSON report">
            <Download size={15} /> Export JSON
          </button>
          <button type="button" className="primary" onClick={handlePrint}>
            <Printer size={15} /> Print / Export PDF
          </button>
        </div>
      </div>

      {/* Classification Intent Banner */}
      <div className="intent-classification-banner" style={{ background: 'var(--paper)', border: '1px solid var(--line)', borderRadius: '14px', padding: '20px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span className={`badge ${classification.requestType === 'PROJECT_SPECIFIC' ? 'certified' : 'freemium'}`} style={{ fontSize: '13px', padding: '4px 12px' }}>
              <Target size={14} style={{ display: 'inline', marginRight: '6px' }} />
              {classification.requestType === 'PROJECT_SPECIFIC' ? 'PROJECT-SPECIFIC REQUEST' : 'GENERIC CATEGORY REQUEST'}
            </span>
            <span style={{ fontSize: '13px', color: 'var(--muted)', fontWeight: 600 }}>
              Confidence: {Math.round((classification.confidence || 0.95) * 100)}%
            </span>
          </div>
          {classification.targetEntity && (
            <span style={{ background: 'var(--soft)', padding: '4px 12px', borderRadius: '8px', fontSize: '13px', fontWeight: 700, color: 'var(--green)' }}>
              Target Reference: {classification.targetEntity}
            </span>
          )}
        </div>
        <p style={{ margin: 0, fontSize: '14px', color: 'var(--ink)', lineHeight: '1.5' }}>
          <b>Intent Classification Reasoning:</b> {classification.reason}
        </p>
      </div>

      {/* Tabs bar */}
      <div className="analysis-tabs-bar" role="tablist">
        {tabs.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            type="button"
            className={`analysis-tab-btn ${activeTab === key ? 'active' : ''}`}
            onClick={() => setActiveTab(key)}
            role="tab"
          >
            <Icon size={15} />
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* Render Tab Contents */}
      <div className="report-content-body">
        {(activeTab === 'all' || activeTab === 'blueprint') && (
          <BuildBlueprintSection phases={report.buildBlueprint} />
        )}

        {(activeTab === 'all' || activeTab === 'differentiation') && (
          <DifferentiationSection data={report.differentiationEngine} />
        )}

        {(activeTab === 'all' || activeTab === 'products') && (
          <ExistingProductsSection
            products={report.existingProducts}
            searchDisclaimer={report.searchDisclaimer}
            existsSummary={report.existsOnInternetSummary}
          />
        )}

        {(activeTab === 'all' || activeTab === 'tools') && (
          <ToolMatchingSection items={report.ecosystemTools} />
        )}

        {(activeTab === 'all' || activeTab === 'tech') && (
          <TechStackSection items={report.techStack} archSummary={report.architectureSummary} />
        )}

        {(activeTab === 'all' || activeTab === 'testing') && (
          <TestingDeploymentSection
            testingPlan={report.testingPlan}
            deploymentPlan={report.deploymentPlan}
          />
        )}

        {(activeTab === 'all' || activeTab === 'architecture') && (
          <>
            <ArchitectureSection nodes={report.architectureNodes} />
            <SecuritySection risks={report.securityRisks} />
          </>
        )}
      </div>
    </div>
  );
};
