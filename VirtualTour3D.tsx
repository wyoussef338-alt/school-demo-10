import React, { useState, useEffect, useRef } from "react";
import { 
  Compass, 
  MapPin, 
  RotateCw, 
  ZoomIn, 
  ZoomOut, 
  Volume2, 
  VolumeX, 
  Sparkles 
} from "lucide-react";
import { Language } from "../utils/translations";

interface TourLocation {
  id: string;
  name: string;
  locationName: string;
  panImage: string;
  description: string;
  voiceOverText: string;
  hotspots: {
    x: number; // percentage
    y: number; // percentage
    title: string;
    description: string;
  }[];
}

interface VirtualTour3DProps {
  lang?: Language;
}

export default function VirtualTour3D({ lang = "ar" }: VirtualTour3DProps) {
  const isAr = lang === "ar";

  const locations: TourLocation[] = [
    {
      id: "lobby",
      name: "Smart Lobby",
      locationName: isAr ? "البهو والمدخل الذكي الرئيسي" : "Main Smart Lobby & Reception",
      panImage: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1200&auto=format&fit=crop",
      description: isAr 
        ? "مدخل زجاجي بهيج يضم دروع المتفوقين وكأس الصالحين العام، مجهز بأحدث تكنولوجيا التحقق من الهوية والأرصفة الذكية."
        : "A glorious glass entrance showcasing top achiever awards and cups, equipped with state-of-the-art identity verification gates.",
      voiceOverText: isAr
        ? "مرحباً بكم في صرح الصالحين التعليمي. البهو الرئيسي يجسد تلاقي الكلاسيكية التعليمية بالتفاصيل التقنية المتطورة لاستقبال فرسان الغد."
        : "Welcome to El-Salheen Academic Institution. The main lobby represents the union of educational heritage with futuristic technology to greet tomorrow's leaders.",
      hotspots: [
        { 
          x: 30, 
          y: 45, 
          title: isAr ? "جدار العباقرة والمعلقات" : "Wall of Geniuses", 
          description: isAr 
            ? "شاشة تفاعلية ذكية تعرض أسماء الطلاب الأوائل الحاصلين على جوائز كأس التميز ونقاط لوحة الشرف الأسبوعية." 
            : "An interactive smart display showcasing our weekly top-performing students and special award winners."
        },
        { 
          x: 75, 
          y: 60, 
          title: isAr ? "مكتب الإرشاد الأكاديمي" : "Academic Orientation Desk", 
          description: isAr 
            ? "خط تواصل مباشر ومفتوح يومياً لخدمة أولياء الأمور وحجز الاستشارات الشخصية مع رائد الفوج." 
            : "A direct and friendly touchpoint open daily to resolve parent requests or schedule tailored consultation sessions."
        }
      ]
    },
    {
      id: "classroom",
      name: "Classroom 1A",
      locationName: isAr ? "القاعات الدراسية الذكية (1أ)" : "Smart Classroom (1A)",
      panImage: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?q=80&w=1200&auto=format&fit=crop",
      description: isAr 
        ? "فصول نموذجية واسعة بها شاشات تفاعلية ومقاعد رياضية مصممة هندسياً لمنع إرهاق عمود الطلاب ومنحهم التهوية التامة."
        : "Spacious classrooms with interactive 4K boards and ergonomic chairs designed to promote healthy posture and absolute comfort.",
      voiceOverText: isAr
        ? "هنا تُزرع بذور المعرفة. فصولنا الذكية مجهزة بنظام تكييف متكامل وصوتيات مركزية تضمن وصول لغة الدرس لآخِر طالب بكل جلاء."
        : "The harvest of absolute knowledge is sown here. Our classrooms are fully climate-controlled and have central stereos so instructions reach everyone.",
      hotspots: [
        { 
          x: 50, 
          y: 35, 
          title: isAr ? "السبورة الذكية اللامتناهية" : "Infinity Smart Board", 
          description: isAr 
            ? "شاشات بدقة 4K متصلة بالإنترنت تتيح استحضار الخرائط المجسمة ومحاكاة الفيزياء ثلاثية الأبعاد فوراً." 
            : "High-definition 4K screens connected to the internet allowing immediate generation of interactive 3D simulations and maps."
        },
        { 
          x: 15, 
          y: 70, 
          title: isAr ? "المقاعد المريحة المنظمة" : "Ergonomic Agile Seats", 
          description: isAr 
            ? "مقاعد فردية مرنة تسهم في إعادة تشكيل تفصيلة الفصل لدعم الأنشطة الجماعية وحلقات المناقشة." 
            : "Flexible seating options that rearrange in moments to support teamwork, workshops, and student debate circles."
        }
      ]
    },
    {
      id: "lab",
      name: "Robotics & STEM Lab",
      locationName: isAr ? "معامل الروبوتات والعلوم المتكاملة (STEM)" : "Robotics & STEM Lab",
      panImage: "https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=1200&auto=format&fit=crop",
      description: isAr 
        ? "بيئة مجهزة بكامل الأدوات اللازمة للاختراع، فك وتركيب الروبوتات، والتدريب العملي على فروع مصفوفات هندسة الحاسوب."
        : "An inspiring workspace containing micro-controllers, software utilities, and hands-on tools to practice robotics and programming.",
      voiceOverText: isAr
        ? "نرحب بالعلماء الصغار. نقدم في معامل العلوم ممارسات فيزيائية ممتعة تدمج الجانب النظري باليدوي لابتكار حلول علمية."
        : "A warm welcome to young scientists! In STEM labs we offer interactive practices integrating scientific theory with manual innovation.",
      hotspots: [
        { 
          x: 40, 
          y: 55, 
          title: isAr ? "وحدة التصنيع ثلاثية الأبعاد" : "3D Printing Unit", 
          description: isAr 
            ? "تتيح تخيل المجسمات الهندسية وطباعتها حياً ليتحسسها الطالب بأنامله." 
            : "Allows students to conceptualize complex structural objects and print them into tactile tangible 3D models."
        },
        { 
          x: 80, 
          y: 40, 
          title: isAr ? "محطة البرمجة المباشرة" : "Live Coding Center", 
          description: isAr 
            ? "حواسيب فائقة السرعة مبرمجة مسبقاً لمساعدة الطلاب على ترجمة شفرات الروبوت وتطبيقات الهواتف." 
            : "High-speed workstations configured with developer packages to teach students coding compilers and software logic."
        }
      ]
    },
    {
      id: "library",
      name: "Grand Library",
      locationName: isAr ? "المكتبة الثقافية ونادي القراء" : "Grand Cultural Library",
      panImage: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=1200&auto=format&fit=crop",
      description: isAr 
        ? "ملاذ المعرفة والتبحر، تحتوي على مراجع قيمة، وتستضيف تحديات القراءة والمراجعات الفخرية للروايات التاريخية."
        : "A silent haven of books, organizing reader challenges, scientific essay updates, and interactive literary critiques.",
      voiceOverText: isAr
        ? "خير جليس في الأنام كتاب. يسعدنا دعم عادة البحث والمطالعة عبر هذه الجلسات المريحة ومئات الكتب العربية والأجنبية الممتازة."
        : "A great book is your finest companion. We support research and deep inquiry with these comfortable setups and foreign books.",
      hotspots: [
        { 
          x: 25, 
          y: 50, 
          title: isAr ? "منصات البحث الرقمي" : "E-Database Terminals", 
          description: isAr 
            ? "واجهات مبرمجة لتصفح فهارس كبريات المكتبات العالمية الرقمية مجاناً لمنتسبي الصالحين." 
            : "Modern computer database terminals configured to browse prominent global academic publications for free."
        },
        { 
          x: 60, 
          y: 65, 
          title: isAr ? "ركن المناظرات والقصة" : "Rhetoric & Debates Corner", 
          description: isAr 
            ? "صالون أدبي مصغر لتبادل الأفكار وتدريب طلابنا على القيادة الخطابية وصنع القرار." 
            : "A cosy discussion corner to practice public speaking and literary analysis, helping students prepare for debates."
        }
      ]
    },
    {
      id: "field",
      name: "Sports Yard & Pitch",
      locationName: isAr ? "الملاعب الخضراء والصرح الرياضي" : "Sports Yard & Arena",
      panImage: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1200&auto=format&fit=crop",
      description: isAr 
        ? "القلب النابض لمباريات كأس الصالحين الكروي، مدعوم بممرات جري مهيأة ونظام إضاءة ليلي جذاب."
        : "The high-energy stage of sports leagues, featuring standard green grass, sprint tracks, and premium spotlights.",
      voiceOverText: isAr
        ? "في الحركة صحة ونماء. نولّي الرياضة والبدن اهتماماً بالغاً عبر هذه الملاعب الواسعة وبطولات التحدي التي تحرك روح التنافس الشريف."
        : "Movement breeds physical and mental growth. We emphasize athletics through our stadiums, supporting fair-play sports leagues.",
      hotspots: [
        { 
          x: 45, 
          y: 70, 
          title: isAr ? "منطقة الإحماء الصباحي" : "Morning Athletics Yard", 
          description: isAr 
            ? "مظلات مجهزة ومقاومة للشمس مخصصة لتمارين اللياقة والجمباز الصباحي لجميع الفئات." 
            : "Fully shaded shelters reserved for core gymnastics workouts and gymnastics routines across all school levels."
        }
      ]
    }
  ];

  const [currentLocIdx, setCurrentLocIdx] = useState(0);
  const activeLoc = locations[currentLocIdx];

  // Panoramic Pan simulation states
  const [rotationX, setRotationX] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isRotating, setIsRotating] = useState(true);
  const [selectedHotspot, setSelectedHotspot] = useState<any>(null);

  // Audio simulation (TTS narrator voice readout)
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [audioText, setAudioText] = useState("");

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setAudioText(activeLoc.voiceOverText);
    setSelectedHotspot(null);
    setRotationX(0); // Reset angle
    if (isAudioPlaying) {
      window.speechSynthesis.cancel();
      // Let it play the next automatically if they had speaker active
      const utterance = new SpeechSynthesisUtterance(activeLoc.voiceOverText);
      utterance.lang = isAr ? "ar-EG" : "en-US";
      utterance.rate = 1.0;
      utterance.onend = () => setIsAudioPlaying(false);
      window.speechSynthesis.speak(utterance);
    }
  }, [currentLocIdx]);

  useEffect(() => {
    let timer: any;
    if (isRotating) {
      timer = setInterval(() => {
        setRotationX((prev) => (prev + 0.12) % 360);
      }, 30);
    }
    return () => clearInterval(timer);
  }, [isRotating]);

  // Handle speaker toggle
  const handleSpeakerClick = () => {
    if (isAudioPlaying) {
      setIsAudioPlaying(false);
      window.speechSynthesis.cancel();
    } else {
      setIsAudioPlaying(true);
      const utterance = new SpeechSynthesisUtterance(activeLoc.voiceOverText);
      utterance.lang = isAr ? "ar-EG" : "en-US";
      utterance.rate = 0.95;
      utterance.onend = () => setIsAudioPlaying(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleLocationChange = (idx: number) => {
    setCurrentLocIdx(idx);
  };

  const [isDragging, setIsDragging] = useState(false);
  const previousX = useRef(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setIsRotating(false);
    previousX.current = e.clientX;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - previousX.current;
    setRotationX((prev) => (prev - deltaX * 0.22 + 360) % 360);
    previousX.current = e.clientX;
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  return (
    <div className={`rounded-2xl border border-cyan-500/15 bg-slate-900/40 p-5 shadow-xl font-sans space-y-6 ${
      isAr ? "text-right" : "text-left"
    }`} dir={isAr ? "rtl" : "ltr"}>
      
      {/* Upper header */}
      <div className={`flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b border-slate-800 pb-3`}>
        <div className="space-y-1">
          <div className={`flex items-center gap-1.5 ${isAr ? "justify-start" : "justify-start"}`}>
            <span className="inline-flex rounded-full bg-cyan-500/10 px-2.5 py-0.5 text-[9px] font-black text-cyan-400 capitalize leading-none tracking-widest">
              {isAr ? "جولة بانورامية ذكية ثلاثية الأبعاد" : "3D Interactive Panoramic Tour"}
            </span>
            <span className="inline-flex rounded-full bg-amber-500/10 px-2.5 py-0.5 text-[9px] font-black text-[#c5a85c] leading-none">
              {isAr ? "جديد وحصري" : "New & Exclusive"}
            </span>
          </div>
          <h4 className={`font-display text-base font-black text-white flex items-center gap-2 ${
            isAr ? "justify-start" : "justify-start"
          }`}>
            <Compass className="h-5 w-5 text-cyan-400 animate-spin-slow" />
            <span>{isAr ? "بوابة المعايشة الافتراضية وجولة الصالحين ثلاثية الأبعاد" : "Salheen Virtual Walkthrough & 3D Interactive Portal"}</span>
          </h4>
          <p className="text-[10.5px] text-slate-400 font-semibold leading-relaxed">
            {isAr 
              ? "تجول بنطاق 360 درجة كاملة داخل فصول وملاعب ومعامل مجمع الصالحين التعليمي، واكتشف التفاصيل الإنشائية بمحاكاة بصرية ثلاثية الأبعاد."
              : "Step into our smart classrooms, science labs, and sports arenas through an engaging 360° virtual system and explore specialized hotspots."
            }
          </p>
        </div>
      </div>

      {/* Primary Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        
        {/* Walkthrough Locations Map Menu */}
        <div className={`lg:col-span-1 space-y-3 ${isAr ? "order-last lg:order-first" : "order-last lg:order-first"}`}>
          <span className="text-[10px] text-slate-500 font-black block">
            {isAr ? "محطات وخريطة الجولة:" : "Walkthrough Map / Locations:"}
          </span>
          
          <div className="space-y-2 max-h-[300px] lg:max-h-[380px] overflow-y-auto pr-1">
            {locations.map((loc, idx) => {
              const isActive = idx === currentLocIdx;
              return (
                <button
                  key={loc.id}
                  onClick={() => handleLocationChange(idx)}
                  className={`w-full text-right p-3 rounded-xl border transition-all cursor-pointer flex flex-col gap-1 ${
                    isActive 
                      ? "bg-cyan-500/15 border-cyan-500/35 text-white" 
                      : "bg-slate-950/60 border-slate-850 hover:border-slate-800 text-slate-400 hover:text-slate-200"
                  }`}
                  dir={isAr ? "rtl" : "ltr"}
                >
                  <div className="flex justify-between items-center w-full">
                    <span className="text-[9.5px] tracking-wide font-bold font-mono opacity-80 uppercase">{loc.name}</span>
                    <MapPin className={`h-3.5 w-3.5 ${isActive ? "text-cyan-400 animate-bounce" : "text-slate-500"}`} />
                  </div>
                  <h5 className={`text-xs font-black ${isAr ? "text-right" : "text-left"}`}>{loc.locationName}</h5>
                </button>
              );
            })}
          </div>

          {/* Interactive Guided Voiceover Simulation Box */}
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-900 space-y-2">
            <div className="flex justify-between items-center text-[10.5px] font-black">
              <button
                onClick={handleSpeakerClick}
                className={`p-1.5 rounded-md border flex items-center gap-1 cursor-pointer transition-colors ${
                  isAudioPlaying 
                    ? "bg-rose-500/10 border-rose-500/20 text-rose-455 hover:bg-rose-550/20" 
                    : "bg-cyan-500/10 border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/20"
                }`}
              >
                {isAudioPlaying ? <VolumeX className="h-3 w-3 animate-pulse" /> : <Volume2 className="h-3 w-3" />}
                <span className="text-[9.5px]">
                  {isAudioPlaying 
                    ? (isAr ? "إيقاف التعقيب" : "Mute Guide") 
                    : (isAr ? "التعقيب الصوتي" : "Play Audio")
                  }
                </span>
              </button>
              <span className="text-slate-405 flex items-center gap-1 text-[9px] font-bold">
                <Sparkles className="h-2.5 w-2.5 text-yellow-450 animate-pulse" />
                <span>{isAr ? "المرشد الأكاديمي الرقمي" : "AI Digital Tour Guide"}</span>
              </span>
            </div>
            
            <p className={`text-[10.5px] text-slate-300 leading-relaxed font-semibold italic ${isAr ? "text-right" : "text-left"}`}>
              ✨ &quot;{activeLoc.voiceOverText}&quot;
            </p>
          </div>
        </div>

        {/* Big 3D Pan Canvas Shield */}
        <div className="lg:col-span-3 space-y-3">
          
          <div 
            ref={containerRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUpOrLeave}
            onMouseLeave={handleMouseUpOrLeave}
            className="relative h-[250px] sm:h-[350px] w-full rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 cursor-grab active:cursor-grabbing select-none"
          >
            {/* Visual background sweeping with inline rotation position */}
            <div 
              className="absolute inset-0 transition-transform duration-75 ease-out origin-center"
              style={{
                backgroundImage: `url(${activeLoc.panImage})`,
                backgroundSize: "cover",
                backgroundPosition: `${(rotationX / 360) * 100}% 50%`,
                transform: `scale(${zoomLevel})`,
              }}
            ></div>

            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/20 pointer-events-none"></div>

            {/* Position coordinate indicator */}
            <div className="absolute bottom-3 left-3 bg-slate-950/80 border border-slate-800 px-2 py-1 rounded-md text-[9px] font-mono text-cyan-400 select-none">
              POS-YAW: {rotationX.toFixed(1)}° | ZM: {zoomLevel.toFixed(1)}x
            </div>

            {/* Direction label */}
            <div className={`absolute top-3 ${isAr ? "right-3" : "left-3"} bg-slate-950/80 border border-slate-800 px-2 py-1 rounded-md text-[9px] text-slate-300 font-bold select-none`}>
              👁️ {isAr ? "اسحب بالماوس أو الإصبع للدوران الكامل بنطاق 360°" : "Drag camera with mouse or touch to pan 360 degrees"}
            </div>

            {/* Dynamic visual hotspots */}
            {activeLoc.hotspots.map((hs, hidx) => {
              const offsetAngle = (hs.x * 3.6) % 360;
              const currentRelativeAngle = (offsetAngle - rotationX + 360) % 360;
              const isVisibleInFront = currentRelativeAngle < 90 || currentRelativeAngle > 270;
              if (!isVisibleInFront) return null;

              let relativeXPercent = 50;
              if (currentRelativeAngle < 90) {
                relativeXPercent = 50 + (currentRelativeAngle / 180) * 100;
              } else {
                relativeXPercent = 50 - ((360 - currentRelativeAngle) / 180) * 100;
              }

              return (
                <button
                  key={hidx}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedHotspot(hs);
                  }}
                  className="absolute p-1 rounded-full bg-cyan-450 hover:bg-cyan-350 text-slate-950 shadow-xl border border-white animate-pulse cursor-pointer transform -translate-x-1/2 -translate-y-1/2 group transition-all z-20"
                  style={{
                    left: `${relativeXPercent}%`,
                    top: `${hs.y}%`
                  }}
                >
                  <Sparkles className="h-3 w-3" />
                  <span className="absolute bottom-6 right-1/2 translate-x-1/2 bg-slate-950 text-white text-[8.5px] px-2 py-0.5 rounded border border-slate-800 font-black whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                    {hs.title}
                  </span>
                </button>
              );
            })}

            {/* Selected hotspot details card */}
            {selectedHotspot && (
              <div className="absolute bottom-4 left-4 right-4 bg-slate-950/95 border border-cyan-500/20 p-4 rounded-xl shadow-2xl z-20 text-right space-y-1 animate-fade-in" dir={isAr ? "rtl" : "ltr"}>
                <div className="flex justify-between items-center">
                  <button 
                    onClick={() => setSelectedHotspot(null)}
                    className="text-[10px] text-slate-500 hover:text-white font-bold cursor-pointer"
                  >
                    {isAr ? "إغلاق ×" : "Close ×"}
                  </button>
                  <h6 className="text-[11px] font-black text-cyan-401 flex items-center gap-1 justify-end">
                    <Sparkles className="h-3.5 w-3.5 text-cyan-450 animate-pulse" />
                    <span>{isAr ? `ملاحظة تقنية: ${selectedHotspot.title}` : `Spotlight: ${selectedHotspot.title}`}</span>
                  </h6>
                </div>
                <p className={`text-[10.5px] text-slate-300 font-medium leading-relaxed leading-3 ${isAr ? "text-right" : "text-left"}`}>
                  {selectedHotspot.description}
                </p>
              </div>
            )}
          </div>

          {/* Panoramic control deck */}
          <div className="flex justify-between items-center flex-wrap gap-2 bg-slate-950 p-3 rounded-xl border border-slate-850">
            {/* Rotation toggle button */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsRotating(!isRotating)}
                className={`px-3 py-1.5 rounded-lg text-[9.5px] font-black border transition-all cursor-pointer flex items-center gap-1.5 ${
                  isRotating 
                    ? "bg-[#c5a85c]/10 border-[#c5a85c]/20 text-[#c5a85c]" 
                    : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                <RotateCw className={`h-3 w-3 ${isRotating ? "animate-spin" : ""}`} />
                <span>
                  {isRotating 
                    ? (isAr ? "تعطيل الدوران الذاتي" : "Stop Auto-Orbit") 
                    : (isAr ? "تمكين الدوران الذاتي" : "Auto-Orbit")
                  }
                </span>
              </button>
            </div>

            {/* Description note */}
            <div className={`text-[10.5px] text-slate-300 font-bold max-w-sm ${isAr ? "text-right" : "text-left"}`}>
              🏙️ <span className="text-white font-black">{activeLoc.locationName}:</span> {activeLoc.description}
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setZoomLevel((z) => Math.max(1, z - 0.25))}
                className="bg-slate-900 hover:bg-slate-800 border border-slate-800 p-2 rounded-lg text-slate-400 hover:text-white cursor-pointer"
                title="Zoom Out"
              >
                <ZoomOut className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setZoomLevel((z) => Math.min(2, z + 0.25))}
                className="bg-slate-900 hover:bg-slate-800 border border-slate-800 p-2 rounded-lg text-slate-400 hover:text-white cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
