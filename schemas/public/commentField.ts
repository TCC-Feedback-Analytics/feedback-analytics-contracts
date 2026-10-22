import z from 'zod';

/**
 * Campo de comentário do formulário, configurado por escopo (empresa ou item do
 * catálogo): o convite padrão, uma pergunta própria do escopo ou oculto. O
 * comentário segue opcional para o cliente nos dois primeiros.
 */
export const COMMENT_FIELD_MODES = ['DEFAULT', 'CUSTOM', 'HIDDEN'] as const;
export type CommentFieldMode = (typeof COMMENT_FIELD_MODES)[number];

export const COMMENT_PROMPT_MIN_LENGTH = 10;
export const COMMENT_PROMPT_MAX_LENGTH = 150;
export const DEFAULT_COMMENT_PROMPT = 'Conte-nos mais sobre sua experiência';

export interface CommentFieldSettings {
  mode: CommentFieldMode;
  /** Só no modo `CUSTOM`: a pergunta que aparece no lugar do convite padrão. */
  prompt: string | null;
}

export const DEFAULT_COMMENT_FIELD: CommentFieldSettings = { mode: 'DEFAULT', prompt: null };

/** Texto que o cliente vê acima do campo (`null` com o campo oculto). */
export function commentFieldLabel(field: CommentFieldSettings): string | null {
  if (field.mode === 'HIDDEN') return null;
  if (field.mode === 'CUSTOM' && field.prompt) return field.prompt;
  return DEFAULT_COMMENT_PROMPT;
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Corpo do salvar (o escopo vem junto; o item só fora de COMPANY). */
export const commentFieldSettingsSchema = z
  .object({
    scope_type: z.enum(['COMPANY', 'PRODUCT', 'SERVICE', 'DEPARTMENT']),
    // Mesmo formato aceito nas outras rotas de escopo (o Postgres aceita qualquer uuid em hex).
    catalog_item_id: z.string().regex(UUID_RE).nullable().default(null),
    mode: z.enum(COMMENT_FIELD_MODES),
    prompt: z.string().trim().nullable().default(null),
  })
  .strict()
  .superRefine((value, ctx) => {
    if ((value.scope_type === 'COMPANY') !== (value.catalog_item_id === null)) {
      ctx.addIssue({ code: 'custom', path: ['catalog_item_id'], message: 'Item do catálogo não combina com o escopo' });
    }
    if (value.mode !== 'CUSTOM') return;
    const length = value.prompt?.length ?? 0;
    if (length < COMMENT_PROMPT_MIN_LENGTH || length > COMMENT_PROMPT_MAX_LENGTH) {
      ctx.addIssue({
        code: 'custom',
        path: ['prompt'],
        message: `A pergunta precisa ter de ${COMMENT_PROMPT_MIN_LENGTH} a ${COMMENT_PROMPT_MAX_LENGTH} caracteres`,
      });
    }
  })
  .transform((value) => ({ ...value, prompt: value.mode === 'CUSTOM' ? value.prompt : null }));

export type CommentFieldSettingsInput = z.input<typeof commentFieldSettingsSchema>;
export type CommentFieldSettingsPayload = z.output<typeof commentFieldSettingsSchema>;

/**
 * Como está o campo nos pontos de coleta de um recorte (um tipo inteiro reúne
 * vários itens): oculto em todos, em parte ou em nenhum.
 */
export type CommentFieldHidden = 'all' | 'some' | 'none';

export interface ScopeCommentField {
  hidden: CommentFieldHidden;
  /** A pergunta própria, quando o recorte é um ponto só e ela existe. */
  prompt: string | null;
}

/**
 * Quando vale sugerir mudar o campo de comentário de um escopo: poucos comentam
 * ou os comentários quase não dizem nada ("bom", "ok"). A mesma regra na Web e
 * no diagnóstico da IA.
 */
export type CommentFieldAdvice = 'low_participation' | 'low_content';

export const COMMENT_ADVICE_MIN_FEEDBACKS = 20;
export const COMMENT_ADVICE_LOW_PARTICIPATION_PCT = 15;
export const COMMENT_ADVICE_MIN_COMMENTS = 10;
export const COMMENT_ADVICE_SHORT_PCT = 60;
/** Abaixo disto (em caracteres), o comentário conta como curto. */
export const SHORT_COMMENT_MAX_LENGTH = 20;

export function commentFieldAdvice(
  participation: { total: number; withComment: number; pct: number; shortComments?: number } | null | undefined,
  field: ScopeCommentField | null | undefined,
): CommentFieldAdvice | null {
  if (!participation || field?.hidden === 'all') return null;
  if (participation.total < COMMENT_ADVICE_MIN_FEEDBACKS) return null;
  if (participation.pct < COMMENT_ADVICE_LOW_PARTICIPATION_PCT) return 'low_participation';
  if (participation.withComment >= COMMENT_ADVICE_MIN_COMMENTS && typeof participation.shortComments === 'number') {
    const shortPct = (participation.shortComments / participation.withComment) * 100;
    if (shortPct >= COMMENT_ADVICE_SHORT_PCT) return 'low_content';
  }
  return null;
}
