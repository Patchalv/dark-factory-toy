import { describe, expect, it } from "vitest";
import { upload } from "../src/upload.js";

describe("upload", () => {
  it("resolves when the server accepts the payload", async () => {
    await expect(upload({ send: async () => 200 }, "hello")).resolves.toBeUndefined();
  });

  it("throws when the server rejects it", async () => {
    await expect(upload({ send: async () => 500 }, "hello")).rejects.toThrow("500");
  });

  it("resolves after a single 503 retry succeeds", async () => {
    const statuses = [503, 200];
    let calls = 0;
    const transport = {
      send: async () => {
        calls++;
        return statuses.shift()!;
      },
    };
    await expect(upload(transport, "hello")).resolves.toBeUndefined();
    expect(calls).toBe(2);
  });

  it("throws when a 503 retry also fails, having sent twice", async () => {
    let calls = 0;
    const transport = {
      send: async () => {
        calls++;
        return 503;
      },
    };
    await expect(upload(transport, "hello")).rejects.toThrow("503");
    expect(calls).toBe(2);
  });

  it("throws immediately on a non-503 failure, having sent once", async () => {
    let calls = 0;
    const transport = {
      send: async () => {
        calls++;
        return 500;
      },
    };
    await expect(upload(transport, "hello")).rejects.toThrow("500");
    expect(calls).toBe(1);
  });

  it("resolves on a 200, having sent once", async () => {
    let calls = 0;
    const transport = {
      send: async () => {
        calls++;
        return 200;
      },
    };
    await expect(upload(transport, "hello")).resolves.toBeUndefined();
    expect(calls).toBe(1);
  });
});
