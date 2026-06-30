import { useState } from "react";
import { motion } from "motion/react";
import { Award, Compass, School, Trophy, GraduationCap, Flame, ArrowUpRight } from "lucide-react";
import Leaderboard from "./Leaderboard";
import HonorRollSystem from "./HonorRollSystem";

interface AlumniPageProps {
  classScores: any[];
  onBoostClass: (classId: string, pts: number, reason: string) => Promise<void>;
  onSimulateDay: () => void;
  user: any;
  competitionLog: string[];
  lang?: "ar" | "en";
}

export default function AlumniPage({
  classScores,
  onBoostClass,
  onSimulateDay,
  user,
  competitionLog,
  lang = "ar",
}: AlumniPageProps) {
  const [currentSection, setCurrentSection] = useState("alumni-grid");
  const isAr = lang === "ar";

  // Universities logos representing prestigious alumni placements, modeled on the video layout
  const uniBadges = [
    { name: isAr ? "جامعة القاهرة" : "Cairo University", logo: "CU", color: "bg-emerald-950/40 border-emerald-500/20 text-emerald-400" },
    { name: isAr ? "جامعة عين شمس" : "Ain Shams Univ.", logo: "ASU", color: "bg-red-950/40 border-red-500/20 text-red-400" },
    { name: isAr ? "الجامعة الأمريكية" : "AUC University", logo: "AUC", color: "bg-blue-950/40 border-blue-500/20 text-blue-400" },
    { name: isAr ? "جامعة الإسكندرية" : "Alexandria Univ.", logo: "ALEX", color: "bg-teal-950/40 border-teal-500/20 text-teal-400" },
    { name: isAr ? "كلية الهندسة" : "Engineering Col.", logo: "ENG", color: "bg-amber-950/40 border-amber-500/20 text-amber-400" },
    { name: isAr ? "البرمجيات والذكاء" : "AI & Software", logo: "AI", color: "bg-cyan-950/40 border-cyan-500/20 text-cyan-400" }
  ];

  const sections = [
    { id: "alumni-grid", label: isAr ? "خريجو مدرسة الصالحين والجامعات" : "El-Salheen Alumni Placements", icon: GraduationCap },
    { id: "honour", label: isAr ? "لوحة الشرف وفصول الصالحين العليا" : "Honor Roll & Standings", icon: Trophy },
  ];

  return (
    <div className={`space-y-8 animate-fade-in ${isAr ? "text-right" : "text-left"}`} dir={isAr ? "rtl" : "ltr"}>
      <div className={`flex flex-col lg:flex-row justify-between items-start lg:items-center border-b border-slate-900 pb-5 gap-3`}>
        <div>
          <span className="inline-flex rounded-full bg-cyan-500/10 px-3 py-1 text-[10px] font-black text-cyan-405 uppercase tracking-wider">
            {isAr ? "قدوتنا وفخر الصالحين" : "Our Pride & Inspiration"}
          </span>
          <h2 className="font-display text-2xl font-black text-white">
            {isAr ? "الخريجون ولوحة الشرف الأكاديمية" : "Alumni & Academic Honor Roll"}
          </h2>
        </div>

        <div className="flex flex-wrap gap-2.5">
          {sections.map((sec) => {
            const Icon = sec.icon;
            const isActive = currentSection === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => setCurrentSection(sec.id)}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                  isActive
                    ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-405 shadow-[0_0_12px_rgba(6,182,212,0.15)]"
                    : "bg-slate-950/60 border-slate-900 text-slate-350 hover:text-white"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{sec.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {currentSection === "alumni-grid" && (
        <div className="space-y-12 animate-fade-in">
          {/* Header section echoing the exact style in the video ("Our Alumni here and overseas") */}
          <div className="relative rounded-2xl border border-slate-900 bg-slate-950/60 overflow-hidden py-14 px-8 text-center space-y-4">
            {/* Elegant Background decoration */}
            <div className="absolute inset-0 opacity-15 bg-gradient-to-t from-slate-950 via-slate-950 to-slate-900 pointer-events-none"></div>
            <div className="absolute -top-10 -left-10 h-32 w-32 rounded-full bg-cyan-500/5 filter blur-xl pointer-events-none"></div>

            <GraduationCap className="h-12 w-12 text-cyan-400 mx-auto animate-bounce" />
            <h3 className="font-display text-2xl font-black text-white">
              {isAr ? "Alumni - خريجو الصالحين" : "Alumni - El-Salheen Graduates"}
            </h3>
            <p className="text-xs text-slate-405 font-bold tracking-wider uppercase font-sans">
              Our Alumni here and overseas • خريجونا في مصر وخارجها
            </p>
            <div className="h-0.5 w-16 bg-gradient-to-r from-sky-500 to-cyan-400 mx-auto rounded-full mt-4"></div>
          </div>

          {/* Prestige placement section */}
          <section className="space-y-6">
            <h4 className={`font-display text-sm font-black text-white flex items-center justify-start gap-2 border-cyan-451 pr-3 ${isAr ? "border-r-4 pr-3 pl-0" : "border-l-4 pl-3 pr-0"}`}>
              {isAr ? "أبرز الكليات والجامعات التي التحق بها فرساننا" : "Distinguished Colleges & Universities Our Knights Attended"}
            </h4>

            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              {uniBadges.map((uni, idx) => (
                <div key={idx} className={`rounded-2xl border p-6 text-center space-y-3 flex flex-col items-center justify-center ${uni.color}`}>
                  <span className="text-lg font-black font-mono select-none tracking-widest">{uni.logo}</span>
                  <div className="h-px w-8 bg-current opacity-30"></div>
                  <span className="text-[10px] font-bold block">{uni.name}</span>
                </div>
              ))}
            </div>
          </section>

          {/* SUCCESS STORIES SECTION */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-slate-900 bg-slate-950/40 p-6 space-y-3">
              <span className="text-[9px] font-bold text-cyan-400">{isAr ? "دفعة 2018" : "Class of 2018"}</span>
              <h4 className="font-display text-sm font-black text-white">
                {isAr ? "المهندسة نورا عبد التواب (هندسة عين شمس)" : "Eng. Nora Abdel-Tawab (Ain Shams Engineering)"}
              </h4>
              <p className="text-[11px] text-slate-400 leading-relaxed font-semibold">
                {isAr 
                  ? '"كانت مدرسة الصالحين نقطة انطلاقي الحقيقية، فالاهتمام بالتعليم وتوفير فرص الإبداع وتطبيقات العلوم المدرسية مهد لي الدرب للتفوق وصقل الموهبة."'
                  : '"El-Salheen was my real launchpad; the focus on top-tier tutoring, creative spaces, and physical science applications paved my way to outstanding success."'}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-900 bg-slate-950/40 p-6 space-y-3">
              <span className="text-[9px] font-bold text-amber-400">{isAr ? "دفعة 2021" : "Class of 2021"}</span>
              <h4 className="font-display text-sm font-black text-white">
                {isAr ? "د. يوسف الشناوي (كلية الذكاء الاصطناعي بجامعة القاهرة)" : "Dr. Youssef El-Shennawy (Cairo Univ. AI College)"}
              </h4>
              <p className="text-[11px] text-slate-400 leading-relaxed font-semibold">
                {isAr 
                  ? '"تأسس حبي للتكنولوجيا في مدرسة الصالحين للغات من خلال فوزي بالمركز الأول في نوادي البرمجيات والكمبيوتر، ودعم وإخلاص كافة المعلمين بالمدرسة."'
                  : '"My deep passion for technologies was founded at El-Salheen School through winning first place in computer clubs with the sincere guidance of all teachers."'}
              </p>
            </div>
          </section>
        </div>
      )}

      {currentSection === "honour" && (
        <div className="space-y-12">
          {/* Interactive weekly Honor Roll & digital certificate generator */}
          <HonorRollSystem user={user} lang={lang} />

          {/* Leaders of classes */}
          <div className="border-t border-slate-900 pt-10">
            <h4 className={`font-display text-sm font-black text-[#c5a85c] flex items-center justify-start gap-2 border-[#c5a85c] mb-6 ${isAr ? "border-r-4 pr-3" : "border-l-4 pl-3"}`}>
              {isAr ? "ترتيب الفصول ومنافسات كأس الصالحين التراكمية" : "Class Standings & Cumulative Salheen Championship Cup"}
            </h4>
            <Leaderboard
              classScores={classScores}
              onBoostClass={onBoostClass}
              onSimulateDay={onSimulateDay}
              user={user}
              competitionLog={competitionLog}
              lang={lang}
            />
          </div>
        </div>
      )}
    </div>
  );
}
