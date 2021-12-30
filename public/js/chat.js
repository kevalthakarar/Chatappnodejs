const socket = io()

const $messageform = document.querySelector('#message-form')
const $messageforminput = $messageform.querySelector('input')
const $messageformbuttton = $messageform.querySelector('button')
const $sendlocationbuttton = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')
const $messagetemplates = document.querySelector('#message-templa').innerHTML
const $locationmessagetemplates = document.querySelector('#location-message-templa').innerHTML
const $sidebartemplate = document.querySelector('#sidebar-template').innerHTML
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })
console.log(username, room)


socket.on('message', (message) => {
    console.log(message)
    const html = Mustache.render($messagetemplates, {
        username: message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
})

socket.on('locationmessage', (url) => {
    console.log(url)
    const html = Mustache.render($locationmessagetemplates, {
        username: url.username,
        url: url.url,
        createdAt: moment(url.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
})

socket.on('roomdata', ({ room, users }) => {
    const html = Mustache.render($sidebartemplate, {
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML = html
})

$messageform.addEventListener('submit', (e) => {
    e.preventDefault()

    $messageformbuttton.setAttribute('disabled', 'disabled')



    const message = e.target.elements.message.value
    socket.emit('sendMessage', message, (msg) => {
        $messageformbuttton.removeAttribute('disabled')
        $messageforminput.value = ''
        $messageforminput.focus()
        console.log('The Message was delivered', msg)
    })
})

$sendlocationbuttton.addEventListener('click', () => {

    if (!navigator.geolocation) {
        return alert('Browser don\'t support the navigation geolation')
    }

    $sendlocationbuttton.setAttribute('disabled', 'disabed')

    navigator.geolocation.getCurrentPosition((position) => {

        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, () => {
            $sendlocationbuttton.removeAttribute('disabled')
            console.log('Location share')
        })
    })

})

socket.emit('join', { username, room }, (error) => {
    if (error) {
        location.href = '/'
        alert(error)
    }
})


// socket.on('count update', (count) => {
//     console.log('count has been update', count)
// })

// document.querySelector('#increment').addEventListener('click', () => {
//     console.log('Clicked')
//     socket.emit('increment')
// })