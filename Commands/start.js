const Subsribers = require('../Schemas/Subsribers')

module.exports = async (msg, bot, id) => {
  let options = {
    reply_to_message_id: msg.message_id,
    reply_markup: {
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

  const data = await Subsribers.findOne({ id: msg.chat.id })

  if (data) {
    options.reply_markup.inline_keyboard[0] = [{
      text: '❌ Отписаться',
      callback_data: `Unsubscribe`,
    }]
  }

  const text =
    `👋 Привет! Я могу отправлять [🪐 Астрономические Изображения Дня](https://apod.nasa.gov) от Nasa.\n Ты можешь использовать команду /pricture или подписаться на рассылку каждый день в 12:00 по МСК, используя кнопку ниже ⬇️`
      .replaceAll('!', '\\!')
      .replaceAll('.', '\\.')

  await bot.sendMessage(id, text, options)
}
