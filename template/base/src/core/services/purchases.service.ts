import type { ProProductDTO, PurchaseResult } from '@core/dto/entitlement.dto';

// Compra unica do Pro vitalicio. O template traz so uma implementacao falsa; cada app liga a
// loja (Play Billing, RevenueCat ou expo-iap) implementando este contrato.
export interface PurchasesService {
  getProProduct(): Promise<ProProductDTO | null>;
  purchasePro(): Promise<PurchaseResult>;
  // Consulta a loja e diz se a pessoa ja comprou o Pro, para restaurar em outro aparelho.
  isProOwned(): Promise<boolean>;
}
