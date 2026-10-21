import type { IaAnalyzeEnterpriseContext } from './input.contract';
import type { IaAnalyzeScopeType, IaAnalyzeSentiment } from './scope.contract';

/**
 * Contratos do diagnóstico do escopo: a IA lê os números do escopo num período
 * (calculados no gateway) e uma amostra de comentários, e devolve o que vai bem,
 * o que preocupa, o que mudou e o que fazer. A IA interpreta; não refaz contas.
 */

export interface ScopeDiagnosisInterval {
  lower: number;
  upper: number;
}

/** Precisão do número pelo tamanho da amostra (mesma régua das métricas da tela). */
export type ScopeDiagnosisConfidence = 'insufficient' | 'low' | 'moderate' | 'good';

/** Datas ISO; `start` inclusive e `end` exclusive. `null` nas duas = todo o período. */
export interface ScopeDiagnosisPeriod {
  start: string | null;
  end: string | null;
}

export interface ScopeDiagnosisScope {
  scope_type: IaAnalyzeScopeType;
  catalog_item_id: string | null;
  catalog_item_name: string | null;
}

export interface ScopeDiagnosisCounts {
  total: number;
  with_comment: number;
  analyzed: number;
  pending_analysis: number;
}

export interface ScopeDiagnosisRatings {
  mean: number;
  ci: ScopeDiagnosisInterval;
  distribution: Record<1 | 2 | 3 | 4 | 5, number>;
  /** % de 4–5 estrelas menos % de 1–2, em pontos. */
  net_satisfaction: number;
  /** % de 4–5 estrelas. */
  csat_pct: number;
  confidence: ScopeDiagnosisConfidence;
}

/** O quanto a nota da pergunta anda junto com as estrelas (Spearman). */
export interface ScopeDiagnosisRatingWeight {
  r: number;
  ci: ScopeDiagnosisInterval;
  n: number;
}

export interface ScopeDiagnosisSubquestion {
  subquestion_id: string;
  text: string;
  mean: number;
  count: number;
  confidence: ScopeDiagnosisConfidence;
}

/** Só as perguntas atuais do formulário (as antigas ficam de fora). */
export interface ScopeDiagnosisQuestion {
  question_id: string;
  text: string;
  mean: number;
  ci: ScopeDiagnosisInterval;
  satisfied_pct: number;
  count: number;
  confidence: ScopeDiagnosisConfidence;
  rating_weight: ScopeDiagnosisRatingWeight | null;
  subquestions: ScopeDiagnosisSubquestion[];
}

export interface ScopeDiagnosisAspect {
  aspect: string;
  count: number;
  net_sentiment_score: number;
}

/** Tom dos comentários já analisados pela IA. */
export interface ScopeDiagnosisComments {
  sentiments: Record<IaAnalyzeSentiment, number>;
  net_sentiment_score: number;
  confidence: ScopeDiagnosisConfidence;
  top_aspects: ScopeDiagnosisAspect[];
  /** Deu 4–5 estrelas, mas o comentário é negativo. */
  silent_detractors: number;
  /** Deu 1–2 estrelas, mas o comentário é positivo. */
  rating_misuse: number;
}

export interface ScopeDiagnosisMovementPoint {
  /** Início do intervalo (`AAAA-MM-DD`). */
  start: string;
  count: number;
  mean: number | null;
}

export interface ScopeDiagnosisMovement {
  bucket: 'day' | 'week' | 'month';
  points: ScopeDiagnosisMovementPoint[];
}

/** Dia da semana (0 = domingo) e faixa de 6 horas (0 = madrugada … 3 = noite). */
export interface ScopeDiagnosisPeakCell {
  weekday: number;
  band: number;
  count: number;
  mean: number | null;
}

export interface ScopeDiagnosisCustomers {
  identified: number;
  returning_pct: number | null;
  returning_pct_ci: ScopeDiagnosisInterval | null;
  first_time_mean: number | null;
  returning_mean: number | null;
}

/** Os números de um período. Blocos sem dados vêm `null` (ou lista vazia). */
export interface ScopeDiagnosisMetrics {
  counts: ScopeDiagnosisCounts;
  ratings: ScopeDiagnosisRatings | null;
  questions: ScopeDiagnosisQuestion[];
  comments: ScopeDiagnosisComments | null;
  movement: ScopeDiagnosisMovement | null;
  /** Só as células com avaliações. */
  peak_times: ScopeDiagnosisPeakCell[];
  customers: ScopeDiagnosisCustomers | null;
  /** Quem escreve comentário; `null` sem avaliações. */
  comment_participation: ScopeDiagnosisCommentParticipation | null;
}

/**
 * O comentário é opcional: a taxa diz o quanto o tom dos comentários representa
 * o escopo, e as médias dizem se quem comenta está mais ou menos satisfeito.
 */
export interface ScopeDiagnosisCommentParticipation {
  pct: number;
  with_comment_mean: number | null;
  without_comment_mean: number | null;
}

export type ScopeDiagnosisSampleReason =
  | 'most_negative'
  | 'most_positive'
  | 'silent_detractor'
  | 'rating_misuse'
  | 'aspect';

/** Comentário escolhido pelo gateway, com o texto já cortado no limite. */
export interface ScopeDiagnosisCommentSample {
  id: string;
  message: string;
  rating: number | null;
  sentiment: IaAnalyzeSentiment;
  reason: ScopeDiagnosisSampleReason;
  aspect?: string;
}

export interface ScopeDiagnosisRemoteRequest {
  enterprise_context: IaAnalyzeEnterpriseContext;
  scope: ScopeDiagnosisScope;
  period: ScopeDiagnosisPeriod;
  /** Período anterior de mesmo tamanho; `null` em "todo o período". */
  previous_period: ScopeDiagnosisPeriod | null;
  current: ScopeDiagnosisMetrics;
  /** `null` sem período anterior ou sem avaliações nele. */
  previous: ScopeDiagnosisMetrics | null;
  comment_samples: ScopeDiagnosisCommentSample[];
}

/** Um ponto do diagnóstico, sempre com o número que o sustenta. */
export interface ScopeDiagnosisFinding {
  text: string;
  /** Ex.: "Pergunta 2 caiu de 4,1 para 3,4". */
  evidence: string;
}

export interface ScopeDiagnosisRecommendation {
  /** 1 = maior impacto. */
  priority: number;
  /** `fix` corrige o que preocupa; `keep` mantém o que vai bem. */
  kind: 'fix' | 'keep';
  action: string;
  evidence: string;
}

export interface ScopeDiagnosisResult {
  summary: string;
  going_well: ScopeDiagnosisFinding[];
  concerns: ScopeDiagnosisFinding[];
  /** O que mudou em relação ao período anterior; vazio sem comparação. */
  changes: ScopeDiagnosisFinding[];
  /** De 3 a 5, em ordem de prioridade. */
  recommendations: ScopeDiagnosisRecommendation[];
  /** Onde os dados não bastam para concluir (precisão baixa, poucos comentários). */
  limitations: string[];
}

export type ScopeDiagnosisRemoteResponse = ScopeDiagnosisResult;

/** Resposta do gateway ao pedir um diagnóstico. */
export interface ScopeDiagnosisAccepted {
  jobId: string | null;
  status: string;
  deduped: boolean;
  /** Já existe diagnóstico para o mesmo recorte e os mesmos dados: nada é gerado de novo. */
  cached: boolean;
  diagnosisId: string | null;
}

/** Diagnóstico guardado, como o gateway devolve para a Web. */
export interface ScopeDiagnosis {
  id: string;
  scopeType: IaAnalyzeScopeType;
  catalogItemId: string | null;
  period: ScopeDiagnosisPeriod;
  previousPeriod: ScopeDiagnosisPeriod | null;
  /** Avaliações no período quando foi gerado. */
  feedbackCount: number;
  /** Avaliações que chegaram no período depois de gerado. */
  newFeedbacksSince: number;
  model: string | null;
  createdAt: string;
  result: ScopeDiagnosisResult;
}

export interface ScopeDiagnosisJob {
  id: string;
  jobType: 'generate_scope_diagnosis';
  status: 'queued' | 'running' | 'waiting_budget' | 'completed' | 'failed';
  errorCode: string | null;
  updatedAt: string | null;
  diagnosisId: string | null;
}
