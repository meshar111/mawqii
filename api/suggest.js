// اقتراح الأحياء أثناء الكتابة — يضمن أن الاسم يفهمه Google
// يستخدم Places Text Search: يرجع أماكن حقيقية بإحداثياتها
export const config = { maxDuration: 15 };

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error:"Method not allowed" });
  const KEY = process.env.GOOGLE_PLACES_KEY;
  if (!KEY) return res.status(500).json({ error:"GOOGLE_PLACES_KEY غير مضبوط" });

  try {
    const { q, city, country="السعودية" } = req.body || {};
    if (!q || q.trim().length < 2) return res.status(200).json({ items: [] });

    const query = `${q.trim()} ${city||""} ${country}`.trim();

    const r = await fetch("https://places.googleapis.com/v1/places:searchText", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": KEY,
        // حقول ضيقة = أرخص تعرفة
        "X-Goog-FieldMask": "places.displayName,places.formattedAddress,places.location",
      },
      body: JSON.stringify({
        textQuery: query,
        languageCode: "ar",
        regionCode: country === "السعودية" ? "SA"
                  : country === "الإمارات" ? "AE"
                  : country === "الكويت"   ? "KW"
                  : country === "قطر"      ? "QA"
                  : country === "البحرين"  ? "BH"
                  : country === "عُمان"    ? "OM" : "SA",
        maxResultCount: 5,
      }),
    });

    const d = await r.json();
    if (d.error) return res.status(200).json({ items: [], error: d.error.message });

    const items = (d.places || []).map(p => ({
      name: p.displayName?.text || "",
      address: p.formattedAddress || "",
      lat: p.location?.latitude,
      lng: p.location?.longitude,
    })).filter(x => x.lat && x.lng);

    res.status(200).json({ items });
  } catch (e) {
    res.status(200).json({ items: [], error: e.message });
  }
}
