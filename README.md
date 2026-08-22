# dark-factory-toy
The dark-factory's golden toy repo. One test, real CI, disposable.

## upload()

`upload()` sends a payload once. If the server responds with a `503`, it
retries exactly once; if that retry also fails, `upload()` throws. Any other
status of `400` or above fails immediately, with no retry.
