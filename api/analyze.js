import { locate, nearby, summarize } from "../lib/places.js";
import { opportunityScore, financialFlags } from "../lib/scoring.js";
import { CATALOG, SECTOR_LABELS } from "../lib/catalog.js";
import { discoverOpportunities } from "../lib/discover.js";
import * as cache from "../lib/cache.js";

export const config = { maxDuration: 60 };

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error:"Method not allowed" });
  if (!process.env.GOOGLE_PLACES_KEY) return res.status(500).json({ error:"GOOGLE_PLACES_KEY غير مضبوط" });

  try {
    const { country="السعودية", city, hood, radius=2000, profile={}, deep=false } = req.body || {};
    if (!city || !hood) return res.status(400).json({ error:"المدينة والحي مطلوبان" });

    const cacheKey = `${country}|${city}|${hood}|${radius}|${deep?"deep":"std"}`;
    const cached = cache.get(cacheKey);
    if (cached) return res.status(200).json({ ...cached, cached:true });

    const loc = await locate({ hood, city, country });

    // المسح: الوضع القياسي 20 نشاطاً · العميق كل الكتالوج
    const list = deep ? CATALOG : CATALOG.filter(c =>
      c.sector === "_ref" ||
      ["restaurant","cafe","dessert","supermarket","pharmacy","gym",
       "kids_play","daycare","laundry","carwash","salon","juice",
       "florist","clinic","tutoring","bakery"].includes(c.id));

    // تنفيذ متوازٍ على دفعات — يختصر الوقت من ~20 ثانية إلى ~3
    const BATCH = 8;
    const results = [];
    for (let i = 0; i < list.length; i += BATCH) {
      const chunk = list.slice(i, i + BATCH);
      const done = await Promise.all(chunk.map(async (item) => {
        let places = [];
        try { places = await nearby(loc.lat, loc.lng, item.types, radius); } catch { /* نوع غير مدعوم */ }
        const sum = summarize(places);
        const entry = { id:item.id, label:item.label, sector:item.sector, capital:item.capital, ...sum };
        if (item.sector !== "_ref") {
          Object.assign(entry, opportunityScore({ ...sum, type:item.types[0], profile, radius }),
                               { flags: financialFlags(item.types[0]) });
        }
        return entry;
      }));
      results.push(...done);
    }

    const business = results.filter(r => r.sector !== "_ref");
    const refs = results.filter(r => r.sector === "_ref");
    const discovery = discoverOpportunities(results);

    const gaps = [...business].sort((a,b)=>b.score-a.score).slice(0,5)
      .map(s=>({ sector:s.label, score:s.score, capital:s.capital,
        why:`${s.count} نشاط ضمن ${radius/1000} كم${s.avgRating?` بمتوسط تقييم ${s.avgRating}`:""} — ${s.state}.` }));

    const overall = business.length
      ? Math.round(business.reduce((a,s)=>a+s.score,0)/business.length) : 0;

    // تجميع حسب القطاع للعرض
    const bySector = {};
    for (const b of business) {
      const k = b.sector;
      (bySector[k] ||= { label: SECTOR_LABELS[k] || k, items: [] }).items.push(b);
    }

    const result = {
      meta:{ country, city, hood, radius, deep, coords:{lat:loc.lat,lng:loc.lng},
             address:loc.formatted, exact:loc.exact !== false,
             note: loc.exact === false ? "تعذّر تحديد الحي بدقة — استُخدم مركز المدينة كمرجع" : null,
             scanned: business.length, generatedAt:new Date().toISOString(),
             reportId:"MQ-"+Math.random().toString(36).slice(2,7).toUpperCase() },
      overall, sectors: business, bySector,
      landmarks: refs.map(r=>({ label:r.label, count:r.count })),
      gaps, discovery,
      disclaimer:"تقرير ذكاء موقعي تعليمي يقلّل احتمال الخطأ ولا يضمن نجاح المشروع.",
      sources:["Google Places API","قواعد استنتاج مبنية على تركيبة الحي المرصودة"],
    };

    cache.set(cacheKey, result);
    res.status(200).json(result);
  } catch (e) {
    res.status(500).json({ error: e.message || "خطأ في التحليل" });
  }
}
