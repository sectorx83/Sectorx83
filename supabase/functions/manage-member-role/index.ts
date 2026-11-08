import { createClient } from "https://esm.sh/@supabase/supabase-js@2.81.1";

const allowedOrigins = (Deno.env.get("APP_ORIGIN") ?? "")
  .split(",")
  .map((value) => value.trim())
  .filter(Boolean);

Deno.serve(async (req: Request) => {
  const origin = req.headers.get("Origin") ?? "";
  const originAllowed = allowedOrigins.includes(origin);
  const corsHeaders: Record<string, string> = {
    "Access-Control-Allow-Headers": "authorization, apikey, content-type, x-client-info",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Vary": "Origin",
  };
  if (originAllowed) corsHeaders["Access-Control-Allow-Origin"] = origin;

  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  if (!originAllowed) return json({ error: "Origin is not allowed." }, 403);
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders });

  const authorization = req.headers.get("Authorization");
  if (!authorization?.startsWith("Bearer ")) return json({ error: "Authentication required." }, 401);

  const url = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const publishableKey = Deno.env.get("SUPABASE_PUBLISHABLE_KEY");
  if (!url || !serviceKey || !publishableKey) {
    return json({ error: "Function secrets are not configured." }, 503);
  }

  const caller = createClient(url, publishableKey, {
    global: { headers: { Authorization: authorization } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const service = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data: callerData, error: callerError } = await caller.auth.getUser();
  if (callerError || !callerData.user) return json({ error: "Invalid session." }, 401);
  if (callerData.user.app_metadata?.role !== "admin") {
    return json({ error: "Administrator access required." }, 403);
  }

  if (req.method === "GET") {
    const { data, error } = await service.auth.admin.listUsers({ page: 1, perPage: 200 });
    if (error) return json({ error: "Unable to retrieve members." }, 500);
    return json({
      users: data.users.map((user) => ({
        id: user.id,
        email: user.email ?? null,
        role: typeof user.app_metadata?.role === "string" ? user.app_metadata.role : "member",
      })),
    });
  }

  if (req.method !== "POST") return json({ error: "Method not allowed." }, 405);

  let body: { user_id?: string; role?: string };
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid JSON body." }, 400);
  }

  if (!body.user_id || !["member", "moderator", "admin"].includes(body.role ?? "")) {
    return json({ error: "A valid member and role are required." }, 400);
  }
  if (body.user_id === callerData.user.id) return json({ error: "You cannot change your own role." }, 400);

  const { data: target, error: targetError } = await service.auth.admin.getUserById(body.user_id);
  if (targetError || !target.user) return json({ error: "Member not found." }, 404);

  const { error } = await service.auth.admin.updateUserById(body.user_id, {
    app_metadata: { ...target.user.app_metadata, role: body.role },
  });
  if (error) return json({ error: "Unable to update member role." }, 500);

  return json({ ok: true, user_id: body.user_id, role: body.role });
});
