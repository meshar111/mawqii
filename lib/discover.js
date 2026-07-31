// محرّك الاكتشاف — يبتكر فرصاً لم يفكّر بها المستخدم
// يعتمد على ثلاث إشارات حقيقية لا على تخمين

// ١) الغياب التام: نشاط لا وجود له إطلاقاً في النطاق
export function absenceGaps(results) {
  return results
    .filter(r => r.sector !== "_ref" && r.count === 0)
    .map(r => ({
      activity: r.label, kind: "غياب تام", capital: r.capital,
      signal: `لا يوجد أي ${r.label} ضمن النطاق — السكان يخرجون خارج الحي لهذه الحاجة.`,
      confidence: "عالية",
    }));
}

// ٢) فجوة الجودة: موجود لكن بتقييم ضعيف = طلب غير مُشبَع
export function qualityGaps(results) {
  return results
    .filter(r => r.sector !== "_ref" && r.count > 0 && r.avgRating && r.avgRating < 3.8)
    .map(r => ({
      activity: r.label, kind: "جودة ضعيفة", capital: r.capital,
      signal: `${r.count} ${r.label} بمتوسط تقييم ${r.avgRating} — الطلب موجود لكن الرضا منخفض، ومساحة التميّز واسعة.`,
      confidence: "عالية",
    }));
}

// ٣) ندرة نسبية: عدد قليل جداً مقارنة بحجم الحي
export function scarcityGaps(results, density) {
  const busy = density > 40; // حي نشط تجارياً
  return results
    .filter(r => r.sector !== "_ref" && r.count > 0 && r.count <= 2 && busy)
    .map(r => ({
      activity: r.label, kind: "ندرة", capital: r.capital,
      signal: `${r.count} فقط في حي نشط تجارياً (${density} نشاطاً مرصوداً) — تغطية أقل من حاجة الحي.`,
      confidence: "متوسطة",
    }));
}

// ٤) الاستنتاج من تركيبة الحي — هنا "خارج الصندوق"
// كل قاعدة: شرط من بيانات حقيقية ← أنشطة مقترحة لم يسألها المستخدم
const RULES = [
  { when: c => c._school >= 4,
    ideas: ["مركز دروس ومهارات بعد الدوام","محل قرطاسية وطباعة","مقهى دراسة هادئ","نقل مدرسي","محل حلى ووجبات خفيفة قرب المدارس"],
    why: c => `${c._school} مدارس في النطاق — حركة عائلية يومية وأطفال في أوقات محددة.` },
  { when: c => c._school >= 3 && c.kids_play <= 1,
    ideas: ["مركز ألعاب أطفال","نادٍ صيفي","ورش حرفية للأطفال","حفلات ميلاد ومناسبات أطفال"],
    why: () => "مدارس كثيرة مع ندرة أماكن ترفيه للأطفال — العائلات تبحث عن متنفّس قريب." },
  { when: c => c._mosque >= 5,
    ideas: ["محل عطور وبخور","مكتبة ومستلزمات دينية","محل تمور وضيافة","مغسلة ثياب قريبة"],
    why: c => `${c._mosque} مساجد — حركة يومية متكررة وأنماط شراء مرتبطة بها.` },
  { when: c => c._park >= 2,
    ideas: ["عربة قهوة متنقلة","محل عصائر وآيس كريم","تأجير دراجات وسكوتر","محل ألعاب خارجية"],
    why: c => `${c._park} حدائق — تجمّعات مسائية وعائلية تخلق طلباً موسمياً ومتكرراً.` },
  { when: c => c.restaurant >= 8 && c.dessert <= 1,
    ideas: ["محل حلى وحلويات","مقهى حلويات","بوفيه كيك وتورتات"],
    why: () => "كثافة مطاعم عالية مع غياب محلات الحلى — الحلى مكمّل طبيعي بعد الوجبات." },
  { when: c => c.restaurant >= 6 && c.carwash === 0,
    ideas: ["مغسلة سيارات","خدمة غسيل متنقل"],
    why: () => "حركة مركبات عالية بسبب المطاعم دون خدمة غسيل — فرصة خدمية مباشرة." },
  { when: c => c.gym >= 1 && c.juice === 0,
    ideas: ["محل عصائر وبروتين","مطعم وجبات صحية","متجر مكملات رياضية"],
    why: () => "وجود أندية رياضية دون خدمات تغذية مساندة — جمهور جاهز ومحدّد." },
  { when: c => c.clinic + c.dentist >= 3 && c.pharmacy <= 1,
    ideas: ["صيدلية","مركز تحاليل","محل مستلزمات طبية"],
    why: () => "تجمّع عيادات مع نقص صيدليات — المريض يحتاج الدواء فور الزيارة." },
  { when: c => c.supermarket >= 4 && c.courier === 0,
    ideas: ["نقطة استلام طلبات","خدمة توصيل محلي","مستودع صغير للتجارة الإلكترونية"],
    why: () => "نشاط تجزئة مرتفع دون بنية استلام وتوصيل — حاجة لوجستية غير مخدومة." },
  { when: c => c.salon >= 4 && c.spa === 0,
    ideas: ["مركز عناية وسبا","مركز عناية بالبشرة","صالون أطفال"],
    why: () => "طلب تجميلي واضح دون خدمات متخصصة أعلى — فرصة للارتقاء بالفئة." },
  { when: c => c._bank >= 2 && c.cafe <= 2,
    ideas: ["مقهى أعمال","مساحة عمل مشتركة","مطعم غداء سريع للموظفين"],
    why: () => "وجود بنوك يشير لحركة مكتبية — طلب على أماكن اجتماعات ووجبات سريعة." },
];

export function inferredIdeas(counts) {
  const out = [];
  for (const r of RULES) {
    let ok = false;
    try { ok = r.when(counts); } catch { ok = false; }
    if (ok) out.push({ ideas: r.ideas, why: r.why(counts) });
  }
  return out;
}

// تجميع كل الإشارات وترتيبها
export function discoverOpportunities(results) {
  const counts = Object.fromEntries(results.map(r => [r.id, r.count]));
  const density = results.filter(r=>r.sector!=="_ref").reduce((a,r)=>a+r.count,0);

  const direct = [...absenceGaps(results), ...qualityGaps(results), ...scarcityGaps(results, density)];
  const rank = { "جودة ضعيفة":3, "غياب تام":2, "ندرة":1 };
  direct.sort((a,b)=> (rank[b.kind]||0)-(rank[a.kind]||0));

  return {
    density,
    direct: direct.slice(0, 8),
    inferred: inferredIdeas(counts),
    note: "الإشارات مستخرجة من الأنشطة المرصودة فعلياً حول الموقع، ولا تعبّر عن استبيان لرغبات السكان.",
  };
}
