import { describe, expect, it } from "vitest";
import { upload } from "../src/upload.js";

function countingTransport(statuses: [number, ...number[]]) {
  let calls = 0;
  return {
    send: async () => {
      const status = calls < statuses.length ? statuses[calls] : statuses[statuses.length - 1];
      calls++;
      return status as number;
    },
    get calls() {
      return calls;
    },
  };
}

describe("upload", () => {
  it("resolves when the server accepts the payload", async () => {
    const transport = countingTransport([200]);
    await expect(upload(transport, "hello")).resolves.toBeUndefined();
    expect(transport.calls).toBe(1);
  });

  it("throws immediately when the server rejects it with a non-503 status", async () => {
    const transport = countingTransport([500]);
    await expect(upload(transport, "hello")).rejects.toThrow("500");
    expect(transport.calls).toBe(1);
  });

  it("retries once on a 503 and resolves if the retry succeeds", async () => {
    const transport = countingTransport([503, 200]);
    await expect(upload(transport, "hello")).resolves.toBeUndefined();
    expect(transport.calls).toBe(2);
  });

  it("retries once on a 503 and throws if the retry also fails", async () => {
    const transport = countingTransport([503, 503]);
    await expect(upload(transport, "hello")).rejects.toThrow("503");
    expect(transport.calls).toBe(2);
  });
});
