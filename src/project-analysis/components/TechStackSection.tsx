import React from 'react';
import { TechStackItem, ArchitectureTypeSummary } from '../types';
import { Server, Check, X, HelpCircle, Layers, Cpu } from 'lucide-react';

interface TechStackSectionProps {
  items: TechStackItem[];
  archSummary?: ArchitectureTypeSummary;
}

export const TechStackSection: React.FC<TechStackSectionProps> = ({ items, archSummary }) => {
  return (
    <div className="analysis-section-block">
      <div className="section-block-header">
        <h2>
          <Server size={20} /> Recommended Technology Stack
        </h2>
        <p>Tailored stack tailored strictly to what your project actually requires.</p>
      </div>

      {archSummary && (
        <div className="arch-summary-banner">
          <div className="arch-summary-top">
            <Cpu size={20} className="arch-icon" />
            <div>
              <span className="arch-label">ARCHITECTURE CLASSIFICATION</span>
              <h3 className="arch-class-name">{archSummary.classification}</h3>
              <p className="arch-reasoning">{archSummary.reasoning}</p>
            </div>
          </div>
          <div className="tier-checks-row">
            <span className={`tier-check-pill ${archSummary.isFrontendOnly ? 'active' : ''}`}>
              Frontend UI: Required
            </span>
            <span className={`tier-check-pill ${archSummary.requiresBackend ? 'active' : 'disabled'}`}>
              Backend Server: {archSummary.requiresBackend ? 'Required' : 'Not Needed'}
            </span>
            <span className={`tier-check-pill ${archSummary.requiresDatabase ? 'active' : 'disabled'}`}>
              Database (DB): {archSummary.requiresDatabase ? 'Required' : 'Not Needed'}
            </span>
            <span className={`tier-check-pill ${archSummary.requiresAuth ? 'active' : 'disabled'}`}>
              User Auth: {archSummary.requiresAuth ? 'Required' : 'Not Needed'}
            </span>
          </div>
        </div>
      )}

      <div className="tech-stack-cards-list">
        {items.map((item, idx) => (
          <div key={idx} className="tech-layer-card">
            <div className="layer-card-header">
              <span className="layer-tag">
                <Layers size={13} /> {item.layer} Tier
              </span>
              <h3 className="rec-title">{item.recommendation}</h3>
            </div>

            <div className="reason-box">
              <b>Why this stack for your project:</b>
              <p>{item.reason}</p>
            </div>

            <div className="pros-cons-grid">
              <div className="pros-box">
                <b className="pros-label">
                  <Check size={14} /> Key Advantages
                </b>
                <ul>
                  {item.advantages.map((adv, i) => (
                    <li key={i}>{adv}</li>
                  ))}
                </ul>
              </div>

              <div className="cons-box">
                <b className="cons-label">
                  <X size={14} /> Trade-offs & Limitations
                </b>
                <ul>
                  {item.disadvantages.map((dis, i) => (
                    <li key={i}>{dis}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="alternative-box">
              <div className="alt-header">
                <HelpCircle size={14} />
                <span>Alternative Evaluated: <b>{item.alternative}</b></span>
              </div>
              <p className="alt-reason">
                <b>Why not selected:</b> {item.whyAlternativeNotSelected}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
