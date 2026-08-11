import React from 'react';
import { ComplianceItem } from '../types';
import { ShieldCheck, AlertCircle, FileText } from 'lucide-react';

export const ComplianceSection: React.FC<{ items: ComplianceItem[] }> = ({ items }) => {
  return (
    <div className="analysis-section-block">
      <div className="section-block-header">
        <h2>
          <ShieldCheck size={20} /> Compliance & Regulatory Readiness
        </h2>
        <p>Data privacy obligations, AI transparency rules, and industry compliance requirements.</p>
      </div>

      <div className="compliance-grid">
        {items.map((item, idx) => (
          <div key={idx} className="compliance-card">
            <div className="compliance-card-header">
              <h3 className="regulation-title">{item.regulation}</h3>
              <span className={`compliance-status-badge ${item.status.toLowerCase()}`}>
                {item.status}
              </span>
            </div>

            <p className="compliance-impact">{item.impactDescription}</p>

            <div className="required-action-box">
              <b className="action-label">
                <FileText size={13} /> Required Developer Action:
              </b>
              <p>{item.requiredAction}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
