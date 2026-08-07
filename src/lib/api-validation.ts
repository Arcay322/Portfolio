import { z } from 'zod';

export const MAX_BODY_BYTES = 64 * 1024; // 64KB

export const analyticsErrorSchema = z.object({
  message: z.string().max(2000).optional(),
  error: z.object({
    name: z.string().max(200).optional(),
    message: z.string().max(2000).optional(),
    stack: z.string().max(10000).optional(),
  }).optional(),
  context: z.record(z.unknown()).optional(),
  breadcrumbs: z.array(z.unknown()).max(100).optional(),
  timestamp: z.union([z.number(), z.string()]).optional(),
  userAgent: z.string().max(500).optional(),
  url: z.string().max(2000).optional(),
});

export const analyticsPerformanceSchema = z.object({
  type: z.string().max(100).optional(),
  duration: z.number().max(100000).optional(),
  startTime: z.number().optional(),
  timestamp: z.union([z.number(), z.string()]).optional(),
});

export const analyticsVitalsSchema = z.object({
  name: z.string().max(100),
  value: z.number(),
  rating: z.string().max(50).optional(),
  delta: z.number().optional(),
  id: z.string().max(200).optional(),
  timestamp: z.union([z.number(), z.string()]).optional(),
});

/**
 * Lee y valida el body de una request con límite de tamaño.
 * Devuelve null si el body es demasiado grande o el JSON es inválido.
 */
export async function readValidatedBody<T>(
  request: Request,
  schema: z.ZodType<T>,
  maxBytes: number = MAX_BODY_BYTES
): Promise<{ data: T | null; error: 'too_large' | 'invalid' | null }> {
  const text = await request.text();

  if (text.length > maxBytes) {
    return { data: null, error: 'too_large' };
  }

  if (!text) {
    return { data: null, error: 'invalid' };
  }

  try {
    const json = JSON.parse(text);
    const result = schema.safeParse(json);
    if (!result.success) {
      return { data: null, error: 'invalid' };
    }
    return { data: result.data, error: null };
  } catch {
    return { data: null, error: 'invalid' };
  }
}
