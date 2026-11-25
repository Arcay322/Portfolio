import { onRequest } from 'firebase-functions/v2/https';
import { defineSecret } from 'firebase-functions/params';
import { checkRateLimit, generateChatReply } from './chat-core.mjs';

const deepseekApiKey = defineSecret('DEEPSEEK_API_KEY');

export const chat = onRequest(
  {
    region: 'us-central1',
    timeoutSeconds: 30,
    memory: '256MiB',
    maxInstances: 10,
    secrets: [deepseekApiKey],
  },
  async (req, res) => {
    if (req.method !== 'POST') {
      res.set('Allow', 'POST');
      res.status(405).json({ error: 'Method not allowed' });
      return;
    }

    const clientIp =
      req.headers['x-forwarded-for']?.toString().split(',')[0]?.trim() || req.ip || 'unknown';
    const limit = checkRateLimit(clientIp);
    if (!limit.allowed) {
      res.set('Retry-After', String(limit.retryAfterSec));
      res.status(429).json({ error: 'Too many requests. Please wait a moment.' });
      return;
    }

    const body = req.body && typeof req.body === 'object' ? req.body : {};
    const result = await generateChatReply({
      messages: body.messages,
      locale: body.locale === 'en' ? 'en' : 'es',
      apiKey: deepseekApiKey.value() || process.env.DEEPSEEK_API_KEY || '',
      model: process.env.DEEPSEEK_MODEL || 'deepseek-chat',
    });

    res.set('Cache-Control', 'no-store');
    res.status(result.status).json(result.body);
  }
);
