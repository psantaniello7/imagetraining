// Require the framework and instantiate it
// const fastify = require('fastify')()
const fs = require('fs')
const path = require('path')
const fastify = require('fastify')({
  https: {
    key: fs.readFileSync(path.join(__dirname, 'https', 'key.pem')),
    cert: fs.readFileSync(path.join(__dirname, 'https', 'cert.pem'))
  }
})

const port = process.env.PORT || 3000

fastify.register(require('fastify-static'), {
    root: path.join(__dirname, ''),
    prefix: '/',
})

fastify.get('/', function (req, reply) {
    reply.sendFile('index.html')
})

// Declare a route
fastify.get('/index', async (request, reply) => {
  return { index: 'world'}
})

// Run the server!
const start = async () => {
  try {
    await fastify.listen(port, '0.0.0.0')
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }

  console.log('Listening on port ' + port)
}
start()
