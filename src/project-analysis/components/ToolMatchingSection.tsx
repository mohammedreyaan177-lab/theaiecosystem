import React from 'react';
import { EcosystemToolMatch } from '../types';
import { Boxes, ExternalLink, CheckCircle2, Globe, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ToolMatchingSection: React.FC<{ items: EcosystemToolMatch[] }> = ({ items }) => {
  return (
    <div className="analysis-section-block">
      <div className="section-block-header">
        <h2>
          <Boxes size={20} /> Capability-Driven AI Tool Recommendations
        </h2>
        <p>Intelligent capability matching mapping your project requirements against AI tools indexed in AIEcosystem.</p>
      </div>

      {items.length === 0 ? (
        <div style={{ padding: '30px', textAlign: 'center', background: 'var(--paper)', borderRadius: '12px' }}>
          <p style={{ color: 'var(--muted)' }}>No direct ecosystem tools matched the requested capability threshold.</p>
        </div>
      ) : (
        <div className="tool-matches-grid">
          {items.map((item, idx) => (
            <div key={idx} className="tool-match-card">
              <div className="match-card-header">
                <span className="requirement-tag font-medium" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Sparkles size={13} /> {item.relevanceScore ? `${item.relevanceScore}% Relevance Match` : 'Capability Match'}
                </span>
                {item.isEcosystemTool ? (
                  <span className="badge certified ecosystem-badge">
                    <CheckCircle2 size={11} /> Capability Match
                  </span>
                ) : (
                  <span className="badge external-badge">
                    <Globe size={11} /> External Service
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
                {item.company && <p className="tool-company">Provider: <b>{item.company}</b></p>}
                
                <p className="match-reason" style={{ fontSize: '13px', lineHeight: '1.5', margin: '8px 0 12px', color: 'var(--muted)' }}>
                  <b>Why it matches:</b> {item.reason}
                </p>

                {item.capabilityMatched && (
                  <div style={{ marginTop: '8px' }}>
                    <b style={{ fontSize: '12px', color: 'var(--ink)' }}>Capabilities Satisfied:</b>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '4px' }}>
                      {item.capabilityMatched.split(',').map((cap, i) => (
                        <span key={i} className="tag-chip" style={{ background: 'var(--soft)', color: 'var(--green)', border: '1px solid var(--line)' }}>
                          ✓ {cap.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="match-card-actions" style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--line)' }}>
                {item.toolId ? (
                  <Link to={`/tools/${item.toolId}`} className="visit font-semibold">
                    View in Directory Index →
                  </Link>
                ) : item.website ? (
                  <a href={item.website} target="_blank" rel="noreferrer" className="visit font-semibold">
                    Visit Official Tool Site <ExternalLink size={13} />
                  </a>
                ) : (
                  <span className="visit disabled">No tool URL listed</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
