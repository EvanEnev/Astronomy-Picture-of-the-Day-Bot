const { Schema, model } = require('mongoose');

const Model = Schema({
  _id: Number,
  picture: {
    url: String,
    hdurl: String,
    title: String,
  },
  LastCheck: Number,
});

module.exports = model('Config', Model);
