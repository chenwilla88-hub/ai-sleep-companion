# Audio Engine

## Responsibilities

- Multi-track loading
- Multi-track mixing
- Independent track volume control
- Fade in
- Fade out
- Loop playback
- Timed stop
- Scene transition
- Runtime parameter changes from AI or recommendation output

## First Web Implementation

Use the Web Audio API in a dedicated frontend module. The MVP should read a `SoundMix` timeline and apply volume changes over time instead of hard-coding phase behavior in UI components.
