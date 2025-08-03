import { testLogin } from "@/lib/test.js";
import api from "@/src/index.js";
import { testClient } from "hono/testing";
import { describe, expect, it } from "vitest";

describe("bookmark", async () => {
  const login = await testLogin();

  it("should create a bookmark", async () => {
    const client = testClient(api);

    const res = await client.bookmarks.create.$post(
      {
        json: {
          url: "https://google.com",
        },
      },
      {
        headers: {
          Authorization: `Bearer ${login.token}`,
        },
      }
    );
    const json = await res.json();

    expect(json).toHaveProperty("id");
  });

  it("should delete a bookmark", async () => {
    const client = testClient(api);
    const createRes = await client.bookmarks.create.$post(
      {
        json: {
          url: "https://google.com",
        },
      },
      {
        headers: {
          Authorization: `Bearer ${login.token}`,
        },
      }
    );
    const createJson = await createRes.json();
    const id = createJson.id;
    const res = await client.bookmarks.delete.$post(
      {
        json: {
          id,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${login.token}`,
        },
      }
    );
    const json = await res.json();

    expect(json).toHaveProperty("id");
  });
});
