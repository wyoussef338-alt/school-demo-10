import React, { useState } from "react";
import { Compass, Trophy, Users, Star, Video, ArrowLeftRight, Clock, Plus, Trash, Check, UserCheck, Flame } from "lucide-react";
import { LeagueTeam, LeagueMatch, LeagueVideo, LeagueVote } from "../types";

interface SoccerLeagueProps {
  user: any;
  leagueTeams: LeagueTeam[];
  leagueMatches: LeagueMatch[];
  leagueVideos: LeagueVideo[];
  leagueVotes: { player: LeagueVote[]; team: LeagueVote[] };
  onRegisterTeam: (teamData: Omit<LeagueTeam, "id" | "createdAt" | "group">) => void;
  onRemoveTeam: (teamId: string) => void;
  onAddMatch: (matchData: Omit<LeagueMatch, "id" | "playedAt">) => void;
  onAddVideo: (videoData: Omit<LeagueVideo, "id" | "addedAt">) => void;
  onVotePlayer: (target: string) => void;
  onVoteTeam: (target: string) => void;
  lang?: "ar" | "en";
}

export default function SoccerLeague({
  user,
  leagueTeams,
  leagueMatches,
  leagueVideos,
  leagueVotes,
  onRegisterTeam,
  onRemoveTeam,
  onAddMatch,
  onAddVideo,
  onVotePlayer,
  onVoteTeam,
  lang = "ar"
}: SoccerLeagueProps) {
  const [activeSubTab, setActiveTab] = useState<"register" | "standings" | "matches" | "videos" | "voting">("standings");
  const [teamName, setTeamName] = useState("");
  const [division, setDivision] = useState<"prep" | "secondary">("prep");
  const [gradeId, setGradeId] = useState("j1");
  const [mainPlayers, setMainPlayers] = useState(["", "", "", "", ""]);
  const [subPlayers, setSubPlayers] = useState(["", ""]);

  const [matchHomeTeam, setMatchHomeTeam] = useState("");
  const [matchAwayTeam, setMatchAwayTeam] = useState("");
  const [matchHomeGoals, setMatchHomeGoals] = useState(0);
  const [matchAwayGoals, setMatchAwayGoals] = useState(0);
  const [matchMvp, setMatchMvp] = useState("");
  const [matchMvpTeam, setMatchMvpTeam] = useState("");
  const [matchNotes, setMatchNotes] = useState("");
  const [matchDivision, setMatchMatchDivision] = useState<"prep" | "secondary" | "super">("prep");
  const [matchStage, setMatchStage] = useState<"groups" | "semi" | "final" | "super-final">("groups");

  const [videoTitle, setVideoTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [videoKind, setVideoKind] = useState<"هدف" | "مهارة" | "لقطة">("لقطة");

  const isAr = lang === "ar";
  const isStaff = user?.role === "teacher" || user?.role === "admin";
  const userTeam = leagueTeams.find((t) => t.ownerEmail === user?.email);

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName.trim() || mainPlayers.some((p) => !p.trim())) {
      alert(isAr ? "يرجى كتابة اسم الفريق وأسماء الـ 5 لاعبين الأساسيين بالكامل!" : "Please write the team name and all 5 main players!");
      return;
    }
    onRegisterTeam({
      ownerEmail: user?.email || "anonymous@salheen.edu",
      ownerName: user?.name || (isAr ? "طالب الصالحين" : "Salheen Student"),
      teamName,
      division,
      gradeId,
      mainPlayers: mainPlayers.filter((p) => p.trim()),
      subPlayers: subPlayers.filter((p) => p.trim())
    });
    alert(isAr ? "تم تقديم طلب تسجيل فريقك بنجاح!" : "Your team registration was successfully submitted!");
  };

  const handleMatchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!matchHomeTeam || !matchAwayTeam || matchHomeTeam === matchAwayTeam) {
      alert(isAr ? "الرجاء اختيار فريقين مختلفين للماتش!" : "Please pick two different teams for the match!");
      return;
    }
    onAddMatch({
      division: matchDivision,
      stage: matchStage,
      homeTeamId: matchHomeTeam,
      awayTeamId: matchAwayTeam,
      homeGoals: matchHomeGoals,
      awayGoals: matchAwayGoals,
      mvpName: matchMvp,
      mvpTeamId: matchMvpTeam,
      scorers: []
    });
    alert(isAr ? "تم توثيق نتيجة المباراة كأدمن وتحديث الدوري مباشرة!" : "Match stats recorded as admin and league was updated!");
  };

  const handleVideoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoTitle.trim() || !videoUrl.trim()) return;
    onAddVideo({
      title: videoTitle,
      url: videoUrl,
      kind: videoKind,
      addedBy: user?.name || (isAr ? "معلم المشرف" : "Supervisor Teacher")
    });
    setVideoTitle("");
    setVideoUrl("");
    alert(isAr ? "تم نشر الفيديو في مكتبة لقطات الصالحين!" : "Video published in El-Salheen highlights library!");
  };

  const getTeamName = (id: string) => {
    return leagueTeams.find((t) => t.id === id)?.teamName || (isAr ? "فريق الصالحين مجهول" : "Unknown El-Salheen Team");
  };

  const calcStats = () => {
    const stats: { [teamId: string]: { played: number; wins: number; draws: number; losses: number; gf: number; ga: number; pts: number } } = {};
    
    leagueTeams.forEach((t) => {
      stats[t.id] = { played: 0, wins: 0, draws: 0, losses: 0, gf: 0, ga: 0, pts: 0 };
    });

    leagueMatches.forEach((m) => {
      if (!stats[m.homeTeamId]) stats[m.homeTeamId] = { played: 0, wins: 0, draws: 0, losses: 0, gf: 0, ga: 0, pts: 0 };
      if (!stats[m.awayTeamId]) stats[m.awayTeamId] = { played: 0, wins: 0, draws: 0, losses: 0, gf: 0, ga: 0, pts: 0 };

      stats[m.homeTeamId].played += 1;
      stats[m.awayTeamId].played += 1;
      stats[m.homeTeamId].gf += m.homeGoals;
      stats[m.homeTeamId].ga += m.awayGoals;
      stats[m.awayTeamId].gf += m.awayGoals;
      stats[m.awayTeamId].ga += m.homeGoals;

      if (m.homeGoals > m.awayGoals) {
        stats[m.homeTeamId].wins += 1;
        stats[m.awayTeamId].losses += 1;
        stats[m.homeTeamId].pts += 3;
      } else if (m.homeGoals < m.awayGoals) {
        stats[m.awayTeamId].wins += 1;
        stats[m.homeTeamId].losses += 1;
        stats[m.awayTeamId].pts += 3;
      } else {
        stats[m.homeTeamId].draws += 1;
        stats[m.awayTeamId].draws += 1;
        stats[m.homeTeamId].pts += 1;
        stats[m.awayTeamId].pts += 1;
      }
    });

    return stats;
  };

  const stats = calcStats();

  const getYoutubeEmbed = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  return (
    <div className="flex flex-col gap-6" dir={isAr ? "rtl" : "ltr"}>
      <div className={`flex flex-wrap gap-2 border-b border-slate-800 pb-4 ${isAr ? "justify-start" : "justify-start"}`}>
        <button
          onClick={() => setActiveTab("standings")}
          className={`flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === "standings" ? "bg-gradient-to-r from-sky-500 to-cyan-400 text-slate-950 font-black shadow-lg shadow-cyan-500/10" : "bg-slate-950 border border-slate-800 text-slate-400 hover:text-white"
          }`}
        >
          <Trophy className="h-4.5 w-4.5" />
          {isAr ? "لوحة المباريات والجدول" : "Matches & Standings"}
        </button>
        <button
          onClick={() => setActiveTab("register")}
          className={`flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === "register" ? "bg-gradient-to-r from-sky-500 to-cyan-400 text-slate-950 font-black shadow-lg shadow-cyan-500/10" : "bg-slate-950 border border-slate-800 text-slate-400 hover:text-white"
          }`}
        >
          <Users className="h-4.5 w-4.5" />
          {isAr ? "تسجيل فريقي المدرسى" : "Register My School Team"}
        </button>
        <button
          onClick={() => setActiveTab("matches")}
          className={`flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === "matches" ? "bg-gradient-to-r from-sky-500 to-cyan-400 text-slate-950 font-black shadow-lg shadow-cyan-500/10" : "bg-slate-950 border border-slate-800 text-slate-400 hover:text-white"
          }`}
        >
          <ArrowLeftRight className="h-4.5 w-4.5" />
          {isAr ? "نتائج الجولات (Live)" : "Match Results (Live)"}
        </button>
        <button
          onClick={() => setActiveTab("videos")}
          className={`flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === "videos" ? "bg-gradient-to-r from-sky-500 to-cyan-400 text-slate-950 font-black shadow-lg shadow-cyan-500/10" : "bg-slate-950 border border-slate-800 text-slate-400 hover:text-white"
          }`}
        >
          <Video className="h-4.5 w-4.5" />
          {isAr ? "فيديوهات ولقطات البطولة" : "Highlight Videos"}
        </button>
        <button
          onClick={() => setActiveTab("voting")}
          className={`flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === "voting" ? "bg-gradient-to-r from-sky-500 to-cyan-400 text-slate-950 font-black shadow-lg shadow-cyan-500/10" : "bg-slate-950 border border-slate-800 text-slate-400 hover:text-white"
          }`}
        >
          <Star className="h-4.5 w-4.5" />
          {isAr ? "صوّت للاعب والجولة" : "Vote MVP & Round"}
        </button>
      </div>

      {activeSubTab === "standings" && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="flex flex-col gap-6 lg:col-span-2">
            <section className="rounded-2xl border border-sky-500/15 bg-slate-900/80 p-6 shadow-xl backdrop-blur-xl">
              <h3 className={`font-display text-base font-bold text-white mb-4 ${isAr ? "text-right" : "text-left"}`}>
                {isAr ? "ترتيب دوري الصالحين الكروي العام للطلاب" : "General El-Salheen Soccer League Standings"}
              </h3>
              
              <div className="overflow-x-auto">
                <table className={`w-full ${isAr ? "text-right" : "text-left"} text-xs`}>
                  <thead>
                    <tr className="border-b border-slate-800 text-cyan-400 font-extrabold text-[10px]">
                      <th className="py-3">{isAr ? "الترتيب" : "Pos"}</th>
                      <th>{isAr ? "الفريق" : "Team"}</th>
                      <th>{isAr ? "المسار" : "Division"}</th>
                      <th>{isAr ? "لعب" : "P"}</th>
                      <th>{isAr ? "فوز" : "W"}</th>
                      <th>{isAr ? "تعادل" : "D"}</th>
                      <th>{isAr ? "خسارة" : "L"}</th>
                      <th>{isAr ? "أهداف له" : "GF"}</th>
                      <th>{isAr ? "نقاط" : "Pts"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leagueTeams.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="text-center py-8 text-slate-500 font-bold">
                          {isAr ? "لا يوجد فرق مسجلة في الدوري حالياً. كن أول من يسجل فريقه!" : "No teams registered yet. Be the first to register your team!"}
                        </td>
                      </tr>
                    ) : (
                      leagueTeams
                        .map((team) => {
                          const tStats = stats[team.id] || { played: 0, wins: 0, draws: 0, losses: 0, gf: 0, ga: 0, pts: 0 };
                          return { ...team, ...tStats };
                        })
                        .sort((a, b) => b.pts - a.pts || b.gf - a.gf)
                        .map((team, idx) => (
                          <tr key={team.id} className="border-b border-slate-800/60 text-slate-300 font-bold hover:bg-slate-950/40">
                            <td className="py-3 pr-2">
                              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-950 text-cyan-400 text-[10px] font-bold border border-cyan-500/10">
                                {idx + 1}
                              </span>
                            </td>
                            <td className="font-display text-white">{team.teamName}</td>
                            <td>{team.division === "prep" ? (isAr ? "إعدادي" : "Prep") : (isAr ? "ثانوي" : "Secondary")}</td>
                            <td>{team.played}</td>
                            <td>{team.wins}</td>
                            <td>{team.draws}</td>
                            <td>{team.losses}</td>
                            <td>{team.gf}</td>
                            <td className="text-cyan-400 font-extrabold">{team.pts}</td>
                          </tr>
                        ))
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          <div className="flex flex-col gap-6 lg:col-span-1">
            <section className="rounded-2xl border border-sky-500/15 bg-slate-900/80 p-6 shadow-xl backdrop-blur-xl">
              <h3 className={`font-display text-base font-bold text-white mb-4 ${isAr ? "text-right" : "text-left"}`}>
                {isAr ? "🏅 تصنيف السوبر ستار (MVP)" : "🏅 Super Star (MVP) Standings"}
              </h3>
              <div className="flex flex-col gap-2">
                {leagueMatches.length === 0 ? (
                  <p className={`text-center text-xs text-slate-500 py-8 font-bold ${isAr ? "text-right" : "text-left"}`}>
                    {isAr ? "تبدأ إحصائيات MVP مع تسجيل نتائج اللقاءات." : "MVP stats will start once match results are logged."}
                  </p>
                ) : (
                  [...new Set(leagueMatches.map((m) => m.mvpName).filter(Boolean))].slice(0, 5).map((mvp, i) => (
                    <div key={i} className={`flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/60 p-3.5 text-xs text-slate-300 font-bold ${isAr ? "flex-row" : "flex-row-reverse"}`}>
                      <span className="flex items-center gap-2">
                        <span className="text-cyan-400">🎖️</span>
                        {mvp}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>
        </div>
      )}

      {activeSubTab === "register" && (
        <div className={`grid grid-cols-1 gap-6 lg:grid-cols-12 ${isAr ? "text-right" : "text-left"}`}>
          <div className="lg:col-span-8">
            <section className="rounded-2xl border border-sky-500/15 bg-slate-900/80 p-6 shadow-xl backdrop-blur-xl">
              <h3 className={`font-display text-base font-bold text-white border-b border-slate-800 pb-3 mb-4 ${isAr ? "text-right" : "text-left"}`}>
                {isAr ? "وثيقة تسجيل تشكيل فريقكم الكروي المدرسي" : "School Football Team Registration Form"}
              </h3>

              {userTeam ? (
                <div className="rounded-xl border border-emerald-800/40 bg-emerald-950/20 p-5 text-center">
                  <span className="text-[#9bd28c] text-2xl font-black">
                    {isAr ? "👊 تم تسجيل فريقك بنجاح!" : "👊 Your team has been registered successfully!"}
                  </span>
                  <p className="mt-2 text-xs text-slate-300 font-bold">
                    {isAr ? "فريقك هو: " : "Your team: "}
                    <strong className="text-cyan-400">{userTeam.teamName}</strong>
                    {isAr ? " ضمن دوري " : " in division "}
                    ({userTeam.division === "prep" ? (isAr ? "إعدادي" : "Prep") : (isAr ? "ثانوي" : "Secondary")}).
                  </p>
                  <button
                    onClick={() => onRemoveTeam(userTeam.id)}
                    className="mt-4 rounded-xl border border-red-800/40 bg-red-950/40 text-red-200 px-4 py-2 md:py-2.5 text-xs font-bold hover:bg-red-900/40 cursor-pointer"
                  >
                    {isAr ? "إلغاء التسجيل وتعديل فريقي" : "Cancel Registration & Edit"}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleRegisterSubmit} className="flex flex-col gap-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-300">{isAr ? "اسم فريقك الطلابي" : "Your Student Team Name"}</label>
                      <input
                        type="text"
                        value={teamName}
                        onChange={(e) => setTeamName(e.target.value)}
                        placeholder={isAr ? "مثال: نجوم الصالحين" : "e.g., Salheen Stars"}
                        className={`rounded-xl border border-slate-800 bg-slate-950/80 px-4 py-3 text-xs text-slate-100 focus:border-cyan-500 focus:outline-none transition-colors ${isAr ? "text-right" : "text-left"}`}
                        required
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-300">{isAr ? "اختيار دوري البطولة" : "Select League Division"}</label>
                      <select
                        value={division}
                        onChange={(e) => setDivision(e.target.value as any)}
                        className={`rounded-xl border border-slate-800 bg-slate-950/80 px-4 py-3 text-xs text-slate-100 focus:border-cyan-500 focus:outline-none transition-colors ${isAr ? "text-right" : "text-left"}`}
                      >
                        <option value="prep">{isAr ? "دوري المرحلة الإعدادية" : "Preparatory League"}</option>
                        <option value="secondary">{isAr ? "دوري المرحلة الثانوية" : "Secondary League"}</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-300">{isAr ? "الصف الدراسي الممثل" : "Representing Grade Class"}</label>
                      <select
                        value={gradeId}
                        onChange={(e) => setGradeId(e.target.value)}
                        className={`rounded-xl border border-slate-800 bg-slate-950/80 px-4 py-3 text-xs text-slate-100 focus:border-cyan-500 focus:outline-none transition-colors ${isAr ? "text-right" : "text-left"}`}
                      >
                        <option value="j1">{isAr ? "أولى إعدادي" : "1st Prep"}</option>
                        <option value="j2">{isAr ? "تانية إعدادي" : "2nd Prep"}</option>
                        <option value="j3">{isAr ? "تالتة إعدادي" : "3rd Prep"}</option>
                        <option value="s1">{isAr ? "أولى ثانوي" : "1st Secondary"}</option>
                        <option value="s2">{isAr ? "تانية ثانوي" : "2nd Secondary"}</option>
                      </select>
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                    <h4 className={`font-display text-xs font-bold text-white mb-3 ${isAr ? "text-right" : "text-left"}`}>{isAr ? "اللاعبون الأساسيون (5 لاعبين)" : "Starting Lineup (5 Players)"}</h4>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-5">
                      {mainPlayers.map((player, idx) => (
                        <div key={idx} className="flex flex-col gap-1">
                          <span className={`text-[10px] text-slate-400 font-bold ${isAr ? "text-right" : "text-left"}`}>{isAr ? `الأساسي ${idx + 1}` : `Starter ${idx + 1}`}</span>
                          <input
                            type="text"
                            value={player}
                            onChange={(e) => {
                              const updated = [...mainPlayers];
                              updated[idx] = e.target.value;
                              setMainPlayers(updated);
                            }}
                            placeholder={isAr ? "الاسم الثلاثي" : "Full Name"}
                            className={`rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-xs text-slate-100 ${isAr ? "text-right" : "text-left"}`}
                            required
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                    <h4 className={`font-display text-xs font-bold text-white mb-3 ${isAr ? "text-right" : "text-left"}`}>{isAr ? "اللاعبون الاحتياطيون (حتى لاعبين)" : "Substitutes (Up to 2 Players)"}</h4>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {subPlayers.map((player, idx) => (
                        <div key={idx} className="flex flex-col gap-1">
                          <span className={`text-[10px] text-slate-400 font-bold ${isAr ? "text-right" : "text-left"}`}>{isAr ? `احتياطي ${idx + 1}` : `Sub ${idx + 1}`}</span>
                          <input
                            type="text"
                            value={player}
                            onChange={(e) => {
                              const updated = [...subPlayers];
                              updated[idx] = e.target.value;
                              setSubPlayers(updated);
                            }}
                            placeholder={isAr ? "الاسم" : "Name"}
                            className={`rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-xs text-slate-100 ${isAr ? "text-right" : "text-left"}`}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className={`flex ${isAr ? "justify-end" : "justify-start"} mt-2`}>
                    <button
                      type="submit"
                      className="rounded-xl bg-gradient-to-r from-sky-500 to-cyan-400 px-8 py-3.5 font-display font-extrabold text-slate-950 transition-all hover:scale-[1.02] cursor-pointer"
                    >
                      {isAr ? "حفظ وتأكيد تشكيل فريق الدوري" : "Save & Confirm Football Roster"}
                    </button>
                  </div>
                </form>
              )}
            </section>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-4">
            <section className="rounded-2xl border border-sky-500/15 bg-slate-900/80 p-5 shadow-xl backdrop-blur-xl">
              <h3 className={`font-display text-sm font-bold text-white mb-3 ${isAr ? "text-right" : "text-left"}`}>{isAr ? "⚠️ قوانين التسجيل واللعبة" : "⚠️ League Rules & Gameplay Code"}</h3>
              <ul className={`grid gap-2 text-xs text-slate-300 font-bold ${isAr ? "text-right" : "text-left"} leading-relaxed`}>
                <li>• {isAr ? "تلعب المباريات بالكامل بنظام (5 ضد 5) في الملعب الخماسي." : "Matches are played 5v5 on the mini-football field."}</li>
                <li>• {isAr ? "كل فريق يتكون من 5 لاعبين أساسيين بحد أقصى واقله و 2 بدلاء." : "Each team consists of exactly 5 starters and up to 2 subs."}</li>
                <li>• {isAr ? "قرارات الحكام والمنظمين نهائية بالكامل." : "Referees' and coordinators' decisions are absolute."}</li>
                <li>• {isAr ? "أي تأخير عن انطلاق اللقاء بأكثر من 5 دقائق يعتبر مهزوماً بنتيجة 2-0." : "Any match delay exceeding 5 minutes results in a 2-0 forfeit defeat."}</li>
              </ul>
            </section>
          </div>
        </div>
      )}

      {activeSubTab === "matches" && (
        <div className={`grid grid-cols-1 gap-6 lg:grid-cols-3 ${isAr ? "text-right" : "text-left"}`}>
          <div className="lg:col-span-2">
            <section className="rounded-2xl border border-sky-500/15 bg-slate-900/80 p-6 shadow-xl backdrop-blur-xl">
              <h3 className={`font-display text-base font-bold text-white border-b border-slate-800 pb-3 mb-4 ${isAr ? "text-right" : "text-left"}`}>
                {isAr ? "نتائج جولات المباريات المسجلة بالدوري" : "Registered League Match Results"}
              </h3>

              <div className="flex flex-col gap-3">
                {leagueMatches.length === 0 ? (
                  <p className="text-center text-xs text-slate-500 py-12 font-bold border border-dashed border-slate-800 rounded-xl bg-slate-950/50">
                    {isAr ? "سوف تنشر النتائج مباشرة بعد انتهاء أولى اللقاءات." : "Results will be published live once the first matches end."}
                  </p>
                ) : (
                  [...leagueMatches].sort((a,b)=> b.playedAt - a.playedAt).map((match) => (
                    <div key={match.id} className="rounded-xl border border-slate-800 bg-slate-950 p-4 text-center shadow-inner">
                      <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold mb-2">
                        <span>
                          {match.division === "prep" ? (isAr ? "إعدادي" : "Prep") : match.division === "secondary" ? (isAr ? "ثانوي" : "Secondary") : (isAr ? "سوبر فاينال" : "Super Final")} • {match.stage === "super-final" ? "Super Final" : match.stage === "groups" ? (isAr ? "مرحلة المجموعات" : "Groups") : match.stage === "semi" ? (isAr ? "نصف النهائي" : "Semi Final") : (isAr ? "النهائي" : "Final")}
                        </span>
                        <span>{new Date(match.playedAt).toLocaleDateString(isAr ? "ar-EG" : "en-US")}</span>
                      </div>
                      
                      <div className="flex items-center justify-center gap-6 py-2">
                        <span className="font-display text-sm font-bold text-white">{getTeamName(match.homeTeamId)}</span>
                        <div className="rounded-xl bg-slate-900 border border-slate-850 px-4 py-2 font-mono text-base font-black text-cyan-400">
                          {match.homeGoals} - {match.awayGoals}
                        </div>
                        <span className="font-display text-sm font-bold text-white">{getTeamName(match.awayTeamId)}</span>
                      </div>

                      {match.mvpName && (
                        <div className="mt-3 text-[10px] text-slate-400 font-bold">
                          🌟 {isAr ? "MVP المباراة:" : "Match MVP:"} {match.mvpName}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>

          {isStaff && (
            <div className="lg:col-span-1">
              <section className="rounded-2xl border border-sky-500/15 bg-slate-900/80 p-5 shadow-xl backdrop-blur-xl">
                <h3 className={`font-display text-base font-bold text-white border-b border-slate-800 pb-3 mb-4 ${isAr ? "text-right" : "text-left"}`}>
                  {isAr ? "لوحة تحكم إدخال نتائج اللقاءات" : "Match Results Control Panel"}
                </h3>
                
                <form onSubmit={handleMatchSubmit} className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-slate-300">{isAr ? "دوري المرحلة" : "League Level"}</label>
                    <select
                      value={matchDivision}
                      onChange={(e) => setMatchMatchDivision(e.target.value as any)}
                      className={`rounded-xl border border-slate-800 bg-slate-950/85 p-2.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-500 ${isAr ? "text-right" : "text-left"}`}
                    >
                      <option value="prep">{isAr ? "دوري إعدادي" : "Prep League"}</option>
                      <option value="secondary">{isAr ? "دوري ثانوي" : "Secondary League"}</option>
                      <option value="super">{isAr ? "سوبر فاينال" : "Super Final"}</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-slate-300">{isAr ? "مرحلة الجولة" : "Match Stage"}</label>
                    <select
                      value={matchStage}
                      onChange={(e) => setMatchStage(e.target.value as any)}
                      className={`rounded-xl border border-slate-800 bg-slate-950/85 p-2.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-500 ${isAr ? "text-right" : "text-left"}`}
                    >
                      <option value="groups">{isAr ? "مرحلة المجموعات" : "Group Stage"}</option>
                      <option value="semi">{isAr ? "نصف النهائي" : "Semi Final"}</option>
                      <option value="final">{isAr ? "النهائي" : "Final"}</option>
                      <option value="super-final">{isAr ? "سوبر فاينال" : "Super Final"}</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-bold text-slate-300">{isAr ? "الفريق الأول" : "First Team"}</label>
                      <select
                        value={matchHomeTeam}
                        onChange={(e) => setMatchHomeTeam(e.target.value)}
                        className={`rounded-xl border border-slate-800 bg-slate-950/85 p-2 text-xs text-slate-100 focus:outline-none ${isAr ? "text-right" : "text-left"}`}
                        required
                      >
                        <option value="">{isAr ? "اختر الفريق" : "Select Team"}</option>
                        {leagueTeams.map((t) => (
                          <option key={t.id} value={t.id}>{t.teamName}</option>
                        ))}
                      </select>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-bold text-slate-300">{isAr ? "الفريق الثاني" : "Second Team"}</label>
                      <select
                        value={matchAwayTeam}
                        onChange={(e) => setMatchAwayTeam(e.target.value)}
                        className={`rounded-xl border border-slate-800 bg-slate-950/85 p-2 text-xs text-slate-100 focus:outline-none ${isAr ? "text-right" : "text-left"}`}
                        required
                      >
                        <option value="">{isAr ? "اختر الفريق" : "Select Team"}</option>
                        {leagueTeams.map((t) => (
                          <option key={t.id} value={t.id}>{t.teamName}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-bold text-slate-300">{isAr ? "أهداف الأول" : "First Goals"}</label>
                      <input
                        type="number"
                        min="0"
                        value={matchHomeGoals}
                        onChange={(e) => setMatchHomeGoals(parseInt(e.target.value) || 0)}
                        className="rounded-xl border border-slate-800 bg-slate-950 p-2 text-xs text-slate-100 text-center"
                        required
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-bold text-slate-300">{isAr ? "أهداف الثاني" : "Second Goals"}</label>
                      <input
                        type="number"
                        min="0"
                        value={matchAwayGoals}
                        onChange={(e) => setMatchAwayGoals(parseInt(e.target.value) || 0)}
                        className="rounded-xl border border-slate-800 bg-slate-950 p-2 text-xs text-slate-100 text-center"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-slate-300">{isAr ? "رجل اللقاء (MVP)" : "Man of the Match (MVP)"}</label>
                    <input
                      type="text"
                      value={matchMvp}
                      onChange={(e) => setMatchMvp(e.target.value)}
                      placeholder={isAr ? "اسم الطالب رجل الماتش" : "Student's full name"}
                      className={`rounded-xl border border-slate-800 bg-slate-950 p-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500 ${isAr ? "text-right" : "text-left"}`}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="mt-3 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-400 py-3 text-xs font-extrabold text-slate-950 transition-all hover:scale-[1.02] cursor-pointer"
                  >
                    {isAr ? "حفظ ورفع النتيجة مباشرة" : "Save & Publish Result"}
                  </button>
                </form>
              </section>
            </div>
          )}
        </div>
      )}

      {activeSubTab === "videos" && (
        <div className={`grid grid-cols-1 gap-6 lg:grid-cols-3 ${isAr ? "text-right" : "text-left"}`}>
          <div className="lg:col-span-2">
            <section className="rounded-2xl border border-sky-500/15 bg-slate-900/80 p-6 shadow-xl backdrop-blur-xl">
              <h3 className={`font-display text-base font-bold text-white border-b border-slate-800 pb-3 mb-4 ${isAr ? "text-right" : "text-left"}`}>
                {isAr ? "مكتبة فيديوهات ولقطات البطولة والأهداف المذهلة" : "Championship Video Highlights & Amazing Goals Library"}
              </h3>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {leagueVideos.length === 0 ? (
                  <p className="text-center text-xs text-slate-500 font-bold py-12 border border-dashed border-slate-800 rounded-xl bg-slate-950/50 col-span-2">
                    {isAr ? "أول ما تضيف فيديوهات البطولة والدرر الكروية هتظهر هنا مباشرة للجميع." : "Once you add championship videos, they will appear here live for everyone."}
                  </p>
                ) : (
                  [...leagueVideos].sort((a,b)=> b.addedAt - a.addedAt).map((video) => {
                    const embedId = getYoutubeEmbed(video.url);
                    return (
                      <div key={video.id} className="rounded-xl border border-slate-800 bg-slate-950 p-4 shadow-inner">
                        <span className="inline-flex rounded-full bg-cyan-500/10 px-2.5 py-0.5 text-[9px] font-extrabold text-cyan-400 mb-2">
                          {isAr ? video.kind : (video.kind === "هدف" ? "Goal" : video.kind === "مهارة" ? "Skill" : "Highlight")}
                        </span>
                        <h4 className={`font-display text-xs font-bold text-white line-clamp-1 ${isAr ? "text-right" : "text-left"}`}>{video.title}</h4>
                        
                        <div className="mt-3 overflow-hidden rounded-xl border border-slate-800">
                           {embedId ? (
                            <iframe
                              className="w-full aspect-video"
                              src={`https://www.youtube.com/embed/${embedId}`}
                              title={video.title}
                              frameBorder="0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                              allowFullScreen
                            ></iframe>
                          ) : (
                            <a
                              href={video.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-center p-8 bg-slate-900 hover:bg-slate-850 text-xs font-bold text-cyan-400 cursor-pointer"
                            >
                              {isAr ? "مشاهدة الفيديو على الرابط الخارجي" : "Watch video on external link"}
                            </a>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </section>
          </div>

          {isStaff && (
            <div className="lg:col-span-1">
              <section className="rounded-2xl border border-sky-500/15 bg-slate-900/80 p-5 shadow-xl backdrop-blur-xl">
                <h3 className={`font-display text-base font-bold text-white border-b border-slate-800 pb-3 mb-4 ${isAr ? "text-right" : "text-left"}`}>
                  {isAr ? "رفع رابط فيديو أو لقطة للجولة" : "Upload Video Link / Round Highlight"}
                </h3>
                
                <form onSubmit={handleVideoSubmit} className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-slate-300">{isAr ? "عنوان اللقطة والهدف" : "Highlight / Goal Title"}</label>
                    <input
                      type="text"
                      value={videoTitle}
                      onChange={(e) => setVideoTitle(e.target.value)}
                      placeholder={isAr ? "امثلة: هدف الأسبوع بقدم الطالب ماهر" : "e.g., Goal of the week by Maher"}
                      className={`rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500 ${isAr ? "text-right" : "text-left"}`}
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-slate-300">{isAr ? "رابط الفيديو (يوتيوب)" : "Video URL (YouTube)"}</label>
                    <input
                      type="url"
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      placeholder="https://youtube.com/watch?v=..."
                      className={`rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500 ${isAr ? "text-right" : "text-left"}`}
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-slate-300">{isAr ? "نوع تصنيف الفيديو" : "Video Category"}</label>
                    <select
                      value={videoKind}
                      onChange={(e) => setVideoKind(e.target.value as any)}
                      className={`rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-500 ${isAr ? "text-right" : "text-left"}`}
                    >
                      <option value="هدف">{isAr ? "هدف مذهل" : "Stunning Goal"}</option>
                      <option value="مهارة">{isAr ? "مهارة كروية ممتازة" : "Excellent Skill"}</option>
                      <option value="لقطة">{isAr ? "لقطة ترفيهية تفاعلية" : "Interactive Highlight"}</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="mt-3 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-400 py-3 text-xs font-extrabold text-slate-950 transition-all hover:scale-[1.02] cursor-pointer"
                  >
                    {isAr ? "رفع الفيديو للمكتبة" : "Upload Video to Library"}
                  </button>
                </form>
              </section>
            </div>
          )}
        </div>
      )}

      {activeSubTab === "voting" && (
        <div className={`grid grid-cols-1 gap-6 lg:grid-cols-2 ${isAr ? "text-right" : "text-left"}`}>
          <section className="rounded-2xl border border-sky-500/15 bg-slate-900/80 p-6 shadow-xl backdrop-blur-xl">
            <h3 className={`font-display text-base font-bold text-white border-b border-slate-800 pb-3 mb-4 ${isAr ? "text-right" : "text-left"}`}>
              {isAr ? "تصويت نجم الجولة والأسبوع لدى الطلاب والجمهور" : "Vote MVP of the Round & Week"}
            </h3>

            <div className="flex flex-col gap-3">
              {leagueTeams.length === 0 ? (
                <p className="text-center text-xs text-slate-500 py-8 font-bold">
                  {isAr ? "لم يتم تسجيل لاعبين حالياً للتصويب." : "No registered players currently available for voting."}
                </p>
              ) : (
                leagueTeams.map((team) => {
                  const playerVotes = leagueVotes.player.filter((v) => v.target === team.teamName).length;
                  return (
                    <div key={team.id} className={`flex items-center justify-between rounded-xl border border-slate-850 bg-slate-950 p-4 text-xs text-slate-200 font-bold ${isAr ? "flex-row" : "flex-row-reverse"}`}>
                      <span className="flex items-center gap-1.5">{team.teamName} ({isAr ? "مسجل" : "Registered"})</span>
                      <button
                        onClick={() => onVotePlayer(team.teamName)}
                        className="rounded-xl text-xs bg-slate-900 hover:bg-slate-850 hover:text-white border border-slate-800 hover:border-cyan-500/30 px-4 py-2 transition-all cursor-pointer"
                      >
                        {isAr ? `صوّت نجم الجولة (${playerVotes})` : `Vote MVP (${playerVotes})`}
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </section>

          <section className="rounded-2xl border border-sky-500/15 bg-slate-900/80 p-6 shadow-xl backdrop-blur-xl">
            <h3 className={`font-display text-base font-bold text-white border-b border-slate-800 pb-3 mb-4 ${isAr ? "text-right" : "text-left"}`}>
              {isAr ? "تصويت الفريق الأفضل والأقوى هذا الأسبوع" : "Vote Best and Strongest Team of the Week"}
            </h3>

            <div className="flex flex-col gap-3">
              {leagueTeams.length === 0 ? (
                <p className="text-center text-xs text-slate-500 py-8 font-bold">
                  {isAr ? "لم يتم تسجيل فرق للتصويب." : "No registered teams available for voting."}
                </p>
              ) : (
                leagueTeams.map((team) => {
                  const teamVotes = leagueVotes.team.filter((v) => v.target === team.id).length;
                  return (
                    <div key={team.id} className={`flex items-center justify-between rounded-xl border border-slate-850 bg-slate-950 p-4 text-xs text-slate-200 font-bold ${isAr ? "flex-row" : "flex-row-reverse"}`}>
                      <span>{team.teamName}</span>
                      <button
                        onClick={() => onVoteTeam(team.id)}
                        className="rounded-xl text-xs bg-slate-900 hover:bg-slate-850 hover:text-white border border-slate-800 hover:border-cyan-500/30 px-4 py-2 transition-all cursor-pointer"
                      >
                        {isAr ? `صوّت للفريق الأقوى (${teamVotes})` : `Vote Strongest (${teamVotes})`}
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
