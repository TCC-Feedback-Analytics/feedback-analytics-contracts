import z from 'zod';
import { MIN_PASSWORD_LENGTH, PASSWORD_TOO_SHORT_MESSAGE } from '../public/passwordPolicy.js';

export const resetPasswordSchema = z
  .object({
    password: z.string().min(MIN_PASSWORD_LENGTH, PASSWORD_TOO_SHORT_MESSAGE),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  });

  export type ResetPasswordFormValues = z.input<typeof resetPasswordSchema>;
