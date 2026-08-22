# Changelog

## Unreleased

- `upload()` now retries exactly once when the server responds `503`, before
  failing as before; every other status is unchanged (#1).
