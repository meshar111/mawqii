// طبقة الاتصال بـ Google Places — المفتاح يبقى في السيرفر
const KEY = process.env.GOOGLE_PLACES_KEY;

export async function geocode(query) {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(query)}&language=ar&key=${KEY}`;
  const r = await fetch(url);
  const d = await r.json();
  if (!d.results?.length) throw new Error("تعذّر تحديد إحداثيات الموقع");
  const loc = d.results[0].geometry.location;
  return { lat: loc.lat, lng: loc.lng, formatted: d.results[0].formatted_address };
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
