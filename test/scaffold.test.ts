import { existsSync } from 'node:fs';
import { mkdir, mkdtemp, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { type ModuleName, scaffold } from '../src/lib/scaffold.js';

const TEMPLATE_DIR = path.resolve(import.meta.dirname, '..', 'template');
const TEXT_EXTENSIONS = new Set(['.ts', '.tsx', '.js', '.json', '.md', '.yaml', '.css', '']);

let root: string;

const generate = async (name: string, modules: ModuleName[]) => {
  const targetDir = path.join(root, name);
  await scaffold({
    templateDir: TEMPLATE_DIR,
    targetDir,
    displayName: 'Meu App',
    slug: name,
    scheme: name.replace(/-/g, ''),
    androidPackage: `com.eppck.${name.replace(/-/g, '')}`,
    modules,
  });
  return targetDir;
};

const read = (dir: string, file: string) => readFile(path.join(dir, file), 'utf8');

const listTextFiles = async (dir: string): Promise<string[]> => {
  const entries = await readdir(dir, { withFileTypes: true, recursive: true });
  return entries
    .filter(entry => entry.isFile() && TEXT_EXTENSIONS.has(path.extname(entry.name)))
    .map(entry => path.join(entry.parentPath, entry.name));
};

beforeAll(async () => {
  root = await mkdtemp(path.join(tmpdir(), 'create-eppck-expo-'));
});

afterAll(async () => {
  await rm(root, { recursive: true, force: true });
});

describe('scaffold', () => {
  it('gera o app padrao com a feature de exemplo', async () => {
    const dir = await generate('app-padrao', ['example']);
    const appJson = JSON.parse(await read(dir, 'app.json'));
    const packageJson = JSON.parse(await read(dir, 'package.json'));

    expect(appJson.expo).toMatchObject({
      name: 'Meu App',
      slug: 'app-padrao',
      scheme: 'apppadrao',
      android: { package: 'com.eppck.apppadrao' },
    });
    expect(packageJson).toMatchObject({ name: 'app-padrao', version: '0.1.0', private: true });
    expect(existsSync(path.join(dir, '.gitignore'))).toBe(true);
    expect(existsSync(path.join(dir, '_gitignore'))).toBe(false);
    expect(existsSync(path.join(dir, 'app/(main)/notes.tsx'))).toBe(true);
    expect(await read(dir, 'src/infra/app/di/dependency-injection.factory.ts')).toContain(
      'getNotesRepository'
    );
  });

  it('nao deixa marcadores nem tokens no app gerado', async () => {
    const dir = await generate('app-limpo', ['example', 'supabase']);
    const files = await listTextFiles(dir);

    for (const file of files) {
      const content = await readFile(file, 'utf8');
      expect(content, file).not.toMatch(/@inject:|__APP_[A-Z]+__|__ANDROID_PACKAGE__/);
    }
  });

  it('gera sem o exemplo com --bare', async () => {
    const dir = await generate('app-bare', []);

    expect(existsSync(path.join(dir, 'src/infra/modules/notes'))).toBe(false);
    expect(await read(dir, 'src/infra/app/navigation/main-tabs.ts')).not.toContain('notes');
    expect(await read(dir, 'src/core/error/error-codes.ts')).not.toContain('NOTES_UNKNOWN');
  });

  it('acrescenta o Supabase com dependencias, variaveis e telas', async () => {
    const dir = await generate('app-supa', ['supabase']);
    const packageJson = JSON.parse(await read(dir, 'package.json'));

    expect(packageJson.dependencies['@supabase/supabase-js']).toBeDefined();
    expect(await read(dir, '.env.example')).toContain('EXPO_PUBLIC_SUPABASE_URL=');
    expect(existsSync(path.join(dir, 'app/(public)/sign-in.tsx'))).toBe(true);
    expect(await read(dir, 'deeplink-redirector/vercel.json')).toContain('appsupa:///sign-in');
    expect(await read(dir, 'src/infra/modules/settings/screens/Settings/view.tsx')).toContain(
      '<AccountSection />'
    );
  });

  it('recusa gerar por cima de outro app', async () => {
    const dir = await generate('app-repetido', []);

    await expect(
      scaffold({
        templateDir: TEMPLATE_DIR,
        targetDir: dir,
        displayName: 'X',
        slug: 'x',
        scheme: 'x',
        androidPackage: 'com.eppck.x',
        modules: [],
      })
    ).rejects.toThrow(/ja tem arquivos do template/);
  });
  it('gera dentro de uma pasta existente sem tocar nos arquivos dela', async () => {
    const dir = path.join(root, 'app-com-briefing');
    await mkdir(path.join(dir, 'docs'), { recursive: true });
    await writeFile(path.join(dir, 'Briefing.docx'), 'briefing');
    await writeFile(path.join(dir, 'docs', 'notas.md'), 'anotacoes');

    await scaffold({
      templateDir: TEMPLATE_DIR,
      targetDir: dir,
      displayName: 'Com Briefing',
      slug: 'app-com-briefing',
      scheme: 'appcombriefing',
      androidPackage: 'com.eppck.appcombriefing',
      modules: ['example'],
    });

    expect(await read(dir, 'Briefing.docx')).toBe('briefing');
    expect(await read(dir, 'docs/notas.md')).toBe('anotacoes');
    expect(existsSync(path.join(dir, 'app.json'))).toBe(true);
  });
});
