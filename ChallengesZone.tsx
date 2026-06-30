import React, { useState } from "react";
import { Award, RefreshCw, Star, CheckCircle, AlertTriangle } from "lucide-react";
import { UserRole } from "../types";

interface ChallengesZoneProps {
  user: any;
  onAddPoints: (pts: number, classId: string, logMsg: string) => void;
  activeGrade: string;
  setActiveGrade: (gradeId: string) => void;
}

export default function ChallengesZone({ user, onAddPoints, activeGrade, setActiveGrade }: ChallengesZoneProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<{ [qIndex: number]: number }>({});
  const [examSubmitted, setExamSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [attemptClassId, setExamClassId] = useState("");

  const GRADE_CONFIGS = [
    {
      id: "p4",
      name: "رابعة ابتدائي",
      studentPointPerCorrect: 8,
      classPointPerCorrect: 4,
      examDescription: "اختبار تأسيسي يركز على الفهم والتطبيق البسيط وفق توجهات منهج 2026.",
      examPool: [
        { prompt: "ناتج 36 ÷ 6 يساوي:", options: ["4", "6", "8"], answer: 1 },
        { prompt: "الكسر 3/4 يعني:", options: ["ثلاثة من أربعة أجزاء", "أربعة من ثلاثة أجزاء", "ثلاثة مضروبة في أربعة"], answer: 0 },
        { prompt: "عند تسخين الثلج فإنه يتحول إلى:", options: ["غاز", "سائل", "صلب أكثر"], answer: 1 },
        { prompt: "عكس كلمة 'قريب' هو:", options: ["بعيد", "سريع", "قصير"], answer: 0 },
        { prompt: "الجمية الفعليّة تبدأ بـ:", options: ["فعل", "اسم", "حرف جر"], answer: 0 }
      ]
    },
    {
      id: "p5",
      name: "خامسة ابتدائي",
      studentPointPerCorrect: 9,
      classPointPerCorrect: 4,
      examDescription: "اختبار مهارات أساسية مع ربط المعرفة بالحياة اليومية في إطار منهج 2026.",
      examPool: [
        { prompt: "ناتج 0.5 + 0.25 يساوي:", options: ["0.75", "0.25", "0.6"], answer: 0 },
        { prompt: "عدد زوايا المثلث هو:", options: ["2", "3", "4"], answer: 1 },
        { prompt: "في السلسلة الغذائية، المنتج غالباً هو:", options: ["النبات", "الأسد", "الفطر"], answer: 0 },
        { prompt: "الجملة الإنجليزية الصحيحة هي:", options: ["She is reading now.", "She read now.", "She reading now."], answer: 0 },
        { prompt: "وظيفة مفتاح الخريطة الأساسي هي:", options: ["توضيح الرموز والألوان", "تغيير اتجاه الشمال", "تكبير حجم الدولة"], answer: 0 }
      ]
    },
    {
      id: "p6",
      name: "سادسة ابتدائي",
      studentPointPerCorrect: 10,
      classPointPerCorrect: 5,
      examDescription: "اختبار انتقالي يعزز التفكير التحليلي والاستعداد للمرحلة الإعدادية.",
      examPool: [
        { prompt: "15% من 200 يساوي:", options: ["20", "30", "40"], answer: 1 },
        { prompt: "الكوكب المعروف بالكوكب الأحمر هو:", options: ["الزهرة", "المريخ", "عطارد"], answer: 1 },
        { prompt: "جمع كلمة 'مهارة' هو:", options: ["مهارات", "مهر", "مهور"], answer: 0 },
        { prompt: "صيغة المقارنة الصحيحة لـ fast هي:", options: ["fastest", "faster", "more fast"], answer: 1 },
        { prompt: "أفضل طريقة لعرض نتيجة تجربة علمية:", options: ["جدول أو رسم بياني", "حفظها في الذاكرة فقط", "تجاهلها"], answer: 0 }
      ]
    },
    {
      id: "j1",
      name: "أولى إعدادي",
      studentPointPerCorrect: 11,
      classPointPerCorrect: 5,
      examDescription: "اختبار يركز على الفهم العميق وبداية مهارات التفكير الناقد في منهج 2026.",
      examPool: [
        { prompt: "إذا كان x + 7 = 15 فإن x تساوي:", options: ["6", "7", "8"], answer: 2 },
        { prompt: "الجزء المسؤول عن تنظيم أنشطة الخلية بالكامل هو:", options: ["النواة", "الجدار الخلوي", "الغشاء فقط"], answer: 0 },
        { prompt: "في الجملة: إنَّ الطلابَ مجتهدون، اسم إن هو:", options: ["الطلاب", "مجتهدون", "إن"], answer: 0 },
        { prompt: "مرادف كلمة 'essential' في الإنجليزيّة:", options: ["important", "empty", "weak"], answer: 0 },
        { prompt: "الخوارزمية هي عبارة عن:", options: ["مجموعة خطوات مرتبة لحل مشكلة", "صورة على الجهاز", "نوع من الطباعة"], answer: 0 }
      ]
    },
    {
      id: "j2",
      name: "ثانية إعدادي",
      studentPointPerCorrect: 12,
      classPointPerCorrect: 6,
      examDescription: "اختبار مبني على الفهم والتطبيق وربط الدروس بمواقف علمية واقعية.",
      examPool: [
        { prompt: "تبسيط 3(2x + 1) يبلغ:", options: ["6x + 1", "6x + 3", "2x + 3"], answer: 1 },
        { prompt: "تبادل الغازات في الرئتين يحدث في:", options: ["الحويصلات الهوائية", "القصبة الهوائية", "الحجاب الحاجز"], answer: 0 },
        { prompt: "اسم الموصول لجمع المذكر العاقل هو:", options: ["التي", "الذين", "اللاتي"], answer: 1 },
        { prompt: "الجملة الشرطية الصحيحة هي:", options: ["If I study well, I will succeed.", "If I study well, I succeed.", "If I study well, I was succeed."], answer: 0 },
        { prompt: "دائرة العرض الرئيسيّة للكرة الأرضيّة:", options: ["مدار السرطان", "خط الاستواء", "خط جرينتش"], answer: 1 }
      ]
    },
    {
      id: "j3",
      name: "ثالثة إعدادي",
      studentPointPerCorrect: 13,
      classPointPerCorrect: 6,
      examDescription: "اختبار استعداد للشهادة الإعدادية بمنطق منهج 2026 القائم على التحليل والاستنتاج.",
      examPool: [
        { prompt: "ميل المستقيم y = 2x + 1 يبلغ:", options: ["1", "2", "3"], answer: 1 },
        { prompt: "محلول الرقم الهيدروجيني pH له أقل من 7:", options: ["قاعدي", "متعادل", "حمضي"], answer: 2 },
        { prompt: "السرعة تساوي رياضياً بقانونها الأساسي:", options: ["المسافة × الزمن", "المسافة ÷ الزمن", "الزمن ÷ المسافة"], answer: 1 },
        { prompt: "الجملة المبنية للمجهول الصحيحة:", options: ["The team completed the task.", "The task was completed by the team.", "The task completed the team."], answer: 1 },
        { prompt: "المشاركة الإيجابية والفعالة في المجتمع تعني:", options: ["تحمل المسؤولية والمبادرة", "الانعزال التام", "رفض العمل الجماعي"], answer: 0 }
      ]
    },
    {
      id: "s1",
      name: "أولى ثانوي",
      studentPointPerCorrect: 15,
      classPointPerCorrect: 7,
      examDescription: "اختبار 2026 للمرحلة الثانوية يركز على الفهم المفاهيمي وحل المشكلات المعمقة.",
      examPool: [
        { prompt: "حل المعادلة x² - 9 = 0 يبلغ:", options: ["x = 9 فقط", "x = ±3", "x = 0"], answer: 1 },
        { prompt: "وحدة قياس القوة في النظام الدولي للمقاييس:", options: ["الجول", "النيوتن", "الواط"], answer: 1 },
        { prompt: "الأعمدة الرأسية في الجدول الدوري الحديث تسمى:", options: ["الدورات", "المجموعات", "السلاسل"], answer: 1 },
        { prompt: "تحدث عملية البناء الضوئي في النبات بمساعدة:", options: ["الميتوكوندريا", "البلاستيدات الخضراء", "النواة"], answer: 1 },
        { prompt: "الرمز البرمجي الذي تبدأ به معادلة الجداول الإلكترونية:", options: ["#", "=", "*"], answer: 1 }
      ]
    },
    {
      id: "s2",
      name: "ثانية ثانوي",
      studentPointPerCorrect: 16,
      classPointPerCorrect: 8,
      examDescription: "اختبار متقدم يراعي منهج 2026: تفكير ناقد، ربط بين المواد الأكاديمية، ودقة عالية في الاستنتاج.",
      examPool: [
        { prompt: "مشتقة x² بالنسبة إلى المتغير x تبلغ:", options: ["x", "2x", "x²"], answer: 1 },
        { prompt: "الزخم أو كمية التحرك تساوى فيزيائياً ضرب:", options: ["الكتلة في السرعة", "الكتلة في العجلة", "القوة في الزمن"], answer: 0 },
        { prompt: "حمض الهيدروكلوريك يرمز له كيميائياً بالرمز:", options: ["H2SO4", "HCl", "NaOH"], answer: 1 },
        { prompt: "انتقال الصفات والجينات الوراثية لدى الكائنات يتم عبر:", options: ["الجينات", "العضلات", "الأعصاب فقط"], answer: 0 },
        { prompt: "القراءة الناقدة للأبحاث العلمية تعتمد بالأساس على:", options: ["الدليل والتحليل", "التخمين والافتراض", "الحفظ الببغائي"], answer: 0 }
      ]
    }
  ];

  const currentGradeConfig = GRADE_CONFIGS.find((g) => g.id === activeGrade) || GRADE_CONFIGS[0];

  const handleSelectAnswer = (qIndex: number, optIndex: number) => {
    if (examSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [qIndex]: optIndex
    }));
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setExamSubmitted(false);
    setScore(0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (examSubmitted) return;

    let totalQuestions = currentGradeConfig.examPool.length;
    let answeredCount = Object.keys(selectedAnswers).length;

    if (answeredCount < totalQuestions) {
      alert("الرجاء الإجابة على جميع الأسئلة المطروحة أولاً لإنهاء الاختبار!");
      return;
    }

    let correctCount = 0;
    currentGradeConfig.examPool.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.answer) {
        correctCount += 1;
      }
    });

    setScore(correctCount);
    setExamSubmitted(true);

    const studentEarned = correctCount * currentGradeConfig.studentPointPerCorrect;
    const classEarned = correctCount * currentGradeConfig.classPointPerCorrect;

    const classPrefix = attemptClassId || "1A";
    const logDetails = `أنهى اختبار صف (${currentGradeConfig.name}) للترم الأول بنتيجة ${correctCount}/${totalQuestions} (+${studentEarned} نقاط طالب، +${classEarned} نقاط فصل في المنافسة)`;

    onAddPoints(studentEarned, classPrefix, logDetails);
  };

  const classroomOptions = [
    { id: "1A", name: "الأول أ" },
    { id: "1B", name: "الأول ب" },
    { id: "2A", name: "الثاني أ" },
    { id: "2B", name: "الثاني ب" }
  ];

  return (
    <div className="flex flex-col gap-6 text-right">
      <section className="rounded-2xl border border-sky-500/15 bg-slate-900/80 p-6 shadow-xl backdrop-blur-xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-slate-800 pb-5">
          <div>
            <span className="inline-flex rounded-full bg-cyan-500/10 px-3.5 py-1 text-[10px] font-black text-cyan-400">
              الامتحانات والتقييمات المنهجية
            </span>
            <h2 className="mt-2 font-display text-lg font-black text-white">تسلق مستويات الصالحين الأكاديمية</h2>
            <p className="text-xs text-slate-300 font-bold mt-1">اختر صفك الدراسي المناسب، حل الاختبار بالكامل لحصد نقاط تفوق فورية.</p>
          </div>

          <div className="flex flex-wrap gap-1.5 justify-end">
            {GRADE_CONFIGS.map((g) => (
              <button
                key={g.id}
                onClick={() => {
                  setActiveGrade(g.id);
                  handleReset();
                }}
                className={`rounded-xl px-3.5 py-2 text-xs font-bold transition-all cursor-pointer ${
                  activeGrade === g.id
                    ? "bg-gradient-to-r from-sky-500 to-cyan-400 text-slate-950 font-black shadow-md"
                    : "bg-slate-950 border border-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                {g.name}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="lg:col-span-8 flex flex-col gap-4">
            <h3 className="font-display text-base font-bold text-white text-right">
              اختبار مادة {currentGradeConfig.name} المعتمد • منهج 2026
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed text-right">{currentGradeConfig.examDescription}</p>

            <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
              {currentGradeConfig.examPool.map((q, qIdx) => {
                const isSelected = selectedAnswers[qIdx] !== undefined;
                return (
                  <div key={qIdx} className="rounded-xl border border-slate-850 bg-slate-950/50 p-5 shadow-inner">
                    <span className="text-[10px] text-slate-500 font-bold">السؤال {qIdx + 1} من 5</span>
                    <h4 className="mt-1.5 font-display text-sm font-bold text-white leading-normal text-right">{q.prompt}</h4>
                    
                    <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                      {q.options.map((opt, oIdx) => {
                        const isChosen = selectedAnswers[qIdx] === oIdx;
                        const isCorrect = q.answer === oIdx;
                        let optStyle = "border-slate-805 bg-slate-950 text-slate-300 hover:bg-slate-900/60 transition-colors";
                        
                        if (isChosen) {
                          optStyle = "border-cyan-500/40 bg-cyan-500/10 text-white font-extrabold";
                        }
                        if (examSubmitted) {
                          if (isCorrect) {
                            optStyle = "border-emerald-500/40 bg-emerald-950/30 text-emerald-300 font-extrabold";
                          } else if (isChosen) {
                            optStyle = "border-rose-500/40 bg-rose-950/20 text-rose-350";
                          }
                        }

                        return (
                          <button
                            key={oIdx}
                            type="button"
                            onClick={() => handleSelectAnswer(qIdx, oIdx)}
                            className={`rounded-xl border p-3.5 text-right text-xs transition-all cursor-pointer ${optStyle}`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-t border-slate-800 pt-5">
                <div className="flex items-center gap-2">
                  <label className="text-xs font-bold text-slate-350">دعم نقاط الفصل (اختياري):</label>
                  <select
                    value={attemptClassId}
                    onChange={(e) => setExamClassId(e.target.value)}
                    className="rounded-xl border border-slate-800 bg-slate-950/80 px-3.5 py-3 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                    disabled={examSubmitted}
                  >
                    <option value="">اختر فصلك الدراسي</option>
                    {classroomOptions.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-2.5">
                  {examSubmitted && (
                    <button
                      type="button"
                      onClick={handleReset}
                      className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-950 hover:bg-slate-900 px-5 py-3 text-xs font-bold text-slate-200 transition-colors cursor-pointer"
                    >
                      <RefreshCw className="h-4 w-4" />
                      إعادة المحاولة
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={examSubmitted}
                    className="rounded-xl bg-gradient-to-r from-sky-500 to-cyan-400 px-6 py-3 font-display font-extrabold text-slate-950 transition-all hover:scale-[1.03] disabled:opacity-50 disabled:hover:scale-100 cursor-pointer"
                  >
                    تسليم ورقة التقييم الآن
                  </button>
                </div>
              </div>
            </form>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-5 text-center">
              <span className="text-[10px] font-black text-slate-500 uppercase">الحالة الأكاديمية للاختبار</span>
              
              {examSubmitted ? (
                <div className="mt-4 flex flex-col items-center">
                  {score >= 4 ? (
                    <CheckCircle className="h-12 w-12 text-emerald-450 drop-shadow-md" />
                  ) : (
                    <AlertTriangle className="h-12 w-12 text-amber-500 drop-shadow-md" />
                  )}
                  <h4 className="mt-3 font-display text-base font-extrabold text-white">
                    معدل فهمك العام: {score} من 5 أسئلة
                  </h4>
                  <p className="mt-2 text-xs text-slate-350 leading-normal font-bold">
                    تم رصد {score * currentGradeConfig.studentPointPerCorrect} نقطة لطالب و {score * currentGradeConfig.classPointPerCorrect} نقطة لفصلك في لوحة التقدم.
                  </p>
                </div>
              ) : (
                <div className="mt-4 py-8 text-center flex flex-col items-center justify-center">
                  <Star className="h-10 w-10 text-cyan-450 animate-pulse mb-3" />
                  <p className="text-xs text-slate-400 font-bold max-w-[200px] leading-relaxed">حل جميع الأسئلة بالأعلى وقم بتوثيق الإجابة لإظهار رصيد الدرجات المستحقة.</p>
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-5 text-right">
              <h4 className="font-display text-xs font-black text-white border-b border-slate-800 pb-2.5">عائد نقاط التفوق لصف {currentGradeConfig.name}</h4>
              <ul className="mt-3 grid gap-2 text-[10px] font-bold text-slate-300">
                <li>• كل إشارة صحيحة تزيد الطالب: <span className="text-cyan-400 font-black">{currentGradeConfig.studentPointPerCorrect} نقطة</span></li>
                <li>• كل إشارة صحيحة تدعم الفصل: <span className="text-cyan-400 font-black">{currentGradeConfig.classPointPerCorrect} نقطة</span></li>
                <li>• نقاط المحصلة النهائية الكاملة: <span className="text-cyan-400 font-black">{5 * currentGradeConfig.studentPointPerCorrect} نقطة أكاديمية</span></li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
