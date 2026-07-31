// محرّك الدرجة — الأوزان مبنية على بحث السوق
// كثافة 35% · جودة المنافسين 25% · ملاءمة السكان 25% · استقرار 15%

// أعداد متوقّعة واقعية لحي سكني ضمن نطاق ~2 كم
// (المستهدف الوطني 3000 مطعم/مليون نسمة يخصّ الدولة ككل ولا يصلح لنطاق صغير)
const EXPECTED_2KM = {
  restaurant:12, cafe:8, bakery:5, supermarket:6, convenience_store:8,
  pharmacy:4, gym:3, amusement_center:2, child_care_agency:3,
  preschool:3, laundry:4, default:5,
};

export function saturation(count, type, radius = 2000) {
  const base = EXPECTED_2KM[type] ?? EXPECTED_2KM.default;
  // تعديل حسب المساحة (المساحة تتناسب مع مربع نصف القطر)
  const expected = Math.max(1, Math.round(base * Math.pow(radius/2000, 2)));
  const ratio = count / expected;
  const state = ratio >= 1.4 ? "مشبع" : ratio <= 0.6 ? "فجوة" : "متوازن";
  return { ratio: +ratio.toFixed(2), expected, state };
}

// جودة المنافسين — تقييم منخفض = فرصة للأفضل
export function qualityGap(avgRating) {
  if (!avgRating) return 50;
  if (avgRating < 3.5) return 90;   // منافسون ضعاف = فرصة كبيرة
  if (avgRating < 4.0) return 70;
  if (avgRating < 4.4) return 45;
  return 20;                        // منافسون أقوياء = صعب
}

// ملاءمة النشاط لملمح السكان
export function fitScore(type, profile = {}) {
  const { apartmentsPct = 50, schools = 0, youngPct = 50 } = profile;
  let s = 50;
  if (["restaurant","cafe","meal_delivery"].includes(type)) {
    if (apartmentsPct > 60) s += 20;      // شقق = طلب توصيل أعلى
    if (youngPct > 55) s += 10;
  }
  if (["amusement_center","child_care_agency","preschool"].includes(type)) {
    if (apartmentsPct > 60) s += 25;      // شقق = مساحة ضيقة للأطفال
    if (schools >= 4) s += 15;
  }
  if (["laundry"].includes(type) && apartmentsPct > 65) s += 25;
  if (["gym"].includes(type) && youngPct > 55) s += 15;
  return Math.max(0, Math.min(100, s));
}

// الاستقرار — كلما زادت مراجعات المنافسين زاد نضج السوق
export function stability(totalReviews, count) {
  if (!count) return 50;
  const avg = totalReviews / count;
  if (avg > 500) return 40;   // سوق ناضج وصعب
  if (avg > 150) return 60;
  return 75;                  // سوق شاب
}

export function opportunityScore({ count, avgRating, totalReviews, type, profile, radius = 2000 }) {
  const sat = saturation(count, type, radius);
  // كلما قلّت النسبة زادت الفرصة: نسبة 0 ← 100، نسبة 1 ← 50، نسبة 2+ ← 0
  const densityScore = Math.max(0, Math.min(100, 100 - sat.ratio * 50));
  const q = qualityGap(avgRating);
  const f = fitScore(type, profile);
  const st = stability(totalReviews, count);
  const score = Math.round(densityScore*0.35 + q*0.25 + f*0.25 + st*0.15);
  return {
    score: Math.max(0, Math.min(100, score)),
    state: sat.state,
    breakdown: { الكثافة:Math.round(densityScore), الجودة:q, الملاءمة:f, الاستقرار:st },
    saturation: sat,
    verdict: score>=75?"فرصة قوية":score>=55?"فرصة جيدة مع تحفّظ":score>=40?"تحتاج تمايزاً واضحاً":"غير موصى به",
  };
}

// تحذيرات مالية من بحث السوق
export function financialFlags(type) {
  const flags = [];
  if (["restaurant","cafe","meal_delivery","bakery"].includes(type)) {
    flags.push("عمولة تطبيقات التوصيل 15–23% (متوسط 18%) وقد تصل 40% مع التسويق — احسبها قبل التسعير.");
    flags.push("الهامش الصافي الواقعي للمطاعم 3–15%؛ ما دون 10% يُعدّ منطقة خطر.");
  }
  if (type==="restaurant") flags.push("المساحة النظامية الدنيا 65م² (120م² للمندي واللحوم) — تحقّق قبل توقيع العقد.");
  if (["child_care_agency","preschool"].includes(type)) flags.push("ترخيص مراكز الأطفال يتطلب اشتراطات سلامة تطيل مدة الإصدار.");
  return flags;
}
