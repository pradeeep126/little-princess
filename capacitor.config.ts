import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.littlememories.app',
  appName: 'Little Memories',
  webDir: 'www',
  server: {
    androidScheme: 'https',
    cleartext: false
  },
  android: {
    allowMixedContent: false,
    buildOptions: {
      keystorePath: 'little-memories-key.jks',
      keystoreAlias: 'little-memories',
    }
  },
  plugins: {
    Camera: {
      permissionType: 'camera'
    },
    Preferences: {
      group: 'LittleMemoriesPrefs'
    },
    Filesystem: {
      directory: 'DATA'
    }
  }
};

export default config;
