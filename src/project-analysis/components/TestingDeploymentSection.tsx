import React from 'react';
import { TestingPlanItem, DeploymentChecklistItem } from '../types';
import { Terminal, Rocket, CheckCircle2, ShieldCheck, Server } from 'lucide-react';

interface TestingDeploymentSectionProps {
  testingPlan?: TestingPlanItem[];
  deploymentPlan?: DeploymentChecklistItem[];
}

export const TestingDeploymentSection: React.FC<TestingDeploymentSectionProps> = ({
  testingPlan = [],
  deploymentPlan = []
}) => {
  return (
    <div className="testing-deployment-section" style={{ margin: '24px 0' }}>
      <div className="section-header" style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Rocket size={22} style={{ color: 'var(--green)' }} />
          <h3 style={{ margin: 0, fontSize: '20px', color: 'var(--ink)' }}>
            Testing Suites & Stack-Tailored Deployment Checklist
          </h3>
        </div>
        <p style={{ margin: '6px 0 0', fontSize: '14px', color: 'var(--muted)' }}>
          Automated test execution strategy and architecture-matched cloud deployment steps.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {/* 1. Automated Testing Suites */}
        <div style={{ background: 'var(--paper)', border: '1px solid var(--line)', borderRadius: '14px', padding: '20px' }}>
          <h4 style={{ margin: '0 0 14px', fontSize: '16px', color: 'var(--ink)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Terminal size={18} style={{ color: 'var(--green)' }} /> Recommended Automated Testing Suites
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {testingPlan.map((test, idx) => (
              <div key={idx} style={{ background: 'var(--soft)', border: '1px solid var(--line)', borderRadius: '10px', padding: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span className="badge certified" style={{ fontSize: '11px' }}>{test.category}</span>
                  <ShieldCheck size={14} style={{ color: 'var(--green)' }} />
                </div>
                <h5 style={{ margin: '0 0 6px', fontSize: '14px', color: 'var(--ink)' }}>{test.testName}</h5>
                <code style={{ background: '#1E1E1E', color: '#D4D4D4', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', display: 'block', wordBreak: 'break-all' }}>
                  {test.command}
                </code>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Stack-Tailored Deployment Checklist */}
        <div style={{ background: 'var(--paper)', border: '1px solid var(--line)', borderRadius: '14px', padding: '20px' }}>
          <h4 style={{ margin: '0 0 14px', fontSize: '16px', color: 'var(--ink)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Server size={18} style={{ color: 'var(--green)' }} /> Architecture-Matched Deployment Checklist
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {deploymentPlan.map((step, idx) => (
              <div key={idx} style={{ background: 'var(--soft)', border: '1px solid var(--line)', borderRadius: '10px', padding: '14px', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <span style={{ width: '26px', height: '26px', borderRadius: '50%', background: 'var(--green)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '12px', flexShrink: 0 }}>
                  {step.step}
                </span>
                <div>
                  <h5 style={{ margin: '0 0 4px', fontSize: '14px', color: 'var(--ink)' }}>{step.action}</h5>
                  <p style={{ margin: 0, fontSize: '13px', color: 'var(--muted)', lineHeight: '1.4' }}>
                    Recommendation: <b>{step.recommendation}</b>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
