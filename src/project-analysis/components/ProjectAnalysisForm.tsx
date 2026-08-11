import React, { useState } from 'react';
import { Sparkles, X, ArrowRight, Lightbulb, AlertCircle } from 'lucide-react';

interface ProjectAnalysisFormProps {
  onSubmit: (prompt: string) => void;
  isLoading: boolean;
}

const SAMPLE_PROMPTS = [
  {
    title: '🎓 EdTech Note Summarizer & Quizzes',
    text: 'I want to build a platform where college students can upload notes, use AI to summarize them, generate quizzes, and discuss topics with other students.'
  },
  {
    title: '💻 Dev Codebase Indexer & Agent',
    text: 'I want to build a web-based developer tool that indexes GitHub repositories, detects security vulnerabilities, and generates unit tests automatically using LLM agents.'
  },
  {
    title: '🎨 Multimodal Creative Asset Generator',
    text: 'I want to build a SaaS platform for social media creators that generates image assets, writes copy captions, and converts text into spoken audio tracks.'
  }
];

export const ProjectAnalysisForm: React.FC<ProjectAnalysisFormProps> = ({ onSubmit, isLoading }) => {
  const [promptText, setPromptText] = useState('');
  const [error, setError] = useState('');

  const minLength = 20;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = promptText.trim();
    if (trimmed.length < minLength) {
      setError(`Please describe your project idea in at least ${minLength} characters for an accurate analysis.`);
      return;
    }
    setError('');
    onSubmit(trimmed);
  };

  const handleSelectSample = (text: string) => {
    setPromptText(text);
    setError('');
  };

  const handleClear = () => {
    setPromptText('');
    setError('');
  };

  return (
    <div className="analysis-form-card">
      <div className="form-header">
        <div className="form-title-group">
          <div className="icon-badge">
            <Lightbulb size={20} />
          </div>
          <div>
            <h3>Describe Your Project Concept</h3>
            <p>Enter your product idea, target audience, core features, or technical goals. No length limit.</p>
          </div>
        </div>
        {promptText && (
          <button 
            type="button" 
            className="clear-text-btn" 
            onClick={handleClear}
            disabled={isLoading}
          >
            <X size={14} /> Clear input
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        <div className="textarea-wrapper">
          <textarea
            value={promptText}
            onChange={(e) => {
              setPromptText(e.target.value);
              if (error) setError('');
            }}
            placeholder='e.g. "I want to build a platform where college students can upload notes, use AI to summarize them, generate quizzes, and discuss topics with other students."'
            rows={6}
            disabled={isLoading}
          />
          <div className="textarea-footer">
            <span className={`char-counter ${promptText.length < minLength && promptText.length > 0 ? 'warning' : ''}`}>
              {promptText.length.toLocaleString()} characters {promptText.length > 0 && promptText.length < minLength ? `(minimum ${minLength} required)` : ''}
            </span>
          </div>
        </div>

        {error && (
          <div className="form-error-banner">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <div className="sample-prompts-section">
          <p className="sample-label">
            <Sparkles size={13} /> Or select a sample project prompt to analyze:
          </p>
          <div className="sample-chips-grid">
            {SAMPLE_PROMPTS.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                className="sample-chip"
                onClick={() => handleSelectSample(sample.text)}
                disabled={isLoading}
              >
                <b>{sample.title}</b>
                <span>{sample.text.slice(0, 75)}...</span>
              </button>
            ))}
          </div>
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="primary analyze-submit-btn"
            disabled={isLoading || promptText.trim().length < minLength}
          >
            {isLoading ? (
              <>
                <span className="spinner-dot" />
                <span>Running Project Analysis...</span>
              </>
            ) : (
              <>
                <Sparkles size={18} />
                <span>Analyze Project Strategy</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
