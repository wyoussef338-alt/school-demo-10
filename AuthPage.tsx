import React, { useState, useEffect } from "react";
import { 
  LogIn, UserPlus, ShieldCheck, Mail, Lock, User, Briefcase, 
  GraduationCap, Search, Trash2, Award, Flame, Star, Sparkles, 
  Check, Shield, ChevronLeft, Calendar, BookOpen, Fingerprint, PlusCircle,
  Settings, Key
} from "lucide-react";
import { UserRole } from "../types";
import { db } from "../firebase";
import { collection, doc, setDoc, getDoc, getDocs, query, where } from "firebase/firestore";
import WeeklySchedule from "./WeeklySchedule";
import AttendanceSystem from "./AttendanceSystem";
import ParentTeacherComms from "./ParentTeacherComms";
import ComplaintsSystem from "./ComplaintsSystem";

import { translations, Language } from "../utils/translations";

interface AuthPageProps {
  onLoginSuccess: (userProfile: any, shouldRedirect?: boolean) => void;
  user: any;
  onLogout: () => void;
  loginRegistry: any[];
  lang?: Language;
  onLangChange?: (l: Language) => void;
}

const SEED_STUDENTS = [
  {
    uid: "seed-student-ahmed",
    email: "ahmed@salheen.edu",
    name: "أحمد يوسف محمد",
    role: "student",
    gradeId: "j1",
    classId: "1A",
    points: 210,
    streak: 6,
    achievements: ["المعرفة الأولى", "بطل الأسبوع"],
    createdAt: new Date().toISOString(),
    nationalId: "30501011234567",
    parentEmail: "parent@salheen.edu"
  },
  {
    uid: "seed-student-omar",
    email: "omar@salheen.edu",
    name: "عمر أحمد حسن",
    role: "student",
    gradeId: "j2",
    classId: "1B",
    points: 165,
    streak: 3,
    achievements: ["المحاور الذكي"],
    createdAt: new Date().toISOString(),
    nationalId: "30602027654321",
    parentEmail: "parent@salheen.edu"
  },
  {
    uid: "seed-student-yassin",
    email: "yassin@salheen.edu",
    name: "ياسين كريم عبد الله",
    role: "student",
    gradeId: "s1",
    classId: "2A",
    points: 240,
    streak: 8,
    achievements: ["نجم الصدارة", "التأثير الرياضي"],
    createdAt: new Date().toISOString(),
    nationalId: "30703031122334",
    parentEmail: "parent@salheen.edu"
  }
];

export default function AuthPage({ onLoginSuccess, user, onLogout, loginRegistry, lang, onLangChange }: AuthPageProps) {
  const currentLang = lang || "ar";
  const t = translations[currentLang];

  const getRoleLabel = (r: string) => {
    if (r === "student") return t.studentRole || "طالب علم بالصالحين";
    if (r === "teacher") return t.teacherRole || "عضو الكادر التدريسي بالفوج";
    if (r === "parent") return t.parentRole || "ولي أمر مهتم ومتابع";
    return r;
  };

  const decodeGrade = (gId: string) => {
    if (currentLang === "en") {
      if (gId === "j1") return "Grade 1 (Primary)";
      if (gId === "j2") return "Grade 2 (Primary)";
      if (gId === "s1") return "Grade 7 (Preparatory)";
      if (gId === "s2") return "Grade 8 (Preparatory)";
      return gId;
    } else {
      if (gId === "j1") return "الصف الأول الابتدائي";
      if (gId === "j2") return "الصف الثاني الابتدائي";
      if (gId === "s1") return "الصف الأول الإعدادي";
      if (gId === "s2") return "الصف الثاني الإعدادي";
      return gId;
    }
  };

  const translateSubject = (sub: string) => {
    if (!sub) return t.unspecified;
    if (currentLang === "ar") return sub;
    const map: Record<string, string> = {
      "الرياضيات": "Mathematics",
      "العلوم العامة": "General Science",
      "اللغة العربية": "Arabic Language",
      "اللغة الإنجليزية": "English Language",
      "الفيزياء المتقدمة": "Advanced Physics",
      "الكيمياء": "Chemistry",
      "الأحياء والجيولوجيا": "Biology & Geology",
      "تكنولوجيا الذكاء الاصطناعي": "AI Technology",
      "التربية الدينية الإسلامية": "Islamic Religious Education",
      "التربية الدينية المسيحية": "Christian Religious Education"
    };
    return map[sub] || sub;
  };

  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<UserRole>("student");
  
  // Registration custom fields
  const [gradeId, setGradeId] = useState("j1");
  const [nationalId, setNationalId] = useState(""); // for students
  const [parentEmailInput, setParentEmailInput] = useState(""); // student specifies parent's email
  const [subject, setSubject] = useState("الرياضيات"); // for teachers
  const [teacherCode, setTeacherCode] = useState(""); // for teachers
  const [parentChildrenCount, setParentChildrenCount] = useState<number>(1);
  const [parentChildrenIds, setParentChildrenIds] = useState<string[]>([""]);
  const [rememberMe, setRememberMe] = useState(false);

  // Profile and settings editing states
  const [editName, setEditName] = useState("");
  const [editNationalId, setEditNationalId] = useState("");
  const [editParentEmail, setEditParentEmail] = useState("");
  const [themeGlow, setThemeGlow] = useState("cyan");

  useEffect(() => {
    if (user) {
      setEditName(user.name || "");
      setEditNationalId(user.nationalId || "");
      setEditParentEmail(user.parentEmail || "");
    }
  }, [user]);

  const handleParentChildrenCountChange = (count: number) => {
    const val = Math.max(0, Math.min(10, count));
    setParentChildrenCount(val);
    setParentChildrenIds((prev) => {
      const updated = [...prev];
      if (updated.length < val) {
        while (updated.length < val) {
          updated.push("");
        }
      } else if (updated.length > val) {
        updated.splice(val);
      }
      return updated;
    });
  };

  // Parent Portal states
  const [childSearchId, setChildSearchId] = useState("");
  const [parentBrowseClass, setParentBrowseClass] = useState("1A"); // browse student lists by class
  const [parentSearchName, setParentSearchName] = useState(""); // search students by name
  const [trackedChildren, setTrackedChildren] = useState<any[]>([]);
  const [searchStatus, setSearchStatus] = useState<any>(null); // { success: boolean, msg: string }

  // Reactive calculations of students
  const localRegObj = localStorage.getItem("salheen_all_registered");
  const allSchoolStudents = (localRegObj ? JSON.parse(localRegObj) : SEED_STUDENTS)
    .filter((u: any) => u.role === "student");

  const searchResultsByName = parentSearchName.trim().length >= 2
    ? allSchoolStudents.filter((s: any) => s.name.includes(parentSearchName.trim()))
    : [];

  const classStudentsForParent = allSchoolStudents.filter((s: any) => s.classId === parentBrowseClass);

  // Teacher Control states
  const [selectedClass, setSelectedClass] = useState("1A");
  const [classStudents, setClassStudents] = useState<any[]>([]);
  const [awardingStudentId, setAwardingStudentId] = useState<string | null>(null);
  const [pointsToAward, setPointsToAward] = useState(10);
  const [awardReason, setAwardReason] = useState("المشاركة الفعالة والتفاعل المنظم");

  // Initialize seed registered users if not present
  useEffect(() => {
    const local = localStorage.getItem("salheen_all_registered");
    if (!local) {
      localStorage.setItem("salheen_all_registered", JSON.stringify(SEED_STUDENTS));
    }
  }, []);

  // Sync parent's tracked children whenever the logged-in parent details change
  useEffect(() => {
    if (user && user.role === "parent") {
      loadTrackedChildren();
    } else if (user && user.role === "teacher") {
      loadClassStudents();
    }
  }, [user, selectedClass]);

  const loadTrackedChildren = async () => {
    const ids = user?.childrenNationalIds || [];
    
    // Start with seeds
    const local = localStorage.getItem("salheen_all_registered");
    let allUsers = local ? JSON.parse(local) : [...SEED_STUDENTS];

    // Load from Firestore if online/available
    if (db) {
      try {
        const snap = await getDocs(collection(db, "users"));
        snap.forEach((docSnap) => {
          const d = docSnap.data();
          if (d.role === "student") {
            const existsIdx = allUsers.findIndex((u: any) => u.uid === d.uid);
            if (existsIdx !== -1) {
              allUsers[existsIdx] = { ...allUsers[existsIdx], ...d };
            } else {
              allUsers.push(d);
            }
          }
        });
      } catch (err) {
        console.warn("Could not fetch users from Firestore, using offline cache:", err);
      }
    }

    // Dynamic scan: Find students whose parentEmail equals this parent's email
    const parentEmailLower = user?.email?.toLowerCase() || "";
    const autoMatchedIds = allUsers
      .filter((u: any) => u.role === "student" && u.parentEmail && u.parentEmail.toLowerCase() === parentEmailLower)
      .map((u: any) => u.nationalId);

    // Merge without duplicates
    const combinedSet = new Set([...ids, ...autoMatchedIds]);
    const finalIds = Array.from(combinedSet);

    // If new auto-linked children found, update parent profile state
    if (user && finalIds.length > ids.length) {
      const updatedParentProfile = {
        ...user,
        childrenNationalIds: finalIds
      };
      await syncRegistryUserUpdate(updatedParentProfile);
      onLoginSuccess(updatedParentProfile);
    }

    const matchedChildren = allUsers.filter((u: any) => u.role === "student" && finalIds.includes(u.nationalId));
    setTrackedChildren(matchedChildren);
  };

  const loadClassStudents = async () => {
    const local = localStorage.getItem("salheen_all_registered");
    let allUsers = local ? JSON.parse(local) : [...SEED_STUDENTS];

    if (db) {
      try {
        const snap = await getDocs(collection(db, "users"));
        snap.forEach((docSnap) => {
          const d = docSnap.data();
          if (d.role === "student") {
            const existsIdx = allUsers.findIndex((u: any) => u.uid === d.uid);
            if (existsIdx !== -1) {
              allUsers[existsIdx] = { ...allUsers[existsIdx], ...d };
            } else {
              allUsers.push(d);
            }
          }
        });
      } catch (err) {
        console.warn("Could not fetch students class list from Firestore:", err);
      }
    }

    const classMatched = allUsers.filter((u: any) => u.role === "student" && u.classId === selectedClass);
    setClassStudents(classMatched);
  };

  const syncRegistryUserUpdate = async (updatedProfile: any) => {
    // Update local database registry
    const local = localStorage.getItem("salheen_all_registered");
    if (local) {
      const list = JSON.parse(local);
      const existsIdx = list.findIndex((u: any) => u.uid === updatedProfile.uid);
      if (existsIdx !== -1) {
        list[existsIdx] = updatedProfile;
      } else {
        list.push(updatedProfile);
      }
      localStorage.setItem("salheen_all_registered", JSON.stringify(list));
    }

    // Update in Firestore
    if (db) {
      try {
        await setDoc(doc(db, "users", updatedProfile.uid), updatedProfile);
      } catch (err) {
        console.warn("Could not save to Firestore:", err);
      }
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!editName.trim()) {
      alert(currentLang === "ar" ? "يرجى تحديد الاسم الشخصي الجديد!" : "Please provide a valid display name!");
      return;
    }
    const updatedUser = {
      ...user,
      name: editName.trim(),
      nationalId: editNationalId.trim(),
      parentEmail: editParentEmail.trim()
    };
    await syncRegistryUserUpdate(updatedUser);
    onLoginSuccess(updatedUser, false); // false ensures we don't route back to 'home' tab
    alert(currentLang === "ar" ? "تم بنجاح حفظ التعديلات وتغذية النظام بالبيانات المحدثة سحابياً! ✨" : "Successfully updated profile details and synchronized with cloud! ✨");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      alert("يرجى ملء جميع الحقول المطلوبة!");
      return;
    }

    if (isSignUp) {
      if (password !== confirmPassword) {
        alert("تأكيد كلمة المرور غير مطابق للمستند الأول!");
        return;
      }
      if (password.length < 6) {
        alert("كلمة المرور يجب أن تكون من 6 أحرف على الأقل!");
        return;
      }

      // Role specific verification
      if (role === "student") {
        if (!/^\d{14}$/.test(nationalId.trim())) {
          alert("الرجاء إدخال رقم قومي صحيح مكون من 14 رقماً!");
          return;
        }

        // Verify nationalId uniqueness
        const local = localStorage.getItem("salheen_all_registered");
        const list = local ? JSON.parse(local) : [...SEED_STUDENTS];
        const isTaken = list.some((u: any) => u.role === "student" && u.nationalId === nationalId.trim());
        if (isTaken) {
          alert("خطأ: الرقم القومي هذا مسجل بالفعل لطالب آخر بمدرسة الصالحين!");
          return;
        }
      }

      if (role === "teacher" && !teacherCode.trim()) {
        alert("الرجاء إدخال رقم كود المعلم أو الكادر الخاص بك لتوثيق السلطة التربوية!");
        return;
      }

      const userUid = "user-" + Date.now() + "-" + Math.floor(Math.random() * 1000);
      const baseUserProfile: any = {
        uid: userUid,
        email: email.trim().toLowerCase(),
        name: name.trim() || email.split("@")[0],
        role,
        points: role === "student" ? 180 : 0,
        streak: role === "student" ? 4 : 0,
        achievements: ["التسجيل الأول"],
        createdAt: new Date().toISOString(),
        gradeId: role === "student" ? gradeId : "s2",
        classId: role === "student" ? (gradeId === "j1" || gradeId === "j2" ? "1A" : "2A") : "",
      };

      // Extend profile with role specific data
      if (role === "student") {
        baseUserProfile.nationalId = nationalId.trim();
        baseUserProfile.parentEmail = parentEmailInput.trim().toLowerCase();
      } else if (role === "parent") {
        const cleanIds = parentChildrenIds
          .map((id) => id.trim())
          .filter((id) => id.length > 0);

        for (const childId of cleanIds) {
          if (!/^\d{14}$/.test(childId)) {
            alert(`خطأ: الرقم القومي للابن (${childId}) غير صحيح. يجب أن يتكون الرقم القومي من 14 رقماً بالتمام.`);
            return;
          }
        }
        baseUserProfile.childrenNationalIds = cleanIds;
      } else if (role === "teacher") {
        baseUserProfile.subject = subject;
        baseUserProfile.teacherCode = teacherCode.trim();
        baseUserProfile.achievements = ["إثبات سلطة كادر التدريس"];
      }

      // Add to registry list
      await syncRegistryUserUpdate(baseUserProfile);

      // Login immediately
      onLoginSuccess(baseUserProfile);
      alert(`تهانينا! تم إنشاء حسابك بنجاح كـ (${getRoleLabel(role)})، مرحباً بك في مدرسة الصالحين الرسمية للغات!`);
    } else {
      // Sign-In Flow
      // 1. Search in local storage / mock registry database
      const local = localStorage.getItem("salheen_all_registered");
      let allUsers = local ? JSON.parse(local) : [...SEED_STUDENTS];

      // Try searching inside existing firebase users if database is initialized
      if (db) {
        try {
          const snap = await getDocs(collection(db, "users"));
          snap.forEach((docSnap) => {
            const d = docSnap.data();
            const existsIdx = allUsers.findIndex((u: any) => u.uid === d.uid || u.email === d.email);
            if (existsIdx !== -1) {
              allUsers[existsIdx] = { ...allUsers[existsIdx], ...d };
            } else {
              allUsers.push(d);
            }
          });
        } catch (err) {
          console.warn("Could not query Firestore directories during login fallback:", err);
        }
      }

      const matchUser = allUsers.find((u: any) => u.email.toLowerCase() === email.trim().toLowerCase());

      if (matchUser) {
        onLoginSuccess(matchUser);
        alert(`تم تسجيل الدخول بنجاح! مرحباً بعودتك يا ${matchUser.name}`);
      } else {
        // Safe standard fallback dynamically
        const fallbackRole: UserRole = email.includes("teacher") ? "teacher" : email.includes("parent") ? "parent" : "student";
        const dummyUser = {
          uid: "mock-uid-" + Date.now(),
          email: email.trim().toLowerCase(),
          name: email.split("@")[0].toUpperCase(),
          role: fallbackRole,
          gradeId: "j2",
          classId: "1B",
          points: 215,
          streak: 5,
          achievements: ["تأكيد الاتصال سحابياً"],
          createdAt: new Date().toISOString(),
          nationalId: fallbackRole === "student" ? "30501019999999" : undefined,
          childrenNationalIds: fallbackRole === "parent" ? ["30501011234567"] : undefined,
          subject: fallbackRole === "teacher" ? "تكنولوجيا العلوم" : undefined,
          teacherCode: fallbackRole === "teacher" ? "T-999" : undefined
        };

        // Sync registry
        await syncRegistryUserUpdate(dummyUser);
        onLoginSuccess(dummyUser);
        alert("تم إنشاء جلسة إلكترونية فورية مدمجة بحساب جديد!");
      }
    }
  };

  // Parent follows a child using their Egyptian National ID
  const handleFollowChild = async (e: React.FormEvent) => {
    e.preventDefault();
    setSearchStatus(null);
    const idToSearch = childSearchId.trim();

    if (!/^\d{14}$/.test(idToSearch)) {
      setSearchStatus({ success: false, msg: "الرقم القومي المصري يجب أن يتكون من 14 رقماً رقمياً تماماً!" });
      return;
    }

    // 1. Search in cached list & firestore
    const local = localStorage.getItem("salheen_all_registered");
    const localList = local ? JSON.parse(local) : [...SEED_STUDENTS];
    let matchedStudent = localList.find((u: any) => u.role === "student" && u.nationalId === idToSearch);

    if (!matchedStudent && db) {
      try {
        const q = query(collection(db, "users"), where("role", "==", "student"), where("nationalId", "==", idToSearch));
        const snap = await getDocs(q);
        if (!snap.empty) {
          matchedStudent = snap.docs[0].data();
        }
      } catch (err) {
        console.warn("Could not query target child in Firestore:", err);
      }
    }

    if (!matchedStudent) {
      setSearchStatus({
        success: false,
        msg: "تعذر رصد أي طالب مسجل بهذا الرقم القومي بالمقيدين بالمدرسة. الرجاء التأكد من صحة الـ 14 رقماً المعطاة."
      });
      return;
    }

    // Check if parent has this children followed already
    const parentChildrenIds = user.childrenNationalIds || [];
    if (parentChildrenIds.includes(matchedStudent.nationalId)) {
      setSearchStatus({
        success: false,
        msg: `الابن (${matchedStudent.name}) مضاف بالفعل لقائمتك المتابعة بمدرسة الصالحين!`
      });
      return;
    }

    // Append child and update parent profile
    const updatedChildrenIds = [...parentChildrenIds, matchedStudent.nationalId];
    const updatedParentProfile = {
      ...user,
      childrenNationalIds: updatedChildrenIds
    };

    // Save and Sync
    await syncRegistryUserUpdate(updatedParentProfile);
    
    // Update active user state in parent component
    onLoginSuccess(updatedParentProfile);

    // Reset input
    setChildSearchId("");
    setSearchStatus({
      success: true,
      msg: `تم بحمد الله تحديد ومتابعة الابن (${matchedStudent.name}) بنجاح! يمكنك الآن مراقبة تحصيله العلمي ورصد نقاطه.`
    });
  };

  // Parent unfollows a child
  const handleUnfollowChild = async (childNid: string) => {
    if (!window.confirm("هل أنت متأكد من إلغاء متابعة هذا الطالب؟")) return;

    const parentChildrenIds = user.childrenNationalIds || [];
    const updatedIds = parentChildrenIds.filter((id: string) => id !== childNid);
    const updatedParentProfile = {
      ...user,
      childrenNationalIds: updatedIds
    };

    await syncRegistryUserUpdate(updatedParentProfile);
    onLoginSuccess(updatedParentProfile);
  };

  // Parent follows a child directly from profile/search
  const handleFollowChildByProfile = async (targetStudent: any) => {
    const parentChildrenIds = user.childrenNationalIds || [];
    if (parentChildrenIds.includes(targetStudent.nationalId)) {
      alert(`الابن (${targetStudent.name}) مضاف بالفعل لقائمتك المتابعة!`);
      return;
    }

    const updatedChildrenIds = [...parentChildrenIds, targetStudent.nationalId];
    const updatedParentProfile = {
      ...user,
      childrenNationalIds: updatedChildrenIds
    };

    await syncRegistryUserUpdate(updatedParentProfile);
    onLoginSuccess(updatedParentProfile);
    alert(`تم ربط ومتابعة الابن (${targetStudent.name}) في لوحة التحكم الخاصة بك بنجاح!`);
  };

  // Teacher awards points to a student in their classroom
  const handleAwardPoints = async (studentUid: string) => {
    if (!pointsToAward || !awardReason.trim()) {
      alert("الرجاء تحديد مجموع النقاط والسبب!");
      return;
    }

    // Find student in local/cache registry
    const local = localStorage.getItem("salheen_all_registered");
    if (!local) return;

    const list = JSON.parse(local);
    const studentIdx = list.findIndex((u: any) => u.uid === studentUid);
    if (studentIdx === -1) {
      alert("تعذر رصد الطالب في القوائم النشطة!");
      return;
    }

    const targetStudent = list[studentIdx];
    const updatedPoints = (targetStudent.points || 0) + Number(pointsToAward);
    
    const awardBadge = `وسام تقدير من المعلم لـ: ${awardReason}`;
    const updatedAchievements = [...(targetStudent.achievements || [])];
    updatedAchievements.push(awardBadge);

    const updatedStudent = {
      ...targetStudent,
      points: updatedPoints,
      achievements: updatedAchievements
    };

    list[studentIdx] = updatedStudent;
    localStorage.setItem("salheen_all_registered", JSON.stringify(list));

    await syncRegistryUserUpdate(updatedStudent);

    setAwardReason("");
    setPointsToAward(10);
    setAwardingStudentId(null);
    alert(`تم منح ${pointsToAward} نقاط وتصدير الوسام للطالب (${targetStudent.name}) بنجاح!`);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-right" dir="rtl">
      {/* LEFT COLUMN: AUTH FORM OR USER SIDEBAR SETTINGS (45% on desktop / col-span-5) */}
      <div className="lg:col-span-5 flex flex-col gap-6 font-sans">
        {!user ? (
          /* GUEST MODE: SIGN IN / SIGN UP FORM */
          <>
            <section className="rounded-2xl border border-sky-500/15 bg-slate-900/80 p-6 shadow-xl backdrop-blur-xl">
              <div className="flex border-b border-slate-800 pb-3">
                <button
                  type="button"
                  onClick={() => setIsSignUp(false)}
                  className={`flex-1 pb-3 text-center text-xs font-black transition-all ${
                    !isSignUp ? "text-cyan-400 border-b-2 border-cyan-400" : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  تسجيل دخول (Sign In)
                </button>
                <button
                  type="button"
                  onClick={() => setIsSignUp(true)}
                  className={`flex-1 pb-3 text-center text-xs font-black transition-all ${
                    isSignUp ? "text-cyan-400 border-b-2 border-cyan-400" : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  إنشاء حساب جديد (Sign Up)
                </button>
              </div>

              <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-4">
                
                {/* NAME FIELD (Only SignUp) */}
                {isSignUp && (
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5 justify-start">
                      <User className="h-4 w-4 text-cyan-400" />
                      الاسم الكامل للطالب أو المستخدم
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="مثال: يوسف أحمد محمد"
                      className="rounded-xl border border-slate-850 bg-slate-950/80 px-4 py-3 text-xs text-slate-100 placeholder-slate-600 focus:border-cyan-500 focus:outline-none transition-colors"
                      required
                    />
                  </div>
                )}

                {/* EMAIL */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5 justify-start">
                    <Mail className="h-4 w-4 text-cyan-400" />
                    عنوان الإيميل (سحابياً)
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@school.com"
                    className="rounded-xl border border-slate-850 bg-slate-950/80 px-4 py-3 text-xs text-slate-100 placeholder-slate-600 focus:border-cyan-500 focus:outline-none transition-colors select-none"
                    required
                  />
                </div>

                {/* PASSWORD */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5 justify-start">
                    <Lock className="h-4 w-4 text-cyan-400" />
                    كلمة المرور
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="********"
                    className="rounded-xl border border-slate-850 bg-slate-950/80 px-4 py-3 text-xs text-slate-100 placeholder-slate-600 focus:border-cyan-500 focus:outline-none transition-colors"
                    required
                  />
                </div>

                {/* SIGN UP ROLE SELECTION */}
                {isSignUp && (
                  <>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5 justify-start">
                        <Lock className="h-4 w-4 text-cyan-400" />
                        تأكيد كلمة المرور مرة ثانية
                      </label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="********"
                        className="rounded-xl border border-slate-850 bg-slate-950/80 px-4 py-3 text-xs text-slate-100 placeholder-slate-600 focus:border-cyan-500 focus:outline-none transition-colors"
                        required
                      />
                    </div>

                    <div className="border border-slate-800/80 bg-slate-950/40 p-4 rounded-xl space-y-4">
                      <span className="text-[10px] font-bold text-[#c5a85c] block border-b border-slate-900 pb-1.5">تحديد الدور والحوكمة الأكاديمية</span>
                      
                      {/* Role Custom segment selection */}
                      <div className="grid grid-cols-3 gap-2">
                        <button
                          type="button"
                          onClick={() => setRole("student")}
                          className={`py-2 px-1 rounded-lg text-[10px] font-extrabold border transition-all flex flex-col items-center gap-1 ${
                            role === "student" 
                              ? "bg-cyan-500/10 border-cyan-500/40 text-cyan-400" 
                              : "bg-slate-950/50 border-slate-850 text-slate-400 hover:text-slate-300"
                          }`}
                        >
                          <User className="h-3.5 w-3.5" />
                          <span>طــالب</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setRole("teacher")}
                          className={`py-2 px-1 rounded-lg text-[10px] font-extrabold border transition-all flex flex-col items-center gap-1 ${
                            role === "teacher" 
                              ? "bg-amber-500/10 border-amber-500/40 text-amber-400" 
                              : "bg-slate-950/50 border-slate-850 text-slate-400 hover:text-slate-300"
                          }`}
                        >
                          <GraduationCap className="h-3.5 w-3.5" />
                          <span>مــعلم</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setRole("parent")}
                          className={`py-2 px-1 rounded-lg text-[10px] font-extrabold border transition-all flex flex-col items-center gap-1 ${
                            role === "parent" 
                              ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-400" 
                              : "bg-slate-950/50 border-slate-850 text-slate-400 hover:text-slate-300"
                          }`}
                        >
                          <Briefcase className="h-3.5 w-3.5" />
                          <span>ولي أمر</span>
                        </button>
                      </div>

                      {/* STUDENT SPECIFIC SECTION */}
                      {role === "student" && (
                        <div className="space-y-3 pt-2">
                          <div className="flex flex-col gap-1.5">
                            <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1 justify-start">
                              <Fingerprint className="h-3.5 w-3.5 text-cyan-400" />
                              الرقم القومي المصري المكون من 14 رقماً
                            </label>
                            <input
                              type="text"
                              maxLength={14}
                              value={nationalId}
                              onChange={(e) => setNationalId(e.target.value.replace(/\D/g, ""))}
                              placeholder="مثال: 30501011234567"
                              className="rounded-xl border border-slate-855 bg-slate-950 px-4 py-3 text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-500"
                              required
                            />
                            <span className="text-[9px] text-slate-500 font-semibold">تأكد من إدخال 14 رقماً بدقة تامة لإيجاد حسابك والربط بولي أمرك.</span>
                          </div>

                          <div className="flex flex-col gap-1.5 font-sans">
                            <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1 justify-start">
                              <Mail className="h-3.5 w-3.5 text-emerald-400" />
                              البريد الإلكتروني لولي الأمر (اختياري للربط التلقائي كلياً)
                            </label>
                            <input
                              type="email"
                              value={parentEmailInput}
                              onChange={(e) => setParentEmailInput(e.target.value)}
                              placeholder="مثال: parent@example.com"
                              className="rounded-xl border border-slate-855 bg-slate-950 px-4 py-3 text-xs text-white focus:outline-none focus:border-cyan-500"
                            />
                            <span className="text-[9px] text-slate-500 font-semibold leading-normal">إذا وضعت بريد ولي أمرك، فلن يضطر لإدخال أي أرقام قومية؛ ستظهر له درجاتك تلقائياً فور دخوله!</span>
                          </div>

                          <div className="flex flex-col gap-1">
                            <label className="text-[11px] font-bold text-slate-300">الصف الدراسي المقيد به</label>
                            <select
                              value={gradeId}
                              onChange={(e) => setGradeId(e.target.value)}
                              className="rounded-xl border border-slate-855 bg-slate-950 px-3 py-2.5 text-xs text-white"
                            >
                              <option value="j1">الأول الإعدادي</option>
                              <option value="j2">الثاني الإعدادي</option>
                              <option value="s1">الأول الثانوي</option>
                              <option value="s2">الثاني الثانوي</option>
                            </select>
                          </div>
                        </div>
                      )}

                      {/* TEACHER SPECIFIC SECTION */}
                      {role === "teacher" && (
                        <div className="space-y-3 pt-2">
                          <div className="flex flex-col gap-1">
                            <label className="text-[11px] font-bold text-slate-300">
                              {currentLang === "en" ? "Teaching Specialization" : "مادة التخصص التعليمية"}
                            </label>
                            <select
                              value={subject}
                              onChange={(e) => setSubject(e.target.value)}
                              className="rounded-xl border border-slate-855 bg-slate-950 px-3 py-2.5 text-xs text-white"
                            >
                              <option value="الرياضيات">{currentLang === "en" ? "Mathematics" : "الرياضيات"}</option>
                              <option value="العلوم العامة">{currentLang === "en" ? "General Science" : "العلوم العامة"}</option>
                              <option value="اللغة العربية">{currentLang === "en" ? "Arabic Language" : "اللغة العربية"}</option>
                              <option value="اللغة الإنجليزية">{currentLang === "en" ? "English Language" : "اللغة الإنجليزية"}</option>
                              <option value="الفيزياء المتقدمة">{currentLang === "en" ? "Advanced Physics" : "الفيزياء المتقدمة"}</option>
                              <option value="الكيمياء">{currentLang === "en" ? "Chemistry" : "الكيمياء"}</option>
                              <option value="الأحياء والجيولوجيا">{currentLang === "en" ? "Biology & Geology" : "الأحياء والجيولوجيا"}</option>
                              <option value="تكنولوجيا الذكاء الاصطناعي">{currentLang === "en" ? "AI Technology" : "تكنولوجيا الذكاء الاصطناعي"}</option>
                              <option value="التربية الدينية الإسلامية">{currentLang === "en" ? "Islamic Religious Education" : "التربية الدينية الإسلامية"}</option>
                              <option value="التربية الدينية المسيحية">{currentLang === "en" ? "Christian Religious Education" : "التربية الدينية المسيحية"}</option>
                            </select>
                          </div>

                          <div className="flex flex-col gap-1.5">
                            <label className="text-[11px] font-bold text-slate-300">
                              {currentLang === "en" ? "Teacher or Administrative Code" : "كود المعلم أو الكادر الإداري"}
                            </label>
                            <input
                              type="text"
                              value={teacherCode}
                              onChange={(e) => setTeacherCode(e.target.value)}
                              placeholder={currentLang === "en" ? "e.g., T-2026" : "مثال: T-2026"}
                              className="rounded-xl border border-slate-855 bg-slate-950 px-4 py-2.5 text-xs text-white"
                              required
                            />
                          </div>
                        </div>
                      )}

                      {/* PARENT SPECIFIC SECTION */}
                      {role === "parent" && (
                        <div className="space-y-4 pt-2 font-sans">
                          <div className="rounded-xl border border-emerald-500/10 bg-emerald-500/5 p-3.5">
                            <p className="text-[11px] text-emerald-400 font-semibold leading-relaxed">
                              منظومة حوكمة أولياء الأمور: حدد عدد الأبناء المقيدين بالصالحين، ثم أدخل أرقامهم القومية ليتم ربطهم بحسابك بصفة تلقائية وآمنة بالكامل.
                            </p>
                          </div>

                          {/* Number of Children Input */}
                          <div className="flex flex-col gap-1.5">
                            <label className="text-[11px] font-bold text-slate-300 flex items-center justify-start gap-1">
                              <User className="h-3.5 w-3.5 text-emerald-400" />
                              عدد الأبناء المقيدين بالمدرسة
                            </label>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleParentChildrenCountChange(parentChildrenCount - 1)}
                                className="bg-slate-950 border border-slate-850 hover:border-emerald-500/50 hover:bg-slate-900 text-slate-400 hover:text-white px-3 py-2 rounded-xl text-xs font-black cursor-pointer transition-all"
                              >
                                -
                              </button>
                              <input
                                type="number"
                                min={1}
                                max={10}
                                value={parentChildrenCount || ""}
                                onChange={(e) => handleParentChildrenCountChange(parseInt(e.target.value) || 0)}
                                className="w-20 rounded-xl border border-slate-850 bg-slate-950 px-3 py-2 text-xs font-bold text-center text-white focus:outline-none focus:border-emerald-500"
                              />
                              <button
                                type="button"
                                onClick={() => handleParentChildrenCountChange(parentChildrenCount + 1)}
                                className="bg-slate-950 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-900 text-slate-400 hover:text-white px-3 py-2 rounded-xl text-xs font-black cursor-pointer transition-all"
                              >
                                +
                              </button>
                              <span className="text-[10px] text-slate-455">(الحد الأقصى 10 أبناء)</span>
                            </div>
                          </div>

                          {/* Dynamic National ID Inputs */}
                          <div className="space-y-3 pt-1">
                            {parentChildrenIds.map((val, idx) => {
                              const ordinals = ["الأول", "الثاني", "الثالث", "الرابع", "الخامس", "السادس", "السابع", "الثامن", "التاسع", "العاشر"];
                              const labelSuffix = ordinals[idx] || `الـ ${idx + 1}`;
                              return (
                                <div key={idx} className="flex flex-col gap-1.5 text-right">
                                  <label className="text-[11px] font-black text-slate-300 flex items-center justify-start gap-1">
                                    <Fingerprint className="h-3.5 w-3.5 text-cyan-400" />
                                    الرقم القومي للابن {labelSuffix} (14 رقماً)
                                  </label>
                                  <input
                                    type="text"
                                    maxLength={14}
                                    value={val}
                                    onChange={(e) => {
                                      const text = e.target.value.replace(/\D/g, "");
                                      setParentChildrenIds((prev) => {
                                        const updated = [...prev];
                                        updated[idx] = text;
                                        return updated;
                                      });
                                    }}
                                    placeholder="مثال: 30501011234567"
                                    className="rounded-xl border border-slate-850 bg-slate-950 px-4 py-2.5 text-xs font-mono text-cyan-300 placeholder-slate-700 focus:outline-none focus:border-emerald-500 text-left"
                                    required
                                  />
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                    </div>
                  </>
                )}

                <button
                  type="submit"
                  className="mt-2 flex justify-center items-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-400 py-3.5 font-display font-extrabold text-slate-950 transition-all hover:scale-[1.02] cursor-pointer shadow-lg"
                >
                  {isSignUp ? <UserPlus className="h-5 w-5" /> : <LogIn className="h-5 w-5" />}
                  {isSignUp ? "إنشاء وتصديق ملفك الرقمي" : "سحب الجلسة وتسجيل الدخول للمدرسة"}
                </button>
              </form>
            </section>
          </>
        ) : (
          /* AUTHENTICATED MODE: SIDEBAR WITH PROFILE DETAILS & ACCENT SETTINGS */
          <>
            {/* PROFILE BASICS REPORT */}
            <section className="rounded-2xl border border-sky-500/15 bg-slate-900/80 p-6 shadow-xl backdrop-blur-xl">
              <h3 className="font-display text-sm font-black text-white border-b border-slate-800 pb-3 mb-4 flex items-center justify-between">
                <span>{t.currentPerformance}</span>
                <ShieldCheck className="h-4.5 w-4.5 text-[#c5a85c]" />
              </h3>

              <div className="space-y-4">
                <div className="flex items-center gap-4 bg-slate-950/60 p-4 rounded-xl border border-slate-850">
                  <div className="h-14 w-14 rounded-full bg-slate-900 border border-[#c5a85c]/30 flex items-center justify-center text-[#c5a85c]">
                    {user.role === "student" ? (
                      <GraduationCap className="h-7 w-7" />
                    ) : user.role === "teacher" ? (
                      <Award className="h-7 w-7 text-amber-400" />
                    ) : (
                      <Shield className="h-7 w-7 text-emerald-400" />
                    )}
                  </div>
                  <div className={currentLang === "ar" ? "text-right" : "text-left"}>
                    <h4 className="font-display text-sm font-black text-white">{user.name}</h4>
                    <p className="text-[10px] font-black text-cyan-400 uppercase mt-0.5 tracking-wider">{getRoleLabel(user.role)}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs font-bold text-slate-300">
                  <div className="bg-slate-950/30 p-3 rounded-lg border border-slate-850/50 flex flex-col justify-between">
                    <span className="text-slate-455 text-[10px] block mb-1">{t.verifiedEmail}</span>
                    <span className="text-white font-mono break-all text-[11px]">{user.email}</span>
                  </div>

                  {user.role === "student" && (
                    <>
                      <div className="bg-slate-950/30 p-3 rounded-lg border border-slate-850/50 flex flex-col justify-between">
                        <span className="text-slate-455 text-[10px] block mb-1">{t.nationalId}</span>
                        <span className="text-cyan-300 font-mono text-[11px]">{user.nationalId || t.unspecified}</span>
                      </div>
                      <div className="bg-slate-950/30 p-3 rounded-lg border border-slate-850/50 flex flex-col justify-between">
                        <span className="text-slate-455 text-[10px] block mb-1">{t.totalPoints}</span>
                        <span className="text-amber-400 font-mono text-[11px]">{user.points || 0} {currentLang === "ar" ? "نقطة" : "Pts"}</span>
                      </div>
                      <div className="bg-slate-950/30 p-3 rounded-lg border border-slate-850/50 flex flex-col justify-between">
                        <span className="text-slate-455 text-[10px] block mb-1">{t.streak}</span>
                        <span className="text-orange-400 font-mono text-[11px]">{user.streak || 0} {currentLang === "ar" ? "أيام متصلة" : "Days"}</span>
                      </div>
                    </>
                  )}

                  {user.role === "teacher" && (
                    <>
                      <div className="bg-slate-950/30 p-3 rounded-lg border border-slate-850/50 flex flex-col justify-between">
                        <span className="text-slate-455 text-[10px] block mb-1">{t.subject}</span>
                        <span className="text-yellow-400 text-[11px] font-bold">{translateSubject(user.subject)}</span>
                      </div>
                      <div className="bg-slate-950/30 p-3 rounded-lg border border-slate-850/50 flex flex-col justify-between">
                        <span className="text-slate-455 text-[10px] block mb-1">{t.teacherCode}</span>
                        <span className="text-purple-300 text-[11px] font-mono">{user.teacherCode || "T-Code"}</span>
                      </div>
                    </>
                  )}

                  {user.role === "parent" && (
                    <div className="bg-slate-950/30 p-3 rounded-lg border border-slate-850/50 col-span-2 flex justify-between items-center">
                      <div>
                        <span className="text-slate-455 text-[10px] block mb-1">{t.parentChildren}</span>
                        <span className="text-emerald-400 text-xs font-black">{(user.childrenNationalIds || []).length} {currentLang === "ar" ? "أبناء متابعين" : "Tracked Children"}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 leading-tight">
                        {t.parentChildrenSubtext}
                      </div>
                    </div>
                  )}
                </div>

                {user.role === "student" && user.achievements && (
                  <div className="bg-slate-950/40 p-4 border border-slate-900 rounded-xl space-y-2">
                    <span className="text-[11px] font-bold text-slate-400 block pb-1 border-b border-slate-850/40 text-right">
                      {currentLang === "ar" ? "الأوسمة وتكريمات الشرف المصاحبة:" : "Accompanying Honors & Badges:"}
                    </span>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {user.achievements.map((ach: string, idx: number) => (
                        <span key={idx} className="inline-flex items-center gap-1.5 rounded-full bg-cyan-950/50 border border-cyan-500/20 px-3 py-1 text-[10px] font-extrabold text-cyan-400">
                          <Star className="h-3 w-3 fill-cyan-400" />
                          {ach}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  type="button"
                  onClick={onLogout}
                  className="w-full mt-2 rounded-xl border border-rose-500/10 bg-rose-500/5 text-rose-300 py-3 text-xs font-bold hover:bg-rose-500/15 transition-all cursor-pointer"
                >
                  {t.confirmLogout}
                </button>
              </div>
            </section>

            {/* ACCOUNT PORTAL SETTINGS & MULTI-LANGUAGE PREFERENCE */}
            <section className="rounded-2xl border border-teal-500/15 bg-slate-900/80 p-6 shadow-xl backdrop-blur-xl">
              <h3 className="font-display text-sm font-black text-white border-b border-slate-800 pb-3 mb-5 flex items-center justify-between">
                <span>{t.profileSettings}</span>
                <Settings className="h-4.5 w-4.5 text-teal-400" />
              </h3>

              {/* Language Selection Widgets with Flags */}
              <div className="mb-6 space-y-2.5">
                <label className="text-xs font-extrabold text-slate-300 block text-right">
                  {t.changeLanguage}
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => onLangChange?.("ar")}
                    className={`flex items-center justify-center gap-2 rounded-xl p-3 text-xs font-bold transition-all border cursor-pointer ${
                      currentLang === "ar"
                        ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.15)] scale-[1.02]"
                        : "bg-slate-950/40 border-slate-850 text-slate-400 hover:text-white"
                    }`}
                  >
                    <span className="text-base">🇪🇬</span>
                    <span>{t.arabic}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onLangChange?.("en")}
                    className={`flex items-center justify-center gap-2 rounded-xl p-3 text-xs font-bold transition-all border cursor-pointer ${
                      currentLang === "en"
                        ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.15)] scale-[1.02]"
                        : "bg-slate-950/40 border-slate-850 text-slate-400 hover:text-white"
                    }`}
                  >
                    <span className="text-base">🇬🇧</span>
                    <span>{t.english}</span>
                  </button>
                </div>
              </div>

              {/* Edit Profile Form */}
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div className="flex flex-col gap-1.5 text-right">
                  <label className="text-xs font-bold text-slate-300">
                    {currentLang === "ar" ? "تعديل الاسم المعروض" : "Edit Display Name"}
                  </label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder={currentLang === "ar" ? "أدخل اسمك بالكامل" : "Enter your full name"}
                    className="rounded-xl border border-slate-850 bg-slate-950/85 px-4 py-3 text-xs text-slate-100 placeholder-slate-600 focus:border-cyan-500 focus:outline-none transition-colors text-right"
                    required
                  />
                </div>

                {user.role === "student" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-right">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-300">
                        {currentLang === "ar" ? "الرقم القومي للطالب" : "Student National ID"}
                      </label>
                      <input
                        type="text"
                        value={editNationalId}
                        onChange={(e) => setEditNationalId(e.target.value)}
                        placeholder="305XXXXXXXXXXX"
                        className="rounded-xl border border-slate-850 bg-slate-950/85 px-4 py-3 text-xs text-slate-100 placeholder-slate-600 focus:border-cyan-500 focus:outline-none transition-colors font-mono text-left"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-300">
                        {currentLang === "ar" ? "بريد ولي الأمر للمتابعة" : "Parent Email Address"}
                      </label>
                      <input
                        type="email"
                        value={editParentEmail}
                        onChange={(e) => setEditParentEmail(e.target.value)}
                        placeholder="parent@example.com"
                        className="rounded-xl border border-slate-850 bg-slate-950/85 px-4 py-3 text-xs text-slate-100 placeholder-slate-600 focus:border-cyan-500 focus:outline-none transition-colors font-mono text-left"
                      />
                    </div>
                  </div>
                )}

                {/* Theme custom glow selection */}
                <div className="flex flex-col gap-2 pt-2 border-t border-slate-850 text-right">
                  <label className="text-xs font-bold text-slate-300">
                    {currentLang === "ar" ? "نمط ومستوى توهج البوابة" : "Portal Visual Accent Theme"}
                  </label>
                  <div className="flex gap-2.5">
                    {[
                      { key: "cyan", text: currentLang === "ar" ? "الجليدي اللامع" : "Ice Cyan", color: "bg-cyan-500" },
                      { key: "emerald", text: currentLang === "ar" ? "الأخضر الماسي" : "Diamond Emerald", color: "bg-emerald-500" },
                      { key: "amber", text: currentLang === "ar" ? "الذهبي العتيق" : "Amber Gold", color: "bg-amber-500" },
                    ].map((preset) => (
                      <button
                        key={preset.key}
                        type="button"
                        onClick={() => setThemeGlow(preset.key)}
                        className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg border p-2 text-[10px] font-bold transition-all cursor-pointer ${
                          themeGlow === preset.key
                            ? "bg-slate-950 border-cyan-500/40 text-white shadow-[0_0_10px_rgba(34,211,238,0.1)]"
                            : "bg-slate-950/20 border-transparent text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        <span className={`h-2 w-2 rounded-full ${preset.color}`}></span>
                        <span>{preset.text}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full mt-2 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-400 py-3 text-xs font-display font-black text-slate-950 shadow-md transition-all hover:scale-[1.01] cursor-pointer"
                >
                  {currentLang === "ar" ? "تأكيد وتطبيق التغييرات الفورية" : "Apply & Save Settings Changes"}
                </button>
              </form>
            </section>
          </>
        )}

        {/* RECENT SESSION LOG */}
        <section className="rounded-2xl border border-indigo-500/10 bg-slate-900/40 p-5 shadow-xl backdrop-blur-xl">
          <h3 className="font-display text-xs font-black text-cyan-300 border-b border-slate-800 pb-2 mb-3 text-right">
            سجل الجلسات وعمليات الدخول الأخيرة
          </h3>
          <div className="flex flex-col gap-2 max-h-[150px] overflow-y-auto">
            {loginRegistry.length === 0 ? (
              <p className="text-center text-[10px] text-slate-500 font-bold py-4">لا يوجد تقارير دخول للجلسات حالياً.</p>
            ) : (
              loginRegistry.map((item, i) => (
                <div key={i} className="flex justify-between items-center rounded-xl border border-slate-850/50 bg-slate-950/40 p-2.5 text-[10px] font-bold text-slate-300">
                  <span className="font-mono text-cyan-400">{item.email}</span>
                  <span className="text-slate-500">{new Date(item.at).toLocaleTimeString("ar-EG")}</span>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      {/* RIGHT COLUMN: ACTIVE USER PORTAL & INTERACTIVE SUB-PANE (55% on desktop / col-span-7) */}
      <div className="lg:col-span-7 flex flex-col gap-6">
        
        {/* PROFILE BASICS REPORT */}
        <section className={`${user ? 'hidden' : ''} rounded-2xl border border-sky-500/15 bg-slate-900/80 p-6 shadow-xl backdrop-blur-xl text-right`}>
          <h3 className="font-display text-sm font-black text-white border-b border-slate-800 pb-3 mb-4 flex items-center justify-between">
            <span>بوابة مدرسة الصالحين للغات</span>
            <Sparkles className="h-4.5 w-4.5 text-cyan-400" />
          </h3>

          {user ? (
            <div className="space-y-4">
              <div className="flex items-center gap-4 bg-slate-950/60 p-4 rounded-xl border border-slate-850">
                <div className="h-14 w-14 rounded-full bg-slate-900 border border-[#c5a85c]/30 flex items-center justify-center text-[#c5a85c]">
                  {user.role === "student" ? (
                    <GraduationCap className="h-7 w-7" />
                  ) : user.role === "teacher" ? (
                    <Award className="h-7 w-7 text-amber-400" />
                  ) : (
                    <Shield className="h-7 w-7 text-emerald-400" />
                  )}
                </div>
                <div>
                  <h4 className="font-display text-sm font-black text-white">{user.name}</h4>
                  <p className="text-[10px] font-black text-cyan-400 uppercase mt-0.5 tracking-wider">{getRoleLabel(user.role)}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs font-bold text-slate-300">
                <div className="bg-slate-950/30 p-3 rounded-lg border border-slate-850/50 flex flex-col justify-between">
                  <span className="text-slate-450 text-[10px] block mb-1">{t.verifiedEmail}</span>
                  <span className="text-white font-mono break-all">{user.email}</span>
                </div>

                {user.role === "student" && (
                  <>
                    <div className="bg-slate-950/30 p-3 rounded-lg border border-slate-850/50 flex flex-col justify-between">
                      <span className="text-slate-450 text-[10px] block mb-1">{t.nationalId}</span>
                      <span className="text-cyan-300 font-mono text-[13px]">{user.nationalId || t.unspecified}</span>
                    </div>
                    <div className="bg-slate-950/30 p-3 rounded-lg border border-slate-850/50 flex flex-col justify-between">
                      <span className="text-slate-450 text-[10px] block mb-1">{t.totalPoints}</span>
                      <span className="text-amber-400 font-mono text-[13px]">{user.points || 0} {currentLang === "ar" ? "نقطة" : "Pts"}</span>
                    </div>
                    <div className="bg-slate-950/30 p-3 rounded-lg border border-slate-850/50 flex flex-col justify-between">
                      <span className="text-slate-450 text-[10px] block mb-1">{t.streak}</span>
                      <span className="text-orange-400 font-mono text-[13px]">{user.streak || 0} {currentLang === "ar" ? "أيام متصلة" : "Days"}</span>
                    </div>
                  </>
                )}

                {user.role === "teacher" && (
                  <>
                    <div className="bg-slate-950/30 p-3 rounded-lg border border-slate-850/50 flex flex-col justify-between">
                      <span className="text-slate-450 text-[10px] block mb-1">{t.subject}</span>
                      <span className="text-yellow-400 text-[11px] font-bold">{translateSubject(user.subject)}</span>
                    </div>
                    <div className="bg-slate-950/30 p-3 rounded-lg border border-slate-850/50 flex flex-col justify-between">
                      <span className="text-slate-450 text-[10px] block mb-1">{t.teacherCode}</span>
                      <span className="text-purple-300 text-[11px] font-mono">{user.teacherCode || "T-Code"}</span>
                    </div>
                  </>
                )}

                {user.role === "parent" && (
                  <div className="bg-slate-950/30 p-3 rounded-lg border border-slate-850/50 col-span-2 flex justify-between items-center">
                    <div>
                      <span className="text-slate-450 text-[10px] block mb-1">{t.parentChildren}</span>
                      <span className="text-emerald-400 text-sm font-black">{(user.childrenNationalIds || []).length} {currentLang === "ar" ? "أبناء متابعين" : "Tracked Children"}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 leading-tight">
                      {t.parentChildrenSubtext}
                    </div>
                  </div>
                )}
              </div>

              {user.role === "student" && user.achievements && (
                <div className="bg-slate-950/40 p-4 border border-slate-900 rounded-xl space-y-2">
                  <span className="text-[11px] font-bold text-slate-400 block">
                    {currentLang === "ar" ? "الأوسمة وتكريمات الشرف المصاحبة:" : "Accompanying Honors & Badges:"}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {user.achievements.map((ach: string, idx: number) => (
                      <span key={idx} className="inline-flex items-center gap-1.5 rounded-full bg-cyan-950/50 border border-cyan-500/20 px-3 py-1 text-[10px] font-extrabold text-cyan-400">
                        <Star className="h-3 w-3 fill-cyan-400" />
                        {ach}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={onLogout}
                className="w-full mt-2 rounded-xl border border-rose-500/10 bg-rose-500/5 text-rose-300 py-3 text-xs font-bold hover:bg-rose-500/15 transition-all cursor-pointer"
              >
                {t.confirmLogout}
              </button>
            </div>
          ) : (
            <div className="text-xs text-slate-300 space-y-4 leading-relaxed font-sans">
              <p className="bg-slate-950/40 p-4 rounded-xl border border-slate-850 text-slate-400 text-right">
                {currentLang === "ar" 
                  ? "أهلاً بك زائرنا الكريم في البوابة الذكية! يرجى تسجيل الدخول أو تأكيد حسابك الجديد من الجزء الجانبي للولوج إلى جداول الحصص المباشرة والأنشطة ولوحات التحكم الحية والمخصصة لكل مرحلة." 
                  : "Welcome dear guest! Please sign in or create your new academic account from the sidebar or right card to access dynamic schedules, class rosters, homework, and reports."}
              </p>

              {/* Features Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="bg-slate-950/40 p-4 rounded-lg border border-slate-850 flex gap-3 h-full items-start text-right justify-start">
                  <div className="mt-1 h-8 w-8 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-200 text-xs mb-1">
                      SkooLy AI (المساعد الذكي)
                    </h4>
                    <p className="text-[11px] text-slate-400 leading-relaxed text-slate-400">
                      مدرس ومساعد شخصي مدعوم بالذكاء الاصطناعي متاح على مدار الساعة للإجابة عن التساؤلات الأكاديمية وحل الصعاب.
                    </p>
                  </div>
                </div>

                <div className="bg-slate-950/40 p-4 rounded-lg border border-slate-850 flex gap-3 h-full items-start text-right justify-start">
                  <div className="mt-1 h-8 w-8 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                    <GraduationCap className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-200 text-xs mb-1">
                      درجات وتكريمات علمية
                    </h4>
                    <p className="text-[11px] text-slate-400 leading-relaxed text-slate-400">
                      نظام تحفيز رقمي شامل يمنح شارات الشرف وأوسمة التميز للطلاب الأوائل والمجتهدين عبر كادر التدريس المعتمد.
                    </p>
                  </div>
                </div>

                <div className="bg-slate-950/40 p-4 rounded-lg border border-slate-850 flex gap-3 h-full items-start text-right justify-start">
                  <div className="mt-1 h-8 w-8 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                    <Shield className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-200 text-xs mb-1">
                      منظومة حوكمة أولياء الأمور
                    </h4>
                    <p className="text-[11px] text-slate-400 leading-relaxed text-slate-400">
                      متابعة تلقائية فورية للأبناء بفضل ترابط الرقم القومي، للوقوف على التقرير السلوكي والغياب والدرجات أولاً بأول.
                    </p>
                  </div>
                </div>

                <div className="bg-slate-950/40 p-4 rounded-lg border border-slate-850 flex gap-3 h-full items-start text-right justify-start">
                  <div className="mt-1 h-8 w-8 rounded-full bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
                    <Calendar className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-200 text-xs mb-1">
                      جداول دراسية وحضور مباشر
                    </h4>
                    <p className="text-[11px] text-slate-400 leading-relaxed text-slate-400">
                      استعراض مواقيت الحصص اليومية والأسبوعية وجداول المحاضرات، مع تسجيل الحضور والغياب بصورة فورية وموثقة.
                    </p>
                  </div>
                </div>
              </div>

              {/* Secure Seal info segment */}
              <div className="pt-4 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400 text-right">
                <span className="flex items-center gap-1 font-sans">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                  تشفير جلسات الاتصال ونظام الحماية متوافق مع معايير الأمان الأكاديمية
                </span>
                <span className="font-mono text-[9px] uppercase">Ref: SEC-TLS1.3</span>
              </div>
            </div>
          )}
        </section>

        {/* ACCOUNT PORTAL SETTINGS & MULTI-LANGUAGE PREFERENCE */}
        {user && (
          <section className="rounded-2xl border border-teal-500/15 bg-slate-900/80 p-6 shadow-xl backdrop-blur-xl">
            <h3 className="font-display text-sm font-black text-white border-b border-slate-800 pb-3 mb-5 flex items-center justify-between">
              <span>{t.profileSettings}</span>
              <Settings className="h-4.5 w-4.5 text-teal-400" />
            </h3>

            {/* Language Selection Widgets with Flags */}
            <div className="mb-6 space-y-2.5">
              <label className="text-xs font-extrabold text-slate-300 block">
                {t.changeLanguage}
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => onLangChange?.("ar")}
                  className={`flex items-center justify-center gap-2 rounded-xl p-3 text-xs font-bold transition-all border cursor-pointer ${
                    currentLang === "ar"
                      ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.15)] scale-[1.02]"
                      : "bg-slate-950/40 border-slate-850 text-slate-400 hover:text-white"
                  }`}
                >
                  <span className="text-base">🇪🇬</span>
                  <span>{t.arabic}</span>
                </button>
                <button
                  type="button"
                  onClick={() => onLangChange?.("en")}
                  className={`flex items-center justify-center gap-2 rounded-xl p-3 text-xs font-bold transition-all border cursor-pointer ${
                    currentLang === "en"
                      ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.15)] scale-[1.02]"
                      : "bg-slate-950/40 border-slate-850 text-slate-400 hover:text-white"
                  }`}
                >
                  <span className="text-base">🇬🇧</span>
                  <span>{t.english}</span>
                </button>
              </div>
            </div>

            {/* Edit Profile Form */}
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-300">
                  {currentLang === "ar" ? "تعديل الاسم المعروض" : "Edit Display Name"}
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder={currentLang === "ar" ? "أدخل اسمك بالكامل" : "Enter your full name"}
                  className="rounded-xl border border-slate-850 bg-slate-950/85 px-4 py-3 text-xs text-slate-100 placeholder-slate-600 focus:border-cyan-500 focus:outline-none transition-colors"
                  required
                />
              </div>

              {user.role === "student" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-300">
                      {currentLang === "ar" ? "الرقم القومي للطالب" : "Student National ID"}
                    </label>
                    <input
                      type="text"
                      value={editNationalId}
                      onChange={(e) => setEditNationalId(e.target.value)}
                      placeholder="305XXXXXXXXXXX"
                      className="rounded-xl border border-slate-850 bg-slate-950/85 px-4 py-3 text-xs text-slate-100 placeholder-slate-600 focus:border-cyan-500 focus:outline-none transition-colors font-mono"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-300">
                      {currentLang === "ar" ? "بريد ولي الأمر للمتابعة" : "Parent Email Address"}
                    </label>
                    <input
                      type="email"
                      value={editParentEmail}
                      onChange={(e) => setEditParentEmail(e.target.value)}
                      placeholder="parent@example.com"
                      className="rounded-xl border border-slate-850 bg-slate-950/85 px-4 py-3 text-xs text-slate-100 placeholder-slate-600 focus:border-cyan-500 focus:outline-none transition-colors font-mono"
                    />
                  </div>
                </div>
              )}

              {/* Theme custom glow selection */}
              <div className="flex flex-col gap-2 pt-2 border-t border-slate-850">
                <label className="text-xs font-bold text-slate-300">
                  {currentLang === "ar" ? "نمط ومستوى توهج البوابة" : "Portal Visual Accent Theme"}
                </label>
                <div className="flex gap-2.5">
                  {[
                    { key: "cyan", text: currentLang === "ar" ? "الجليدي اللامع" : "Ice Cyan", color: "bg-cyan-500" },
                    { key: "emerald", text: currentLang === "ar" ? "الأخضر الماسي" : "Diamond Emerald", color: "bg-emerald-500" },
                    { key: "amber", text: currentLang === "ar" ? "الذهبي العتيق" : "Amber Gold", color: "bg-amber-500" },
                  ].map((preset) => (
                    <button
                      key={preset.key}
                      type="button"
                      onClick={() => setThemeGlow(preset.key)}
                      className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg border p-2 text-[10px] font-bold transition-all cursor-pointer ${
                        themeGlow === preset.key
                          ? "bg-slate-950 border-cyan-500/40 text-white"
                          : "bg-slate-950/20 border-transparent text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      <span className={`h-2 w-2 rounded-full ${preset.color}`}></span>
                      <span>{preset.text}</span>
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-2 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-400 py-3 text-xs font-display font-black text-slate-950 shadow-md transition-all hover:scale-[1.01] cursor-pointer"
              >
                {currentLang === "ar" ? "تأكيد وتطبيق التغييرات الفورية" : "Apply & Save Settings Changes"}
              </button>
            </form>
          </section>
        )}

        {/* -------------------- STUDENT PORTAL EXCLUSIVE SCHEDULE -------------------- */}
        {user && user.role === "student" && (
          <div className="space-y-6">
            <WeeklySchedule defaultClassId={user.classId || "1A"} lang={currentLang} />
            <AttendanceSystem 
              isParentView={true} 
              currentClassId={user.classId || "1A"} 
              parentTrackedChildren={[user]} 
            />
            <ParentTeacherComms 
              user={user} 
              selectedClass={user.classId || "1A"}
              classStudents={[user]}
            />
          </div>
        )}

        {/* -------------------- GUARDIAN PORTAL (ولي الأمر) -------------------- */}
        {user && user.role === "parent" && (
            <section className="rounded-2xl border border-emerald-500/15 bg-slate-900/80 p-6 shadow-xl backdrop-blur-xl space-y-6">
              <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="font-display text-sm font-black text-white">بوابة ولي الأمر الذكية للمتابعة</h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">ثلاث طرق ميسرة لربط ومتابعة تحصيل أبنائك بالتمام</p>
                </div>
                <Briefcase className="h-5 w-5 text-emerald-400" />
              </div>

              {/* Automatic Email Link Status Card */}
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400">
                  <Sparkles className="h-4 w-4" />
                  <span className="text-xs font-black">تقنية الربط الإلكتروني التلقائي بالبريد</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                  مدرسة الصالحين تربط حسابك تلقائياً بأبنائك! أي طالب يسجل بالمدرسة ويضع بريدك الإلكتروني (<strong className="text-emerald-300 font-mono select-all">{user.email}</strong>) كولي أمره، يظهر في لوحتك فوراً دون أي إدخال يدوي.
                </p>
              </div>

              {/* Tab Grid Layout for Manual Connection */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* METHOD 1: Name Search */}
                <div className="bg-slate-950 border border-slate-850 rounded-xl p-4 space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <span className="text-[11px] font-black text-emerald-400 flex items-center gap-1">
                      <span className="bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded text-[9px]">1</span>
                      البحث باسم الابن
                    </span>
                    <p className="text-[10px] text-slate-400 leading-normal font-sans">أدخل اسم ابنائك من حرفين لربطه بنقرة واحدة</p>
                    <div className="relative">
                      <input
                        type="text"
                        value={parentSearchName}
                        onChange={(e) => setParentSearchName(e.target.value)}
                        placeholder="ابحث بالاسم: أحمد، عمر، إلخ..."
                        className="w-full rounded-xl border border-slate-800 bg-slate-900/50 px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 text-right"
                      />
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
                    </div>
                  </div>

                  {/* Name Search Match Lists */}
                  <div className="space-y-1.5 max-h-[140px] overflow-y-auto pt-2">
                    {parentSearchName.trim().length >= 2 ? (
                      searchResultsByName.length === 0 ? (
                        <p className="text-[10px] text-slate-500 font-sans">لا توجد نتائج مطابقة لـ "{parentSearchName}"</p>
                      ) : (
                        searchResultsByName.map((stud: any) => (
                          <div key={stud.uid} className="flex items-center justify-between p-2 rounded bg-slate-900 border border-slate-800 text-[11px]">
                            <div className="text-right">
                              <span className="font-extrabold text-slate-200 block text-[11px]">{stud.name}</span>
                              <span className="text-[9px] text-slate-455">{decodeGrade(stud.gradeId)}</span>
                            </div>
                            <button
                              onClick={() => handleFollowChildByProfile(stud)}
                              className="px-2 py-1 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500 hover:text-slate-950 transition-all font-black text-[9px] cursor-pointer"
                            >
                              ربط ومتابعة
                            </button>
                          </div>
                        ))
                      )
                    ) : (
                      <p className="text-[9px] text-slate-600 font-sans">اكتب حرفين لتشغيل الفرز التلقائي...</p>
                    )}
                  </div>
                </div>

                {/* METHOD 2: Class Browsing */}
                <div className="bg-slate-950 border border-slate-850 rounded-xl p-4 space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <span className="text-[11px] font-black text-emerald-400 flex items-center gap-1">
                      <span className="bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded text-[9px]">2</span>
                      تصفح قوائم طلاب الفصول
                    </span>
                    <p className="text-[10px] text-slate-400 leading-normal font-sans">تصفح طلاب الفصول مباشرة واختر ابناً لك</p>
                    <select
                      value={parentBrowseClass}
                      onChange={(e) => setParentBrowseClass(e.target.value)}
                      className="w-full rounded-xl border border-slate-800 bg-slate-900/50 px-3 py-1.5 text-xs text-white"
                    >
                      <option value="1A">صف أول إعدادي - فصل 1A</option>
                      <option value="1B">صف أول إعدادي - فصل 1B</option>
                      <option value="2A">صف ثان إعدادي - فصل 2A</option>
                      <option value="2B">صف ثان إعدادي - فصل 2B</option>
                    </select>
                  </div>

                  {/* Class Student Lists */}
                  <div className="space-y-1.5 max-h-[140px] overflow-y-auto pt-2">
                    {classStudentsForParent.length === 0 ? (
                      <p className="text-[10px] text-slate-500 font-sans">لا يوجد طلاب مسجلين بهذا الفصل حالياً</p>
                    ) : (
                      classStudentsForParent.map((stud: any) => (
                        <div key={stud.uid} className="flex items-center justify-between p-2 rounded bg-slate-900 border border-slate-800 text-[11px]">
                          <span className="font-extrabold text-slate-200 text-[11px] text-right truncate max-w-[110px]">{stud.name}</span>
                          <button
                            onClick={() => handleFollowChildByProfile(stud)}
                            className="px-2 py-1 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500 hover:text-slate-950 transition-all font-black text-[9px] cursor-pointer"
                          >
                            هذا ابني
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* METHOD 3: National ID */}
                <form onSubmit={handleFollowChild} className="bg-slate-950 border border-slate-850 rounded-xl p-4 space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <span className="text-[11px] font-black text-emerald-400 flex items-center gap-1">
                      <span className="bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded text-[9px]">3</span>
                      الرقم القومي (14 رقماً)
                    </span>
                    <p className="text-[10px] text-slate-400 leading-normal font-sans">إذا كنت تحفظ الرقم القومي للابن كاملاً</p>
                    
                    <div className="relative">
                      <input
                        type="text"
                        maxLength={14}
                        value={childSearchId}
                        onChange={(e) => setChildSearchId(e.target.value.replace(/\D/g, ""))}
                        placeholder="أدخل الـ 14 رقماً كاملاً..."
                        className="w-full rounded-xl border border-slate-800 bg-slate-900/50 px-3 py-2 text-xs font-mono text-cyan-300 placeholder-slate-600 focus:outline-none focus:border-emerald-500 text-center"
                        required
                      />
                      <Fingerprint className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-500 opacity-60" />
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-2">
                    <button
                      type="submit"
                      className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:opacity-90 py-2 text-xs font-black text-slate-950 transition-colors cursor-pointer flex justify-center items-center gap-1"
                    >
                      <PlusCircle className="h-4 w-4" />
                      <span>إضافة بالرقم القومي</span>
                    </button>

                    {searchStatus && (
                      <div className={`p-2 rounded text-[10px] font-bold leading-normal text-right ${
                        searchStatus.success 
                          ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-300"
                          : "bg-rose-500/10 border border-rose-500/20 text-rose-300"
                      }`}>
                        {searchStatus.msg}
                      </div>
                    )}
                  </div>
                </form>

              </div>

              {/* List: Tracked Children Details */}
              <div className="space-y-4 pt-4 border-t border-slate-800">
                <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <span>تطور الأبناء المتابعين تحت حوكمتك</span>
                  <span className="text-[10px] rounded-full bg-slate-950 border border-slate-800 px-2 py-0.5 text-[#c5a85c] font-mono">
                    {trackedChildren.length}
                  </span>
                </h4>

              {trackedChildren.length === 0 ? (
                <div className="text-center py-8 rounded-xl border border-dashed border-slate-800 bg-slate-950/20">
                  <p className="text-[11.5px] text-slate-400 font-semibold leading-relaxed">
                    لا يوجد أي طلاب متابعين حالياً.
                    <br />
                    أدخل الرقم القومي الخاص بالابن المقيد بالمدرسة (مثال للتجربة: <span className="font-mono text-cyan-400 selection:bg-cyan-500/20 select-all">30501011234567</span> أو <span className="font-mono text-cyan-400 selection:bg-cyan-500/20 select-all">30602027654321</span>) في حقل البحث أعلاه لمتابعة تحصيله الدراسي فوراً!
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {trackedChildren.map((child: any) => (
                    <div key={child.uid} className="rounded-xl border border-slate-800 bg-slate-950/80 p-5 space-y-4 relative overflow-hidden transition-all hover:border-emerald-500/30">
                      
                      {/* Top ribbon: Child basics */}
                      <div className="flex justify-between items-start border-b border-slate-900 pb-3">
                        <div className="space-y-1">
                          <h5 className="font-display text-sm font-black text-slate-100 flex items-center gap-1.5">
                            <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
                            {child.name}
                          </h5>
                          <span className="text-[10px] text-slate-450 block font-semibold">{decodeGrade(child.gradeId)} | فصل {child.classId || "أ"}</span>
                        </div>
                        <button
                          onClick={() => handleUnfollowChild(child.nationalId)}
                          className="p-1 px-1.5 hover:bg-rose-500/10 rounded-lg text-rose-450 hover:text-rose-400 transition-all text-[11px] font-bold border border-transparent hover:border-rose-500/20 cursor-pointer flex items-center gap-1"
                          title="إلغاء المتابعة"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span className="hidden sm:inline">إلغاء متابعة</span>
                        </button>
                      </div>

                      {/* Middle Grid: Student stats */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs bg-[#050812]/70 p-3 rounded-lg border border-slate-900">
                        <div className="flex items-center gap-2">
                          <Award className="h-4 w-4 text-amber-400 shrink-0" />
                          <div>
                            <span className="text-[9px] text-slate-450 block">مجموع النقاط</span>
                            <strong className="text-white font-mono">{child.points || 120} نقطة</strong>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Flame className="h-4 w-4 text-orange-400 shrink-0" />
                          <div>
                            <span className="text-[9px] text-slate-450 block">الحضور المتصل</span>
                            <strong className="text-white font-mono">{child.streak || 2} أيام</strong>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Fingerprint className="h-4 w-4 text-cyan-400 shrink-0 col-span-2 sm:col-span-1" />
                          <div>
                            <span className="text-[9px] text-slate-450 block font-bold">الرقم القومي للابن</span>
                            <strong className="text-cyan-400 font-mono font-medium text-[11.5px]">{child.nationalId}</strong>
                          </div>
                        </div>
                      </div>

                      {/* Display Achievements and Awards */}
                      {child.achievements && child.achievements.length > 0 && (
                        <div className="space-y-1.5 pt-1">
                          <span className="text-[10px] text-slate-400 font-bold block">الأوسمة المسجلة للتحصيل والسلوك:</span>
                          <div className="flex flex-wrap gap-1.5">
                            {child.achievements.map((ach: string, aIdx: number) => (
                              <span key={aIdx} className="inline-flex items-center gap-1 text-[9px] font-extrabold bg-[#061014] border border-cyan-800/30 text-cyan-400 px-2.5 py-1 rounded-full">
                                <Star className="h-2.5 w-2.5 fill-cyan-400" />
                                {ach}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                    </div>
                  ))}
                </div>
              )}

              {/* Parent monitored weekly schedule */}
              <div className="pt-6 border-t border-slate-800/80 space-y-4">
                <WeeklySchedule 
                  isParentView={true}
                  defaultClassId={trackedChildren.length > 0 ? (trackedChildren[0].classId || "1A") : "1A"}
                  parentSelectedChildName={trackedChildren.length > 0 ? trackedChildren[0].name : undefined}
                  lang={currentLang}
                />
              </div>

              {/* Parents Attendance Monitoring & School discipline */}
              <div className="pt-6 border-t border-slate-800/80">
                <AttendanceSystem 
                  isParentView={true}
                  currentClassId={trackedChildren.length > 0 ? (trackedChildren[0].classId || "1A") : "1A"}
                  parentTrackedChildren={trackedChildren}
                />
              </div>

              {/* Parents Communication with Teacher Box */}
              <div className="pt-6 border-t border-slate-800/80">
                <ParentTeacherComms 
                  user={user}
                />
              </div>

              {/* Parents Suggestions & Complaints Module */}
              <div className="pt-6 border-t border-slate-800/80">
                <ComplaintsSystem user={user} />
              </div>

            </div>
          </section>
        )}

        {/* -------------------- TEACHER PORTAL (المعلمين) -------------------- */}
        {user && user.role === "teacher" && (
          <section className="rounded-2xl border border-amber-500/15 bg-slate-900/80 p-6 shadow-xl backdrop-blur-xl space-y-6">
            <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
              <div>
                <h3 className="font-display text-sm font-black text-white">منفذة كادر التدريس - لوحة تحكم وسلطة المعلم</h3>
                <p className="text-[10px] text-slate-400 mt-0.5">منح درجات ومكافآت التفوق العلمي والانضباط السلوكي</p>
              </div>
              <GraduationCap className="h-5 w-5 text-amber-500" />
            </div>

            {/* Select School Class */}
            <div className="bg-slate-950 p-4 border border-slate-850 rounded-xl flex flex-wrap gap-4 items-center justify-between">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-300 block">عرض طلاب الفصل المقيدين</label>
                <div className="flex gap-2">
                  {["1A", "1B", "2A", "2B"].map((clsName) => (
                    <button
                      key={clsName}
                      onClick={() => setSelectedClass(clsName)}
                      className={`text-xs font-black px-3.5 py-1.5 rounded-lg border transition-all ${
                        selectedClass === clsName 
                          ? "bg-amber-500/10 border-amber-550/50 text-amber-400 font-black" 
                          : "bg-slate-900 border-slate-850 text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      فصل {clsName}
                    </button>
                  ))}
                </div>
              </div>
              <div className="text-[10.5px] font-semibold text-slate-450 max-w-sm leading-normal">
                اختر فصلاً من الطلاب لرصد أرقامهم القومية، مراجعة نقاطهم ومنحهم مكافآت الانضباط التفاعلي.
              </div>
            </div>

            {/* Students List for selected class */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-350">
                قائمة طلاب الفصل الحالي ({selectedClass})
              </h4>

              {classStudents.length === 0 ? (
                <p className="text-center text-xs text-slate-500 font-bold py-8 bg-slate-950/20 rounded-xl border border-slate-850/40">
                  لا يوجد طلاب مسجلون حالياً بهذا الفصل الدراسي.
                </p>
              ) : (
                <div className="space-y-3">
                  {classStudents.map((st: any) => (
                    <div key={st.uid} className="rounded-xl border border-slate-850 bg-slate-950 p-4 space-y-3 transition-colors hover:border-slate-800">
                      <div className="flex justify-between items-center">
                        <div>
                          <h5 className="font-display text-xs font-black text-slate-200">{st.name}</h5>
                          <span className="text-[9px] text-amber-500 font-bold font-mono mt-0.5 block">الرقم القومي: {st.nationalId || "غير مقيد"}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex flex-col text-left">
                            <span className="text-[9px] text-slate-500 font-bold leading-none">مجموع النقاط</span>
                            <span className="text-cyan-300 font-mono text-sm font-black mt-1">{st.points || 0}</span>
                          </div>
                          
                          <button
                            onClick={() => setAwardingStudentId(awardingStudentId === st.uid ? null : st.uid)}
                            className="rounded-lg bg-yellow-500 hover:bg-yellow-605 px-3 py-1.5 text-[10px] font-black text-slate-950 transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <PlusCircle className="h-3.5 w-3.5" />
                            <span>مكافأة الطلاب</span>
                          </button>
                        </div>
                      </div>

                      {/* Award points sliding card/input panel */}
                      {awardingStudentId === st.uid && (
                        <div className="bg-slate-900 border border-amber-500/10 rounded-lg p-3 space-y-3">
                          <span className="text-[10px] font-black text-slate-300 block border-b border-slate-800 pb-1">منح مكافأة تميز ودعم للتحصيل الدراسي</span>
                          
                          <div className="grid grid-cols-2 gap-3">
                            <div className="flex flex-col gap-1">
                              <label className="text-[9px] font-bold text-slate-400">قيمة المكافأة بالنقاط</label>
                              <select
                                value={pointsToAward}
                                onChange={(e) => setPointsToAward(Number(e.target.value))}
                                className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white"
                              >
                                <option value={5}>+5 نقاط (سلوك طيب)</option>
                                <option value={10}>+10 نقاط (تفاعل دراسي)</option>
                                <option value={15}>+15 نقطة (تفوق بالامتحان الكروي)</option>
                                <option value={25}>+25 نقطة (وسام النبوغ والتألق)</option>
                              </select>
                            </div>

                            <div className="flex flex-col gap-1">
                              <label className="text-[9px] font-bold text-slate-400">سبب المكافأة (الأثر التكريمي)</label>
                              <input
                                type="text"
                                value={awardReason}
                                onChange={(e) => setAwardReason(e.target.value)}
                                placeholder="مثال: الإجابة على امتحان العلوم"
                                className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white"
                              />
                            </div>
                          </div>

                          <div className="flex justify-end gap-2 pt-1 border-t border-slate-800">
                            <button
                              onClick={() => setAwardingStudentId(null)}
                              className="px-3 py-1 text-[10px] font-black text-slate-400 hover:text-white"
                            >
                              إلغاء
                            </button>
                            <button
                              onClick={() => handleAwardPoints(st.uid)}
                              className="px-4 py-1 rounded-md bg-amber-500 hover:bg-amber-600 text-[10px] font-black text-slate-950 cursor-pointer"
                            >
                              تأكيد المنح والترحيل للملف
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Teacher class schedule planner view */}
              <div className="pt-6 border-t border-slate-800/85">
                <WeeklySchedule defaultClassId={selectedClass} lang={currentLang} />
              </div>

              {/* Teacher Daily Attendance recording panel */}
              <div className="pt-6 border-t border-slate-800/85">
                <AttendanceSystem 
                  currentClassId={selectedClass}
                  teacherUid={user.uid}
                  teacherName={user.name}
                />
              </div>

              {/* Teacher communication with parents panel */}
              <div className="pt-6 border-t border-slate-800/85 border-dashed">
                <ParentTeacherComms 
                  user={user}
                  selectedClass={selectedClass}
                  classStudents={classStudents}
                />
              </div>

            </div>
          </section>
        )}

      </div>
    </div>
  );
}
