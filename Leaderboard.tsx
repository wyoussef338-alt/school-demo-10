import { motion } from "motion/react";
import { Trophy, Zap, RefreshCw, Flame, HelpCircle } from "lucide-react";
import { ClassScore } from "../types";

interface LeaderboardProps {
  classScores: ClassScore[];
  onBoostClass: (classId: string, pts: number, reason: string) => void;
  onSimulateDay: () => void;
  user: any;
  competitionLog: string[];
  lang?: "ar" | "en";
}

export default function Leaderboard({ classScores, onBoostClass, onSimulateDay, user, competitionLog, lang = "ar" }: LeaderboardProps) {
  const isAr = lang === "ar";
  const sortedScores = [...classScores].sort((a, b) => b.points - a.points);
  const firstPlace = sortedScores[0];

  const handleBoost = (classId: string, pts: number, reason: string) => {
    onBoostClass(classId, pts, reason);
  };

  const isStaff = user?.role === "teacher" || user?.role === "admin";

  return (
    <div className={`grid grid-cols-1 gap-6 lg:grid-cols-3 ${isAr ? "text-right" : "text-left"}`} dir={isAr ? "rtl" : "ltr"}>
      <div className="flex flex-col gap-6 lg:col-span-2">
        {firstPlace && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative overflow-hidden rounded-2xl border border-cyan-500/20 bg-gradient-to-r from-[#0d1e36] to-[#040b16] p-6 shadow-xl"
          >
            <div className={`absolute ${isAr ? "left-6" : "right-6"} top-6 text-3xl`}>🏆</div>
            <span className="inline-flex rounded-full border border-cyan-500/30 bg-slate-950 px-3.5 py-0.5 text-[10px] font-black text-cyan-400">
              {isAr ? "الفصل المتصدر المتميز حالياً" : "Current Class Leader"}
            </span>
            <h3 className="mt-3 font-display text-lg font-extrabold text-white">
              {isAr ? `🎉 الفصل ${firstPlace.name} هو المتصدر بالمركز الأول!` : `🎉 Class ${firstPlace.name} is leading in first place!`}
            </h3>
            <p className="mt-1 text-xs text-slate-300 font-bold">
              {isAr ? `بإجمالي رصيد ${firstPlace.points} نقطة مستحقة للترم الأول.` : `With a total of ${firstPlace.points} points earned for the first term.`}
            </p>
          </motion.div>
        )}

        <section className="rounded-2xl border border-sky-500/15 bg-slate-900/80 p-6 shadow-xl backdrop-blur-xl">
          <h3 className="font-display text-base font-bold text-white flex items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <span>{isAr ? "لوحة منافسات الفصول ومجموع النقاط" : "Class Competition & Points Standings"}</span>
            {isStaff && (
              <button
                onClick={onSimulateDay}
                className="flex items-center gap-1.5 rounded-xl border border-cyan-500/30 bg-slate-950 hover:bg-slate-900 px-3.5 py-2 text-[10px] font-black text-cyan-300 hover:text-white transition-all cursor-pointer"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                {isAr ? "محاكاة يوم دراسي" : "Simulate School Day"}
              </button>
            )}
          </h3>

          <div className="mt-4 flex flex-col gap-3">
            {sortedScores.map((item, index) => {
              const maxPoints = Math.max(...classScores.map((c) => c.points), 1);
              const percentage = (item.points / maxPoints) * 100;
              return (
                <div key={item.id} className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 shadow-inner">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-200 mb-2">
                    <span className="flex items-center gap-2">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-sky-500 to-cyan-400 text-[10px] font-black text-slate-950">
                        {index + 1}
                      </span>
                      {item.name}
                    </span>
                    <span className="text-cyan-400 font-bold">{item.points} {isAr ? "نقطة فخرية" : "Honor Points"}</span>
                  </div>

                  <div className="h-2 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-sky-500 to-cyan-400"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>

                  {isStaff && (
                    <div className={`mt-3 flex flex-wrap gap-1.5 ${isAr ? "justify-end" : "justify-start"}`}>
                      <button
                        onClick={() => handleBoost(item.id, 15, isAr ? "تفوق أكاديمي" : "Academic Excellence")}
                        className="rounded bg-slate-900/80 border border-slate-800 hover:border-cyan-500/30 px-3 py-1.5 text-[9px] font-bold text-slate-100 cursor-pointer"
                      >
                        {isAr ? "تفوق (+15)" : "Excellence (+15)"}
                      </button>
                      <button
                        onClick={() => handleBoost(item.id, 10, isAr ? "انضباط وسلوك" : "Behavior & Discipline")}
                        className="rounded bg-slate-900/80 border border-slate-800 hover:border-cyan-500/30 px-3 py-1.5 text-[9px] font-bold text-slate-100 cursor-pointer"
                      >
                        {isAr ? "انضباط (+10)" : "Discipline (+10)"}
                      </button>
                      <button
                        onClick={() => handleBoost(item.id, 20, isAr ? "مشروع جماعي" : "Group Project")}
                        className="rounded bg-slate-900/80 border border-slate-800 hover:border-cyan-500/30 px-3 py-1.5 text-[9px] font-bold text-slate-100 cursor-pointer"
                      >
                        {isAr ? "مشروع جماعي (+20)" : "Group Project (+20)"}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </div>

      <div className="flex flex-col gap-6 lg:col-span-1">
        <section className="rounded-2xl border border-sky-500/15 bg-slate-900/80 p-5 shadow-xl backdrop-blur-xl">
          <h3 className="font-display text-base font-bold text-white flex items-center justify-start gap-2 border-b border-slate-800 pb-3">
            <Zap className="h-4 w-4 text-cyan-400 animate-pulse" />
            {isAr ? "سجل المنافسة والنشاط" : "Competition & Activity Log"}
          </h3>

          <div className="mt-4 flex flex-col gap-2.5 max-h-[380px] overflow-y-auto">
            {competitionLog.length === 0 ? (
              <p className="text-center text-xs text-slate-500 font-bold py-6">
                {isAr ? "لا يوجد سجلات نشاط مسجلة حالياً." : "No activity records registered currently."}
              </p>
            ) : (
              competitionLog.map((log, i) => (
                <div key={i} className="rounded-xl border border-slate-850 bg-slate-950/80 p-3 text-xs text-slate-300 font-bold leading-relaxed">
                  {log}
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

