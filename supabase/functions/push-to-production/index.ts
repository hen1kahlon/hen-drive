import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const PROD_URL = "https://wbvpvyqdqmljtftktmrk.supabase.co";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "authorization, content-type",
      },
    });
  }

  // Verify the caller is a logged-in admin
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return json({ error: "Unauthorized" }, 401);
  }

  const stagingUrl = Deno.env.get("SUPABASE_URL")!;
  const stagingServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const prodServiceKey = Deno.env.get("PROD_SERVICE_ROLE_KEY");

  if (!prodServiceKey) {
    return json({ error: "PROD_SERVICE_ROLE_KEY secret not configured" }, 500);
  }

  const staging = createClient(stagingUrl, stagingServiceKey);
  const prod = createClient(PROD_URL, prodServiceKey);

  const results: Record<string, unknown> = {};

  try {
    // 1. Sync site_settings
    const { data: settings, error: sErr } = await staging
      .from("site_settings")
      .select("*");
    if (sErr) throw new Error(`site_settings read: ${sErr.message}`);
    if (settings?.length) {
      const { error } = await prod.from("site_settings").upsert(settings);
      if (error) throw new Error(`site_settings write: ${error.message}`);
    }
    results.site_settings = settings?.length ?? 0;

    // 2. Sync gallery_items (full replace)
    const { data: gallery, error: gErr } = await staging
      .from("gallery_items")
      .select("*")
      .order("sort_order", { ascending: true });
    if (gErr) throw new Error(`gallery_items read: ${gErr.message}`);

    // Ensure table exists in prod (best-effort)
    await prod.rpc("ensure_gallery_items_table" as never).maybeSingle().catch(() => null);

    // Delete all prod gallery items then re-insert
    await prod.from("gallery_items").delete().gte("sort_order", -1);
    if (gallery?.length) {
      const { error } = await prod.from("gallery_items").insert(gallery);
      if (error) throw new Error(`gallery_items write: ${error.message}`);
    }
    results.gallery_items = gallery?.length ?? 0;

    // 3. Sync reviews (approved only, upsert by id)
    const { data: reviews, error: rErr } = await staging
      .from("reviews")
      .select("*")
      .eq("status", "approved");
    if (rErr) throw new Error(`reviews read: ${rErr.message}`);
    if (reviews?.length) {
      const { error } = await prod.from("reviews").upsert(reviews);
      if (error) throw new Error(`reviews write: ${error.message}`);
    }
    results.reviews = reviews?.length ?? 0;

    return json({ success: true, synced: results });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return json({ error: msg }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
