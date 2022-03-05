import React, { useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";
import Picker from 'emoji-picker-react';
import add from  "./images/add.svg"
import bold from  "./images/bold.svg"
import italic from  "./images/italic.svg"
import code from  "./images/code.svg"
import send from  "./images/send.svg"
import link from  "./images/link.svg"
import numberList from  "./images/numberList.svg"
import emoji from  "./images/emoji.svg"
import bulletList from  "./images/bulletList.svg"
import terminal from  "./images/terminal.svg"
import quote from  "./images/quote.svg"
import strikethrough from  "./images/strikethrough.svg"
import mention from  "./images/@.svg"
import { LinkPreview } from '@dhaiwat10/react-link-preview';

const Home = () => {
    return <LinkPreview url='https://www.youtube.com/watch?v=dQw4w9WgXcQ' width='400px' />;
  };

function Chat({ socket, username, room }) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [font, setFont] = useState(0);
  const [linkStatus, setLinkStatus] = useState(false);
  const [hyperLink, setHyperLink] = useState("");
  const [emojiF, setEmoji] = useState(false);
  const [count, setCount] = useState(1);
  const [chosenEmoji, setChosenEmoji] = useState(null);

 const handleHyperlink = () => {
     setCurrentMessage("")
     setLinkStatus(!linkStatus)
 }

 const numberListChange = () => {
    setCount(count+1)
    setCurrentMessage(currentMessage+count+" ");
 }

  const onEmojiClick = (event, emojiObject) => {
    setChosenEmoji(emojiObject);
    setCurrentMessage(currentMessage+chosenEmoji.emoji);
  }

  const sendMessage = async () => {

    console.log("hyperLink = ")
    console.log(hyperLink)
    console.log("currentMessage =")
    console.log(currentMessage)
    if (currentMessage !== "" || hyperLink !=="") {
      const messageData = {
        font : font,
        room: room,
        author: username,
        message: (!linkStatus ? currentMessage : hyperLink),
        linkStatus: linkStatus,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };

      await socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage("");
      setHyperLink("")
      setLinkStatus(false)
      setEmoji(false)
    }
  };

  useEffect(() => {
      socket.on("receive_message", (data) => {
          setMessageList((list) => [...list, data]);
        });
    }, [socket]);
    
    return (
    <div className="chat-window">
      <div className="chat-header">
        <p>Live Chat</p>
      </div>
      <ScrollToBottom className="chat-body">
          {messageList.map((messageContent) => {
              return (
                  <div
                  className="message"
                  id={username === messageContent.author ? "you" : "other"}
                  >
                <div>
                  <div 
                   className="message-content"
                   id={messageContent.font==1?"bold":(messageContent.font==2?"italic":"")}
                   >{!messageContent.linkStatus?
                    <p>{messageContent.message}</p>:
                    <p><a href={messageContent.message}>{messageContent.message}</a></p>
                    }
                  </div>
                  <div className="details">
                    <p id="time">{messageContent.time}</p>
                    <p id="author">{messageContent.author}</p>
                  </div>
                </div>
              </div>
            );
        })}
        {emojiF ?
        <div className="picker">
             <Picker onEmojiClick={onEmojiClick}/>
        </div>:""}
        {linkStatus?
        <div className="hyper-link">
           <LinkPreview url={hyperLink} width='400px' />;
        </div>:""}
      </ScrollToBottom>
      <div className="chat-footer">
            <div className="icons">
                <img className="bold" src={bold} onClick={()=>setFont(1)}/>
                <img className="italic" src={italic} onClick={()=>setFont(2)}/>
                <img className="strikethrough" src={strikethrough}/>
                <img className="link" src={link} onClick={handleHyperlink}/>
                <img className="bulletList" src={bulletList} onClick={()=>setCurrentMessage(currentMessage+ `\n`+'\u2022' +" ")}/>
                <img className="numberList" src={numberList} onClick={numberListChange}/>
                <img className="quote" src={quote}/>
                <img className="code" src={code}/>
                <img className="terminal" src={terminal}/>
            </div>
            <img className="emoji" src={emoji} onClick={()=>setEmoji(!emojiF)}/>
            <img className="add" src={add}/>
            <img className="mention" src={mention} onClick={()=>setCurrentMessage(currentMessage+"@")}/>
        {!linkStatus ?
        <input
          id={font==1?"bold":(font==2?"italic":"")}
          className="chatInput"
          type="text"
          value={currentMessage}
          placeholder="Chat comes here..."
          onChange={(event) => {setCurrentMessage(event.target.value);}}
        /> :
        <input
          id={font==1?"bold":(font==2?"italic":"")}
          className="chatInput"
          type="text"
          value={hyperLink}
          placeholder="Enter the link here"
          onChange={(event) => {setHyperLink(event.target.value);}}
          />
        }
        <button className="send" onClick={sendMessage}><img src={send}/></button>
      </div>
    </div>
  );
}

export default Chat;