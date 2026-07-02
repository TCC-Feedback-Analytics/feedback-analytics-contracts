import type { EnterpriseContext } from './enterprise.entity.js';
import type { AuthUser } from './auth-user.entity.js';

/**
 * Agregado com dados da empresa (enriquecidos com campos de auth.users) e do usuário autenticado.
 * Usado em: components/user/pages/profile/header.tsx.
 */
export interface EnterpriseAndUser {
  enterprise: EnterpriseContext;
  user: AuthUser['user'];
}
