import z from 'zod';

// Atualizar os dados da empresa.
export const enterpriseUpdateSchema = z
  .object({
    terms_version: z.string().min(1).max(32).optional(),
    terms_accepted_at: z.iso.datetime().optional(),
  })
  .refine(
    (data) =>
      typeof data.terms_version !== 'undefined' ||
      typeof data.terms_accepted_at !== 'undefined',
    { message: 'at_least_one_field' },
  );
