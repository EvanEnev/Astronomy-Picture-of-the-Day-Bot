const Subsribers = require('../Schemas/Subsribers')

module.exports = async ({ message }, bot) => {
  await Subsribers.create({ id: message.chat.id })

  const options = {
    chat_id: message.chat.id,
    message_id: message.message_id,
    reply_to_message_id: message.message_id,
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: '❌ Отписаться',
            callback_data: `Unsubscribe`,
          },
        ],
        [
          {
            text: '🪐 Изображение',
            callback_data: `Picture`,
          },
        ],
      ],
    },
    parse_mode: 'MarkdownV2',
  }

  const text =
    `✅ Готово! Теперь я каждый день в 12:00 буду отправлять сюда [🪐 Астрономическое Изображения Дня](https://apod.nasa.gov).`
      .replaceAll('!', '\\!')
      .replaceAll('.', '\\.')

  await bot.editMessageText(text, options)
}
