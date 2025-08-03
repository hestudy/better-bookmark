import { client, testLogin } from "@/lib/test.js";
import { describe, expect, it } from "vitest";

describe("bookmark", async () => {
  const login = await testLogin();

  it("should create a bookmark", async () => {
    const res = await client.bookmarks.create.$post(
      {
        json: {
          url: "https://hono.dev",
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

  it("should get bookmark page", async () => {
    const res = await client.bookmarks.page.$post(
      {
        json: {
          page: 1,
          pageSize: 10,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${login.token}`,
        },
      }
    );
    const json = await res.json();

    console.log(json);

    expect(json).toBeTruthy();
  });

  it("should get bookmark", async () => {
    const createRes = await client.bookmarks.create.$post(
      {
        json: {
          url: "https://hono.dev",
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
    const res = await client.bookmarks.$get(
      {
        query: {
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

    console.log(json);

    expect(json).toHaveProperty("id");
  });

  it("should delete a bookmark", async () => {
    const createRes = await client.bookmarks.create.$post(
      {
        json: {
          url: "https://hono.dev",
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
