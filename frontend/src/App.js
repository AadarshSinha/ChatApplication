import './App.css';
import io from "socket.io-client";
import { useState } from "react";
import Chat from "./Chat";

const socket = io.connect("http://127.0.0.1:3001");

function App() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);

  const joinRoom = () => {
    if (username !== "" && room !== "") {
      socket.emit("join_room", room);
      setShowChat(true);
    }
  };

  return (
    <div className="App">
      {!showChat ? (
        <div className="JoinContainer">
          <div className='JoinText'>
            <h1>Enter Name and Room ID</h1> 
          </div>
          <input
            className="JoinInput"
            type="text"
            placeholder="    Name"
            onChange={(event) => {
              setUsername(event.target.value);
            }}
          />
          <br/>
          <input
            className="JoinInput"
            type="text"
            placeholder="     Room ID"
            onChange={(event) => {
              setRoom(event.target.value);
            }}
          />
          <br/>
          <button onClick={joinRoom} className="join">Join Room</button>
        </div>
      ) : (
        <Chat socket={socket} username={username} room={room} />
      )}
    </div>
  );
    
}

export default App;
