import {React, useEffect, useState} from 'react';
import './HomePage.css'
import { Link, useNavigate } from 'react-router-dom';



const HomePage = ({socket}) => {
    const [sessions, setSessions] = useState([]);
    const [socketState, setSocketState] = useState(socket)
    const history = useNavigate();
    const [menu, setMenu] = useState(1);

    const joinSession = (e) => {
        const userId = e.target.getAttribute('user').split('#')[1];
        console.log('join session of user#',userId)
        
    }

    const displayMenu = () => {setMenu(menu?0:1);}

    const createSession = (choice) => {
        const time = 10;
        const duration = 1;
        setMenu(1)
        socket.emit('create session',choice, time, duration);
    }


    useEffect(() => {
       return () => { socket.on('sessions state', (sessionList) => {
            let tmp = []
            sessionList.map(session => {
                const id = session.split(':')[1];
                tmp.push(<Link 
                            user={session}
                            key={session} 
                            to={{
                                pathname: "/user:"+id,
                                state: {
                                    sessions: sessions
                                }} }>
                            <div  className='session-div' >
                                <span>{session}</span>
                                </div>
                        </Link>)
            })
            setSessions(tmp);
        })

        socket.on('new session', (id) => {
            history('/'+id, {state: {sessions: sessions}});
        })
        }

    }, []);
    


    return (
        <div className='home-page'>
            <h1>Online Shogi</h1>
            <div className="sessions-div">
                {sessions}
            </div>
            <div className="buttons-div">
                <button className="create-session" onClick={displayMenu}>
                    Create a game
                </button>
            </div>
            <div className="menu-overlay" style={{display: menu?'none':'flex'}}>
                <div className="menu">
                    <button onClick={e => createSession(1)}>play first</button>
                    <button onClick={e => createSession(2)}>play second</button>

                </div>
            </div>
        </div>
    );
}

export default HomePage;
