import React from 'react';
import { DifferentiationEngineResult } from '../types';
import { 
  Sparkles, CheckCircle2, XCircle, ArrowUpRight, ShieldCheck, 
  ExternalLink, Lightbulb, AlertTriangle, Layers
} from 'lucide-react';

interface DifferentiationSectionProps {
  data?: DifferentiationEngineResult;
}

export const DifferentiationSection: React.FC<DifferentiationSectionProps> = ({ data }) => {
  if (!data) {
    return (
      <div style={{ padding: '24px', textAlign: 'center', background: 'var(--paper)', border: '1px solid var(--line)', borderRadius: '12px' }}>
        <p style={{ margin: 0, color: 'var(--muted)' }}>Differentiation and Feature Gap analysis loading...</p>
      </div>
    );
  }

  const { matrix = [], differentiators = [], referenceGuidance = [], antiCopyingPolicy } = data;

  return (
    <div className="differentiation-section" style={{ margin: '24px 0' }}>
      <div className="section-header" style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Sparkles size={22} style={{ color: 'var(--green)' }} />
          <h3 style={{ margin: 0, fontSize: '20px', color: 'var(--ink)' }}>
            Product Differentiation & Feature Gap Analysis
          </h3>
        </div>
        <p style={{ margin: '6px 0 0', fontSize: '14px', color: 'var(--muted)' }}>
          Identify key feature gaps, market opportunities, and strategic differentiators to make your project stand out against existing competitors.
        </p>
      </div>

      {/* 1. Feature Comparison Matrix */}
      <div style={{ background: 'var(--paper)', border: '1px solid var(--line)', borderRadius: '14px', padding: '20px', marginBottom: '24px' }}>
        <h4 style={{ margin: '0 0 14px', fontSize: '16px', color: 'var(--ink)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Layers size={16} /> Feature Comparison Matrix (Existing Competitors vs. Your Project)
        </h4>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'var(--soft)', borderBottom: '1px solid var(--line)' }}>
                <th style={{ padding: '12px 16px', color: 'var(--ink)' }}>Feature / Capability</th>
                <th style={{ padding: '12px 16px', color: 'var(--ink)' }}>Existing Projects</th>
                <th style={{ padding: '12px 16px', color: 'var(--ink)' }}>Your Project</th>
                <th style={{ padding: '12px 16px', color: 'var(--ink)' }}>Market Status</th>
              </tr>
            </thead>
            <tbody>
              {matrix.map((row, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid var(--line)' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--ink)' }}>{row.feature}</td>
                  <td style={{ padding: '12px 16px' }}>
                    {row.existingProjectsHas ? (
                      <span style={{ color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <CheckCircle2 size={15} style={{ color: '#666' }} /> Present
                      </span>
                    ) : (
                      <span style={{ color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <XCircle size={15} style={{ color: '#aaa' }} /> Missing / Rare
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    {row.userProjectHas && (
                      <span style={{ color: 'var(--green)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <CheckCircle2 size={15} /> Included
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span className={`badge ${row.status.includes('Key') ? 'certified' : 'freemium'}`} style={{ fontSize: '12px', padding: '3px 8px' }}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. Ranked Differentiators */}
      <div style={{ marginBottom: '24px' }}>
        <h4 style={{ margin: '0 0 14px', fontSize: '16px', color: 'var(--ink)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Lightbulb size={16} style={{ color: 'var(--green)' }} /> Ranked Strategic Differentiators
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
          {differentiators.map((item, idx) => (
            <div key={idx} style={{ background: 'var(--paper)', border: '1px solid var(--line)', borderRadius: '12px', padding: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span className="badge certified" style={{ fontSize: '11px', fontWeight: 800 }}>
                  RANK #{item.rank} · {item.impactLevel}
                </span>
                <span style={{ fontSize: '12px', color: 'var(--muted)' }}>
                  Complexity: {item.implementationComplexity}
                </span>
              </div>
              <h5 style={{ margin: '0 0 8px', fontSize: '15px', color: 'var(--ink)' }}>{item.title}</h5>
              <p style={{ margin: '0 0 12px', fontSize: '13px', color: 'var(--muted)', lineHeight: '1.5' }}>
                {item.whyValue}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Open Source Reference Architecture Guidance & Fair Usage Policy */}
      {referenceGuidance.length > 0 && (
        <div style={{ background: 'var(--soft)', border: '1px solid var(--line)', borderRadius: '14px', padding: '20px' }}>
          <h4 style={{ margin: '0 0 12px', fontSize: '15px', color: 'var(--ink)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={16} style={{ color: 'var(--green)' }} /> Architectural Reference Usage & Anti-Copying Policy
          </h4>
          <p style={{ margin: '0 0 14px', fontSize: '13px', color: 'var(--muted)', lineHeight: '1.5' }}>
            {antiCopyingPolicy}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {referenceGuidance.map((ref, idx) => (
              <div key={idx} style={{ background: 'var(--paper)', border: '1px solid var(--line)', borderRadius: '8px', padding: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <b style={{ fontSize: '13px', color: 'var(--ink)' }}>{ref.projectName}</b>
                  <p style={{ margin: '2px 0 0', fontSize: '12px', color: 'var(--muted)' }}>{ref.architectureUtility}</p>
                </div>
                <a href={ref.repositoryUrl} target="_blank" rel="noreferrer" style={{ fontSize: '12px', fontWeight: 700, color: 'var(--green)', display: 'inline-flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}>
                  View Open Source Repo <ExternalLink size={12} />
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
