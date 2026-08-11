import React from 'react';
import { CostComplexityAssessment, RoadmapPhase, FinalVerdict } from '../types';
import { Calendar, Award, AlertTriangle, Lightbulb, CheckCircle2, DollarSign } from 'lucide-react';

interface RoadmapVerdictProps {
  complexity: CostComplexityAssessment;
  roadmap: RoadmapPhase[];
  verdict: FinalVerdict;
}

export const RoadmapVerdictSection: React.FC<RoadmapVerdictProps> = ({
  complexity,
  roadmap,
  verdict
}) => {
  return (
    <div className="analysis-section-block">
      {/* Complexity & Cost Block */}
      <div className="section-block-header">
        <h2>
          <DollarSign size={20} /> Cost & Complexity Assessment
        </h2>
        <p>Resource breakdown per architecture layer and estimated production API costs.</p>
      </div>

      <div className="complexity-tiers-grid">
        {complexity.tiers.map((tier, idx) => (
          <div key={idx} className="complexity-tier-card">
            <div className="tier-header">
              <b>{tier.tier}</b>
              <span className={`complexity-badge ${tier.level.toLowerCase().replace(' ', '-')}`}>
                {tier.level}
              </span>
            </div>
            <p>{tier.explanation}</p>
          </div>
        ))}
      </div>

      <div className="cost-notes-box">
        <b>Estimated Infrastructure & API Cost Model:</b>
        <p>{complexity.estimatedCostNotes}</p>
      </div>

      {/* Roadmap Block */}
      <div className="section-block-header section-spacer">
        <h2>
          <Calendar size={20} /> Practical Development Roadmap
        </h2>
        <p>Step-by-step implementation order tailored to your MVP release strategy.</p>
      </div>

      <div className="roadmap-timeline">
        {roadmap.map((phase, idx) => (
          <div key={idx} className="timeline-phase-card">
            <div className="phase-badge-row">
              <span className="phase-tag font-bold">{phase.phase}</span>
              <span className="phase-duration">{phase.durationEstimate}</span>
            </div>
            <h3 className="phase-title">{phase.title}</h3>
            <ul className="deliverables-list">
              {phase.keyDeliverables.map((item, i) => (
                <li key={i}>
                  <CheckCircle2 size={13} /> {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Final Verdict Block */}
      <div className="final-verdict-card">
        <div className="verdict-header">
          <div className="verdict-title-group">
            <Award size={28} className="verdict-icon" />
            <div>
              <h2>Final Strategic Verdict</h2>
              <p>Overall feasibility, core risk, and recommended first MVP release focus.</p>
            </div>
          </div>
          <div className="score-dial">
            <span className="score-num">{verdict.feasibilityScore}/100</span>
            <span className="score-label">{verdict.feasibilityRating}</span>
          </div>
        </div>

        <div className="verdict-grid">
          <div className="verdict-metric">
            <span className="v-label">Technical Complexity</span>
            <b className="v-val">{verdict.technicalComplexity}</b>
          </div>
          <div className="verdict-metric">
            <span className="v-label">Market Competition</span>
            <b className="v-val">{verdict.marketCompetition}</b>
          </div>
          <div className="verdict-metric">
            <span className="v-label">Originality Summary</span>
            <b className="v-val">{verdict.originalitySummary}</b>
          </div>
        </div>

        <div className="verdict-highlight-box">
          <div className="verdict-subitem">
            <b className="label-with-icon">
              <Lightbulb size={16} /> Recommended Strategic Approach:
            </b>
            <p>{verdict.recommendedApproach}</p>
          </div>

          <div className="verdict-subitem risk">
            <b className="label-with-icon">
              <AlertTriangle size={16} /> Primary Critical Risk to Avoid:
            </b>
            <p>{verdict.biggestRisk}</p>
          </div>

          <div className="verdict-subitem mvp">
            <b className="label-with-icon">
              <CheckCircle2 size={16} /> Recommended Best First MVP Scope:
            </b>
            <p>{verdict.bestFirstMVP}</p>
          </div>
        </div>

        <div className="verdict-final-summary">
          <b>Conclusion:</b>
          <p>{verdict.finalRecommendation}</p>
        </div>
      </div>
    </div>
  );
};
