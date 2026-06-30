import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Mail, Phone, MapPin, CheckCircle, Send, ShieldAlert, Sparkles } from "lucide-react";

interface ContactPageProps {
  lang?: "ar" | "en";
}

export default function ContactPage({ lang = "ar" }: ContactPageProps) {
  const isAr = lang === "ar";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim() || !message.trim()) {
      setStatus("error");
      return;
    }

    setStatus("sending");
    setTimeout(() => {
      setStatus("success");
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
    }, 1500);
  };

  return (
    <div className={`grid grid-cols-1 lg:grid-cols-12 gap-8 ${isAr ? "text-right" : "text-left"} animate-fade-in items-stretch`} dir={isAr ? "rtl" : "ltr"}>
      {/* Contact Form matching the STEM EGYPT video precisely */}
      <div className="lg:col-span-8 rounded-2xl border border-slate-900 bg-slate-950/60 p-6 sm:p-8 flex flex-col justify-between shadow-xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="border-b border-slate-900 pb-4">
            <span className="text-[10px] font-black text-cyan-405 tracking-widest uppercase block">GET IN TOUCH</span>
            <h3 className="font-display text-lg font-black text-white mt-1">
              {isAr ? "نموذج التواصل وخدمة أولياء الأمور والطلاب" : "Contact Form, Parent & Student Services"}
            </h3>
          </div>

          {/* Validation banner */}
          <AnimatePresence mode="wait">
            {status === "success" && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-xs font-bold text-emerald-300 flex items-center justify-start gap-2.5"
              >
                <CheckCircle className="h-5 w-5 text-emerald-400 shrink-0" />
                <span>
                  {isAr 
                    ? "تم إرسال رسالتك بنجاح! سيقوم مسؤول البوابة والشؤون بالرد عليك خلال 24 ساعة. شكرًا لتعاونك."
                    : "Your message was sent successfully! The portal administrator will reply within 24 hours. Thank you for your cooperation."}
                </span>
              </motion.div>
            )}

            {status === "error" && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="rounded-xl bg-rose-500/10 border border-rose-500/20 p-4 text-xs font-bold text-rose-300 flex items-center justify-start gap-2.5"
              >
                <ShieldAlert className="h-5 w-5 text-rose-400 shrink-0" />
                <span>
                  {isAr 
                    ? "نرجو تعبئة كافة الحقول المطلوبة بشكل صحيح وصياغة الاستفسار قبل التقديم."
                    : "Please fill in all required fields correctly and formulate your query before submitting."}
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* User Info block */}
          <div className="space-y-4">
            <h4 className="text-xs font-black text-cyan-400 font-display flex items-center justify-start gap-1">
              <span className="h-5 w-5 rounded-full bg-cyan-500/10 flex items-center justify-center text-[10px] font-bold">1</span>
              {isAr ? "بيانات المرسل (User Info)" : "Sender Info"}
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500">
                  {isAr ? "الاسم الكامل (Your Name)" : "Full Name (Your Name)"}
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => { setName(e.target.value); setStatus("idle"); }}
                  placeholder={isAr ? "مثال: يوسف الشافعي" : "e.g., Youssef El-Shafei"}
                  className="w-full rounded-xl border border-slate-850 bg-slate-950 px-4 py-3 text-xs text-slate-200 placeholder-slate-600 focus:border-cyan-500/40 focus:outline-none transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500">
                  {isAr ? "البريد الإلكتروني (E-Mail)" : "Email Address (E-Mail)"}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setStatus("idle"); }}
                  placeholder="example@mail.com"
                  className="w-full rounded-xl border border-slate-850 bg-slate-950 px-4 py-3 text-xs text-slate-200 placeholder-slate-600 focus:border-cyan-500/40 focus:outline-none transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500">
                  {isAr ? "رقم الهاتف (Phone Number)" : "Phone Number"}
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => { setPhone(e.target.value); setStatus("idle"); }}
                  placeholder="01xxxxxxxxx"
                  className="w-full rounded-xl border border-slate-855 bg-slate-950 px-4 py-3 text-xs text-slate-200 placeholder-slate-600 focus:border-cyan-500/40 focus:outline-none transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Message block */}
          <div className="space-y-4 pt-2">
            <h4 className="text-xs font-black text-cyan-400 font-display flex items-center justify-start gap-1">
              <span className="h-5 w-5 rounded-full bg-cyan-500/10 flex items-center justify-center text-[10px] font-bold">2</span>
              {isAr ? "صيغة التوصية أو الاستفسار (Message)" : "Recommendation or Query Statement"}
            </h4>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500">
                {isAr ? "ما الذي تود قوله لإدارة المدرسة أو المعلمين؟" : "What would you like to say to school admin or teachers?"}
              </label>
              <textarea
                rows={5}
                value={message}
                onChange={(e) => { setMessage(e.target.value); setStatus("idle"); }}
                placeholder={isAr ? "تفاصيل الشكوى، الاقتراح، أو السؤال الأكاديمي..." : "Details of complaint, suggestion, or academic query..."}
                className="w-full rounded-xl border border-slate-850 bg-slate-950 px-4 py-3 text-xs text-slate-200 placeholder-slate-600 focus:border-cyan-500/40 focus:outline-none transition-colors resize-none"
              ></textarea>
            </div>
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={status === "sending"}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-402 hover:from-sky-600 hover:to-cyan-500 text-slate-950 text-xs font-black transition-all hover:scale-[1.01] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Send className="h-4.5 w-4.5" />
            <span>
              {status === "sending" 
                ? (isAr ? "جاري الإرسال للتسجيل..." : "Sending...") 
                : (isAr ? "إرسال الآن (Send)" : "Send Now")}
            </span>
          </button>
        </form>
      </div>

      {/* Info Sidebar panel */}
      <div className="lg:col-span-4 flex flex-col gap-6">
        <div className="rounded-2xl border border-slate-900 bg-slate-950/40 p-6 flex-1 flex flex-col justify-between">
          <div className="space-y-5">
            <h4 className="font-display text-sm font-black text-white">
              {isAr ? "بيانات وبطاقة الاتصال المباشر" : "Direct Contact Card"}
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed font-semibold">
              {isAr 
                ? "إدارة مدرسة الصالحين مهيأة ومرحبة باستقبال شكاوى ومقترحات أولياء الأمور لمساعدتنا على بناء جيل استثنائي ومتفوق."
                : "El-Salheen Administration is welcoming and ready to receive queries and suggestions from parents to help build an exceptional generation."}
            </p>
          </div>

          <div className="space-y-4 pt-6">
            <div className="flex items-center gap-3.5">
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-900 text-cyan-405 shrink-0">
                <Mail className="h-4 w-4" />
              </div>
              <div className={`${isAr ? "text-right" : "text-left"}`}>
                <span className="text-[9px] font-bold text-slate-500 block uppercase">
                  {isAr ? "البريد الإلكتروني الشامل" : "General Email Support"}
                </span>
                <strong className="text-xs text-white">support@salheen.edu.eg</strong>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-900 text-cyan-405 shrink-0">
                <Phone className="h-4 w-4" />
              </div>
              <div className={`${isAr ? "text-right" : "text-left"}`}>
                <span className="text-[9px] font-bold text-slate-500 block">
                  {isAr ? "رقم الإدارة والتسجيل السريع" : "Direct Admin & Registration"}
                </span>
                <strong className="text-xs text-white" dir="ltr">+20 115 911 4973</strong>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-900 text-cyan-405 shrink-0">
                <MapPin className="h-4 w-4" />
              </div>
              <div className={`${isAr ? "text-right" : "text-left"}`}>
                <span className="text-[9px] font-bold text-slate-500 block">
                  {isAr ? "المقر والمجمع الإداري" : "Campus Location & Head Office"}
                </span>
                <strong className="text-[11px] text-white">
                  {isAr 
                    ? "الطريق السياحي، خلف مدينة الإنتاج الإعلامي، الجيزة"
                    : "The Oasis Road, behind Media Production City, Giza"}
                </strong>
              </div>
            </div>
          </div>
        </div>

        {/* Security and Ethics pledge matching the video vibe */}
        <div className="rounded-2xl border border-slate-900 bg-slate-950 p-6 space-y-3">
          <h4 className="font-display text-xs font-black text-amber-400 flex items-center justify-start gap-1">
            <Sparkles className="h-4 w-4" />
            {isAr ? "التواصل الشفاف والنزاهة" : "Transparent Communication & Integrity"}
          </h4>
          <p className="text-[10px] text-slate-400 leading-normal font-medium">
            {isAr 
              ? "تلتزم إدارة مدرسة الصالحين بحماية الخصوصية المطلقة لكافة البيانات الشخصية المرفقة، وسيتم تداولها فقط من خلال منسقي الجودة ومديري المراحل بصفة آمنة تمامًا."
              : "El-Salheen Administration is committed to absolute privacy of personal records, processed securely only by stage directors and quality coordinators."}
          </p>
        </div>
      </div>
    </div>
  );
}
