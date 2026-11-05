import {
  REMOTE_CONFIG_DEFAULTS,
  type RemoteConfigKey,
  type RemoteConfigValue,
} from '@core/domain/remote-config';
import type { RemoteConfigService } from '@core/services/remote-config.service';

// Sem Firebase, o app usa sempre os valores padrao.
export class DefaultsRemoteConfigService implements RemoteConfigService {
  async refresh(): Promise<void> {}

  get<K extends RemoteConfigKey>(key: K): RemoteConfigValue<K> {
    return REMOTE_CONFIG_DEFAULTS[key];
  }
}
