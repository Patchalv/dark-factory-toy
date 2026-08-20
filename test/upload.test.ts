import { describe, expect, it } from "vitest";
import { upload } from "../src/upload.js";

describe("upload", () => {
  it("resolves when the server accepts the payload", async () => {
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

  it("throws when the server rejects it", async () => {
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

  it("resolves after a single 503 retry succeeds", async () => {
    let calls = 0;
    const transport = {
      send: async () => {
        calls++;
        return calls === 1 ? 503 : 200;
      },
    };
    await expect(upload(transport, "hello")).resolves.toBeUndefined();
    expect(calls).toBe(2);
  });

  it("throws when the 503 retry also fails, having sent twice", async () => {
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
});
