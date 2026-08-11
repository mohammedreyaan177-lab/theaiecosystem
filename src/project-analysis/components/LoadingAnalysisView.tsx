import React, { useEffect, useState } from 'react';
import { Sparkles, BrainCircuit, CheckCircle2 } from 'lucide-react';

const ANALYSIS_STAGES = [
  'Understanding your project concept & target audience...',
  'Extracting core functional & non-functional requirements...',
  'Selecting optimal technology stack (Frontend, Backend, DB, Storage)...',
  'Matching requirements with live AIEcosystem tools...',
  'Researching existing internet products & open-source concepts...',
  'Analyzing originality, differentiation & technical risks...',
  'Synthesizing architecture roadmap & final verdict...'
];

export const LoadingAnalysisView: React.FC = () => {
  const [currentStageIdx, setCurrentStageIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStageIdx((prev) => {
        if (prev < ANALYSIS_STAGES.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 450);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="loading-analysis-card">
      <div className="loading-animation-header">
        <div className="pulse-orb">
          <BrainCircuit size={32} className="spinning-icon" />
        </div>
        <h3>Running Comprehensive Project Analysis</h3>
        <p>Analyzing architecture, ecosystem tools, live web research, security, and market position...</p>
      </div>

      <div className="stages-list">
        {ANALYSIS_STAGES.map((stageText, idx) => {
          const isDone = idx < currentStageIdx;
          const isCurrent = idx === currentStageIdx;
          const isPending = idx > currentStageIdx;

          return (
            <div
              key={idx}
              className={`stage-item ${isDone ? 'done' : ''} ${isCurrent ? 'active' : ''} ${isPending ? 'pending' : ''}`}
            >
              <div className="stage-icon">
                {isDone ? (
                  <CheckCircle2 size={16} />
                ) : isCurrent ? (
                  <span className="stage-pulse-dot" />
                ) : (
                  <span className="stage-idle-dot" />
                )}
              </div>
              <span className="stage-text">{stageText}</span>
              {isCurrent && <Sparkles size={14} className="sparkle-active" />}
            </div>
          );
        })}
      </div>
    </div>
  );
};
