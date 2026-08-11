import React from 'react';
import { ProjectUnderstanding } from '../types';
import { Target, HelpCircle, Layers, Users, Zap, CheckCircle2 } from 'lucide-react';

export const OverviewSection: React.FC<{ data: ProjectUnderstanding }> = ({ data }) => {
  return (
    <div className="analysis-section-block">
      <div className="section-block-header">
        <h2>
          <Target size={20} /> Technical Overview & Requirements
        </h2>
        <p>Extracted structure, scale expectations, and functional requirements.</p>
      </div>

      <div className="meta-cards-grid">
        <div className="meta-card">
          <span className="meta-label">Primary Category</span>
          <b className="meta-value">{data.category}</b>
        </div>
        <div className="meta-card">
          <span className="meta-label">Technical Complexity</span>
          <b className={`meta-value complexity-${data.complexityLevel.toLowerCase().replace(' ', '-')}`}>
            {data.complexityLevel} Complexity
          </b>
        </div>
      </div>

      {data.targetUsers && (
        <div className="overview-two-col">
          <div className="overview-box">
            <h4>
              <Users size={16} /> Target Audience
            </h4>
            <div className="chips-wrap">
              {data.targetUsers.map((user, idx) => (
                <span key={idx} className="tag-chip font-bold">
                  {user}
                </span>
              ))}
            </div>
          </div>

          <div className="overview-box">
            <h4>
              <Zap size={16} /> Problem & Objective
            </h4>
            <p className="problem-text">{data.problemSolved}</p>
            <p className="objective-text">
              <b>Main Objective:</b> {data.mainObjective}
            </p>
          </div>
        </div>
      )}

      <div className="requirements-subblock">
        <h4>
          <Layers size={16} /> Extracted Technical Requirements ({data.requirements.length})
        </h4>
        <div className="requirements-grid">
          {data.requirements.map((req, idx) => (
            <div key={idx} className="req-card">
              <div className="req-header">
                <span className={`req-category-badge ${req.category.toLowerCase()}`}>
                  {req.category}
                </span>
                {req.status && (
                  <span className={`req-status ${req.status.toLowerCase()}`}>
                    <CheckCircle2 size={12} /> {req.status}
                  </span>
                )}
              </div>
              <b className="req-name">{req.name}</b>
              <p className="req-desc">{req.description}</p>
            </div>
          ))}
        </div>
      </div>

      {data.unknownsOrClarifications && data.unknownsOrClarifications.length > 0 && (
        <div className="clarifications-box">
          <h4>
            <HelpCircle size={16} /> Clarifications & Open Technical Questions
          </h4>
          <ul>
            {data.unknownsOrClarifications.map((item, idx) => (
              <li key={idx}>
                <b>Needs Clarification:</b> {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
