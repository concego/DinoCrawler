import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.euconcegojogar.dinocrawler',
  appName: 'Dino Crawler',
  webDir: 'www',
  plugins: {
    NativePurchases: { autoFinishTransactions: true },
  },
};

export default config;
