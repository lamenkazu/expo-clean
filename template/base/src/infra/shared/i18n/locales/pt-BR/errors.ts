import type { ErrorCode } from '@core/error/error-codes';

// Toda chave de ERROR_CODES precisa de uma mensagem: o satisfies acusa as que faltam.
export default {
  DATABASE_UNKNOWN: 'Não foi possível acessar os dados salvos no aparelho.',
  STORAGE_UNKNOWN: 'Não foi possível salvar a preferência.',
  ENTITLEMENTS_UNKNOWN: 'Não foi possível verificar o que está liberado.',
  PURCHASE_FAILED: 'A compra não foi concluída. Nenhum valor foi cobrado.',
  ADS_UNAVAILABLE: 'Nenhum anúncio disponível agora. Tente de novo em instantes.',
  // @inject:i18n-errors
  NETWORK_ERROR: 'Sem conexão. Confira a internet e tente de novo.',
  UNKNOWN_ERROR: 'Algo deu errado. Tente de novo.',
} satisfies Record<ErrorCode, string>;
