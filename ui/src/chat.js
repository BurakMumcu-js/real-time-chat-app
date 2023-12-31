import React, {useEffect, useState} from "react";
import BasicScrollToBottom, {useScrollToBottom} from "react-scroll-to-bottom";

function Chat({socket, username, room}) {
    const [message, setMessage] = useState('');
    const [messageList, setMessageList] = useState([]);

    const sendMessage = async () => {
        if (message) {
            const messageData = {
                room: room,
                author: username,
                message: message,
                time: new Date(Date.now()).getHours() + ':' + new Date(Date.now()).getMinutes(),
            }
            await socket.emit('send_message', messageData);
            setMessageList((list) => [...list, messageData]);
            setMessage('');
        }
    }

    useEffect(() => {
        socket.on('receive_message', (data) => {
            setMessageList((list) => [...list, data])
        })
    }, [socket])

    return (
        <div className='chat-window'>
            <div className="chat-header">
                <p>Chat is a Life</p>
            </div>
            <div className="chat-body">
                <BasicScrollToBottom className='message-container'>
                    {
                        messageList.map((messageContent) => {
                            return (
                                <div className="message" id={username === messageContent.author ? 'you' : 'other'}>
                                    <div>
                                        <div className='message-content'>
                                            <p>{messageContent.message}</p>
                                        </div>
                                        <div className='message-meta'>
                                            <p id="time">{messageContent.time}</p>
                                            <p id="author">{messageContent.author}</p>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </BasicScrollToBottom>
            </div>
            <div className="chat-footer">
                <input
                    value={message}
                    type="text"
                    placeholder="Hey..."
                    onChange={(event) => {
                        setMessage(event.target.value)
                    }}/>
                <button onClick={sendMessage}>&#9658;</button>
            </div>
        </div>
    )
}

export default Chat