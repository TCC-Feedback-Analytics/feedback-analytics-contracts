import type { IaAnalyzeEnterpriseContext } from './input.contract';

export interface CompanyQuestionSuggestion {
  question_order: 1 | 2 | 3;
  question_text: string;
}

export interface CompanyQuestionSuggestionsRemoteRequest {
  enterprise_context: IaAnalyzeEnterpriseContext;
}

export interface CompanyQuestionSuggestionsRemoteResponse {
  questions: [CompanyQuestionSuggestion, CompanyQuestionSuggestion, CompanyQuestionSuggestion];
}

export interface CompanyQuestionSuggestionsAccepted {
  jobId: string;
  status: string;
  deduped: boolean;
  contextHash: string;
}

export interface CompanyQuestionSuggestionsResult extends CompanyQuestionSuggestionsRemoteResponse {
  contextHash: string;
}

export interface CompanyQuestionSuggestionsJob {
  id: string;
  jobType: 'generate_company_questions';
  status: 'queued' | 'running' | 'waiting_budget' | 'completed' | 'failed';
  total: number;
  done: number;
  errorCode: string | null;
  updatedAt: string | null;
  result?: CompanyQuestionSuggestionsResult;
}
