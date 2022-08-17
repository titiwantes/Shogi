import './App.css';
import ShogiBoard from './components/shogiboard/ShogiBoard';
import {BrowserRouter as Router, Route, Routes, Navigate} from 'react-router-dom';
import HomePage from './pages/homePage/HomePage';
import GameRoom from './pages/gameRoom/GameRoom';
import io from 'socket.io-client'

const socket = io.connect('http://localhost:3333');

function App() {

  return (
    <Router>
      <Routes>
        <Route exact path='/' element={<HomePage socket={socket}/>}/>
        <Route exact path='/shogi' element={<ShogiBoard/>}/>
        <Route path='/:userId' element={<GameRoom socket={socket}/>}/>
      </Routes>
    </Router>
  )

  return <div className='game'>
    <ShogiBoard/>
  </div>
}

export default App;

