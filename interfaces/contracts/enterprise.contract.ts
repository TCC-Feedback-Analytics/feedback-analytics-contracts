import type { FeedbackQuestionPublic } from './qrcode/question.contract';
import type { CommentFieldSettings } from '../../schemas/public/commentField';

/**
 * Resposta mínima de empresa usada na validação de QR Code.
 * Usado em: src/services/serviceEnterprise.ts.
 */
export interface EnterpriseContractResponse {
  id: string;
  name: string;
  collection_point_id?: string | null;
  catalog_item_id?: string | null;
  item_name?: string | null;
  item_kind?: 'PRODUCT' | 'SERVICE' | 'DEPARTMENT' | null;
  questions?: FeedbackQuestionPublic[];
  /** Campo de comentário do escopo; ausente em gateways antigos (= convite padrão). */
  comment?: CommentFieldSettings;
}

/**
 * Resposta de erro ao consultar empresa.
 * Usado em: contratos de erro do fluxo em src/services/serviceEnterprise.ts.
 */
export interface EnterpriseContractErrorResponse {
  error: string;
}