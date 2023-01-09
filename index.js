const { connect } = require('mongoose')
const axios = require('axios').default
const { Telegraf } = require('telegraf')
const Config = require('./Models/Config')
const Users = require('./Models/Users')
const Groups = require('./Models/Groups')

connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('MongoDB Connected')
})

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN)

bot.start(async (ctx) => {
  const chat = ctx.message.chat
  if (chat.type === 'private') {
    await Users.findOneAndUpdate(
      { TelegramID: chat.id },
      { TelegramID: chat.id },
      {
        upsert: true,
      }
    )
    ctx.reply(
      'Привет \\!\nТеперь я буду каждый день в 12:00 по МСК отправлять тебе _Астрономическое Изобрежение Дня_ от NASA\nЧтобы получить изображение сейчас отправь команду /picture\n\nЧтобы отписаться от рассылки отправь команду /unsubscribe',
      { parse_mode: 'MarkdownV2' }
    )
  } else {
    await Groups.findOneAndUpdate(
      { TelegramID: chat.id },
      { TelegramID: chat.id },
      {
        upsert: true,
      }
    )
    ctx.reply(
      'Привет \\!\nТеперь я буду каждый день в 12:00 по МСК отправлять сюда _Астрономическое Изобрежение Дня_ от NASA\nЧтобы получить изображение сейчас отправьте команду /picture\n\nЧтобы отписаться от рассылки отправьте команду /unsubscribe',
      { parse_mode: 'MarkdownV2' }
    )
  }
})

bot.command('picture', async (ctx) => {
  const msg = await ctx.reply('Загрузка..')

  let picture = (await Config.findOne({ _id: 0 })) || {}

  if (!Object.keys(picture).length) {
    picture = await axios.get(
      `https://api.nasa.gov/planetary/apod?api_key=${process.env.NASA_API_TOKEN}`
    )

    await Config.findOneAndUpdate(
      { _id: 0 },
      { picture: { url, hdurl, title }, LastCheck: UnixNoon },
      { upsert: true }
    )
  }

  const { url, hdurl, title } = picture

  ctx
    .replyWithPhoto(
      { url },
      {
        caption: `*Заголовок:* ${
          title.replaceAll('.', '\\.') || '_ошибка_'
        }\n\n*[Открыть](${url}) \\| [HD](${hdurl})*`,
        parse_mode: 'MarkdownV2',
      }
    )
    .then(async () => {
      ctx.deleteMessage(msg.message_id)
    })
})

bot.command('unsubscribe', async (ctx) => {
  if (ctx.message.chat.type === 'private') {
    await Users.findOneAndUpdate(
      { TelegramID: ctx.message.chat.id },
      { $unset: { TelegramID: '' } }
    )

    ctx.reply(
      '*Готово \\!* Больше я не буду отправлять тебе _Астрономические Изображения Дня_',
      { parse_mode: 'MarkdownV2' }
    )
  } else {
    await Groups.findOneAndUpdate(
      { TelegramID: ctx.message.chat.id },
      { $unset: { TelegramID: '' } }
    )

    ctx.reply(
      '*Готово \\!* Больше я не буду отправлять сюда _Астрономические Изображения Дня_',
      { parse_mode: 'MarkdownV2' }
    )
  }
})

bot.command('subscribe', async (ctx) => {
  if (ctx.message.chat.type === 'private') {
    await Users.findOneAndUpdate(
      { TelegramID: ctx.message.chat.id },
      { TelegramID: ctx.message.chat.id },
      { upsert: true }
    )
    ctx.reply(
      '*Готово \\!* Теперь буду отправлять тебе _Астрономические Изображения Дня_',
      { parse_mode: 'MarkdownV2' }
    )
  } else {
    await Groups.findOneAndUpdate(
      { TelegramID: ctx.message.chat.id },
      { TelegramID: ctx.message.chat.id },
      { upsert: true }
    )
    ctx.reply(
      '*Готово \\!* Теперь я буду отправлять сюда _Астрономические Изображения Дня_',
      { parse_mode: 'MarkdownV2' }
    )
  }
})

bot.launch().then(() => console.log('Telegram Bot Started'))

setInterval(async () => {
  const LastCheck = (await Config.findOne({ _id: 0 }))?.LastCheck || 0

  const UnixNow = Math.floor(new Date().getTime())

  if (!(UnixNow - (LastCheck + 86400000) >= 0)) return

  const DateNoon = new Date(new Date().setUTCHours(9, 0, 0, 0))
  const UnixNoon = Math.floor(DateNoon.getTime())

  const { url, hdurl, title } = await axios.get(
    `https://api.nasa.gov/planetary/apod?api_key=${process.env.NASA_API_TOKEN}`
  )

  await Config.findOneAndUpdate(
    { _id: 0 },
    { picture: { url, hdurl, title }, LastCheck: UnixNoon },
    { upsert: true }
  )

  const users = await Users.find()
  const groups = await Groups.find()

  users.forEach(async (user) => {
    bot.telegram
      .sendPhoto(
        user.TelegramID,
        { url },
        {
          caption: `*Заголовок:* ${
            title.replaceAll('.', '\\.') || '_ошибка_'
          }\n\n*[Открыть](${url}) \\| [HD](${hdurl})*`,
          parse_mode: 'MarkdownV2',
        }
      )
      .catch(async () => {
        await Users.findOneAndRemove({ _id: user.TelegramID })
      })
  })

  groups.forEach(async (group) => {
    bot.telegram
      .sendPhoto(
        group.TelegramID,
        { url },
        {
          caption: `*Заголовок:* ${
            title.replaceAll('.', '\\.') || '_ошибка_'
          }\n\n*[Открыть](${url}) \\| [HD](${hdurl})*`,
          parse_mode: 'MarkdownV2',
        }
      )
      .catch(async () => {
        await Groups.findOneAndRemove({ _id: group.TelegramID })
      })
  })
}, 6000)

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
