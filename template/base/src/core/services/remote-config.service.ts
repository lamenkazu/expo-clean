import type { RemoteConfigKey, RemoteConfigValue } from '@core/domain/remote-config';

export interface RemoteConfigService {
  // Busca os valores novos. Falhas sao silenciosas: os padroes continuam valendo.
  refresh(): Promise<void>;
  get<K extends RemoteConfigKey>(key: K): RemoteConfigValue<K>;
}
