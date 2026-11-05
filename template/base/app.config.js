const fs = require('node:fs');
const path = require('node:path');

const GOOGLE_SERVICES_FILE = './google-services.json';

// O Firebase so entra no build quando o projeto tem google-services.json. Sem ele, o app compila e
// usa as implementacoes de console para analytics, crash e remote config (ver o DI).
module.exports = ({ config }) => {
  const hasFirebase = fs.existsSync(path.join(__dirname, GOOGLE_SERVICES_FILE));
  const easProjectId = process.env.EXPO_PUBLIC_EAS_PROJECT_ID;

  return {
    ...config,
    android: {
      ...config.android,
      ...(hasFirebase ? { googleServicesFile: GOOGLE_SERVICES_FILE } : {}),
    },
    plugins: [
      ...(config.plugins ?? []),
      ...(hasFirebase ? ['@react-native-firebase/app', '@react-native-firebase/crashlytics'] : []),
    ],
    extra: {
      ...config.extra,
      firebaseEnabled: hasFirebase,
      ...(easProjectId ? { eas: { projectId: easProjectId } } : {}),
    },
    // O EAS Update so e configurado quando o projeto ja existe no EAS.
    ...(easProjectId
      ? {
          updates: {
            url: `https://u.expo.dev/${easProjectId}`,
            requestHeaders: { 'expo-channel-name': 'production' },
          },
        }
      : {}),
  };
};
