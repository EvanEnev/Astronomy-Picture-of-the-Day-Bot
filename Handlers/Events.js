const { readdirSync } = require('fs')

module.exports = (bot) => {
  readdirSync('./Events')
    .filter((file) => file.endsWith('.js'))
    .forEach((file) => {
      let pull = require(`../Events/${file}`)
      let name = file.slice(0, -3)

      bot.on(name, async (query) => await pull(query, bot))
    })
}
