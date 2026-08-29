/** Somewhere to send bytes. Deliberately the smallest thing that can fail. */
export interface Transport {
  send(payload: string): Promise<number>;
}

// This repo has no shared retry/config module for other services to check
// this against — it's a single-file project. 3 total attempts (i.e. up to
// 2 retries) is the account-wide standard confirmed out of band; it is not
// derived from anything in this codebase, and it must be kept in sync by
// hand with whatever the other services use.
const MAX_ATTEMPTS = 3;

/**
 * Uploads, retrying temporary failures (5xx) up to the standard attempt
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
