import { EMPTY_ENTITLEMENTS } from '@core/domain/entitlements';
import type { EntitlementsStateDTO } from '@core/dto/entitlement.dto';
import type { EntitlementsRepository } from '@core/repositories/entitlements.repository';
import { preferencesStorage } from '@infra/data/local/storage/preferences.storage';

const ENTITLEMENTS_KEY = 'entitlements';

const isState = (value: unknown): value is EntitlementsStateDTO =>
  Boolean(
    value &&
      typeof value === 'object' &&
      'isPro' in value &&
      'unlocks' in value &&
      Array.isArray(value.unlocks)
  );

export class EntitlementsLocalRepository implements EntitlementsRepository {
  async load(): Promise<EntitlementsStateDTO> {
    const stored = await preferencesStorage.getJSON<unknown>(ENTITLEMENTS_KEY);
    return isState(stored) ? stored : EMPTY_ENTITLEMENTS;
  }

  async save(state: EntitlementsStateDTO): Promise<void> {
    await preferencesStorage.setJSON(ENTITLEMENTS_KEY, state);
  }
}
