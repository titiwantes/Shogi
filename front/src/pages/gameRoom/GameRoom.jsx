import {React, useEffect, useState} from 'react';
import './GameRoom.css'
import { useLocation, useParams } from 'react-router-dom';
import ShogiBoard from '../../components/shogiboard/ShogiBoard';

const GameRoom = ({socket}) => {
    const params = useParams();
    let [status, setStatus] = useState('...');
    const userId = params.userId.length > 5 ? params.userId.split(':')[1] :  params.userId
    const [player, setPlayer] = useState(params.userId.length > 5 ? 2 : 1);
    const [start, setStart] = useState(0);
    const [order, setOrder] = useState(null);
    
    
    useEffect(() => {
        return () =>  {
            socket.on('join session', (res) => {
                setStatus(res)
            })

            socket.on('game start', (res) => {
                if (player == 1) {
                    setOrder(res)
                } else {setOrder(res == 1 ? 2 : 1);}
                setStart(1)
            })

            if (player == 2) {socket.emit('join session', params.userId.split(':')[1])}
            else {socket.emit('join session', params.userId);}     
        }        
    }, []);

    return (
        <div className='game-room'>
            {order && <ShogiBoard socket={socket} player={order} userId={userId} />}
            {start == 0 && <div className="waiting-overlay">
                    <div className="waiting">Waiting</div>
                </div>}
        </div>
    );
}

export default GameRoom;
