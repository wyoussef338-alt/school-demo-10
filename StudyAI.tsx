import React, { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import { Send, Sparkles, BookOpen, BrainCircuit, GraduationCap, Maximize2, Minimize2, RefreshCw, Volume2, VolumeX } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Language } from "../utils/translations";

interface Message {
  id: string;
  sender: "user" | "ai";
  text: string;
}

interface StudyAIProps {
  lang?: Language;
}

export default function StudyAI({ lang = "ar" }: StudyAIProps) {
  const isAr = lang === "ar";

  // Dynamic lists based on language
  const grades = isAr
    ? [
        { key: "الرابع الابتدائي", val: "الرابع الابتدائي" },
        { key: "الخامس الابتدائي", val: "الخامس الابتدائي" },
        { key: "السادس الابتدائي", val: "السادس الابتدائي" },
        { key: "الأول الإعدادي", val: "الأول الإعدادي" },
        { key: "الثاني الإعدادي", val: "الثاني الإعدادي" },
        { key: "الثالث الإعدادي", val: "الثالث الإعدادي" },
        { key: "الأول الثانوي", val: "الأول الثانوي" },
        { key: "الثاني الثانوي", val: "الثاني الثانوي" },
      ]
    : [
        { key: "الرابع الابتدائي", val: "4th Primary" },
        { key: "الخامس الابتدائي", val: "5th Primary" },
        { key: "السادس الابتدائي", val: "6th Primary" },
        { key: "الأول الإعدادي", val: "1st Prep" },
        { key: "الثاني الإعدادي", val: "2nd Prep" },
        { key: "الثالث الإعدادي", val: "3rd Prep" },
        { key: "الأول الثانوي", val: "1st Secondary" },
        { key: "الثاني الثانوي", val: "2nd Secondary" },
      ];

  const subjects = isAr
    ? [
        { key: "علوم", val: "علوم (العلوم العامة)" },
        { key: "رياضيات", val: "رياضيات (الجبر والهندسة)" },
        { key: "لغة عربية", val: "لغة عربية (النحو والنصوص)" },
        { key: "لغة إنجليزية", val: "لغة إنجليزية (المفردات والقواعد)" },
        { key: "دراسات اجتماعية", val: "دراسات اجتماعية (الجغرافيا والتاريخ)" },
        { key: "التربية الدينية الإسلامية", val: "التربية الدينية الإسلامية" },
        { key: "التربية الدينية المسيحية", val: "التربية الدينية المسيحية" },
      ]
    : [
        { key: "علوم", val: "Science (Sciences)" },
        { key: "رياضيات", val: "Mathematics (Algebra & Geometry)" },
        { key: "لغة عربية", val: "Arabic Language" },
        { key: "لغة إنجليزية", val: "English Language (Connect & Rules)" },
        { key: "دراسات اجتماعية", val: "Social Studies (History & Geography)" },
        { key: "التربية الدينية الإسلامية", val: "Islamic Religious Education" },
        { key: "التربية الدينية المسيحية", val: "Christian Religious Education" },
      ];

  const samplePrompts = isAr
    ? [
        {
          title: "اشرح الدرس الثاني في العلوم",
          text: "ممكن تشرح لي الدرس الثاني في العلوم بالتفصيل؟ أنا عايز أفهم تركيب المادة والجزيئات مع مثال.",
        },
        {
          title: "أنا مش فاهم المسألة دي",
          text: "أنا مش فاهم السطر ده أو المسألة دي: كيف نوجد مساحة ومحيط مستطيل طوله 6 سم وعرضه 4 سم؟ ممكن شرح مبسط بالخطوات؟",
        },
        {
          title: "اختبار سريع وتفاعلي",
          text: "اعطني لغزاً نحوياً أو سؤالاً تفاعلياً ممتعاً عن (كان وأخواتها) واختبر مدى فهمي له الآن!",
        },
      ]
    : [
        {
          title: "Explain the second Science lesson",
          text: "Can you explain the second lesson in Science about the Properties and Structure of Matter with real-life examples?",
        },
        {
          title: "I don't understand this Math problem",
          text: "I don't understand how to step-by-step solve algebraic equations such as 2x + 7 = 15. Can you break it down for me?",
        },
        {
          title: "Give me an English Grammar quiz",
          text: "Give me an interactive Grammar quiz on the usage of Connect Plus (e.g. Present Perfect vs Past Simple) and test my knowledge!",
        },
      ];

  const [grade, setGrade] = useState("الأول الإعدادي");
  const [subject, setSubject] = useState("علوم");
  const [message, setMessage] = useState("");
  const [isCinematic, setIsCinematic] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const audioInstanceRef = useRef<HTMLAudioElement | null>(null);

  // Set default welcome message according to selected language
  useEffect(() => {
    // Cancel any ongoing speaking when language switches
    if (audioInstanceRef.current) {
      audioInstanceRef.current.pause();
      audioInstanceRef.current = null;
    }
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setSpeakingMsgId(null);

    setMessages([
      {
        id: "welcome",
        sender: "ai",
        text: isAr
          ? "أهلاً بك يا بطل الصالحين! 🎓 أنا **SkooLy AI** المساعد الذكي الخاص بك في مدرسة الصالحين للغات. اختر صفك الدراسي والمادة التي تبحث عنها، واطرح علي أي سؤال أو مسألة صعبة أو تفاصيل في المنهج (مثل: 'اشرح لي الدرس الثاني في العلوم' أو 'أنا مش فاهم المسألة دي') وسأساعدك فوراً بتبسيط شامل واختبار تفاعلي!"
          : "Welcome, Salheen Hero! 🎓 I am **SkooLy AI**, your dedicated AI Study Buddy. Select your grade and subject, ask me any questions, or voice out what you don't understand (e.g., 'Explain the second science lesson' or 'I don't understand this math problem') and I will assist you instantly with step-by-step guidance and dynamic study challenges!",
      },
    ]);
  }, [lang]);

  // Clean up any speaking voice on unmount & warm up voices list
  useEffect(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      // Warm up voices list so it's loaded when user clicks
      window.speechSynthesis.getVoices();
      try {
        window.speechSynthesis.onvoiceschanged = () => {
          window.speechSynthesis.getVoices();
        };
      } catch (e) {}
    }
    return () => {
      if (audioInstanceRef.current) {
        audioInstanceRef.current.pause();
        audioInstanceRef.current = null;
      }
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const stripMarkdown = (text: string) => {
    return text
      .replace(/(\*\*|__)(.*?)\1/g, "$2") // bold
      .replace(/(\*|_)(.*?)\1/g, "$2") // italic
      .replace(/`([^`]+)`/g, "$1") // inline code
      .replace(/#[#\s]*(.*?)(?:\n|$)/g, "$1\n") // headers
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1") // links
      .replace(/[\*\_\#\`]/g, "") // extra symbol remnants
      .trim();
  };

  const splitTextIntoChunks = (text: string, maxLen: number = 180): string[] => {
    const clean = stripMarkdown(text).trim();
    if (!clean) return [];

    // Split by common delimiters (periods, commas, newlines, question marks, semicolons)
    const sentences = clean.split(/([.،,\n?؟!؛:])/);
    const chunks: string[] = [];
    let currentChunk = "";

    for (let i = 0; i < sentences.length; i++) {
      const part = sentences[i];
      if (!part) continue;

      if ((currentChunk + part).length > maxLen) {
        if (currentChunk.trim()) {
          chunks.push(currentChunk.trim());
        }
        currentChunk = part;
      } else {
        currentChunk += part;
      }
    }

    if (currentChunk.trim()) {
      chunks.push(currentChunk.trim());
    }

    // Split any oversized chunk by words
    const finalChunks: string[] = [];
    for (const chunk of chunks) {
      if (chunk.length <= maxLen) {
        finalChunks.push(chunk);
      } else {
        const words = chunk.split(" ");
        let subChunk = "";
        for (const word of words) {
          if ((subChunk + " " + word).length > maxLen) {
            if (subChunk.trim()) finalChunks.push(subChunk.trim());
            subChunk = word;
          } else {
            subChunk += (subChunk ? " " : "") + word;
          }
        }
        if (subChunk.trim()) finalChunks.push(subChunk.trim());
      }
    }

    return finalChunks.filter(c => c.length > 0);
  };

  const playNextSpeechChunk = (msgId: string, chunks: string[], index: number) => {
    if (index >= chunks.length) {
      // Finished all chunks!
      setSpeakingMsgId(null);
      return;
    }

    setSpeakingMsgId(msgId);

    const chunkText = chunks[index];
    const langCode = isAr ? "ar" : "en";
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${langCode}&client=tw-ob&q=${encodeURIComponent(chunkText)}`;

    if (audioInstanceRef.current) {
      audioInstanceRef.current.pause();
    }

    const audio = new Audio(url);
    audioInstanceRef.current = audio;

    audio.onended = () => {
      playNextSpeechChunk(msgId, chunks, index + 1);
    };

    audio.onerror = (e) => {
      console.warn("Google Translate TTS failed, falling back to browser SpeechSynthesis", e);
      speakFallbackBrowser(chunkText, () => {
        playNextSpeechChunk(msgId, chunks, index + 1);
      });
    };

    audio.play().catch((err) => {
      console.warn("Audio play interrupted, falling back to browser SpeechSynthesis", err);
      speakFallbackBrowser(chunkText, () => {
        playNextSpeechChunk(msgId, chunks, index + 1);
      });
    });
  };

  const speakFallbackBrowser = (text: string, onEnded: () => void) => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      onEnded();
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    
    if (isAr) {
      utterance.lang = "ar-EG";
    } else {
      utterance.lang = "en-US";
    }

    const voices = window.speechSynthesis.getVoices();
    let selectedVoice = null;
    if (isAr) {
      selectedVoice = voices.find(v => v.lang.toLowerCase().includes("ar")) || null;
    } else {
      selectedVoice = voices.find(v => v.lang.toLowerCase().includes("en")) || null;
    }

    if (selectedVoice) {
      utterance.voice = selectedVoice;
      utterance.lang = selectedVoice.lang;
    }

    utterance.pitch = 1.05;
    utterance.rate = isAr ? 0.95 : 0.92;

    utterance.onend = () => {
      onEnded();
    };
    utterance.onerror = () => {
      onEnded();
    };

    window.speechSynthesis.speak(utterance);
  };

  const toggleSpeak = (msgId: string, text: string) => {
    // Stop any active player
    if (audioInstanceRef.current) {
      audioInstanceRef.current.pause();
      audioInstanceRef.current = null;
    }
    
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    if (speakingMsgId === msgId) {
      setSpeakingMsgId(null);
      return;
    }

    // Split text into safe chunks and start sequential playlist
    const chunks = splitTextIntoChunks(text);
    if (chunks.length === 0) return;

    playNextSpeechChunk(msgId, chunks, 0);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: message,
    };

    setMessages((prev) => [...prev, userMsg]);
    setMessage("");
    setLoading(true);

    try {
      const formattedHistory = messages.map((m) => ({
        sender: m.sender === "user" ? "user" : "model",
        text: m.text,
      }));

      const res = await fetch("/api/help", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          grade,
          subject,
          message: userMsg.text,
          history: formattedHistory,
        }),
      });

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "ai",
          text:
            data.text ||
            (isAr
              ? "عذراً يا بطل، واجهت مشكلة في الاتصال بالوزارة والمنهج الذكي. أعد التجربة بعد قليل!"
              : "Apologies Hero, I encountered a connection issue with the smart study curriculum. Please try again in an instant!"),
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "ai",
          text: isAr
            ? "حدث خطأ غير متوقع في محرك الذكاء الاصطناعي. يرجى رصد الاتصال الكفء مجدداً."
            : "An unexpected error occurred in your AI engine. Please verify your stable connection and retry.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const resetChat = () => {
    setMessages([
      {
        id: "welcome",
        sender: "ai",
        text: isAr
          ? "أهلاً بك يا بطل الصالحين! 🎓 أنا **SkooLy AI** المساعد الذكي الخاص بك في مدرسة الصالحين للغات. اختر صفك الدراسي والمادة التي تبحث عنها، واطرح علي أي سؤال أو مسألة صعبة وسوف أساعدك فوراً!"
          : "Welcome, Salheen Hero! 🎓 I am **SkooLy AI**, your dedicated AI Study Buddy. Select your grade and subject, ask me any questions, or voice out what you don't understand and I will assist you instantly!",
      },
    ]);
  };

  return (
    <div className={`grid grid-cols-1 gap-6 lg:grid-cols-4 items-stretch ${isAr ? "text-right" : "text-left"}`}>
      {!isCinematic && (
        <div className="rounded-2xl border border-sky-500/15 bg-slate-900/80 p-6 shadow-xl backdrop-blur-xl lg:col-span-1 flex flex-col justify-between">
          <div>
            <h3 className="font-display text-base font-bold text-cyan-300 flex items-center justify-start gap-2 mb-4">
              <GraduationCap className="h-5 w-5 text-cyan-400" />
              {isAr ? "إعدادات المذاكرة الذكية" : "Smart Study Buddy Settings"}
            </h3>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-300">
                  {isAr ? "الصف الدراسي الحالي" : "Current Grade Level"}
                </label>
                <select
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="rounded-xl border border-slate-800 bg-slate-950/80 px-3.5 py-3 text-xs text-slate-100 focus:border-cyan-500 focus:outline-none transition-colors"
                >
                  {grades.map((g) => (
                    <option key={g.key} value={g.key}>
                      {g.val}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-300">
                  {isAr ? "المادة الدراسية للمراجعة" : "Curriculum Subject"}
                </label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="rounded-xl border border-slate-800 bg-slate-950/80 px-3.5 py-3 text-xs text-slate-100 focus:border-cyan-500 focus:outline-none transition-colors"
                >
                  {subjects.map((sub) => (
                    <option key={sub.key} value={sub.key}>
                      {sub.val}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="mt-6 border-t border-slate-800 pt-5">
            <h4 className="font-display text-xs font-bold text-slate-305 flex items-center justify-start gap-1.5 mb-3">
              <BrainCircuit className="h-4.5 w-4.5 text-cyan-400" />
              {isAr ? "أسئلة سريعة مبسطة" : "Quick Interactive Prompts"}
            </h4>
            <div className="flex flex-col gap-2">
              {samplePrompts.map((sample, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setMessage(sample.text)}
                  className={`w-full text-xs rounded-xl border border-slate-800 bg-slate-950/50 p-3 text-slate-300 hover:border-cyan-500/30 hover:text-white transition-all cursor-pointer ${
                    isAr ? "text-right" : "text-left"
                  }`}
                >
                  {sample.title}
                </button>
              ))}
            </div>

            <button
              onClick={resetChat}
              className="mt-4 w-full flex items-center justify-center gap-2 rounded-xl border border-slate-800 hover:bg-slate-950 py-2.5 text-xs font-bold text-slate-400 transition-colors"
            >
              <RefreshCw className="h-3.5 w-3.5 text-cyan-400" />
              <span>{isAr ? "إعادة بدء المحادثة" : "Reset Safe Chat"}</span>
            </button>
          </div>
        </div>
      )}

      <div
        className={`flex flex-col rounded-2xl border transition-all duration-500 overflow-hidden ${
          isCinematic
            ? "border-cyan-500/30 bg-slate-950/95 shadow-[0_0_50px_rgba(34,211,238,0.2)] lg:col-span-4 h-[650px]"
            : "border-sky-500/15 bg-slate-900/80 shadow-2xl backdrop-blur-xl lg:col-span-3 h-[525px]"
        }`}
      >
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-955/40 p-4">
          <div className={`flex items-center gap-2 ${isAr ? "flex-row" : "flex-row-reverse"}`}>
            <span className="flex rounded-xl bg-cyan-500/10 p-2">
              <Sparkles className="h-4 w-4 text-cyan-400 animate-pulse" />
            </span>
            <div className={isAr ? "text-right" : "text-left"}>
              <h3 className="font-display text-xs font-black text-white">
                SkooLy AI {isAr ? "• مساعد المذاكرة الذكي" : "• Smart AI Study Buddy"}
              </h3>
              <p className="text-[10px] text-slate-400 font-bold">
                {isAr ? "منهج 2026 ذو جودة • مدعوم بالذكاء الاصطناعي" : "Class of 2026 Guided Syllabus • Powered by AI"}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsCinematic(!isCinematic)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-[10px] font-black border transition-all cursor-pointer ${
              isCinematic
                ? "bg-rose-500/10 border-rose-500/30 text-rose-300 hover:bg-rose-500/20 shadow-[0_0_12px_rgba(239,68,68,0.15)]"
                : "bg-cyan-500/10 border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 shadow-[0_0_12px_rgba(6,182,212,0.15)]"
            }`}
          >
            {isCinematic ? (
              <>
                <Minimize2 className="h-3.5 w-3.5 text-rose-400" />
                <span>{isAr ? "الوضع العادي" : "Standard Mode"}</span>
              </>
            ) : (
              <>
                <Maximize2 className="h-3.5 w-3.5 text-cyan-400 animate-pulse" />
                <span>{isAr ? "الوضع السينمائي (بدون مشتتات)" : "Cinematic Focus Mode"}</span>
              </>
            )}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
          {isCinematic && (
            <div className="flex justify-center mb-2 animate-fade-in">
              <span className="inline-flex items-center gap-2 rounded-full bg-cyan-950/40 border border-cyan-500/20 px-4 py-1.5 text-[10px] font-bold text-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.05)]">
                <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping"></span>
                <span>
                  {isAr
                    ? "الوضع السينمائي نشط • تم إيقاف المشتتات لمساعدتك على التفوق والمذاكرة بصفاء ذهن 🧘✨"
                    : "Cinematic Mode Active • Distractions minimized for deep study concentration 🧘✨"}
                </span>
              </span>
            </div>
          )}

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed border relative group ${
                msg.sender === "user"
                  ? "bg-gradient-to-r from-sky-500/10 to-cyan-500/10 border-cyan-500/25 text-slate-100 self-start " +
                    (isAr ? "text-right" : "text-left")
                  : "bg-slate-950/90 border-slate-800 text-slate-300 self-end text-right"
              }`}
            >
              <div className="prose prose-invert max-w-none text-xs leading-relaxed text-slate-100">
                <ReactMarkdown>{msg.text}</ReactMarkdown>
              </div>

              {msg.sender === "ai" && (
                <div className="mt-3 pt-2.5 border-t border-slate-800/65 flex items-center justify-between gap-4">
                  {speakingMsgId === msg.id ? (
                    <div className="flex items-center gap-1.5">
                      <span className="h-3.5 w-0.5 bg-cyan-400 rounded-full animate-pulse-bar1"></span>
                      <span className="h-4.5 w-0.5 bg-cyan-400 rounded-full animate-pulse-bar2"></span>
                      <span className="h-2.5 w-0.5 bg-cyan-400 rounded-full animate-pulse-bar3"></span>
                      <span className="h-4 w-0.5 bg-cyan-400 rounded-full animate-pulse-bar4"></span>
                      <span className="text-[10px] font-bold text-cyan-400 animate-pulse ml-1.5">
                        {isAr ? "جاري القراءة الصوتية..." : "Reciting speech..."}
                      </span>
                    </div>
                  ) : (
                    <span className="text-[10px] text-slate-500 font-bold">
                      {isAr ? "استمع للإجابة بصوت تفاعلي" : "Listen to interactive voice"}
                    </span>
                  )}

                  <button
                    onClick={() => toggleSpeak(msg.id, msg.text)}
                    className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-[10px] font-black transition-all border cursor-pointer ${
                      speakingMsgId === msg.id
                        ? "bg-rose-500/10 border-rose-500/30 text-rose-300 hover:bg-rose-500/20"
                        : "bg-cyan-500/5 hover:bg-cyan-500/10 border-slate-800 hover:border-cyan-500/30 text-cyan-400 hover:text-white"
                    }`}
                  >
                    {speakingMsgId === msg.id ? (
                      <>
                        <VolumeX className="h-3.5 w-3.5 text-rose-450" />
                        <span>{isAr ? "إيقاف الصوت" : "Stop Voice"}</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="h-3.5 w-3.5 text-cyan-400" />
                        <span>{isAr ? "نطق صوتي" : "Read Aloud"}</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex flex-col max-w-[85%] rounded-2xl p-4 bg-slate-950/90 border border-slate-800 text-slate-300 self-end text-right">
              <div className="flex items-center gap-2 justify-end">
                <span className="flex h-1.5 w-1.5 rounded-full bg-cyan-400 animate-bounce"></span>
                <span className="flex h-1.5 w-1.5 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.2s]"></span>
                <span className="flex h-1.5 w-1.5 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.4s]"></span>
                <span className="text-[10px] font-bold text-slate-400">
                  {isAr ? "SkooLy AI يكتب الرد ويحلل المنهج..." : "SkooLy AI is retrieving the curriculum..."}
                </span>
              </div>
            </div>
          )}
          <div ref={chatEndRef}></div>
        </div>

        <form onSubmit={handleSend} className="border-t border-slate-800 p-3 bg-slate-955/60 flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={
              isAr ? "اكتب سؤالك هنا بالتفصيل يا بطل..." : "Explain second lesson in science / Ask your question..."
            }
            className="flex-1 rounded-xl border border-slate-800 bg-slate-950/80 px-4 py-3.5 text-xs text-slate-100 placeholder-slate-600 focus:border-cyan-500 focus:outline-none transition-colors text-right"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !message.trim()}
            className="flex items-center justify-center rounded-xl bg-gradient-to-r from-sky-500 to-cyan-400 p-3.5 text-slate-950 transition-all hover:scale-[1.03] disabled:opacity-50 disabled:hover:scale-100 cursor-pointer animate-pulse-border"
          >
            <Send className="h-4.5 w-4.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
