import type { IaAnalyzeInsights } from './analysis.contract';
import type { IaAnalyzeEnterpriseContext } from './input.contract';
import type { IaAnalyzeScopeType } from './scope.contract';

/**
 * Contratos da síntese de insights: a análise dos feedbacks sai em lotes, cada
 * um com seus insights parciais. Na síntese o gateway manda ao ia-analyze só
 * esses parciais, nunca os feedbacks crus, e recebe um único resumo com
 * recomendações.
 */

export interface IaInsightsSynthesisRequest {
  enterprise_context: IaAnalyzeEnterpriseContext;
  scope_type: IaAnalyzeScopeType;
  catalog_item_id: string | null;
  catalog_item_name: string | null;
  analyzed_count: number;
  partial_insights: IaAnalyzeInsights[];
}

export interface IaInsightsSynthesisResponse {
  global_insights: IaAnalyzeInsights;
}
