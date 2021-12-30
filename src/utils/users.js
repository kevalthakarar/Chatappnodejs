const users = []

const addUser = ({ id, username, room }) => {
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    if (!username || !room) {
        return {
            error: "Username And room required"
        }
    }

    const existinguser = users.find((user) => {
        return user.room === room && user.username === username
    })

    if (existinguser) {
        return {
            error: "Username Already Taken"
        }
    }

    // store user

    const user = { id, username, room }
    users.push(user)
    return { user }
}

const removeuser = (id) => {
    const index = users.findIndex((user) => user.id == id)
    if (index != -1) {
        return users.splice(index, 1)[0]
    }
}

const getuser = (id) => {
    return users.find((user) => user.id == id)
}

const getUserinroom = (room) => {
    return users.filter((user) => user.room == room)
}



// addUser({
//     id: 10,
//     username: 'keval',
//     room: 'keval'
// })
// addUser({
//     id: 11,
//     username: 'keval',
//     room: 'krisha'
// })
// addUser({
//         id: 12,
//         username: 'keval100',
//         room: 'keval'
//     })
//     //console.log(users)

// // const useri = getuser(101)
// // console.log(useri)

// const usero = getUserinroom('keval')
// console.log(usero)

// // const removeduser = removeuser(10)
// // console.log(removeduser)
// // console.log(users)

module.exports = {
    addUser,
    removeuser,
    getuser,
    getUserinroom
}