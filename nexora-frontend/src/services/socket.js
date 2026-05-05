import { useEffect, useState } from "react";
import { connectSocket, sendMessage } from "../services/socket";

function Chat() {

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {

    connectSocket((msg) => {
      setMessages((prev) => [...prev, msg]);
    });

  }, []);

  const handleSend = () => {

    const message = {
      sender: "User1",
      message: text
    };

    sendMessage(message);

    setText("");
  };

  return (

    <div>

      <h2>Nexora Chat</h2>

      {messages.map((m,i)=>(
        <p key={i}>
          <b>{m.sender}</b>: {m.message}
        </p>
      ))}

      <input
        value={text}
        onChange={(e)=>setText(e.target.value)}
      />

      <button onClick={handleSend}>
        Send
      </button>

    </div>
  );
}

export default Chat;