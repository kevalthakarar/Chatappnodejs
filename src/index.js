const path = require('path')
const http = require('http')
const express = require('express')
const sockio = require('socket.io')
const app = express()
const server = http.createServer(app)
const port = process.env.PORT || 3000
const io = sockio(server)
const { generateMessage, generateLocationMessage } = require('./utils/messages')
const publicpath = path.join(__dirname, '../public')
app.use(express.static(publicpath))
const { addUser, removeuser, getuser, getUserinroom } = require('./utils/users')


io.on('connection', (socket) => {
    console.log('new server side io')
    socket.on('join', ({ username, room }, callback) => {
        const { error, user } = addUser({ id: socket.id, username, room })
        if (error) {
            return callback(error)
        }
        socket.join(user.room)
        socket.emit('message', generateMessage('Admin ', 'Welcome! ' + user.username))
        socket.broadcast.to(user.room).emit('message', generateMessage('Admin ', user.username + ' has joined'))
        io.to(user.room).emit('roomdata', {
            room: user.room,
            users: getUserinroom(user.room)
        })
        callback()

    })

    socket.on('sendMessage', (msg, callback) => {
        const user = getuser(socket.id)
        io.to(user.room).emit('message', generateMessage(user.username, msg))
        callback('Deleivered!')
    })

    socket.on('sendLocation', (coords, callback) => {
        const mes = 'https://google.com/maps?q=' + coords.latitude + ',' + coords.longitude
        const user = getuser(socket.id)
        io.to(user.room).emit('locationmessage', generateLocationMessage(user.username, mes))
        callback()
    })

    socket.on('disconnect', () => {
        const user = removeuser(socket.id)
        if (user) {
            io.to(user.room).emit('message', generateMessage('Admin ', user.username + ' Left'))
            io.to(user.room).emit('roomdata', {
                room: user.room,
                users: getUserinroom(user.room)
            })
        }

    })
})

server.listen(port, () => {
    console.log('Server started')
})