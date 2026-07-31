// تخزين مؤقت — يخفّض تكلفة الـAPI بنسبة تصل 90%
// للإنتاج: استبدله بقاعدة بيانات (Vercel KV / Redis / Postgres)
const store = new Map();
const TTL = 1000 * 60 * 60 * 24 * 30; // 30 يوماً

export function get(key) {
  const hit = store.get(key);
  if (!hit) return null;
  if (Date.now() - hit.at > TTL) { store.delete(key); return null; }
  return hit.data;
}
export function set(key, data) { store.set(key, { data, at: Date.now() }); }
