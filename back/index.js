const socketIo = require('socket.io');
const randomize = require('randomatic');

const port = 3333;
const io = new socketIo.Server({
    cors: {origin: '*'}
});

const sessions = [];

io.on('connect_error',() => {
    console.log('connection error');
} )

const  sessionsList = () => {
    let waintingSessions = [];
    sessions.map((session) => {
        if (session.status < 2)
            waintingSessions.push(session.user);
    })
    return waintingSessions
}

io.on('connection', (socket) => {
    console.log('a user is connected', socket);
    io.emit('sessions state', sessionsList())

    socket.on('create session', (choice, time, duration) => {
        const id = randomize('A0', 5);
        sessions.push({user:`user:${id}`, status:0, choice: choice, time: time, duration: duration})
        socket.join(id);
        socket.emit('new session', id);
        io.to(id).emit('game start', choice);
        io.emit('sessions state', sessionsList())
    })

    socket.on('join session', (userId) => {
        sessions.map((session) => {
            if (session.user.split(':')[1] == userId) {
                if (session.status < 2){
                    session.status += 1;
                    socket.emit('join session', 'OK');
                    
                    socket.join(userId);
                    if (session.status == 2)
                        io.to(userId).emit('game start', session.choice);
                    io.emit('sessions state', sessionsList())
                } else {
                    socket.emit('join session', 'KO');
                }
            }
        })
    } )
                    
    socket.on('move', (userId, piece, x, y) => {
        socket.to(userId).emit('game', {piece, x, y});
    })
    


    socket.on('disconnect', () => {
        console.log('a user disconnected');
    })
})

io.listen(port, () => {
    console.log('Server running on port ', port)
});

