import { auth } from "@/lib/auth.js";
import api from "@/src/index.js";
import { testClient } from "hono/testing";
import { describe, expect, it } from "vitest";

describe("auth", () => {
  it.skip("should create a user", async () => {
    testClient(api);
    const res = await auth.api.signUpEmail({
      body: {
        email: "test@example.com",
        password: "testtest",
        name: "test",
      },
    });
    expect(res).toHaveProperty("user");
  });
});
