import React, { useState } from 'react';
import { BuildPhase } from '../types';
import { 
  CheckCircle2, ChevronDown, ChevronUp, Layers, FileCode, CheckSquare, 
  ExternalLink, Sparkles, BookOpen, Terminal
} from 'lucide-react';

interface BuildBlueprintSectionProps {
  phases?: BuildPhase[];
}

export const BuildBlueprintSection: React.FC<BuildBlueprintSectionProps> = ({ phases = [] }) => {
  const [expandedPhases, setExpandedPhases] = useState<Record<number, boolean>>({
    1: true,
    2: true
  });

  const togglePhase = (phaseNum: number) => {
    setExpandedPhases(prev => ({
      ...prev,
      [phaseNum]: !prev[phaseNum]
    }));
  };

  if (!phases || phases.length === 0) {
    return (
      <div style={{ padding: '24px', textAlign: 'center', background: 'var(--paper)', border: '1px solid var(--line)', borderRadius: '12px' }}>
        <p style={{ margin: 0, color: 'var(--muted)' }}>Build Blueprint and Dynamic Guide data generating...</p>
      </div>
    );
  }

  return (
    <div className="build-blueprint-section" style={{ margin: '24px 0' }}>
      <div className="section-header" style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Layers size={22} style={{ color: 'var(--green)' }} />
          <h3 style={{ margin: 0, fontSize: '20px', color: 'var(--ink)' }}>
            Dependency-Aware Build Blueprint & Dynamic Guides
          </h3>
        </div>
        <p style={{ margin: '6px 0 0', fontSize: '14px', color: 'var(--muted)' }}>
          Ordered phase-by-phase development procedure with verified official documentation and task-specific learning guides.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {phases.map((phase) => {
          const isExpanded = !!expandedPhases[phase.phaseNumber];
          return (
            <div
              key={phase.phaseNumber}
              style={{
                background: 'var(--paper)',
                border: '1px solid var(--line)',
                borderRadius: '14px',
                overflow: 'hidden',
                boxShadow: isExpanded ? '0 4px 14px rgba(0,0,0,0.04)' : 'none'
              }}
            >
              {/* Phase Header Accordion Toggle */}
              <div
                className="blueprint-phase-header"
                onClick={() => togglePhase(phase.phaseNumber)}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '18px 22px',
                  background: isExpanded ? 'var(--soft)' : 'var(--paper)',
                  cursor: 'pointer',
                  userSelect: 'none',
                  borderBottom: isExpanded ? '1px solid var(--line)' : 'none'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <span
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: 'var(--green)',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '14px'
                    }}
                  >
                    P{phase.phaseNumber}
                  </span>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '16px', color: 'var(--ink)' }}>{phase.title}</h4>
                    <p style={{ margin: '2px 0 0', fontSize: '13px', color: 'var(--muted)' }}>{phase.goal}</p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {phase.guides && phase.guides.length > 0 && (
                    <span className="badge freemium" style={{ fontSize: '12px', padding: '3px 8px' }}>
                      <BookOpen size={12} style={{ display: 'inline', marginRight: '4px' }} />
                      {phase.guides.length} Verified Guide{phase.guides.length > 1 ? 's' : ''}
                    </span>
                  )}
                  {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </div>
              </div>

              {/* Phase Body */}
              {isExpanded && (
                <div style={{ padding: '22px' }}>
                  {/* Prerequisite Dependencies */}
                  {phase.dependencies && phase.dependencies.length > 0 && (
                    <div style={{ marginBottom: '16px', fontSize: '13px' }}>
                      <b style={{ color: 'var(--muted)' }}>Prerequisites & Dependencies:</b>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '6px' }}>
                        {phase.dependencies.map((dep, idx) => (
                          <span key={idx} style={{ background: 'var(--soft)', border: '1px solid var(--line)', borderRadius: '6px', padding: '3px 10px', color: 'var(--ink)', fontSize: '12px' }}>
                            {dep}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Tasks List */}
                  <div style={{ marginBottom: '20px' }}>
                    <b style={{ fontSize: '14px', color: 'var(--ink)', display: 'block', marginBottom: '10px' }}>
                      Step-by-Step Execution Tasks:
                    </b>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {phase.tasks.map((task, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '14px', color: 'var(--ink)' }}>
                          <CheckCircle2 size={16} style={{ color: 'var(--green)', marginTop: '3px', flexShrink: 0 }} />
                          <span style={{ lineHeight: '1.5' }}>{task}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Likely Files & Test Cases */}
                  <div className="blueprint-files-tests-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '20px' }}>
                    <div style={{ background: 'var(--soft)', border: '1px solid var(--line)', borderRadius: '10px', padding: '14px' }}>
                      <b style={{ fontSize: '13px', color: 'var(--ink)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                        <FileCode size={14} /> Required Code Files & Components
                      </b>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {phase.likelyFiles.map((file, idx) => (
                          <code key={idx} style={{ background: 'var(--paper)', border: '1px solid var(--line)', padding: '2px 8px', borderRadius: '4px', fontSize: '12px', color: 'var(--ink)' }}>
                            {file}
                          </code>
                        ))}
                      </div>
                    </div>

                    <div style={{ background: 'var(--soft)', border: '1px solid var(--line)', borderRadius: '10px', padding: '14px' }}>
                      <b style={{ fontSize: '13px', color: 'var(--ink)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                        <Terminal size={14} /> Verification Test Commands
                      </b>
                      {phase.testCases.map((test, idx) => (
                        <div key={idx} style={{ fontSize: '12px', color: 'var(--ink)', marginBottom: '4px' }}>
                          • {test}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Dynamic Task Guides */}
                  {phase.guides && phase.guides.length > 0 && (
                    <div style={{ background: 'var(--bg)', border: '1px solid var(--line)', borderRadius: '10px', padding: '16px' }}>
                      <b style={{ fontSize: '13px', color: 'var(--ink)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                        <BookOpen size={15} style={{ color: 'var(--green)' }} /> Dynamically Discovered Task Guides & Official Docs:
                      </b>
                      <div className="blueprint-guides-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px' }}>
                        {phase.guides.map((guide, gIdx) => (
                          <div key={gIdx} style={{ background: 'var(--paper)', border: '1px solid var(--line)', borderRadius: '8px', padding: '12px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                              <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--green)', textTransform: 'uppercase' }}>
                                {guide.source}
                              </span>
                              <span style={{ fontSize: '11px', color: 'var(--muted)' }}>
                                Relevance: {guide.relevance}%
                              </span>
                            </div>
                            <h5 style={{ margin: '0 0 6px', fontSize: '13px', color: 'var(--ink)', lineHeight: '1.3' }}>
                              {guide.title}
                            </h5>
                            <p style={{ margin: '0 0 10px', fontSize: '12px', color: 'var(--muted)', lineHeight: '1.4' }}>
                              {guide.whyUseful}
                            </p>
                            <a
                              href={guide.url}
                              target="_blank"
                              rel="noreferrer"
                              style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: 700, color: 'var(--green)', textDecoration: 'none' }}
                            >
                              Open Guide <ExternalLink size={12} />
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
