export type Language = "ar" | "en";

export const translations = {
  ar: {
    appName: "مدرسة الصالحين الرسمية للغات",
    appSubName: "EL-SALHEEN GOV LANGUAGE SCHOOL",
    systemName: "نظام إدارة الصالحين الذكي",
    home: "الرئيسية",
    about: "عن الصالحين",
    academics: "الأقسام الدراسية",
    extracurriculars: "الأنشطة والمسابقات",
    alumni: "الخريجون ولوحة الشرف",
    contact: "اتصل بنا",
    portalLogin: "دخول البوابة",
    myAccount: "بيانات حسابي",
    logout: "تسجيل الخروج",
    
    // About menu subitems
    about_overview: "نظرة عامة",
    about_campus: "مباني وباحات المدرسة",
    about_history: "تاريخ المدرسة",
    about_staff: "أعضاء هيئة التدريس",
    about_vision: "الرؤية والرسالة",

    // Academics subitems
    academics_overview: "المنهج والمساق التعليمي",
    academics_challenges: "امتحانات وتحديات الصالحين",
    academics_aitutor: "الذكاء الاصطناعي (AI Tutor)",
    academics_library: "مكتبة الصالحين الرقمية وتحدي القراءة",

    // Extracurriculars subitems
    extra_league: "دوري كرة القدم المدرسي",
    extra_clubs: "نوادي الأنشطة والإبداع",
    extra_events: "أجندة الفعاليات القريبة",
    extra_podcast: "راديو وعروض بودكاست الصالحين",

    // Alumni subitems
    alumni_grid: "خريجو مدرسة الصالحين للغات",
    alumni_honour: "لوحة الشرف للأذكياء والأبطال",

    // Settings
    profileSettings: "إعدادات الملف الشخصي وتخصيص النظام",
    currentPerformance: "ملخص كفاءة الحساب الحالي",
    changeLanguage: "لغة واجهة النظام المفضلة",
    chooseLanguage: "اختر لغة النظام",
    arabic: "العربية (RTL)",
    english: "English (LTR)",
    confirmLogout: "تسجيل الخروج وإنهاء جلسة العمل الفورية",
    verifiedEmail: "البريد المصدق",
    nationalId: "الرقم القومي للطالب",
    totalPoints: "مجموع النقاط",
    streak: "سلسلة الالتزام (Streak)",
    days: "أيام متصلة",
    subject: "مادة الكادر",
    teacherCode: "كود سلطة المعلم",
    unspecified: "غير محدد",
    parentChildren: "الأبناء الخاضعون للرصد",
    parentChildrenSubtext: "يتم تتبع أدائهم الرياضي والدراسي فوراً بمجرد إضافتهم بالرقم القومي.",
    recentSessions: "سجل الجلسات وعمليات الدخول الأخيرة",
    noRecentSessions: "لا يوجد تقارير دخول للجلسات حالياً.",
    anonymousUserText: "يرجى تسجيل الدخول أو إثبات الهوية سحابياً لعرض لوحة التحكم التفاعلية ورصد البيانات الخاصة بك.",

    // Form settings
    loginTitle: "سحب الجلسة وتسجيل الدخول للمدرسة",
    signupTitle: "إنشاء وتصديق ملفك الرقمي",
    authSwitchToSignup: "لا تملك ملف كفاءة رقمي معتمد؟ سجل الآن",
    authSwitchToLogin: "لديك حساب مسجل بالفعل؟ تسجيل الدخول",
    studentRole: "طالب علم بالصالحين",
    teacherRole: "عضو الكادر التدريسي بالفوج",
    parentRole: "ولي أمر مهتم ومتابع",
    
    // Quick links
    quickLinks: "روابط سريعة (Site Map)",
    keepInTouch: "تابع قنواتنا (Keep In Touch)",
    allRightsReserved: "مدرسة الصالحين الرسمية للغات • جميع الحقوق محفوظة لعام 2026/2027 • تصميم وبناء متناغم مع أعلى المعايير القياسية العالمية",
    appFooterDesc: "صرح تعليمي عريق يجمع بين تنمية القيم الأخلاقية والمهارات الأكاديمية والتقنية لتنشئة جيل قادر على المنافسة والابتكار.",
    address: "العنوان: الجيزة، خلف مدينة الإنتاج الإعلامي",
    phone: "الرقم: +20 115 911 4973",
    email: "البريد: support@salheen.edu.eg"
  },
  en: {
    appName: "El-Salheen Language School",
    appSubName: "EL-SALHEEN GOV LANGUAGE SCHOOL",
    systemName: "Salheen Smart Portal",
    home: "Home",
    about: "About Us",
    academics: "Academics",
    extracurriculars: "Activities & Leagues",
    alumni: "Alumni & Honor Roll",
    contact: "Contact Us",
    portalLogin: "Portal Login",
    myAccount: "My Profile",
    logout: "Log Out",

    // About menu subitems
    about_overview: "Overview",
    about_campus: "School Facilities & Campus",
    about_history: "School History",
    about_staff: "Faculty & Staff",
    about_vision: "Vision & Mission",

    // Academics subitems
    academics_overview: "Curricula & Courses",
    academics_challenges: "Assessments & Challenges",
    academics_aitutor: "AI Tutor Support",
    academics_library: "Salheen Digital Library & Reading",

    // Extracurriculars subitems
    extra_league: "School Soccer League",
    extra_clubs: "Creative Activities & Clubs",
    extra_events: "Upcoming Events & Schedule",
    extra_podcast: "School Podcast & Radio Hub",

    // Alumni subitems
    alumni_grid: "Salheen Alumni Network",
    alumni_honour: "Honor Roll Grid",

    // Settings
    profileSettings: "Profile Settings & Language Options",
    currentPerformance: "Current Account Summary & Badges",
    changeLanguage: "Interface Language Preference",
    chooseLanguage: "Choose System Language",
    arabic: "العربية (RTL)",
    english: "English (LTR)",
    confirmLogout: "Logout & Terminate Active Session",
    verifiedEmail: "Verified Email Address",
    nationalId: "Student National ID",
    totalPoints: "Cumulative Points",
    streak: "Active Continuous Streak",
    days: "Consecutive Days",
    subject: "Teaching Subject",
    teacherCode: "Teacher Authorization Code",
    unspecified: "Not Set",
    parentChildren: "Monitored Students",
    parentChildrenSubtext: "Their athletic and academic performance is tracked automatically via their National ID.",
    recentSessions: "Recent Sessions & Login History",
    noRecentSessions: "No recent system logins detected.",
    anonymousUserText: "Please authenticate or register with the cloud-powered database to access your responsive control dashboard.",

    // Form settings
    loginTitle: "Retrieve Workspace Session",
    signupTitle: "Register Certified Digital File",
    authSwitchToSignup: "Don't have a registered card? Sign up here",
    authSwitchToLogin: "Already registered? Login here",
    studentRole: "Salheen Student",
    teacherRole: "Faculty Staff Member",
    parentRole: "Supportive Parent / Guardian",

    // Quick links
    quickLinks: "Quick Links (Site Map)",
    keepInTouch: "Keep In Touch & Support",
    allRightsReserved: "El-Salheen Governmental Language School • All Rights Reserved 2026/2027 • Tailored to Global Academic Benchmarks",
    appFooterDesc: "A prestigious educational institution combining moral values, academic, and technical skills to foster a competitive and innovative generation.",
    address: "Address: Giza, Behind Media Production City",
    phone: "Phone: +20 115 911 4973",
    email: "Email: support@salheen.edu.eg"
  }
};
