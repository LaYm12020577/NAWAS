// ===== НАСТРОЙКИ TELEGRAM-БОТА =====
// Токен бота и список ID получателей (админов).
// Сообщения из формы Contact Us отправляются напрямую в бот каждому из CHAT_IDS.
// Чтобы включить/выключить получателя — закомментируйте его ID.
const BOT_TOKEN = '8992520094:AAEz7Id3IcnTm40Gy2uxezXaNuuWAMxLLjo';
const CHAT_IDS = ['962068709', '89375421'];

// Бот считается настроенным, когда токен достаточно длинный и не является placeholder.
const isBotConfigured = () => {
  return (
    !!BOT_TOKEN &&
    BOT_TOKEN.length > 20 &&
    !BOT_TOKEN.includes('ВАШ_') &&
    !BOT_TOKEN.includes('YOUR_')
  );
};

/**
 * Рассылает текстовое сообщение всем администраторам через Telegram Bot API.
 * Сообщения считаются успешно отправленными, если дошёл хотя бы одному реальному админу.
 * Возвращает количество успешных / неудачных / пропущенных отправок.
 */
const sendToAllAdmins = async (text: string) => {
  const results = await Promise.allSettled(
    CHAT_IDS.map(async (chatId) => {
      if (chatId.includes('ВТОРОЙ_') || chatId.includes('ТРЕТИЙ_') || chatId.includes('YOUR_')) {
        return { chatId, skipped: true };
      }

      const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          parse_mode: 'Markdown',
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.ok) {
        throw new Error(`Chat ${chatId}: ${data.description || 'Unknown error'}`);
      }
      return { chatId, success: true };
    })
  );

  const successes = results.filter((r) => r.status === 'fulfilled' && !(r.value as any).skipped);
  const failures = results.filter((r) => r.status === 'rejected');
  const skipped = results.filter((r) => r.status === 'fulfilled' && (r.value as any).skipped);

  console.log('Отправка сообщений Telegram:', {
    успешно: successes.length,
    ошибок: failures.length,
    пропущено: skipped.length,
  });
  if (failures.length > 0) console.error('Ошибки отправки Telegram:', failures);

  if (successes.length === 0 && skipped.length > 0) {
    throw new Error('Добавьте реальные Chat ID в CHAT_IDS');
  }
  if (successes.length === 0) {
    throw new Error('Не удалось отправить ни одному администратору');
  }

  return { sent: successes.length, failed: failures.length, skipped: skipped.length };
};

export interface ContactFormData {
  name: string;
  phone: string;
  email: string;
  model?: string;
  message?: string;
  calculatedPower?: number;
  calculatedSections?: number;
}

/**
 * Формирует сообщение из данных формы и отправляет его в Telegram.
 * @param lang активный язык интерфейса ('RU' | 'EN')
 * @throws если бот не настроен или ни один админ не получил сообщение
 */
export const sendContactToTelegram = async (data: ContactFormData, lang: 'RU' | 'EN') => {
  if (!isBotConfigured()) {
    throw new Error('Telegram bot is not configured');
  }

  const text =
    lang === 'RU'
      ? `📨 *Новое сообщение с сайта NAWAS*

👤 *Имя:* ${data.name}
📱 *Телефон:* ${data.phone || 'Не указан'}
✉️ *Email:* ${data.email || 'Не указан'}${
          data.model ? `\n🔧 *Модель:* ${data.model}` : ''
        }
🔥 *Расчёт:* ${data.calculatedPower ?? '—'} Вт / ${data.calculatedSections ?? '—'} секц.
💬 *Сообщение:*
${data.message || '—'}

🕐 ${new Date().toLocaleString('ru-RU')}`
      : `📨 *New message from NAWAS website*

👤 *Name:* ${data.name}
📱 *Phone:* ${data.phone || 'Not specified'}
✉️ *Email:* ${data.email || 'Not specified'}${
          data.model ? `\n🔧 *Model:* ${data.model}` : ''
        }
🔥 *Estimate:* ${data.calculatedPower ?? '—'} W / ${data.calculatedSections ?? '—'} sec.
💬 *Message:*
${data.message || '—'}

🕐 ${new Date().toLocaleString('en-US')}`;

  return sendToAllAdmins(text);
};
