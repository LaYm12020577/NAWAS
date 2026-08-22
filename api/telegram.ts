// ===== VERCEL SERVERLESS-ФУНКЦИЯ: /api/telegram =====
// Vercel автоматически превращает файл api/telegram.ts в эндпоинт /api/telegram.
// Токен берётся из переменных окружения проекта Vercel (BOT_TOKEN, CHAT_IDS),
// поэтому в клиентский код он не попадает.
import type { VercelRequest, VercelResponse } from '@vercel/node';

const BOT_TOKEN = process.env.BOT_TOKEN || '';
const CHAT_IDS = (process.env.CHAT_IDS || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

// Валидация и обрезка полей — защита от инъекций разметки и мусора.
const clean = (v: unknown, max = 500) =>
  String(v ?? '')
    .replace(/[*_`\[\]]/g, '') // вырезаем Markdown-разметку
    .slice(0, max)
    .trim();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  if (!BOT_TOKEN || CHAT_IDS.length === 0) {
    return res.status(500).json({ ok: false, error: 'Server is not configured' });
  }

  const { name, phone, email, model, message, calculatedPower, calculatedSections, lang } =
    req.body || {};

  if (!name || !String(name).trim()) {
    return res.status(400).json({ ok: false, error: 'Name is required' });
  }

  const text =
    lang === 'EN'
      ? `📨 *New message from NAWAS website*\n\n👤 *Name:* ${clean(name, 100)}\n📱 *Phone:* ${clean(phone, 30) || 'Not specified'}\n✉️ *Email:* ${clean(email, 120) || 'Not specified'}${model ? `\n🔧 *Model:* ${clean(model, 100)}` : ''}\n🔥 *Estimate:* ${calculatedPower ?? '—'} W / ${calculatedSections ?? '—'} sec.\n💬 *Message:*\n${clean(message) || '—'}\n\n🕐 ${new Date().toLocaleString('en-US')}`
      : `📨 *Новое сообщение с сайта NAWAS*\n\n👤 *Имя:* ${clean(name, 100)}\n📱 *Телефон:* ${clean(phone, 30) || 'Не указан'}\n✉️ *Email:* ${clean(email, 120) || 'Не указан'}${model ? `\n🔧 *Модель:* ${clean(model, 100)}` : ''}\n🔥 *Расчёт:* ${calculatedPower ?? '—'} Вт / ${calculatedSections ?? '—'} секц.\n💬 *Сообщение:*\n${clean(message) || '—'}\n\n🕐 ${new Date().toLocaleString('ru-RU')}`;

  const results = await Promise.allSettled(
    CHAT_IDS.map(async (chatId) => {
      const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'Markdown' }),
      });
      const data = await response.json();
      if (!response.ok || !data.ok) {
        throw new Error(`Chat ${chatId}: ${data.description || 'Unknown error'}`);
      }
      return { chatId, success: true };
    })
  );

  const sent = results.filter((r) => r.status === 'fulfilled').length;
  if (sent === 0) {
    console.error('Ошибки отправки Telegram:', results.filter((r) => r.status === 'rejected'));
    return res.status(502).json({ ok: false, error: 'Failed to send' });
  }

  return res.status(200).json({ ok: true, sent });
}
