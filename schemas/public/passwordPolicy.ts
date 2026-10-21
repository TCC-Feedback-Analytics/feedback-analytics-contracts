/**
 * Regra de senha, a mesma no cadastro, na redefinição e na troca de senha, na
 * Web e no gateway. O tamanho é conferido pelo zod; a força (palavras comuns,
 * sequências, repetições) cada serviço mede com o zxcvbn e compara com o mínimo.
 */
export const MIN_PASSWORD_LENGTH = 10;

/**
 * Nota do zxcvbn (0 a 4) a partir da qual a senha é aceita: só a 4 ("Forte").
 * A 3 ainda deixa passar palavra + número + a mesma palavra ("Palavra123palavra");
 * uma frase curta ("sol azul de manha") ou palavras com símbolos chegam à 4.
 */
export const MIN_PASSWORD_SCORE = 4;

export const PASSWORD_TOO_SHORT_MESSAGE = `Senha deve ter ao menos ${MIN_PASSWORD_LENGTH} caracteres`;

export const PASSWORD_TOO_WEAK_MESSAGE =
  'Senha fácil de adivinhar. Use uma frase ou misture palavras que não combinam.';
