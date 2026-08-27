import { describe, expect, it } from "vitest";
import { upload, UploadError } from "../src/upload.js";

describe("upload", () => {
  it("resolves when the server accepts the payload", async () => {
    await expect(upload({ send: async () => 200 }, "hello")).resolves.toBeUndefined();
  });

  it("throws when the server rejects it", async () => {
    await expect(upload({ send: async () => 500 }, "hello")).rejects.toThrow("500");
  });

  it("marks a 5xx response as a temporary failure", async () => {
    const error = await upload({ send: async () => 503 }, "hello").catch((e: unknown) => e);

    expect(error).toBeInstanceOf(UploadError);
    expect(error).toMatchObject({ status: 503, kind: "temporary" });
  });

  it("marks a 4xx response as a permanent failure", async () => {
    const error = await upload({ send: async () => 404 }, "hello").catch((e: unknown) => e);

    expect(error).toBeInstanceOf(UploadError);
    expect(error).toMatchObject({ status: 404, kind: "permanent" });
  });
});
