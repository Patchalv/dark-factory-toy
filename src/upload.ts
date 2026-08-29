/** Somewhere to send bytes. Deliberately the smallest thing that can fail. */
export interface Transport {
  send(payload: string): Promise<number>;
}

// The account-wide standard attempt budget for temporary failures, confirmed
// out of band; it is not derived from anything in this codebase and must be
// kept in sync by hand with whatever the other services in this account use.
const MAX_ATTEMPTS = 3;

/**
 * Uploads, retrying a temporary failure (5xx) up to the standard attempt
 * budget. A permanent failure (4xx) is not retried.
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
