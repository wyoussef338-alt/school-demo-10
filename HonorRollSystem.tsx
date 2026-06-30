import { useState, useEffect } from "react";
import { 
  Trophy, 
  Award, 
  Download, 
  Share2, 
  Printer, 
  Sparkles, 
  Medal, 
  UserCheck, 
  Heart, 
  Bookmark, 
  Check, 
  User, 
  ChevronLeft,
  Crown
} from "lucide-react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

interface HeroStudent {
  name: string;
  classId: string;
  points: number;
  reason: string;
  category: "academic" | "sports" | "behavior";
  avatarColor: string;
}

export default function HonorRollSystem({ user, lang = "ar" }: { user?: any; lang?: "ar" | "en" }) {
  const isAr = lang === "ar";
  
  const [topStudents, setTopStudents] = useState<HeroStudent[]>([]);

  useEffect(() => {
    // Generate default top students with translations
    const defaultStudents: HeroStudent[] = [
      { name: isAr ? "منى عبد الله سلامة" : "Mona Abdullah Salama", classId: "1A", points: 285, reason: isAr ? "المرتبة الأولى في مسابقة الإعراب الإقليمية وحفظ سورة البقرة" : "First place in regional parsing contest & Qur'an memorization", category: "academic", avatarColor: "from-amber-450 to-orange-500" },
      { name: isAr ? "ياسين كريم عبد الله" : "Yassin Karim Abdullah", classId: "2A", points: 240, reason: isAr ? "هدف الفوز في كأس الصالحين الكروي والصورة المثالية للتعاون" : "Winning goal in Salheen Soccer Cup and a prime model of cooperation", category: "sports", avatarColor: "from-cyan-405 to-blue-500" },
      { name: isAr ? "عمر خالد الألفي" : "Omar Khaled Al-Alfy", classId: "3A", points: 210, reason: isAr ? "المواظبة الذهبية التامة وعدم التغيب أو التأخر الصباحي مطلقا" : "Golden attendance with absolute zero tardiness or morning absence", category: "behavior", avatarColor: "from-emerald-450 to-teal-500" },
      { name: isAr ? "فاطمة أحمد المنصوري" : "Fatma Ahmed Al-Mansouri", classId: "1A", points: 195, reason: isAr ? "تلخيص 15 كتاباً في تحدي القراءة الرقمي وإلقاء ممتاز" : "Summarized 15 books in Digital Reading Challenge with stellar recital", category: "academic", avatarColor: "from-fuchsia-500 to-rose-500" }
    ];

    // Attempt to load live highest-scoring students from registered users in localStorage
    const localAll = localStorage.getItem("salheen_all_registered");
    if (localAll) {
      try {
        const users = JSON.parse(localAll);
        const studentsOnly = users.filter((u: any) => u.role === "student" && u.points > 0);
        if (studentsOnly.length > 0) {
          // Sort by points
          studentsOnly.sort((a: any, b: any) => b.points - a.points);
          // Map top 4
          const mapped: HeroStudent[] = studentsOnly.slice(0, 4).map((s: any, idx: number) => {
            const categories: Array<"academic" | "sports" | "behavior"> = ["academic", "behavior", "sports"];
            const colors = [
              "from-amber-450 to-orange-500",
              "from-cyan-405 to-blue-500",
              "from-emerald-400 to-teal-500",
              "from-fuchsia-500 to-rose-500"
            ];
            return {
              name: s.name,
              classId: s.classId || "1A",
              points: s.points,
              reason: s.points >= 150 
                ? (isAr ? "التميز المطلق بالدراسات والأنشطة الإضافية لمعهد الصالحين" : "Absolute excellence in studies and extracurricular work")
                : (isAr ? "الالتزام التربوي والاجتهاد الأكاديمي الصفي" : "Behavioral commitment and classroom academic diligence"),
              category: categories[idx % 3],
              avatarColor: colors[idx % colors.length]
            };
          });
          setTopStudents(mapped);
        } else {
          setTopStudents(defaultStudents);
        }
      } catch (e) {
        console.warn("Could not map students to leaderboard", e);
        setTopStudents(defaultStudents);
      }
    } else {
      setTopStudents(defaultStudents);
    }
  }, [lang, isAr]);

  // Certificate generator states
  const [certName, setCertName] = useState("");
  const [certType, setCertType] = useState<"academic" | "sports" | "quran" | "behavior">("academic");
  const [certClass, setCertClass] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  useEffect(() => {
    setCertName(user?.name || (isAr ? "منى عبد الله سلامة" : "Mona Abdullah Salama"));
    setCertClass(user?.classId || "1A");
  }, [user, isAr]);

  const triggerMockDownload = () => {
    setIsDownloading(true);
    setDownloadSuccess(false);
    
    setTimeout(() => {
      setIsDownloading(false);
      setDownloadSuccess(true);
      
      // Create and download text representation as a backup file download
      const content = `
========================================
       ${isAr ? "مجمع لغات الصالحين التعليمي" : "El-Salheen Language School Complex"}
========================================
            ${isAr ? "شهادة تميز وتقدير فخرية" : "Honorary Certificate of Distinction"}

${isAr ? "بكل دواعي الغبطة والسرور، تتقدم الهيئة التعليمية" : "With sincere honor and delight, the faculty of"}
${isAr ? "بإدارة الصالحين للغات بفريد الثناء والتقدير إلى:" : "El-Salheen Educational Administration presents to:"}

${isAr ? "الطالب(ة):" : "Student:"} ${certName}
${isAr ? "الفصل:" : "Class:"} ${certClass}

${isAr ? "تقديراً لجهوده المستمرة وعطائه المتفوق في مسار:" : "In high appreciation of continuous diligence and exceptional contribution in the track of:"}
[ ${getCertTitle(certType)} ]

${isAr ? "ونسأل المولى جل في علاه أن يديم عليه التوفيق" : "May the Almighty grant persistent success"}
${isAr ? "ورفعة الدرجات، ليكون من صُناع الأمل وفرسان المستقبل." : "and progress, to be a maker of hope and knight of the future."}

${isAr ? "قائد معاهد الصالحين: أ. محمود الكردي" : "School Principal: Mr. Mahmoud El-Kordy"}
========================================
      `;
      const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", isAr ? `شهادة_تميز_الصالحين_${certName}.txt` : `certificate_of_excellence_${certName}.txt`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setTimeout(() => {
        setDownloadSuccess(false);
      }, 4000);
    }, 1800);
  };

  const getCertTitle = (type: string) => {
    switch (type) {
      case "academic":
        return isAr ? "التفوق الأكاديمي والتحصيل المتميز" : "Academic Excellence & Outperforming Attainment";
      case "sports":
        return isAr ? "البطولة الرياضية وكأس الصالحين" : "Sports Championship & El-Salheen Cup Medal";
      case "quran":
        return isAr ? "حفظ وتلاوة القرآن الكريم والأخلاق الفاضلة" : "Qur'an Recitation and Virtuous Ethics";
      default:
        return isAr ? "السلوك المثالي والمواظبة الذهبية" : "Ideal Conduct & Golden Perfect Attendance";
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className={`space-y-8 ${isAr ? "text-right" : "text-left"} font-sans`} dir={isAr ? "rtl" : "ltr"}>
      
      {/* CROWNS & TOP BANNER */}
      <div className="relative rounded-2xl border border-amber-500/15 bg-gradient-to-br from-[#121b2d] via-slate-950 to-[#0c1221] px-6 py-10 overflow-hidden text-center space-y-4">
        {/* Glow Effects */}
        <div className="absolute -top-12 -left-12 h-40 w-40 rounded-full bg-amber-500/5 filter blur-3xl pointer-events-none"></div>
        <div className="absolute top-1/2 right-1/4 h-32 w-32 rounded-full bg-cyan-500/5 filter blur-3xl pointer-events-none"></div>

        <Crown className="h-14 w-14 text-[#c5a85c] mx-auto animate-pulse" />
        <h3 className="font-display text-xl font-black text-white">
          {isAr ? "لوحة الشرف الأسبوعية التفاعلية" : "Interactive Weekly Honor Roll"}
        </h3>
        <p className="text-xs text-[#c5a85c] font-bold tracking-wide uppercase">
          {isAr ? "لوحة الأبطال والمتميزين بنقاط كأس الصالحين" : "Hall of Champions & El-Salheen Cup Leaders"}
        </p>
        <div className="h-1 w-20 bg-gradient-to-r from-amber-500 via-[#c5a85c] to-amber-600 mx-auto rounded-full"></div>
      </div>

      {/* HERO HEROES GRIDS */}
      <section className="space-y-4">
        <h4 className={`font-display text-sm font-black text-white flex items-center justify-start gap-2 border-amber-500 ${isAr ? "border-r-4 pr-3" : "border-l-4 pl-3"}`}>
          {isAr ? "فرسان الأسبوع المتصدرون للقمة:" : "Knights of the Week Leading the Summit:"}
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {topStudents.map((st, idx) => {
            const indexIcons = ["🥇", "🥈", "🥉", "🏅"];
            return (
              <div 
                key={idx} 
                className="relative rounded-2xl border border-slate-800 bg-slate-950/50 p-5 hover:border-amber-500/20 transition-all duration-300 flex flex-col items-center text-center space-y-3"
              >
                {/* Pos badge */}
                <div className="absolute top-3 left-3 text-sm select-none">
                  {indexIcons[idx] || "🏅"}
                </div>

                {/* Avatar with gradient */}
                <div className={`h-14 w-14 rounded-full bg-gradient-to-tr ${st.avatarColor} p-[2px] shadow-lg`}>
                  <div className="h-full w-full rounded-full bg-slate-950 flex items-center justify-center font-black text-white text-xs">
                    {st.name.substring(0, 2)}
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] text-[#c5a85c] font-black">
                    {st.classId} • {isAr ? "فصل كابستون" : "Capstone Class"}
                  </span>
                  <h5 className="text-xs font-black text-white line-clamp-1">{st.name}</h5>
                </div>

                {/* Points count badge */}
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 px-3 py-1 text-[10.5px] font-black text-[#c5a85c] font-mono">
                  <Trophy className="h-3 w-3" />
                  <span>{st.points} {isAr ? "نقطة فخرية" : "Honor Pts"}</span>
                </span>

                <p className="text-[10px] text-slate-400 font-semibold leading-relaxed leading-3 line-clamp-2">
                  ✨ {st.reason}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* INTERACTIVE DIGITAL CERTIFICATE GENERATOR */}
      <section className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        
        {/* Certificate Configuration Form */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-900 bg-slate-950/70 p-5 space-y-4 shadow-lg">
          <div className="space-y-1">
            <span className="text-[9px] text-amber-500 font-black block">
              {isAr ? "محرر التكريم الذاتي" : "Honor Certificate Editor"}
            </span>
            <h4 className="font-display text-sm font-black text-white">
              {isAr ? "قم بإضفاء لمستك وتوليد شهادة التقدير" : "Customize & Generate Certificate"}
            </h4>
            <p className="text-[10px] text-slate-400">
              {isAr ? "خصص محتوى شهادة التقدير الرقمية لتناسب إنجاز الطالب وإهدائه بفخر واعتزاز." : "Personalize the honor certificate content to match and celebrate your student's achievements."}
            </p>
          </div>

          <div className="space-y-3 pt-2">
            
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-300 block">
                {isAr ? "اسم الطالب المكرم:" : "Honored Student Name:"}
              </label>
              <input
                type="text"
                value={certName}
                onChange={(e) => setCertName(e.target.value)}
                placeholder={isAr ? "اكتب اسم الطالب بالكامل..." : "Type student's full name..."}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-300 block">
                {isAr ? "الصف الدراسي:" : "Class / Grade:"}
              </label>
              <input
                type="text"
                value={certClass}
                onChange={(e) => setCertClass(e.target.value)}
                placeholder={isAr ? "مثال: الصف الأول أ" : "e.g., Grade 1A"}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-300 block">
                {isAr ? "التصنيف والمسار الإبداعي:" : "Award Category & Track:"}
              </label>
              <select
                value={certType}
                onChange={(e) => setCertType(e.target.value as any)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-white cursor-pointer"
              >
                <option value="academic">{isAr ? "التفوق العلمي والدراسي" : "Scientific & Academic Excellence"}</option>
                <option value="sports">{isAr ? "البطولة الرياضية وكأس كابستون كروي" : "Sports Championship & Soccer Cup"}</option>
                <option value="quran">{isAr ? "حفظ وتلاوة القرآن الكريم" : "Qur'an Recitation & Ethics"}</option>
                <option value="behavior">{isAr ? "السلوك المثالي والانضباط الصباحي" : "Ideal Conduct & Discipline"}</option>
              </select>
            </div>

            {/* Action Triggers */}
            <div className="pt-3 flex flex-col sm:flex-row gap-2">
              <button
                onClick={triggerMockDownload}
                disabled={isDownloading || !certName}
                className="flex-1 bg-[#c5a85c] hover:bg-[#b5984c] text-slate-950 py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isDownloading ? (
                  <span className="h-3 w-3 rounded-full border-2 border-slate-950 border-t-transparent animate-spin"></span>
                ) : (
                  <Download className="h-4 w-4" />
                )}
                <span>{isAr ? "تحميل الشهادة الرقمية" : "Download Certificate"}</span>
              </button>

              <button
                onClick={handlePrint}
                className="bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-850 py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer px-4"
              >
                <Printer className="h-4 w-4 text-cyan-405" />
                <span>{isAr ? "طباعة" : "Print"}</span>
              </button>
            </div>

            {downloadSuccess && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 p-2 rounded-lg text-emerald-400 text-center text-[10.5px] font-bold animate-pulse">
                {isAr ? "🎉 تم توليد الشهادة وتنزيل ملف التميز بنجاح لمشاركتها بالفخر!" : "🎉 Certificate generated and downloaded successfully as a file for proud sharing!"}
              </div>
            )}

          </div>
        </div>

        {/* Certificate Display Screen */}
        <div className="lg:col-span-3 rounded-2xl border-4 border-double border-[#c5a85c]/40 bg-slate-950/90 p-6 shadow-2xl relative text-center flex flex-col justify-between aspect-[1.414/1] overflow-hidden select-none">
          
          {/* Certificate golden corners */}
          <div className="absolute top-1.5 right-1.5 h-12 w-12 border-t-2 border-r-2 border-[#c5a85c]"></div>
          <div className="absolute top-1.5 left-1.5 h-12 w-12 border-t-2 border-l-2 border-[#c5a85c]"></div>
          <div className="absolute bottom-1.5 right-1.5 h-12 w-12 border-b-2 border-r-2 border-[#c5a85c]"></div>
          <div className="absolute bottom-1.5 left-1.5 h-12 w-12 border-b-2 border-l-2 border-[#c5a85c]"></div>

          {/* Certificate header */}
          <div className="space-y-1 pt-4">
            <span className="text-[8.5px] tracking-widest text-[#c5a85c] font-black uppercase">
              {isAr ? "جمهورية مصر العربية • مجمع لغات الصالحين التعليمي" : "Arab Republic of Egypt • El-Salheen Edu Complex"}
            </span>
            <div className="h-px w-20 bg-[#c5a85c]/35 mx-auto"></div>
            <h4 className="font-display text-sm font-black text-slate-100 tracking-wide">
              {isAr ? "🏆 شهادة شرف وتقدير متميزة 🏆" : "🏆 Certificate of Honor & Distinction 🏆"}
            </h4>
          </div>

          {/* Body speech */}
          <div className="space-y-3 py-4">
            <p className="text-[10px] text-slate-400 font-bold leading-relaxed">
              {isAr 
                ? "بكل دواعي الاعتراز والاستبشار الصادق، يسر إدارة مجمع لغات الصالحين التعليمي بالتعاون مع مجلس آباء ومعلمي المجمع أن تشهد وتكرم:"
                : "With pure pride and sincere delight, El-Salheen Educational Administration, alongside the Parents & Teachers Council, honors and presents this to:"}
            </p>

            <div className="space-y-1">
              <span className="text-sm font-black text-[#c5a85c] decoration-wavy underline decoration-[#c5a85c]/40 py-1 inline-block">
                {isAr ? "الطالب المكرم: " : "Honored Student: "}{certName || (isAr ? "جاري التحديد..." : "Selecting...")}
              </span>
              <span className="text-[9.5px] text-slate-350 block font-bold">
                {isAr ? "المقيد بالصف: " : "Enrolled in Class: "}{certClass || "1A"}
              </span>
            </div>

            <p className="text-[10px] text-slate-350 font-medium leading-relaxed leading-3 max-w-md mx-auto">
              {isAr ? (
                <>وذلك لفوزه برتبة الفخر والتميز الفوري في مسار الصدارة بـ <span className="text-[#c5a85c] font-black">{getCertTitle(certType)}</span> لمساهمته الفعالة وأخلاقه الرياضية الرائعة التي يحتذى بها. متمنين له دوام الترقي والعلو.</>
              ) : (
                <>In recognition of achieving the highest ranks of pride & instant distinction in the track of: <span className="text-[#c5a85c] font-black">{getCertTitle(certType)}</span> for their brilliant contributions and exemplary sportsmanlike conduct. Wishing them perpetual progress and high ranks.</>
              )}
            </p>
          </div>

          {/* Footer Seals */}
          <div className="flex justify-between items-end border-t border-slate-900/40 pt-3 text-[8.5px] font-bold text-slate-405 px-4">
            <div className={`space-y-0.5 ${isAr ? "text-right" : "text-left"}`}>
              <span>{isAr ? "تاريخ الإقرار: 2026/06/22" : "Date: 2026/06/22"}</span>
              <span className="block font-mono text-[7px] text-slate-550">ID: CERT-SALHEEN-2026</span>
            </div>

            {/* School Seal */}
            <div className="relative h-11 w-11 rounded-full border border-dashed border-[#c5a85c]/50 flex items-center justify-center bg-[#c5a85c]/10 text-[#c5a85c]">
              <Sparkles className="h-4 w-4 animate-spin-slow" />
              <div className="absolute text-[6px] font-black tracking-widest leading-none rotate-12 opacity-80 select-none">
                {isAr ? "معتمد" : "Official"}
              </div>
            </div>

            <div className={`space-y-0.5 ${isAr ? "text-left" : "text-right"}`}>
              <span>{isAr ? "قائد المدرسة بمجمع الصالحين" : "School Principal"}</span>
              <span className="block text-[#c5a85c] font-black">{isAr ? "أ. محمود الكردي" : "Mr. Mahmoud El-Kordy"}</span>
            </div>
          </div>

        </div>

      </section>

    </div>
  );
}
