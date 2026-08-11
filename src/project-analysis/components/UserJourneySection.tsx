import React from 'react';
import { UserJourneyStep } from '../types';
import { Route, Sparkles, User, Cpu } from 'lucide-react';

export const UserJourneySection: React.FC<{ steps: UserJourneyStep[] }> = ({ steps }) => {
  return (
    <div className="analysis-section-block">
      <div className="section-block-header">
        <h2>
          <Route size={20} /> End-User Journey & Feature Interaction Map
        </h2>
        <p>Step-by-step user interaction flow from onboarding and document ingestion to AI processing and viral sharing.</p>
      </div>

      <div className="journey-steps-list">
        {steps.map((step) => (
          <div key={step.stepNumber} className="journey-step-card">
            <div className="step-number-badge">
              <span>0{step.stepNumber}</span>
            </div>

            <div className="step-content">
              <h3 className="step-stage-name">{step.stageName}</h3>

              <div className="step-details-grid">
                <div className="step-detail-item">
                  <b className="label-with-icon">
                    <User size={14} /> User Action:
                  </b>
                  <p>{step.userAction}</p>
                </div>

                <div className="step-detail-item">
                  <b className="label-with-icon">
                    <Cpu size={14} /> Backend System Behavior:
                  </b>
                  <p>{step.systemBehavior}</p>
                </div>

                <div className="step-detail-item ai-highlight">
                  <b className="label-with-icon">
                    <Sparkles size={14} /> AI Model Involvement:
                  </b>
                  <p>{step.aiInvolvement}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
