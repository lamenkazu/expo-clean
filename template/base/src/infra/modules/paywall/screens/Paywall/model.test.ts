import { toFeatureId } from './model';

describe('paywall model', () => {
  it('aceita so recursos conhecidos', () => {
    expect(toFeatureId('export')).toBe('export');
    expect(toFeatureId(['advanced-tools'])).toBe('advanced-tools');
    expect(toFeatureId('qualquer')).toBeNull();
    expect(toFeatureId(undefined)).toBeNull();
  });
});
