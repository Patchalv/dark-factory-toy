/** Somewhere to send bytes. Deliberately the smallest thing that can fail. */
export interface Transport {
  send(payload: string): Promise<number>;
}

/** The standard attempt budget shared by every service in this account. */
const MAX_ATTEMPTS = 3;

/**
 * Uploads, retrying a 5xx (temporary) failure up to the standard attempt
 * budget. A 4xx (permanent) failure is not retried.
 */
export async function upload(transport: Transport, payload: string): Promise<void> {
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    const status = await transport.send(payload);
    if (status < 400) {
      return;
    }
    if (status < 500 || attempt === MAX_ATTEMPTS) {
      throw new Error(`upload failed with ${status}`);
    }
  }
}
