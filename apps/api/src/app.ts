import type { auth } from "@/lib/auth.js";
import { Hono } from "hono";

const app = new Hono<{
  Variables: {
    user: typeof auth.$Infer.Session.user | null;
    session: typeof auth.$Infer.Session.session | null;
  };
}>();

export default app;
