function sendTelegramNotification(message) {
  if (!CONFIG.TELEGRAM_BOT_TOKEN || !CONFIG.TELEGRAM_CHAT_ID) return;

  const url = 'https://api.telegram.org/bot' + CONFIG.TELEGRAM_BOT_TOKEN + '/sendMessage';
  const payload = {
    'chat_id': CONFIG.TELEGRAM_CHAT_ID,
    'text': message,
    'parse_mode': 'HTML'
  };

  const options = {
    'method': 'post',
    'contentType': 'application/json',
    'payload': JSON.stringify(payload),
    'muteHttpExceptions': true
  };

  UrlFetchApp.fetch(url, options);
}

function notifyNewOrder(orderId, amount) {
  const message = '🛍 <b>New Order!</b>\n' +
                  'ID: ' + orderId + '\n' +
                  'Amount: ' + amount + ' UZS';
  sendTelegramNotification(message);
}
