import { geocode, nearby, summarize } from "../lib/places.js";
import { opportunityScore, financialFlags } from "../lib/scoring.js";
import * as cache from "../lib/cache.js";

// التصنيفات التي نفحصها — 7 استعلامات فقط لكل تقرير (~0.22$)
const SECTORS = [
  { id:"restaurant", label:"مطاعم",            types:["restaurant"] },
  { id:"cafe",       label:"مقاهي ومخبوزات",   types:["cafe","bakery"] },
  { id:"supermarket",label:"بقالات وسوبرماركت",types:["supermarket","convenience_store"] },
  { id:"kids",       label:"أطفال وترفيه",     types:["amusement_center","child_care_agency"] },
  { id:"gym",        label:"أندية رياضية",     types:["gym"] },
  { id:"laundry",    label:"مغاسل",            types:["laundry"] },
  { id:"pharmacy",   label:"صيدليات",          types:["pharmacy"] },
];

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error:"Method not allowed" });
  if (!process.env.GOOGLE_PLACES_KEY) return res.status(500).json({ error:"GOOGLE_PLACES_KEY غير مضبوط" });

  try {
    const { country="السعودية", city, hood, radius=2000, profile={} } = req.body || {};
    if (!city || !hood) return res.status(400).json({ error:"المدينة والحي مطلوبان" });

    const cacheKey = `${country}|${city}|${hood}|${radius}`;
    const cached = cache.get(cacheKey);
    if (cached) return res.status(200).json({ ...cached, cached:true });

    // 1) إحداثيات الحي
    const loc = await geocode(`حي ${hood}، ${city}، ${country}`);

    // 2) فحص كل قطاع + حساب الدرجة
    const sectors = [];
    for (const s of SECTORS) {
      const places = await nearby(loc.lat, loc.lng, s.types, radius);
      const sum = summarize(places);
      const scored = opportunityScore({ ...sum, type:s.types[0], profile, radius });
      sectors.push({ ...s, ...sum, ...scored, flags: financialFlags(s.types[0]) });
    }

    // 3) الفرص = القطاعات ذات الدرجة الأعلى
    const gaps = [...sectors].sort((a,b)=>b.score-a.score).slice(0,3)
      .map(s=>({ sector:s.label, score:s.score,
        why:`${s.count} نشاط ضمن ${radius/1000} كم${s.avgRating?` بمتوسط تقييم ${s.avgRating}`:""} — ${s.state}.` }));

    const overall = Math.round(sectors.reduce((a,s)=>a+s.score,0)/sectors.length);

    const result = {
      meta:{ country, city, hood, radius, coords:{lat:loc.lat,lng:loc.lng},
             address:loc.formatted, generatedAt:new Date().toISOString(),
             reportId:"MQ-"+Math.random().toString(36).slice(2,7).toUpperCase() },
      overall, sectors, gaps,
      disclaimer:"تقرير ذكاء موقعي تعليمي يقلّل احتمال الخطأ ولا يضمن نجاح المشروع.",
      sources:["Google Places API","حسابات داخلية بناءً على مؤشرات السوق"],
    };

    cache.set(cacheKey, result);
    res.status(200).json(result);
  } catch (e) {
    res.status(500).json({ error: e.message || "خطأ في التحليل" });
  }
}
