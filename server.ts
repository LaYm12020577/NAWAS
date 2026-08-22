// ===== СЕРВЕР-ПРОКСИ ДЛЯ TELEGRAM =====
// Браузер НЕ знает токен бота — он вызывает этот сервер,
// а сервер уже обращается к Telegram Bot API с токеном из .env.
// Это закрывает утечку токена и защищает от спама/рекламы от третьих лиц.
import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const BOT_TOKEN = process.env.BOT_TOKEN || '';
const CHAT_IDS = (process.env.CHAT_IDS || '').split(',').map((s) => s.trim()).filter(Boolean);

// Простой in-memory rate limit: не более 5 заявок с одного IP за 10 минут.
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 10 * 60 * 1000;
const hits = new Map<string, number[]>();

const rateLimited = (ip: string) => {
  const now = Date.now();
  const list = (hits.get(ip) || []).filter((t) => now - t < RATE_WINDOW_MS);
  if (list.length >= RATE_LIMIT) {
    hits.set(ip, list);
    return true;
  }
  list.push(now);
  hits.set(ip, list);
  return false;
};

const app = express();
app.use(express.json({ limit: '10kb' }));

// Раздаём собранный фронтенд (папка dist), если она есть.
app.use(express.static(path.join(__dirname, 'dist')));

app.post('/api/telegram', async (req, res) => {
  if (!BOT_TOKEN || CHAT_IDS.length === 0) {
    return res.status(500).json({ ok: false, error: 'Server is not configured' });
  }

  const ip = req.ip || 'unknown';
  if (rateLimited(ip)) {
    return res.status(429).json({ ok: false, error: 'Too many requests' });
  }

  // Валидация и обрезка полей — защита от инъекций разметки и мусора.
  const clean = (v: unknown, max = 500) =>
    String(v ?? '')
      .replace(/[*_`\[\]]/g, '') // вырезаем Markdown-разметку
      .slice(0, max)
      .trim();

  const { name, phone, email, model, message, calculatedPower, calculatedSections, lang } = req.body || {};

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

  res.json({ ok: true, sent });
});

const PORT = Number(process.env.PORT || 3001);
app.listen(PORT, () => {
  console.log(`NAWAS server listening on http://localhost:${PORT}`);
});
