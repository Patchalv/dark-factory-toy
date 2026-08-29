import { describe, expect, it } from "vitest";
import { upload } from "../src/upload.js";

describe("upload", () => {
  it("resolves when the server accepts the payload", async () => {
    await expect(upload({ send: async () => 200 }, "hello")).resolves.toBeUndefined();
  });

  it("throws when the server rejects it", async () => {
    await expect(upload({ send: async () => 500 }, "hello")).rejects.toThrow("500");
  });

  it("throws on an empty payload without calling transport.send", async () => {
    const send = async () => {
      throw new Error("transport.send should not have been called");
    };
    await expect(upload({ send }, "")).rejects.toThrow("refusing to upload an empty payload");
  });

  it("still sends a whitespace-only payload", async () => {
    await expect(upload({ send: async () => 200 }, " ")).resolves.toBeUndefined();
  });
});
