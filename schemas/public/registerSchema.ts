import z from 'zod';
import { MIN_PASSWORD_LENGTH, PASSWORD_TOO_SHORT_MESSAGE } from './passwordPolicy.js';

const REPEATED_DIGITS_REGEX = /^(\d)\1+$/;

function digitsOnly(value: string) {
  return value.replace(/\D+/g, '');
}

function isValidBrazilPhone(value: string) {
  const digits = digitsOnly(value);

  if (!digits.startsWith('55')) {
    return false;
  }

  const local = digits.slice(2);
  if (local.length !== 10 && local.length !== 11) {
    return false;
  }

  const ddd = local.slice(0, 2);
  const dddNumber = Number(ddd);
  if (dddNumber < 11 || dddNumber > 99) {
    return false;
  }

  const subscriber = local.slice(2);
  if (REPEATED_DIGITS_REGEX.test(subscriber)) {
    return false;
  }

  if (subscriber.length === 9) {
    return subscriber.startsWith('9');
  }

  return ['2', '3', '4', '5'].includes(subscriber[0]);
}

// "Nome do negócio" vale para pessoa física e jurídica. O CPF/CNPJ não é mais
// pedido: o sistema não usa esse dado, e não guardar o que não é necessário é
// regra da LGPD (necessidade).
export const registerSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(2, { message: 'Informe o nome do negócio' })
      .max(160, { message: 'Nome do negócio muito longo' }),
    email: z.email({ error: 'E-mail inválido' }),
    phone: z.string().regex(/^\+55\d{10,11}$/, {
      error: 'Telefone inválido. Use o formato +55DDXXXXXXXXX',
    }).refine(isValidBrazilPhone, {
      message: 'Telefone inválido. Verifique DDD e número informado.',
    }),
    password: z.string().min(MIN_PASSWORD_LENGTH, { error: PASSWORD_TOO_SHORT_MESSAGE }),
    confirmPassword: z.string().min(1, { error: 'Confirme sua senha' }),
    terms: z.boolean().refine((v) => v === true, {
      message: 'É necessário aceitar os termos',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não conferem',
    path: ['confirmPassword'],
  });

export type RegisterSchema = typeof registerSchema;
export type RegisterFormValues = z.input<typeof registerSchema>;
