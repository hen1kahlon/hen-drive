import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

export type SiteSettings = {
  hero: {
    badge: string;
    headline_line1: string;
    headline_highlight: string;
    tagline: string;
    description: string;
    cta_primary: string;
    hero_media_url: string;
  };
  buttons: {
    whatsapp: string;
    call: string;
    lead_submit: string;
    final_cta_whatsapp: string;
    final_cta_call: string;
  };
  contact: {
    phone: string;
    phone_display: string;
    phone_intl: string;
    email: string;
    whatsapp_message: string;
    training_map_url: string;
    area: string;
  };
  social: {
    instagram: string;
    tiktok: string;
    facebook: string;
  };
  stats: {
    students: string; students_label: string;
    years: string; years_label: string;
    success: string; success_label: string;
    floating: string; floating_label: string;
  };
  sections: {
    categories_eyebrow: string; categories_title1: string; categories_title2: string;
    about_eyebrow: string; about_title1: string; about_title2: string; about_description: string;
    why_eyebrow: string; why_title1: string; why_title2: string;
    reviews_eyebrow: string; reviews_title1: string; reviews_title2: string;
    faq_eyebrow: string; faq_title1: string; faq_title2: string;
    lead_title1: string; lead_title2: string; lead_description: string;
    final_cta_title1: string; final_cta_title2: string; final_cta_description: string;
    footer_about: string;
  };
};

export const DEFAULT_SETTINGS: SiteSettings = {
  hero: {
    badge: "5 שנות ותק · רכב ואופנועים · אשקלון",
    headline_line1: "מוציאים רישיון",
    headline_highlight: "בביטחון",
    tagline: "עד ההצלחה!",
    description: "שיעורי נהיגה לרכב אוטומט ואופנועים באווירה צעירה, מקצועית וסבלנית — עם מורה שמלווה אותך עד הקריאה ״עברת!״",
    cta_primary: "התחל ללמוד עכשיו",
    hero_media_url: "",
  },
  buttons: {
    whatsapp: "וואטסאפ",
    call: "התקשר",
    lead_submit: "שלח/י פרטים",
    final_cta_whatsapp: "שלחו הודעה בוואטסאפ",
    final_cta_call: "התקשרו עכשיו",
  },
  contact: {
    phone: "0503250150",
    phone_display: "050-3250150",
    phone_intl: "972503250150",
    email: "hen1kahlon@gmail.com",
    whatsapp_message: "היי חן, הגעתי דרך האתר ואני מעוניין לקבל פרטים על שיעורי נהיגה",
    training_map_url: "https://www.google.com/maps/search/?api=1&query=מגרש+אימונים+אופנוע+אשקלון",
    area: "אשקלון והסביבה",
  },
  social: {
    instagram: "https://instagram.com",
    tiktok: "https://tiktok.com",
    facebook: "https://facebook.com",
  },
  stats: {
    students: "350+", students_label: "תלמידים",
    years: "5", years_label: "שנות ותק",
    success: "98%", success_label: "הצלחה",
    floating: "98%", floating_label: "הצלחה בטסט",
  },
  sections: {
    categories_eyebrow: "בחרו את הדרגה",
    categories_title1: "על מה",
    categories_title2: "תרצו ללמוד?",
    about_eyebrow: "קצת עליי",
    about_title1: "נעים מאוד,",
    about_title2: "חן כחלון",
    about_description: "מורה נהיגה בעל ותק של 5 שנים בתחום הרכב והאופנועים. אני מאמין בלימוד נהיגה בגישה אישית, רגועה ומקצועית, עם התאמה מלאה לקצב של כל תלמיד. השיעורים מתבצעים על כלים חדשים, נוחים ובטיחותיים, באווירה צעירה ומכבדת — עד שמגיעים מוכנים ובטוחים לטסט.",
    why_eyebrow: "היתרונות שלי",
    why_title1: "למה לבחור",
    why_title2: "בחן?",
    reviews_eyebrow: "המלצות תלמידים",
    reviews_title1: "מה",
    reviews_title2: "אומרים עליי",
    faq_eyebrow: "שאלות נפוצות",
    faq_title1: "כל מה ש",
    faq_title2: "חשוב לדעת",
    lead_title1: "אשקלון",
    lead_title2: "והסביבה",
    lead_description: "שיעורים בכל אזור אשקלון והסביבה בהתאמה מלאה לזמן ולמיקום שלך.",
    final_cta_title1: "מתחילים את הדרך",
    final_cta_title2: "לרישיון?",
    final_cta_description: "דבר אחד מפריד בינך לבין הרישיון — ההחלטה שלך",
    footer_about: "מורה נהיגה לרכב ואופנועים — אשקלון והסביבה. מלווה אותך עד הקריאה ״עברת״.",
  },
};

// Deep-merge incoming partial onto defaults
export function mergeSettings(partial: unknown): SiteSettings {
  const p = (partial ?? {}) as Partial<Record<keyof SiteSettings, Record<string, unknown>>>;
  const out: Record<string, unknown> = {};
  (Object.keys(DEFAULT_SETTINGS) as (keyof SiteSettings)[]).forEach((k) => {
    out[k] = { ...(DEFAULT_SETTINGS[k] as object), ...((p[k] ?? {}) as object) };
  });
  return out as SiteSettings;
}

const Ctx = createContext<SiteSettings>(DEFAULT_SETTINGS);

export function SiteSettingsProvider({
  children,
  initialSettings,
}: {
  children: ReactNode;
  initialSettings?: SiteSettings;
}) {
  const [s, setS] = useState<SiteSettings>(initialSettings ?? DEFAULT_SETTINGS);
  useEffect(() => {
    supabase.from("site_settings").select("data").eq("id", "main").maybeSingle()
      .then(({ data }) => { if (data?.data) setS(mergeSettings(data.data)); });
  }, []);
  return <Ctx.Provider value={s}>{children}</Ctx.Provider>;
}

export const useSiteSettings = () => useContext(Ctx);

export function waUrl(s: SiteSettings, msg?: string) {
  return `https://wa.me/${s.contact.phone_intl}?text=${encodeURIComponent(msg ?? s.contact.whatsapp_message)}`;
}
