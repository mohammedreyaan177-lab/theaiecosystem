import React from 'react';
import { OriginalityAnalysis } from '../types';
import { Sparkles, Lightbulb, Compass, Info } from 'lucide-react';

interface OriginalitySectionProps {
  originality: OriginalityAnalysis;
  differentiationAdvice: string[];
}

export const OriginalitySection: React.FC<OriginalitySectionProps> = ({
  originality,
  differentiationAdvice
}) => {
  return (
    <div className="analysis-section-block">
      <div className="section-block-header">
        <h2>
          <Compass size={20} /> Originality & Differentiation Analysis
        </h2>
        <p>Assessment of market novelty, competitive positioning, and actionable differentiation strategies.</p>
      </div>

      <div className="originality-metrics-row">
        <div className="orig-metric-card">
          <span className="metric-label">Originality Rating</span>
          <b className="metric-value highlight">{originality.originalityRating}</b>
        </div>
        <div className="orig-metric-card">
          <span className="metric-label">Estimated Similarity Score</span>
          <b className="metric-value">{originality.estimatedSimilarityScore}%</b>
          <small className="score-note">AI-estimated score</small>
        </div>
        <div className="orig-metric-card">
          <span className="metric-label">Market Competition</span>
          <b className={`metric-value competition-${originality.marketCompetitionLevel.toLowerCase()}`}>
            {originality.marketCompetitionLevel}
          </b>
        </div>
      </div>

      <div className="originality-detail-box">
        <h4>
          <Sparkles size={16} /> Technical Novelty Assessment
        </h4>
        <p>{originality.technicalNovelty}</p>
        <p className="scoring-disclaimer">
          <Info size={13} /> {originality.disclaimer}
        </p>
      </div>

      <div className="differentiation-box">
        <h4>
          <Lightbulb size={16} /> Key Differentiation Recommendations
        </h4>
        <div className="differentiation-grid">
          {differentiationAdvice.map((point, idx) => (
            <div key={idx} className="diff-card">
              <span className="diff-number">0{idx + 1}</span>
              <p>{point}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
