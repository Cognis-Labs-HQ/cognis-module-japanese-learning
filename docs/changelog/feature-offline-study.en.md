# Offline Study

**Feature Branch:** feature-offline-study

## Offline Mode

Study keeps bounded lightweight JSON snapshots in the current tab: schemas, permitted character/card data, locations, viewed IDs, favourites and previously opened decks. Language schemas opt in with `metadata.offline: { cache: "lightweight" }`. The Library cache holds at most 16 MB and 100 reads; other read caches hold at most 4 MB and 100 reads. No audio bytes, dictionary responses, credentials or authenticated documents are persisted.

Explore previews resolve relationships from already-authorized cached rows. Drawing and flashcard practice work locally. Completions, reviews, viewed IDs and final favourite states are queued for delivery; progress, XP and rewards become authoritative only after server acknowledgement. Audio and dictionary/ElevenLabs requests stop. Content edits, deletion and sharing require connectivity. Only previously loaded content within the cache limits is available.

Private Study requires the same previously verified, unexpired account session in the same tab. Reloads and first visits retain the public-only offline contract. Account/session changes, preference changes, module lifecycle changes and provider disposal invalidate private snapshots. Server revocations cannot be learned while disconnected. Recovery uses the existing unsaved-change guard and reloads to refresh server authorization.

## Queued Delivery and Consent

The host exposes `offline:outbox`, `offline:state` and `offline:accessPolicy` through ctx. Components register delivery handlers for their provider lifetime and submit stable operation IDs through `offline:enqueue`; `offline:flush` authorizes and delivers. The durable account-bound queue holds at most 1,000 records and 1 MB for seven days, without tokens. It preserves original IDs and timestamps, retries transient failures and removes acknowledged or permanently rejected records. A localized warning reports rejected records. Logout clears the account queue; changing accounts never replays another account’s data. Disabling Offline Mode stops new queued writes. Pending writes may still deliver online.

Recovery refreshes providers and runs `authenticate-session` before the final `afterSession` stage can replay activity. Required providers declare `offlineAccessGuard` in the server catalog. Unknown requirements or missing consent fail closed. Terms of Service caches the latest fetched document versions and server-confirmed acceptance per account. A new unaccepted version immediately blocks offline reads, navigation and queued writes, and prevents replay until online consent succeeds. Offline acceptance is unavailable. Private content snapshots remain tab-local; only the bounded operation queue and legal snapshots survive reload.

## Commits

- [917330e](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/917330ee4b13a580b92fbea30f0f56afeda7c65f)
- [945d22a](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/945d22ac64936a5a63ba2d529efdc8a16587297d)
- [6fabbaa](https://github.com/Cognis-Labs-HQ/cognis-module-japanese-learning/commit/6fabbaaad6be1499e3ca8c5a3d3101b31166d2c4)
