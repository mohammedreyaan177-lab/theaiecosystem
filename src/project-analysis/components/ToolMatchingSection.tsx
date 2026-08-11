import React from 'react';
import { EcosystemToolMatch } from '../types';
import { Boxes, ExternalLink, CheckCircle2, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ToolMatchingSection: React.FC<{ items: EcosystemToolMatch[] }> = ({ items }) => {
  return (
    <div className="analysis-section-block">
      <div className="section-block-header">
        <h2>
          <Boxes size={20} /> AIEcosystem Tool Matching
        </h2>
        <p>Direct mapping of your project requirements to tools currently indexed in AIEcosystem.</p>
      </div>

      <div className="tool-matches-grid">
        {items.map((item, idx) => (
          <div key={idx} className="tool-match-card">
            <div className="match-card-header">
              <span className="requirement-tag font-medium">Requirement: {item.requirement}</span>
              {item.isEcosystemTool ? (
                <span className="badge certified ecosystem-badge">
                  <CheckCircle2 size={11} /> AIEcosystem Tool Match
                </span>
              ) : (
                <span className="badge external-badge">
                  <Globe size={11} /> External Tool Recommendation
                </span>
              )}
            </div>

            <div className="matched-tool-info">
              <div className="tool-name-pricing">
                <h3>{item.toolName}</h3>
                {item.pricingLabel && (
                  <span className={`badge ${item.pricingLabel.toLowerCase()}`}>
                    {item.pricingLabel}
                  </span>
                )}
              </div>
              {item.company && <p className="tool-company">By {item.company} · Matched: <span>{item.capabilityMatched}</span></p>}
              <p className="match-reason">{item.reason}</p>
            </div>

            <div className="match-card-actions">
              {item.toolId ? (
                <Link to={`/tools/${item.toolId}`} className="visit font-semibold">
                  View in AIEcosystem Index →
                </Link>
              ) : item.website ? (
                <a href={item.website} target="_blank" rel="noreferrer" className="visit font-semibold">
                  Visit Tool Website <ExternalLink size={13} />
                </a>
              ) : (
                <span className="visit disabled">No tool URL listed</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
