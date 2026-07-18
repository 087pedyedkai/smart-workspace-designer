import type { WorkspaceAnalysis } from '../utils/workspaceAnalyzer';

interface AnalysisPanelProps {
  analysis: WorkspaceAnalysis;
}

// ฟังก์ชันช่วยกำหนดสีตามช่วงคะแนน
const getScoreColor = (score: number) => {
  if (score >= 80) return 'text-green-700 bg-green-100 border-green-200';
  if (score >= 60) return 'text-amber-700 bg-amber-100 border-amber-200';
  return 'text-red-700 bg-red-100 border-red-200';
};

export default function AnalysisPanel({ analysis }: AnalysisPanelProps) {
  const { workspaceScore, ergonomicScore, comfortScore, suggestions } = analysis;

  const scores = [
    { label: 'Workspace Score', value: workspaceScore },
    { label: 'Ergonomic Score', value: ergonomicScore },
    { label: 'Comfort Score', value: comfortScore },
  ];

  return (
    <div className="w-80 bg-white border-l border-slate-200 h-full flex flex-col shadow-sm z-10">
      <div className="p-4 border-b border-slate-200 bg-slate-50">
        <h2 className="text-lg font-bold text-slate-800">Workspace Analysis</h2>
        <p className="text-xs text-slate-500 mt-1">
          Real-time ergonomic evaluation
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        
        {/* ส่วนแสดงคะแนน (Scores) */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Scores
          </h3>
          <div className="space-y-3">
            {scores.map((score) => (
              <div key={score.label} className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700">{score.label}</span>
                <div className={`px-3 py-1 rounded-full text-xs font-bold border ${getScoreColor(score.value)}`}>
                  {score.value} / 100
                </div>
              </div>
            ))}
          </div>
        </div>

        <hr className="border-slate-200" />

        {/* ส่วนแสดงคำแนะนำ (Recommendations) */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Recommendations
          </h3>
          
          {suggestions.length === 0 ? (
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-sm text-green-700 flex items-start gap-2">
                <span>✨</span> 
                <span>Perfect setup! Your workspace meets all ergonomic rules.</span>
              </p>
            </div>
          ) : (
            <ul className="space-y-2">
              {suggestions.map((suggestion, index) => (
                <li 
                  key={index}
                  className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-sm text-amber-800 flex items-start gap-2"
                >
                  <span className="mt-0.5">💡</span>
                  <span>{suggestion}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}