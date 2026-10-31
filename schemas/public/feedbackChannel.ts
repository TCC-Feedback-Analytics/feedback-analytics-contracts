/**
 * Canal de coleta: por onde o cliente chegou ao formulário. QR Code, link
 * compartilhado e etiqueta NFC abrem o mesmo endereço; o que muda é a marca
 * `canal` na URL, que o formulário repassa no envio e o gateway grava no feedback.
 * `TEST` é o "Testar o formulário" do Dashboard: conta como feedback, mas não é canal.
 */
export const FEEDBACK_CHANNELS = ['QR', 'LINK', 'NFC', 'TEST'] as const;
export type FeedbackChannel = (typeof FEEDBACK_CHANNELS)[number];

/** Os canais que aparecem nas métricas (o teste do dono fica de fora). */
export type CollectionChannel = Exclude<FeedbackChannel, 'TEST'>;

/** Nome do parâmetro na URL do formulário e o valor de cada canal nele. */
export const CHANNEL_URL_PARAM = 'canal';
export const CHANNEL_URL_VALUES: Record<FeedbackChannel, string> = {
  QR: 'qr',
  LINK: 'link',
  NFC: 'nfc',
  TEST: 'teste',
};

/** Canal a partir do valor da URL (`?canal=nfc`); `null` sem marca ou com valor desconhecido. */
export function channelFromUrlValue(value: string | null | undefined): FeedbackChannel | null {
  const normalized = value?.trim().toLowerCase();
  if (!normalized) return null;
  const match = FEEDBACK_CHANNELS.find((channel) => CHANNEL_URL_VALUES[channel] === normalized);
  return match ?? null;
}

/**
 * Canal a gravar a partir do que veio no envio. A marca vem da URL e pode ser
 * editada pelo cliente, então valor desconhecido (inclusive o antigo `QRCODE`,
 * que todo envio mandava) vira "não identificado" em vez de recusar a resposta.
 */
export function normalizeFeedbackChannel(value: unknown): FeedbackChannel | null {
  if (typeof value !== 'string') return null;
  const upper = value.trim().toUpperCase();
  return (FEEDBACK_CHANNELS as readonly string[]).includes(upper) ? (upper as FeedbackChannel) : null;
}

/** Avaliações e estrelas de um canal; `channel: null` = feedbacks sem a marca de canal. */
export interface ChannelRatingSummary {
  channel: CollectionChannel | null;
  count: number;
  mean: number | null;
  ci: { lower: number; upper: number } | null;
}
