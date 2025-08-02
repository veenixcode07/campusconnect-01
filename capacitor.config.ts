import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.b0ac095b773e4f208abc1834b3142ed4',
  appName: 'campusconnect-01',
  webDir: 'dist',
  server: {
    url: 'https://b0ac095b-773e-4f20-8abc-1834b3142ed4.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 0
    }
  }
};

export default config;