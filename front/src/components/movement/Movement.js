const getPlace = (x, y) => { return (9 - y - 1) * 9 + x }

const getPossibilities = (name, x) => {
    if (name == 'pawn') {
        return [x - 9];
    }
}

export default class Movement {
    analyse({board, name, gridX, gridY, x, y}) {

        if (name === 'pawn'){
            if (y === gridY + 1 && x === gridX){
                return 1;
            }
        }
        return 0;
    }

    color({board, name, x, y}) {
        const place = getPlace(x, y);
        const posibilities = getPossibilities(name, place);

        posibilities.map((p) => {
            console.log(p)
            console.log(board.current.children[1].children)
            board.current.children[1].children[p].style.backgroundColor = 'lightGreen'
        })

    }
}

