import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Sparkles, Brain, Award, BookOpen, Search, Layers, ShieldCheck, ChevronLeft } from "lucide-react";
import StudyAI from "./StudyAI";
import ChallengesZone from "./ChallengesZone";
import WeeklySchedule from "./WeeklySchedule";
import DigitalLibrarySystem from "./DigitalLibrarySystem";
import { translations, Language } from "../utils/translations";

interface AcademicsPageProps {
  user: any;
  onAddPoints: (pts: number, classId: string, logMsg: string) => void;
  activeGrade: string;
  setActiveGrade: (grade: string) => void;
  subTab?: string;
  lang?: Language;
}

export default function AcademicsPage({ user, onAddPoints, activeGrade, setActiveGrade, subTab, lang }: AcademicsPageProps) {
  const [currentSection, setCurrentSection] = useState("overview");

  useEffect(() => {
    if (subTab) {
      setCurrentSection(subTab);
    }
  }, [subTab]);

  const currentLang = lang || "ar";
  const t = translations[currentLang];

  const studyTabs = [
    { id: "overview", label: t.academics_overview, icon: Layers },
    { id: "challenges", label: t.academics_challenges, icon: Award },
    { id: "ai-tutor", label: "SkooLy AI", icon: Sparkles },
    { id: "library", label: t.academics_library, icon: BookOpen },
  ];

  return (
    <div className="space-y-8 animate-fade-in text-right">
      {/* Dynamic Tab Switchers representing the Academic divisions */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center border-b border-slate-900 pb-5 gap-4">
        <div>
          <span className="inline-flex rounded-full bg-cyan-500/10 px-3 py-1 text-[10px] font-black text-cyan-400 capitalize tracking-widest mb-1">
            البوابة والأقسام الأكاديمية
          </span>
          <h2 className="font-display text-2xl font-black text-white">التعليم الذكي ونظام كابستون التفاعلي</h2>
        </div>

        <div className="flex flex-wrap gap-2.5">
          {studyTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentSection === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setCurrentSection(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                  isActive
                    ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.15)]"
                    : "bg-slate-950/60 border-slate-900 text-slate-350 hover:text-white"
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? "text-cyan-450 animate-pulse" : "opacity-80"}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {currentSection === "overview" && (
        <div className="space-y-12">
          {/* Capstone Projects Section directly matching the STEM EGYPT video content / aesthetic */}
          <section className="space-y-6">
            <div className="text-center space-y-2">
              <span className="text-[10px] font-black text-cyan-405 tracking-widest uppercase font-mono block">OUR INNOVATION CORE</span>
              <h3 className="font-display text-xl font-bold text-white tracking-tight">مشاريع كابستون التفاعلية (CAPSTONE PROJECTS)</h3>
              <p className="text-xs text-slate-400 max-w-2xl mx-auto leading-relaxed">
                نتبع فلسفة تعليمية قائمة على البحث العلمي والتفاعل العملي وتنمية الحلول التقنية المستوحاة من تحديات التنمية المستدامة
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: "البحث العلمي (Research)",
                  desc: "حث الطلاب على استجلاء التحديات البيئية والمجتمعية، وجمع المعلومات والمراجع من مصادر البحوث الرسمية والمنصات التابعة للوزارة لتأسيس نظرية واضحة لحل المشكلات.",
                  icon: Search,
                  color: "text-sky-400"
                },
                {
                  title: "التصميم والعرض (Presentation)",
                  desc: "تطوير مهارات ممتعة في تحضير وتصميم العروض التقديمية والسبورات التوضيحية لشرح حلولهم التقنية أمام زملائهم وهيئة التدريس بكفاءة وثقة عالية.",
                  icon: Layers,
                  color: "text-cyan-400"
                },
                {
                  title: "التعاون البنّاء (Collaboration)",
                  desc: "العمل بروح الفريق الواحد في مجموعات تفاعلية، لتبادل الأفكار وبناء النماذج التطبيقية والبحثية، مما يعزز الذكاء العاطفي والاجتماعي المتميز.",
                  icon: Brain,
                  color: "text-indigo-400"
                }
              ].map((caps, index) => {
                const Icon = caps.icon;
                return (
                  <div key={index} className="rounded-2xl border border-slate-900 bg-slate-950/40 p-6 space-y-4 hover:border-cyan-500/10 transition-all flex flex-col justify-start">
                    <div className="h-11 w-11 rounded-xl bg-slate-950 border border-slate-900 flex items-center justify-center">
                      <Icon className={`h-5.5 w-5.5 ${caps.color}`} />
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-display text-sm font-black text-white">{caps.title}</h4>
                      <p className="text-[11px] text-slate-405 leading-relaxed font-semibold">{caps.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Curriculum Section matching the video */}
          <section className="rounded-2xl border border-slate-900 bg-slate-950/30 p-8 space-y-6">
            <div className="border-b border-slate-900 pb-4 mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <span className="text-[10px] font-black text-cyan-400 font-mono tracking-widest block uppercase">THE CORE SYLLABUS</span>
                <h3 className="font-display text-lg font-black text-white">منهجنا الأكاديمي المتبع (OUR CURRICULUM)</h3>
              </div>
              <span className="inline-flex rounded-xl bg-cyan-950/40 border border-cyan-500/20 px-3 py-1.5 text-[10px] font-bold text-cyan-300">
                رسمي لغات • مناهج الوزارة 2026/2027
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 leading-relaxed text-xs text-slate-300">
              <div className="space-y-3">
                <p>
                  يرتكز برنامج التعليم بمدرسة الصالحين للغات على تدريب عقول الطلاب لخدمة وتطوير أساليب الابتكار العلمي وتحليل المعضلات والمسائل والربط الشامل للمبادئ النظرية بالواقع المحسوس والميداني.
                </p>
                <p className="text-slate-405">
                  يتضمن ذلك تدريس العلوم المتكاملة، اللغة الإنجليزية المتطورة، تكنولوجيا الروبوتات والحوسبة، والمساقات الاجتماعية والأخلاقية المحفزة للفكر الذكي والمجتمعي.
                </p>
              </div>

              <div className="rounded-xl border border-slate-900/80 bg-slate-950/80 p-5 space-y-4">
                <h4 className="font-display text-xs font-black text-white flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-cyan-400" />
                  أبرز معايير المنهج الدراسي الحاذق:
                </h4>
                <ul className="space-y-2 text-[11px] font-semibold text-slate-400 pr-5 list-disc">
                  <li>التقويم المستمر من خلال الامتحانات الذكية المتنوعة.</li>
                  <li>تنفيذ مشروع كابستون عملي بنهاية الفصل الدراسي.</li>
                  <li>المشاركة في الأنشطة والمسابقات العلمية والرياضية.</li>
                  <li>التأهيل الشامل لاجتياز اختبار القبول والامتحانات الوزارية النهائية.</li>
                </ul>
              </div>
            </div>

            {/* Quick action helper to go to online exams */}
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setCurrentSection("challenges")}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-400 px-5 py-3 text-xs font-black text-slate-950 transition-all hover:scale-105 cursor-pointer"
              >
                <span>التحول الآن لمنصة الامتحانات والتحديات</span>
                <ChevronLeft className="h-4.5 w-4.5" />
              </button>
            </div>
          </section>

          {/* Interactive Weekly Schedule section */}
          <section className="space-y-4">
            <WeeklySchedule defaultClassId="1A" lang={currentLang} />
          </section>
        </div>
      )}

      {currentSection === "challenges" && (
        <ChallengesZone
          user={user}
          onAddPoints={onAddPoints}
          activeGrade={activeGrade}
          setActiveGrade={setActiveGrade}
        />
      )}

      {currentSection === "ai-tutor" && (
        <StudyAI lang={lang} />
      )}

      {currentSection === "library" && (
        <DigitalLibrarySystem user={user} onAddPoints={onAddPoints} lang={currentLang} />
      )}
    </div>
  );
}
