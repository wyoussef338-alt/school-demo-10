import { motion } from "motion/react";
import { Compass, Book, Award, Layout, Smartphone, Calendar, MapPin } from "lucide-react";
import VirtualTour3D from "./VirtualTour3D";
import { Language } from "../utils/translations";

interface CampusPageProps {
  lang?: Language;
}

export default function CampusPage({ lang = "ar" }: CampusPageProps) {
  const isAr = lang === "ar";

  const cards = [
    {
      title: isAr ? "الفصول الدراسية الذكية" : "Smart Classrooms",
      arabicTitle: isAr ? "الفصول الذكية" : "Smart Rooms",
      desc: isAr 
        ? "فصول دراسية واسعة مزودة بأحدث السبورات والشاشات التفاعلية لبيئة تعليمية مريحة ومتصلة بالشبكة المحلية بالكامل."
        : "Spacious classrooms equipped with the latest smart whiteboards and interactive displays for a highly connected and comfortable learning environment.",
      img: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?q=80&w=600&auto=format&fit=crop",
    },
    {
      title: isAr ? "معامل العلوم المتكاملة" : "Integrated Science Labs",
      arabicTitle: isAr ? "معامل العلوم" : "Science Labs",
      desc: isAr 
        ? "معامل حديثة مجهزة بكافة المواد والأدوات الفيزيائية والكيميائية لتأهيل الطلاب على إجراء التجارب العلمية بدقة وأمان."
        : "Modern laboratories fully equipped with physical and chemical tooling to train students on conducting scientific experiments safely and precisely.",
      img: "https://images.unsplash.com/photo-1532187863486-abf9d39d66e8?q=80&w=600&auto=format&fit=crop",
    },
    {
      title: isAr ? "معمل الكمبيوتر والبرمجيات" : "Computer & Robotics Lab",
      arabicTitle: isAr ? "نادي البرمجة" : "Robotics Hub",
      desc: isAr 
        ? "أجهزة متطورة لممارسة محاكاة البرمجة وروبوتات العلوم، بالإضافة لتنمية المهارات التقنية بمساعدة أخصائي الحاسوب."
        : "Advanced computing units to practice software programming, simulation, and robotics under supervision of expert computer science specialists.",
      img: "https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=600&auto=format&fit=crop",
    },
    {
      title: isAr ? "المكتبة الثقافية الشاملة" : "Comprehensive Library",
      arabicTitle: isAr ? "خير جليس" : "Learning Hub",
      desc: isAr 
        ? "ألف كتاب ومرجع في كافة التخصصات والعلوم، فضلًا عن ركن مخصص للقراءة الهادئة وجلسات المناظرات الأدبية الممتعة."
        : "Over a thousand books and resources in all sciences and fields, plus quiet reading zones and literary debate clubs.",
      img: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=600&auto=format&fit=crop",
    },
    {
      title: isAr ? "الساحة والملاعب الرياضية" : "Sports Pitch & Yards",
      arabicTitle: isAr ? "نشاط رياضي" : "Active Play",
      desc: isAr 
        ? "تضم ساحات للمشي والركض وملعباً كروياً مميزاً عالي الخضرة يستضيف مباريات دوري الصالحين والأنشطة الرياضية."
        : "Spacious running yards and green-grass soccer pitches hosting Salheen leagues and physical development activities.",
      img: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=600&auto=format&fit=crop",
    },
    {
      title: isAr ? "قاعات العروض والمناقشات" : "Conference & Presentation Halls",
      arabicTitle: isAr ? "منصة التتويج" : "Exhibitions",
      desc: isAr 
        ? "قاعات مكيفة ومجهزة بنظام صوتي متقدّم لاستيعاب المؤتمرات، الحفلات، وعروض مشاريع الطلاب وتكريم الفصول المتفوقة."
        : "Air-conditioned halls equipped with advanced audio-visual systems for conferences, graduation parties, and honoring top outstanding classes.",
      img: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=600&auto=format&fit=crop",
    }
  ];

  return (
    <div className={`space-y-10 animate-fade-in ${isAr ? "text-right" : "text-left"}`}>
      <div className="space-y-2">
        <span className="inline-flex rounded-full bg-cyan-500/10 px-3 py-1 text-[10px] font-black text-cyan-400 capitalize tracking-widest animate-pulse">
          {isAr ? "مباني وساحات المدرسة" : "School Facilities & Campus"}
        </span>
        <h2 className="font-display text-2xl font-black text-white">
          {isAr ? "الجولة الافتراضية والبيئة التعليمية" : "Interactive Virtual Tour & Campus"}
        </h2>
        <p className="text-slate-400 text-xs font-semibold">
          {isAr 
            ? "نؤمن بأن البيئة التفاعلية الملائمة والمحفزة هي الركيزة الأولى لتبلور الأفكار الإبداعية لدى الطلاب"
            : "We believe that an inspiring, interactive campus is the key bedrock for nurturing creative ideas and student excellence."
          }
        </p>
      </div>

      {/* 3D Virtual tour component */}
      <VirtualTour3D lang={lang} />

      <div className="space-y-4 pt-4 border-t border-slate-900">
        <h4 className={`font-display text-sm font-black text-[#c5a85c] flex items-center gap-2 ${
          isAr ? "border-r-4 border-[#c5a85c] pr-3 justify-start" : "border-l-4 border-[#c5a85c] pl-3 justify-start"
        }`}>
          {isAr ? "معرض المرافق والساحات النموذجية بالمجمع:" : "Showcase of School's Exemplary Facilities:"}
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              className="rounded-2xl border border-slate-900 bg-slate-950/40 overflow-hidden flex flex-col justify-between group hover:border-cyan-500/20 transition-all shadow-xl"
            >
              <div className="relative h-44 overflow-hidden">
                <img
                  src={card.img}
                  alt={card.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent"></div>
                <div className={`absolute bottom-3 ${isAr ? "right-4" : "left-4"}`}>
                  <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest block">{card.arabicTitle}</span>
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <h3 className="font-display text-sm font-black text-white">{card.title}</h3>
                  <p className="text-[11px] text-slate-400 leading-relaxed font-semibold">{card.desc}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-900/60 flex items-center justify-between text-[10px] text-slate-400 font-bold">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-cyan-400" />
                    {isAr ? "المقر الرئيسي بالمدرسة" : "Main School Campus"}
                  </span>
                  <span className="text-cyan-400">{isAr ? "متاح لكافة الطلاب" : "Available to all students"}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
