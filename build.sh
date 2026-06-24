#!/bin/bash
# Little Memories — Build Script
# Usage: bash build.sh [dev|release]

set -e

MODE=${1:-dev}
echo "🌸 Little Memories Build — Mode: $MODE"
echo "========================================="

# Step 1: Clean
echo "📦 Step 1: Cleaning previous build..."
rm -rf www/

# Step 2: Web build
if [ "$MODE" = "release" ]; then
  echo "🔨 Step 2: Building production web assets..."
  ng build --configuration production
else
  echo "🔨 Step 2: Building development web assets..."
  ng build --configuration development
fi

echo "✅ Web build complete. Output in www/"

# Step 3: Capacitor sync
echo "⚡ Step 3: Syncing Capacitor..."
npx cap sync android

echo "✅ Capacitor sync complete."

# Step 4: Build APK
if [ "$MODE" = "release" ]; then
  echo "📱 Step 4: Building release AAB..."
  cd android
  ./gradlew bundleRelease
  cd ..
  echo ""
  echo "✅ AAB built successfully!"
  echo "📍 Location: android/app/build/outputs/bundle/release/app-release.aab"
  echo ""
  echo "Next steps:"
  echo "  1. Sign the AAB with your keystore"
  echo "  2. Upload to Google Play Console"
else
  echo "📱 Step 4: Building debug APK..."
  cd android
  ./gradlew assembleDebug
  cd ..
  echo ""
  echo "✅ Debug APK built!"
  echo "📍 Location: android/app/build/outputs/apk/debug/app-debug.apk"
  echo ""
  echo "To install on connected device:"
  echo "  adb install android/app/build/outputs/apk/debug/app-debug.apk"
fi

echo ""
echo "🌸 Build complete!"
