import type { EntitlementsStateDTO } from '@core/dto/entitlement.dto';

// Guarda no aparelho o estado do Pro e dos desbloqueios temporarios.
export interface EntitlementsRepository {
  load(): Promise<EntitlementsStateDTO>;
  save(state: EntitlementsStateDTO): Promise<void>;
}
