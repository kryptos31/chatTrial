// Client-side code
import React, { useEffect, useState, useContext, useRef } from 'react';
import io from 'socket.io-client';
import './App.css';
import UserContext from './UserContext';

const socket = io('http://localhost:3001');

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const {user, setUser} = useContext(UserContext);
  const divRef = useRef(null);

  const handleInputChange = (event) => {
    setInput(event.target.value);
  };

  useEffect(() => {
    if(user.id == null || user.id == undefined){
      return
    }
    divRef.current.scrollIntoView({ behavior: 'smooth' });
  });

  function handleSubmit(event){
    event.preventDefault();
    if (input) {
      socket.emit('chat_message', user, input);
      console.log(`${user} ${input}`)
      setInput('');
    }
  };

  useEffect(() => {
    socket.on("received_message", (message) => {
      setMessages(messages => [...messages, 
        <div key={message.id}>
          <div className={'mx-2 my-1 p-2 px-3 message-card'}>{message.id}: {message.message}</div>
        </div>])
    })
  }, [])
  

  return (
    <div className="chat-container">
      <div className="message-container mb-3">
        {messages}
        <div ref={divRef} />
      </div>
      <form className="chat-form" onSubmit={e => handleSubmit(e)}>
        <input type="text" value={input} onChange={handleInputChange} />
        <button type="submit">Send</button>
      </form>     
    </div>
  );
  
}
