const Subsribers = require('../Schemas/Subsribers')

module.exports = async (msg, bot, id) => {
  let options = {
    reply_to_message_id: msg.message_id,
    reply_markup: {
      // inline_keyboard: [
      //   [
      //     {
      //       text: '✅ Подписаться',
      //       callback_data: `Subscribe`,
      //     },
      //     {
      //       text: '💬 Подписать другой чат',
      //       request_chat: { request_id: 1, chat_is_channel: true },
      //     },
      //   ],
      //   [
      //     {
      //       text: '🪐 Изображение',
      //       callback_data: `Picture`,
      //     },
      //   ],
      // ],
      keyboard: [
        [
          { text: '✅ Подписаться' },
          {
            text: '💬 Подписать другой чат',
            request_chat: { request_id: 1 },
          },
        ],
        [
          { text: '🪐 Изображение' },
          {
            text: '💬 Отправить в другой чат',
            request_user: { request_id: 1 },
          },
        ],
      ],
      resize_keyboard: true,
    },
    parse_mode: 'MarkdownV2',
  }

  const data = await Subsribers.findOne({ id: msg.chat.id })

  // if (data) {
  //   options.reply_markup.inline_keyboard[0][0] = {
  //     text: '❌ Отписаться',
  //     callback_data: `Unsubscribe`,
  //   }
  // }

  const text =
    `Я отправляю [🪐 Астрономические Изображения Дня](https://apod.nasa.gov) от Nasa. Используй кнокпи ниже для управления ⬇️`
      .replaceAll('!', '\\!')
      .replaceAll('.', '\\.')

  await bot.sendMessage(id, text, options)
}
