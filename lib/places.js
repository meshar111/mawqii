// طبقة الاتصال بـ Google Places — المفتاح يبقى في السيرفر
const KEY = process.env.GOOGLE_PLACES_KEY;

// أنواع نتائج Geocoding التي تُعدّ "دقيقة" (أدق من مستوى المدينة)
const PRECISE = ["sublocality","sublocality_level_1","neighborhood","route",
                 "street_address","premise","point_of_interest","establishment"];

export async function geocode(query) {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(query)}&language=ar&key=${KEY}`;
  const r = await fetch(url);
  const d = await r.json();
  if (d.status === "REQUEST_DENIED") throw new Error("Geocoding API غير مفعّل أو المفتاح مقيّد — فعّله من Google Cloud");
  if (!d.results?.length) return null;
  const res = d.results[0];
  const loc = res.geometry.location;
  const precise = (res.types || []).some(t => PRECISE.includes(t));
  return { lat: loc.lat, lng: loc.lng, formatted: res.formatted_address,
           types: res.types, precise };
}

// يجرّب عدة صيغ — الأدق أولاً، ولا يقبل إلا نتيجة أدق من مستوى المدينة
export async function locate({ hood, city, country }) {
  const tries = [
    `${hood} District, ${city}, ${country}`,
    `حي ${hood}, ${city}`,
    `${hood}, ${city}, ${country}`,
    `${hood} ${city}`,
  ];
  for (const q of tries) {
    const r = await geocode(q);
    if (r && r.precise) return { ...r, matched: q, exact: true };
  }
  // احتياطي أخير: مركز المدينة — يُعلَن بوضوح في التقرير
  const c = await geocode(`${city}, ${country}`);
  if (c) return { ...c, matched: `${city}, ${country}`, exact: false };
  throw new Error(`تعذّر تحديد إحداثيات "${hood}" — جرّب اسماً آخر للحي`);
}

// FieldMask ضيّق = تكلفة أقل
const FIELDS = "places.displayName,places.rating,places.userRatingCount,places.types,places.priceLevel";

export async function nearby(lat, lng, includedTypes, radius = 2000) {
  const r = await fetch("https://places.googleapis.com/v1/places:searchNearby", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": KEY,
      "X-Goog-FieldMask": FIELDS,
    },
    body: JSON.stringify({
      includedTypes,
      maxResultCount: 20,
      languageCode: "ar",
      locationRestriction: { circle: { center: { latitude: lat, longitude: lng }, radius } },
    }),
  });
  const d = await r.json();
  if (d.error) throw new Error(d.error.message);
  return d.places || [];
}

export function summarize(places) {
  const count = places.length;
  const rated = places.filter(p => p.rating);
  const avgRating = rated.length ? +(rated.reduce((a,p)=>a+p.rating,0)/rated.length).toFixed(2) : null;
  const totalReviews = places.reduce((a,p)=>a+(p.userRatingCount||0),0);
  const top = [...rated].sort((a,b)=>b.rating-a.rating).slice(0,3)
    .map(p=>({ name:p.displayName?.text, rating:p.rating, reviews:p.userRatingCount }));
  return { count, avgRating, totalReviews, top };
}
