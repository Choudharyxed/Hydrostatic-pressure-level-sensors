var amqp = require('amqplib')
const moment = require('moment')


amqp
  .connect(`amqp://guest:guest@172.18.0.2:5672`)
  .then(function (conn) {
    process.once('SIGINT', function () {
      conn.close()
    })
    return conn.createChannel().then(function (ch) {
      var ok = ch.assertQueue('iot/logs', { durable: false })

      ok = ok.then(function (_qok) {
        return ch.consume(
          'iot/logs',
          function (msg) {
            console.log(' - ' + moment().calendar() + ' --- ' + msg.content.toString())
          },
          { noAck: true }
        )
      })

      return ok.then(function (_consumeOk) {
        console.log(' *** Logger started! Waiting for messages... ***\n')
      })
    })
  })
  .catch(console.warn)
