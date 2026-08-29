/** Somewhere to send bytes. Deliberately the smallest thing that can fail. */
export interface Transport {
  send(payload: string): Promise<number>;
}

/** Uploads once. Any 4xx or 5xx is a failure. */
export async function upload(transport: Transport, payload: string): Promise<void> {
  if (payload === "") {
    throw new Error("refusing to upload an empty payload");
  }
  const status = await transport.send(payload);
  if (status >= 400) {
    throw new Error(`upload failed with ${status}`);
  }
}
