import {
  REMOTE_CONFIG_DEFAULTS,
  type RemoteConfigKey,
  type RemoteConfigValue,
} from '@core/domain/remote-config';
import type { RemoteConfigService } from '@core/services/remote-config.service';
import {
  fetchAndActivate,
  getBoolean,
  getNumber,
  getRemoteConfig,
  getString,
} from '@react-native-firebase/remote-config';

export class FirebaseRemoteConfigService implements RemoteConfigService {
  private readonly remoteConfig = getRemoteConfig();

  constructor() {
    this.remoteConfig.defaultConfig = REMOTE_CONFIG_DEFAULTS;
  }

  async refresh(): Promise<void> {
    try {
      await fetchAndActivate(this.remoteConfig);
    } catch {
      // Sem rede, os ultimos valores ativos (ou os padroes) continuam valendo.
    }
  }

  get<K extends RemoteConfigKey>(key: K): RemoteConfigValue<K> {
    const fallback = REMOTE_CONFIG_DEFAULTS[key];

    if (typeof fallback === 'boolean') {
      return getBoolean(this.remoteConfig, key) as RemoteConfigValue<K>;
    }

    if (typeof fallback === 'number') {
      return getNumber(this.remoteConfig, key) as RemoteConfigValue<K>;
    }

    return getString(this.remoteConfig, key) as unknown as RemoteConfigValue<K>;
  }
}
