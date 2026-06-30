import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

export default async function handler(req: any, res: any) {
  // CORS configuration to allow local development or any client requests
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { grade, subject, message, history } = req.body;
    
    // Detailed curriculum structure to train/guide the AI Study Buddy
    const systemInstruction = `أنت (SkooLy AI) مساعد المذاكرة الذكي في مدرسة الصالحين الرسمية للغات (El-Salheen Gov Language School).
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

    res.status(200).json({ text: result.text });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Something went wrong" });
  }
}
