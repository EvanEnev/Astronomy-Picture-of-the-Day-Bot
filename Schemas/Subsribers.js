const { Schema, model } = require('mongoose')

const Model = Schema({
  id: String,
})

module.exports = model('Subscribers', Model)
