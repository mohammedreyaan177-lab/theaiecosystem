import React from 'react';
import { SecurityRisk } from '../types';
import { ShieldAlert, ShieldCheck } from 'lucide-react';

export const SecuritySection: React.FC<{ risks: SecurityRisk[] }> = ({ risks }) => {
  return (
    <div className="analysis-section-block">
      <div className="section-block-header">
        <h2>
          <ShieldAlert size={20} /> Security Risk & Privacy Analysis
        </h2>
        <p>Threat assessment covering authentication, API key protection, prompt injection, and rate limiting.</p>
      </div>

      <div className="security-risks-grid">
        {risks.map((risk, idx) => (
          <div key={idx} className="security-risk-card">
            <div className="risk-card-header">
              <span className="risk-category">{risk.category}</span>
              <span className={`risk-level-badge ${risk.riskLevel.toLowerCase()}`}>
                <ShieldAlert size={12} /> {risk.riskLevel} Risk
              </span>
            </div>

            <p className="risk-desc">{risk.description}</p>

            <div className="mitigation-box">
              <b className="mitigation-label">
                <ShieldCheck size={14} /> Recommended Mitigation:
              </b>
              <p>{risk.mitigationStrategy}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
