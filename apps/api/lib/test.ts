import { hc } from "hono/client";
import { auth } from "./auth.js";
import type { ApiType } from "@/src/index.js";

export const testLogin = () => {
  return auth.api.signInEmail({
    body: {
      email: "test@example.com",
      password: "testtest",
    },
  });
};

export const client = hc<ApiType>("http://localhost:3000");
