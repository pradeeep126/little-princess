# Little Memories — Complete Build & Deployment Guide

## Prerequisites

Install these tools before starting:

```bash
# Node.js 20+ (check version)
node --version

# Install Angular CLI globally
npm install -g @angular/cli@20

# Install Ionic CLI globally
npm install -g @ionic/cli

# Install Capacitor CLI globally
npm install -g @capacitor/cli

# Java 17+ (required for Android build)
java --version

# Android Studio — download from:
# https://developer.android.com/studio

# Set ANDROID_HOME environment variable
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

---

## Step 1 — Install Dependencies

```bash
cd little-memories
npm install
```

---

## Step 2 — Build Web Assets

```bash
# Development build
ng build

# Production build (use this for APK)
ng build --configuration production
```

Output goes to `www/` folder.

---

## Step 3 — Sync Capacitor

```bash
# Sync web assets to Android
npx cap sync android

# If adding Android platform for first time
npx cap add android
npx cap sync android
```

---

## Step 4 — Open in Android Studio

```bash
npx cap open android
```

In Android Studio:
- Wait for Gradle sync to finish
- Set target SDK to 34 in `app/build.gradle`
- Verify `AndroidManifest.xml` permissions are present

---

## Step 5 — Run on Device / Emulator

```bash
# List connected devices
adb devices

# Run directly via Capacitor
npx cap run android

# Or in Android Studio:
# Click the green ▶ Run button
```

---

## Step 6 — Generate Keystore (one-time)

```bash
# Generate a release keystore — keep this file safe forever!
keytool -genkey -v \
  -keystore little-memories-key.jks \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000 \
  -alias little-memories

# You'll be prompted for:
# - Keystore password (remember this!)
# - Key password (remember this!)
# - Name, organization, location details

# IMPORTANT: Back up little-memories-key.jks in a safe place.
# Losing it means you can never update your Play Store app.
```

---

## Step 7 — Build Release APK

### Option A — Via Android Studio
1. Build → Generate Signed Bundle / APK
2. Select **APK**
3. Choose keystore: `little-memories-key.jks`
4. Enter keystore & key passwords
5. Select **release** build variant
6. Click Finish
7. APK location: `android/app/release/app-release.apk`

### Option B — Via Command Line

```bash
# Set environment variables
export KEYSTORE_PATH=little-memories-key.jks
export KEYSTORE_PASSWORD=your_keystore_password
export KEY_ALIAS=little-memories
export KEY_PASSWORD=your_key_password

# Build release APK
cd android
./gradlew assembleRelease

# APK will be at:
# android/app/build/outputs/apk/release/app-release.apk
```

---

## Step 8 — Build Release AAB (Play Store)

Google Play now requires AAB format instead of APK.

```bash
# Build App Bundle
cd android
./gradlew bundleRelease

# AAB will be at:
# android/app/build/outputs/bundle/release/app-release.aab
```

### Sign the AAB manually (if needed)

```bash
jarsigner -verbose -sigalg SHA256withRSA -digestalg SHA-256 \
  -keystore little-memories-key.jks \
  android/app/build/outputs/bundle/release/app-release.aab \
  little-memories
```

---

## Step 9 — Test APK on Device

```bash
# Install directly on connected Android device
adb install android/app/build/outputs/apk/release/app-release.apk

# Or for AAB testing use bundletool:
# Download bundletool: https://github.com/google/bundletool/releases

java -jar bundletool.jar build-apks \
  --bundle=app-release.aab \
  --output=little-memories.apks \
  --ks=little-memories-key.jks \
  --ks-pass=pass:YOUR_KEYSTORE_PASS \
  --ks-key-alias=little-memories \
  --key-pass=pass:YOUR_KEY_PASS

java -jar bundletool.jar install-apks --apks=little-memories.apks
```

---

## Step 10 — Play Store Submission

### 10.1 — Create Developer Account
- Go to: https://play.google.com/console
- Pay one-time $25 registration fee
- Complete account verification

### 10.2 — Create New App
1. Click **Create app**
2. App name: `Little Memories`
3. Default language: `English (United States)`
4. App or Game: **App**
5. Free or Paid: **Free**
6. Accept declarations

### 10.3 — Store Listing
Fill in:
- **Short description** (80 chars):
  > Preserve your child's precious memories with photos and notes. Offline. Private.

- **Full description** (4000 chars):
  > Little Memories is a beautiful, private app for parents to capture and preserve their child's most precious milestones — from birth onwards.
  >
  > 🌸 KEY FEATURES
  > • Create a beautiful timeline of your child's life
  > • Add photos from your gallery for each memory
  > • Record milestones: First Smile, First Steps, First Word & more
  > • Search and filter memories by category or date
  > • Full photo gallery with year-based filtering
  > • Export & import backup (JSON)
  > • 100% offline — no internet required
  > • No account, no login, no cloud
  > • All data stays on your device
  >
  > 🔒 COMPLETELY PRIVATE
  > Little Memories never sends your data anywhere. No servers, no analytics, no ads. Your family's memories are yours alone.
  >
  > 📱 MILESTONES INCLUDED
  > Birth · First Smile · First Laugh · First Tooth · First Crawl · First Walk · First Word · First Birthday · First Day at School · Family Trips · Celebrations · and more
  >
  > 💾 BACKUP & RESTORE
  > Export all your memories as a JSON backup file and restore them anytime. Never lose a memory.

- **App icon**: 512×512 PNG (no alpha)
- **Feature graphic**: 1024×500 JPG/PNG
- **Screenshots**: At least 2, up to 8 (phone screenshots required)
  - Recommended: 1080×1920 or 1080×2340

### 10.4 — App Content
Complete these sections:
- **Privacy Policy URL** — required even for no-login apps
  - Create a simple policy page (GitHub Pages works)
  - State: "No data is collected or transmitted"
- **App category**: `Lifestyle` or `Family`
- **Content rating**: Complete questionnaire → should get `Everyone`
- **Target audience**: Adults (parents)
- **Data safety**: Fill in — select "No data collected/shared"

### 10.5 — Privacy Policy Template

```
Privacy Policy for Little Memories

Last updated: [DATE]

Little Memories ("we", "our", or "us") is committed to protecting your privacy.

Data Collection:
Little Memories does NOT collect any personal data. The app works entirely
offline. All memories, photos, and profile information you enter are stored
locally on your device only.

No data is transmitted to any server. No analytics are collected.
No third-party services have access to your data.

Data Storage:
All data is stored locally using Android's Preferences and local storage APIs.
You can delete all data at any time from Settings > Reset All Data.

Backup:
The Export Backup feature saves a JSON file to your device's local storage.
This file is not uploaded anywhere.

Contact:
[your email]
```

### 10.6 — Release

1. Go to **Production** track
2. Click **Create new release**
3. Upload your `app-release.aab`
4. Add release notes:
   ```
   Version 1.0.0
   • Initial release
   • Create and manage your child's precious memories
   • Photo gallery, milestone timeline, backup & restore
   ```
5. Click **Review release**
6. Click **Start rollout to Production**

**Review time**: Usually 3–7 days for first submission.

---

## Quick Development Commands

```bash
# Serve in browser (for rapid UI development)
ng serve

# Serve with Ionic DevApp
ionic serve

# Live reload on Android device
npx cap run android --livereload --external

# Sync after web changes
npx cap sync

# Open Android Studio
npx cap open android

# Check Capacitor doctor
npx cap doctor
```

---

## Folder Structure

```
little-memories/
├── src/
│   ├── app/
│   │   ├── core/
│   │   │   ├── models/
│   │   │   │   └── memory.model.ts          # Data models + CATEGORY_META
│   │   │   └── services/
│   │   │       ├── memory.service.ts        # Signals state + CRUD
│   │   │       ├── camera.service.ts        # Camera/gallery access
│   │   │       └── storage.service.ts       # Capacitor Preferences wrapper
│   │   ├── pages/
│   │   │   ├── tabs/
│   │   │   │   └── tabs.component.ts        # Bottom navigation
│   │   │   ├── home/
│   │   │   │   ├── home.page.ts             # Dashboard
│   │   │   │   └── home.page.scss
│   │   │   ├── add-memory/
│   │   │   │   ├── add-memory.page.ts       # Add / Edit memory form
│   │   │   │   └── add-memory.page.scss
│   │   │   ├── timeline/
│   │   │   │   ├── timeline.page.ts         # Chronological timeline
│   │   │   │   └── timeline.page.scss
│   │   │   ├── memory-detail/
│   │   │   │   ├── memory-detail.page.ts    # Photo carousel + notes
│   │   │   │   └── memory-detail.page.scss
│   │   │   ├── gallery/
│   │   │   │   ├── gallery.page.ts          # Photo grid + fullscreen
│   │   │   │   └── gallery.page.scss
│   │   │   ├── profile/
│   │   │   │   ├── profile.page.ts          # Child profile
│   │   │   │   └── profile.page.scss
│   │   │   └── settings/
│   │   │       ├── settings.page.ts         # Backup / reset
│   │   │       └── settings.page.scss
│   │   ├── shared/
│   │   │   ├── components/
│   │   │   │   └── memory-card/
│   │   │   │       └── memory-card.component.ts  # Reusable card
│   │   │   └── pipes/
│   │   │       └── age.pipe.ts              # "1 yr 4 mo old"
│   │   ├── app.component.ts
│   │   ├── app.config.ts                    # Providers + APP_INITIALIZER
│   │   └── app.routes.ts                    # Lazy-loaded routes
│   ├── theme/
│   │   └── variables.scss                   # CSS design tokens
│   ├── environments/
│   │   ├── environment.ts
│   │   └── environment.prod.ts
│   ├── global.scss
│   ├── index.html
│   ├── main.ts
│   └── manifest.webmanifest
├── android/
│   ├── app/
│   │   ├── build.gradle
│   │   └── src/main/
│   │       ├── AndroidManifest.xml          # Permissions
│   │       └── res/
│   │           ├── values/
│   │           │   ├── strings.xml
│   │           │   ├── styles.xml
│   │           │   └── colors.xml
│   │           ├── drawable/splash.xml
│   │           └── xml/
│   │               ├── file_paths.xml
│   │               └── network_security_config.xml
│   ├── build.gradle
│   └── variables.gradle
├── capacitor.config.ts
├── angular.json
├── package.json
├── tsconfig.json
└── BUILD_GUIDE.md
```

---

## App Icon Generation

Use these tools to generate all required icon sizes from a single 1024×1024 source:

```bash
# Install icon generator
npm install -g @capacitor/assets

# Place your 1024x1024 source image at:
# assets/icon.png     (app icon — no alpha)
# assets/splash.png   (2732x2732 splash screen)

# Generate all sizes
npx @capacitor/assets generate --android
```

Required icon sizes for Play Store:
- 48×48, 72×72, 96×96, 144×144, 192×192 (mipmap)
- 512×512 (Play Store listing)
- 1024×500 (feature graphic)

---

## Troubleshooting

| Problem | Solution |
|---|---|
| `JAVA_HOME not set` | Install JDK 17, set `JAVA_HOME` env var |
| `SDK location not found` | Set `ANDROID_HOME` or create `local.properties` |
| `Gradle sync failed` | File → Sync Project with Gradle Files in Android Studio |
| `Permission denied camera` | Check `AndroidManifest.xml` has camera permissions |
| `Photos not loading` | Ensure `READ_MEDIA_IMAGES` permission for Android 13+ |
| `App crashes on launch` | Check `adb logcat` for stack trace |
| `White screen on launch` | Run `ng build --configuration production` first |
| `Play Store rejected` | Add privacy policy URL, complete data safety form |
| `AAB upload error` | Ensure app is signed with release keystore |

---

## Performance Tips

1. **Compress photos** before storing — the `CameraService` uses quality: 80
2. **Lazy loading** is enabled for all routes — only active page loads
3. **Signals** ensure minimal re-renders — only affected components update
4. **OnPush** change detection compatible with signals
5. **Local storage** — Capacitor Preferences is synchronous-feel with async API

---

## Security Notes

- All data is stored locally via `@capacitor/preferences` (Android SharedPreferences)
- Photos are stored as base64 in preferences — fine for up to ~200 photos
- For very large photo collections (500+), consider migrating to `@capacitor/filesystem`
- No network requests are made by the app itself
- Keystore file must be kept secret and backed up securely
