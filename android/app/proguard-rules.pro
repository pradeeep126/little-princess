# Little Memories ProGuard Rules

# Capacitor
-keep class com.getcapacitor.** { *; }
-keep class com.getcapacitor.plugin.** { *; }
-keep @com.getcapacitor.annotation.CapacitorPlugin class * { *; }

# Camera plugin
-keep class com.capacitorjs.plugins.camera.** { *; }

# Preferences plugin
-keep class com.capacitorjs.plugins.preferences.** { *; }

# Filesystem plugin
-keep class com.capacitorjs.plugins.filesystem.** { *; }

# Share plugin
-keep class com.capacitorjs.plugins.share.** { *; }

# WebView
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}

# Keep annotations
-keepattributes *Annotation*
-keepattributes SourceFile,LineNumberTable
-keep public class * extends java.lang.Exception

# AndroidX
-keep class androidx.** { *; }
-dontwarn androidx.**

# Remove logging in release
-assumenosideeffects class android.util.Log {
    public static *** d(...);
    public static *** v(...);
    public static *** i(...);
}
