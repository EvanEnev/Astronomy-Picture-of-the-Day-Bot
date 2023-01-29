const { readdirSync, lstatSync } = require('fs')

module.exports = (bot) => {
  readdirSync('./Commands').forEach((file) => {
    let regexp = new RegExp(`/${file.slice(0, -3)}`)
    let pull = require(`../Commands/${file}`)

    if (lstatSync(`./Commands/${file}`).isDirectory()) {
      readdirSync(`./Commands/${file}`)
        .filter((file) => file.endsWith('.js'))
        .forEach((FileInDir) => {
          pull = require(`../Commands/${file}/${FileInDir}`)

          regexp = new RegExp(`/${file.slice(0, -3)}`)
        })
    }

    bot.onText(regexp, async (msg) => {
      const { id } = msg.chat
      await pull(msg, bot, id)
    })
  })
}
