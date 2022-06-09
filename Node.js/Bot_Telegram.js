const { Telegraf } = require('telegraf')
const amqp = require('amqplib')
const moment = require('moment')
const TOKEN = '5266087181:AAHvMji7nPWSIE-Ga2MzEy8e_VGpgpwZ0Z4';


const bot = new Telegraf(TOKEN, { polling: true});
var chatId = 

connectAndWait()


bot.start((ctx) => {
  chatId = ctx.update.message.chat.id
  ctx
    .reply(`🤖 Hi ${ctx.update.message.chat.first_name}! This is Alert_Bot, your personalized alert bot for your water tank level alert. Nice to meet you!\n\nI’ll warn you when the water level is too low.`)
    .then(() => {
      ctx.reply(`⚠️ Don't stop this bot if you want to keep track of water level in the tank.\n`)
    })
})


bot.action('water', (ctx) => {
  sendMessage('Water level low. I have started the water pump to fill the tank')
  ctx.deleteMessage()
  var str = '🤖 Don’t worry: I’ll take care of it.\n\nDate: ' + moment().format('MMMM Do YYYY, h:mm:ss a')

  ctx.reply(str)
})


bot.action('call_someone', (ctx) => {
  sendMessage('I’m warning someone to turn on the water pump.')
  ctx.deleteMessage()
  var str = "🔊 🔔 Don't worry: I have generated the alert so someone can turn on the water pump.\n\nDate: " + moment().format('MMMM Do YYYY, h:mm:ss a')

  ctx.reply(str)
})

bot.action('ignore_alert', (ctx) => {
  sendMessage('Ok, I ignored the alert.')
  ctx.deleteMessage()
  var str = "👌 I have taken no action againt the alert but I will alert you again.\n\nDate: " + moment().format('MMMM Do YYYY, h:mm:ss a')

  ctx.reply(str)
})

bot.launch()


function connectAndWait() {
  amqp
    .connect(`amqp://guest:guest@172.18.0.2:5672`)
    .then(function (conn) {
      return conn.createChannel().then(function (ch) {
        var ok = ch.assertQueue('iot/alerts', { durable: false })

        ok = ok.then(function (_qok) {
          return ch.consume(
            'iot/alerts',
            function (msg) { waitForMessage(msg) },
            { noAck: true }
          )
        })

        return ok.then(function (_consumeOk) {
          console.log(' *** Telegram Bot Started! ***')
        })
      })
    })
    .catch(console.warn)
}


function waitForMessage(msg) {
  console.log('Water Level: ' + msg.content.toString())
 
  const options = {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: 'Turn on water pump',
            callback_data: 'water',
          },
        ],
        [
          {
            text: 'Warn someone to turn on the water pump',
            callback_data: 'call_someone',
          },
        ],
      [
          {
            text: 'Ignore the alert',
            callback_data: 'ignore_alert',
          },
        ],
      ],
    },
  }

  
  bot.telegram.sendMessage(
    chatId,
    `Hey! The water level in the tank is low. Water level is at ${msg.content.toString()}%! 🏜\nWhat do you want to do?`,
    options
  )
}


function sendMessage(msg) {
  var queue = 'iot/logs'
  amqp
    .connect(`amqp://guest:guest@172.18.0.2:5672`)
    .then(function (conn) {
      return conn
        .createChannel()
        .then(function (channel) {
          var ok = channel.assertQueue(queue, { durable: false })
          return ok.then(function (_qok) {
            channel.sendToQueue(queue, Buffer.from(msg))
            console.log('- ' + msg + '\n')
            return channel.close()
          })
        })
        .finally(function () {
          conn.close()
        })
    })
    .catch(console.warn)
}
