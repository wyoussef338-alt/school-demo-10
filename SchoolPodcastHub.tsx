import React, { useState, useEffect, useRef } from "react";
import { 
  Radio, 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Volume2, 
  VolumeX, 
  Clock, 
  Sparkles, 
  Mic, 
  Tv, 
  Bookmark, 
  ChevronLeft,
  User,
  Heart,
  Calendar,
  Layers,
  ThumbsUp,
  MessageSquare
} from "lucide-react";

interface Episode {
  id: string;
  title: string;
  host: string;
  category: "morning-broadcast" | "interviews" | "sports-report" | "tech-bytes";
  duration: string;
  date: string;
  description: string;
  audioUrl?: string; // We can use simulated play using a progress interval
  likes: number;
}

export default function SchoolPodcastHub({ lang = "ar" }: { lang?: "ar" | "en" }) {
  const isAr = lang === "ar";

  const episodes: Episode[] = [
    {
      id: "ep-1",
      title: isAr ? "الإذاعة الصباحية ليوم الأحد: قيمة التسامح والانضباط الدراسي" : "Sunday Morning Broadcast: Value of Tolerance & School Discipline",
      host: isAr ? "جماعة الإعلام التربوي بالإشتراك مع منى سلامة" : "Educational Media Group with Mona Salama",
      category: "morning-broadcast",
      duration: "04:30",
      date: "2026-06-21",
      description: isAr 
        ? "افتتاحية الأسبوع بآيات بينات من الذكر الحكيم، تلاها الحديث الشريف وكلمة الصباح الفريدة حول أهمية التحصيل العلمي والأوراد الصباحية بمجمعات الصالحين."
        : "Week opener with beautiful verses from the Holy Qur'an, followed by the prophetic teaching and morning words regarding academic perseverance.",
      likes: 42
    },
    {
      id: "ep-2",
      title: isAr ? "لقاء حواري مع الفائزة بمسابقة الإعراب الكبرى - منى عبد الله" : "Interview with parsing contest winner - Mona Abdullah",
      host: isAr ? "الأستاذة جين دياب (إشراف النشاط العربي)" : "Mrs. Jane Diab (Arabic Activities Advisor)",
      category: "interviews",
      duration: "06:15",
      date: "2026-06-22",
      description: isAr 
        ? "حوار دافئ تسرد فيه الطالبة المتميزة منى قصة غرامها باللغة العربية الفصحى وأسرار تفوقها وقدرتها المدهشة على الإعراب السريع والسلس."
        : "A warm talk in which the outstanding student Mona narrates her love story with Classical Arabic and the secrets of her lightning parsing skill.",
      likes: 68
    },
    {
      id: "ep-3",
      title: isAr ? "الحفل وبطولة كأس الصالحين الكروي: كواليس وتوقعات حاسمة" : "The Match & El-Salheen Soccer Cup: Behind the scenes",
      host: isAr ? "الكابتن شريف رياض (وكيل الشئون الرياضية)" : "Captain Sherif Riad (Athletics Coordinator)",
      category: "sports-report",
      duration: "05:40",
      date: "2026-06-20",
      description: isAr 
        ? "تحليل كروي ممتع لأداء فريقي صف أول أ وثاني ب، وإجراء لقاءات فخرية غامرة مع الهدافين وتوقعات تصفيات الربع النهائي."
        : "Extremely fun analysis of the 1A and 2B match, featuring proud interviews with top scorers and quarterfinals predictions.",
      likes: 55
    },
    {
      id: "ep-4",
      title: isAr ? "ساعة الصالحين للذكاء الاصطناعي وتحديات البرمجة الواعدة" : "El-Salheen AI Hour: Promising Coding Challenges & Future Tech",
      host: isAr ? "المنشط التقني م. هاني عياد" : "Tech Mentor Eng. Hany Ayyad",
      category: "tech-bytes",
      duration: "07:10",
      date: "2026-06-19",
      description: isAr 
        ? "حلقة متميزة لتبسيط مبادئ هندسة الروبوتات والذكاء الاصطناعي وإيحاءات الطلاب لاستخدام المساعد الذكي بالأكاديمية."
        : "A marvelous episode clarifying basic robotics engineering and AI workflows, motivating students to utilize smart mentors.",
      likes: 31
    }
  ];

  const [currentEpIdx, setCurrentEpIdx] = useState(0);
  const activeEp = episodes[currentEpIdx];

  // Simulated player states
  const [isPlaying, setIsPlaying] = useState(false);
  const [progressSec, setProgressSec] = useState(0);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [likedEpisodes, setLikedEpisodes] = useState<string[]>([]);
  const [commentsMap, setCommentsMap] = useState<Record<string, string[]>>({
    "ep-1": isAr 
      ? ["ما شاء الله تلاوة عطرة وكلمة طيبة جداً من الزملاء!", "الإذاعة المدرسية اليوم كانت فوق الممتازة."]
      : ["Mashallah great reading and dynamic introduction!", "Mornings are full of blessings at this school!"],
    "ep-2": isAr 
      ? ["فخورون جداً بابنتنا الغالية منى، مثال رائع لكل الطالبات."]
      : ["Extremely proud of Mona, an exemplary student!"],
  });
  const [newComment, setNewComment] = useState("");

  const totalDurationSec = parseDurationToSeconds(activeEp.duration);

  // Interval timer for simulation
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgressSec((prev) => {
          if (prev >= totalDurationSec) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, totalDurationSec]);

  // Reset progress when active episode changes
  useEffect(() => {
    setProgressSec(0);
    setIsPlaying(false);
  }, [currentEpIdx]);

  function parseDurationToSeconds(durStr: string): number {
    const parts = durStr.split(":");
    if (parts.length === 2) {
      return parseInt(parts[0]) * 60 + parseInt(parts[1]);
    }
    return 180;
  }

  function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    setCurrentEpIdx((prev) => (prev + 1) % episodes.length);
  };

  const handlePrev = () => {
    setCurrentEpIdx((prev) => (prev - 1 + episodes.length) % episodes.length);
  };

  const handleToggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleToggleLike = (id: string) => {
    if (likedEpisodes.includes(id)) {
      setLikedEpisodes((prev) => prev.filter((x) => x !== id));
    } else {
      setLikedEpisodes((prev) => [...prev, id]);
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const key = activeEp.id;
    const currentComments = commentsMap[key] || [];
    setCommentsMap((prev) => ({
      ...prev,
      [key]: [...currentComments, newComment.trim()]
    }));
    setNewComment("");
  };

  const getCategoryTheme = (cat: string) => {
    switch (cat) {
      case "morning-broadcast":
        return { label: isAr ? "الإذاعة الصباحية" : "Morning Radio", color: "text-amber-400 bg-amber-500/10 border-amber-550/20" };
      case "interviews":
        return { label: isAr ? "حوارات وبطولات" : "Interviews & Contests", color: "text-emerald-400 bg-emerald-500/10 border-emerald-555/20" };
      case "sports-report":
        return { label: isAr ? "النشرة الرياضية" : "Sports News", color: "text-cyan-400 bg-cyan-500/10 border-cyan-555/20" };
      default:
        return { label: isAr ? "راديو التكنولوجيا" : "Tech Radio", color: "text-fuchsia-400 bg-fuchsia-500/10 border-fuchsia-555/20" };
    }
  };

  return (
    <div className={`rounded-2xl border border-rose-500/15 bg-slate-900/40 p-5 shadow-xl ${isAr ? "text-right" : "text-left"} font-sans space-y-6`} dir={isAr ? "rtl" : "ltr"}>
      
      {/* Upper header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b border-slate-800 pb-3">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5">
            <span className="inline-flex rounded-full bg-rose-500/10 px-2.5 py-0.5 text-[9px] font-black text-rose-450 uppercase leading-none">
              {isAr ? "راديو الصالحين الافتراضي" : "Salheen Virtual Radio"}
            </span>
            <span className="inline-flex rounded-full bg-indigo-500/10 px-2.5 py-0.5 text-[9px] font-black text-indigo-400 leading-none">
              {isAr ? "الإذاعة واللقاءات الحية" : "Live Broadcasts"}
            </span>
          </div>
          <h4 className="font-display text-base font-black text-white flex items-center gap-2">
            <Radio className="h-5 w-5 text-rose-400" />
            <span>{isAr ? "منصة بودكاست الصالحين واستوديو الإعلام اللقائي" : "El-Salheen Podcast & Media Center"}</span>
          </h4>
          <p className="text-[10.5px] text-slate-400">
            {isAr 
              ? "شاهد واستمع إلى تسجيلات الإذاعة المدرسية، والمقابلات التربوية الغنية مع أولياء الأمور والطلاب فرسان القمة وسجلات كأس الصالحين."
              : "Listen to the morning school radio sessions, informative interviews with pupils, and highlights of the Salheen Cup."}
          </p>
        </div>
      </div>

      {/* Main Container Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        
        {/* Left column: Embedded Media Player (styled elegantly) */}
        <div className="lg:col-span-3 rounded-2xl border border-slate-850 bg-slate-950 p-5 flex flex-col justify-between space-y-6 select-none relative overflow-hidden">
          
          {/* Subtle Ambient Red Glow */}
          <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-rose-500/5 filter blur-2xl pointer-events-none"></div>
          
          {/* Top Line Meta */}
          <div className="flex justify-between items-center z-10">
            <span className={`px-2.5 py-0.5 rounded-md border text-[9px] font-black ${getCategoryTheme(activeEp.category).color}`}>
              {getCategoryTheme(activeEp.category).label}
            </span>
            <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {activeEp.date}
            </span>
          </div>

          {/* Episode Display and Sound Wave Animation */}
          <div className="flex flex-col items-center text-center space-y-4 z-10 py-3">
            <div className="relative h-16 w-16 rounded-full bg-gradient-to-tr from-rose-500 to-indigo-500 flex items-center justify-center p-[2px] shadow-xl">
              <div className="h-full w-full rounded-full bg-slate-950 flex items-center justify-center">
                <Mic className="h-7 w-7 text-rose-400" />
              </div>
              
              {/* Spinning status ring */}
              {isPlaying && (
                <div className="absolute inset-0 rounded-full border-2 border-dashed border-[#c5a85c] animate-spin-slow"></div>
              )}
            </div>

            <div className="space-y-1 px-4">
              <h5 className="font-display text-sm font-black text-white hover:text-rose-455 transition-colors line-clamp-2">
                {activeEp.title}
              </h5>
              <span className="text-[10px] text-slate-400 font-semibold block">{activeEp.host}</span>
            </div>

            {/* Visual Dynamic Sound Wave (Simulated) */}
            <div className="flex items-center gap-1.5 h-8">
              {[8, 14, 24, 18, 10, 16, 28, 20, 12, 19, 25, 14, 8].map((val, idx) => {
                // Change height based on whether playing or paused
                const heightVal = isPlaying 
                  ? `${Math.max(4, val * (0.4 + Math.random() * 0.77))}px` 
                  : "4px";
                return (
                  <div 
                    key={idx} 
                    className="w-1 rounded-full bg-rose-500 transition-all duration-200"
                    style={{ height: heightVal }}
                  ></div>
                );
              })}
            </div>
          </div>

          {/* Player controls progression bar */}
          <div className="space-y-2 z-10">
            {/* Range bar */}
            <div className="relative h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-rose-500 to-indigo-500 transition-all duration-300 rounded-full"
                style={{ width: `${(progressSec / totalDurationSec) * 100}%` }}
              ></div>
            </div>

            <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono">
              <span>{formatTime(totalDurationSec)}</span>
              <span className="text-[#c5a85c] font-black">{isAr ? "جاري الاستماع" : "Now Listening"}</span>
              <span>{formatTime(progressSec)}</span>
            </div>
          </div>

          {/* Main Control Deck */}
          <div className="flex justify-between items-center z-10 pt-2 border-t border-slate-900">
            {/* Favorite & Share */}
            <div className="flex items-center gap-2">
              <button 
                onClick={() => handleToggleLike(activeEp.id)}
                className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                  likedEpisodes.includes(activeEp.id)
                    ? "bg-rose-500/10 border-rose-500/20 text-rose-450"
                    : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                <Heart className="h-4 w-4" fill={likedEpisodes.includes(activeEp.id) ? "currentColor" : "none"} />
              </button>
              <span className="text-[10.5px] text-slate-400 font-bold font-mono">
                {activeEp.likes + (likedEpisodes.includes(activeEp.id) ? 1 : 0)} {isAr ? "إعجاب" : "likes"}
              </span>
            </div>

            {/* Back, Play, Next */}
            <div className="flex items-center gap-3">
              <button 
                onClick={handlePrev}
                className="bg-slate-900 border border-slate-800 p-2 rounded-lg text-slate-400 hover:text-white cursor-pointer"
              >
                <SkipBack className="h-4 w-4" />
              </button>

              <button 
                onClick={handlePlayPause}
                style={{ transform: "scale(1.15)" }}
                className="bg-rose-500 hover:bg-rose-600 text-white p-3 rounded-full shadow-lg transition-transform active:scale-105 cursor-pointer flex items-center justify-center"
              >
                {isPlaying ? <Pause className="h-4 w-4" fill="currentColor" /> : <Play className="h-4 w-4" fill="currentColor" />}
              </button>

              <button 
                onClick={handleNext}
                className="bg-slate-900 border border-slate-800 p-2 rounded-lg text-slate-400 hover:text-white cursor-pointer"
              >
                <SkipForward className="h-4 w-4" />
              </button>
            </div>

            {/* Mute and volume */}
            <button 
              onClick={handleToggleMute}
              className="bg-slate-900 border border-slate-800 p-2 rounded-lg text-slate-400 hover:text-white cursor-pointer"
            >
              {isMuted ? <VolumeX className="h-4 w-4 text-rose-450" /> : <Volume2 className="h-4 w-4" />}
            </button>
          </div>

        </div>

        {/* Right column: Playlist & comments feed */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Playlist section */}
          <div className="space-y-2">
            <span className="text-[10px] text-slate-500 font-black block">{isAr ? "قائمة التسجيلات السابقة والمواضيع:" : "Previous Broadcasts & Topics:"}</span>
            
            <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
              {episodes.map((ep, idx) => {
                const isActive = idx === currentEpIdx;
                return (
                  <button
                    key={ep.id}
                    onClick={() => setCurrentEpIdx(idx)}
                    className={`w-full ${isAr ? "text-right" : "text-left"} p-2.5 rounded-xl border transition-all cursor-pointer flex justify-between gap-2.5 ${
                      isActive
                        ? "bg-rose-500/10 border-rose-500/25 text-white"
                        : "bg-slate-950/40 border-slate-900 text-slate-400 hover:text-white"
                    }`}
                  >
                    <div className={`text-[10px] text-slate-500 font-mono shrink-0 flex flex-col justify-between ${isAr ? "text-left" : "text-right"}`}>
                      <span>{ep.duration}</span>
                      {isActive && <span className="text-rose-450 font-black">{isAr ? "الآن ♪" : "Now ♪"}</span>}
                    </div>

                    <div className="space-y-0.5 text-right w-full">
                      <h6 className={`text-xs font-black line-clamp-1 ${isAr ? "text-right" : "text-left"}`}>{ep.title}</h6>
                      <span className={`text-[10px] text-slate-400 block line-clamp-1 ${isAr ? "text-right" : "text-left"}`}>{ep.host}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interactive Comments & Reflections Box */}
          <div className="rounded-xl border border-slate-900 bg-slate-950/80 p-4 space-y-3">
            <div className="flex justify-between items-center text-[10.5px] font-black">
              <span className="text-slate-400">{isAr ? "آراء وارتسامات المستمعين والآباء" : "Listener & Parent Feedback"}</span>
              <span className="text-[#c5a85c] flex items-center gap-1">
                <MessageSquare className="h-3 w-3 text-cyan-405" />
                <span>{isAr ? "تعليقات اليوم" : "Today's Comments"}</span>
              </span>
            </div>

            {/* List of comments */}
            <div className="space-y-2 max-h-[120px] overflow-y-auto pr-1">
              {(commentsMap[activeEp.id] || []).length === 0 ? (
                <p className="text-center py-4 text-[10.5px] font-bold text-slate-550 italic">
                  {isAr ? "✍️ كن أول من يعبر عن رأيه ويوحه تحية لفريق إذاعة الصالحين!" : "✍️ Be the first to share your feedback and salute the radio team!"}
                </p>
              ) : (
                (commentsMap[activeEp.id] || []).map((comm, cidx) => (
                  <div key={cidx} className={`bg-slate-900/40 border border-slate-900 p-2.5 rounded-lg text-[11px] text-slate-300 leading-relaxed ${isAr ? "text-right" : "text-left"}`}>
                    {comm}
                  </div>
                ))
              )}
            </div>

            {/* Form */}
            <form onSubmit={handleAddComment} className="flex gap-2">
              <input
                type="text"
                required
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder={isAr ? "اكتب رسالة تشجيع للطلاب..." : "Write a word of support..."}
                className="flex-1 bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white"
              />
              <button
                type="submit"
                className="bg-rose-500 hover:bg-rose-600 text-white min-w-[60px] rounded-lg text-xs font-black transition-all cursor-pointer"
              >
                {isAr ? "ارسل" : "Send"}
              </button>
            </form>
          </div>

        </div>

      </div>

    </div>
  );
}
