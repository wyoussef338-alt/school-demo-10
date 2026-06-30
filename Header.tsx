import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  LogOut, ShieldAlert, Award, Compass, School, Sparkles, Trophy, User, Menu, X, 
  ChevronDown, BookOpen, Clock, Heart, Mail, Users, Eye, History, MapPin 
} from "lucide-react";
import { auth } from "../firebase";
import { translations, Language } from "../utils/translations";

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string, subTab?: string) => void;
  user: any;
  onLogout: () => void;
  systemTime: string;
  lang?: Language;
}

export function SchoolCrest({ className = "h-11 w-11" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Outer Laurent Garland */}
      <path d="M15 48 C15 68, 30 83, 50 83 C70 83, 85 68, 85 48 C85 43, 83 38, 80 33" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="2 2"/>
      {/* Leaves Left */}
      <path d="M14 48 C11 38, 17 33, 21 28" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M17 56 C13 50, 19 46, 24 43" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M21 64 C17 58, 23 53, 29 50" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      {/* Leaves Right */}
      <path d="M86 48 C89 38, 83 33, 79 28" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M83 56 C87 50, 81 46, 76 43" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M79 64 C83 58, 77 53, 71 50" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      {/* Shield Frame */}
      <path d="M32 23 H68 C68 23, 72 43, 68 60 C64 72, 50 78, 50 78 C50 78, 36 72, 32 60 C28 43, 32 23, 32 23 Z" fill="currentColor" fillOpacity="0.06" stroke="currentColor" strokeWidth="3" strokeLinejoin="round"/>
      {/* Inner split grids */}
      <path d="M50 23 V78" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 2" opacity="0.6"/>
      <path d="M32 48 H68" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 2" opacity="0.6"/>
      {/* Science Atom Symbol (Education focus) */}
      <ellipse cx="41" cy="35" rx="5" ry="1.5" transform="rotate(30 41 35)" stroke="currentColor" strokeWidth="1"/>
      <ellipse cx="41" cy="35" rx="5" ry="1.5" transform="rotate(-30 41 35)" stroke="currentColor" strokeWidth="1"/>
      <circle cx="41" cy="35" r="1.5" fill="currentColor"/>
      {/* Global Book Symbol */}
      <path d="M56 32 C58 31, 62 31, 64 33 V41 C62 39, 58 39, 56 40 V32 Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" fill="currentColor" fillOpacity="0.2"/>
      <path d="M56 32 C54 31, 50 31, 48 33" stroke="currentColor" strokeWidth="1.2"/>
      {/* Math Pi Symbol */}
      <path d="M36 57 H44 M38 57 V64 M42 57 V64" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      {/* Athlete Trophy/Soccer Cup Symbol */}
      <path d="M56 56 H60 M58 56 V63 M56 63 H60 M55 58 H61 V61 C61 63, 55 63, 55 61 Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  );
}

export default function Header({ activeTab, setActiveTab, user, onLogout, systemTime, lang }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const currentLang = lang || "ar";
  const t = translations[currentLang];

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogoutClick = () => {
    if (auth) {
      auth.signOut()
        .then(() => {
          onLogout();
        })
        .catch((err) => {
          console.warn("⚠️ Firebase signout failed. Proceeding with local logout:", err);
          onLogout();
        });
    } else {
      onLogout();
    }
  };

  const navItems = [
    { id: "home", label: t.home },
    { 
      id: "about", 
      label: t.about, 
      subitems: [
        { id: "overview", label: t.about_overview, icon: School },
        { id: "campus", label: t.about_campus, icon: MapPin },
        { id: "history", label: t.about_history, icon: History },
        { id: "staff", label: t.about_staff, icon: Users },
        { id: "vision", label: t.about_vision, icon: Eye },
      ]
    },
    { 
      id: "academics", 
      label: t.academics, 
      subitems: [
        { id: "overview", label: t.academics_overview, icon: BookOpen },
        { id: "challenges", label: t.academics_challenges, icon: Award },
        { id: "ai-tutor", label: t.academics_aitutor, icon: Sparkles },
        { id: "library", label: t.academics_library, icon: BookOpen }
      ]
    },
    { 
      id: "extracurriculars", 
      label: t.extracurriculars, 
      subitems: [
        { id: "league", label: t.extra_league, icon: Trophy },
        { id: "clubs", label: t.extra_clubs, icon: Compass },
        { id: "events", label: t.extra_events, icon: Clock },
      ]
    },
    { 
      id: "alumni", 
      label: t.alumni, 
      subitems: [
        { id: "alumni-grid", label: t.alumni_grid, icon: Compass },
        { id: "honour", label: t.alumni_honour, icon: Award }
      ]
    },
    { id: "contact", label: t.contact },
  ];

  const handleItemClick = (item: any) => {
    if (item.subitems) {
      // Toggle dropdown for interactive devices
      setActiveDropdown(activeDropdown === item.id ? null : item.id);
    } else {
      setActiveTab(item.id);
      setActiveDropdown(null);
      setMobileMenuOpen(false);
    }
  };

  const handleSubitemClick = (parentId: string, subId: string) => {
    setActiveTab(parentId, subId);
    setActiveDropdown(null);
    setMobileMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? "bg-[#040814]/90 border-b border-cyan-500/10 shadow-2xl backdrop-blur-xl py-3"
          : "bg-gradient-to-b from-[#03060f]/80 to-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Left Section: Matching STEM EGYPT Logo layout */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="relative text-cyan-400 font-bold hover:text-cyan-300 transition-colors cursor-pointer" onClick={() => setActiveTab("home")}>
            <SchoolCrest className="h-10 w-10 md:h-12 md:w-12 drop-shadow-[0_0_10px_rgba(34,211,238,0.25)]" />
          </div>
          <div className="text-right cursor-pointer" onClick={() => setActiveTab("home")}>
            <h1 className="font-display text-[13px] md:text-lg font-black text-white tracking-tight leading-none">
              {t.appName}
            </h1>
            <p className="font-sans text-[7px] md:text-[9px] font-black tracking-widest text-cyan-400 uppercase leading-none mt-1">
              {t.appSubName}
            </p>
          </div>
        </div>

        {/* Center Section: Navigation tabs matching STEM EGYPT layout */}
        <nav className="hidden lg:flex items-center gap-5 xl:gap-7">
          {navItems.map((item) => {
            const isSelected = activeTab === item.id;
            return (
              <div 
                key={item.id} 
                className="relative group"
                onMouseEnter={() => item.subitems && setActiveDropdown(item.id)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button
                  onClick={() => handleItemClick(item)}
                  className={`flex items-center gap-1 py-2 text-xs font-bold transition-all duration-300 cursor-pointer ${
                    isSelected
                      ? "text-cyan-400 font-extrabold"
                      : "text-slate-300 hover:text-white"
                  }`}
                >
                  <span>{item.label}</span>
                  {item.subitems && <ChevronDown className="h-3 w-3 opacity-70" />}
                </button>

                {/* Dropdown Menu block */}
                {item.subitems && activeDropdown === item.id && (
                  <div className="absolute right-0 top-full w-56 rounded-xl border border-slate-900 bg-[#060a15]/95 shadow-2xl p-2 flex flex-col gap-1 backdrop-blur-xl animate-fade-in">
                    {item.subitems.map((sub) => {
                      const SubIcon = sub.icon;
                      return (
                        <button
                          key={sub.id}
                          onClick={() => handleSubitemClick(item.id, sub.id)}
                          className="w-full text-right flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-[11px] font-bold text-slate-300 hover:bg-cyan-500/10 hover:text-cyan-400 transition-all cursor-pointer"
                        >
                          <SubIcon className="h-4 w-4 text-cyan-455" />
                          <span>{sub.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Line Bottom Indicator */}
                {isSelected && (
                  <motion.div
                    layoutId="activeUnderline"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-sky-500 to-cyan-400 rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </div>
            );
          })}
        </nav>

        {/* Right Section: System info + User session */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden sm:flex items-center gap-1.5 rounded-full border border-slate-900 bg-slate-950/60 px-3 py-1 text-[10px] font-bold text-slate-350">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
            <span>{systemTime}</span>
          </div>

          {user ? (
            <div className="flex items-center gap-2">
              <div 
                className="flex items-center gap-1.5 rounded-xl bg-slate-900/80 border border-slate-850 px-3 py-1.5 text-xs font-bold text-slate-100 cursor-pointer hover:border-cyan-500/20"
                onClick={() => setActiveTab("auth")}
                title={t.myAccount}
              >
                {user.role === "admin" || user.role === "teacher" ? (
                  <ShieldAlert className="h-3.5 w-3.5 text-rose-400" />
                ) : (
                  <User className="h-3.5 w-3.5 text-cyan-400 animate-pulse" />
                )}
                <span className="max-w-[70px] truncate">{user.name}</span>
              </div>
              <button
                onClick={handleLogoutClick}
                className="flex items-center justify-center rounded-xl bg-rose-950/20 border border-rose-500/20 hover:bg-rose-900/30 p-2 text-rose-300 transition-all cursor-pointer"
                title={t.logout}
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setActiveTab("auth")}
              className="rounded-xl bg-gradient-to-r from-sky-500 to-cyan-402 px-4 py-2 text-xs font-extrabold text-[#050812] hover:scale-105 hover:shadow-[0_0_15px_rgba(34,211,238,0.2)] transition-all cursor-pointer animate-pulse-border"
            >
              {t.portalLogin}
            </button>
          )}

          {/* Mobile Hamburguer trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-300 hover:text-white rounded-xl border border-slate-900 bg-slate-950/50 cursor-pointer"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Responsive mobile menu drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden w-full bg-[#050914] border-b border-slate-900 py-4 px-6 flex flex-col gap-2 shadow-2xl backdrop-blur-xl max-h-[80vh] overflow-y-auto"
          >
            {navItems.map((item) => (
              <div key={item.id} className="flex flex-col gap-1">
                <button
                  onClick={() => handleItemClick(item)}
                  className={`flex items-center justify-between rounded-xl px-4 py-3 text-xs font-bold text-right transition-all cursor-pointer ${
                    activeTab === item.id
                      ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                      : "text-slate-300 hover:bg-slate-900/50"
                  }`}
                >
                  <span>{item.label}</span>
                  {item.subitems && <ChevronDown className="h-3.5 w-3.5 opacity-60" />}
                </button>

                {item.subitems && (
                  <div className="mr-4 pr-3 border-r border-slate-900 flex flex-col gap-1.5 py-1">
                    {item.subitems.map((sub) => {
                      const SubIcon = sub.icon;
                      return (
                        <button
                          key={sub.id}
                          onClick={() => handleSubitemClick(item.id, sub.id)}
                          className="flex items-center gap-2 rounded-lg px-3 py-2 text-[11px] font-bold text-slate-400 hover:text-cyan-400 transition-all cursor-pointer"
                        >
                          <SubIcon className="h-3.5 w-3.5 text-cyan-455" />
                          <span>{sub.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
