import z from 'zod';

// Schema base genérico para todos os canais de feedback
export const feedbackBaseSchema = z.object({
  enterprise_id: z.uuidv4(),
  rating: z.number().int().min(1).max(5),
  // Comentário opcional: o cliente pode só dar as estrelas e responder às perguntas.
  message: z.string().trim().max(5000).default(''),
  // Contagem variável: cada escopo (empresa/produto/serviço/departamento) pode
  // ter de 0 a 3 perguntas ativas configuradas. O controller valida que as
  // respostas batem exatamente com as perguntas ativas do contexto.
  answers: z
    .array(
      z.object({
        question_id: z.uuidv4(),
        answer_value: z.enum(['PESSIMO', 'RUIM', 'MEDIANA', 'BOA', 'OTIMA']),
      }),
    )
    .min(0)
    .max(3),
  subanswers: z
    .array(
      z.object({
        subquestion_id: z.uuidv4(),
        answer_value: z.enum(['PESSIMO', 'RUIM', 'MEDIANA', 'BOA', 'OTIMA']),
      }),
    )
    .max(9)
    .optional(),

  // opcionais
  customer_name: z.string().min(1).max(120).optional(),
  customer_email: z.email().optional(),
  customer_phone: z.string().max(32).optional(),
  customer_birth_date: z.string().optional(),
  customer_gender: z
    .enum(['masculino', 'feminino', 'outro', 'prefiro_nao_informar'])
    .optional(),
  customer_city: z.string().max(120).optional(),
  customer_state: z.string().max(80).optional(),
  customer_country: z.string().max(80).optional(),
});

// Schema do feedback público enviado pelos canais de coleta (QR Code, Link direto, NFC, Teste)
export const publicFeedbackSchema = feedbackBaseSchema.extend({
  // Canal de coleta (QR, LINK, NFC, TEST). Texto livre de propósito: a marca vem da
  // URL e o gateway normaliza (normalizeFeedbackChannel); valor estranho não recusa a resposta.
  channel: z.string().trim().max(16).optional(),
  collection_point_id: z.uuidv4().optional(),
  catalog_item_id: z.uuidv4().optional(),
});

/** @deprecated Use publicFeedbackSchema */
export const qrcodeFeedbackSchema = publicFeedbackSchema;

// Types exportados
export type FeedbackBasePayload = z.infer<typeof feedbackBaseSchema>;
export type PublicFeedbackPayload = z.infer<typeof publicFeedbackSchema>;
/** @deprecated Use PublicFeedbackPayload */
export type QrcodeFeedbackPayload = PublicFeedbackPayload;
