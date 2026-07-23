# PARKED.md — captured, not built

Holding pen for good ideas that are **out of scope for the current run**. Capturing them here is how we resist the shiny-new-idea gremlin: the idea is safe, the run stays focused. Nothing here gets built without being promoted into MILESTONES.md first.

## Voice quality upgrade (warmer Afrikaans)
Regenerate the bundled MP3s with a commercial-safe, genuine-`af-ZA` provider — **Azure Speech** (what edge-tts already wraps) or **Google Cloud TTS** `af-ZA` WaveNet. Because audio is pre-generated and bundled, this is a pure asset swap: regenerate, drop into `public/audio/`, done. **Not** Fish Audio (no documented Afrikaans; free tier bans commercial use). **Not** Amazon Polly (no Afrikaans, so AWS-native won't cover the AF side). Trigger to promote: after Run A ships and you've heard the current voices on a real device.

## iOS build
Capacitor keeps this open. Add the iOS platform, build in Xcode (needs a Mac + Apple Developer account — billable, human-owned). Trigger: demand from iPhone-owning parents.

## Google Play Store release
Publishing to Play adds: a Play Console account (one-time fee — billable, human-owned), app signing, a **privacy policy** (POPIA + Google Families policy — strict for children's apps), a content rating, and store assets. Architecture already avoids the hard parts (no data collection). Trigger: the sideloaded beta gets real traction with other parents.

## Speech practice (child speaks back)
On-device speech recognition to check a child's pronunciation. Big feature, real privacy considerations (mic access, keep it on-device). Trigger: core learning loop proven and loved.

## Curriculum expansion
More lessons/levels (verbs, sentences, days/months, school subjects), and a Level 4. Needs new audio generated for new words. Cheap to add once the voice-upgrade path is chosen.

## Cross-device progress
Only if ever wanted — would require a backend and therefore auth + data-privacy obligations, breaking the "no server, no PII off-device" property. High cost to a currently-simple, safe app. Park with prejudice unless there's a strong reason.
