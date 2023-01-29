const Subsribers = require('../Schemas/Subsribers')

module.exports = async ({ message }, bot) => {
  await Subsribers.remove({ id: message.chat.id })

  const options = {
    chat_id: message.chat.id,
    message_id: message.message_id,
    reply_markup: {
      reply_to_message_id: message.message_id,
      inline_keyboard: [
        [
          {
            text: '✅ Подписаться',
            callback_data: `Subscribe`,
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
    `✅ Готово! Больше я не буду отправлять сюда [🪐 Астрономическое Изображения Дня](https://apod.nasa.gov).`
      .replaceAll('!', '\\!')
      .replaceAll('.', '\\.')

  await bot.editMessageText(text, options)
}
