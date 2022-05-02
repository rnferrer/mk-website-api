const mongoose = require('mongoose')

const BoardMember = mongoose.model('Board', {
  name:{
    type: String,
    required: true,
    trim: true
  },
  position:{
    type: String,
    required: true,
    trim: true
  },
  pronouns:{
    type: String,
    required: true,
    trim: true
  },
  year:{
    type: String,
    required: true
  },
  major:{
    type: String,
    required: true
  },
  bio:{
    type: String,
    required: true
  },
  instagram:{
    type: String,
  },
  facebook:{
    type: String,
  },
  email:{
    type: String,
  }
})

module.exports = BoardMember