export default function Header() {
  return (
    <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm z-20 relative shrink-0">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">เว็บไซต์ออกแบบพื้นที่ทำงาน</h1>
          <p className="text-xs font-medium text-slate-500">ระบบสนับสนุนการตัดสินใจตามหลักสรีรศาสตร์</p>
        </div>
      </div>
      {/* <div className="hidden sm:block text-xs font-semibold text-slate-400 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
        รุ่น 1.0
      </div> */}
    </header>
  );
}