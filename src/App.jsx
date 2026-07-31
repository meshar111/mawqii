import React, { useState } from "react";

/* ── نظام التصميم ──────────────────────────────
   لوحة مستوحاة من الخرائط الطبوغرافية: حبر داكن،
   ورق خرائط بارد، وإشارات ملوّنة تدلّ على الفرصة/الإشباع.
   العنصر المميّز: شبكة الأحياء الحرارية (كل خلية = فرصة). */
const T = {
  ink:"#0D1F2A", ink2:"#22323E", paper:"#EDF1F3", paper2:"#F7F9FA",
  line:"#D6DFE4", muted:"#6B7F8B",
  gap:"#0E9E8F",      // فجوة/فرصة
  hot:"#E24C3F",      // إشباع/منافسة
  gold:"#C8912B",     // درجة
  cool:"#3F6E8C",     // محايد
};

const COUNTRIES = {
  "السعودية": {
    "الرياض":["النرجس","الملقا","حطين","القيروان","العارض","اليرموك","الياسمين","قرطبة","النخيل","العليا","السليمانية","الروضة","النسيم","المروج","الصحافة","الوادي","غرناطة","الازدهار","الشفا","بدر","العزيزية","المونسية","الرمال","اشبيلية","الخليج","الربوة","الملز","السويدي","ظهرة لبن","العقيق","الرائد","الواحة","التعاون","المصيف","الرحمانية","المغرزات","النفل","الفلاح","الندى","الربيع","الصحافة","حي السفارات","المهدية","عرقة","الدرعية","لبن","نمار","تويق","العريجاء","شبرا","الشميسي","أم الحمام","المعذر","الورود","الملك فهد","الملك فيصل","الملك عبدالله","الحمراء","القدس","الأندلس","الجزيرة","منفوحة"],
    "جدة":["الشاطئ","الروضة","السلامة","النعيم","الحمراء","الصفا","المروة","الرحاب","النزهة","الزهراء","البساتين","الفيصلية","المرجان","اللؤلؤ","الشرفية","البلد","العزيزية","الأندلس","بني مالك","الربوة","السامر","الأجواد","الفيحاء","مشرفة","الواحة","الخالدية","الرويس","الثغر","قويزة","أبحر الشمالية","أبحر الجنوبية","الياقوت","الصواري","ذهبان","الحرازات","الجامعة","النهضة","التضامن","السليمانية","الوزيرية","الكندرة","الهنداوية","غليل","النسيم","الأمير عبدالمجيد","الرحمانية","الفروسية","بريمان","الصفاء"],
    "مكة":["العزيزية","النسيم","الشوقية","العوالي","الششة","الزاهر","الرصيفة","بطحاء قريش","المسفلة","الهجرة","الخالدية","الروضة","النزهة","الشرائع","الكعكية","جرول","الهنداوية","الزهراء","التنعيم","الجميزة","المعابدة","النوارية","ولي العهد","الحجون","الراشدية","الخنساء","الأندلس","الحسينية","المرسلات","العدل","بحرة","الليث"],
    "المدينة":["العنابس","الخالدية","الرانوناء","قباء","العوالي","الدفاع","الجرف","الحرة الشرقية","الحرة الغربية","العزيزية","بني حارثة","بني ظفر","السيح","المبعوث","الجمعة","العريض","شوران","سلطانة","النخيل","المطار","الأزهري","الإسكان","ابو كبير","الدويمة","السد","المناخة","القبلتين","الملك فهد","الرانوناء الجنوبي","النقا"],
    "الدمام":["الشاطئ","الفيصلية","النور","الجامعيين","الأنداء","الروضة","الزهور","النزهة","المنار","بدر","الفنار","المريكبات","الخليج","الجلوية","الطبيشي","العدامة","النخيل","الواحة","الحمراء","الأثير","الشعلة","النسيم","المزروعية","السلام","العزيزية","اليرموك","الاتصالات","القادسية","ابن خلدون","الصفا"],
    "الخبر":["العقربية","الراكة","الثقبة","الجسر","الحزام الذهبي","الخبر الشمالية","الخبر الجنوبية","الكورنيش","البندرية","الروابي","اليرموك","الهدا","الأندلس","الصواري","التحلية","المها","العليا","الخزامى","اشبيلية","الحمراء","الجوهرة","الدانة","السفن","الخبر الشرقية"],
    "الظهران":["الدوحة","تلال الظهران","القشلة","هجر","الجامعة","الدانة","الخالدية"],
    "الأحساء":["الهفوف","المبرز","الرقيقة","الخالدية","النايفية","السلمانية","محاسن","المزروع","الصالحية","الفيصلية","الرابية","الشهابية","العزيزية","النزهة","الطرف","العمران","الجفر","العيون"],
    "الجبيل":["الفناتير","الدفي","الفيحاء","الحويلات","الروضة","اللؤلؤ","الدانة","النخيل","المطرفية","الجلمودة","الحمراء"],
    "الطائف":["الحوية","شهار","الفيصلية","السلامة","الوسام","القمرية","الشرقية","الشفا","الهدا","نخب","معشي","السداد","الشهداء","العزيزية","الخالدية","الريان"],
    "أبها":["المنسك","الموظفين","الوردتين","الخالدية","الربوة","النسيم","السد","المفتاحة","شمسان","الشعف","الأندلس","السامر","المروج","النزهة"],
    "خميس مشيط":["الراقي","الوسام","الموسى","النسيم","الضباب","تندحة","الشرف","الفيصلية","الأندلس","المنسك"],
    "تبوك":["المروج","السلام","الورود","الفيصلية","العزيزية","الروضة","الأخضر","المنشية","الصناعية","الريان","النهضة","الخالدية","المصيف"],
    "بريدة":["الصفراء","الروضة","الخليج","النهضة","الرحاب","الفايزية","الشماس","الإسكان","الرابية","المنتزه","الزرقاء","الوسيطاء"],
    "حائل":["النقرة","المنتزه","الخزامى","الوادي","السمراء","الزهراء","المطار","الخالدية","النقرة الشرقية","بدنة"],
    "نجران":["الفيصلية","الفهد","الغويلا","الحصينية","الجربة","المشعلية","الضباط","الأمير مشعل"],
    "جازان":["الروضة","المطار","الصفا","الشاطئ","السويس","الرويس","المحمدية","الجابرية"],
    "ينبع":["الحمراء","الشرم","الأمير عبدالمجيد","الفيصلية","الرضا","البحر","النخيل","الياقوت","الصناعية"],
  },
  "الإمارات": {
    "دبي":["الجميرا","البرشاء","دبي مارينا","ديرة","الخوانيج","بر دبي","القوز","المزهر","الورقاء","الرشيدية","المنخول","الكرامة","السطوة","أم سقيم","الصفوح","الخليج التجاري","وسط مدينة دبي","تلال الإمارات","القرهود","مردف","النهدة","المرقبات","العوير","ند الشبا","الطوار","الممزر","الرقة","جميرا فيليج","دبي لاند","سيليكون واحة","المدينة العالمية","الفرجان","ديسكفري جاردنز","جبل علي","الجداف","زعبيل","بلوواترز","نخلة جميرا"],
    "أبوظبي":["الخالدية","المرور","الريم","المشرف","الكورنيش","المصفح","الشامخة","الباهية","الشهامة","الروضة","النادي السياحي","حدائق الراحة","خليفة","الرحبة","المنهل","المرور الجديد","محمد بن زايد","الشاطئ","السعديات","ياس","الظفرة","الوثبة","البطين","الكرامة","الدانة","المطار"],
    "الشارقة":["المجاز","القاسمية","النهدة","الخان","التعاون","الناصرية","الرملة","الغافية","الجزات","الشهباء","الياسمين","الممزر","أبوشغارة","الصجعة","المنطقة الصناعية","الرحمانية","المويلح","السيوح","الحزانة","السجعة"],
    "عجمان":["الراشدية","النعيمية","الجرف","الروضة","الحميدية","المويهات","الزاهية","الرميلة","الياسمين"],
    "رأس الخيمة":["النخيل","الدفن","الرمس","الجزيرة الحمراء","الحمرا","المعيريض","خزام","العريبي","الظيت"],
    "الفجيرة":["الفصيل","مدينة الفجيرة","دبا","مربح","الحيل","العقة"],
    "أم القيوين":["الراس","السلمة","الرملة","المدار","الحميدية"],
    "العين":["المعترض","الجيمي","الهيلي","المقام","الطوية","الفوعة","الخبيصي","سنايع","المريجب","الصاروج","زاخر","الياسمين"],
  },
  "الكويت": {
    "مدينة الكويت":["السالمية","حولي","الجابرية","الفروانية","السرة","بيان","مشرف","الشعب","الدسمة","الشرق","القبلة","الدعية","القادسية","الشامية","الروضة","الخالدية","العديلية","كيفان","الفيحاء","النزهة","الشويخ","الرميثية","الزهراء","صباح السالم","المنقف","الفنطاس","المهبولة","أبو حليفة","العقيلة","الفحيحيل","الأحمدي","الجهراء","صباح الأحمد","الصباحية","سلوى","ميدان حولي","الشهداء","القرين","العارضية","خيطان","الرقعي","صباح الناصر","الأندلس","اشبيلية","جليب الشيوخ"],
  },
  "قطر": {
    "الدوحة":["الوعب","الغرافة","الدفنة","اللؤلؤة","الريان","الخليج الغربي","المنتزه","بن محمود","السد","المرقاب","نجمة","المنصورة","الثمامة","المعمورة","الهلال","العزيزية","الغانم","مشيرب","الوكرة","أم صلال","الخور","الشمال","لوسيل","معيذر","الخريطيات","بن عمران","الوسيل","النصر","الجميلية","المرخية","السيلية","أبو هامور","أبو سدرة","الصناعية"],
  },
  "البحرين": {
    "المنامة":["الجفير","السيف","العدلية","الرفاع","الحد","المحرق","مدينة عيسى","مدينة حمد","سترة","البسيتين","القضيبية","الحورة","الماحوز","أم الحصم","السنابس","الزنج","النعيم","بوقوة","توبلي","جد حفص","سار","البديع","الجنبية","عالي","سلماباد","الرفاع الشرقي","الرفاع الغربي","دلمونيا","أمواج","الدير","سماهيج","عراد"],
  },
  "عُمان": {
    "مسقط":["الخوير","الغبرة","القرم","السيب","مطرح","روي","الوطية","الحيل","المعبيلة","الموالح","العذيبة","بوشر","الأنصب","المسفاة","العامرات","قنتب","الجفنين","دارسيت","الوادي الكبير","الخوض","المسفاة الجديدة","شاطئ القرم","المنومة","حلبان"],
    "صلالة":["الدهاريز","الحافة","صلالة الوسطى","عوقد","السعادة","الروبات","الوادي","الحصن"],
    "صحار":["الحمبار","الترف","الملتقى","صحار الجديدة","الوقيبة","العوهي"],
    "نزوى":["فرق","تنوف","سعال","العقر","الغنتق"],
  },
};
const BUDGET = ["أقل من ٢٠٠ ألف","٢٠٠–٥٠٠ ألف","٥٠٠ ألف – مليون","أكثر من مليون"];
const SECTORS = [
  {id:"all",  n:"كل القطاعات"},
  {id:"food", n:"مطاعم وكافيهات"},
  {id:"retail",n:"تجزئة وبقالات"},
  {id:"kids", n:"أطفال وترفيه"},
  {id:"serv", n:"خدمات يومية"},
  {id:"health",n:"صحة ورياضة"},
];

// بيانات عرض توضيحية للتصميم
const DEMO = {
  score: 78,
  verdict: "فرصة جيدة مع تحفّظ",
  cells: [72,54,88,41,63,91,35,77,58,46,83,29,66,74,52,38],
  // ملمح الحي — الأساس الذي تُبنى عليه التوصيات
  profile: {
    headline:"حي سكني شاب — كثافة شقق عالية وعوائل صغيرة",
    facts:[
      {k:"نمط السكن", v:"٧٤٪ شقق", tone:"gap"},
      {k:"متوسط الأسرة", v:"٤.٢ فرد", tone:"cool"},
      {k:"الفئة الغالبة", v:"٢٥–٤٠ سنة", tone:"cool"},
      {k:"مدارس ضمن ٢ كم", v:"٦ مدارس", tone:"gap"},
    ],
    reading:"كثافة الشقق مع وجود المدارس تعني عوائل بأطفال ومساحات منزلية ضيقة — الطلب يتجه لأماكن تستوعب الأطفال خارج البيت، ولخدمات تختصر وقت الأسرة."
  },
  types: [
    { s:"food",  n:"مشاوي ومندي", count:14, rating:4.3, state:"مشبع" },
    { s:"food",  n:"برجر وسندويتش", count:11, rating:3.6, state:"مشبع بجودة ضعيفة" },
    { s:"food",  n:"كافيه ومخبوزات", count:9, rating:4.5, state:"مشبع" },
    { s:"food",  n:"مطبخ آسيوي", count:2, rating:4.1, state:"فجوة" },
    { s:"retail",n:"بقالة وسوبرماركت", count:7, rating:3.8, state:"مشبع" },
    { s:"retail",n:"صيدلية", count:4, rating:4.2, state:"متوازن" },
    { s:"kids",  n:"ملاعب ومراكز أطفال", count:1, rating:3.4, state:"فجوة" },
    { s:"kids",  n:"حضانة ورعاية", count:2, rating:4.0, state:"فجوة" },
    { s:"serv",  n:"مغسلة ملابس", count:3, rating:3.7, state:"متوازن" },
    { s:"serv",  n:"صالون ومشغل", count:8, rating:4.1, state:"مشبع" },
    { s:"health",n:"نادي رياضي", count:2, rating:4.4, state:"فجوة" },
    { s:"health",n:"عيادة أسنان", count:5, rating:4.3, state:"متوازن" },
  ],
  gaps: [
    { s:"kids", t:"مركز ألعاب أطفال", why:"مركز واحد بتقييم ٣.٤ مقابل ٧٤٪ شقق و٦ مدارس قريبة — الطلب أكبر من المعروض بوضوح.", fit:"يناسب ميزانية متوسطة ومساحة ٣٠٠–٥٠٠م" },
    { s:"health", t:"نادي رياضي نسائي", why:"ناديان فقط في نطاق ٢ كم، ولا يوجد خيار نسائي مخصّص رغم الفئة العمرية الشابة.", fit:"يحتاج موقع بمدخل مستقل ومواقف" },
    { s:"food", t:"مطبخ آسيوي", why:"منافسان فقط، والطلب على التوصيل مرتفع في الحي.", fit:"يبدأ بمساحة صغيرة أو مطبخ سحابي" },
  ],
  // ترشيحات إضافية للمستثمر — أفكار لم يسألها لكنها تخدم نفس الحي
  extras: [
    { t:"مغسلة ملابس ذاتية", why:"سكان الشقق بلا مساحة نشر — ٣ مغاسل فقط وتقييمها متوسط.", tag:"رأس مال منخفض" },
    { t:"نقاط استلام طلبات", why:"كثافة الشقق ترفع مشكلات التسليم، ولا يوجد نقطة استلام في الحي.", tag:"دخل مساند" },
    { t:"مركز دروس ومهارات للأطفال", why:"٦ مدارس قريبة وطلب عائلي على أنشطة ما بعد الدوام.", tag:"يكمّل مركز الألعاب" },
  ],
  risks: [
    "إيجارات الشارع الرئيسي أعلى ٣٥٪ من متوسط الحي.",
    "٣ محال أُغلقت خلال ١٨ شهراً في نفس النطاق.",
    "ذروة الطلب مساءً فقط — الصباح ضعيف.",
    "مراكز الأطفال تحتاج اشتراطات سلامة تطيل مدة الترخيص.",
  ],
  checks: [
    "زر الموقع في ثلاث أوقات مختلفة وعُدّ المارّة.",
    "اسأل ٥ من جيران المحل عن سبب إغلاق المحال السابقة.",
    "تحقّق من مواقف السيارات في وقت الذروة.",
    "راجع اشتراطات البلدية للنشاط قبل توقيع العقد.",
  ],
  landmarks: [
    { label:"مدارس", count:6 }, { label:"مساجد", count:7 },
    { label:"حدائق", count:2 }, { label:"بنوك", count:3 },
  ],
  discovery: {
    density: 58,
    direct: [
      { activity:"محلات حلى وحلويات", kind:"غياب تام", capital:"منخفض",
        signal:"لا يوجد أي محل حلى ضمن النطاق — السكان يخرجون خارج الحي لهذه الحاجة." },
      { activity:"مراكز ألعاب أطفال", kind:"جودة ضعيفة", capital:"متوسط",
        signal:"مركز واحد بمتوسط تقييم ٣.٤ — الطلب موجود لكن الرضا منخفض، ومساحة التميّز واسعة." },
      { activity:"مغاسل سيارات", kind:"غياب تام", capital:"منخفض",
        signal:"لا توجد أي مغسلة سيارات ضمن النطاق رغم كثافة الحركة." },
      { activity:"عصائر ومشروبات", kind:"ندرة", capital:"منخفض",
        signal:"واحد فقط في حي نشط تجارياً — تغطية أقل من حاجة الحي." },
    ],
    inferred: [
      { ideas:["مركز دروس ومهارات بعد الدوام","قرطاسية وطباعة","مقهى دراسة هادئ","محل حلى قرب المدارس"],
        why:"٦ مدارس في النطاق — حركة عائلية يومية وأطفال في أوقات محددة." },
      { ideas:["محل عطور وبخور","مكتبة ومستلزمات دينية","محل تمور وضيافة"],
        why:"٧ مساجد — حركة يومية متكررة وأنماط شراء مرتبطة بها." },
      { ideas:["محل حلى وحلويات","مقهى حلويات","بوفيه كيك وتورتات"],
        why:"كثافة مطاعم عالية مع غياب محلات الحلى — الحلى مكمّل طبيعي بعد الوجبات." },
      { ideas:["عربة قهوة متنقلة","تأجير دراجات وسكوتر","محل ألعاب خارجية"],
        why:"حديقتان — تجمّعات مسائية وعائلية تخلق طلباً موسمياً ومتكرراً." },
    ],
  },
};

export default function App(){
  const [step,setStep]=useState(0);           // 0 = إدخال، 1 = نتيجة
  const [country,setCountry]=useState("السعودية");
  const [city,setCity]=useState("الرياض");
  const [hood,setHood]=useState("النرجس");
  const [budget,setBudget]=useState(BUDGET[1]);
  const [sector,setSector]=useState("all");
  const [client,setClient]=useState("");
  const [busy,setBusy]=useState(false);
  const [live,setLive]=useState(null);
  const [notice,setNotice]=useState("");
  const D = live || DEMO;
  const reportId = React.useMemo(()=>"MQ-"+Math.random().toString(36).slice(2,7).toUpperCase(),[]);
  const today = new Date().toLocaleDateString("ar-SA",{year:"numeric",month:"long",day:"numeric"});

  // يحوّل رد السيرفر إلى شكل بيانات الواجهة
  function mapLive(j){
    const sm={ food:"food", retail:"retail", kids:"kids", serv:"serv", health:"health", fun:"kids" };
    return {
      score: j.overall,
      verdict: j.overall>=75?"فرصة قوية":j.overall>=55?"فرصة جيدة مع تحفّظ":j.overall>=40?"تحتاج تمايزاً واضحاً":"غير موصى به",
      cells: (j.sectors||[]).map(s=>s.score).slice(0,16),
      profile: DEMO.profile,
      types: (j.sectors||[]).map(s=>({ s: sm[s.sector]||"serv", n:s.label, count:s.count,
        rating: s.avgRating||"—", state:s.state })),
      gaps: (j.gaps||[]).map(g=>({ s:"all", t:g.sector, why:g.why,
        fit:`درجة الفرصة ${g.score}/100${g.capital?` · رأس مال ${g.capital}`:""}` })),
      extras: DEMO.extras,
      risks: (j.sectors||[]).flatMap(s=>s.flags||[]).filter((v,i,a)=>a.indexOf(v)===i).slice(0,4),
      checks: DEMO.checks,
      meta: j.meta,
      discovery: (j.discovery && (j.discovery.direct?.length || j.discovery.inferred?.length)) ? j.discovery : DEMO.discovery,
      landmarks: j.landmarks?.length ? j.landmarks : DEMO.landmarks,
    };
  }

  async function analyze(){
    setBusy(true); setNotice("");
    try{
      const r = await fetch("/api/analyze",{ method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ country, city, hood, radius:2000,
          profile:{ apartmentsPct:74, schools:6, youngPct:63 } }) });
      const j = await r.json();
      if(j.error) throw new Error(j.error);
      setLive(mapLive(j));
    }catch(e){
      setLive(null);
      setNotice("تعذّر جلب البيانات الحيّة ("+(e.message||"خطأ")+") — يُعرض نموذج توضيحي.");
    }finally{ setBusy(false); setStep(1); }
  }

  const cellColor=(v)=> v>=75 ? T.gap : v>=55 ? "#7FB3A8" : v>=40 ? "#C9C0A8" : T.hot;
  const shown = sector==="all" ? D.types : D.types.filter(t=>t.s===sector);
  const gapsShown = sector==="all" ? D.gaps : D.gaps.filter(g=>g.s===sector);
  const maxCount = Math.max(...D.types.map(t=>t.count));

  return (
    <div dir="rtl" style={{minHeight:"100%",background:T.paper,color:T.ink,
      fontFamily:"'Tajawal',system-ui,sans-serif"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@600;800;900&family=Tajawal:wght@400;500;700;800&display=swap');
        *{box-sizing:border-box}
        .disp{font-family:'Cairo','Tajawal',sans-serif}
        button,select{font-family:inherit}
        button:focus-visible,select:focus-visible{outline:3px solid ${T.cool};outline-offset:2px}
        .cell{transition:transform .18s ease, filter .18s ease}
        .cell:hover{transform:translateY(-2px) scale(1.04);filter:saturate(1.25)}
        .rise{animation:rise .5s cubic-bezier(.2,.8,.2,1) both}
        @keyframes rise{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
        @media (prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}}
        @media print{
          .noprint{display:none!important}
          body{background:#fff}
          main{padding:0!important;max-width:100%!important}
          section>div,section>div>div{box-shadow:none!important;break-inside:avoid}
        }
      `}</style>

      {/* شريط علوي */}
      <header style={{borderBottom:`1px solid ${T.line}`,background:T.paper2}}>
        <div style={{maxWidth:1080,margin:"0 auto",padding:"14px 18px",display:"flex",alignItems:"center",gap:12}}>
          <div style={{width:38,height:38,borderRadius:11,background:T.ink,display:"grid",placeItems:"center",flexShrink:0}}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 21s7-6.1 7-11a7 7 0 1 0-14 0c0 4.9 7 11 7 11Z" stroke={T.gap} strokeWidth="2"/>
              <circle cx="12" cy="10" r="2.4" fill={T.gold}/>
            </svg>
          </div>
          <div style={{flex:"1 1 auto",minWidth:0}}>
            <div className="disp" style={{fontWeight:800,fontSize:19,letterSpacing:"-.3px"}}>مَوقِعي</div>
            <div style={{fontSize:12.5,color:T.muted}}>ذكاء موقعي لمن ينوي فتح مشروع</div>
          </div>
          <nav aria-label="مراحل" style={{display:"flex",gap:6,fontSize:12.5,fontWeight:700}}>
            {["الموقع","التحليل"].map((s,i)=>(
              <span key={s} style={{padding:"6px 13px",borderRadius:99,
                background:i===step?T.ink:"transparent",color:i===step?"#fff":T.muted,
                border:`1px solid ${i===step?T.ink:T.line}`}}>{s}</span>))}
          </nav>
        </div>
      </header>

      <main style={{maxWidth:1080,margin:"0 auto",padding:"26px 18px 56px"}}>

        {step===0 && (
        <section className="rise">
          {/* عنوان رئيسي */}
          <div style={{maxWidth:660}}>
            <p style={{margin:0,color:T.gap,fontWeight:800,fontSize:13.5,letterSpacing:".4px"}}>قبل أن توقّع عقد الإيجار</p>
            <h1 className="disp" style={{margin:"10px 0 0",fontSize:"clamp(30px,5vw,46px)",lineHeight:1.25,fontWeight:900,letterSpacing:"-1px"}}>
              اعرف ما ينقص الحي<span style={{color:T.gap}}>.</span> قبل أن تستثمر فيه<span style={{color:T.gap}}>.</span>
            </h1>
            <p style={{color:T.ink2,fontSize:17,lineHeight:1.85,marginTop:14}}>
              نقرأ الأنشطة القائمة حول الموقع — مطاعم، بقالات، مراكز أطفال، خدمات — ونقيس الإشباع،
              ثم نعرض الفجوات التي يحتاجها سكان الحي فعلاً.
            </p>
          </div>

          {/* نموذج الإدخال */}
          <div style={{background:"#fff",border:`1px solid ${T.line}`,borderRadius:18,padding:20,marginTop:24,
            boxShadow:"0 14px 34px rgba(13,31,42,.07)"}}>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(210px,1fr))",gap:14}}>
              <Field label="الدولة">
                <select value={country} onChange={e=>{const c=e.target.value;const ct=Object.keys(COUNTRIES[c])[0];
                  setCountry(c);setCity(ct);setHood(COUNTRIES[c][ct][0]);}} style={sel}>
                  {Object.keys(COUNTRIES).map(c=><option key={c}>{c}</option>)}
                </select>
              </Field>
              <Field label="المدينة">
                <select value={city} onChange={e=>{setCity(e.target.value);setHood(COUNTRIES[country][e.target.value][0]);}} style={sel}>
                  {Object.keys(COUNTRIES[country]).map(c=><option key={c}>{c}</option>)}
                </select>
              </Field>
              <Field label="الحي — اكتب أي حي أو اختر من القائمة">
                <input list="hoods" value={hood} onChange={e=>setHood(e.target.value)}
                  placeholder="اكتب اسم حيّك…" style={sel}/>
                <datalist id="hoods">
                  {COUNTRIES[country][city].map(h=><option key={h} value={h}/>)}
                </datalist>
              </Field>
              <Field label="ميزانية التأسيس">
                <select value={budget} onChange={e=>setBudget(e.target.value)} style={sel}>
                  {BUDGET.map(b=><option key={b}>{b}</option>)}
                </select>
              </Field>
              <Field label="اسم صاحب التقرير (يظهر على الغلاف)">
                <input value={client} onChange={e=>setClient(e.target.value)} placeholder="اختياري — مثال: شركة رواد الاستثمار" style={sel}/>
              </Field>
            </div>

            <div style={{marginTop:16}}>
              <span style={{display:"block",fontSize:13,fontWeight:800,marginBottom:9,color:T.ink2}}>
                القطاع الذي يهمّك <span style={{color:T.muted,fontWeight:600}}>— اتركه على «الكل» لترى كل الفرص</span>
              </span>
              <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                {SECTORS.map(s=>{const on=s.id===sector;
                  return <button key={s.id} onClick={()=>setSector(s.id)}
                    style={{padding:"9px 16px",borderRadius:99,cursor:"pointer",fontSize:14,fontWeight:700,
                      border:`1.5px solid ${on?T.ink:T.line}`,background:on?T.ink:"#fff",color:on?"#fff":T.ink2}}>
                    {s.n}</button>;})}
              </div>
            </div>
            <button onClick={analyze} disabled={busy} style={{...primary,marginTop:16,opacity:busy?.7:1}}>
              {busy?"نقرأ الحي…":"اقرأ الحي"}
            </button>
            <p style={{margin:"12px 2px 0",fontSize:12.5,color:T.muted,lineHeight:1.7}}>
              تقرير واحد لكل موقع. النتائج إرشادية وتُستكمل بزيارة ميدانية.
            </p>
          </div>

          {/* ماذا ستحصل عليه */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(230px,1fr))",gap:12,marginTop:22}}>
            {[["درجة الفرصة","رقم واحد يلخّص وضع الحي"],
              ["خريطة الإشباع","أي جهة مزدحمة وأيها فارغة"],
              ["الفجوات","تصنيفات لم يشغلها أحد"],
              ["ما يجب أن تتحقق منه","أسئلة ميدانية قبل القرار"]].map(([t,s])=>(
              <div key={t} style={{background:T.paper2,border:`1px solid ${T.line}`,borderRadius:14,padding:"14px 16px"}}>
                <div className="disp" style={{fontWeight:800,fontSize:16}}>{t}</div>
                <div style={{color:T.muted,fontSize:14,marginTop:5,lineHeight:1.7}}>{s}</div>
              </div>))}
          </div>
        </section>)}

        {step===1 && (
        <section className="rise">
          <div className="noprint" style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"center"}}>
            <button onClick={()=>setStep(0)} style={ghost}>← تغيير الموقع</button>
            <div style={{marginInlineStart:"auto",display:"flex",gap:8,flexWrap:"wrap"}}>
              <button onClick={()=>window.print()} style={{...ghost,borderColor:T.ink,color:T.ink,fontWeight:800}}>حفظ كـ PDF</button>
              <button onClick={()=>{navigator.clipboard?.writeText(`تقرير ${reportId} — ${city} · حي ${hood}`);}}
                style={{...primary,width:"auto",padding:"9px 20px",fontSize:14,borderRadius:99}}>نسخ رابط التقرير</button>
            </div>
          </div>

          {/* غلاف التقرير */}
          <div style={{background:"#fff",border:`1px solid ${T.line}`,borderRadius:18,padding:22,marginTop:14,
            boxShadow:"0 10px 26px rgba(13,31,42,.05)"}}>
            <div style={{display:"flex",justifyContent:"space-between",gap:16,flexWrap:"wrap",alignItems:"flex-start"}}>
              <div style={{display:"flex",gap:12,alignItems:"center"}}>
                <div style={{width:46,height:46,borderRadius:13,background:T.ink,display:"grid",placeItems:"center",flexShrink:0}}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M12 21s7-6.1 7-11a7 7 0 1 0-14 0c0 4.9 7 11 7 11Z" stroke={T.gap} strokeWidth="2"/>
                    <circle cx="12" cy="10" r="2.4" fill={T.gold}/>
                  </svg>
                </div>
                <div>
                  <div className="disp" style={{fontWeight:900,fontSize:20,letterSpacing:"-.3px"}}>تقرير ذكاء موقعي</div>
                  <div style={{fontSize:13.5,color:T.muted}}>{city} · حي {hood} · نطاق ٢ كم</div>
                </div>
              </div>
              <div style={{textAlign:"left",fontSize:12.5,color:T.muted,lineHeight:1.9}}>
                <div>رقم التقرير: <b style={{color:T.ink}}>{D.meta?.reportId||reportId}</b></div>
                <div>التاريخ: {today}</div>
                {client&&<div>أُعِدّ لـ: <b style={{color:T.ink}}>{client}</b></div>}
                <div style={{marginTop:6}}>
                  <span style={{fontSize:11.5,fontWeight:800,padding:"3px 10px",borderRadius:99,
                    background:live?"#E4F4F1":"#F4EFE1",color:live?T.gap:T.gold}}>
                    {live?"بيانات حيّة":"نموذج توضيحي"}</span>
                </div>
              </div>
            </div>
            {notice&&<div style={{marginTop:12,background:"#FFF7E8",border:"1px solid #EFD9A8",
              borderRadius:12,padding:"10px 14px",fontSize:13,color:"#8A6A1F",lineHeight:1.7}}>{notice}</div>}
          </div>

          {/* رأس النتيجة */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:14,marginTop:14}}>
            <div style={{background:T.ink,color:"#fff",borderRadius:18,padding:22}}>
              <div style={{fontSize:13,opacity:.75,fontWeight:700}}>{city} · حي {hood}</div>
              <div style={{display:"flex",alignItems:"baseline",gap:10,marginTop:8}}>
                <span className="disp" style={{fontSize:56,fontWeight:900,lineHeight:1,color:T.gold}}>{D.score}</span>
                <span style={{fontSize:15,opacity:.7}}>/ ١٠٠ درجة الفرصة</span>
              </div>
              <div style={{marginTop:12,fontSize:16,fontWeight:700}}>{D.verdict}</div>
              <div style={{height:6,background:"rgba(255,255,255,.16)",borderRadius:99,marginTop:14,overflow:"hidden"}}>
                <div style={{width:`${D.score}%`,height:"100%",background:T.gold}}/>
              </div>
            </div>

            {/* العنصر المميّز: شبكة الأحياء الحرارية */}
            <div style={{background:"#fff",border:`1px solid ${T.line}`,borderRadius:18,padding:20}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:8,flexWrap:"wrap"}}>
                <div className="disp" style={{fontWeight:800,fontSize:17}}>خريطة الإشباع</div>
                <div style={{display:"flex",gap:12,fontSize:12,color:T.muted,fontWeight:700}}>
                  <Legend c={T.gap} t="فجوة"/><Legend c="#C9C0A8" t="متوسط"/><Legend c={T.hot} t="مزدحم"/>
                </div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:7,marginTop:14}}>
                {D.cells.map((v,i)=>(
                  <div key={i} className="cell" title={`نطاق ${i+1} — ${v}`}
                    style={{aspectRatio:"1",borderRadius:9,background:cellColor(v),
                      display:"grid",placeItems:"center",color:"#fff",fontWeight:800,fontSize:13}}>{v}</div>))}
              </div>
              <p style={{margin:"12px 2px 0",fontSize:12.5,color:T.muted,lineHeight:1.7}}>
                كل مربّع يمثّل نطاقاً حول الموقع. الرقم = مساحة الفرصة فيه.
              </p>
            </div>
          </div>

          {/* ملمح الحي — أساس التوصيات */}
          <Panel title="ملمح الحي">
            <div className="disp" style={{fontSize:19,fontWeight:800,color:T.gap,marginBottom:12}}>{D.profile.headline}</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:10}}>
              {D.profile.facts.map(f=>(
                <div key={f.k} style={{background:f.tone==="gap"?"#F2FAF9":T.paper2,
                  border:`1px solid ${f.tone==="gap"?"#BFE3DE":T.line}`,borderRadius:13,padding:"13px 15px"}}>
                  <div style={{fontSize:12.5,color:T.muted,fontWeight:700}}>{f.k}</div>
                  <div className="disp" style={{fontSize:21,fontWeight:800,marginTop:3,
                    color:f.tone==="gap"?T.gap:T.ink}}>{f.v}</div>
                </div>))}
            </div>
            <div style={{marginTop:14,background:T.paper2,borderRadius:13,padding:15,
              borderInlineStart:`4px solid ${T.gold}`,fontSize:15.5,lineHeight:1.9,color:T.ink2}}>
              <b style={{color:T.ink}}>ماذا يعني هذا؟ </b>{D.profile.reading}
            </div>
          </Panel>

          {/* المنافسة حسب التصنيف */}
          <Panel title="الأنشطة القائمة في الحي">
            <div style={{display:"flex",gap:7,flexWrap:"wrap",marginBottom:12}}>
              {SECTORS.map(s=>{const on=s.id===sector;
                return <button key={s.id} onClick={()=>setSector(s.id)}
                  style={{padding:"7px 14px",borderRadius:99,cursor:"pointer",fontSize:13,fontWeight:700,
                    border:`1px solid ${on?T.ink:T.line}`,background:on?T.ink:"#fff",color:on?"#fff":T.muted}}>
                  {s.n}</button>;})}
            </div>
            {shown.map(t=>{
              const w=Math.min(100,(t.count/maxCount)*100);
              const isGap=t.state==="فجوة";
              const isBal=t.state==="متوازن";
              const barC=isGap?T.gap:isBal?T.cool:T.hot;
              return (
                <div key={t.n} style={{padding:"12px 0",borderBottom:`1px solid ${T.line}`}}>
                  <div style={{display:"flex",justifyContent:"space-between",gap:10,flexWrap:"wrap",alignItems:"center"}}>
                    <span style={{fontWeight:700,fontSize:15.5}}>{t.n}</span>
                    <span style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
                      <b style={{fontSize:14,color:T.muted}}>{t.count} نشاط</b>
                      <b style={{fontSize:14,color:T.muted}}>★ {t.rating}</b>
                      <span style={{fontSize:12,fontWeight:800,padding:"4px 11px",borderRadius:99,
                        background:isGap?"#E4F4F1":isBal?"#E8EFF4":"#FBE9E7",
                        color:barC}}>{t.state}</span>
                    </span>
                  </div>
                  <div style={{height:7,background:T.paper,borderRadius:99,marginTop:9,overflow:"hidden"}}>
                    <div style={{width:`${w}%`,height:"100%",background:barC,borderRadius:99}}/>
                  </div>
                </div>);})}
          </Panel>

          {/* الفجوات */}
          <Panel title="الفرص المتاحة في الحي">
            {gapsShown.length===0 ? (
              <p style={{color:T.muted,fontSize:15,lineHeight:1.8,margin:0}}>
                لا توجد فجوة واضحة في هذا القطاع. جرّب «كل القطاعات» لترى الفرص الأخرى.
              </p>
            ) : (
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:12}}>
              {gapsShown.map(g=>(
                <div key={g.t} style={{border:`1.5px solid ${T.gap}`,borderRadius:14,padding:16,background:"#F2FAF9"}}>
                  <div className="disp" style={{fontWeight:800,fontSize:17,color:T.gap}}>{g.t}</div>
                  <p style={{margin:"7px 0 0",fontSize:14.5,lineHeight:1.8,color:T.ink2}}>{g.why}</p>
                  {g.fit&&<div style={{marginTop:10,fontSize:13,fontWeight:700,color:T.ink2,
                    background:"#fff",border:`1px solid #CBE6E1`,borderRadius:10,padding:"8px 12px"}}>📐 {g.fit}</div>}
                </div>))}
            </div>)}
          </Panel>

          {/* معالم الحي — أساس الاستنتاج */}
          {D.landmarks?.length>0 && (
          <Panel title="معالم الحي">
            <p style={{margin:"0 0 12px",color:T.muted,fontSize:14.5,lineHeight:1.8}}>
              هذه المعالم تُقرأ لاستنتاج أنماط الحركة والطلب في الحي.
            </p>
            <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
              {D.landmarks.map(l=>(
                <div key={l.label} style={{background:T.paper2,border:`1px solid ${T.line}`,borderRadius:13,
                  padding:"11px 18px",display:"flex",alignItems:"center",gap:9}}>
                  <span className="disp" style={{fontSize:22,fontWeight:800,color:T.cool}}>{l.count}</span>
                  <span style={{fontSize:14.5,fontWeight:700,color:T.ink2}}>{l.label}</span>
                </div>))}
            </div>
          </Panel>)}

          {/* الاكتشاف — إشارات مباشرة */}
          {D.discovery?.direct?.length>0 && (
          <Panel title="إشارات حاجة في الحي">
            <p style={{margin:"0 0 14px",color:T.muted,fontSize:14.5,lineHeight:1.8}}>
              مستخرجة من الأنشطة المرصودة فعلياً — لا من استبيان لرغبات السكان.
            </p>
            <div style={{display:"grid",gap:10}}>
              {D.discovery.direct.map((d,i)=>{
                const c = d.kind==="غياب تام"?T.gap : d.kind==="جودة ضعيفة"?T.hot : T.gold;
                return (
                <div key={i} style={{border:`1px solid ${T.line}`,borderRadius:14,padding:15,background:"#fff"}}>
                  <div style={{display:"flex",gap:9,alignItems:"center",flexWrap:"wrap",marginBottom:7}}>
                    <span className="disp" style={{fontWeight:800,fontSize:16.5}}>{d.activity}</span>
                    <span style={{fontSize:11.5,fontWeight:800,padding:"4px 11px",borderRadius:99,
                      background:c+"1f",color:c}}>{d.kind}</span>
                    {d.capital&&<span style={{fontSize:11.5,fontWeight:700,padding:"4px 11px",borderRadius:99,
                      background:T.paper2,color:T.muted}}>رأس مال {d.capital}</span>}
                  </div>
                  <p style={{margin:0,fontSize:14.5,lineHeight:1.8,color:T.ink2}}>{d.signal}</p>
                </div>);})}
            </div>
          </Panel>)}

          {/* أفكار مستنتجة — خارج الصندوق */}
          {D.discovery?.inferred?.length>0 && (
          <Panel title="أفكار لم تفكّر بها">
            <p style={{margin:"0 0 14px",color:T.muted,fontSize:14.5,lineHeight:1.8}}>
              أنشطة تدعمها تركيبة الحي — اجتهاد استنتاجي، لا بيانات طلب مؤكدة.
            </p>
            <div style={{display:"grid",gap:12}}>
              {D.discovery.inferred.map((g,i)=>(
                <div key={i} style={{border:`1.5px solid ${T.gold}`,borderRadius:14,padding:16,background:"#FDFAF2"}}>
                  <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:9}}>
                    {g.ideas.map(idea=>(
                      <span key={idea} style={{background:"#fff",border:`1px solid #E5D3A6`,borderRadius:99,
                        padding:"7px 15px",fontSize:14,fontWeight:700,color:T.ink}}>{idea}</span>))}
                  </div>
                  <p style={{margin:0,fontSize:14,lineHeight:1.8,color:T.ink2}}>
                    <b style={{color:T.gold}}>لماذا؟ </b>{g.why}</p>
                </div>))}
            </div>
          </Panel>)}

          {/* ترشيحات إضافية */}
          <Panel title="ترشيحات أخرى تخدم نفس الحي">
            <p style={{margin:"0 0 12px",color:T.muted,fontSize:14.5,lineHeight:1.8}}>
              أفكار لم تسأل عنها، لكن ملمح الحي يدعمها — بعضها يكمّل نشاطك الأساسي.
            </p>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(250px,1fr))",gap:12}}>
              {D.extras.map(x=>(
                <div key={x.t} style={{border:`1px solid ${T.line}`,borderRadius:14,padding:16,background:"#fff"}}>
                  <div style={{display:"flex",justifyContent:"space-between",gap:8,alignItems:"flex-start",flexWrap:"wrap"}}>
                    <div className="disp" style={{fontWeight:800,fontSize:16.5}}>{x.t}</div>
                    <span style={{fontSize:11.5,fontWeight:800,padding:"4px 10px",borderRadius:99,
                      background:"#F4EFE1",color:T.gold,whiteSpace:"nowrap"}}>{x.tag}</span>
                  </div>
                  <p style={{margin:"8px 0 0",fontSize:14,lineHeight:1.8,color:T.ink2}}>{x.why}</p>
                </div>))}
            </div>
          </Panel>

          {/* المخاطر + التحقق */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(290px,1fr))",gap:14,marginTop:14}}>
            <Panel title="ما قد يوقفك" flat>
              <ul style={ul}>{D.risks.map((r,i)=><li key={i} style={li}>{r}</li>)}</ul>
            </Panel>
            <Panel title="تحقّق ميدانياً" flat>
              <ul style={ul}>{D.checks.map((r,i)=><li key={i} style={li}>{r}</li>)}</ul>
            </Panel>
          </div>

          {/* المنهجية والمصادر — أساس المصداقية */}
          <Panel title="المنهجية والمصادر">
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(250px,1fr))",gap:14}}>
              <div>
                <div style={{fontWeight:800,fontSize:14.5,marginBottom:8,color:T.ink}}>كيف حُسبت درجة الفرصة</div>
                <ul style={{...ul,fontSize:14}}>
                  <li>كثافة المنافسين ضمن النطاق (وزن ٣٥٪)</li>
                  <li>متوسط جودة المنافسين — تقييماتهم (وزن ٢٥٪)</li>
                  <li>ملاءمة النشاط لملمح السكان (وزن ٢٥٪)</li>
                  <li>مؤشرات الاستقرار — إغلاقات سابقة (وزن ١٥٪)</li>
                </ul>
              </div>
              <div>
                <div style={{fontWeight:800,fontSize:14.5,marginBottom:8,color:T.ink}}>مصادر البيانات</div>
                <ul style={{...ul,fontSize:14}}>
                  <li>بيانات الأنشطة التجارية من خرائط جوجل</li>
                  <li>مؤشرات سكانية عامة من الجهات الإحصائية</li>
                  <li>مراجعة يدوية لعيّنة من النتائج</li>
                </ul>
              </div>
            </div>
            <div style={{marginTop:14,background:T.paper2,borderRadius:12,padding:14,fontSize:13.5,
              color:T.ink2,lineHeight:1.85,borderInlineStart:`4px solid ${T.cool}`}}>
              <b>حدود التقرير: </b>البيانات السكانية تقديرية على مستوى الحي وليست على مستوى المبنى، وأعداد الأنشطة تعكس المسجّل على الخرائط وقت الإصدار.
            </div>
          </Panel>

          <div style={{background:T.paper2,border:`1px solid ${T.line}`,borderRadius:16,padding:18,marginTop:16}}>
            <div style={{fontSize:13.5,color:T.ink2,lineHeight:1.85}}>
              هذا تقرير ذكاء موقعي يقلّل احتمال الخطأ، ولا يضمن نجاح المشروع. نجاح النشاط يعتمد كذلك على التشغيل والجودة والتسويق ورأس المال العامل.
            </div>
            <div style={{display:"flex",justifyContent:"space-between",gap:12,flexWrap:"wrap",
              marginTop:14,paddingTop:14,borderTop:`1px solid ${T.line}`,fontSize:13,color:T.muted}}>
              <span>مَوقِعي · تقرير {reportId}</span>
              <span>صادر بتاريخ {today}</span>
            </div>
          </div>
        </section>)}
      </main>

      <footer style={{borderTop:`1px solid ${T.line}`,background:T.paper2}}>
        <div style={{maxWidth:1080,margin:"0 auto",padding:"16px 18px",fontSize:13,color:T.muted,
          display:"flex",justifyContent:"space-between",gap:10,flexWrap:"wrap"}}>
          <span>مَوقِعي — نموذج واجهة</span><span>فهد العساف · @Alassafme</span>
        </div>
      </footer>
    </div>
  );
}

function Field({label,children}){
  return <label style={{display:"block"}}>
    <span style={{display:"block",fontSize:13,fontWeight:800,marginBottom:7,color:T.ink2}}>{label}</span>
    {children}</label>;
}
function Panel({title,children,flat}){
  return <div style={{background:"#fff",border:`1px solid ${T.line}`,borderRadius:18,padding:20,marginTop:14,
    boxShadow:flat?"none":"0 10px 26px rgba(13,31,42,.05)"}}>
    <div className="disp" style={{fontWeight:800,fontSize:18,marginBottom:6}}>{title}</div>
    {children}</div>;
}
function Legend({c,t}){
  return <span style={{display:"inline-flex",alignItems:"center",gap:5}}>
    <span style={{width:11,height:11,borderRadius:3,background:c}}/>{t}</span>;
}
const sel={width:"100%",padding:"12px 14px",borderRadius:12,border:`1px solid ${T.line}`,
  background:"#fff",fontSize:15.5,color:T.ink,appearance:"none"};
const primary={width:"100%",padding:"15px",borderRadius:13,border:"none",cursor:"pointer",
  background:T.ink,color:"#fff",fontSize:17,fontWeight:800};
const ghost={background:"transparent",border:`1px solid ${T.line}`,borderRadius:99,
  padding:"8px 16px",fontSize:13.5,fontWeight:700,color:T.ink2,cursor:"pointer"};
const ul={margin:0,paddingInlineStart:20,lineHeight:2.1,color:T.ink2,fontSize:15};
const li={marginBottom:4};
