import type { ProProductDTO, PurchaseResult } from '@core/dto/entitlement.dto';
import type { PurchasesService } from '@core/services/purchases.service';
import { preferencesStorage } from '@infra/data/local/storage/preferences.storage';

const OWNED_KEY = 'fake-pro-owned';

// Loja falsa: a compra sempre funciona e fica gravada no aparelho. Troque pela loja real
// implementando PurchasesService e registrando a classe no DI.
export class FakePurchasesService implements PurchasesService {
  async getProProduct(): Promise<ProProductDTO> {
    return { id: 'pro_lifetime', title: 'Pro', priceLabel: 'R$ 19,90' };
  }

  async purchasePro(): Promise<PurchaseResult> {
    await preferencesStorage.set(OWNED_KEY, 'true');
    return 'purchased';
  }

  async isProOwned(): Promise<boolean> {
    return (await preferencesStorage.get(OWNED_KEY)) === 'true';
  }
}
