// O Metro troca todo import de 'react-native' por 'react-native-css/components', que repassa os
// exports do RN por uma lista fixa. Um export do RN fora da lista chega undefined: com o
// AssetRegistry faltando, o expo-asset nao carrega fonte nenhuma (nem a dos icones).
// O patch em patches/react-native-css@*.patch completa a lista; este teste pega a proxima falta
// quando o RN ou o react-native-css mudarem de versao.
describe('react-native-css repassa os exports do react-native', () => {
  it('tem todos os exports do react-native', () => {
    const listed = new Set(Object.keys(require('react-native-css/components')));
    const missing = Object.keys(require('react-native')).filter(key => !listed.has(key));

    expect(missing).toEqual([]);
  });

  it('entrega o AssetRegistry de verdade', () => {
    const { AssetRegistry } = require('react-native-css/components');

    expect(typeof AssetRegistry?.getAssetByID).toBe('function');
  });
});
