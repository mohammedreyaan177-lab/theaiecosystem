import React from 'react';
import { AICapability } from '../types';
import { BrainCircuit, Sparkles } from 'lucide-react';

export const AIStackSection: React.FC<{ items: AICapability[] }> = ({ items }) => {
  return (
    <div className="analysis-section-block">
      <div className="section-block-header">
        <h2>
          <BrainCircuit size={20} /> AI Stack Analysis
        </h2>
        <p>Specific artificial intelligence capabilities, models, and RAG search techniques required by your project.</p>
      </div>

      <div className="ai-capabilities-grid">
        {items.map((item, idx) => (
          <div key={idx} className="ai-capability-card">
            <div className="capability-card-top">
              <div className="capability-icon">
                <Sparkles size={16} />
              </div>
              <span className={`importance-badge ${item.importance.toLowerCase()}`}>
                {item.importance}
              </span>
            </div>

            <h3 className="capability-title">{item.capability}</h3>
            <p className="capability-reason">{item.relevanceReason}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
