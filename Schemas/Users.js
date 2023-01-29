const {Schema, model} = require('mongoose')

const Model = Schema({
    TelegramID: String,
})

module.exports = model('Users', Model)
