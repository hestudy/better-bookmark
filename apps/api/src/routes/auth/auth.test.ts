import { auth } from "@/lib/auth.js";
import { describe, expect, it } from "vitest";

describe("auth", () => {
  it.skip("should create a user", async () => {
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
