const { readdirSync, lstatSync } = require('fs')

module.exports = (bot) => {
  readdirSync('./Callbacks').forEach((file) => {
    let pull = require(`../Callbacks/${file}`)
    let name = file.slice(0, -3)

    if (lstatSync(`./Callbacks/${file}`).isDirectory()) {
      readdirSync(`./Callbacks/${file}`)
        .filter((file) => file.endsWith('.js'))
        .forEach((FileInDir) => {
          pull = require(`../Callbacks/${file}/${FileInDir}`)
          name = FileInDir.slice(0, -3)
        })
    }

    bot.on('callback_query', async (query) => {
      const data = query.data.split('-')[0]
      if (data === name) {
        await pull(query, bot)
      }
    })
  })
}
