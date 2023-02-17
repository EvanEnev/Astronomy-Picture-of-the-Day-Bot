const { default: axios } = require('axios')

module.exports = async (msg, bot, id) => {
  let options = {
    reply_to_message_id: msg.message_id,
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

  options.caption = `*📝 ${picture.title}*\n\n[Открыть](${picture.url
    .replaceAll('(', '\\(')
    .replaceAll(')', '\\)')}) | [HD](${picture.hdurl
    .replaceAll('(', '\\(')
    .replaceAll(')', '\\)')})`
    .replaceAll('|', '\\|')
    .replaceAll('-', '\\-')
    .replaceAll('_', '\\_')
    .replaceAll('.', '\\.')

  await bot.sendPhoto(id, picture.url, options)
}
