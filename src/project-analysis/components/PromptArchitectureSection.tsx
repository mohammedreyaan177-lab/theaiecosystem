import React, { useState } from 'react';
import { PromptArchitecture } from '../types';
import { Terminal, Copy, Check, ShieldAlert, Sparkles } from 'lucide-react';

export const PromptArchitectureSection: React.FC<{ promptData: PromptArchitecture }> = ({ promptData }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(promptData.rawPromptTemplate);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="analysis-section-block">
      <div className="section-block-header">
        <h2>
          <Terminal size={20} /> AI System Prompt Architecture
        </h2>
        <p>Production-ready LLM system prompt template, role framing rules, and JSON output guardrails.</p>
      </div>

      <div className="prompt-meta-box">
        <h3 className="prompt-title">
          <Sparkles size={16} /> {promptData.systemPromptTitle}
        </h3>
        <p className="role-def">
          <b>Role Framing:</b> {promptData.roleDefinition}
        </p>
        <p className="input-fmt">
          <b>Expected Input Format:</b> {promptData.inputFormat}
        </p>
      </div>

      <div className="guards-box">
        <h4>
          <ShieldAlert size={16} /> Safety & Formatting Output Guards
        </h4>
        <ul>
          {promptData.outputGuards.map((guard, idx) => (
            <li key={idx}>{guard}</li>
          ))}
        </ul>
      </div>

      <div className="code-template-block">
        <div className="code-template-header">
          <span>Production System Prompt Template</span>
          <button type="button" className="copy-code-btn" onClick={handleCopy}>
            {copied ? (
              <>
                <Check size={14} /> Copied!
              </>
            ) : (
              <>
                <Copy size={14} /> Copy Template
              </>
            )}
          </button>
        </div>
        <pre className="prompt-code-content">
          <code>{promptData.rawPromptTemplate}</code>
        </pre>
      </div>
    </div>
  );
};
