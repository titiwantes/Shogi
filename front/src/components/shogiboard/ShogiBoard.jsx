import React, { useRef, useState, useEffect } from 'react';
import Movement from '../movement/Movement';
import Opponent from '../opponent/Opponent';
import './ShogiBoard.css';
import pawn from '../../assets/pawn.svg';
import pawnOp from '../../assets/pawn-op.svg';

import bishop from '../../assets/bishop.svg';
import bishopOp from '../../assets/bishop-op.svg';

import lance from '../../assets/lance.svg';
import lanceOp from '../../assets/lance-op.svg';


import silver from '../../assets/silver.svg';
import silverOp from '../../assets/silver-op.svg';


import gold from '../../assets/gold.svg';
import goldOp from '../../assets/gold-op.svg';


import knight from '../../assets/knight.svg';
import knightOp from '../../assets/knight-op.svg';

import king from '../../assets/king.svg';
import kingOp from '../../assets/king-op.svg';

import rook from '../../assets/rook.svg';
import rookOp from '../../assets/rook-op.svg';

import Tile from '../tile/Tile';

const startPlaces = [];

const Y = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
const X = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

for (let i = 0; i< 9; i++){
    startPlaces.push({type: 'sente', piece: pawn, name: 'pawn', y: 2, x: i})
    startPlaces.push({type: 'gote', piece: pawnOp, name: 'pawn', y: 6, x: i})
}
startPlaces.push({type: 'sente', piece: bishop, name: 'bshop', x: 1 , y:1}, {type: 'gote', piece: bishopOp, x: 1 , y:7})
startPlaces.push({type: 'sente', piece: rook, name: 'rook', x: 7 , y:1}, {type: 'gote', piece: rookOp, x: 7 , y:7})
startPlaces.push({type: 'sente', piece: lance, name: 'lance', x: 0 , y:0}, {type: 'gote', piece: rookOp, x: 0 , y: 8})
startPlaces.push({type: 'sente', piece: lance, name: 'lance', x: 8 , y:0}, {type: 'gote', piece: rookOp, x: 8 , y: 8})
startPlaces.push({type: 'sente', piece: knight, name: 'knight', x: 1 , y:0}, {type: 'gote', piece: knightOp, x: 1 , y: 8})
startPlaces.push({type: 'sente', piece: knight, name: 'knight', x: 7 , y:0}, {type: 'gote', piece: knightOp, x: 7 , y: 8})
startPlaces.push({type: 'sente', piece: silver, name: 'silver', x: 6 , y:0}, {type: 'gote', piece: silverOp, x: 6 , y: 8})
startPlaces.push({type: 'sente', piece: silver, name: 'silver', x: 2 , y:0}, {type: 'gote', piece: silverOp, x: 2 , y: 8})
startPlaces.push({type: 'sente', piece: gold, name: 'gold', x: 5 , y:0}, {type: 'gote', piece: goldOp, x: 5 , y: 8})
startPlaces.push({type: 'sente', piece: gold, name: 'gold', x: 3 , y:0}, {type: 'gote', piece: goldOp, x: 3 , y: 8})
startPlaces.push({type: 'sente', piece: king, name: 'king', x: 4 , y:0}, {type: 'gote', piece: kingOp, x: 4 , y: 8})



export default function ShogiBoard({socket, userId, player}) {
    let board = []
    const boardRef = useRef(null)
    const [pieces, setPieces] = useState(startPlaces);
    const [tiles, setTiles] = useState(0)
    const [gridX, setGridX] = useState(0);
    const [gridY, setGridY] = useState(0);
    const [active, setActive] = useState(null);
    const [turn, setTurn] = useState(player == 1 ? 1 : 0);
    const [shogiBoard, setShogiBoard] = useState(boardRef)
    const movement = new Movement;
    const opponent = new Opponent(socket);
    

    useEffect(() => {
        return () =>  {
         socket.on('game', (data) => {
            const newPieces = opponent.play(pieces, data);
            setPieces(newPieces)
            setTurn(1)
         })


        }
     }, []);

    const grab = (e) => {
        const element = e.target;
        if (element.classList.contains('piece') && !element.classList.contains('gote') && boardRef && turn){
            const x = e.clientX - 50;
            const y = e.clientY - 50;
           // movement.color({board: boardRef, x: gridX, y: gridY, name: e.target.getAttribute('name')})

            setGridX(Math.floor((e.clientX - boardRef.current.offsetLeft)/100))
            setGridY(Math.abs(Math.ceil((e.clientY - boardRef.current.offsetTop - 900)/100)))

            element.style.position = 'absolute';
            element.style.left = x
            element.style.top = y
            setActive(element);
        }
    }

    const selectPiece = (e) => {
        return
        const element = e.target;
        if (element.classList.contains('piece')){
            const board = boardRef.current;
            const position = element.getAttribute('num').split(' ').map(e => parseInt(e))
            const type = e.target.getAttribute('type');
            const parent = element.parentElement;

            if (type === 'sente')
                parent.style.backgroundColor = 'lightGreen'
        }
        
    }

    const movePiece = (e) => {
        const element = e.target;
        if (active && boardRef){
            const x = e.clientX - 50;
            const y = e.clientY - 50;
            active.style.position = 'absolute';

            const minX = boardRef.current.offsetLeft - 15;
            const minY = boardRef.current.offsetTop - 10;
            const maxX = boardRef.current.offsetLeft + boardRef.current.clientWidth - 85;
            const maxY = boardRef.current.offsetTop + boardRef.current.clientHeight - 90;


            if (x > minX && x < maxX) active.style.left = `${x}px`
            if (y > minY && y < maxY) active.style.top = `${y}px`

        }
    }

    const dropPiece = (e) => {
        if (active && boardRef) {
            const x = Math.floor((e.clientX - boardRef.current.offsetLeft)/100)
            const y = Math.abs(Math.ceil((e.clientY - boardRef.current.offsetTop - 900)/100))


            setActive(null);
            setPieces(value => {
                const pieces = value.map((piece) => {
                    if (piece.x == gridX && piece.y == gridY) {

                        if (movement.analyse({board: boardRef,gridX: gridX, gridY: gridY, x: parseInt(x), y: parseInt(y), name: e.target.getAttribute('name')})) {
                            if (x == piece.x && y == piece.y){
                                e.target.style.position = 'relative';
                                e.target.style.removeProperty('top');
                                e.target.style.removeProperty('left');
                            } else {
                                opponent.send(userId, piece, x, y);
                                piece.x = x;
                                piece.y = y;
                                setTurn(0);
                            }
                        } else {
                            e.target.style.position = 'relative';
                            e.target.style.removeProperty('top');
                            e.target.style.removeProperty('left');
                        }
                    }
                    return piece;
                })
                return pieces;
            })
            
            
        }
    }

    for (let i = Y.length -1; i>=  0; i--) {
        for (let j = 0; j < X.length ; j++) {

            let param = {piece: null, type: null};
            pieces.forEach(e => {
                if (e.x == j && e.y == i)
                    param = {piece : e.piece, type: e.type, name: e.name} 
            });

            board.push(
            <Tile
                key={X[j]+Y[i]}
                num={X[j]+ ' ' +Y[i]}
                type={param.type}
                pic={param.piece}
                number={i+j}
                name={param.name}
            />)
        }
    }
    return <div 
                onMouseDown={e => grab(e)}
                onMouseUp={e => dropPiece(e)}
                onClick={e => selectPiece(e)}
                onMouseMove={e => {movePiece(e)}}
                ref={boardRef}
            >
                <span>{turn%2!=1 ? 'A vous de jouer' : "A l'adversaire de jouer"}</span>
                <div className="board">{board}</div>

            </div>
}