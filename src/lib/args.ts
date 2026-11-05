import { parseArgs } from 'node:util';

export interface CliOptions {
  projectName?: string;
  displayName?: string;
  androidPackage?: string;
  withSupabase: boolean;
  bare: boolean;
  skipInstall: boolean;
  skipGit: boolean;
  yes: boolean;
  help: boolean;
}

export const USAGE = `Uso: create-eppck-expo <nome-do-app> [opcoes]

Opcoes:
  --display-name <nome>   Nome exibido no aparelho (padrao: derivado da pasta)
  --package <id>          Pacote Android (padrao: com.eppck.<nome>)
  --with-supabase         Inclui client, auth e pasta supabase/
  --bare                  Gera sem a feature de exemplo (notes)
  --skip-install          Nao instala as dependencias
  --skip-git              Nao roda git init
  -y, --yes               Aceita os padroes sem perguntar
  -h, --help              Mostra esta ajuda
`;

export const parseCliArgs = (argv: string[]): CliOptions => {
  const { values, positionals } = parseArgs({
    args: argv,
    allowPositionals: true,
    options: {
      'display-name': { type: 'string' },
      package: { type: 'string' },
      'with-supabase': { type: 'boolean', default: false },
      bare: { type: 'boolean', default: false },
      'skip-install': { type: 'boolean', default: false },
      'skip-git': { type: 'boolean', default: false },
      yes: { type: 'boolean', short: 'y', default: false },
      help: { type: 'boolean', short: 'h', default: false },
    },
  });

  return {
    projectName: positionals[0],
    displayName: values['display-name'],
    androidPackage: values.package,
    withSupabase: values['with-supabase'],
    bare: values.bare,
    skipInstall: values['skip-install'],
    skipGit: values['skip-git'],
    yes: values.yes,
    help: values.help,
  };
};
