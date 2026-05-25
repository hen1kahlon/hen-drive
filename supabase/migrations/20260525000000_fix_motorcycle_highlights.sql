-- Fix motorcycle landing page highlights: replace outdated סמ"ק values with כ"ס
UPDATE public.landing_pages
SET highlights = '[
  {"icon": "bike", "title": "A – מגיל 21", "body": "ללא הגבלה, ידני בלבד. מותנה ב-A1 עם ותק שנה. מינימום 8 שיעורים."},
  {"icon": "bike", "title": "A1 – מגיל 18", "body": "עד 47 כ\"ס, ידני או אוטומט. מינימום 15 שיעורים, או 8 למחזיקי A2 עם ותק שנה."},
  {"icon": "bike", "title": "A2 – מגיל 16", "body": "עד 14.7 כ\"ס, ידני או אוטומט. מינימום 15 שיעורים. מגיל 16–17 נדרש אישור הורים."},
  {"icon": "shield", "title": "ציוד חדש ובטוח", "body": "קסדה, כפפות ואופנוע מתוחזק. בטיחות לפני הכל בשיעורים ובמגרש."},
  {"icon": "trophy", "title": "98% טסט ראשון", "body": "תלמידי אופנוע מאשקלון והסביבה עוברים ברובם בפעם הראשונה."},
  {"icon": "grad", "title": "ליווי עד הטסט", "body": "הכנה מנטלית, תיאום מועד טסט וטיפים אחרונים לרגע האמת."}
]'::jsonb
WHERE slug = 'motorcycle-lessons-ashkelon';
