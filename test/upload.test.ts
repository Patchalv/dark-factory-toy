import { describe, expect, it } from "vitest";
import { upload } from "../src/upload.js";

describe("upload", () => {
  it("resolves when the server accepts the payload", async () => {
    await expect(upload({ send: async () => 200 }, "hello")).resolves.toBeUndefined();
  });

  it("throws when the server rejects it", async () => {
    await expect(upload({ send: async () => 500 }, "hello")).rejects.toThrow("500");
  });

  it("retries a temporary failure and resolves once it succeeds within the attempt budget", async () => {
    let calls = 0;
    const transport = {
      send: async () => {
        calls++;
        return calls < 3 ? 503 : 200;
      },
    };
    await expect(upload(transport, "hello")).resolves.toBeUndefined();
    expect(calls).toBe(3);
  });

  it("gives up after the standard attempt budget when every attempt is a temporary failure", async () => {
    let calls = 0;
    const transport = {
      send: async () => {
        calls++;
        return 503;
      },
    };
    await expect(upload(transport, "hello")).rejects.toThrow("503");
    expect(calls).toBe(3);
  });

  it("does not retry a permanent failure", async () => {
    let calls = 0;
    const transport = {
      send: async () => {
        calls++;
        return 404;
      },
    };
    await expect(upload(transport, "hello")).rejects.toThrow("404");
    expect(calls).toBe(1);
  });
});
