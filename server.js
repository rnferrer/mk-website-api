const express = require('express')
const cors = require('cors');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const auth = require('./middleware/auth')
require('dotenv').config()
require('./db/mongoose')
console.log(process.env.JWT_SECRET)

const Member = require('./models/member')
const Event = require('./models/event');
const User = require('./models/user')
const { ObjectId } = require('mongodb');

const app = express()
const port = process.env.PORT

app.use(express.json())
app.use(cors())

app.get('/', (req,res) => {
  res.send('success')
})


app.post('/login', async(req,res)=>{
  try{
      const user = await User.findByCredentials(req.body.username, req.body.password)
      const token = await user.generateAuthToken()
      if (JSON.stringify(user) === '{}'){
        throw new Error('invalid username or password')
      }
      res.status(200).send(token)
  }
  catch(e){
    res.status(400).send(e)
  }
})

app.post('/logout', auth, async (req,res)=>{
  try {
        req.user.tokens=req.user.tokens.filter((token)=>{
          return token.token !== req.token
        })
        await req.user.save()
        res.send()
  }catch (e){
    res.status(500).send(e)
  }
})

app.get('/verify', auth, async(req,res)=>{
  try{
    res.status(204).send({})
  }
  catch(e){
    res.status(400).send('Please log back in')
  }
})

app.get('/board', (req,res)=>{
  Member.find({}).then((members)=>{
    res.send(members)
  }).catch((e)=>{
    res.status(500).send(e)
  })
})

app.post('/boards', auth, async(req,res)=>{

  const member = new Member(req.body)
  try{
    await member.save()
    res.send('New member receieved')
  } 
  catch(e){
    return res.status(400).send(e)
  }
})

app.delete('/boards', auth, async(req,res)=>{
  console.log(req.body)
  const deleteBoard = await Member.deleteOne({_id: req.body.id})
  res.send(deleteBoard)
})

app.put('/boards', auth, async(req,res)=>{
  const changes = req.body
  for (const key in changes){
    if (changes[key]==='' || changes[key]===NaN){
      delete changes[key];
    }
  }
  const editMember = await Member.updateOne({_id: new ObjectId(req.body.id)}, {$set:changes})
  res.send(editMember)
})

app.get('/events', async(req,res)=>{
  try{
    const events = await Event.find({})
    res.send({events})
  }
  catch (e){
    return res.status(500).send(e)
  }
})

app.post('/events', auth, async(req,res)=>{
  const event = new Event(req.body)

  try{
    await event.save()
    res.send('New event receieved')
  } 
  catch(e){
    return res.status(400).send(e)
  }
})

app.delete('/events', auth, async(req,res)=>{
  const deleteEvent = await Event.deleteOne({_id: req.body.id})
  res.send(deleteEvent)
})

app.put('/events', auth, async(req,res)=>{
  const changes = req.body
  for (const key in changes){
    if (changes[key]==='' || changes[key]===NaN){
      delete changes[key];
    }
  }
  const editEvent = await Event.updateOne({_id: new ObjectId(req.body.id)}, {$set:changes})
  res.send(editEvent)
})

app.get('/edit', async (req,res)=>{
   const events = await Event.find({}).sort({date: 1})
   const members = await Member.find({})
   res.send({events, members})
})

app.listen(port, ()=>{
  console.log('Server is up on port '+ port)
})
