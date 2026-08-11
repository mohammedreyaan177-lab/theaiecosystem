import React, { useState } from 'react';
import { CompleteAnalysisReport } from '../types';
import { runProjectAnalysis, ToolData } from '../services/analysisEngine';
import { ProjectAnalysisForm } from './ProjectAnalysisForm';
import { LoadingAnalysisView } from './LoadingAnalysisView';
import { AnalysisResultsView } from './AnalysisResultsView';
import { BrainCircuit, AlertCircle, RotateCcw } from 'lucide-react';
import '../styles/projectAnalysis.css';

interface ProjectAnalysisPageProps {
  tools?: ToolData[];
  categories?: any[];
}

export const ProjectAnalysisPage: React.FC<ProjectAnalysisPageProps> = ({ tools = [] }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [report, setReport] = useState<CompleteAnalysisReport | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleStartAnalysis = async (userPrompt: string) => {
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const result = await runProjectAnalysis(userPrompt, tools);
      setReport(result);
    } catch (err: any) {
      console.error('Project Analysis Error:', err);
      setErrorMsg('An unexpected error occurred while analyzing your project. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setReport(null);
    setErrorMsg(null);
  };

  return (
    <div className="project-analysis-page">
      <div className="page-heading compact">
        <div>
          <p className="eyebrow">
            <BrainCircuit size={13} /> TECHNICAL EVALUATION ENGINE
          </p>
          <h1>Project Analysis</h1>
          <p className="page-subtitle">
            Describe your project idea to analyze the recommended technology stack, AI tools matching, and internet product presence.
          </p>
        </div>
      </div>

      {errorMsg && (
        <div className="analysis-error-banner">
          <AlertCircle size={18} />
          <div>
            <b>Analysis Engine Warning:</b>
            <p>{errorMsg}</p>
          </div>
          <button type="button" className="button small" onClick={handleReset}>
            <RotateCcw size={13} /> Try Again
          </button>
        </div>
      )}

      {isLoading ? (
        <LoadingAnalysisView />
      ) : report ? (
        <AnalysisResultsView report={report} onReset={handleReset} />
      ) : (
        <ProjectAnalysisForm onSubmit={handleStartAnalysis} isLoading={isLoading} />
      )}
    </div>
  );
};

export default ProjectAnalysisPage;
