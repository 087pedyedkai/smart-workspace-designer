import React from 'react';
import type { WorkspaceAnalysis } from '../utils/workspaceAnalyzer';

interface AnalysisPanelProps {
  analysis: WorkspaceAnalysis;
}

const getScoreColor = (score: number) => {
  if (score >= 90) return 'text-green-600';
  if (score >= 70) return 'text-yellow-500';
  return 'text-red-600';
};

const AnalysisPanel: React.FC<AnalysisPanelProps> = ({ analysis }) => {
  return (
    <aside className="w-[280px] bg-slate-50 border-l border-slate-200 h-full flex flex-col shrink-0 overflow-y-auto">
      <div className="p-4 border-b border-slate-200">
        <h2 className="font-semibold text-slate-700">Workspace Analysis</h2>
      </div>
      
      <div className="p-4 flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between bg-white p-3 border border-slate-200 rounded shadow-sm">
            <span className="text-sm text-slate-600">Workspace Score:</span>
            <span className={`font-bold ${getScoreColor(analysis.workspaceScore)}`}>{analysis.workspaceScore}</span>
          </div>
          <div className="flex items-center justify-between bg-white p-3 border border-slate-200 rounded shadow-sm">
            <span className="text-sm text-slate-600">Ergonomic Score:</span>
            <span className={`font-bold ${getScoreColor(analysis.ergonomicScore)}`}>{analysis.ergonomicScore}</span>
          </div>
          <div className="flex items-center justify-between bg-white p-3 border border-slate-200 rounded shadow-sm">
            <span className="text-sm text-slate-600">Comfort Score:</span>
            <span className={`font-bold ${getScoreColor(analysis.comfortScore)}`}>{analysis.comfortScore}</span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="text-sm font-semibold text-slate-700">Suggestions:</h3>
          <div className="bg-slate-100 p-3 rounded border border-slate-200 text-sm text-slate-500 min-h-[100px]">
            {analysis.suggestions.length > 0 ? (
              <ul className="list-disc list-inside space-y-2">
                {analysis.suggestions.map((suggestion) => (
                  <li key={suggestion}>{suggestion}</li>
                ))}
              </ul>
            ) : (
              <div>Workspace looks good!</div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default AnalysisPanel;