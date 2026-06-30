import { useState } from "react";
import { 
  Calendar, 
  Clock, 
  BookOpen, 
  Award, 
  Sparkles, 
  Printer, 
  ChevronRight, 
  BookMarked,
  Layers,
  GraduationCap
} from "lucide-react";

interface Period {
  periodNum: number;
  time: string;
  subject: string;
  teacher: string;
  room: string;
}

interface DaySchedule {
  dayName: string;
  periods: Period[];
}

interface ExamInfo {
  subject: string;
  date: string;
  day: string;
  period: string;
  topics: string[];
  duration: string;
  weight: string;
}

// Complete realistic official schedules for El-Salheen Language School
const SCHEDULE_DATA: Record<string, { days: DaySchedule[]; exams: ExamInfo[] }> = {
  "1A": {
    days: [
      {
        dayName: "الأحد (Sunday)",
        periods: [
          { periodNum: 1, time: "08:00 - 08:45", subject: "اللغة العربية", teacher: "أ. محمود الكردي", room: "معمل 1" },
          { periodNum: 2, time: "08:50 - 09:35", subject: "الرياضيات", teacher: "أ. سارة أحمد", room: "فصل 102" },
          { periodNum: 3, time: "09:40 - 10:25", subject: "اللغة الإنجليزية", teacher: "أ. جين دياب", room: "فصل 102" },
          { periodNum: 4, time: "11:00 - 11:45", subject: "العلوم العامة", teacher: "د. هدى مراد", room: "المختبر الرئيسي" },
          { periodNum: 5, time: "11:50 - 12:35", subject: "الحاسب الآلي", teacher: "أ. ياسر جلال", room: "معمل البرمجة" },
          { periodNum: 6, time: "12:40 - 01:25", subject: "التربية الدينية", teacher: "الشيخ عبد الله", room: "فصل 102" },
        ]
      },
      {
        dayName: "الإثنين (Monday)",
        periods: [
          { periodNum: 1, time: "08:00 - 08:45", subject: "الرياضيات", teacher: "أ. سارة أحمد", room: "فصل 102" },
          { periodNum: 2, time: "08:50 - 09:35", subject: "اللغة الإنجليزية", teacher: "أ. جين دياب", room: "فصل 102" },
          { periodNum: 3, time: "09:40 - 10:25", subject: "اللغة العربية", teacher: "أ. محمود الكردي", room: "فصل 102" },
          { periodNum: 4, time: "11:00 - 11:45", subject: "الدراسات الاجتماعية", teacher: "أ. طارق فاروق", room: "فصل 102" },
          { periodNum: 5, time: "11:50 - 12:35", subject: "التربية الفنية", teacher: "أ. رانيا يسري", room: "مرسم المدرسة" },
          { periodNum: 6, time: "12:40 - 01:25", subject: "التربية البدنية (PE)", teacher: "الكابتن شريف", room: "الملعب الرملي" },
        ]
      },
      {
        dayName: "الثلاثاء (Tuesday)",
        periods: [
          { periodNum: 1, time: "08:00 - 08:45", subject: "العلوم العامة", teacher: "د. هدى مراد", room: "المختبر الرئيسي" },
          { periodNum: 2, time: "08:50 - 09:35", subject: "اللغة الفرنسية", teacher: "مسيو عادل رامي", room: "فصل 102" },
          { periodNum: 3, time: "09:40 - 10:25", subject: "الرياضيات", teacher: "أ. سارة أحمد", room: "فصل 102" },
          { periodNum: 4, time: "11:00 - 11:45", subject: "اللغة العربية", teacher: "أ. محمود الكردي", room: "فصل 102" },
          { periodNum: 5, time: "11:50 - 12:35", subject: "التربية الدينية", teacher: "الشيخ عبد الله", room: "فصل 102" },
          { periodNum: 6, time: "12:40 - 01:25", subject: "التربية الموسيقية", teacher: "أ. منى زكي", room: "غرفة الموسيقى" },
        ]
      },
      {
        dayName: "الأربعاء (Wednesday)",
        periods: [
          { periodNum: 1, time: "08:00 - 08:45", subject: "اللغة الإنجليزية", teacher: "أ. جين دياب", room: "فصل 102" },
          { periodNum: 2, time: "08:50 - 09:35", subject: "اللغة العربية", teacher: "أ. محمود الكردي", room: "فصل 102" },
          { periodNum: 3, time: "09:40 - 10:25", subject: "العلوم العامة", teacher: "د. هدى مراد", room: "المختبر الرئيسي" },
          { periodNum: 4, time: "11:00 - 11:45", subject: "الرياضيات", teacher: "أ. سارة أحمد", room: "فصل 102" },
          { periodNum: 5, time: "11:50 - 12:35", subject: "التربية الوطنية", teacher: "أ. طارق فاروق", room: "فصل 102" },
          { periodNum: 6, time: "12:40 - 01:25", subject: "الحاسب الآلي", teacher: "أ. ياسر جلال", room: "معمل البرمجة" },
        ]
      },
      {
        dayName: "الخميس (Thursday)",
        periods: [
          { periodNum: 1, time: "08:00 - 08:45", subject: "الدراسات الاجتماعية", teacher: "أ. طارق فاروق", room: "فصل 102" },
          { periodNum: 2, time: "08:50 - 09:35", subject: "التربية البدنية (PE)", teacher: "الكابتن شريف", room: "الملعب الرملي" },
          { periodNum: 3, time: "09:40 - 10:25", subject: "اللغة الإنجليزية", teacher: "أ. جين دياب", room: "فصل 102" },
          { periodNum: 4, time: "11:00 - 11:45", subject: "اللغة العربية", teacher: "أ. محمود الكردي", room: "فصل 102" },
          { periodNum: 5, time: "11:50 - 12:35", subject: "المهارات المهنية", teacher: "أ. رانيا يسري", room: "فصل 102" },
          { periodNum: 6, time: "12:40 - 01:25", subject: "مشروع كابستون (Capstone)", teacher: "د. هدى مراد & طاقم التدريس", room: "قاعة الابتكارات" },
        ]
      }
    ],
    exams: [
      { subject: "تقييم الرياضيات الأسبوعي", date: "2026-06-25", day: "الإثنين", period: "الحصة الثالثة", topics: ["الجبر الكسري", "المجموعات الحسابية", "حل المعادلات البسيطة"], duration: "45 دقيقة", weight: "15 درجة" },
      { subject: "اختبار العلوم القصير (Quiz)", date: "2026-06-26", day: "الثلاثاء", period: "الحصة الأولى", topics: ["الخواص الكيميائية للمعادن", "جدول العناصر الرمزي"], duration: "30 دقيقة", weight: "10 درجات" },
      { subject: "إملاء اللغة الإنجليزية الأسبوعي", date: "2026-06-27", day: "الأربعاء", period: "الحصة الثانية", topics: ["Unit 5 (Invention Era) Vocabulary", "Spelling rules"], duration: "20 دقيقة", weight: "5 درجات" },
      { subject: "تقييم اللغة العربية البنيوي", date: "2026-06-28", day: "الخميس", period: "الحصة الرابعة", topics: ["كان وأخواتها", "منصوبات الأسماء", "تحليل نص الصداقة والوفاء"], duration: "45 دقيقة", weight: "15 درجة" },
      { subject: "تقييم التربية الدينية", date: "2026-06-29", day: "الخميس", period: "الحصة الخامسة", topics: ["الأخلاقيات والعبادات"], duration: "40 دقيقة", weight: "10 درجات" }
    ]
  },
  "1B": {
    days: [
      {
        dayName: "الأحد (Sunday)",
        periods: [
          { periodNum: 1, time: "08:00 - 08:45", subject: "الرياضيات", teacher: "أ. سارة أحمد", room: "فصل 103" },
          { periodNum: 2, time: "08:50 - 09:35", subject: "اللغة العربية", teacher: "أ. محمود الكردي", room: "فصل 103" },
          { periodNum: 3, time: "09:40 - 10:25", subject: "العلوم العامة", teacher: "د. هدى مراد", room: "المختبر الرئيسي" },
          { periodNum: 4, time: "11:00 - 11:45", subject: "اللغة الإنجليزية", teacher: "أ. جين دياب", room: "فصل 103" },
          { periodNum: 5, time: "11:50 - 12:35", subject: "التربية الدينية", teacher: "الشيخ عبد الله", room: "فصل 103" },
          { periodNum: 6, time: "12:40 - 01:25", subject: "التربية الفنية", teacher: "أ. رانيا يسري", room: "مرسم المدرسة" },
        ]
      },
      {
        dayName: "الإثنين (Monday)",
        periods: [
          { periodNum: 1, time: "08:00 - 08:45", subject: "اللغة العربية", teacher: "أ. محمود الكردي", room: "فصل 103" },
          { periodNum: 2, time: "08:50 - 09:35", subject: "الدراسات الاجتماعية", teacher: "أ. طارق فاروق", room: "فصل 103" },
          { periodNum: 3, time: "09:40 - 10:25", subject: "الرياضيات", teacher: "أ. سارة أحمد", room: "فصل 103" },
          { periodNum: 4, time: "11:00 - 11:45", subject: "اللغة الإنجليزية", teacher: "أ. جين دياب", room: "فصل 103" },
          { periodNum: 5, time: "11:50 - 12:35", subject: "التربية البدنية (PE)", teacher: "الكابتن شريف", room: "الصالة المغطاة" },
          { periodNum: 6, time: "12:40 - 01:25", subject: "الحاسب الآلي", teacher: "أ. ياسر جلال", room: "معمل البرمجة" },
        ]
      },
      {
        dayName: "الثلاثاء (Tuesday)",
        periods: [
          { periodNum: 1, time: "08:00 - 08:45", subject: "اللغة الإنجليزية", teacher: "أ. جين دياب", room: "فصل 103" },
          { periodNum: 2, time: "08:50 - 09:35", subject: "العلوم العامة", teacher: "د. هدى مراد", room: "المختبر الرئيسي" },
          { periodNum: 3, time: "09:40 - 10:25", subject: "اللغة الفرنسية", teacher: "مسيو عادل رامي", room: "فصل 103" },
          { periodNum: 4, time: "11:00 - 11:45", subject: "الرياضيات", teacher: "أ. سارة أحمد", room: "فصل 103" },
          { periodNum: 5, time: "11:50 - 12:35", subject: "مشروع كابستون (Capstone)", teacher: "د. هدى مراد & طلق التدريس", room: "قاعة الابتكارات" },
          { periodNum: 6, time: "12:40 - 01:25", subject: "التربية الدينية", teacher: "الشيخ عبد الله", room: "فصل 103" },
        ]
      },
      {
        dayName: "الأربعاء (Wednesday)",
        periods: [
          { periodNum: 1, time: "08:00 - 08:45", subject: "اللغة العربية", teacher: "أ. محمود الكردي", room: "فصل 103" },
          { periodNum: 2, time: "08:50 - 09:35", subject: "الرياضيات", teacher: "أ. سارة أحمد", room: "فصل 103" },
          { periodNum: 3, time: "09:40 - 10:25", subject: "اللغة الإنجليزية", teacher: "أ. جين دياب", room: "فصل 103" },
          { periodNum: 4, time: "11:00 - 11:45", subject: "الدراسات الاجتماعية", teacher: "أ. طارق فاروق", room: "فصل 103" },
          { periodNum: 5, time: "11:50 - 12:35", subject: "التربية الموسيقية", teacher: "أ. منى زكي", room: "غرفة الموسيقى" },
          { periodNum: 6, time: "12:40 - 01:25", subject: "التربية الوطنية", teacher: "أ. طارق فاروق", room: "فصل 103" },
        ]
      },
      {
        dayName: "الخميس (Thursday)",
        periods: [
          { periodNum: 1, time: "08:00 - 08:45", subject: "العلوم العامة", teacher: "د. هدى مراد", room: "المختبر الرئيسي" },
          { periodNum: 2, time: "08:50 - 09:35", subject: "الحاسب الآلي", teacher: "أ. ياسر جلال", room: "معمل البرمجة" },
          { periodNum: 3, time: "09:40 - 10:25", subject: "اللغة العربية", teacher: "أ. محمود الكردي", room: "فصل 103" },
          { periodNum: 4, time: "11:00 - 11:45", subject: "التربية البدنية (PE)", teacher: "الكابتن شريف", room: "الملعب الرئيسي" },
          { periodNum: 5, time: "11:50 - 12:35", subject: "اللغة الإنجليزية", teacher: "أ. جين دياب", room: "فصل 103" },
          { periodNum: 6, time: "12:40 - 01:25", subject: "المهارات المهنية", teacher: "أ. رانيا يسري", room: "فصل 103" },
        ]
      }
    ],
    exams: [
      { subject: "تقييم الرياضيات الأسبوعي", date: "2026-06-25", day: "الأحد", period: "الحصة الأولى", topics: ["الجبر الكسري", "المجموعات الحسابية", "حل المعادلات البسيطة"], duration: "45 دقيقة", weight: "15 درجة" },
      { subject: "إملاء اللغة الإنجليزية الأسبوعي", date: "2026-06-27", day: "الإثنين", period: "الحصة الرابعة", topics: ["Unit 5 (Invention Era) Vocabulary", "Spelling"], duration: "25 دقيقة", weight: "5 درجات" },
      { subject: "اختبار العلوم القصير (Quiz)", date: "2026-06-28", day: "الأربعاء", period: "الحصة الثالثة", topics: ["الخواص الكيميائية للمعادن", "العناصر والرموز"], duration: "30 دقيقة", weight: "10 درجات" },
      { subject: "تقييم اللغة العربية البنيوي", date: "2026-06-29", day: "الخميس", period: "الحصة الثالثة", topics: ["كان وأخواتها", "تحليل نص الصداقة"], duration: "45 دقيقة", weight: "15 درجة" },
      { subject: "تقييم التربية الدينية", date: "2026-06-29", day: "الخميس", period: "الحصة الخامسة", topics: ["الأخلاقيات والعبادات"], duration: "40 دقيقة", weight: "10 درجات" }
    ]
  },
  "2A": {
    days: [
      {
        dayName: "الأحد (Sunday)",
        periods: [
          { periodNum: 1, time: "08:00 - 08:45", subject: "الفيزياء الأساسية", teacher: "د. هدى مراد", room: "المختبر الكروي" },
          { periodNum: 2, time: "08:50 - 09:35", subject: "الرياضيات المتقدمة", teacher: "أ. سارة أحمد", room: "فصل 204" },
          { periodNum: 3, time: "09:40 - 10:25", subject: "اللغة الإنجليزية", teacher: "أ. جين دياب", room: "فصل 204" },
          { periodNum: 4, time: "11:00 - 11:45", subject: "اللغة العربية", teacher: "أ. محمود الكردي", room: "فصل 204" },
          { periodNum: 5, time: "11:50 - 12:35", subject: "التكنولوجيا والبرمجة", teacher: "أ. ياسر جلال", room: "معمل البرمجة" },
          { periodNum: 6, time: "12:40 - 01:25", subject: "التربية الدينية", teacher: "الشيخ عبد الله", room: "فصل 204" },
        ]
      },
      {
        dayName: "الإثنين (Monday)",
        periods: [
          { periodNum: 1, time: "08:00 - 08:45", subject: "الرياضيات المتقدمة", teacher: "أ. سارة أحمد", room: "فصل 204" },
          { periodNum: 2, time: "08:50 - 09:35", subject: "اللغة العربية", teacher: "أ. محمود الكردي", room: "فصل 204" },
          { periodNum: 3, time: "09:40 - 10:25", subject: "التاريخ والجغرافيا", teacher: "أ. طارق فاروق", room: "فصل 204" },
          { periodNum: 4, time: "11:00 - 11:45", subject: "اللغة الإنجليزية", teacher: "أ. جين دياب", room: "فصل 204" },
          { periodNum: 5, time: "11:50 - 12:35", subject: "التربية الموسيقية", teacher: "أ. منى زكي", room: "غرفة الموسيقى" },
          { periodNum: 6, time: "12:40 - 01:25", subject: "التربية البدنية (PE)", teacher: "الكابتن شريف", room: "ملعب تارتان" },
        ]
      },
      {
        dayName: "الثلاثاء (Tuesday)",
        periods: [
          { periodNum: 1, time: "08:00 - 08:45", subject: "اللغة الفرنسية / الألمانية", teacher: "مسيو عادل / أ. رغدة", room: "فصل 204" },
          { periodNum: 2, time: "08:50 - 09:35", subject: "الفيزياء الأساسية", teacher: "د. هدى مراد", room: "المختبر الكروي" },
          { periodNum: 3, time: "09:40 - 10:25", subject: "الرياضيات المتقدمة", teacher: "أ. سارة أحمد", room: "فصل 204" },
          { periodNum: 4, time: "11:00 - 11:45", subject: "اللغة العربية", teacher: "أ. محمود الكردي", room: "فصل 204" },
          { periodNum: 5, time: "11:50 - 12:35", subject: "التربية الوطنية والمدنية", teacher: "أ. طارق فاروق", room: "فصل 204" },
          { periodNum: 6, time: "12:40 - 01:25", subject: "التربية الدينية", teacher: "الشيخ عبد الله", room: "فصل 204" },
        ]
      },
      {
        dayName: "الأربعاء (Wednesday)",
        periods: [
          { periodNum: 1, time: "08:00 - 08:45", subject: "اللغة العربية", teacher: "أ. محمود الكردي", room: "فصل 204" },
          { periodNum: 2, time: "08:50 - 09:35", subject: "اللغة الإنجليزية", teacher: "أ. جين دياب", room: "فصل 204" },
          { periodNum: 3, time: "09:40 - 10:25", subject: "الرياضيات المتقدمة", teacher: "أ. سارة أحمد", room: "فصل 204" },
          { periodNum: 4, time: "11:00 - 11:45", subject: "التكنولوجيا والبرمجة", teacher: "أ. ياسر جلال", room: "معمل البرمجة" },
          { periodNum: 5, time: "11:50 - 12:35", subject: "التربية البدنية (PE)", teacher: "الكابتن شريف", room: "ملعب تارتان" },
          { periodNum: 6, time: "12:40 - 01:25", subject: "التربية الفنية", teacher: "أ. رانيا يسري", room: "مرسم المدرسة" },
        ]
      },
      {
        dayName: "الخميس (Thursday)",
        periods: [
          { periodNum: 1, time: "08:00 - 08:45", subject: "اللغة الإنجليزية", teacher: "أ. جين دياب", room: "فصل 204" },
          { periodNum: 2, time: "08:50 - 09:35", subject: "التاريخ والجغرافيا", teacher: "أ. طارق فاروق", room: "فصل 204" },
          { periodNum: 3, time: "09:40 - 10:25", subject: "الفيزياء الأساسية", teacher: "د. هدى مراد", room: "المختبر الكروي" },
          { periodNum: 4, time: "11:00 - 11:45", subject: "مشروع كابستون (Capstone)", teacher: "د. هدى مراد & طاقم التدريس", room: "قاعة الابتكارات" },
          { periodNum: 5, time: "11:50 - 12:35", subject: "اللغة العربية", teacher: "أ. محمود الكردي", room: "فصل 204" },
          { periodNum: 6, time: "12:40 - 01:25", subject: "المطالعة الحرة والمكتبة", teacher: "الشيخة هالة", room: "مكتبة الصالحين" },
        ]
      }
    ],
    exams: [
      { subject: "تقييم الرياضيات المتقدمة الشهري", date: "2026-06-25", day: "الإثنين", period: "الحصة الأولى", topics: ["المتراجحات من الدرجة الثانية", "علم المثلثات التفاعلي"], duration: "45 دقيقة", weight: "20 درجة" },
      { subject: "تقييم الفيزياء والترابط المادي", date: "2026-06-27", day: "الثلاثاء", period: "الحصة الثانية", topics: ["قوانين نيوتن وحساب الاحتكاك", "انتقال الحركة"], duration: "45 دقيقة", weight: "15 درجة" },
      { subject: "تسميع واختبار اللغة الفرنسية", date: "2026-06-28", day: "الأربعاء", period: "الحصة الأولى", topics: ["Le dialogue social", "Passé composé rules"], duration: "25 دقيقة", weight: "10 درجات" },
      { subject: "تقييم التربية الدينية", date: "2026-06-29", day: "الخميس", period: "الحصة الخامسة", topics: ["الأخلاقيات والعبادات"], duration: "40 دقيقة", weight: "10 درجات" }
    ]
  },
  "2B": {
    days: [
      {
        dayName: "الأحد (Sunday)",
        periods: [
          { periodNum: 1, time: "08:00 - 08:45", subject: "الرياضيات المتقدمة", teacher: "أ. سارة أحمد", room: "فصل 205" },
          { periodNum: 2, time: "08:50 - 09:35", subject: "اللغة العربية", teacher: "أ. محمود الكردي", room: "فصل 205" },
          { periodNum: 3, time: "09:40 - 10:25", subject: "التكنولوجيا والبرمجة", teacher: "أ. ياسر جلال", room: "معمل البرمجة" },
          { periodNum: 4, time: "11:00 - 11:45", subject: "التربية الدينية", teacher: "الشيخ عبد الله", room: "فصل 205" },
          { periodNum: 5, time: "11:50 - 12:35", subject: "اللغة الإنجليزية", teacher: "أ. جين دياب", room: "فصل 205" },
          { periodNum: 6, time: "12:40 - 01:25", subject: "التربية الفنية", teacher: "أ. رانيا يسري", room: "مرسم المدرسة" },
        ]
      },
      {
        dayName: "الإثنين (Monday)",
        periods: [
          { periodNum: 1, time: "08:00 - 08:45", subject: "اللغة الإنجليزية", teacher: "أ. جين دياب", room: "فصل 205" },
          { periodNum: 2, time: "08:50 - 09:35", subject: "الفيزياء الأساسية", teacher: "د. هدى مراد", room: "المختبر الكروي" },
          { periodNum: 3, time: "09:40 - 10:25", subject: "الرياضيات المتقدمة", teacher: "أ. سارة أحمد", room: "فصل 205" },
          { periodNum: 4, time: "11:00 - 11:45", subject: "التاريخ والجغرافيا", teacher: "أ. طارق فاروق", room: "فصل 205" },
          { periodNum: 5, time: "11:50 - 12:35", subject: "التربية الدينية", teacher: "الشيخ عبد الله", room: "فصل 205" },
          { periodNum: 6, time: "12:40 - 01:25", subject: "التربية الموسيقية", teacher: "أ. منى زكي", room: "غرفة الموسيقى" },
        ]
      },
      {
        dayName: "الثلاثاء (Tuesday)",
        periods: [
          { periodNum: 1, time: "08:00 - 08:45", subject: "اللغة العربية", teacher: "أ. محمود الكردي", room: "فصل 205" },
          { periodNum: 2, time: "08:50 - 09:35", subject: "اللغة الإنجليزية", teacher: "أ. جين دياب", room: "فصل 205" },
          { periodNum: 3, time: "09:40 - 10:25", subject: "اللغة الفرنسية / الألمانية", teacher: "مسيو عادل / أ. رغدة", room: "فصل 205" },
          { periodNum: 4, time: "11:00 - 11:45", subject: "الرياضيات المتقدمة", teacher: "أ. سارة أحمد", room: "فصل 205" },
          { periodNum: 5, time: "11:50 - 12:35", subject: "التربية البدنية (PE)", teacher: "الكابتن شريف", room: "ملعب كرة السلة" },
          { periodNum: 6, time: "12:40 - 01:25", subject: "التربية الوطنية والمدنية", teacher: "أ. طارق فاروق", room: "فصل 205" },
        ]
      },
      {
        dayName: "الأربعاء (Wednesday)",
        periods: [
          { periodNum: 1, time: "08:00 - 08:45", subject: "الفيزياء الأساسية", teacher: "د. هدى مراد", room: "المختبر الكروي" },
          { periodNum: 2, time: "08:50 - 09:35", subject: "الرياضيات المتقدمة", teacher: "أ. سارة أحمد", room: "فصل 205" },
          { periodNum: 3, time: "09:40 - 10:25", subject: "اللغة العربية", teacher: "أ. محمود الكردي", room: "فصل 205" },
          { periodNum: 4, time: "11:00 - 11:45", subject: "التكنولوجيا والبرمجة", teacher: "أ. ياسر جلال", room: "معمل البرمجة" },
          { periodNum: 5, time: "11:50 - 12:35", subject: "المطالعة والمخيلة", teacher: "الشيخة هالة", room: "مكتبة الصالحين" },
          { periodNum: 6, time: "12:40 - 01:25", subject: "التربية البدنية (PE)", teacher: "الكابتن شريف", room: "الملعب الرملي" },
        ]
      },
      {
        dayName: "الخميس (Thursday)",
        periods: [
          { periodNum: 1, time: "08:00 - 08:45", subject: "اللغة العربية", teacher: "أ. محمود الكردي", room: "فصل 205" },
          { periodNum: 2, time: "08:50 - 09:35", subject: "اللغة الإنجليزية", teacher: "أ. جين دياب", room: "فصل 205" },
          { periodNum: 3, time: "09:40 - 10:25", subject: "مشروع كابستون (Capstone)", teacher: "د. هدى مراد & طاقم التدريس", room: "قاعة الابتكارات" },
          { periodNum: 4, time: "11:00 - 11:45", subject: "الفيزياء الأساسية", teacher: "د. هدى مراد", room: "المختبر الكروي" },
          { periodNum: 5, time: "11:50 - 12:35", subject: "التاريخ والجغرافيا", teacher: "أ. طارق فاروق", room: "فصل 205" },
          { periodNum: 6, time: "12:40 - 01:25", subject: "التربية الموسيقية", teacher: "أ. منى زكي", room: "غرفة الموسيقى" },
        ]
      }
    ],
    exams: [
      { subject: "تقييم الرياضيات المتقدمة الشهري", date: "2026-06-25", day: "الأحد", period: "الحصة الأولى", topics: ["المتراجحات من الدرجة الثانية", "علم المثلثات التفاعلي"], duration: "45 دقيقة", weight: "20 درجة" },
      { subject: "تقييم الفيزياء والترابط المادي", date: "2026-06-27", day: "الإثنين", period: "الحصة الثانية", topics: ["قوانين نيوتن وحساب الاحتكاك", "انتقال الحركة"], duration: "45 دقيقة", weight: "15 درجة" },
      { subject: "تسميع واختبار اللغة الفرنسية", date: "2026-06-28", day: "الثلاثاء", period: "الحصة الثالثة", topics: ["Le dialogue social", "Passé composé"], duration: "25 دقيقة", weight: "10 درجات" },
      { subject: "تقييم التربية الدينية", date: "2026-06-29", day: "الخميس", period: "الحصة الخامسة", topics: ["الأخلاقيات والعبادات"], duration: "40 دقيقة", weight: "10 درجات" }
    ]
  }
};

const TRANSLATION_MAP: Record<string, string> = {
  // Day names
  "الأحد (Sunday)": "Sunday",
  "الإثنين (Monday)": "Monday",
  "الثلاثاء (Tuesday)": "Tuesday",
  "الأربعاء (Wednesday)": "Wednesday",
  "الخميس (Thursday)": "Thursday",

  // Subjects
  "اللغة العربية": "Arabic Language",
  "الرياضيات": "Mathematics",
  "اللغة الإنجليزية": "English Language",
  "العلوم العامة": "General Science",
  "الحاسب الآلي": "Computer & AI",
  "التربية الدينية": "Religious Education",
  "التربية الدينية الإسلامية": "Islamic Religious Education",
  "التربية الدينية المسيحية": "Christian Religious Education",
  "الدراسات الاجتماعية": "Social Studies",
  "التربية الفنية": "Art Education",
  "التربية البدنية (PE)": "Physical Education (PE)",
  "المهارات المهنية": "Vocational Skills",
  "التربية الموسيقية": "Music Education",
  "التربية الوطنية والمدنية": "National & Civic Education",
  "تكنولوجيا المعلومات والاتصالات (ICT)": "ICT",
  "اللغة الفرنسية / الألمانية": "French / German",
  "التكنولوجيا والبرمجة": "Technology & Programming",
  "الفيزياء الأساسية": "Basic Physics",
  "الرياضيات المتقدمة": "Advanced Mathematics",
  "التاريخ والجغرافيا": "History & Geography",
  "المطالعة والمخيلة": "Reading & Imagination",
  "التربية القومية": "National Education",
  "المطالعة الحرة والمكتبة": "Free Reading & Library",
  "مشروع كابستون (Capstone)": "Capstone Project",

  // Teachers
  "أ. محمود الكردي": "Mr. Mahmoud El-Kordi",
  "أ. سارة أحمد": "Mrs. Sarah Ahmed",
  "أ. جين دياب": "Mrs. Jane Diab",
  "د. هدى مراد": "Dr. Hoda Morad",
  "أ. ياسر جلال": "Mr. Yasser Galal",
  "الشيخ عبد الله": "Sheikh Abdullah",
  "مس كاترين شوقي": "Ms. Catherine Shawky",
  "أ. طارق فاروق": "Mr. Tarek Farouk",
  "أ. رانيا يسري": "Mrs. Rania Youssri",
  "الكابتن شريف": "Captain Sherif",
  "الشيخة هالة": "Sheikha Hala",
  "مسيو عادل / أ. رغدة": "Mr. Adel / Mrs. Raghda",
  "أ. منى زكي": "Mrs. Mona Zaki",
  "د. هدى مراد & طاقم التدريس": "Dr. Hoda Morad & Staff",

  // Rooms
  "معمل 1": "Lab 1",
  "فصل 102": "Class 102",
  "فصل 103": "Class 103",
  "المختبر الرئيسي": "Main Lab",
  "معمل البرمجة": "Programming Lab",
  "مرسم المدرسة": "School Studio",
  "ملعب كرة السلة": "Basketball Court",
  "الملعب الرملي": "Sandy Field",
  "مكتبة الصالحين": "Salheen Library",
  "فصل 204": "Class 204",
  "فصل 205": "Class 205",
  "قاعة الابتكارات": "Innovation Hall",
  "المختبر الكروي": "Spherical Lab",
  "غرفة الموسيقى": "Music Room",

  // General Exam Subject assessment mappings
  "تقييم الرياضيات الأسبوعي": "Weekly Mathematics Assessment",
  "اختبار العلوم القصير (Quiz)": "Science Quiz",
  "تقييم الرياضيات المتقدمة الشهري": "Monthly Advanced Math Assessment",
  "تقييم الفيزياء والترابط المادي": "Physics Assessment",
  "تسميع واختبار اللغة الفرنسية": "French Language Quiz",
  "تقييم التربية الدينية": "Religious Education Quiz",
  "تقييم التربية الدينية الإسلامية": "Islamic Education Quiz",
  "تقييم التربية الدينية المسيحية": "Christian Education Quiz",

  // Days
  "الأحد": "Sunday",
  "الإثنين": "Monday",
  "الثلاثاء": "Tuesday",
  "الأربعاء": "Wednesday",
  "الخميس": "Thursday",

  // Period
  "الحصة الأولى": "1st Period",
  "الحصة الثانية": "2nd Period",
  "الحصة الثالثة": "3rd Period",
  "الحصة الرابعة": "4th Period",
  "الحصة الخامسة": "5th Period",
  "الحصة السادسة": "6th Period",

  // Exam topic chips
  "الجبر الكسري": "Fractional Algebra",
  "المجموعات الحسابية": "Arithmetic Sets",
  "حل المعادلات البسيطة": "Solving Simple Equations",
  "الخواص الكيميائية للمعادن": "Chemical Properties of Metals",
  "جدول العناصر الرمزي": "Symbolic Periodic Table",
  "العناصر والرموز": "Elements & Symbols",
  "المتراجحات من الدرجة الثانية": "Second-Degree Inequalities",
  "علم المثلثات التفاعلي": "Interactive Trigonometry",
  "قوانين نيوتن وحساب الاحتكاك": "Newton's Laws & Friction",
  "انتقال الحركة": "Motion Transmission",
  "Le dialogue social": "Le dialogue social",
  "Passé composé rules": "Passé composed rules",
  "Passé composé": "Passé composé",
  "الأخلاقيات والعبادات": "Ethics & Worship",
  "الوصايا العشر وكتاب المزامير": "The Ten Commandments & Psalms",
  "قيم المحبة والسلام": "Values of Love & Peace",
  "القرآن الكريم (سورة لقمان وهود)": "Holy Quran (Surah Luqman & Hud)",
  "الرسل والأنبياء الكرام": "The Honorable Messengers & Prophets",

  // General UI labels
  "رسمي ومحدث": "Official & Updated",
  "متابعة الابن: ": "Student Monitor: ",
  "جداول الحصص والامتحانات الأسبوعية الرسمية": "Official Weekly Class & Exam Schedules",
  "رصد زمني دقيق للمساقات والتقييمات موزعة حسب الفروع لضمان جودة الاستذكار والمراقبة المنزلية": "Precise scheduling of courses and assessments to ensure homework follow-up and domestic monitoring.",
  "جدول الحصص": "Class Schedule",
  "جدول امتحانات الأسبوع": "Weekly Exam Schedule",
  "الفصل الدراسي المعروض:": "Displayed Class:",
  "زمن الحصة: 45 دقيقة • استراحة الصالحين الكبرى: من 10:25 إلى 11:00 صباحاً": "Period: 45 mins • Main Break: 10:25 to 11:00 AM",
  "اليوم / الحصة": "Day / Period",
  "الاولى": "1st Period",
  "الثانية": "2nd Period",
  "الثالثة": "3rd Period",
  "الرابعة": "4th Period",
  "الخامسة": "5th Period",
  "السادسة": "6th Period",
  "طابور واستراحة كبرى": "Assembly & Main Recess",
  "وجبات وتغذية صحية": "Healthy School Meals",
  "أخلاقيات الالتزام والتحصيل الذكي بالصالحين:": "Commitment & Academic Integrity Code:",
  "يُنصح أولياء الأمور بالتأكد من مغادرة الطلاب لمنازلهم بحلول الساعة 07:30 صباحاً لحضور طابور الصباح والإذاعة المدرسية وحب الرصد الرياضي المشترك. الغياب غير المبرر يؤدي إلى خصم نقاط تفاعل الفصل الدراسي التراكمية.": "Parents are urged to ensure students leave home by 07:30 AM to attend the morning assembly, broadcast, and team-building exercises. Unexcused absence deducts cumulative class activity points.",
  "لا توجد تقييمات أو امتحانات أسبوعية مقررة حالياً لهذا الفصل.": "No examinations are currently scheduled for this class.",
  "الموضوعات والمحاور المدرجة بالامتحان:": "Exam Topics & Covered Themes:",
  "تأريخ التقييم: ": "Assessment Date: ",
  "درجته تضاف لنقاط الطالب والفصل": "Score is added to Student & Class cumulative totals",
  "مركز الامتحانات الأسبوعية القياسية ومسابقة الفصول الكبرى": "Weekly Assessments Center & Class Grand Cup",
  "كافة تقييمات الحصص وسلسلة الاختبارات الأسبوعية تعد مصدراً مهماً لكسب نقاط الطالب ومضاعفتها لترجيح فريقه الرياضي أو فريقه الأكاديمي وصعود فصله الدراسي (مثال: فصل ": "Every class rubric and weekly quiz is a vital channel to earn dynamic student points, helping boost your class (e.g. Class ",
  ") على لائحة الصدارة العامة للجامعة والمدرسة.": ") in the school's general leadership boards."
};

interface WeeklyScheduleProps {
  defaultClassId?: string;
  isParentView?: boolean;
  parentSelectedChildName?: string;
  lang?: "ar" | "en";
}

export default function WeeklySchedule({ 
  defaultClassId = "1A", 
  isParentView = false, 
  parentSelectedChildName,
  lang = "ar"
}: WeeklyScheduleProps) {
  const [activeClassId, setActiveClassId] = useState<string>(defaultClassId);
  const [activeSection, setActiveSection] = useState<"classes" | "exams">("classes");
  const [hoveredPeriod, setHoveredPeriod] = useState<string | null>(null);
  const [religionPref, setReligionPref] = useState<"islamic" | "christian">("islamic");

  const activeSchedule = SCHEDULE_DATA[activeClassId] || SCHEDULE_DATA["1A"];

  const isAr = lang === "ar";
  const translate = (val: string) => {
    if (!val) return "";
    if (isAr) {
      if (val.includes(" (")) {
        return val.split(" (")[0];
      }
      return val;
    }
    return TRANSLATION_MAP[val] || val;
  };

  const getDynamicPeriodData = (per: Period) => {
    if (per.subject === "التربية الدينية") {
      if (religionPref === "christian") {
        return {
          subject: "التربية الدينية المسيحية",
          teacher: "مس كاترين شوقي",
          room: per.room
        };
      } else {
        return {
          subject: "التربية الدينية الإسلامية",
          teacher: "الشيخ عبد الله",
          room: per.room
        };
      }
    }
    return per;
  };

  const getDynamicExamData = (ex: any) => {
    if (ex.subject === "تقييم التربية الدينية") {
      if (religionPref === "christian") {
        return {
          ...ex,
          subject: "تقييم التربية الدينية المسيحية",
          topics: isAr 
            ? ["الوصايا العشر وكتاب المزامير", "قيم المحبة والسلام"] 
            : ["The Ten Commandments", "Values of Love & Peace"]
        };
      } else {
        return {
          ...ex,
          subject: "تقييم التربية الدينية الإسلامية",
          topics: isAr 
            ? ["القرآن الكريم (سورة لقمان وهود)", "الرسل والأنبياء الكرام"] 
            : ["Holy Quran (Surah Luqman)", "Prophets & Messengers"]
        };
      }
    }
    return ex;
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className={`rounded-2xl border border-indigo-500/15 bg-slate-900/80 p-6 shadow-xl backdrop-blur-xl space-y-6 font-sans ${isAr ? "text-right" : "text-left"}`} dir={isAr ? "rtl" : "ltr"}>
      
      {/* Header: Title and switch elements */}
      <div className="border-b border-slate-800 pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex rounded-full bg-cyan-500/10 px-2.5 py-0.5 text-[9px] font-black text-cyan-400 capitalize tracking-wider">
              {translate("رسمي ومحدث")}
            </span>
            {isParentView && (
              <span className="inline-flex rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[9px] font-black text-emerald-400">
                {translate("متابعة الابن: ")}{parentSelectedChildName || (isAr ? "المحدد" : "Selected")}
              </span>
            )}
          </div>
          <h3 className="font-display text-base font-black text-white flex items-center gap-2">
            <Calendar className="h-5 w-5 text-cyan-400 shrink-0" />
            {translate("جداول الحصص والامتحانات الأسبوعية الرسمية")}
          </h3>
          <p className="text-[10px] text-slate-400">
            {translate("رصد زمني دقيق للمساقات والتقييمات موزعة حسب الفروع لضمان جودة الاستذكار والمراقبة المنزلية")}
          </p>
        </div>

        {/* Section Action buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => setActiveSection("classes")}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer border ${
              activeSection === "classes"
                ? "bg-gradient-to-r from-sky-500/10 to-cyan-500/10 border-cyan-500/30 text-cyan-400"
                : "bg-slate-950 border-slate-850 text-slate-400 hover:text-slate-200"
            }`}
          >
            {translate("جدول الحصص")}
          </button>
          <button
            onClick={() => setActiveSection("exams")}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer border ${
              activeSection === "exams"
                ? "bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border-yellow-500/30 text-yellow-400"
                : "bg-slate-950 border-slate-850 text-slate-400 hover:text-slate-200"
            }`}
          >
            {translate("جدول امتحانات الأسبوع")}
          </button>
          
          <button
            onClick={handlePrint}
            className="p-2 rounded-xl bg-slate-950 border border-slate-850 text-slate-400 hover:text-slate-200 hover:border-slate-700 transition-all cursor-pointer"
            title={isAr ? "طباعة الجدول" : "Print Schedule"}
          >
            <Printer className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Classroom Filter Line (Except when locked by user or parent selection, but we always allow browsing with visual focus) */}
      <div className="bg-slate-950 border border-slate-850/60 p-3 rounded-xl flex items-center justify-between flex-wrap gap-4 select-none">
        <div className="flex items-center gap-1.5 flex-wrap">
          <Layers className="h-4 w-4 text-cyan-400 shrink-0" />
          <span className="text-[11px] font-bold text-slate-300">{translate("الفصل الدراسي المعروض:")}</span>
          <div className="flex gap-1.5">
            {["1A", "1B", "2A", "2B"].map((cls) => (
              <button
                key={cls}
                onClick={() => setActiveClassId(cls)}
                className={`px-3 py-1 text-xs font-black rounded-lg border transition-all cursor-pointer ${
                  activeClassId === cls
                    ? "bg-cyan-500/10 border-cyan-500/40 text-cyan-300"
                    : "bg-slate-900 border-slate-850 text-slate-400 hover:text-slate-200"
                }`}
              >
                {cls}
              </button>
            ))}
          </div>

          <div className="h-4 w-px bg-slate-805 mx-2 hidden sm:block" />

          {/* Religion Toggler */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold text-slate-300">{isAr ? "التربية الدينية المعروضة:" : "Religion Class:"}</span>
            <div className="flex gap-1 bg-slate-900 p-0.5 rounded-lg border border-slate-800">
              <button
                type="button"
                onClick={() => setReligionPref("islamic")}
                className={`px-2 py-0.5 text-[9px] font-black rounded transition-all cursor-pointer ${
                  religionPref === "islamic"
                    ? "bg-amber-500/15 border border-amber-500/30 text-amber-400"
                    : "text-slate-400 hover:text-slate-250"
                }`}
              >
                🌙 {isAr ? "إسلامية" : "Islamic"}
              </button>
              <button
                type="button"
                onClick={() => setReligionPref("christian")}
                className={`px-2 py-0.5 text-[9px] font-black rounded transition-all cursor-pointer ${
                  religionPref === "christian"
                    ? "bg-sky-500/15 border border-sky-500/30 text-sky-400"
                    : "text-slate-400 hover:text-slate-250"
                }`}
              >
                ✝️ {isAr ? "مسيحية" : "Christian"}
              </button>
            </div>
          </div>
        </div>

        <div className={`text-[10px] text-slate-500 font-semibold leading-relaxed flex items-center gap-1.5 ${isAr ? "justify-end" : "justify-start"}`}>
          <Clock className="h-3.5 w-3.5 text-cyan-400" />
          <span>{translate("زمن الحصة: 45 دقيقة • استراحة الصالحين الكبرى: من 10:25 إلى 11:00 صباحاً")}</span>
        </div>
      </div>

      {/* RENDER SECTION: CLASSES */}
      {activeSection === "classes" && (
        <div className="space-y-4">
          <div className="overflow-x-auto rounded-xl border border-slate-850 bg-slate-950/40">
            <table className={`w-full border-collapse min-w-[700px] ${isAr ? "text-right" : "text-left"}`}>
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/80 text-[11px] font-black text-[#c5a85c]">
                  <th className="p-4 w-32 border-l border-slate-850">{translate("اليوم / الحصة")}</th>
                  <th className="p-3 text-center border-l border-slate-850">
                    <div className="text-[11px] font-black text-white">{translate("الاولى")}</div>
                    <div className="text-[8px] text-slate-500 font-mono mt-0.5">08:00 - 08:45</div>
                  </th>
                  <th className="p-3 text-center border-l border-slate-850">
                    <div className="text-[11px] font-black text-white">{translate("الثانية")}</div>
                    <div className="text-[8px] text-slate-500 font-mono mt-0.5">08:50 - 09:35</div>
                  </th>
                  <th className="p-3 text-center border-l border-slate-850">
                    <div className="text-[11px] font-black text-white">{translate("الثالثة")}</div>
                    <div className="text-[8px] text-slate-500 font-mono mt-0.5">09:40 - 10:25</div>
                  </th>
                  {/* Break space column */}
                  <th className="p-3 text-center border-l border-slate-850 bg-slate-900/40 font-display text-[10px] font-black text-indigo-400 select-none w-20 vertical-header">
                    {translate("طابور واستراحة كبرى")}
                  </th>
                  <th className="p-3 text-center border-l border-slate-850">
                    <div className="text-[11px] font-black text-white">{translate("الرابعة")}</div>
                    <div className="text-[8px] text-slate-500 font-mono mt-0.5">11:00 - 11:45</div>
                  </th>
                  <th className="p-3 text-center border-l border-slate-850">
                    <div className="text-[11px] font-black text-white">{translate("الخامسة")}</div>
                    <div className="text-[8px] text-slate-500 font-mono mt-0.5">11:50 - 12:35</div>
                  </th>
                  <th className="p-3 text-center">
                    <div className="text-[11px] font-black text-white">{translate("السادسة")}</div>
                    <div className="text-[8px] text-slate-500 font-mono mt-0.5">12:40 - 01:25</div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {activeSchedule.days.map((day, dIdx) => (
                  <tr 
                    key={dIdx} 
                    className={`border-b border-slate-900 font-bold hover:bg-slate-900/10 transition-colors text-xs text-slate-300 ${
                      dIdx % 2 === 1 ? "bg-slate-900/20" : ""
                    }`}
                  >
                    <td className="p-4 border-l border-slate-800 bg-slate-950/40 text-slate-200 font-black text-[11px]">
                      {translate(day.dayName)}
                    </td>
                    
                    {/* First 3 Periods */}
                    {day.periods.slice(0, 3).map((per, pIdx) => {
                      const dPer = getDynamicPeriodData(per);
                      const hoverId = `${dIdx}-${pIdx}`;
                      const isHovered = hoveredPeriod === hoverId;
                      return (
                        <td 
                          key={pIdx} 
                          className="p-3 text-center border-l border-slate-900 relative transition-all"
                          onMouseEnter={() => setHoveredPeriod(hoverId)}
                          onMouseLeave={() => setHoveredPeriod(null)}
                        >
                          <div className="space-y-0.5">
                            <span className="text-[11px] font-extrabold text-white block">{translate(dPer.subject)}</span>
                            <span className="text-[9px] text-slate-450 block truncate max-w-[120px] mx-auto">{translate(dPer.teacher)}</span>
                            <span className="text-[8.5px] rounded-md bg-slate-900/60 border border-slate-850/60 px-1.5 py-0.5 text-cyan-400 font-mono inline-block mt-1">{translate(dPer.room)}</span>
                          </div>

                          {isHovered && (
                            <div className="absolute inset-0 bg-cyan-500/5 pointer-events-none border border-cyan-500/20 rounded-md"></div>
                          )}
                        </td>
                      );
                    })}

                    {/* Permanent Break row spacer */}
                    <td className="p-3 text-center border-l border-slate-900 bg-indigo-500/5 text-[9.5px] text-indigo-300/80 font-black leading-relaxed font-sans w-20">
                      {translate("وجبات وتغذية صحية")}
                    </td>

                    {/* Last 3 Periods */}
                    {day.periods.slice(3, 6).map((per, pIdx) => {
                      const dPer = getDynamicPeriodData(per);
                      const actualIdx = pIdx + 3;
                      const hoverId = `${dIdx}-${actualIdx}`;
                      const isHovered = hoveredPeriod === hoverId;
                      return (
                        <td 
                          key={actualIdx} 
                          className="p-3 text-center border-l border-slate-900 relative transition-all"
                          onMouseEnter={() => setHoveredPeriod(hoverId)}
                          onMouseLeave={() => setHoveredPeriod(null)}
                        >
                          <div className="space-y-0.5">
                            <span className="text-[11px] font-extrabold text-white block">{translate(dPer.subject)}</span>
                            <span className="text-[9px] text-slate-450 block truncate max-w-[120px] mx-auto">{translate(dPer.teacher)}</span>
                            <span className="text-[8.5px] rounded-md bg-slate-900/60 border border-slate-850/60 px-1.5 py-0.5 text-cyan-400 font-mono inline-block mt-1">{translate(dPer.room)}</span>
                          </div>

                          {isHovered && (
                            <div className="absolute inset-0 bg-cyan-500/5 pointer-events-none border border-cyan-500/20 rounded-md"></div>
                          )}
                        </td>
                      );
                    })}

                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="rounded-xl bg-slate-950/60 border border-slate-850 p-4 space-y-2 text-[10.5px] text-slate-400 leading-relaxed font-semibold">
            <h5 className="font-bold text-white text-xs flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-[#c5a85c]" />
              {translate("أخلاقيات الالتزام والتحصيل الذكي بالصالحين:")}
            </h5>
            <p>
              {translate("يُنصح أولياء الأمور بالتأكد من مغادرة الطلاب لمنازلهم بحلول الساعة 07:30 صباحاً لحضور طابور الصباح والإذاعة المدرسية وحب الرصد الرياضي المشترك. الغياب غير المبرر يؤدي إلى خصم نقاط تفاعل الفصل الدراسي التراكمية.")}
            </p>
          </div>
        </div>
      )}

      {/* RENDER SECTION: EXAMS */}
      {activeSection === "exams" && (
        <div className="space-y-4 font-sans">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeSchedule.exams.length === 0 ? (
              <p className="p-8 text-center text-xs text-slate-500 font-bold bg-slate-950 border border-slate-900 rounded-xl">
                {translate("لا توجد تقييمات أو امتحانات أسبوعية مقررة حالياً لهذا الفصل.")}
              </p>
            ) : (
              activeSchedule.exams.map((ex, exIdx) => {
                const dEx = getDynamicExamData(ex);
                return (
                  <div 
                    key={exIdx} 
                    className="rounded-xl border border-yellow-500/10 hover:border-yellow-500/30 bg-slate-950/80 p-5 space-y-4 transition-all relative overflow-hidden group"
                  >
                    <div className="absolute top-0 left-0 bg-yellow-500/10 px-2.5 py-1 text-[9px] text-yellow-400 rounded-br-lg font-black font-mono">
                      {translate(dEx.duration)}
                    </div>

                    <div className="flex justify-start items-center gap-2.5">
                      <div className="h-10 w-10 rounded-xl bg-yellow-505/10 border border-yellow-500/20 flex items-center justify-center text-yellow-400">
                        <BookMarked className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-white group-hover:text-yellow-400 transition-colors">{translate(dEx.subject)}</h4>
                        <p className="text-[10px] text-slate-400 font-semibold">
                          {translate(dEx.day)} • {translate(dEx.period)} • {translate(dEx.weight)}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-1.5 pt-2 border-t border-slate-900/60">
                      <span className="text-[10px] text-[#c5a85c] font-black block">{translate("الموضوعات والمحاور المدرجة بالامتحان:")}</span>
                      <div className="flex flex-wrap gap-1.5">
                        {dEx.topics.map((top: string, tIdx: number) => (
                          <span 
                            key={tIdx} 
                            className="text-[9.5px] font-bold bg-slate-900 border border-slate-800 text-slate-350 px-2 py-0.5 rounded-md"
                          >
                            {translate(top)}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-[9px] text-slate-500 pt-1 font-mono">
                      <span>{translate("تأريخ التقييم: ")}{dEx.date}</span>
                      <span className="text-[8.5px] font-sans font-extrabold text-cyan-400 flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping"></span>
                        {translate("درجته تضاف لنقاط الطالب والفصل")}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="rounded-xl border border-[#c5a85c]/20 bg-[#c5a85c]/5 p-4 flex items-start gap-3">
            <Award className="h-5 w-5 text-[#c5a85c] shrink-0 mt-0.5" />
            <div className={`space-y-1 text-xs leading-relaxed ${isAr ? "text-right" : "text-left"}`}>
              <h5 className="font-extrabold text-white">{translate("مركز الامتحانات الأسبوعية القياسية ومسابقة الفصول الكبرى")}</h5>
              <p className="text-[11px] text-slate-350 font-semibold font-sans">
                {translate("كافة تقييمات الحصص وسلسلة الاختبارات الأسبوعية تعد مصدراً مهماً لكسب نقاط الطالب ومضاعفتها لترجيح فريقه الرياضي أو فريقه الأكاديمي وصعود فصله الدراسي (مثال: فصل ")}
                {activeClassId}
                {translate(") على لائحة الصدارة العامة للجامعة والمدرسة.")}
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
