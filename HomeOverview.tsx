import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Award, BookOpen, Compass, Trophy, Star, ChevronLeft, Calendar, Flame, Sparkles, User, GraduationCap, Shield, Heart, ArrowUpRight } from "lucide-react";

import { Language } from "../utils/translations";

interface HomeOverviewProps {
  user: any;
  setActiveTab: (tab: string, subTab?: string) => void;
  onJoinClub: (club: string) => void;
  joinedClubs: string[];
  lang?: Language;
}

export default function HomeOverview({ user, setActiveTab, onJoinClub, joinedClubs, lang = "ar" }: HomeOverviewProps) {
  const isAr = lang === "ar";
  const currentPoints = user?.points || 180;
  const currentStreak = user?.streak || 4;

  const slides = [
    {
      image: "https://images.unsplash.com/photo-1519452575417-564c1401ecc0?q=80&w=1600&auto=format&fit=crop",
      title: "Welcome In STEM El-Salheen",
      phrase: "New community | New goals | New life",
    },
    {
      image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=1600&auto=format&fit=crop",
      title: "Inspire Students To Innovate",
      phrase: "A place where you can bring your ideas to life",
    },
    {
      image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1600&auto=format&fit=crop",
      title: "Dynamic School Leagues",
      phrase: "Integrating academic excellence with healthy active competition",
    }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  // Automatic slideshow rotation
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={`flex flex-col w-full bg-[#030712] ${isAr ? "text-right" : "text-left"}`} dir={isAr ? "rtl" : "ltr"}>
      {/* 1. Hero Slideshow Carousel mimicking the STEM Egypt photo */}
      <section className="relative w-full h-[85vh] min-h-[550px] overflow-hidden flex items-center justify-center bg-slate-950">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.0 }}
            className="absolute inset-0 w-full h-full"
          >
            {/* Slide Image Layer */}
            <img
              src={slides[currentSlide].image}
              alt={slides[currentSlide].title}
              className="w-full h-full object-cover select-none brightness-[0.7] contrast-[1.05]"
              referrerPolicy="no-referrer"
            />
            {/* Cinematic Gradient Dark Overlays matching stemegypt.net */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#03060f]/60 via-[#03060f]/30 to-[#030712]"></div>
            <div className="absolute inset-0 bg-[#02050c]/50"></div>
          </motion.div>
        </AnimatePresence>

        {/* Floating Centered Custom Typography over background */}
        <div className="relative z-10 text-center px-4 sm:px-6 max-w-5xl select-none flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-1.5 mb-5"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping"></span>
            <span className="text-[10px] md:text-xs font-black tracking-[0.2em] text-cyan-400 uppercase">
              EL-SALHEEN OFFICIAL PORTAL
            </span>
          </motion.div>

          {/* Golden English / Arabic display headings */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-sans font-black text-white leading-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.85)] tracking-tight"
          >
            {slides[currentSlide].title}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 flex flex-wrap justify-center gap-2 items-center"
          >
            {slides[currentSlide].phrase.split("|").map((phrasePart, wordIdx) => (
              <span
                key={wordIdx}
                className="inline-flex rounded-full bg-slate-950/75 border border-slate-900/80 px-4 py-1.5 text-[11px] md:text-xs font-bold text-slate-100 shadow-xl"
              >
                {phrasePart.trim()}
              </span>
            ))}
          </motion.div>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <button
              onClick={() => setActiveTab("academics", "challenges")}
              className="flex items-center gap-2 rounded-xl bg-[#c5a85c] hover:bg-[#b0934c] px-6 py-4 font-display text-xs font-black text-slate-950 transition-all hover:scale-105 cursor-pointer shadow-lg"
            >
              <GraduationCap className="h-4.5 w-4.5" />
              <span>{isAr ? "منصة التحديات الدراسية" : "Academic Challenges"}</span>
            </button>
            <button
              onClick={() => setActiveTab("academics", "ai-tutor")}
              className="flex items-center gap-2 rounded-xl bg-[#040813]/85 border border-[#c5a85c]/30 px-6 py-4 font-display text-xs font-black text-white hover:text-cyan-400 transition-all hover:bg-slate-950 cursor-pointer shadow-lg"
            >
              <Sparkles className="h-4.5 w-4.5 text-cyan-400 animate-pulse" />
              <span>{isAr ? "المساعد الذكي (SkooLy AI)" : "SkooLy AI Assistant"}</span>
            </button>
          </div>
        </div>

        {/* 3 Indicators bottom lines matching stemegypt.net precisely */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-4">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className="relative py-2 focus:outline-none cursor-pointer"
            >
              <div
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  currentSlide === idx ? "bg-[#c5a85c] w-14 shadow-[0_0_10px_#c5a85c]" : "bg-white/30 w-8"
                }`}
              />
            </button>
          ))}
        </div>
      </section>

      {/* 2. RANKED AS EGYPT'S BEST HIGH SCHOOL block (from video) */}
      <section className="border-y border-slate-900 bg-[#060a16] py-20">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-6">
          <h2 className="font-sans text-xs md:text-sm font-black tracking-[0.25em] text-[#c5a85c] uppercase leading-relaxed">
            RANKED AS EGYPT&apos;S FINER LANGUAGE SCHOOL, EL-SALHEEN SCHOOL FOR BOYS - 6th OF OCTOBER
          </h2>
          <div className="h-0.5 w-16 bg-[#c5a85c] mx-auto rounded-full"></div>
          <p className="font-serif text-sm md:text-lg text-slate-300 leading-relaxed font-light tracking-wide italic max-w-3xl mx-auto">
            Offering a unique platform that integrates punctual ministries curriculum with smart technological, mathematical, and extracurricular fields, El-Salheen targets potential students who demonstrate high-level academic skills and sportive discipline.
          </p>
          <div className="pt-4">
            <button
              onClick={() => setActiveTab("about", "overview")}
              className="inline-flex items-center gap-1.5 text-xs font-black text-[#c5a85c] border border-[#c5a85c]/40 hover:border-[#c5a85c] px-6 py-3 rounded-xl transition-all hover:scale-103 cursor-pointer"
            >
              <span>Overview</span>
              <ChevronLeft className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 3. ACADEMICS Block (from video) */}
      <section className="bg-[#030712] py-20 border-b border-slate-900">
        <div className={`max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${isAr ? "text-right" : "text-left"}`}>
          {/* Books image */}
          <div className="rounded-2xl border border-slate-900 bg-slate-950 overflow-hidden shadow-2xl h-[400px]">
            <img
              src="https://images.unsplash.com/photo-1513001900722-370f803f498d?q=80&w=720&auto=format&fit=crop"
              alt="Academics"
              className="w-full h-full object-cover opacity-80"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="space-y-6">
            <span className="text-[10px] font-black tracking-widest text-[#c5a85c] uppercase block">EXCELLENCE IN LEARNING</span>
            <h2 className="font-sans text-2xl lg:text-4xl font-extrabold text-white tracking-tight uppercase">
              ACADEMICS
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed max-w-xl">
              Classes in El-Salheen merge the punctual academic curricula with interesting collaborative environment, aiming to improve students&apos; social, athletic, and presentation qualities through interactive weekly challenges.
            </p>
            <div className="pt-2">
              <button
                onClick={() => setActiveTab("academics", "overview")}
                className="inline-flex items-center gap-1 px-5 py-3 rounded-xl bg-slate-900 border border-slate-800 text-xs font-black text-white hover:border-[#c5a85c]/45 transition-all cursor-pointer"
              >
                <span>Know More!</span>
                <ChevronLeft className="h-4 w-4 text-cyan-400" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. ADMISSIONS BLOCK (from video) */}
      <section className="relative py-24 overflow-hidden bg-slate-950 text-center">
        <div className="absolute inset-0 opacity-10 bg-cover bg-center mix-blend-overlay pointer-events-none" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=1200')" }}></div>
        <div className="relative z-10 max-w-4xl mx-auto px-6 space-y-6">
          <span className="text-[10px] font-black tracking-widest text-cyan-400 uppercase block">JOIN THE COMMUNITY</span>
          <h2 className="font-sans text-2xl lg:text-4xl font-black text-white tracking-widest uppercase">
            ADMISSIONS &amp; TARGETED STUDENTS
          </h2>
          <p className="text-slate-300 text-xs md:text-sm leading-relaxed max-w-3xl mx-auto">
            Accepting only about 150 out of thousands of applicants annually, El-Salheen is highly competitive. The school targets prospective students with demonstrated passion and aptitude for Languages, Science, Technology, Engineering, and Active sportsmanship.
          </p>
          <div className="pt-4">
            <button
              onClick={() => setActiveTab("contact")}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-402 px-6 py-3.5 text-xs font-black text-slate-950 transition-all hover:scale-105 cursor-pointer shadow-lg"
            >
              <span>Admission Eligibility Criteria</span>
              <ChevronLeft className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 5. ALUMNI BLOCK (from video) */}
      <section className="bg-[#030712] py-20 border-t border-slate-900">
        <div className={`max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${isAr ? "text-right" : "text-left"}`}>
          <div className="space-y-6 order-2 lg:order-1">
            <span className="text-[10px] font-black tracking-widest text-[#c5a85c] uppercase block">OUR LEGACY &amp; PRIDE</span>
            <h2 className="font-sans text-2xl lg:text-4xl font-extrabold text-white tracking-tight uppercase">
              ALUMNI
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed max-w-xl">
              Our graduates got accepted into many different prestigious universities inside and outside Egypt, bringing change and innovation to national and worldwide tech institutions.
            </p>
            <div className="pt-2">
              <button
                onClick={() => setActiveTab("alumni", "alumni-grid")}
                className="inline-flex items-center gap-1 px-5 py-3 rounded-xl bg-slate-900 border border-slate-800 text-xs font-black text-white hover:border-[#c5a85c]/45 transition-all cursor-pointer"
              >
                <span>See More!</span>
                <ChevronLeft className="h-4 w-4 text-cyan-400" />
              </button>
            </div>
          </div>

          {/* Alumni image */}
          <div className="rounded-2xl border border-slate-900 bg-slate-950 overflow-hidden shadow-2xl h-[400px] order-1 lg:order-2">
            <img
              src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=720&auto=format&fit=crop"
              alt="Alumni graduates"
              className="w-full h-full object-cover opacity-85"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </section>

      {/* 6. Active Interactive Student Portal (Bento stats launcher) */}
      <section className="bg-slate-950 py-16 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 space-y-8">
          <div className="border-b border-slate-900 pb-4">
            <span className="text-[10px] font-black text-cyan-400 block tracking-widest">
              {isAr ? "المحطة الأكاديمية التفاعلية" : "Interactive Academic Base"}
            </span>
            <h3 className="font-display text-xl font-bold text-white mt-1">
              {isAr ? "بوابتك الرقمية ومؤشرات تقدمك العلمي" : "Digital Portal & Scientific Progress"}
            </h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-stretch">
            {/* Class info & level card */}
            <div className={`rounded-2xl border border-slate-900 bg-[#060a16] p-6 lg:col-span-1 flex flex-col justify-between ${
              isAr ? "text-right" : "text-left"
            }`}>
              <div className="space-y-4 text-center">
                <div className="mx-auto h-16 w-16 rounded-full bg-slate-950 border border-slate-900 flex items-center justify-center text-cyan-405">
                  <User className="h-6 w-6 animate-pulse" />
                </div>
                <div>
                  <h4 className="font-display text-sm font-black text-white">{user?.name || (isAr ? "يوسف" : "Youssef")}</h4>
                  <span className="text-[10px] text-cyan-400 font-bold block mt-1">
                    {isAr ? "طالب مسجل بالصالحين" : "Registered Salheen Student"}
                  </span>
                </div>
              </div>

              <div className="space-y-2 mt-6 pt-6 border-t border-slate-900/60 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400 font-bold">
                    {isAr ? "نقاطك الكلية" : "Total Points"}
                  </span>
                  <span className="text-[#c5a85c] font-black">{currentPoints} {isAr ? "نقطة" : "Pts"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-405 font-bold">
                    {isAr ? "رتبتك الأكاديمية" : "Academic Rank"}
                  </span>
                  <span className="text-cyan-455 font-black">
                    {isAr ? "طالب متألق" : "Brilliant Scholar"}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick stats panel */}
            <div className={`rounded-2xl border border-slate-900 bg-[#060a16] p-6 lg:col-span-1 flex flex-col justify-between ${
              isAr ? "text-right" : "text-left"
            }`}>
              <div>
                <span className="text-[10px] font-black text-slate-500 uppercase">
                  {isAr ? "الالتزام اليومي للرابطة" : "Daily Streak Log"}
                </span>
                <h4 className="mt-2 font-display text-sm font-bold text-white">
                  {isAr ? "نشاطك المستمر (سلسلة حضورك)" : "Daily Continuous Action"}
                </h4>
                <p className="mt-2 text-[11px] text-slate-400 leading-normal font-semibold">
                  {isAr 
                    ? "الأيام المتتالية التي تتابع فيها مسارك لربح رتب الصالحين المرموقة."
                    : "Consecutive days tracking your learning paths to reach the rank of honor."
                  }
                </p>
              </div>
              <div className={`mt-6 flex items-baseline gap-1.5 ${isAr ? "justify-start" : "justify-start"}`}>
                <span className="text-3xl font-display font-black text-amber-400">{currentStreak}</span>
                <span className="text-xs text-slate-400 font-bold">
                  {isAr ? "أيام متصلة" : "Consecutive Days"}
                </span>
              </div>
            </div>

            {/* Quick launcher */}
            <div className={`rounded-2xl border border-slate-900 bg-[#060a16] p-6 lg:col-span-2 flex flex-col justify-between ${
              isAr ? "text-right" : "text-left"
            }`}>
              <div>
                <span className="text-[10px] font-black text-cyan-400 uppercase">
                  {isAr ? "التحول السريع للبوابات" : "Quick Navigation Deck"}
                </span>
                <h4 className="font-display text-sm font-bold text-white mt-1">
                  {isAr ? "المنصات التفاعلية بمدرسة الصالحين" : "Interactive Systems of El-Salheen"}
                </h4>
                <p className="mt-2 text-[11px] text-slate-400 leading-normal font-semibold">
                  {isAr
                    ? "شارك في الامتحانات، ابدأ مسابقة الدوري، أو تصفح بنك المشاريع وحاور المدرب الذكي."
                    : "Attempt scientific challenges, score inside the soccer league, or discuss with your smart virtual mentor."
                  }
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-6">
                <button
                  onClick={() => setActiveTab("academics", "challenges")}
                  className="rounded-xl bg-slate-950 border border-slate-900 hover:border-cyan-500/20 px-3.5 py-3 text-xs font-bold text-slate-200 hover:text-white transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Award className="h-4 w-4 text-cyan-400" />
                  <span>{isAr ? "الامتحانات" : "Exams & Challenges"}</span>
                </button>
                <button
                  onClick={() => setActiveTab("extracurriculars", "league")}
                  className="rounded-xl bg-slate-950 border border-slate-900 hover:border-cyan-500/20 px-3.5 py-3 text-xs font-bold text-slate-200 hover:text-white transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Trophy className="h-4 w-4 text-cyan-400" />
                  <span>{isAr ? "الدوري المدرسي" : "Soccer League"}</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
