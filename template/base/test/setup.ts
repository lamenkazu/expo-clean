import '@infra/shared/i18n';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// O SQLite nativo nao existe no Jest. Testes de view-model usam repositorios em memoria (test/).
jest.mock('expo-sqlite', () => ({
  openDatabaseSync: () => ({}),
}));

// Os icones carregam fontes pelo registro de assets, que o Jest nao tem. O nome vira texto.
jest.mock('@expo/vector-icons', () => {
  const { createElement } = require('react');
  const { Text } = require('react-native');
  const Icon = ({ name }: { name: string }) => createElement(Text, null, name);

  return { Feather: Icon, MaterialCommunityIcons: Icon };
});
