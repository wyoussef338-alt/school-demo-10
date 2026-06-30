import { useState, useEffect } from "react";
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Calendar, 
  Users, 
  Sparkles, 
  CheckCheck,
  Percent,
  RefreshCw,
  TrendingUp,
  UserCheck
} from "lucide-react";
import { db } from "../firebase";
import { collection, doc, getDocs, setDoc, query, where, writeBatch } from "firebase/firestore";

interface Student {
  uid: string;
  name: string;
  nationalId: string;
  classId: string;
  points?: number;
}

interface AttendanceRecord {
  uid: string; // studentUid + "_" + date
  studentUid: string;
  studentName: string;
  classId: string;
  date: string; // YYYY-MM-DD
  status: "present" | "absent" | "late";
  updatedAt: string;
}

interface AttendanceSystemProps {
  currentClassId: string;
  teacherUid?: string;
  teacherName?: string;
  isParentView?: boolean;
  parentTrackedChildren?: any[];
}

export default function AttendanceSystem({ 
  currentClassId, 
  teacherUid = "mock-teacher", 
  teacherName = "منسق القسم",
  isParentView = false,
  parentTrackedChildren = []
}: AttendanceSystemProps) {
  // Common states
  const [date, setDate] = useState<string>(() => {
    const today = new Date();
    // Offset for local timezone representation YYYY-MM-DD
    const offset = today.getTimezoneOffset();
    const localDate = new Date(today.getTime() - (offset * 60 * 1000));
    return localDate.toISOString().split("T")[0];
  });
  
  const [students, setStudents] = useState<Student[]>([]);
  const [attendanceMap, setAttendanceMap] = useState<Record<string, "present" | "absent" | "late">>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  // States for Parent View
  const [selectedChildUid, setSelectedChildUid] = useState<string>("");
  const [childHistory, setChildHistory] = useState<AttendanceRecord[]>([]);

  // Seed demo data for local persistence fallback
  const initializeSeedAttendance = () => {
    const localSaved = localStorage.getItem("salheen_attendance");
    if (!localSaved) {
      const demoRecords: AttendanceRecord[] = [
        {
          uid: "seed-student-mona_2026-06-21",
          studentUid: "seed-student-mona",
          studentName: "منى عبد الله سلامة",
          classId: "1A",
          date: "2026-06-21",
          status: "present",
          updatedAt: new Date().toISOString()
        },
        {
          uid: "seed-student-yassin_2026-06-21",
          studentUid: "seed-student-yassin",
          studentName: "ياسين كريم عبد الله",
          classId: "2A",
          date: "2026-06-21",
          status: "present",
          updatedAt: new Date().toISOString()
        },
        {
          uid: "seed-student-mona_2026-06-20",
          studentUid: "seed-student-mona",
          studentName: "منى عبد الله سلامة",
          classId: "1A",
          date: "2026-06-20",
          status: "present",
          updatedAt: new Date().toISOString()
        },
        {
          uid: "seed-student-yassin_2026-06-20",
          studentUid: "seed-student-yassin",
          studentName: "ياسين كريم عبد الله",
          classId: "2A",
          date: "2026-06-20",
          status: "late",
          updatedAt: new Date().toISOString()
        },
        {
          uid: "seed-student-mona_2026-06-19",
          studentUid: "seed-student-mona",
          studentName: "منى عبد الله سلامة",
          classId: "1A",
          date: "2026-06-19",
          status: "absent",
          updatedAt: new Date().toISOString()
        }
      ];
      localStorage.setItem("salheen_attendance", JSON.stringify(demoRecords));
    }
  };

  useEffect(() => {
    initializeSeedAttendance();
  }, []);

  // Set default selected child for parent view
  useEffect(() => {
    if (isParentView && parentTrackedChildren.length > 0 && !selectedChildUid) {
      setSelectedChildUid(parentTrackedChildren[0].uid || parentTrackedChildren[0].nationalId);
    }
  }, [isParentView, parentTrackedChildren, selectedChildUid]);

  // Load Students list for Teacher
  useEffect(() => {
    if (!isParentView) {
      loadClassStudents();
    }
  }, [currentClassId, isParentView]);

  // Load Today's Attendance for Teacher or History for Parent
  useEffect(() => {
    if (isParentView) {
      if (selectedChildUid) {
        loadChildHistory();
      }
    } else {
      loadTodayAttendance();
    }
  }, [date, currentClassId, selectedChildUid, isParentView]);

  const loadClassStudents = async () => {
    const local = localStorage.getItem("salheen_all_registered");
    let allUsers = local ? JSON.parse(local) : [];

    if (db) {
      try {
        const snap = await getDocs(collection(db, "users"));
        const fetched: any[] = [];
        snap.forEach((d) => {
          const u = d.data();
          if (u.role === "student") {
            fetched.push(u);
          }
        });
        if (fetched.length > 0) {
          allUsers = fetched;
        }
      } catch (err) {
        console.warn("Could not fetch users for attendance, using local storage:", err);
      }
    }

    const filtered = allUsers.filter((u: any) => u.classId === currentClassId);
    setStudents(filtered);
  };

  const loadTodayAttendance = async () => {
    setLoading(true);
    // Initialize map with "present" default to make quick registration easier
    const initialMap: Record<string, "present" | "absent" | "late"> = {};
    
    // First, load from local storage
    const localRecords = localStorage.getItem("salheen_attendance");
    if (localRecords) {
      const records: AttendanceRecord[] = JSON.parse(localRecords);
      records.forEach((rec) => {
        if (rec.classId === currentClassId && rec.date === date) {
          initialMap[rec.studentUid] = rec.status;
        }
      });
    }

    // Attempt to load from firestore
    if (db) {
      try {
        const snap = await getDocs(collection(db, "attendance"));
        snap.forEach((docSnap) => {
          const rec = docSnap.data() as AttendanceRecord;
          if (rec.classId === currentClassId && rec.date === date) {
            initialMap[rec.studentUid] = rec.status;
          }
        });
      } catch (err) {
        console.warn("Could not load attendance from Firestore:", err);
      }
    }

    // Fill in default "present" for any students without records
    students.forEach((st) => {
      if (!initialMap[st.uid]) {
        initialMap[st.uid] = "present";
      }
    });

    setAttendanceMap(initialMap);
    setLoading(false);
  };

  const loadChildHistory = () => {
    const localRecords = localStorage.getItem("salheen_attendance");
    let recordsList: AttendanceRecord[] = [];
    if (localRecords) {
      recordsList = JSON.parse(localRecords);
    }

    // Filter for current child
    const filtered = recordsList.filter((rec) => rec.studentUid === selectedChildUid);
    // Sort by date desc
    filtered.sort((a, b) => b.date.localeCompare(a.date));
    setChildHistory(filtered);
  };

  const handleStatusChange = (studentUid: string, status: "present" | "absent" | "late") => {
    setAttendanceMap((prev) => ({
      ...prev,
      [studentUid]: status
    }));
  };

  const handleSaveAttendance = async () => {
    setLoading(true);
    setSaveSuccess(null);

    const now = new Date().toISOString();
    const localRecordsStr = localStorage.getItem("salheen_attendance");
    const recordsList: AttendanceRecord[] = localRecordsStr ? JSON.parse(localRecordsStr) : [];

    const newRecordsToSave: AttendanceRecord[] = [];

    students.forEach((st) => {
      const status = attendanceMap[st.uid] || "present";
      const recordId = `${st.uid}_${date}`;
      const recordDoc: AttendanceRecord = {
        uid: recordId,
        studentUid: st.uid,
        studentName: st.name,
        classId: currentClassId,
        date: date,
        status: status,
        updatedAt: now
      };

      newRecordsToSave.push(recordDoc);

      // Save or update in local list
      const idx = recordsList.findIndex((r) => r.uid === recordId);
      if (idx !== -1) {
        recordsList[idx] = recordDoc;
      } else {
        recordsList.push(recordDoc);
      }
    });

    // Write back to local storage
    localStorage.setItem("salheen_attendance", JSON.stringify(recordsList));

    // Write to Firestore if available
    if (db) {
      try {
        for (const item of newRecordsToSave) {
          await setDoc(doc(db, "attendance", item.uid), item);
        }
      } catch (err) {
        console.warn("Could not save attendance to Firestore:", err);
      }
    }

    setSaveSuccess("تم تسجيل وحفظ كشف الحضور والغياب بنجاح في ملفات المدرسة والوزارة.");
    setLoading(false);
    
    setTimeout(() => {
      setSaveSuccess(null);
    }, 4500);
  };

  // Stats calculation
  const totalStudents = students.length;
  const presentCount = Object.values(attendanceMap).filter((v) => v === "present").length;
  const lateCount = Object.values(attendanceMap).filter((v) => v === "late").length;
  const absentCount = Object.values(attendanceMap).filter((v) => v === "absent").length;

  const totalHistoryDays = childHistory.length;
  const daysPresent = childHistory.filter((r) => r.status === "present").length;
  const daysLate = childHistory.filter((r) => r.status === "late").length;
  const daysAbsent = childHistory.filter((r) => r.status === "absent").length;

  // Discipline rate: Present = 1, Late = 0.8, Absent = 0
  const disciplineRate = totalHistoryDays > 0 
    ? Math.round(((daysPresent + daysLate * 0.8) / totalHistoryDays) * 100)
    : 100; // default to perfect score if no records exist yet

  // Translate statuses
  const translateStatus = (s: string) => {
    if (s === "present") return { label: "حاضر", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" };
    if (s === "late") return { label: "متأخر صباحاً", color: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20" };
    return { label: "غائب ومستبعد", color: "text-rose-400 bg-rose-500/10 border-rose-500/20" };
  };

  return (
    <div className="rounded-2xl border border-indigo-500/15 bg-slate-900/65 p-5 shadow-lg backdrop-blur-md space-y-5 text-right font-sans">
      
      {/* SECTION HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b border-slate-800 pb-3">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 justify-end md:justify-start">
            <span className="inline-flex rounded-full bg-[#c5a85c]/10 px-2.5 py-0.5 text-[9px] font-black text-[#c5a85c] leading-none">
              سلسلة الانضباط التربوي
            </span>
            <span className="inline-flex rounded-full bg-cyan-500/10 px-2.5 py-0.5 text-[9px] font-black text-cyan-400 leading-none">
              رصد حي ودائم
            </span>
          </div>
          <h4 className="font-display text-base font-black text-white flex items-center justify-end md:justify-start gap-2">
            {!isParentView ? (
              <>
                <Users className="h-5 w-5 text-[#c5a85c]" />
                <span>رصد الحضور والغياب اليومي للفصل</span>
              </>
            ) : (
              <>
                <UserCheck className="h-5 w-5 text-emerald-400" />
                <span>متابعة حضور وانضباط الأبناء فورياً</span>
              </>
            )}
          </h4>
          <p className="text-[10px] text-slate-400">
            {!isParentView 
              ? "تسجيل يومي لتفاعلات الحضور الصباحي والتأخر لطلبة الفوج الأكاديمي."
              : "كشف فوري ومباشر لنسب حضور الطالب في اليوم الدراسي والالتزام الموقوت بطابور الصباح."}
          </p>
        </div>

        {/* TOP LEVEL ACTION: DATE SELECTOR FOR TEACHER OR CHILD SELECTOR FOR PARENT */}
        {!isParentView ? (
          <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-850 self-end md:self-auto">
            <span className="text-[10.5px] font-bold text-slate-400 pl-2">تاريخ اليوم:</span>
            <input 
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-lg p-1 px-2.5 text-xs text-white outline-none cursor-pointer focus:border-[#c5a85c]"
            />
          </div>
        ) : (
          parentTrackedChildren.length > 1 && (
            <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-xl border border-slate-850">
              <span className="text-[11px] font-bold text-slate-300">الابن المراقب:</span>
              <select
                value={selectedChildUid}
                onChange={(e) => setSelectedChildUid(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-lg py-1 px-3 text-xs text-white shrink-0 cursor-pointer"
              >
                {parentTrackedChildren.map((ch) => (
                  <option key={ch.uid || ch.nationalId} value={ch.uid || ch.nationalId}>
                    {ch.name}
                  </option>
                ))}
              </select>
            </div>
          )
        )}
      </div>

      {/* RENDER FOR TEACHER CONTROL PORTAL */}
      {!isParentView && (
        <div className="space-y-4">
          
          {/* TEACHER COUNTER OVERVIEW BAR */}
          <div className="grid grid-cols-4 gap-3">
            <div className="bg-slate-950 border border-slate-850 p-3 rounded-xl text-center space-y-1">
              <span className="text-[9.5px] text-slate-400 block font-bold">إجمالي الفصل</span>
              <span className="text-sm font-black text-white font-mono">{totalStudents}</span>
            </div>
            <div className="bg-emerald-500/5 border border-emerald-500/10 p-3 rounded-xl text-center space-y-1">
              <span className="text-[9.5px] text-emerald-400 block font-bold">الحضور</span>
              <span className="text-sm font-black text-emerald-400 font-mono">{presentCount}</span>
            </div>
            <div className="bg-yellow-500/5 border border-yellow-500/10 p-3 rounded-xl text-center space-y-1">
              <span className="text-[9.5px] text-yellow-400 block font-bold">التأخير</span>
              <span className="text-sm font-black text-yellow-400 font-mono">{lateCount}</span>
            </div>
            <div className="bg-rose-500/5 border border-rose-500/10 p-3 rounded-xl text-center space-y-1">
              <span className="text-[9.5px] text-rose-400 block font-bold">الغياب</span>
              <span className="text-sm font-black text-rose-400 font-mono">{absentCount}</span>
            </div>
          </div>

          {/* STUDENTS INTERACTIVE ROW LIST FOR TEACHER */}
          {students.length === 0 ? (
            <div className="text-center py-6 bg-slate-950/20 rounded-xl border border-slate-900 text-xs font-bold text-slate-500">
              لا توجد بيانات مسجلة لطلاب فصل {currentClassId} حالياً.
            </div>
          ) : (
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
              {students.map((student) => {
                const currentStatus = attendanceMap[student.uid] || "present";
                return (
                  <div 
                    key={student.uid} 
                    className="flex justify-between items-center bg-slate-950/45 border border-slate-850 hover:border-slate-800 p-3 rounded-xl transition-all"
                  >
                    <div className="space-y-0.5">
                      <span className="text-xs font-black text-slate-200 block">{student.name}</span>
                      <span className="text-[9px] text-slate-500 font-mono">الرقم القومي: {student.nationalId}</span>
                    </div>

                    {/* Three-State Toggle Buttons */}
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => handleStatusChange(student.uid, "present")}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-black border transition-all cursor-pointer flex items-center gap-1 ${
                          currentStatus === "present"
                            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                            : "bg-slate-900 border-slate-850/60 text-slate-400 hover:text-slate-350"
                        }`}
                      >
                        <CheckCircle className="h-3 w-3" />
                        <span>حضور</span>
                      </button>

                      <button
                        onClick={() => handleStatusChange(student.uid, "late")}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-black border transition-all cursor-pointer flex items-center gap-1 ${
                          currentStatus === "late"
                            ? "bg-yellow-500/10 border-yellow-500/35 text-yellow-400"
                            : "bg-slate-900 border-slate-850/60 text-slate-400 hover:text-slate-350"
                        }`}
                      >
                        <Clock className="h-3 w-3" />
                        <span>تأخير</span>
                      </button>

                      <button
                        onClick={() => handleStatusChange(student.uid, "absent")}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-black border transition-all cursor-pointer flex items-center gap-1 ${
                          currentStatus === "absent"
                            ? "bg-rose-500/10 border-rose-500/30 text-rose-450"
                            : "bg-slate-900 border-slate-850/60 text-slate-400 hover:text-slate-350"
                        }`}
                      >
                        <XCircle className="h-3 w-3" />
                        <span>غياب</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* SAVE TRIGGER BUTTON AND FEEDBACK */}
          <div className="flex justify-between items-center pt-3 border-t border-slate-850">
            <span className="text-[9px] line-clamp-1 text-slate-450 font-semibold max-w-xs md:max-w-md">
              * رصد الغياب والحضور التربوي ينعكس فورياً على لوحة ولي الأمر لتعزيز الرقابة والتكامل المشترك.
            </span>
            <button
              onClick={handleSaveAttendance}
              disabled={loading || students.length === 0}
              className="px-5 py-2 rounded-xl text-xs font-black bg-[#c5a85c] hover:bg-[#b0934d] text-slate-950 cursor-pointer transition-all flex items-center gap-2 shadow-lg hover:shadow-[#c5a85c]/10"
            >
              {loading ? (
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <CheckCheck className="h-3.5 w-3.5" />
              )}
              <span>حفظ واعتماد كشف اليوم</span>
            </button>
          </div>

          {saveSuccess && (
            <div className="bg-emerald-500/10 border border-emerald-500/25 p-3 rounded-lg text-emerald-400 text-center text-xs font-bold font-sans">
              {saveSuccess}
            </div>
          )}

        </div>
      )}

      {/* RENDER FOR GUARDIAN VIEW PORTAL */}
      {isParentView && (
        <div className="space-y-4">
          
          {/* STATS OVERVIEW FOR TARGET CHILD */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* INTACT RATE PIE/CIRCLE CARD */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 flex items-center justify-between gap-3">
              <div className="space-y-1">
                <span className="text-[9.5px] text-[#c5a85c] font-black block">معدل الانضباط الإجمالي</span>
                <span className="text-xl font-black text-white font-mono">{disciplineRate}%</span>
                <span className="text-[8.5px] text-slate-450 block font-semibold leading-none">
                  {disciplineRate >= 90 ? "ممتاز ملتزم ومثالي" : disciplineRate >= 75 ? "منضبط ومريح" : "يحتاج مراجعة وحث"}
                </span>
              </div>
              <div className="h-12 w-12 rounded-full border-3 border-indigo-500/15 flex items-center justify-center text-indigo-400 relative">
                <Percent className="h-4 w-4 text-cyan-400" />
                <div className="absolute inset-0 rounded-full border-3 border-emerald-400 border-r-transparent animate-pulse pointer-events-none"></div>
              </div>
            </div>

            {/* DETAIL SUMMARY CARDS */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 col-span-2 grid grid-cols-3 gap-2">
              <div className="text-center space-y-1 border-l border-slate-900">
                <span className="text-[8px] text-slate-400 font-bold block">أيام الرصد</span>
                <span className="text-sm font-black text-slate-200 font-mono">{totalHistoryDays}</span>
              </div>
              <div className="text-center space-y-1 border-l border-slate-900">
                <span className="text-[8px] text-emerald-400 font-bold block">حضور مؤكد</span>
                <span className="text-sm font-black text-emerald-400 font-mono">{daysPresent}</span>
              </div>
              <div className="text-center space-y-1">
                <span className="text-[8px] text-rose-400 font-bold block">تغيب وغيابات</span>
                <span className="text-sm font-black text-rose-450 font-mono">{daysAbsent}</span>
              </div>
            </div>

          </div>

          {/* ATTENDANCE RECENT LOGS */}
          <div className="space-y-2">
            <h5 className="text-xs font-black text-slate-350 flex items-center gap-1.5 justify-end mb-1">
              <Calendar className="h-4 w-4 text-cyan-400" />
              <span>سيرة التواجد والحضور المسجلة حديثاً:</span>
            </h5>

            {childHistory.length === 0 ? (
              <p className="text-center text-xs text-slate-500 font-bold py-8 bg-slate-950/30 rounded-xl border border-slate-900">
                لم يتم رصد غياب أو حضور رسمي لهذا الطالب للتو. سيتم التحديث قريباً من المدرسة.
              </p>
            ) : (
              <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
                {childHistory.map((rec) => {
                  const data = translateStatus(rec.status);
                  return (
                    <div 
                      key={rec.uid}
                      className="flex justify-between items-center bg-slate-950/50 p-3 rounded-lg border border-slate-900 hover:bg-slate-900/10 transition-colors"
                    >
                      <div className="flex items-center gap-1.5">
                        <span className="inline-block h-1.5 w-1.5 rounded-full bg-cyan-400"></span>
                        <span className="text-xs font-bold text-slate-200">{rec.date}</span>
                      </div>

                      <div className={`text-[10px] font-black px-2.5 py-1 rounded-md border ${data.color}`}>
                        {data.label}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          
        </div>
      )}

    </div>
  );
}
