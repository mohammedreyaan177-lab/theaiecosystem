import React, { useState } from 'react';
import { CompleteAnalysisReport } from '../types';
import { TechStackSection } from './TechStackSection';
import { AIStackSection } from './AIStackSection';
import { ToolMatchingSection } from './ToolMatchingSection';
import { ExistingProductsSection } from './ExistingProductsSection';
import { ArchitectureSection } from './ArchitectureSection';
import { SecuritySection } from './SecuritySection';
import { 
  RotateCcw, 
  Printer, 
  Server, 
  BrainCircuit, 
  Boxes, 
  Globe, 
  Network, 
  ShieldAlert, 
  Layers,
  Download
} from 'lucide-react';

interface AnalysisResultsViewProps {
  report: CompleteAnalysisReport;
  onReset: () => void;
}

type TabKey = 
  | 'all' 
  | 'products'
  | 'tech' 
  | 'ai' 
  | 'tools' 
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
    downloadAnchor.setAttribute("download", `technical_analysis.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const tabs: { key: TabKey; label: string; icon: React.FC<{ size?: number }> }[] = [
    { key: 'all', label: 'Full Technical Report', icon: Layers },
    { key: 'products', label: 'Internet Search (Does it exist?)', icon: Globe },
    { key: 'tech', label: 'Recommended Tech Stack', icon: Server },
    { key: 'ai', label: 'AI Capabilities', icon: BrainCircuit },
    { key: 'tools', label: 'AIEcosystem Tools', icon: Boxes },
    { key: 'architecture', label: 'Architecture & Security', icon: Network }
  ];

  return (
    <div className="analysis-results-container">
      <div className="results-toolbar">
        <div className="results-title-summary">
          <span className="eyebrow">TECHNICAL EVALUATION COMPLETE</span>
          <h2>Project Technical Analysis</h2>
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

      {/* Render Streamlined Tab Contents */}
      <div className="report-content-body">
        {(activeTab === 'all' || activeTab === 'products') && (
          <ExistingProductsSection
            products={report.existingProducts}
            searchDisclaimer={report.searchDisclaimer}
            existsSummary={report.existsOnInternetSummary}
          />
        )}

        {(activeTab === 'all' || activeTab === 'tech') && (
          <TechStackSection items={report.techStack} archSummary={report.architectureSummary} />
        )}

        {(activeTab === 'all' || activeTab === 'ai') && (
          <AIStackSection items={report.aiStack} />
        )}

        {(activeTab === 'all' || activeTab === 'tools') && (
          <ToolMatchingSection items={report.ecosystemTools} />
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
