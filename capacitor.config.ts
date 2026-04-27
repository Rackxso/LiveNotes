import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.livenotes.app',
  appName: 'LiveNotes',
  webDir: 'dist/LiveNotes_Angular/browser',
  server: {
    androidScheme: 'https'
  }
};

export default config;
