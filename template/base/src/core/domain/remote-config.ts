// Valores usados enquanto o Remote Config nao responde, ou quando o Firebase nao esta configurado.
// Toda chave lida pelo app precisa ter um padrao aqui.
export const REMOTE_CONFIG_DEFAULTS = {
  paywall_enabled: true,
  rewarded_enabled: true,
  free_items_limit: 50,
} satisfies Record<string, boolean | number | string>;

export type RemoteConfigKey = keyof typeof REMOTE_CONFIG_DEFAULTS;

export type RemoteConfigValue<K extends RemoteConfigKey> = (typeof REMOTE_CONFIG_DEFAULTS)[K];
