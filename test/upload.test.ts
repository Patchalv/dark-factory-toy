import { describe, expect, it } from "vitest";
import { upload } from "../src/upload.js";

describe("upload", () => {
  it("resolves when the server accepts the payload", async () => {
    await expect(upload({ send: async () => 200 }, "hello")).resolves.toBeUndefined();
  });

  it("throws when the server rejects it", async () => {
    await expect(upload({ send: async () => 500 }, "hello")).rejects.toThrow("500");
  });
});
