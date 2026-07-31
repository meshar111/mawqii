// كتالوج الأنشطة الموسّع — 40+ نشاطاً عبر 8 قطاعات
// كل نشاط: النوع في Google Places + وسم القطاع + رأس المال التقريبي
export const CATALOG = [
  // مطاعم وأغذية
  { id:"restaurant",   label:"مطاعم",              types:["restaurant"],            sector:"food",   capital:"متوسط" },
  { id:"cafe",         label:"مقاهي",              types:["cafe"],                  sector:"food",   capital:"متوسط" },
  { id:"bakery",       label:"مخابز ومعجنات",       types:["bakery"],                sector:"food",   capital:"منخفض" },
  { id:"dessert",      label:"محلات حلى وحلويات",   types:["dessert_shop","ice_cream_shop"], sector:"food", capital:"منخفض" },
  { id:"juice",        label:"عصائر ومشروبات",      types:["juice_shop"],            sector:"food",   capital:"منخفض" },
  { id:"fastfood",     label:"وجبات سريعة",         types:["fast_food_restaurant"],  sector:"food",   capital:"متوسط" },
  { id:"catering",     label:"تموين وضيافة",        types:["catering_service"],      sector:"food",   capital:"منخفض" },
  // تجزئة
  { id:"supermarket",  label:"بقالات وسوبرماركت",   types:["supermarket","convenience_store"], sector:"retail", capital:"متوسط" },
  { id:"butcher",      label:"ملاحم",              types:["butcher_shop"],          sector:"retail", capital:"منخفض" },
  { id:"grocery",      label:"خضار وفواكه",         types:["grocery_store"],         sector:"retail", capital:"منخفض" },
  { id:"perfume",      label:"عطور وبخور",          types:["perfume_store"],         sector:"retail", capital:"منخفض" },
  { id:"florist",      label:"محلات ورد",           types:["florist"],               sector:"retail", capital:"منخفض" },
  { id:"clothing",     label:"ملابس",              types:["clothing_store"],        sector:"retail", capital:"متوسط" },
  { id:"electronics",  label:"إلكترونيات",          types:["electronics_store"],     sector:"retail", capital:"متوسط" },
  { id:"phonerepair",  label:"صيانة جوالات",        types:["cell_phone_store"],      sector:"retail", capital:"منخفض" },
  { id:"bookstore",    label:"مكتبات وقرطاسية",     types:["book_store"],            sector:"retail", capital:"منخفض" },
  { id:"petstore",     label:"مستلزمات حيوانات",    types:["pet_store"],             sector:"retail", capital:"منخفض" },
  { id:"furniture",    label:"أثاث ومفروشات",       types:["furniture_store"],       sector:"retail", capital:"مرتفع" },
  { id:"hardware",     label:"أدوات ومواد بناء",    types:["hardware_store"],        sector:"retail", capital:"متوسط" },
  // أطفال وتعليم
  { id:"kids_play",    label:"مراكز ألعاب أطفال",   types:["amusement_center"],      sector:"kids",   capital:"متوسط" },
  { id:"daycare",      label:"حضانات",             types:["child_care_agency"],     sector:"kids",   capital:"متوسط" },
  { id:"preschool",    label:"رياض أطفال",          types:["preschool"],             sector:"kids",   capital:"مرتفع" },
  { id:"tutoring",     label:"مراكز تدريب ودروس",   types:["school"],                sector:"kids",   capital:"منخفض" },
  { id:"library",      label:"مكتبات عامة",         types:["library"],               sector:"kids",   capital:"متوسط" },
  // خدمات يومية
  { id:"laundry",      label:"مغاسل ملابس",         types:["laundry"],               sector:"serv",   capital:"منخفض" },
  { id:"carwash",      label:"مغاسل سيارات",        types:["car_wash"],              sector:"serv",   capital:"منخفض" },
  { id:"barber",       label:"حلاقة رجالية",        types:["barber_shop"],           sector:"serv",   capital:"منخفض" },
  { id:"salon",        label:"صالونات ومشاغل",      types:["beauty_salon","hair_salon"], sector:"serv", capital:"متوسط" },
  { id:"tailor",       label:"خياطة وتفصيل",        types:["tailor"],                sector:"serv",   capital:"منخفض" },
  { id:"carrepair",    label:"ورش صيانة سيارات",    types:["car_repair"],            sector:"serv",   capital:"متوسط" },
  { id:"gas",          label:"محطات وقود",          types:["gas_station"],           sector:"serv",   capital:"مرتفع" },
  { id:"courier",      label:"شحن واستلام طلبات",   types:["courier_service"],       sector:"serv",   capital:"منخفض" },
  { id:"storage",      label:"مستودعات تخزين",      types:["storage"],               sector:"serv",   capital:"متوسط" },
  // صحة ورياضة
  { id:"pharmacy",     label:"صيدليات",            types:["pharmacy"],              sector:"health", capital:"متوسط" },
  { id:"gym",          label:"أندية رياضية",        types:["gym"],                   sector:"health", capital:"مرتفع" },
  { id:"dentist",      label:"عيادات أسنان",        types:["dentist"],               sector:"health", capital:"مرتفع" },
  { id:"clinic",       label:"عيادات عامة",         types:["doctor"],                sector:"health", capital:"مرتفع" },
  { id:"physio",       label:"علاج طبيعي",          types:["physiotherapist"],       sector:"health", capital:"متوسط" },
  { id:"vet",          label:"عيادات بيطرية",       types:["veterinary_care"],       sector:"health", capital:"متوسط" },
  { id:"spa",          label:"مراكز عناية وسبا",    types:["spa"],                   sector:"health", capital:"متوسط" },
  // ترفيه ومناسبات
  { id:"eventvenue",   label:"قاعات ومناسبات",      types:["event_venue"],           sector:"fun",    capital:"مرتفع" },
  { id:"sports",       label:"ملاعب رياضية",        types:["sports_complex"],        sector:"fun",    capital:"مرتفع" },
  { id:"gaming",       label:"مراكز ألعاب إلكترونية",types:["video_arcade"],         sector:"fun",    capital:"متوسط" },
  // مرافق مرجعية (لقراءة تركيبة الحي — لا تُقترح كنشاط)
  { id:"_school",      label:"مدارس",              types:["school"],                sector:"_ref" },
  { id:"_mosque",      label:"مساجد",              types:["mosque"],                sector:"_ref" },
  { id:"_park",        label:"حدائق",              types:["park"],                  sector:"_ref" },
  { id:"_bank",        label:"بنوك",               types:["bank"],                  sector:"_ref" },
];

export const SECTOR_LABELS = {
  food:"مطاعم وأغذية", retail:"تجزئة", kids:"أطفال وتعليم",
  serv:"خدمات يومية", health:"صحة ورياضة", fun:"ترفيه ومناسبات",
};
