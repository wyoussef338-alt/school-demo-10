import { useState, useEffect } from "react";
import { collection, onSnapshot, setDoc, doc, addDoc } from "firebase/firestore";
import { db } from "./firebase";
import { UserProfile, ClassScore, LeagueTeam, LeagueMatch, LeagueVideo, LeagueVote } from "./types";
import Header, { SchoolCrest } from "./components/Header";
import HomeOverview from "./components/HomeOverview";
import StudyAI from "./components/StudyAI";
import Leaderboard from "./components/Leaderboard";
import ChallengesZone from "./components/ChallengesZone";
import SoccerLeague from "./components/SoccerLeague";
import AuthPage from "./components/AuthPage";
import AboutPage from "./components/AboutPage";
import CampusPage from "./components/CampusPage";
import AcademicsPage from "./components/AcademicsPage";
import ExtracurricularsPage from "./components/ExtracurricularsPage";
import AlumniPage from "./components/AlumniPage";
import ContactPage from "./components/ContactPage";
import { translations, Language } from "./utils/translations";

export default function App() {
  const [lang, setLang] = useState<Language>(() => {
    return (localStorage.getItem("salheen_lang") as Language) || "ar";
  });
  const t = translations[lang];

  useEffect(() => {
    localStorage.setItem("salheen_lang", lang);
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
  }, [lang]);

  const [activeTab, setActiveTab ] = useState<string>("home");
  const [activeSubTab, setActiveSubTab] = useState<string>("");
  const [activeGrade, setActiveGrade] = useState<string>("p4");

  const handleTabChange = (tab: string, subTab?: string) => {
    setActiveTab(tab);
    if (subTab) {
      setActiveSubTab(subTab);
    } else {
      setActiveSubTab("");
    }
  };
  const [systemTime, setSystemTime] = useState<string>("");

  const [user, setUser] = useState<any>(() => {
    const saved = localStorage.getItem("salheen_user");
    return saved ? JSON.parse(saved) : {
      uid: "mock-student-youssef",
      email: "wyoussef338@gmail.com",
      name: "YOUSSEF",
      role: "student",
      gradeId: "p4",
      classId: "1A",
      points: 180,
      streak: 4,
      achievements: ["التسجيل الأول"],
      createdAt: new Date().toISOString()
    };
  });

  const [classScores, setClassScores] = useState<ClassScore[]>([
    { id: "1A", name: "الأول أ", points: 260 },
    { id: "1B", name: "الأول ب", points: 246 },
    { id: "2A", name: "الثاني أ", points: 232 },
    { id: "2B", name: "الثاني ب", points: 251 }
  ]);

  const [competitionLog, setCompetitionLog] = useState<string[]>([
    "الأول أ حصل على +15 نقطة لتفوق طلابه في امتحان رابعة ابتدائي.",
    "الأول ب كسب +12 لتميز السلوك والهدوء اليومي للفصل.",
    "الثاني أ حصل على +10 نقاط للمشاركة والالتزام في أنشطة الإبداع المدرسية."
  ]);

  const [leagueTeams, setLeagueTeams] = useState<LeagueTeam[]>([]);
  const [leagueMatches, setLeagueMatches] = useState<LeagueMatch[]>([]);
  const [leagueVideos, setLeagueVideos] = useState<LeagueVideo[]>([]);
  const [leagueVotes, setLeagueVotes] = useState<{ player: LeagueVote[]; team: LeagueVote[] }>({
    player: [],
    team: []
  });

  const [joinedClubs, setJoinedClubs] = useState<string[]>([]);
  const [loginRegistry, setLoginRegistry] = useState<any[]>([
    { email: "wyoussef338@gmail.com", at: Date.now() - 1000 * 60 * 5 }
  ]);

  useEffect(() => {
    const updateTime = () => {
      const formatted = new Intl.DateTimeFormat(lang === "ar" ? "ar-EG" : "en-US", {
        hour: "2-digit",
        minute: "2-digit",
        weekday: "short"
      }).format(new Date());
      setSystemTime(formatted);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, [lang]);

  useEffect(() => {
    if (user) {
      localStorage.setItem("salheen_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("salheen_user");
    }
  }, [user]);

  useEffect(() => {
    if (!db) {
      console.warn("⚠️ Firebase db is uninitialized. Running in local fallback state.");
      return;
    }

    try {
      const unsubClasses = onSnapshot(collection(db, "classScores"), (snap) => {
        if (!snap.empty) {
          const list: ClassScore[] = [];
          snap.forEach((doc) => {
            list.push(doc.data() as ClassScore);
          });
          setClassScores(list);
        }
      }, (error) => {
        console.warn("⚠️ Live loader (classScores) failed. Using default values:", error);
      });

      const unsubTeams = onSnapshot(collection(db, "leagueTeams"), (snap) => {
        const list: LeagueTeam[] = [];
        snap.forEach((doc) => {
          list.push(doc.data() as LeagueTeam);
        });
        setLeagueTeams(list);
      }, (error) => {
        console.warn("⚠️ Live loader (leagueTeams) failed:", error);
      });

      const unsubMatches = onSnapshot(collection(db, "leagueMatches"), (snap) => {
        const list: LeagueMatch[] = [];
        snap.forEach((doc) => {
          list.push(doc.data() as LeagueMatch);
        });
        if (list.length > 0) {
          setLeagueMatches(list);
        }
      }, (error) => {
        console.warn("⚠️ Live loader (leagueMatches) failed:", error);
      });

      const unsubVideos = onSnapshot(collection(db, "leagueVideos"), (snap) => {
        const list: LeagueVideo[] = [];
        snap.forEach((doc) => {
          list.push(doc.data() as LeagueVideo);
        });
        if (list.length > 0) {
          setLeagueVideos(list);
        }
      }, (error) => {
        console.warn("⚠️ Live loader (leagueVideos) failed:", error);
      });

      const unsubVotesPl = onSnapshot(collection(db, "leagueVotes_player"), (snap) => {
        const list: LeagueVote[] = [];
        snap.forEach((doc) => {
          list.push(doc.data() as LeagueVote);
        });
        setLeagueVotes((prev) => ({ ...prev, player: list }));
      }, (error) => {
        console.warn("⚠️ Live loader (leagueVotes_player) failed:", error);
      });

      const unsubVotesTm = onSnapshot(collection(db, "leagueVotes_team"), (snap) => {
        const list: LeagueVote[] = [];
        snap.forEach((doc) => {
          list.push(doc.data() as LeagueVote);
        });
        setLeagueVotes((prev) => ({ ...prev, team: list }));
      }, (error) => {
        console.warn("⚠️ Live loader (leagueVotes_team) failed:", error);
      });

      return () => {
        unsubClasses();
        unsubTeams();
        unsubMatches();
        unsubVideos();
        unsubVotesPl();
        unsubVotesTm();
      };
    } catch (err) {
      console.error("⚠️ Failed to establish Firestore listeners:", err);
    }
  }, []);

  const handleRegisterTeam = async (teamData: Omit<LeagueTeam, "id" | "createdAt" | "group">) => {
    const teamId = "team-" + Date.now();
    const grp = leagueTeams.filter((t) => t.division === teamData.division).length % 2 === 0 ? "A" : "B";
    const fullTeam: LeagueTeam = {
      ...teamData,
      id: teamId,
      group: grp,
      createdAt: Date.now()
    };

    try {
      if (db) {
        await setDoc(doc(db, "leagueTeams", teamId), fullTeam);
      } else {
        setLeagueTeams((prev) => [...prev, fullTeam]);
      }
    } catch {
      setLeagueTeams((prev) => [...prev, fullTeam]);
    }
  };

  const handleRemoveTeam = async (teamId: string) => {
    try {
      setLeagueTeams((prev) => prev.filter((t) => t.id !== teamId));
    } catch {
      return;
    }
  };

  const handleAddMatch = async (matchData: Omit<LeagueMatch, "id" | "playedAt">) => {
    const matchId = "match-" + Date.now();
    const fullMatch: LeagueMatch = {
      ...matchData,
      id: matchId,
      playedAt: Date.now()
    };

    try {
      if (db) {
        await setDoc(doc(db, "leagueMatches", matchId), fullMatch);
      } else {
        setLeagueMatches((prev) => [...prev, fullMatch]);
      }
    } catch {
      setLeagueMatches((prev) => [...prev, fullMatch]);
    }
  };

  const handleAddVideo = async (videoData: Omit<LeagueVideo, "id" | "addedAt">) => {
    const videoId = "vid-" + Date.now();
    const fullVideo: LeagueVideo = {
      ...videoData,
      id: videoId,
      addedAt: Date.now()
    };

    try {
      if (db) {
        await setDoc(doc(db, "leagueVideos", videoId), fullVideo);
      } else {
        setLeagueVideos((prev) => [...prev, fullVideo]);
      }
    } catch {
      setLeagueVideos((prev) => [...prev, fullVideo]);
    }
  };

  const handleVotePlayer = async (target: string) => {
    const voice: LeagueVote = {
      email: user?.email || "anonymous@salheen.edu",
      target,
      at: Date.now()
    };

    try {
      if (db) {
        await addDoc(collection(db, "leagueVotes_player"), voice);
      } else {
        setLeagueVotes((prev) => ({ ...prev, player: [...prev.player, voice] }));
      }
    } catch {
      setLeagueVotes((prev) => ({ ...prev, player: [...prev.player, voice] }));
    }
  };

  const handleVoteTeam = async (target: string) => {
    const voice: LeagueVote = {
      email: user?.email || "anonymous@salheen.edu",
      target,
      at: Date.now()
    };

    try {
      if (db) {
        await addDoc(collection(db, "leagueVotes_team"), voice);
      } else {
        setLeagueVotes((prev) => ({ ...prev, team: [...prev.team, voice] }));
      }
    } catch {
      setLeagueVotes((prev) => ({ ...prev, team: [...prev.team, voice] }));
    }
  };

  const handleAddPoints = async (pts: number, classId: string, logMsg: string) => {
    if (user) {
      const nextUser = {
        ...user,
        points: user.points + pts
      };
      setUser(nextUser);
    }

    setCompetitionLog((prev) => [`تم إضافة +${pts} نقطة: ${logMsg}`, ...prev].slice(0, 10));

    const targetClass = classScores.find((c) => c.id === classId);
    if (targetClass) {
      const updatedClasses = classScores.map((c) => {
        if (c.id === classId) {
          const nextPts = c.points + pts;
          try {
            if (db) {
              setDoc(doc(db, "classScores", classId), { ...c, points: nextPts });
            }
          } catch {
            return;
          }
          return { ...c, points: nextPts };
        }
        return c;
      });
      setClassScores(updatedClasses as any);
    }
  };

  const handleBoostClass = async (classId: string, pts: number, reason: string) => {
    const updated = classScores.map((c) => {
      if (c.id === classId) {
        const nextPts = c.points + pts;
        try {
          if (db) {
            setDoc(doc(db, "classScores", classId), { ...c, points: nextPts });
          }
        } catch {
          return;
        }
        return { ...c, points: nextPts };
      }
      return c;
    });
    setClassScores(updated as any);
    setCompetitionLog((prev) => [`تعديل إداري لنقاط ${classScores.find((c) => c.id === classId)?.name || ""}: +${pts} نقطة (${reason})`, ...prev]);
  };

  const handleSimulateDay = () => {
    const updated = classScores.map((c) => {
      const added = Math.floor(Math.random() * 16) + 5;
      try {
        if (db) {
          setDoc(doc(db, "classScores", c.id), { ...c, points: c.points + added });
        }
      } catch {
        return;
      }
      return { ...c, points: c.points + added };
    });
    setClassScores(updated as any);
    setCompetitionLog((prev) => ["تمت محاكاة يوم دراسي ونشاط كروي وتحديث نقاط جميع الفصول تزامناً مع السحاب!", ...prev]);
  };

  const handleJoinClub = (club: string) => {
    if (joinedClubs.includes(club)) return;
    setJoinedClubs((prev) => [...prev, club]);
    handleAddPoints(10, user?.classId || "1A", `انضمام الطالب (${user?.name || ""}) إلى نادي الأنشطة`);
  };

  const handleLoginSuccess = (profile: any, shouldRedirect = true) => {
    setUser(profile);
    setLoginRegistry((prev) => {
      if (prev.length > 0 && prev[0].email === profile.email && Date.now() - prev[0].at < 10000) {
        return prev;
      }
      return [{ email: profile.email, at: Date.now() }, ...prev];
    });
    if (shouldRedirect) {
      setActiveTab("home");
    }
  };

  const handleLogout = () => {
    setUser(null);
    setActiveTab("auth");
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-white relative pt-[72px] md:pt-[84px]">
      {/* Ambient background glow bubbles */}
      <div className="ambient-glow-1"></div>
      <div className="ambient-glow-2"></div>

      <Header
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        user={user}
        onLogout={handleLogout}
        systemTime={systemTime}
        lang={lang}
      />

      <main className="flex-1 w-full flex flex-col">
        {activeTab === "home" && (
          <HomeOverview
            user={user}
            setActiveTab={handleTabChange}
            onJoinClub={handleJoinClub}
            joinedClubs={joinedClubs}
            lang={lang}
          />
        )}

        {activeTab !== "home" && (
          <div className="mx-auto max-w-7xl w-full px-4 md:px-6 lg:px-8 py-8 md:py-12">
            {activeTab === "about" && (
              <AboutPage subTab={activeSubTab} lang={lang} />
            )}

            {activeTab === "campus" && (
              <CampusPage lang={lang} />
            )}

            {activeTab === "academics" && (
              <AcademicsPage
                user={user}
                onAddPoints={handleAddPoints}
                activeGrade={activeGrade}
                setActiveGrade={setActiveGrade}
                subTab={activeSubTab}
                lang={lang}
              />
            )}

            {activeTab === "extracurriculars" && (
              <ExtracurricularsPage
                user={user}
                leagueTeams={leagueTeams}
                leagueMatches={leagueMatches}
                leagueVideos={leagueVideos}
                leagueVotes={leagueVotes}
                onRegisterTeam={handleRegisterTeam}
                onRemoveTeam={handleRemoveTeam}
                onAddMatch={handleAddMatch}
                onAddVideo={handleAddVideo}
                onVotePlayer={handleVotePlayer}
                onVoteTeam={handleVoteTeam}
                joinedClubs={joinedClubs}
                onJoinClub={handleJoinClub}
                lang={lang}
              />
            )}

            {activeTab === "alumni" && (
              <AlumniPage
                classScores={classScores}
                onBoostClass={handleBoostClass}
                onSimulateDay={handleSimulateDay}
                user={user}
                competitionLog={competitionLog}
                lang={lang}
              />
            )}

            {activeTab === "contact" && (
              <ContactPage lang={lang} />
            )}

            {activeTab === "auth" && (
              <AuthPage
                onLoginSuccess={handleLoginSuccess}
                user={user}
                onLogout={handleLogout}
                loginRegistry={loginRegistry}
                lang={lang}
                onLangChange={setLang}
              />
            )}
          </div>
        )}
      </main>

      <footer className="w-full text-center text-xs font-bold text-[#bca56a] border-t border-slate-900 py-12 bg-slate-950/80 backdrop-blur-sm font-sans mt-auto" dir={lang === "ar" ? "rtl" : "ltr"}>
        <div className={`max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-8 pb-8 border-b border-slate-900 text-slate-300 ${lang === "ar" ? "text-right" : "text-left"}`}>
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center gap-2">
              <SchoolCrest className="h-10 w-10 text-cyan-400 animate-pulse" />
              <div>
                <h4 className="font-display text-sm font-black text-white leading-none">{t.appName}</h4>
                <span className="text-[8px] font-sans font-black text-cyan-400 block tracking-wider uppercase mt-1">{t.appSubName}</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed font-semibold">
              {t.appFooterDesc}
            </p>
          </div>

          <div className="md:col-span-4 space-y-3">
            <h4 className="font-display text-xs font-black text-[#c5a85c] tracking-wider uppercase">{t.quickLinks}</h4>
            <div className={`grid grid-cols-2 gap-2 text-[11px] font-semibold text-slate-400 ${lang === "ar" ? "text-right" : "text-left"}`}>
              <button onClick={() => handleTabChange("home")} className={`${lang === "ar" ? "text-right" : "text-left"} hover:text-white transition-colors cursor-pointer`}>{t.home}</button>
              <button onClick={() => handleTabChange("about", "overview")} className={`${lang === "ar" ? "text-right" : "text-left"} hover:text-white transition-colors cursor-pointer`}>{t.about}</button>
              <button onClick={() => handleTabChange("about", "campus")} className={`${lang === "ar" ? "text-right" : "text-left"} hover:text-white transition-colors cursor-pointer`}>{t.about_campus || "Facilities"}</button>
              <button onClick={() => handleTabChange("academics", "overview")} className={`${lang === "ar" ? "text-right" : "text-left"} hover:text-white transition-colors cursor-pointer`}>{t.academics}</button>
              <button onClick={() => handleTabChange("extracurriculars", "league")} className={`${lang === "ar" ? "text-right" : "text-left"} hover:text-white transition-colors cursor-pointer`}>{t.extracurriculars}</button>
              <button onClick={() => handleTabChange("alumni", "alumni-grid")} className={`${lang === "ar" ? "text-right" : "text-left"} hover:text-white transition-colors cursor-pointer`}>{t.alumni}</button>
            </div>
          </div>

          <div className="md:col-span-4 space-y-3">
            <h4 className="font-display text-xs font-black text-[#c5a85c] tracking-wider">{t.keepInTouch}</h4>
            <div className="text-[11px] text-slate-400 font-semibold space-y-1.5 leading-relaxed">
              <p>{t.address}</p>
              <p>{t.phone}</p>
              <p>{t.email}</p>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 mt-8 text-[10px] text-slate-500 font-bold">
          {t.allRightsReserved}
        </div>
      </footer>
    </div>
  );
}
