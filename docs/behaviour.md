# Behaviour

`upload()` retries exactly once, and only when the server responds `503`, before failing.
