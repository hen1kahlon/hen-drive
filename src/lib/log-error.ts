import { supabase } from "@/integrations/supabase/client";

type LogInput = {
  message: string;
  stack?: string | null;
  source?: "client" | "server" | "network";
  level?: "error" | "warning" | "info";
  context?: Record<string, unknown> | null;
};

let lastSig = "";
let lastAt = 0;

export async function logError(input: LogInput) {
  try {
    const sig = `${input.message}::${input.stack?.slice(0, 200) ?? ""}`;
    const now = Date.now();
    // dedupe identical errors within 5s (prevents spam loops)
    if (sig === lastSig && now - lastAt < 5000) return;
    lastSig = sig;
    lastAt = now;

    const { data: { session } } = await supabase.auth.getSession();
    await supabase.from("error_logs").insert({
      message: String(input.message).slice(0, 4000),
      stack: input.stack ? String(input.stack).slice(0, 20000) : null,
      source: input.source ?? "client",
      level: input.level ?? "error",
      url: typeof window !== "undefined" ? window.location.href.slice(0, 2000) : null,
      user_agent: typeof navigator !== "undefined" ? navigator.userAgent.slice(0, 1000) : null,
      user_id: session?.user?.id ?? null,
      context: input.context ?? null,
    });
  } catch {
    // never throw from logger
  }
}

let installed = false;
export function installGlobalErrorLogger() {
  if (installed || typeof window === "undefined") return;
  installed = true;
  window.addEventListener("error", (e) => {
    const err = e.error as Error | undefined;
    void logError({
      message: err?.message ?? e.message ?? "Unknown error",
      stack: err?.stack ?? null,
      context: { filename: e.filename, lineno: e.lineno, colno: e.colno },
    });
  });
  window.addEventListener("unhandledrejection", (e) => {
    const reason = e.reason;
    const msg = reason instanceof Error ? reason.message : String(reason);
    const stack = reason instanceof Error ? reason.stack : null;
    void logError({ message: `Unhandled rejection: ${msg}`, stack, context: { type: "unhandledrejection" } });
  });
}
