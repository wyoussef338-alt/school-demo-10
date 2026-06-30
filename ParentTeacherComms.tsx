import React, { useState, useEffect } from "react";
import { 
  MessageSquare, 
  Send, 
  Star, 
  BookOpen, 
  AlertTriangle, 
  CheckCircle, 
  UserCheck, 
  User, 
  ChevronRight, 
  Clock, 
  Bell,
  Check,
  Award
} from "lucide-react";
import { db } from "../firebase";
import { collection, doc, getDocs, setDoc, addDoc } from "firebase/firestore";

interface Reply {
  senderRole: "teacher" | "parent";
  senderName: string;
  content: string;
  createdAt: string;
}

interface CommunicationNote {
  id: string;
  studentUid: string;
  studentName: string;
  parentEmail: string;
  teacherUid: string;
  teacherName: string;
  subject: string;
  title: string;
  content: string;
  category: "academic" | "behavior" | "praise";
  createdAt: string;
  isRead: boolean;
  replies: Reply[];
}

interface ParentTeacherCommsProps {
  user: any; // Logged in user profile
  selectedClass?: string;
  classStudents?: any[];
}

export default function ParentTeacherComms({ 
  user, 
  selectedClass = "1A",
  classStudents = []
}: ParentTeacherCommsProps) {
  const [notes, setNotes] = useState<CommunicationNote[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Teacher states
  const [selectedStudentUid, setSelectedStudentUid] = useState<string>("");
  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [noteCategory, setNoteCategory] = useState<"academic" | "behavior" | "praise">("academic");
  const [teacherSendSuccess, setTeacherSendSuccess] = useState<string | null>(null);

  // Common Parent & Teacher chat state
  const [replyInputs, setReplyInputs] = useState<Record<string, string>>({});
  const [filterCategory, setFilterCategory] = useState<string>("all");

  const isTeacher = user?.role === "teacher";
  const isParent = user?.role === "parent";

  // Pre-configured seeds
  const initializeSeedComms = () => {
    const localSaved = localStorage.getItem("salheen_communications");
    if (!localSaved) {
      const demoComms: CommunicationNote[] = [
        {
          id: "comms-1",
          studentUid: "seed-student-mona",
          studentName: "منى عبد الله سلامة",
          parentEmail: "parent@salheen.edu",
          teacherUid: "mock-teacher-1",
          teacherName: "أ. محمود الكردي",
          subject: "اللغة العربية",
          title: "تميز كبير في الخط العربي والإعراب",
          content: "يسعدني جداً إبلاغكم بأن الطالبة منى قد أبلت بلاءً حسناً اليوم وتفوقت في مسابقة الإعراب الصفي وقرأت نص 'أخلاقيات الصالحين' بإلقاء متميز مريح.",
          category: "praise",
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
          isRead: false,
          replies: [
            {
              senderRole: "parent",
              senderName: "عبد الله سلامة (ولي الأمر)",
              content: "نشكركم أستاذنا الغالي على هذا الدعم والتحفيز المستمر لطلابنا الكرام.",
              createdAt: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString()
            }
          ]
        },
        {
          id: "comms-2",
          studentUid: "seed-student-yassin",
          studentName: "ياسين كريم عبد الله",
          parentEmail: "parent@salheen.edu",
          teacherUid: "mock-teacher-2",
          teacherName: "أ. سارة أحمد",
          subject: "الرياضيات المتقدمة",
          title: "ضرورة مراجعة تمارين المتراجحات",
          content: "نرجو من ولي الأمر الكريم حث الطالب ياسين على تكرار حل تمارين المتراجحات الرياضية بالمنزل قبل تقييم الرياضيات المتقدمة القادم.",
          category: "academic",
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
          isRead: true,
          replies: []
        },
        {
          id: "comms-3",
          studentUid: "seed-student-mona",
          studentName: "منى عبد الله سلامة",
          parentEmail: "parent@salheen.edu",
          teacherUid: "mock-teacher-2",
          teacherName: "أ. جين دياب",
          subject: "اللغة الإنجليزية",
          title: "سلوك تعاوني رائع وتنسيق متميز للفريق",
          content: "أظهرت الطالبة أداءً رائعاً وسلوكاً راقياً اليوم في قيادة وتوجيه مجموعتها الصفيّة خلال تحضير مشروع كابستون.",
          category: "praise",
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
          isRead: true,
          replies: []
        }
      ];
      localStorage.setItem("salheen_communications", JSON.stringify(demoComms));
    }
  };

  useEffect(() => {
    initializeSeedComms();
    loadAllComms();
  }, [user]);

  // Handle active student state inside classrooms for Teacher
  useEffect(() => {
    if (isTeacher && classStudents.length > 0 && !selectedStudentUid) {
      setSelectedStudentUid(classStudents[0].uid);
    }
  }, [isTeacher, classStudents]);

  const loadAllComms = async () => {
    setLoading(true);
    let allNotes: CommunicationNote[] = [];

    const localSaved = localStorage.getItem("salheen_communications");
    if (localSaved) {
      allNotes = JSON.parse(localSaved);
    }

    if (db) {
      try {
        const snap = await getDocs(collection(db, "communications"));
        const fetched: any[] = [];
        snap.forEach((docSnap) => {
          fetched.push(docSnap.data() as CommunicationNote);
        });
        if (fetched.length > 0) {
          allNotes = fetched;
        }
      } catch (err) {
        console.warn("Could not query communications from firestore, using local fallback:", err);
      }
    }

    // Filters depending on portal role
    if (isParent) {
      // Find matching for children
      const parentEmailLower = user?.email?.toLowerCase() || "";
      allNotes = allNotes.filter(
        (n) => n.parentEmail && n.parentEmail.toLowerCase() === parentEmailLower
      );
    } else if (isTeacher) {
      // Find created by this teacher
      allNotes = allNotes.filter((n) => n.teacherUid === user?.uid);
    } else {
      // Student matches their own uid
      allNotes = allNotes.filter((n) => n.studentUid === user?.uid);
    }

    // Sort by createdAt desc
    allNotes.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    setNotes(allNotes);
    setLoading(false);
  };

  const handleTeacherSubmitNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentUid || !noteTitle.trim() || !noteContent.trim()) return;

    setLoading(true);
    
    const matchedStudent = classStudents.find((s) => s.uid === selectedStudentUid);
    const studentName = matchedStudent ? matchedStudent.name : "طالب غير محدد";
    const parentEmail = matchedStudent?.parentEmail || "parent@salheen.edu";

    const noteId = "note-" + Date.now();
    const newNote: CommunicationNote = {
      id: noteId,
      studentUid: selectedStudentUid,
      studentName: studentName,
      parentEmail: parentEmail,
      teacherUid: user?.uid || "mock-teacher-id",
      teacherName: user?.name || "معلم المادة بالصالحين",
      subject: user?.subject || "المساق الدراسي المشترك",
      title: noteTitle.trim(),
      content: noteContent.trim(),
      category: noteCategory,
      createdAt: new Date().toISOString(),
      isRead: false,
      replies: []
    };

    // Update in local storage
    const localSaved = localStorage.getItem("salheen_communications");
    const currentList: CommunicationNote[] = localSaved ? JSON.parse(localSaved) : [];
    currentList.push(newNote);
    localStorage.setItem("salheen_communications", JSON.stringify(currentList));

    // Update in Firestore
    if (db) {
      try {
        await setDoc(doc(db, "communications", noteId), newNote);
      } catch (err) {
        console.warn("Could not write communication to Firestore:", err);
      }
    }

    setNoteTitle("");
    setNoteContent("");
    setTeacherSendSuccess("تم إرسال الملاحظة الصفيّة لولي الأمر فوراً بنجاح.");
    
    // Refresh
    loadAllComms();
    setLoading(false);

    setTimeout(() => {
      setTeacherSendSuccess(null);
    }, 4000);
  };

  // Reply to note mechanism
  const handleSendReply = async (noteId: string) => {
    const inputMsg = replyInputs[noteId];
    if (!inputMsg || !inputMsg.trim()) return;

    setLoading(true);

    const localSaved = localStorage.getItem("salheen_communications");
    const currentList: CommunicationNote[] = localSaved ? JSON.parse(localSaved) : [];

    const itemIdx = currentList.findIndex((n) => n.id === noteId);
    if (itemIdx !== -1) {
      const newReply: Reply = {
        senderRole: isTeacher ? "teacher" : "parent",
        senderName: user?.name || "مراقب وعضو مجتمعي",
        content: inputMsg.trim(),
        createdAt: new Date().toISOString()
      };

      currentList[itemIdx].replies.push(newReply);
      currentList[itemIdx].isRead = false; // reset state for notification updates

      localStorage.setItem("salheen_communications", JSON.stringify(currentList));

      // Synchronize in Firestore
      if (db) {
        try {
          await setDoc(doc(db, "communications", noteId), currentList[itemIdx]);
        } catch (err) {
          console.warn("Could not synchronize reply in Firestore:", err);
        }
      }

      setReplyInputs((prev) => ({ ...prev, [noteId]: "" }));
      loadAllComms();
    }
    setLoading(false);
  };

  const handleMarkAsRead = async (noteId: string) => {
    const localSaved = localStorage.getItem("salheen_communications");
    const currentList: CommunicationNote[] = localSaved ? JSON.parse(localSaved) : [];

    const itemIdx = currentList.findIndex((n) => n.id === noteId);
    if (itemIdx !== -1) {
      currentList[itemIdx].isRead = true;
      localStorage.setItem("salheen_communications", JSON.stringify(currentList));

      if (db) {
        try {
          await setDoc(doc(db, "communications", noteId), currentList[itemIdx]);
        } catch (err) {
          console.warn("Could not mark read in Firestore:", err);
        }
      }
      loadAllComms();
    }
  };

  // Filter notes
  const filteredNotes = notes.filter((n) => {
    if (filterCategory === "all") return true;
    return n.category === filterCategory;
  });

  // Calculate unread communications for parent
  const unreadCount = notes.filter((n) => !n.isRead && isParent).length;

  const getCategoryDetails = (cat: string) => {
    switch (cat) {
      case "praise":
        return { label: "ثناء وتفوق", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20", icon: <Star className="h-4 w-4 shrink-0 text-emerald-400" /> };
      case "behavior":
        return { label: "سلوك وتوجيه", color: "text-amber-400 bg-amber-500/10 border-amber-500/20", icon: <AlertTriangle className="h-4 w-4 shrink-0 text-amber-400" /> };
      default:
        return { label: "دراسة وتنبيه", color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/10", icon: <BookOpen className="h-4 w-4 shrink-0 text-cyan-400" /> };
    }
  };

  return (
    <div className="rounded-2xl border border-indigo-500/15 bg-slate-900/65 p-5 shadow-lg backdrop-blur-md space-y-6 text-right font-sans">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b border-slate-800 pb-3">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 justify-end md:justify-start">
            <span className="inline-flex rounded-full bg-cyan-500/10 px-2.5 py-0.5 text-[9px] font-black text-cyan-400 uppercase leading-none">
              الروابط التربوية بالصالحين
            </span>
            {isParent && unreadCount > 0 && (
              <span className="inline-flex rounded-full bg-rose-500/10 px-2.5 py-0.5 text-[9px] font-black text-rose-400 animate-pulse leading-none flex items-center gap-1">
                <Bell className="h-2.5 w-2.5" />
                <span>لديك رسائل غير مقروءة ({unreadCount})</span>
              </span>
            )}
          </div>
          <h4 className="font-display text-base font-black text-white flex items-center justify-end md:justify-start gap-2">
            <MessageSquare className="h-5 w-5 text-indigo-400" />
            <span>نظام محادثة وتواصل معلم ↔️ ولي أمر فورياً</span>
          </h4>
          <p className="text-[10px] text-slate-400">
            {isTeacher 
              ? "أرسل تنبيهات تربوية وملاحظات سلوكية فورية لأولياء الأمور للتعاون في تقويم ودعم التحصيل."
              : "تتبع توجيهات وملاحظات معلمي الصالحين فورياً، وناقشهم مباشرة عبر منصة الحوار الصفي."}
          </p>
        </div>
      </div>

      {/* RENDER FOR TEACHER: SEND INPUT FORM */}
      {isTeacher && (
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-4">
          <h5 className="text-xs font-black text-white flex items-center gap-1.5 justify-end">
            <Send className="h-3.5 w-3.5 text-amber-500" />
            <span>إرسال ملاحظة جديدة لولي أمر الطالب</span>
          </h5>

          {classStudents.length === 0 ? (
            <p className="p-4 text-center text-xs font-bold text-slate-500">
              يرجى إضافة طلاب للفصل أولاً لتتمكن من مراسلة ذويهم.
            </p>
          ) : (
            <form onSubmit={handleTeacherSubmitNote} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400">اختر الطالب المستهدف:</label>
                <select
                  value={selectedStudentUid}
                  onChange={(e) => setSelectedStudentUid(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white cursor-pointer"
                >
                  {classStudents.map((s) => (
                    <option key={s.uid} value={s.uid}>
                      {s.name} (ولي أمره: {s.parentEmail || "غير مقيد"})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400">تصنيف الملاحظة:</label>
                <select
                  value={noteCategory}
                  onChange={(e) => setNoteCategory(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white cursor-pointer"
                >
                  <option value="academic">تنبيه دراسي / تحصيل علمي</option>
                  <option value="behavior">توجيه سلوكي ومواظبة</option>
                  <option value="praise">ثناء وتكريم للتفوق الأكاديمي</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400">عنوان الملاحظة:</label>
                <input
                  type="text"
                  required
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  placeholder="مثال: مراجعة حفظ سورة البقرة"
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white"
                />
              </div>

              <div className="md:col-span-3 space-y-1">
                <label className="text-[10px] font-bold text-slate-400">المحتوى التربوي المفصل:</label>
                <textarea
                  required
                  rows={2}
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  placeholder="اكتب التوجيه الصفي هنا لدعم الشراكة المنزلية..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white resize-none"
                />
              </div>

              <div className="md:col-span-3 flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[#c5a85c] hover:bg-[#b0934d] text-slate-950 px-5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>إرسال وتنشيط الملاحظة</span>
                </button>
              </div>

            </form>
          )}

          {teacherSendSuccess && (
            <div className="bg-emerald-500/10 border border-emerald-500/25 p-3 rounded-lg text-emerald-400 text-center text-xs font-bold">
              {teacherSendSuccess}
            </div>
          )}
        </div>
      )}

      {/* FILTER BOX */}
      <div className="flex items-center justify-between border-t border-slate-850 pt-4 flex-wrap gap-3 select-none">
        <span className="text-[11px] text-slate-400 font-bold">تصفية الرسائل حسب الموضوع:</span>
        <div className="flex gap-1.5 flex-wrap">
          {[
            { id: "all", label: "جميع الرسائل والمحادثات" },
            { id: "academic", label: "دراسي وتنبيه" },
            { id: "behavior", label: "سلوك ومواظبة" },
            { id: "praise", label: "ثناء وتفوق" }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setFilterCategory(item.id)}
              className={`text-[10px] font-black px-3 py-1 rounded-lg border transition-all cursor-pointer ${
                filterCategory === item.id 
                  ? "bg-indigo-500/10 border-indigo-500/35 text-indigo-400"
                  : "bg-slate-950 border-slate-850 text-slate-400 hover:text-slate-200"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* CHAT THREADS WINDOW LIST */}
      <div className="space-y-4">
        {loading && notes.length === 0 ? (
          <p className="text-center py-6 text-xs font-bold text-slate-500 animate-pulse">جاري سحب المحادثات الصفيّة...</p>
        ) : filteredNotes.length === 0 ? (
          <p className="text-center py-8 text-xs font-bold text-slate-500 bg-slate-950/20 rounded-xl border border-slate-900 border-dashed">
            لا توجد ملاحظات أو اتصالات حالية بهذه الفئة.
          </p>
        ) : (
          <div className="space-y-4 max-h-[450px] overflow-y-auto pr-1">
            {filteredNotes.map((note) => {
              const catDetails = getCategoryDetails(note.category);
              return (
                <div 
                  key={note.id} 
                  className={`rounded-xl border p-4 space-y-4 transition-all ${
                    !note.isRead && isParent 
                      ? "border-rose-500/20 bg-slate-950/90 shadow-md ring-1 ring-rose-500/5"
                      : "border-slate-850 bg-slate-950/50"
                  }`}
                >
                  
                  {/* Message Title & Sender Info */}
                  <div className="flex justify-between items-start flex-wrap gap-2 border-b border-slate-900 pb-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className={`inline-flex rounded-md border text-[9px] font-black px-2 py-0.5 ${catDetails.color} items-center gap-1`}>
                          {catDetails.icon}
                          <span>{catDetails.label}</span>
                        </span>
                        
                        {isParent && !note.isRead && (
                          <span className="bg-rose-500/10 text-rose-450 border border-rose-500/15 text-[8px] font-black rounded px-1.5 py-0.2 animate-pulse">
                            جديد
                          </span>
                        )}

                        <span className="text-[10.5px] font-black text-[#c5a85c]">للطالب: {note.studentName}</span>
                      </div>
                      <h5 className="font-display text-xs font-black text-white">{note.title}</h5>
                    </div>

                    <div className="text-[9px] text-slate-450 font-semibold text-left space-y-0.5">
                      <div className="flex items-center gap-1 justify-end font-bold text-slate-350">
                        <User className="h-3 w-3 text-indigo-400" />
                        <span>المرسل: {note.teacherName} ({note.subject || "معلم بمعهد الصالحين"})</span>
                      </div>
                      <div className="flex items-center gap-1 justify-end font-mono">
                        <Clock className="h-3 w-3 text-slate-500" />
                        <span>{new Date(note.createdAt).toLocaleDateString("ar-EG", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
                      </div>
                    </div>
                  </div>

                  {/* Message Main Body Content */}
                  <p className="text-xs text-slate-300 font-medium leading-relaxed bg-slate-900/40 p-3 rounded-lg border border-slate-900/60">
                    {note.content}
                  </p>

                  {/* THREAD REPLIES CHAT LAYOUT */}
                  {note.replies.length > 0 && (
                    <div className="space-y-2 border-t border-slate-900/80 pt-3">
                      <span className="text-[9.5px] text-indigo-300 font-bold block">متابعة ثناية الحوار والردود:</span>
                      <div className="space-y-2">
                        {note.replies.map((reply, rIdx) => (
                          <div 
                            key={rIdx} 
                            className={`rounded-lg p-2.5 max-w-[85%] text-xs border ${
                              reply.senderRole === "parent"
                                ? "bg-emerald-500/5 border-emerald-500/10 mr-auto text-right"
                                : "bg-indigo-500/5 border-indigo-500/10 ml-auto mr-0 text-right"
                            }`}
                          >
                            <div className="flex justify-between items-center gap-4 text-[9px] text-slate-400 pb-1 mb-1 border-b border-white/5 font-semibold">
                              <span className="font-bold text-indigo-400">{reply.senderName}</span>
                              <span className="font-mono text-[8px]">{new Date(reply.createdAt).toLocaleDateString("ar-EG", { hour: "2-digit", minute: "2-digit" })}</span>
                            </div>
                            <p className="text-slate-200 font-medium">{reply.content}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* ACTION FOOTER: CONFIRM READ OR SEND REPLY */}
                  <div className="flex justify-between items-center gap-2 pt-1">
                    
                    {/* Read confirmation buttons for Parents */}
                    {isParent && !note.isRead ? (
                      <button
                        onClick={() => handleMarkAsRead(note.id)}
                        className="p-1 px-3 border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/15 cursor-pointer text-[9.5px] font-black rounded-lg transition-colors flex items-center gap-1"
                      >
                        <Check className="h-3 w-3" />
                        <span>تأكيد القراءة واستلام التوجيه</span>
                      </button>
                    ) : (
                      <div />
                    )}

                    {/* Simple inline message input */}
                    <div className="flex gap-1.5 w-full max-w-sm md:max-w-md items-center">
                      <input
                        type="text"
                        placeholder="اكتب تعقيباً لولي الأمر أو المعلم..."
                        value={replyInputs[note.id] || ""}
                        onChange={(e) => setReplyInputs((prev) => ({ ...prev, [note.id]: e.target.value }))}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleSendReply(note.id);
                          }
                        }}
                        className="bg-slate-900 border border-slate-800 rounded-lg p-1.5 px-3 text-xs text-white placeholder-slate-550 focus:border-indigo-500 outline-none w-full"
                      />
                      <button
                        onClick={() => handleSendReply(note.id)}
                        disabled={loading || !(replyInputs[note.id] && replyInputs[note.id].trim())}
                        className="bg-indigo-500 hover:bg-indigo-650 p-2 rounded-lg text-white cursor-pointer transition-colors shrink-0"
                        title="إرسال الرد"
                      >
                        <Send className="h-3.5 w-3.5" />
                      </button>
                    </div>

                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
