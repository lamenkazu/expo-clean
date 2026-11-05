// Taxonomia comum aos apps. Os eventos registram tipo e frequencia, nunca o conteudo da pessoa
// (textos, notas, dados lidos). Acrescente os eventos de uso do app nesta uniao.
export type AnalyticsEvent =
  | { name: 'app_open' }
  | { name: 'activation'; step: string }
  | { name: 'feature_used'; feature: string }
  | { name: 'rewarded_offered' | 'rewarded_started' | 'rewarded_completed'; placement: string }
  | { name: 'paywall_view'; source: string }
  | { name: 'purchase_started' | 'purchase_completed' | 'purchase_cancelled'; product: string }
  | {
      name: 'permission_requested' | 'permission_granted' | 'permission_denied';
      permission: string;
    }
  | { name: 'review_prompt'; trigger: string }
  // @inject:analytics-events
  | { name: 'feedback_sent'; category: string };

export type AnalyticsEventName = AnalyticsEvent['name'];

export interface AnalyticsService {
  track(event: AnalyticsEvent): void;
  screen(name: string): void;
  setUserProperty(name: string, value: string | null): void;
}
