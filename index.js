const { default: axios } = require('axios')
const { readdirSync } = require('fs')
const { connect, set } = require('mongoose')
const TelegramBot = require('node-telegram-bot-api')
const Subsribers = require('./Schemas/Subsribers')

const bot = new TelegramBot(process.env.token, { polling: true })
console.log("I'm Ready")

set('strictQuery', false)

connect(process.env.mongo, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB Connected'))

readdirSync('./Handlers')
  .filter((file) => file.endsWith('.js'))
  .forEach((HandlerName) => {
    const handler = require(`./Handlers/${HandlerName}`)
    handler(bot)
  })

setInterval(async () => {
  const date = new Date()

  const TimeString = date.toLocaleTimeString('ru-ru', {
    timeZone: 'Europe/Moscow',
  })
  const time = parseInt(TimeString.slice(0, -6))

  if (time === 12 && !bot.sent) {
    const picture = (
      await axios.get(
        `https://api.nasa.gov/planetary/apod?api_key=${process.env.nasa}`
      )
    ).data

    bot.picture = picture

    const options = {
      parse_mode: 'MarkdownV2',
      caption:
        `*📝 ${picture.title}*\n\n[Открыть](${picture.url}) | [HD](${picture.hdurl})`
          .replaceAll('|', '\\|')
          .replaceAll('-', '\\-')
          .replaceAll('_', '\\_'),
    }

    const subscribers = await Subsribers.find()

    subscribers.forEach(async (sub) => {
      const { id } = sub

      await bot.sendPhoto(id, picture.url, options)
    })

    bot.sent = true
  } else if (time !== 12 && bot.sent) {
    bot.sent = false
  }
}, 1 * 60 * 1000)
