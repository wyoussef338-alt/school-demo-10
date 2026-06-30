import { useState } from "react";
import { motion } from "motion/react";
import { Trophy, Compass, Award, Calendar, Sparkles, MapPin, Users, Flame, Radio } from "lucide-react";
import SoccerLeague from "./SoccerLeague";
import SchoolPodcastHub from "./SchoolPodcastHub";

interface ExtracurricularsPageProps {
  user: any;
  leagueTeams: any[];
  leagueMatches: any[];
  leagueVideos: any[];
  leagueVotes: any;
  onRegisterTeam: (teamData: any) => Promise<void>;
  onRemoveTeam: (teamId: string) => Promise<void>;
  onAddMatch: (matchData: any) => Promise<void>;
  onAddVideo: (videoData: any) => Promise<void>;
  onVotePlayer: (target: string) => Promise<void>;
  onVoteTeam: (target: string) => Promise<void>;
  joinedClubs: string[];
  onJoinClub: (club: string) => void;
  lang?: "ar" | "en";
}

export default function ExtracurricularsPage({
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
  joinedClubs,
  onJoinClub,
  lang = "ar",
}: ExtracurricularsPageProps) {
  const [currentSection, setCurrentSection] = useState("league");
  const isAr = lang === "ar";

  const sections = [
    { id: "league", label: isAr ? "دوري الصالحين الرياضي" : "El-Salheen Sports League", icon: Trophy },
    { id: "clubs", label: isAr ? "النوادي الطلابية والأنشطة الإبداعية" : "Student Clubs & Creative Life", icon: Compass },
    { id: "events", label: isAr ? "أجندة الفعاليات القادمة بملاعب المدرسة" : "Upcoming School Field Events", icon: Calendar },
    { id: "podcast", label: isAr ? "راديو وعروض بودكاست الصالحين" : "Salheen Live Radio & Podcasts", icon: Radio },
  ];

  return (
    <div className={`space-y-8 animate-fade-in ${isAr ? "text-right" : "text-left"}`} dir={isAr ? "rtl" : "ltr"}>
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center border-b border-slate-900 pb-5 gap-3">
        <div>
          <span className="inline-flex rounded-full bg-cyan-500/10 px-3 py-1 text-[10px] font-black text-cyan-405 uppercase tracking-wider">
            {isAr ? "الريادة والأخلاق الرياضية" : "Leadership & Sports Ethics"}
          </span>
          <h2 className="font-display text-2xl font-black text-white">
            {isAr ? "الأنشطة الإضافية والمسابقات المدرسية" : "Extracurricular Activities & Competitions"}
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

      {currentSection === "league" && (
        <SoccerLeague
          user={user}
          leagueTeams={leagueTeams}
          leagueMatches={leagueMatches}
          leagueVideos={leagueVideos}
          leagueVotes={leagueVotes}
          onRegisterTeam={onRegisterTeam}
          onRemoveTeam={onRemoveTeam}
          onAddMatch={onAddMatch}
          onAddVideo={onAddVideo}
          onVotePlayer={onVotePlayer}
          onVoteTeam={onVoteTeam}
          lang={lang}
        />
      )}

      {currentSection === "clubs" && (
        <div className="space-y-8 animate-fade-in">
          <div className="space-y-2">
            <h3 className="font-display text-lg font-black text-white">
              {isAr ? "انضم للنوادي وابدأ في تجميع النقاط الأكاديمية!" : "Join Clubs & Earn Academic Points!"}
            </h3>
            <p className="text-xs text-slate-400">
              {isAr 
                ? "انضمامك لبرامج الأنشطة يزيد من نقاطك ونقاط فصلك الكلية، كما يرفع رتبتك الأكاديمية بالصالحين."
                : "Your participation in activity clubs boosts your standing and points, helping you level up your academic rank."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                id: "robot",
                name: isAr ? "نادي الروبوت وتطوير البرامج والمواقع والمشكلات" : "Robotics, Software & Web Development Club",
                desc: isAr 
                  ? "تعلم أسس البرمجة المنطقية، وبناء روبوتات تعليمية باستخدام لوحات الأردوينو والمشاركة بمسابقات مدارس الجمهورية."
                  : "Learn foundational logic programming, construct educational robots using Arduino kits, and take part in national school tournaments.",
                category: isAr ? "تكنولوجيا وإبداع" : "Tech & Dev",
                reward: isAr ? "+10 نقاط" : "+10 Points",
                icon: Sparkles
              },
              {
                id: "media",
                name: isAr ? "نادي الصحافة المدرسية والتصوير وتوثيق المباريات" : "School Journalism, Photography & Media Club",
                desc: isAr 
                  ? "تغطية وعمل التقارير الصحفية لكافة الفعاليات المدرسية وعمل الفيدوهات لساحات وملاعب دوري الصالحين الكروي."
                  : "Cover and write reports for all school events, produce video updates for the dynamic El-Salheen Soccer League.",
                category: isAr ? "إعلام وتواصل" : "Media & Communication",
                reward: isAr ? "+10 نقاط" : "+10 Points",
                icon: Trophy
              },
              {
                id: "green",
                name: isAr ? "نادي الابتكار وحماية المنظومة البيئية المدرسية" : "Eco-Friendly Innovation & Conservation Club",
                desc: isAr 
                  ? "مشاريع زراعة الأحواض بالفناء، وإعادة تدوير المخلفات داخل مدرستنا ونشر ثقافة التوفير والحفاظ على طاقة الفصول."
                  : "Engage in courtyard planting projects, direct recycling initiatives within our school, and cultivate power conservation habits in classes.",
                category: isAr ? "بيئة ومجتمع" : "Eco & Society",
                reward: isAr ? "+10 نقاط" : "+10 Points",
                icon: Compass
              }
            ].map((club) => {
              const isJoined = joinedClubs.includes(club.id);
              const Icon = club.icon;
              return (
                <div key={club.id} className="rounded-2xl border border-slate-900 bg-slate-950/40 p-6 flex flex-col justify-between hover:border-cyan-500/10 transition-all shadow-xl">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold text-cyan-405 bg-cyan-500/10 px-2.5 py-1 rounded-lg">
                        {club.category}
                      </span>
                      <span className="text-[10px] font-bold text-amber-400 flex items-center gap-1">
                        <Flame className="h-3 w-3" />
                        {club.reward}
                      </span>
                    </div>

                    <h4 className="font-display text-sm font-black text-white leading-snug">{club.name}</h4>
                    <p className="text-xs text-slate-400 leading-relaxed font-semibold">{club.desc}</p>
                  </div>

                  <button
                    disabled={isJoined}
                    onClick={() => onJoinClub(club.id)}
                    className={`mt-6 w-full py-3 rounded-xl font-display text-xs font-black transition-all cursor-pointer ${
                      isJoined
                        ? "bg-cyan-500/10 text-cyan-350 border border-cyan-500/20"
                        : "bg-slate-900 border border-slate-800 hover:border-cyan-500/30 text-white hover:bg-slate-800"
                    }`}
                  >
                    {isAr ? (isJoined ? "مشترك بالنادي بالفعل ✓" : "انضم الآن للنشاط") : (isJoined ? "Already Joined Club ✓" : "Join Club Now")}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {currentSection === "events" && (
        <div className="space-y-6 animate-fade-in max-w-4xl">
          <div className="space-y-1">
            <h3 className="font-display text-lg font-extrabold text-white">
              {isAr ? "أجندة الفعاليات والمواعيد القريبة" : "Events & Upcoming Schedule"}
            </h3>
            <p className="text-xs text-slate-400">
              {isAr ? "احجز مكانك كمشارك أو مشجع في الأنشطة المدرسية القادمة!" : "Book your spot as a participant or fan in upcoming school activities!"}
            </p>
          </div>

          <div className="grid gap-4">
            {[
              {
                title: isAr ? "مباراة الكلاسيكو لصف رابعة ابتدائي (الأول أ ضد الثاني ب)" : "Elementary Grade 4 El-Clásico Match (1A vs 2B)",
                desc: isAr ? "الجولة الأولى من بطولة دوري الصالحين التنشيطية في كرة القدم لعام 2026." : "The opening round of the El-Salheen soccer tournament for year 2026.",
                time: isAr ? "الاثنين المقبل • الساعة 11:30 صباحاً" : "Next Monday • 11:30 AM",
                loc: isAr ? "الملعب الأخضر الرئيسي بالفناء " : "Active Main Green Field"
              },
              {
                title: isAr ? "التصفيات ربع السنوية لمسابقة الروبوت والعلوم المدرسية" : "Quarterly Robotics & Sciences Exhibition",
                desc: isAr ? "عرض المشاريع الابتكارية وكابستون الذكاء أمام الموجهين ومدرسي الحاسب." : "Display school innovative projects and capstone AI creations to computer science advisors.",
                time: isAr ? "الخميس المقبل • الساعة 10:00 صباحاً" : "Next Thursday • 10:00 AM",
                loc: isAr ? "قاعة العرض والمؤتمرات بالطابق الثالث" : "3rd Floor Conference & Showcase Hall"
              },
              {
                title: isAr ? "الحفل التكريمي لفرسان الأخلاق والفصول الأعلى في لوحة الشرف" : "Honor Roll & Good Ethics Celebration",
                desc: isAr ? "بحضور أولياء الأمور لتشجيع الطلاب الفائزين بنقاط وميداليات التميز والتعلم." : "Attended by parents to honor and encourage students who earned top scores and medals.",
                time: isAr ? "الأحد 28 يونيو • الساعة 09:30 صباحاً" : "Sunday June 28 • 09:30 AM",
                loc: isAr ? "المسرح الرئيسي المفتوح" : "Main Open Stage Theatre"
              }
            ].map((eve, idx) => (
              <div key={idx} className="rounded-xl border border-slate-900 bg-slate-950/40 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-2">
                  <h4 className="font-display text-sm font-bold text-white">{eve.title}</h4>
                  <p className="text-xs text-slate-400 font-semibold">{eve.desc}</p>
                </div>
                <div className={`flex flex-col gap-1 text-[10px] ${isAr ? "text-right md:text-left border-r pr-4" : "text-left md:text-right border-l pl-4"} min-w-[200px] border-t md:border-t-0 border-slate-900 pt-3 md:pt-0`}>
                  <span className="font-bold text-cyan-400">{eve.time}</span>
                  <span className={`text-slate-450 font-bold flex items-center ${isAr ? "md:justify-end" : "md:justify-start"} gap-1 mt-1`}>
                    <MapPin className="h-3 w-3 text-cyan-450" />
                    {eve.loc}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {currentSection === "podcast" && (
        <SchoolPodcastHub lang={lang} />
      )}
    </div>
  );
}
