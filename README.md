# AI Sleep Companion

AI Sleep Companion is a Web MVP prototype for an AI sleep companion and personalized sound engine.

This first phase focuses on the product UI, page structure, and core user path:

Home -> AI Sleep Coach -> State Analysis -> Sound Recommendation -> Sleep Session -> Morning Feedback.

The prototype is intentionally dependency-free because the current machine has Node.js but no npm. It can run with the included Node static server.

## Run

```bash
node scripts/dev-server.mjs
```

Then open:

```text
http://localhost:4173
```

## Current Scope

- Quiet low-brightness UI direction
- Main MVP route structure
- User state input
- AI coach placeholder logic
- Sound recommendation preview
- Sleep session player mock controls
- Morning feedback screen
- Records, Sleep Profile, Mixer, and Settings structure

## Next Phase

Phase 2 should persist the user state input and prepare the API contract for AI state analysis.
