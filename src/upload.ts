/** Somewhere to send bytes. Deliberately the smallest thing that can fail. */
export interface Transport {
  send(payload: string): Promise<number>;
}

/**
 * Raised when a non-2xx response comes back. `kind` lets a caller branch on
 * whether the failure is worth retrying ("temporary", a 5xx) or not
 * ("permanent", a 4xx) without parsing `message`.
 */
export class UploadError extends Error {
  readonly status: number;
  readonly kind: "temporary" | "permanent";

  constructor(status: number) {
    super(`upload failed with ${status}`);
    this.name = "UploadError";
    this.status = status;
    this.kind = status >= 500 ? "temporary" : "permanent";
  }
}

/** Uploads once. Any 4xx or 5xx is a failure. */
export async function upload(transport: Transport, payload: string): Promise<void> {
  const status = await transport.send(payload);
  if (status >= 400) {
    throw new UploadError(status);
  }
}
