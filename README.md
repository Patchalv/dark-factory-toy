# dark-factory-toy
The dark-factory's golden toy repo. One test, real CI, disposable.

## upload()

Sends `payload` once via the given `Transport`. If the server responds `503`
(temporarily unavailable), `upload()` retries exactly once before giving up.
Any other status of `400` or above fails immediately, on the first attempt,
with no retry. There is no backoff, delay, or configurable retry count.
