/** Somewhere to send bytes. Deliberately the smallest thing that can fail. */
export interface Transport {
  send(payload: string): Promise<number>;
}

/**
 * Uploads once. A 503 (server temporarily unavailable) is retried exactly
 * once before giving up. Any other 4xx or 5xx fails immediately.
 */
export async function upload(transport: Transport, payload: string): Promise<void> {
  let status = await transport.send(payload);
  if (status === 503) {
    status = await transport.send(payload);
  }
  if (status >= 400) {
    throw new Error(`upload failed with ${status}`);
  }
}
