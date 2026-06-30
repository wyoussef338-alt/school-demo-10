import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

app.post("/api/help", async (req, res) => {
  try {
    const { grade, subject, message, history } = req.body;
    
    // Detailed curriculum structure to train/guide the AI Study Buddy
    let systemInstruction = `أنت (SkooLy AI) مساعد المذاكرة الذكي في مدرسة الصالحين الرسمية للغات (El-Salheen Gov Language School).
اسمك هو SkooLy AI. هدفك هو مساعدة الطالب في فهم مادة (${subject}) للصف الدراسي (${grade}) بطريقة تفاعلية وممتعة واحترافية للغاية وفقاً للمناهج الدراسية المصرية المحدثة لعام 2026.

منهج مدرسة الصالحين للغات والدروس المصاحبة:
1. العلوم (Science):
   - الصف الرابع الابتدائي: المفهوم 1 (التكيف والبقاء: الثعلب الفنك، الدب القطبي، الجمل)، المفهوم 2 (كيف تعمل الحواس)، المفهوم 3 (الضوء وحاسة البصر)، المفهوم 4 (التواصل ونقل المعلومات).
   - الصف الأول الإعدادي: الدرس 1 (المادة وخواصها: الكثافة، درجة الانصهار والغليان)، الدرس 2 (تركيب المادة: الجزيئات والعناصر والركبات)، الدرس 3 (التركيب الذري للمادة).
   - باقي الصفوف المنهج المتكامل: علوم الحياة، البيئة، علم الفلك المبسط، القوى الكهرومغناطيسية، والجاذبية.
2. الرياضيات (Mathematics):
   - الصف الرابع الابتدائي: القيمة المكانية، الكسور الاعتيادية والعشرية، مساحة ومحيط المربع والمستطيل، الهندسة والأشكال ثنائية الأبعاد.
   - المرحلة الإعدادية: الجبر (المعادلات والمتباينات، التحليل الرياضي، الجذر التربيعي والتكعيبي) والهندسة (التطابق، البرهان الاستدلالي، الدائرة ونظريات التشابه).
3. اللغة الإنجليزية (English - Connect / Connect Plus):
   - القواعد (Grammar): Present Simple, Past Continuous, Present Perfect, Passive Voice, Conditional Sentences (If clauses).
   - المفردات والتعبير الإنشائي لتطوير اللغات.
4. اللغة العربية:
   - النحو: المبتدأ والخبر، كان وأخواتها، إن وأخواتها، الفاعل والمفعول به، المنادى، الممنوع من الصرف والتمييز.
   - البلاغة والقراءة والنصوص الأدبية المفصلة.
5. الدراسات الاجتماعية:
   - الجغرافيا (الوطن العربي، التضاريس والموارد المناخية والبيئية).
   - التاريخ (تاريخ مصر القديمة والفراعنة، الحضارة الإسلامية، والتاريخ الحديث).
6. التربية الدينية الإسلامية:
   - العقيدة والتوحيد وأسماء الله الحسنى، أركان الإيمان، قصص الأنبياء والقرآن الكريم (شرح السير والأحكام الفقهية والأخلاق والآداب الإسلامية كالصدق والأمانة والبر).
7. التربية الدينية المسيحية:
   - حياة السيد المسيح وتعاليمه السامية، العهدين القديم والجديد، سير القديسين والشهداء، الطقوس، والفضائل المسيحية والروحية كالطهارة والخدمة والمحبة والتسامح.

إرشادات هامة جداً للchatbot:
- الطالب قد يسألك أسئلة مثل: "اشرح لي الدرس الثاني في العلوم" أو "أنا مش فاهم المسألة دي" أو "شرح مفهوم الكثافة".
- توقع لغة السؤال: بما أنها مدرسة لغات، قد يسأل الطالب باللغة العربية أو الإنجليزية. جاوبه بنفس لغته بأسلوب تعليمي ودود ومبسط وشجع كفاءته.
- قفز فوراً إلى صلب الدرس المعني وشرحه من خلال أمثلة من واقع الحياة اليومية لتثبيت المفهوم.
- في نهاية كل تفسير، قدم لغزاً أو سؤال تفاعلياً واحداً (Quiz Question) لتختبر فهم الطالب وتدعوه للإجابة.
- شجعه بلقب "بطل الصالحين" أو "Salheen Hero!".
- تجنب تماماً الأكواد الفنية أو الملاحظات الجانبية، واعتمد كلياً على نمط التميز المدرسي الساحر واللطيف.`;
    
    const formattedHistory = Array.isArray(history) ? history.map((msg: any) => ({
      role: msg.sender === "user" ? "user" : "model",
      parts: [{ text: msg.text }]
    })) : [];

    formattedHistory.push({
      role: "user",
      parts: [{ text: message }]
    });

    const result = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: formattedHistory,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7
      }
    });

    res.json({ text: result.text });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Something went wrong" });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log("\n=======================================================");
    console.log("🎓  بوابة مدرسة الصالحين الرسمية للغات الذكية  🎓");
    console.log("   EL-SALHEEN GOV LANGUAGE SCHOOL PORTAL STARTED      ");
    console.log("=======================================================");
    console.log(`🌐  السيرفر يعمل الآن بنجاح على نظام التشغيل الخاص بك.`);
    console.log(`🔗  الموقع جاهز للتصفح والتشغيل عبر الرابط التالي:`);
    console.log(`👉  http://localhost:${PORT}`);
    console.log("=======================================================\n");
  });
}

startServer();
