const { Schema, model } = require('mongoose')

const Model = Schema({
  id: Number,
  sent: Boolean,
})

module.exports = model('Config', Model)
