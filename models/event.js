const mongoose = require('mongoose')

const Event = mongoose.model('Event', {
  title:{
    type: String,
    required: true
  },
  location:{
    type: String,
    required: true
  },
  time:{
    type: String,
    required: true
  },
  date:{
    type: String,
    required: true,
    trim: true
  },
  day:{
    type: String,
    required: true,
    trim: true
  },
  quarter:{
    type: String,
    required: true
  }
})

module.exports = Event