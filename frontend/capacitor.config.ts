import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  // Identificador único do app (estilo domínio reverso). Pode trocar por algo
  // como com.seunome.enemquest antes de gerar o APK final.
  appId: 'com.enemquest.app',
  appName: 'ENEM Quest',
  // Pasta gerada pelo "npm run build:mobile" — é o que o Capacitor empacota no app.
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
};

export default config;
