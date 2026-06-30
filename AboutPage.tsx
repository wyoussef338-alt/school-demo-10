import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { School, Users, Eye, History, Award, BookOpen, MapPin } from "lucide-react";
import CampusPage from "./CampusPage";
import { Language } from "../utils/translations";

interface AboutPageProps {
  subTab?: string;
  lang?: Language;
}

export default function AboutPage({ subTab = "overview", lang = "ar" }: AboutPageProps) {
  const [currentSection, setCurrentSection] = useState(subTab);
  const isAr = lang === "ar";

  useEffect(() => {
    setCurrentSection(subTab);
  }, [subTab]);

  const sections = [
    { id: "overview", label: isAr ? "نظرة عامة" : "Overview", icon: School },
    { id: "campus", label: isAr ? "مباني وباحات المدرسة" : "School Campus", icon: MapPin },
    { id: "history", label: isAr ? "تاريخ المدرسة" : "School History", icon: History },
    { id: "staff", label: isAr ? "أعضاء هيئة التدريس" : "Faculty & Staff", icon: Users },
    { id: "vision", label: isAr ? "الرؤية والرسالة" : "Vision & Mission", icon: Eye },
  ];

  return (
    <div className={`space-y-8 animate-fade-in ${isAr ? "text-right" : "text-left"}`} dir={isAr ? "rtl" : "ltr"}>
      {/* Sub-navigation bar representing the dropdown sections */}
      <div className={`flex flex-wrap gap-2.5 border-b border-slate-900 pb-4 ${isAr ? "justify-start" : "justify-start"}`}>
        {sections.map((sec) => {
          const Icon = sec.icon;
          const isActive = currentSection === sec.id;
          return (
            <button
              key={sec.id}
              onClick={() => setCurrentSection(sec.id)}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                isActive
                  ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.1)]"
                  : "bg-slate-950/60 border-slate-900 text-slate-450 hover:text-white"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{sec.label}</span>
            </button>
          );
        })}
      </div>

      {currentSection === "campus" && (
        <CampusPage lang={lang} />
      )}

      {currentSection === "overview" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center"
        >
          <div className="space-y-5">
            <span className="inline-flex rounded-full bg-cyan-500/10 px-3.5 py-1 text-[10px] font-black text-cyan-400 uppercase tracking-wider">
              {isAr ? "صرح الصالحين العلمي" : "El-Salheen Academic Institution"}
            </span>
            <h2 className="font-display text-2xl lg:text-3xl font-black text-white leading-tight">
              {isAr ? "مدرسة الصالحين الرسمية للغات" : "El-Salheen Governmental Language School"}
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              {isAr 
                ? "تأسس مدرسة الصالحين للغات كإحدى القلاع التعليمية البارزة لتقديم تعليم متميز يتبع أحدث النظريات والوسائل التكنولوجية الحديثة. نركز في مدرستنا على دمج التفوق الأكاديمي ببناء السلوك القويم واكتشاف المهارات والمواهب الفردية لكل طالب."
                : "El-Salheen Language School was established as a prominent educational fortress to deliver distinguished education using modern theories and tools. In our school, we focus on combining academic excellence with good behavior and discovering the individual skills and talents of each student."
              }
            </p>
            <p className="text-slate-450 text-xs leading-relaxed">
              {isAr
                ? "برعاية وزارة التربية والتعليم والتعليم الفني، تتبنى المدرسة نموذجاً فريداً يثري تجربة التعلم لخدمة المجتمع وبناء جيل قادر على الإبداع والابتكار ومواجهة تحديات المستقبل كقادة ورواد حقيقيين."
                : "Under the auspices of the Egyptian Ministry of Education and Technical Education, our school adopts a unique model that enriches the learning experience to serve the community and build a generation capable of creativity, innovation, and facing future challenges as true leaders."
              }
            </p>
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="rounded-xl border border-slate-900 bg-slate-950/40 p-4">
                <h4 className="text-sm font-bold text-cyan-400 font-display">
                  {isAr ? "منذ عام 2011" : "Since 2011"}
                </h4>
                <p className="text-[10px] text-slate-400 mt-1">
                  {isAr ? "مسيرة ممتدة من العطاء والتميز الأكاديمي المستمر" : "A long, continuous journey of dedication and academic excellence"}
                </p>
              </div>
              <div className="rounded-xl border border-slate-900 bg-slate-950/40 p-4">
                <h4 className="text-sm font-bold text-amber-400 font-display">
                  {isAr ? "رسمية لغات" : "Official Languages"}
                </h4>
                <p className="text-[10px] text-slate-400 mt-1">
                  {isAr ? "تدريس مناهج متطورة تواكب المعايير العالمية" : "Teaching advanced curricula in alignment with global benchmarks"}
                </p>
              </div>
            </div>
          </div>
          <div className="relative rounded-2xl border border-slate-900 bg-slate-950 overflow-hidden shadow-2xl h-[350px]">
            <img
              src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=800&auto=format&fit=crop"
              alt="Campus Life"
              className="w-full h-full object-cover opacity-80"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
          </div>
        </motion.div>
      )}

      {currentSection === "history" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8 max-w-4xl"
        >
          <div className="space-y-2">
            <h2 className="font-display text-2xl font-black text-white">
              {isAr ? "تاريخ المدرسة وجذور التميز" : "School History & Roots of Excellence"}
            </h2>
            <p className="text-slate-400 text-xs">
              {isAr 
                ? "تعرّف على أبرز المحطات والنجاحات والجوائز التي حصدتها مدرستنا على مدار الأعوام الماضية"
                : "Learn about the key milestones, achievements, and awards our school has received over the past years"
              }
            </p>
          </div>

          <div className={`relative border-slate-900 space-y-8 pb-4 ${isAr ? "border-r-2 pr-6 mr-3" : "border-l-2 pl-6 ml-3"}`}>
            {[
              { 
                year: "2011", 
                title: isAr ? "تأسيس الصرح الأكاديمي" : "Foundation of the Academic Tower", 
                desc: isAr 
                  ? "تم وضع حجر الأساس للمدرسة وفق أعلى المعايير بهدف توفير بيئة علمية متميزة لخدمة المنطقة." 
                  : "The foundation stone of the school was laid in accordance with high standards to provide an outstanding scientific environment."
              },
              { 
                year: "2016", 
                title: isAr ? "الحصول على الجودة الأكاديمية" : "Achieving Academic Quality Badge", 
                desc: isAr 
                  ? "توجت المدرسة باعتبارها من المدارس الرسمية المتميزة لغات وحصولها على درع الهيئة القومية للجودة." 
                  : "The school was crowned as an outstanding official language school and received the shield of the National Quality Authority."
              },
              { 
                year: "2020", 
                title: isAr ? "التحول الرقمي التعليمي" : "Educational Digital Transformation", 
                desc: isAr 
                  ? "إنشاء أول بنية تكنولوجية متكاملة لدمج منصات التعلم عن بعد وتطبيقات المساعد الذكي في الفصول." 
                  : "Establishing the first integrated technological infrastructure to combine e-learning platforms and AI smart assistant apps."
              },
              { 
                year: "2026", 
                title: isAr ? "بوابة الصالحين الذكية الرائدة" : "Salheen Smart Portal & Innovation", 
                desc: isAr 
                  ? "إطلاق بوابتنا الذكية التفاعلية ومسابقة الدوري الرياضي لتصبح المدرسة نموذجاً رائداً في دمج الرياضة بالتعليم والذكاء الاصطناعي." 
                  : "Launching our interactive smart portal and sports league to make our school a leading model in combining sports, education, and AI."
              }
            ].map((step, idx) => (
              <div key={idx} className="relative">
                {/* Dot position depends on orientation */}
                <span className={`absolute top-1.5 h-4 w-4 rounded-full border-2 border-cyan-400 bg-slate-950 shadow-[0_0_8px_rgba(34,211,238,0.5)] ${
                  isAr ? "-right-[31px]" : "-left-[31px]"
                }`}></span>
                <div className="rounded-xl border border-slate-900 bg-slate-950/40 p-5 space-y-1 hover:border-slate-800 transition-colors">
                  <span className="text-xs font-black text-cyan-400 font-mono">{step.year}</span>
                  <h3 className="font-display text-sm font-extrabold text-white">{step.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {currentSection === "staff" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="space-y-2">
            <h2 className="font-display text-2xl font-black text-white">
              {isAr ? "أعضاء هيئة التدريس الفضلاء" : "Our Distinguished Faculty Members"}
            </h2>
            <p className="text-slate-400 text-xs">
              {isAr 
                ? "قادة ورواد المسيرة التعليمية الذين يضعون نصب أعينهم مصلحة وتفوق الطلاب واستكشاف ذكائهم"
                : "The leaders of our educational journey who prioritize student excellence and cognitive growth"
              }
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { 
                role: isAr ? "أ.د. محمد رشدي" : "Prof. Mohamed Roshdy", 
                title: isAr ? "مدير عام المدرسة" : "School Director General", 
                spec: isAr 
                  ? "رئيس المجلس التوجيهي والمشرف على استراتيجية الجودة" 
                  : "Chairman of the Advisory Council and Supervisor of Quality Strategy" 
              },
              { 
                role: isAr ? "أ. غادة الشافعي" : "Ms. Ghada El-Shafei", 
                title: isAr ? "وكيل الشؤون التعليمية" : "Deputy for Academic Affairs", 
                spec: isAr 
                  ? "إدارة وتنسيق الجداول ومسارات التقييم الأكاديمي المستمر" 
                  : "Managing schedules and continuous academic assessment frameworks" 
              },
              { 
                role: isAr ? "مستر أحمد السيد" : "Mr. Ahmed El-Sayed", 
                title: isAr ? "معلم العلوم والفيزياء المتميز" : "Distinguished Physics Faculty", 
                spec: isAr 
                  ? "صاحب مبادرة المساعد الذكي ومطور الأنشطة التطبيقية والروبوت" 
                  : "Smart Assistant initiator and developer of applied robotics and activities" 
              },
              { 
                role: isAr ? "أ. هبة الله محمود" : "Mrs. Hebatallah Mahmoud", 
                title: isAr ? "أخصائي البرمجيات والكمبيوتر" : "Software & CS Specialist", 
                spec: isAr 
                  ? "توجيه نادي الترميز وحل المشكلات وصاحب فكرة تطبيق الفصول" 
                  : "Directing the coding club, problem solving, and co-creator of the classes app" 
              }
            ].map((teach, index) => (
              <div key={index} className="rounded-xl border border-slate-900 bg-slate-950/50 p-6 text-center space-y-3 hover:border-slate-800 transition-all">
                <div className="mx-auto h-16 w-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-cyan-400">
                  <Users className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-display text-sm font-bold text-white">{teach.role}</h3>
                  <span className="text-[10px] font-bold text-cyan-400 block mt-1">{teach.title}</span>
                  <p className="text-[10px] text-slate-400 mt-2 leading-relaxed">{teach.spec}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {currentSection === "vision" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div className="rounded-2xl border border-slate-900 bg-slate-950/55 p-8 space-y-4">
            <div className="h-10 w-10.5 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400">
              <Eye className="h-5 w-5" />
            </div>
            <h3 className="font-display text-lg font-black text-white">
              {isAr ? "رؤيـتنـا (Our Vision)" : "Our Vision"}
            </h3>
            <p className="text-slate-300 text-xs leading-relaxed">
              {isAr
                ? "نتطلع إلى أن نكون صرحاً علمياً وبوابة ذكية متميزة ومحفزة في مصر، تقدم نموذجاً فريداً يربط المناهج التعليمية بالتفوق الرقمي والتطبيقي للأخلاق، لتربية قيادات المستقبل المؤهلة عالمياً لتحقيق الريادة والإنجاز لمصر والوطن العربي بأكمله."
                : "We aspire to be a leading and motivating interactive portal and academic fortress in Egypt, offering a unique model that links school curricula with digital excellence and moral values, nurturing future leaders qualified to achieve local and regional heights."
              }
            </p>
          </div>

          <div className="rounded-2xl border border-slate-900 bg-slate-950/55 p-8 space-y-4">
            <div className="h-10 w-10.5 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400">
              <Award className="h-5 w-5" />
            </div>
            <h3 className="font-display text-lg font-black text-white">
              {isAr ? "رسـالتـنـا (Our Mission)" : "Our Mission"}
            </h3>
            <p className="text-slate-300 text-xs leading-relaxed">
              {isAr
                ? "إعداد جيل من المبتكرين والمتفوقين المزودين بالقيم الأخلاقية الرفيعة والقدرات الأكاديمية والتقنية العالية. نلتزم بخلق بيئة تفاعلية آمنة تدعم التعلم النشط وتنمي التفكير النقدي والإبداعي والتعاون الإيجابي مع جميع القنوات التربوية بالمدرسة."
                : "Preparing a generation of innovators and high-achievers equipped with fine ethical values, academic excellence, and technical capabilities. We are committed to creating a secure, interactive environment that supports active learning, critical thinking, and positive collaboration."
              }
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
