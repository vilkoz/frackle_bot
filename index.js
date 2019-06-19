const express = require('express')
const path = require('path')
const TelegramBot = require('node-telegram-bot-api')

const TOKEN = process.env.TOKEN
const server = express()
const bot = new TelegramBot(TOKEN, { polling: true })

const port = process.env.PORT || 5000
const gameName = 'frakle'

const queries = {}

bot.onText(/help/, msg => bot.sendMessage(
  msg.from.id,
  'This bot implements Frakle dice game. Say /game to play!'
))

bot.onText(/start|game/, msg => bot.sendGame(msg.from.id, gameName))

bot.on('callback_query', (query) => {
  if (query.game_short_name !== gameName) {
    bot.answerCallbackQuery(query.id, `Sorry ${query.game_short_name} is not available`)
  } else {
    queries[query.id] = query
    const gameUrl = `https://frakle-bot.herokuapp.com/index.html?id=${query.id}`
    bot.answerCallbackQuery({
      callback_query_id: query.id,
      url: gameUrl,
    })
  }
})

bot.on('inline_query', (iq) => {
  bot.answerInlineQuery(iq.id, [{ type: 'game', id: '0', game_short_name: gameName }])
})

server.use(express.static(path.join(__dirname, 'build')))

server.get('highscore/:score', (req, res, next) => {
  if (!Object.hasOwnProperty.call(queries, req.query.id)) {
    return next();
  }
  const query = queries[req.query.id]
  let options

  if (query.message) {
    options = {
      chat_id: query.message.chat.id,
      message_id: query.message.message.id,
    }
  } else {
    options = {
      inline_message_id: query.inline_message_id,
    }
  }
  bot.setGameScore(query.from.id, parseInt(req.params.score), options, (err, result) => {})
})

server.listen(port)
