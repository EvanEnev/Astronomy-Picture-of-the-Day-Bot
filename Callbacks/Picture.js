const { default: axios } = require('axios')

module.exports = async ({ message, id }, bot) => {
  let options = {
    reply_to_message_id: message.message_id,
    parse_mode: 'MarkdownV2',
  }

  const picture =
    bot.picture ||
    (
      await axios.get(
        `https://api.nasa.gov/planetary/apod?api_key=${process.env.nasa}`
      )
    ).data

  if (!bot.picture) {
    bot.picture = picture
  }

  options.caption =
    `*📝 ${picture.title}*\n\n[Открыть](${picture.url}) | [HD](${picture.hdurl})`
      .replaceAll('|', '\\|')
      .replaceAll('-', '\\-')
      .replaceAll('_', '\\_')
      .replaceAll('.', '\\.')
      .replaceAll('(', '\\(')
      .replaceAll(')', '\\)')

  await bot.sendPhoto(message.chat.id, picture.url, options)
  await bot.answerCallbackQuery(id)
}
