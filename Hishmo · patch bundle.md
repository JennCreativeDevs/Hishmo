# Hishmo · patch bundle

This bundle contains four file replacements that fix the issues you reported,
plus the demo translation-routing fix. Drop the `.kt` and `.html` files into
your local `hishmo` checkout (the same one that already produced the previous
APKs) and rebuild.

## What's in here

| File | Replaces | Purpose |
|---|---|---|
| `HudOverlay.kt` | `glasses-app/src/main/kotlin/ai/hishmo/glasses/hud/HudOverlay.kt` | M0 visible HUD placeholder (white text on black). Fixes the "full green screen" issue. |
| `ConfidenceIndicator.kt` | `glasses-app/src/main/kotlin/ai/hishmo/glasses/hud/ConfidenceIndicator.kt` | Renders the neutral diamond `◇` until M1 wires real confidence pushes. |
| `MainActivity.kt` | `phone-app/src/main/kotlin/ai/hishmo/phone/MainActivity.kt` | M0 visible phone placeholder. Fixes the blank phone screen until M4. |
| `index.html` | `demo/index.html` | Adds a phrase-table translator so live-mic captions route correctly: worker English → Somali on the client side; client Somali → English on the worker side. |

The four `.patch` files are unified diffs against the original `hishmo2.zip`
state — useful for reviewing the exact lines that changed.

## How to apply (Mac, fastest path)

Assuming your local project is at `~/Projects/hishmo`:

```bash
# 1. Copy the four patched files into place
cp HudOverlay.kt          ~/Projects/hishmo/glasses-app/src/main/kotlin/ai/hishmo/glasses/hud/HudOverlay.kt
cp ConfidenceIndicator.kt ~/Projects/hishmo/glasses-app/src/main/kotlin/ai/hishmo/glasses/hud/ConfidenceIndicator.kt
cp MainActivity.kt        ~/Projects/hishmo/phone-app/src/main/kotlin/ai/hishmo/phone/MainActivity.kt
cp index.html             ~/Projects/hishmo/demo/index.html
```

## Rebuild both APKs

The previous build already completed successfully with these toolchain
versions, so all dependencies are cached.

```bash
cd ~/Projects/hishmo
./gradlew :glasses-app:assembleDebug :phone-app:assembleDebug
```

After the build:

```bash
ls -la glasses-app/build/outputs/apk/debug/glasses-app-debug.apk
ls -la phone-app/build/outputs/apk/debug/phone-app-debug.apk
```

## Reinstall

```bash
# Glasses (connected over USB)
adb -s <glasses_serial> install -r glasses-app/build/outputs/apk/debug/glasses-app-debug.apk

# Phone (different device — connect that one and run)
adb -s <phone_serial>   install -r phone-app/build/outputs/apk/debug/phone-app-debug.apk
```

If you only have one device plugged in at a time, omit `-s <serial>`.

## Verify

- Glasses: launch app → expect black background, white **HISHMO** title,
  "Glasses HUD · v0.1.0 (M0)", "no record" indicator, "Waiting for phone link.",
  and a `◇` symbol. NOT a green wash.
- Phone: launch app → expect a dark navy background with **HISHMO** title,
  "Phone tabletop · v0.1.0 (M0)", a clear "M4 not built yet — use demo/index.html"
  message, and a teal privacy line.

## Demo (no rebuild needed)

Open `~/Projects/hishmo/demo/index.html` in Chrome or Edge. After running
through "Begin consent flow" → "Mark consent given":

1. Click **client mic** (Soomaali side) and say a phrase like
   *"Carruurta way aamusaan markuu yimaado"* — you should see the Somali
   text on the client side and "The children go quiet when he arrives. They
   are afraid." on the caseworker side.
2. Click **worker mic** (English side) and say *"What can I help you with today?"*
   — you should see English on the worker side and
   *"Maxaan caawimaad ku siin karaa maanta?"* on the client side, and the
   phone TTS should speak the Somali aloud.

If the speaker says something the demo phrase pack doesn't contain, the
listener side shows *"(translation pending — no canonical match in demo
pack)"* instead of silently mirroring the original. That placeholder will
disappear once production wires the on-device NLLB MT model in M2.
