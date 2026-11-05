import { describe, expect, it } from 'vitest';
import {
  isValidAndroidPackage,
  toAndroidPackage,
  toDisplayName,
  toScheme,
  toSlug,
} from '../src/lib/names.js';

describe('names', () => {
  it('gera o slug sem acentos nem simbolos', () => {
    expect(toSlug('Grow Mate')).toBe('grow-mate');
    expect(toSlug('  Fotografia & Ação ')).toBe('fotografia-acao');
  });

  it('gera scheme e nome exibido a partir do slug', () => {
    expect(toScheme('nfc-studio')).toBe('nfcstudio');
    expect(toDisplayName('photo-kit')).toBe('Photo Kit');
  });

  it('gera um pacote Android valido mesmo com digito no inicio', () => {
    expect(toAndroidPackage('grow-mate')).toBe('com.eppck.growmate');
    expect(toAndroidPackage('3d-viewer')).toBe('com.eppck.app3dviewer');
    expect(isValidAndroidPackage('com.eppck.growmate')).toBe(true);
    expect(isValidAndroidPackage('com.eppck.3d')).toBe(false);
    expect(isValidAndroidPackage('growmate')).toBe(false);
  });
});
