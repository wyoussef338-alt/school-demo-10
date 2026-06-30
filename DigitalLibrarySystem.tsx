import React, { useState, useEffect } from "react";
import { 
  BookOpen, 
  Flame, 
  Sparkles, 
  Award, 
  Send, 
  CheckCircle, 
  Clock, 
  Bookmark, 
  RotateCw, 
  ChevronLeft,
  ChevronDown,
  Book,
  Search,
  Check
} from "lucide-react";
import { db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";

interface BookItem {
  id: string;
  title: string;
  author: string;
  category: "arabic" | "heritage" | "science" | "moral" | "future" | "religion";
  description: string;
  badge: string;
  readingPoints: number;
}

interface BookSummary {
  id: string;
  bookTitle: string;
  studentName: string;
  summaryText: string;
  createdAt: string;
  earnedPoints: number;
  status: "approved";
}

export default function DigitalLibrarySystem({ 
  user, 
  onAddPoints,
  lang = "ar"
}: { 
  user?: any; 
  onAddPoints?: (pts: number, classId: string, logMsg: string) => void;
  lang?: "ar" | "en";
}) {
  const [books] = useState<BookItem[]>([
    {
      id: "b-1",
      title: "عبقريات العقاد (عبقرية محمد وعمر)",
      author: "عباس محمود العقاد",
      category: "heritage",
      description: "دراسة تاريخية وأدبية رائعة تعرض الملامح القيادية والإنسانية والعبقرية لسيد الخلق وأصحابه رضوان الله عليهم.",
      badge: "تنمية الشخصية",
      readingPoints: 20
    },
    {
      id: "b-2",
      title: "مستقبل الذكاء الاصطناعي والثورة الرقمية",
      author: "د. هاني عياد",
      category: "future",
      description: "كتاب رائع مبسط للأجيال الجديدة يشرح تاريخ تطور الذكاء الاصطناعي وكيف نصوغ مستقبل التطبيقات المفيدة لخدمة الأوطان.",
      badge: "علوم حديثة",
      readingPoints: 25
    },
    {
      id: "b-3",
      title: "العبرات والنظرات (مختارات أدبية)",
      author: "مصطفى لطفي المنفلوطي",
      category: "arabic",
      description: "من كلاسيكيات الأدب العربي المعاصر التي ترتقي بالبيان اللغوي والأسلوب الإنشائي لدى الطلاب والطالبات بشكل ممتاز.",
      badge: "أدب رفيع",
      readingPoints: 15
    },
    {
      id: "b-4",
      title: "رحلة البحث عن الكواكب البعيدة والمجرات",
      author: "وكالة الصالحين التعليمية للعلوم",
      category: "science",
      description: "دليلك المصور لرحلة خيالية ممتعة في أعماق كواكب المجموعة الشمسية والقوانين الفيزيائية التي تدير الفلك الأوسع.",
      badge: "رحلات وفلك",
      readingPoints: 20
    },
    {
      id: "b-5",
      title: "قصص الأنبياء والتوجيهات الأخلاقية العظمى",
      author: "إشراف وزارة التربية الأكاديمية",
      category: "religion",
      description: "دراسة شاملة لقصص الأنبياء والأخلاقيات الإسلامية والمبادئ السامية والعبادات والمعاملات الحميدة لبناء الهوية الواعية.",
      badge: "المنهج الإسلامي",
      readingPoints: 20
    },
    {
      id: "b-6",
      title: "التعاليم المسيحية وقيم المحبة والمواطنة السامية",
      author: "إشراف المطبوعات اللاهوتية المشتركة",
      category: "religion",
      description: "دراسة تفاعلية للوصايا الإنجيلية وتعاليم المحبة والسلام والتكافل والمسؤولية الوطنية في إطار المنهج التربوي المعتمد.",
      badge: "المنهج المسيحي",
      readingPoints: 20
    }
  ]);

  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [selectedBook, setSelectedBook] = useState<BookItem | null>(null);
  const [summaryText, setSummaryText] = useState("");
  const [streakCount, setStreakCount] = useState(user?.streak || 3);
  const [submittedSummaries, setSubmittedSummaries] = useState<BookSummary[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Load previously submitted summaries from localStorage fallback
    const localSummaries = localStorage.getItem("salheen_reading_summaries");
    if (localSummaries) {
      setSubmittedSummaries(JSON.parse(localSummaries));
    } else {
      // Seed some starting summary
      const initial: BookSummary[] = [
        {
          id: "sm-1",
          bookTitle: "عبقريات العقاد (عبقرية محمد وعمر)",
          studentName: user?.name || "منى عبد الله سلامة",
          summaryText: "استفدت من هذا الكتاب القيم بأن العبقرية والقيادة هي نتاج الذكاء العاطفي والحكمة في تدبير الأمور والنزاهة المطلقة وتحمل المسؤولية برحمة ولطف تجاه سائر أفراد المجتمع صغاراً وكباراً.",
          createdAt: "2026-06-21",
          earnedPoints: 20,
          status: "approved"
        }
      ];
      setSubmittedSummaries(initial);
      localStorage.setItem("salheen_reading_summaries", JSON.stringify(initial));
    }
  }, [user]);

  const handleSelectBook = (b: BookItem) => {
    setSelectedBook(b);
    setSummaryText("");
    setSuccessMessage(null);
  };

  const handleSubmitSummary = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBook || summaryText.trim().length < 25) {
      alert("يرجى كتابة ملخص كافٍ ومفيد قبل الإرسال (أكثر من 25 حرفاً) لتأكيد الاستفادة وجني النقاط.");
      return;
    }

    const newPts = selectedBook.readingPoints;
    const newSummary: BookSummary = {
      id: "sm-" + Date.now(),
      bookTitle: selectedBook.title,
      studentName: user?.name || "طالب الصالحين المجتهد",
      summaryText: summaryText.trim(),
      createdAt: new Date().toISOString().split("T")[0],
      earnedPoints: newPts,
      status: "approved"
    };

    // Update locally
    const updatedList = [newSummary, ...submittedSummaries];
    setSubmittedSummaries(updatedList);
    localStorage.setItem("salheen_reading_summaries", JSON.stringify(updatedList));

    // Boost Reading Streak
    const nextStreak = streakCount + 1;
    setStreakCount(nextStreak);
    
    // Update Streak and Points globally
    if (onAddPoints) {
      onAddPoints(newPts, user?.classId || "1A", `مكتبة الصالحين: تلخيص متميز لكتاب "${selectedBook.title}" ورصيد مضاعف!`);
    }

    // Save user profile state persistence in Firestore
    if (db && user?.uid) {
      try {
        await setDoc(doc(db, "users", user.uid), {
          ...user,
          points: (user.points || 0) + newPts,
          streak: nextStreak
        }, { merge: true });
      } catch (e) {
        console.warn("Could not save updated streak/points to Firestore:", e);
      }
    }

    setSuccessMessage(`تهانينا الحارة! تم قبول ملخصك العلمي وحصلت على +${newPts} نقطة فخرية، وزاد عداد استمرارية القراءة لديك بدرجة واحدة! 🔥`);
    setSummaryText("");
    setSelectedBook(null);

    setTimeout(() => {
      setSuccessMessage(null);
    }, 5000);
  };

  const isAr = lang === "ar";

  const getLocalizedBook = (b: BookItem) => {
    if (isAr) return b;
    const englishBooks: Record<string, Partial<BookItem>> = {
      "b-1": {
        title: "Al-Aqqad's Geniuses (Genius of Muhammad & Omar)",
        author: "Abbas Mahmoud Al-Aqqad",
        description: "An incredible historical and literary study presenting the leadership, human aspects, and genius of the Prophet and his companions.",
        badge: "Character Dev"
      },
      "b-2": {
        title: "Future of AI and Digital Revolution",
        author: "Dr. Hany Ayad",
        description: "An amazing, simplified book for youth explaining the history and evolution of AI, and how to shape useful modules.",
        badge: "Modern Tech"
      },
      "b-3": {
        title: "Al-Abarat & Al-Nazarat (Literary Collection)",
        author: "Mustafa Lutfi Al-Manfaluti",
        description: "Classic contemporary Arabic literature that raises style, phrasing, and eloquent expression in young students.",
        badge: "Fine Lit"
      },
      "b-4": {
        title: "The Search for Distant Planets & Galaxies",
        author: "El-Salheen Academic Space Center",
        description: "An illustrated journey through deep solar systems, space mechanics, and general astrophysics.",
        badge: "Astro STEM"
      },
      "b-5": {
        title: "Stories of the Prophets & Moral Guidance",
        author: "Academic Religious Board",
        description: "A comprehensive study of the prophets' lives, Islamic ethics, high values, and fine social principles.",
        badge: "Islamic Curriculum"
      },
      "b-6": {
        title: "Christian Ethics, Love, & Citizenship Guide",
        author: "Theological Joint Publications",
        description: "An active study of biblical values, love, peace, charity, and national responsibility under curriculum approvals.",
        badge: "Christian Curriculum"
      }
    };
    return {
      ...b,
      ...(englishBooks[b.id] || {})
    };
  };

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case "heritage": return isAr ? "إرث وتاريخ" : "Heritage & History";
      case "science": return isAr ? "علوم وتجارب" : "Science & Experiments";
      case "arabic": return isAr ? "بيان وأدب عربي" : "Arabic Literature";
      case "future": return isAr ? "مستقبل ورقميات" : "Future & Digital";
      case "religion": return isAr ? "التربية الدينية" : "Religious Education";
      default: return isAr ? "عام" : "General";
    }
  };

  const filteredBooks = books.map(getLocalizedBook).filter((b) => {
    const matchCat = activeCategory === "all" || b.category === activeCategory;
    const sTerm = searchTerm.toLowerCase();
    const matchSearch = b.title.toLowerCase().includes(sTerm) || b.author.toLowerCase().includes(sTerm) || b.description.toLowerCase().includes(sTerm);
    return matchCat && matchSearch;
  });

  return (
    <div className={`space-y-6 font-sans ${isAr ? "text-right" : "text-left"}`} dir={isAr ? "rtl" : "ltr"}>
      
      {/* READING STREAK BOARD */}
      <div className="rounded-2xl border border-rose-500/15 bg-gradient-to-r from-[#1a0b14] to-slate-950 p-5 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className={`space-y-1 text-center ${isAr ? "md:text-right" : "md:text-left"}`}>
          <span className="inline-flex rounded-full bg-rose-500/10 px-2.5 py-0.5 text-[9px] font-black text-rose-450 uppercase leading-none">
            {isAr ? "ميداليات وهج القراءة التفاعلي" : "INTERACTIVE READING GLOW BADGES"}
          </span>
          <h4 className="font-display text-sm font-black text-white flex items-center justify-center md:justify-start gap-1.5 pt-1">
            <Flame className="h-4 w-4 text-orange-500 animate-pulse" />
            <span>{isAr ? "عداد استمرارية القراءة وتحدي الملخصات اليومي" : "Reading Continuity Counter & Daily Summary Challenge"}</span>
          </h4>
          <p className="text-[10px] text-slate-400">
            {isAr 
              ? "واظب على القراءة اليومية وتلخيص كتاب واحد على الأقل كل يومين لتبقي شعلتك ملتهبة وتنافس للحصول على لقب قارئ الشهر!"
              : "Keep up with daily reading and summarize at least one book every two days to keep your reading flame lit and compete for Reader of the Month!"}
          </p>
        </div>

        {/* Visual Streak Counter */}
        <div className="flex items-center gap-3 bg-rose-500/5 px-5 py-3 rounded-2xl border border-rose-500/10 shadow-lg">
          <span className="text-2xl">🔥</span>
          <div className={isAr ? "text-right" : "text-left"}>
            <span className="text-sm font-black text-white block leading-none">{streakCount} {isAr ? "أيام مستمرة" : "Days Continuous"}</span>
            <span className="text-[9px] text-[#c5a85c] font-black uppercase">Reading Streak Level</span>
          </div>
        </div>
      </div>

      {/* SEARCH AND NAVIGATION CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Books List & Browse */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-950 p-3 rounded-xl border border-slate-900">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className={`absolute ${isAr ? "right-3" : "left-3"} top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500`} />
              <input
                type="text"
                placeholder={isAr ? "ابحث عن كتاب، كاتب، أو مجال ممتع..." : "Search for a book, author, or interesting field..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full bg-slate-900 border border-slate-800 rounded-lg p-2 ${isAr ? "pr-9 text-right" : "pl-9 text-left"} text-xs text-white`}
              />
            </div>

            {/* Categories filter list */}
            <div className="flex flex-wrap gap-1.5">
              {["all", "heritage", "future", "arabic", "science", "religion"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-[9.5px] font-black border transition-all cursor-pointer ${
                    activeCategory === cat 
                      ? "bg-rose-500/10 border-rose-500/30 text-rose-450" 
                      : "bg-slate-900 border-slate-850 text-slate-405 hover:text-white"
                  }`}
                >
                  {cat === "all" ? (isAr ? "الكل" : "All") : getCategoryLabel(cat)}
                </button>
              ))}
            </div>
          </div>

          {/* Book Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredBooks.map((b) => (
              <div 
                key={b.id} 
                className="rounded-xl border border-slate-900 hover:border-rose-500/25 bg-slate-950/40 p-4 space-y-3 transition-colors flex flex-col justify-between"
              >
                <div className="space-y-1.5">
                  <div className="flex justify-between items-start">
                    <span className="inline-block rounded bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 text-[8px] font-black text-rose-450 uppercase">
                      {b.badge}
                    </span>
                    <span className="text-[10px] text-slate-500 font-bold">{getCategoryLabel(b.category)}</span>
                  </div>
                  <h5 className="font-display text-xs font-black text-white">{b.title}</h5>
                  <span className="text-[9.5px] text-slate-405 font-bold block pt-0.5">
                    {isAr ? "المؤلف:" : "Author:"} {b.author}
                  </span>
                  <p className="text-[10.5px] text-slate-350 leading-relaxed font-semibold line-clamp-3">
                    {b.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-900 flex justify-between items-center text-[10.5px] font-bold">
                  <span className="text-[#c5a85c] inline-flex items-center gap-1 font-mono">
                    <Award className="h-3.5 w-3.5 text-[#c5a85c]" />
                    <span>+{b.readingPoints} {isAr ? "نقطة" : "pts"}</span>
                  </span>

                  <button
                    onClick={() => handleSelectBook(b)}
                    className="bg-slate-900 text-slate-250 hover:bg-rose-500/10 hover:text-rose-450 px-3.5 py-1.5 rounded-lg border border-slate-800 hover:border-rose-500/20 text-[9.5px] font-bold transition-all cursor-pointer flex items-center gap-1"
                  >
                    <span>{isAr ? "كتابة ملخص" : "Write Summary"}</span>
                    <ChevronLeft className={`h-3 w-3 ${isAr ? "" : "rotate-180"}`} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Book Summary & Submission panel */}
        <div className="rounded-2xl border border-slate-900 bg-slate-950 p-5 space-y-4">
          <BookOpen className="h-7 w-7 text-rose-400" />
          
          {selectedBook ? (
            <form onSubmit={handleSubmitSummary} className="space-y-3">
              <div className="space-y-1">
                <span className="text-[8.5px] text-[#c5a85c] font-black uppercase">
                  {isAr ? "أنت بصدد تقديم ملخص" : "SUBMITTING A SUMMARY FOR"}
                </span>
                <h5 className="font-display text-xs font-black text-white leading-relaxed">{selectedBook.title}</h5>
              </div>

              <div className="space-y-1 pt-1">
                <label className="text-[10px] font-bold text-slate-400">
                  {isAr ? "دون ملخصك الإبداعي (الفكرة الرئيسة والدروس المستفادة):" : "Write your creative summary (main idea & key lessons):"}
                </label>
                <textarea
                  required
                  rows={6}
                  value={summaryText}
                  onChange={(e) => setSummaryText(e.target.value)}
                  placeholder={isAr ? "اكتب هنا الخلاصة بأسلوبك البليغ الخاص..." : "Write your eloquent summary of this wonderful book here..."}
                  className={`w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-white resize-none ${isAr ? "text-right" : "text-left"}`}
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-rose-500 hover:bg-rose-600 text-white font-black text-xs py-2 rounded-lg flex items-center justify-center gap-1 transition-all cursor-pointer"
                >
                  <Send className="h-3 w-3" />
                  <span>{isAr ? "إرسال وتأكيد القراءة" : "Submit & Confirm Reading"}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedBook(null)}
                  className="bg-slate-900 border border-slate-800 text-slate-400 px-3 hover:text-white rounded-lg cursor-pointer text-xs"
                >
                  {isAr ? "إلغاء" : "Cancel"}
                </button>
              </div>
            </form>
          ) : (
            <div className="h-44 flex flex-col items-center justify-center text-center space-y-2 border border-dashed border-slate-850 rounded-xl p-4">
              <Book className="h-8 w-8 text-slate-600" />
              <p className="text-[10.5px] font-bold text-slate-400 leading-relaxed max-w-[200px]">
                {isAr 
                  ? "اختر أيّاً من الكتب الموصى بها في القائمة وانقر على زر \"كتابة ملخص\" لتبدأ التحدي."
                  : "Choose any of the recommended books from the list and click 'Write Summary' to begin the challenge."}
              </p>
            </div>
          )}

          {successMessage && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-lg text-emerald-400 text-center text-[10.5px] font-bold leading-relaxed">
              {successMessage}
            </div>
          )}
        </div>

      </div>

      {/* FEED OF ALREADY SUBMITTED SUMMARIES FOR INSPIRATION */}
      <section className="space-y-3 pt-3">
        <h4 className="font-display text-xs font-black text-slate-200">
          {isAr ? "ملخصات الطلاب ومشاركات نادي القراءة الفعال:" : "Student Summaries & Active Reading Club Contributions:"}
        </h4>
        
        <div className="space-y-3">
          {submittedSummaries.map((sm) => (
            <div key={sm.id} className="rounded-xl border border-slate-900 bg-slate-950/45 p-4 space-y-2">
              <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 flex-wrap gap-2">
                <span className="flex items-center gap-1 justify-end font-sans">
                  <Bookmark className="h-3.5 w-3.5 text-rose-455" />
                  <span className="text-white font-black text-xs">
                    {isAr ? "الكتاب:" : "Book:"} {sm.bookTitle}
                  </span>
                </span>
                <span>{isAr ? "تاريخ التدوين:" : "Posted:"} {sm.createdAt}</span>
              </div>

              <p className="text-xs text-slate-350 leading-relaxed font-semibold bg-slate-900/10 p-3 rounded-lg border border-slate-900">
                &quot;{sm.summaryText}&quot;
              </p>

              <div className="flex justify-between items-center text-[9px] text-[#c5a85c] font-black">
                <span className="inline-flex items-center gap-1 bg-[#c5a85c]/10 px-2.5 py-0.5 rounded-md border border-[#c5a85c]/15">
                  <Check className="h-3 w-3 text-emerald-400" />
                  <span>{isAr ? "بمراجعة وكيلة الأنشطة" : "Reviewed by Activities Office"}</span>
                </span>
                <span>
                  {isAr 
                    ? `المستفيد: (${sm.studentName}) • ${sm.earnedPoints} نقطة مضاعفة` 
                    : `Beneficiary: (${sm.studentName}) • ${sm.earnedPoints} double points`}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
