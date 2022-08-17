const getPlace = (x, y) => { return (9 - y - 1) * 9 + x }

export default class Opponent {
    constructor(socket){
        this.socket = socket;
    }

    send(userId, piece, x, y){
        this.socket.emit('move', userId, piece, x, y)
    }

    play(pieces, data) {
        const tab = [8, 7, 6, 5, 4, 3, 2, 1, 0];
        const x = tab[data.x];
        const y = tab[data.y]
        console.log(data, x ,y)
        pieces.map(piece => {
            if (piece.x == tab[data.piece.x] && piece.y == tab[data.piece.y]) {
                piece.x = tab[data.x];
                piece.y = tab[data.y]
            } 
        })

        return pieces;
    }
}