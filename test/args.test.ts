import { describe, expect, it } from 'vitest';
import { parseCliArgs } from '../src/lib/args.js';

describe('parseCliArgs', () => {
  it('le o nome e as flags', () => {
    const sut = parseCliArgs([
      'meu-app',
      '--with-supabase',
      '--bare',
      '-y',
      '--package',
      'com.x.y',
    ]);

    expect(sut).toMatchObject({
      projectName: 'meu-app',
      withSupabase: true,
      bare: true,
      yes: true,
      androidPackage: 'com.x.y',
      skipInstall: false,
    });
  });

  it('usa os padroes sem flags', () => {
    expect(parseCliArgs(['app'])).toMatchObject({ withSupabase: false, bare: false, help: false });
  });
});
