const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const cors = require('cors')

const app = express()

// cors, controla os acessos de fora do servidor
app.use(cors())

const server = require('http').Server(app)

const io = require('socket.io')(server)
// isola em salas
io.on('connection', socket => {
    socket.on('connectRoom', box => {
        socket.join(box)
    })
})

mongoose.connect('mongodb+srv://omnistack:omnistack@cluster0-aspov.mongodb.net/omnistack?retryWrites=true', {
    useNewUrlParser: true
})

// middleware global, nova variavel dentro de req
app.use((req, res, next) => {
    req.io = io

    return next()
})

app.use(express.json())
app.use(express.urlencoded( {extended: true} ))
app.use('/files', express.static(path.resolve(__dirname, '..', 'tmp')))

// Importando ROTA
app.use(require('./routes'))

// Já consegue enxergar tanto requisições HTTP quanto WebSockets
server.listen(process.env.PORT || 3333)
