import { EMPTY_ENTITLEMENTS } from '@core/domain/entitlements';
import type { EntitlementsStateDTO } from '@core/dto/entitlement.dto';
import type { EntitlementsRepository } from '@core/repositories/entitlements.repository';

export class InMemoryEntitlementsRepository implements EntitlementsRepository {
  public state: EntitlementsStateDTO = EMPTY_ENTITLEMENTS;

  async load(): Promise<EntitlementsStateDTO> {
    return this.state;
  }

  async save(state: EntitlementsStateDTO): Promise<void> {
    this.state = state;
  }
}
