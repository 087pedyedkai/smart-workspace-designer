import type { WorkspaceAnalysis } from '../utils/workspaceAnalyzer';

interface AnalysisPanelProps {
  analysis: WorkspaceAnalysis;
}

const getScoreColor = (score: number) => {
  if (score >= 80) return 'text-green-700 bg-green-100 border-green-200';
  if (score >= 60) return 'text-amber-700 bg-amber-100 border-amber-200';
  return 'text-red-700 bg-red-100 border-red-200';
};

export default function AnalysisPanel({ analysis }: AnalysisPanelProps) {
  const { workspaceScore, ergonomicScore, comfortScore, suggestions } = analysis;

  // เพิ่มคำแปลภาษาไทยและคำอธิบายสำหรับ Tooltip
  const scores = [
    { 
      label: 'คะแนนพื้นที่ทำงาน', 
      value: workspaceScore,
      description: 'ประเมินการจัดสรรพื้นที่ การซ้อนทับของอุปกรณ์ และระยะการเอื้อมถึง'
    },
    { 
      label: 'คะแนนสรีรศาสตร์', 
      value: ergonomicScore,
      description: 'ประเมินท่าทางการนั่ง ระยะสายตา และความเสี่ยงออฟฟิศซินโดรม'
    },
    { 
      label: 'คะแนนความสะดวกสบาย', 
      value: comfortScore,
      description: 'ประเมินความลื่นไหลในการใช้งาน สภาพแวดล้อม และทิศทางแสง'
    },
  ];

  return (
    <div className="w-80 bg-white border-l border-slate-200 h-full flex flex-col shadow-sm z-10">
      <div className="p-4 border-b border-slate-200 bg-slate-50">
        <h2 className="text-lg font-bold text-slate-800">การวิเคราะห์พื้นที่ทำงาน</h2>
        <p className="text-xs text-slate-500 mt-1">
          ประเมินหลักสรีรศาสตร์แบบเรียลไทม์
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        
        {/* ส่วนแสดงคะแนน (Scores) */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            คะแนน
          </h3>
          <div className="space-y-4">
            {scores.map((score) => (
              <div key={score.label} className="flex items-center justify-between">
                
                {/* ชื่อคะแนน พร้อม Tooltip (group) */}
                <div className="flex items-center gap-1.5 relative group cursor-help">
                  <span className="text-sm font-medium text-slate-700">{score.label}</span>
                  
                  {/* ไอคอน ? */}
                  <svg className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>

                  {/* กล่องข้อความ Tooltip (จะแสดงตอน Hover) */}
                  <div className="absolute left-0 bottom-full mb-2 hidden w-48 p-2.5 text-xs text-white bg-slate-800 rounded-lg shadow-lg group-hover:block z-50 leading-relaxed">
                    {score.description}
                    {/* สามเหลี่ยมชี้ลง */}
                    <div className="absolute left-6 top-full w-2 h-2 -mt-1 bg-slate-800 rotate-45"></div>
                  </div>
                </div>

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
            คำแนะนำ
          </h3>
          
          {suggestions.length === 0 ? (
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-sm text-green-700 flex items-start gap-2">
                <span className="mt-0.5">✨</span> 
                <span>ยอดเยี่ยม! การจัดโต๊ะของคุณถูกต้องตามหลักสรีรศาสตร์ทุกประการ</span>
              </p>
            </div>
          ) : (
            <ul className="space-y-2">
              {suggestions.map((suggestion, index) => (
                <li 
                  key={index}
                  className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-sm text-amber-800 flex items-start gap-2 leading-relaxed"
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