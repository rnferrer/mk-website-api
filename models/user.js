const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
  username:{
    type: String,
    required: true
  },
  password:{
    type: String,
    required: true
  },
  tokens:[{
    token:{
      type: String
    }
  }]
})

userSchema.methods.generateAuthToken = async function(){
  const user = this
  const token = jwt.sign({_id: user._id.toString()}, process.env.JWT_SECRET)
  user.tokens.push({token})
  await user.save()

  return token
}

userSchema.statics.findByCredentials = async (username, password) =>{
  const user = await User.findOne({username})

  if (!user){
    throw new Error('Unable to login')
  }

  const isMatch = await bcrypt.compare(password, user.password)

  if(!isMatch){
    throw new Error('Unable to login')
  }

  return user
}

const User = mongoose.model ('User', userSchema)

module.exports = User