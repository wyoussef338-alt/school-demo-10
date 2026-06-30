import React, { useState, useEffect } from "react";
import { 
  FileText, 
  Send, 
  HelpCircle, 
  AlertCircle, 
  Info, 
  Clock, 
  CheckCircle, 
  Clipboard, 
  RefreshCw, 
  Trash2,
  ChevronDown,
  User,
  ShieldAlert,
  Sparkles
} from "lucide-react";
import { db } from "../firebase";
import { collection, doc, getDocs, setDoc, deleteDoc } from "firebase/firestore";

interface ComplaintItem {
  id: string;
  parentName: string;
  parentEmail: string;
  category: "complaint" | "suggestion" | "request";
  title: string;
  details: string;
  urgency: "normal" | "medium" | "urgent";
  date: string; // YYYY-MM-DD
  status: "pending" | "reviewing" | "resolved";
  adminReply?: string;
  updatedAt: string;
}

interface ComplaintsSystemProps {
  user: any; // Checked parent profile
}

export default function ComplaintsSystem({ user }: ComplaintsSystemProps) {
  const [complaints, setComplaints] = useState<ComplaintItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  
  // Submit Form states
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [category, setCategory] = useState<"complaint" | "suggestion" | "request">("complaint");
  const [urgency, setUrgency] = useState<"normal" | "medium" | "urgent">("normal");
  
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Administrative mock tool (to simulate school replies)
  const [showAdminPanel, setShowAdminPanel] = useState<boolean>(false);
  const [replyTextMap, setReplyTextMap] = useState<Record<string, string>>({});

  const isParent = user?.role === "parent";

  const initializeSeedComplaints = () => {
    const localSaved = localStorage.getItem("salheen_complaints");
    if (!localSaved) {
      const demoComplaints: ComplaintItem[] = [
        {
          id: "req-1",
          parentName: "عبد الله سلامة (ولي الأمر)",
          parentEmail: "parent@salheen.edu",
          category: "request",
          title: "طلب نقل الطالبة منى إلى المقعد الأمامي بالصف",
          details: "نحيطكم علماً بأن الطالبة منى تعاني من مشكلة بسيطة في ضعف النظر المؤقت وتحتاج للجلوس في المقعد الأمامي من أجل متابعة السبورة بشكل ممتاز دون إجهاد.",
          urgency: "medium",
          date: "2026-06-20",
          status: "resolved",
          adminReply: "نشكركم على إبلاغنا وتواصلكم البناء. تم إخطار الأستاذة جين دياب (رائدة الفصل) بنقل الطالبة للمقعد الأول صبيحة يوم الأحد القادم.",
          updatedAt: new Date().toISOString()
        },
        {
          id: "req-2",
          parentName: "عبد الله سلامة (ولي الأمر)",
          parentEmail: "parent@salheen.edu",
          category: "suggestion",
          title: "مقترح زراعة حوض أخضر تعريفي في الفناء الرملي للفصل ب",
          details: "نقترح تنظيم مبادرة صفيّة بيئية لغرس بعض الأزهار والرياحين في فود الزراعة الصباحي لتعويد الطلاب على رعاية النباتات والبيئة الحية المدرسية.",
          urgency: "normal",
          date: "2026-06-21",
          status: "reviewing",
          adminReply: "مقترح فريد وجميل جداً ومحب كعادة الصالحين. تم رفع الطلب لوكيل الأنشطة والأستاذ شريف كابتن الرياضة لإتاحة الفرشة الزراعية المناسبة للأطفال.",
          updatedAt: new Date().toISOString()
        }
      ];
      localStorage.setItem("salheen_complaints", JSON.stringify(demoComplaints));
    }
  };

  useEffect(() => {
    initializeSeedComplaints();
    loadAllComplaints();
  }, [user]);

  const loadAllComplaints = async () => {
    setLoading(true);
    let allItems: ComplaintItem[] = [];

    const localSaved = localStorage.getItem("salheen_complaints");
    if (localSaved) {
      allItems = JSON.parse(localSaved);
    }

    if (db) {
      try {
        const snap = await getDocs(collection(db, "complaints"));
        const fetched: ComplaintItem[] = [];
        snap.forEach((d) => {
          fetched.push(d.data() as ComplaintItem);
        });
        if (fetched.length > 0) {
          allItems = fetched;
        }
      } catch (err) {
        console.warn("Could not load complaints from Firestore, using local fallback:", err);
      }
    }

    // Filter by parent email to keep privacy intact
    if (isParent) {
      const emailLower = user?.email?.toLowerCase() || "";
      allItems = allItems.filter((item) => item.parentEmail && item.parentEmail.toLowerCase() === emailLower);
    }

    // Order by date desc
    allItems.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    setComplaints(allItems);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !details.trim()) return;

    setLoading(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    const complaintId = "cmp-" + Date.now();
    const todayStr = new Date().toISOString().split("T")[0];

    const newComplaint: ComplaintItem = {
      id: complaintId,
      parentName: user?.name || "ولي أمر الطالب بالصالحين",
      parentEmail: user?.email || "parent@salheen.edu",
      category: category,
      title: title.trim(),
      details: details.trim(),
      urgency: urgency,
      date: todayStr,
      status: "pending",
      updatedAt: new Date().toISOString()
    };

    // Update Local Registry Fallback
    const localSaved = localStorage.getItem("salheen_complaints");
    const currentList: ComplaintItem[] = localSaved ? JSON.parse(localSaved) : [];
    currentList.push(newComplaint);
    localStorage.setItem("salheen_complaints", JSON.stringify(currentList));

    // Update in Firestore
    if (db) {
      try {
        await setDoc(doc(db, "complaints", complaintId), newComplaint);
      } catch (err) {
        console.warn("Could not save complaint to Firestore:", err);
      }
    }

    setTitle("");
    setDetails("");
    setSuccessMsg("تم تسجيل عريضتكم الرسمية وإرسالها لإدارة مجمع الصالحين بنجاح. تتبع حالة المراجعة أسفله.");
    
    loadAllComplaints();
    setLoading(false);

    setTimeout(() => {
      setSuccessMsg(null);
    }, 4500);
  };

  const handleDeleteComplaint = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف الطلب / المقترح المقدم؟")) return;

    setLoading(true);
    const localSaved = localStorage.getItem("salheen_complaints");
    if (localSaved) {
      const currentList: ComplaintItem[] = JSON.parse(localSaved);
      const filtered = currentList.filter((item) => item.id !== id);
      localStorage.setItem("salheen_complaints", JSON.stringify(filtered));
    }

    if (db) {
      try {
        await deleteDoc(doc(db, "complaints", id));
      } catch (err) {
        console.warn("Could not delete from Firestore:", err);
      }
    }

    loadAllComplaints();
    setLoading(false);
  };

  // Administrative simulator controls
  const handleUpdateStatusAndReplyByAdmin = async (id: string, newStatus: "pending" | "reviewing" | "resolved") => {
    const replyText = replyTextMap[id] || "";
    setLoading(true);

    const localSaved = localStorage.getItem("salheen_complaints");
    const currentList: ComplaintItem[] = localSaved ? JSON.parse(localSaved) : [];

    const itemIdx = currentList.findIndex((item) => item.id === id);
    if (itemIdx !== -1) {
      currentList[itemIdx].status = newStatus;
      if (replyText.trim()) {
        currentList[itemIdx].adminReply = replyText.trim();
      }
      currentList[itemIdx].updatedAt = new Date().toISOString();

      localStorage.setItem("salheen_complaints", JSON.stringify(currentList));

      if (db) {
        try {
          await setDoc(doc(db, "complaints", id), currentList[itemIdx]);
        } catch (err) {
          console.warn("Could not update reply in Firestore:", err);
        }
      }

      setReplyTextMap((prev) => ({ ...prev, [id]: "" }));
      loadAllComplaints();
    }
    setLoading(false);
  };

  const getCategoryDetails = (cat: string) => {
    switch (cat) {
      case "complaint":
        return { label: "شكوى إدارية", color: "text-rose-400 bg-rose-500/10 border-rose-500/20", icon: <AlertCircle className="h-4 w-4 shrink-0 text-rose-450" /> };
      case "suggestion":
        return { label: "مقترح تربوي", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20", icon: <Sparkles className="h-4 w-4 shrink-0 text-emerald-400" /> };
      default:
        return { label: "طلب رسمي للمشرف المالي", color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20", icon: <Clipboard className="h-4 w-4 shrink-0 text-cyan-400" /> };
    }
  };

  const getStatusDetails = (stat: string) => {
    switch (stat) {
      case "resolved":
        return { label: "تم الحل والمعالجة", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20", progress: 100 };
      case "reviewing":
        return { label: "تحت الدراسة والمحاورة", color: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20", progress: 50 };
      default:
        return { label: "قيد الملاحظة والانتظار", color: "text-slate-400 bg-slate-950 border-slate-800", progress: 15 };
    }
  };

  const getUrgencyDetails = (urg: string) => {
    switch (urg) {
      case "urgent":
        return "العجلة: عاجل جداً وطارئ";
      case "medium":
        return "العجلة: متوسطة الأولوية";
      default:
        return "العجلة: طلب اعتيادي بتمهل";
    }
  };

  return (
    <div className="rounded-2xl border border-indigo-500/15 bg-slate-900/65 p-5 shadow-lg backdrop-blur-md space-y-6 text-right font-sans">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b border-slate-800 pb-3">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 justify-end md:justify-start">
            <span className="inline-flex rounded-full bg-indigo-500/10 px-2.5 py-0.5 text-[9px] font-black text-indigo-400 uppercase leading-none">
              حماية الاتصال المدرسي
            </span>
            <span className="inline-flex rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[9px] font-black text-emerald-400 leading-none">
              مركز الاتصال بالإدارة العامة
            </span>
          </div>
          <h4 className="font-display text-base font-black text-white flex items-center justify-end md:justify-start gap-2">
            <FileText className="h-5 w-5 text-indigo-400" />
            <span>بوابة المقترحات والشكاوى الرسمية لمجلس الصالحين</span>
          </h4>
          <p className="text-[10px] text-slate-400">
            أداة تفاعلية سرية مخصصة لأولياء الأمور لرفع الالتماسات، الشكاوى الإدارية، أو المقترحات التربوية لتصل مباشرة إلى الهيئة العامة للإدارة ومراقبتها.
          </p>
        </div>
      </div>

      {/* COMPLAINTS SUBMISSION FORM */}
      <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-4">
        <h5 className="text-xs font-black text-white flex items-center gap-2 justify-end">
          <Send className="h-3.5 w-3.5 text-[#c5a85c]" />
          <span>تقديم شكوى، مقترح، أو طلب رسمي لإدارة مجمع الصالحين</span>
        </h5>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400">نوع المعروض الإداري:</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white cursor-pointer"
            >
              <option value="complaint">شكوى إدارية (قضايا الفصل / المعاملة)</option>
              <option value="suggestion">مقترح تربوي (تطوير الأنشطة أو المناهج)</option>
              <option value="request">طلب رسمي (نقل فصل / إعفاء / شئون مالية)</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400">مستوى الاستعجال التربوي:</label>
            <select
              value={urgency}
              onChange={(e) => setUrgency(e.target.value as any)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white cursor-pointer"
            >
              <option value="normal">عادي / روتيني</option>
              <option value="medium">متوسط الاستعجال</option>
              <option value="urgent">عاجل ومقلق للغاية</option>
            </select>
          </div>

          <div className="md:col-span-2 space-y-1">
            <label className="text-[10px] font-bold text-slate-400">عنوان المعروض بإيجاز:</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="مثال: التماس لتخفيف الحمولة المدرسية الصباحية للفصل أول أ"
              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white"
            />
          </div>

          <div className="md:col-span-2 space-y-1">
            <label className="text-[10px] font-bold text-slate-400">تفاصيل المعروض والمشروحات:</label>
            <textarea
              required
              rows={3}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="يرجى كتابة شرح كامل وتحديد أسماء الطلاب إذا لزم الأمر في هذا الجزء السري..."
              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white resize-none"
            />
          </div>

          <div className="md:col-span-2 flex justify-between items-center pt-2">
            <span className="text-[9px] text-slate-550 leading-relaxed font-semibold max-w-sm">
              * بمجرد الضغط على إرسال، تتحول عريضتكم إلى صف المراجعة لتكليف المفتش التربوي المناسب ومباشرة أعمال الإشراف والرد.
            </span>
            <button
              type="submit"
              disabled={loading}
              className="bg-[#c5a85c] hover:bg-[#b0934d] text-slate-950 px-5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Send className="h-3 w-3" />
              <span>تقديم الالتماس للإدارة</span>
            </button>
          </div>

        </form>

        {successMsg && (
          <div className="bg-emerald-500/10 border border-emerald-500/25 p-3 rounded-lg text-emerald-400 text-center text-xs font-bold font-sans">
            {successMsg}
          </div>
        )}
      </div>

      {/* LIST OF PREVIOUSLY SUBMITTED COMPLAINTS */}
      <div className="space-y-4">
        <div className="flex justify-between items-center border-t border-slate-850 pt-4">
          <button
            onClick={() => setShowAdminPanel(!showAdminPanel)}
            className="text-[9.5px] font-black text-[#c5a85c] flex items-center gap-1 bg-[#c5a85c]/5 hover:bg-[#c5a85c]/10 px-2.5 py-1 rounded-md border border-[#c5a85c]/10 cursor-pointer"
          >
            <ShieldAlert className="h-3 w-3" />
            <span>محاكي هيئة الرقابة الإدارية (تلقي ورد الإدارة)</span>
          </button>
          <h5 className="text-xs font-black text-slate-350">
            سجل المقترحات والتماسات معالجة الشكاوى السابقة:
          </h5>
        </div>

        {loading && complaints.length === 0 ? (
          <p className="text-center py-6 text-xs text-slate-500 animate-pulse">جاري جلب السجلات والقرارات الصادرة...</p>
        ) : complaints.length === 0 ? (
          <p className="text-center py-8 text-xs font-bold text-slate-500 bg-slate-950/20 rounded-xl border border-slate-900">
            لم تقم بتقديم أي مقترح أو شكوى إدارية بعد. نحن دائماً نسعد باستقبال رسائلكم وتوجيهاتكم البناءة.
          </p>
        ) : (
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
            {complaints.map((item) => {
              const catObj = getCategoryDetails(item.category);
              const statObj = getStatusDetails(item.status);
              return (
                <div key={item.id} className="rounded-xl border border-slate-850 bg-slate-950/50 p-4 space-y-3 transition-colors hover:border-slate-800">
                  
                  {/* Item Top line info */}
                  <div className="flex justify-between items-start flex-wrap gap-2 pb-2 border-b border-slate-900">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex rounded-md border text-[9px] font-black px-2 py-0.5 ${catObj.color} gap-1 items-center`}>
                          {catObj.icon}
                          <span>{catObj.label}</span>
                        </span>
                        
                        <span className="text-[9.5px] text-slate-500 font-bold">{getUrgencyDetails(item.urgency)}</span>
                      </div>
                      <h6 className="font-display text-xs font-black text-white">{item.title}</h6>
                    </div>

                    <div className="text-left space-y-0.5 text-[9px] text-slate-500 font-mono">
                      <span>تاريخ التقديم: {item.date}</span>
                      <div className="flex items-center gap-1 justify-end font-sans font-bold text-slate-400">
                        <Clock className="h-3 w-3 text-cyan-400" />
                        <span>كود: {item.id}</span>
                      </div>
                    </div>
                  </div>

                  {/* Details Body */}
                  <div className="space-y-2">
                    <span className="text-[10px] text-[#c5a85c] font-black block">نص المعروض المقدم:</span>
                    <p className="text-xs text-slate-300 font-medium leading-relaxed bg-slate-900/40 p-3 rounded-lg border border-slate-900/60">
                      {item.details}
                    </p>
                  </div>

                  {/* Resolution and Tracking Progress Bar */}
                  <div className="space-y-1.5 py-1">
                    <div className="flex justify-between items-center text-[10px] font-bold">
                      <span className="text-slate-400">مستوى سير المراجعة القانونية</span>
                      <span className={`px-2 py-0.5 rounded-md border font-black text-[9px] ${statObj.color}`}>{statObj.label}</span>
                    </div>
                    {/* Visual Progress Bar UI */}
                    <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 transition-all duration-500 rounded-full"
                        style={{ width: `${statObj.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* OFFICIAL ADMIN SEED REPLY PANEL */}
                  {item.adminReply ? (
                    <div className="rounded-lg bg-[#c5a85c]/5 border border-[#c5a85c]/10 p-3 space-y-1.5 relative overflow-hidden">
                      <div className="absolute top-0 left-0 bg-[#c5a85c]/10 text-[#c5a85c] text-[8px] font-black font-sans px-2.5 py-0.5 rounded-br-md">
                        قرار الإدارة والحل
                      </div>
                      <div className="flex items-center gap-1 text-xs font-black text-white">
                        <CheckCircle className="h-4 w-4 text-emerald-400" />
                        <span>توجيهات هيئة الإشراف العام بمجمع الصالحين:</span>
                      </div>
                      <p className="text-xs text-[#c5a85c] font-medium leading-relaxed pl-1">
                        {item.adminReply}
                      </p>
                    </div>
                  ) : (
                    <div className="rounded-lg bg-slate-900 border border-slate-850 p-3 text-center text-[10.5px] text-slate-450 font-bold">
                      ✍️ الالتماس قيد البحث والتدقيق حالياً بأمانة السر الإدارية لمجمع لغات الصالحين.
                    </div>
                  )}

                  {/* DELETE IF UNRESOLVED */}
                  {item.status === "pending" && (
                    <div className="flex justify-start">
                      <button
                        onClick={() => handleDeleteComplaint(item.id)}
                        className="text-rose-450 hover:text-rose-300 text-[10px] font-bold flex items-center gap-1 px-2.5 py-1.5 bg-rose-500/5 hover:bg-rose-500/10 border border-rose-500/10 rounded-lg cursor-pointer transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>سحب الالتماس وإلغاؤه</span>
                      </button>
                    </div>
                  )}

                  {/* MOCK ADMIN SIMULATION TOOLS PANEL */}
                  {showAdminPanel && (
                    <div className="bg-slate-900 border border-yellow-500/10 rounded-xl p-3 space-y-3 mt-3">
                      <div className="text-[10px] font-black text-yellow-405 flex items-center gap-1">
                        <ShieldAlert className="h-3.5 w-3.5" />
                        <span>محاكاة رد الإدارة المدرسية على هذه العريضة (لغايات المراجعة والترويج):</span>
                      </div>
                      
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[9px] font-bold text-slate-400">نص التوجيه الإداري الصادر:</label>
                        <textarea
                          rows={2}
                          placeholder="اكتب رد وصلاحيات الإدارة هنا لدراستها وملاحظتها..."
                          value={replyTextMap[item.id] || ""}
                          onChange={(e) => setReplyTextMap((prev) => ({ ...prev, [item.id]: e.target.value }))}
                          className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white resize-none"
                        />
                      </div>

                      <div className="flex justify-end gap-2 text-[10px]">
                        <button
                          onClick={() => handleUpdateStatusAndReplyByAdmin(item.id, "reviewing")}
                          className="px-3 py-1.5 rounded bg-yellow-500/10 border border-yellow-500/25 text-yellow-450 font-black cursor-pointer"
                        >
                          ضع قيد المعالجة (Under Review)
                        </button>
                        <button
                          onClick={() => handleUpdateStatusAndReplyByAdmin(item.id, "resolved")}
                          className="px-3 py-1.5 rounded bg-emerald-500/10 border border-emerald-500/25 text-emerald-450 font-black cursor-pointer"
                        >
                          اعتماد الحل والرد (Approve Solution)
                        </button>
                      </div>
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
