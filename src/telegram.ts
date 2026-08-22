// ===== ОТПРАВКА СООБЩЕНИЙ В TELEGRAM (через сервер-прокси) =====
// Токен бота больше НЕ хранится в клиентском коде: браузер обращается
// к /api/telegram на нашем сервере, а сервер отправляет сообщение в бот.
// Это защищает токен от кражи и бота от спама со стороны третьих лиц.

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
 * Отправляет данные формы на сервер, который пересылает их в Telegram-бот.
 * @param lang активный язык интерфейса ('RU' | 'EN')
 * @throws если сервер недоступен или отклонил запрос
 */
export const sendContactToTelegram = async (data: ContactFormData, lang: 'RU' | 'EN') => {
  const response = await fetch('/api/telegram', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...data, lang }),
  });

  const result = await response.json().catch(() => ({ ok: false }));

  if (!response.ok || !result.ok) {
    throw new Error(result.error || 'Не удалось отправить сообщение');
  }

  return result as { ok: true; sent: number };
};
