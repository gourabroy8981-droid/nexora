import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

function ChatPage() {
  const senderId = Number(sessionStorage.getItem("userId"));
  const { userId } = useParams();

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [stompClient, setStompClient] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);

  const messagesEndRef = useRef(null);
  const commonEmojis = ["😀", "😂", "😍", "👍", "🙏", "🔥", "🎉", "❤️", "🙌", "✨", "🚀", "💯"];

  useEffect(() => {
    API.get("/users/all")
        .then(res => setUsers(res.data))
        .catch(console.error);
  }, []);

  useEffect(() => {
    if (userId && users.length > 0) {
      const user = users.find(u => u.id === Number(userId));
      if (user) setSelectedUser(user);
    }
  }, [userId, users]);

  useEffect(() => {
    if (!senderId) return;

    const client = new Client({
      webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
      reconnectDelay: 3000,
      onConnect: () => {
        client.subscribe(`/topic/private/${senderId}`, (msg) => {
          const data = JSON.parse(msg.body);

          if (data.seen === true && data.content === null) {
            setMessages(prev =>
                prev.map(m =>
                    Number(m.senderId) === Number(data.senderId) &&
                    Number(m.receiverId) === Number(data.receiverId)
                        ? { ...m, seen: true }
                        : m
                )
            );
            return;
          }

          setMessages(prev => {
            if (prev.some(m => m.id === data.id)) return prev;
            return [...prev, data];
          });
        });

        client.subscribe("/topic/online-users", (msg) => {
          setOnlineUsers(JSON.parse(msg.body));
        });
      }
    });

    client.activate();
    setStompClient(client);

    return () => client.deactivate();
  }, [senderId]);

  useEffect(() => {
    if (!selectedUser || !senderId) return;

    API.get(`/chat/messages/${senderId}/${selectedUser.id}`)
        .then(res => {
          const normalized = res.data.map(msg => ({
            ...msg,
            senderId: Number(msg.senderId),
            receiverId: Number(msg.receiverId)
          }));
          setMessages(normalized);
        })
        .catch(console.error);

  }, [selectedUser, senderId]);

  const sendMessage = () => {
    if (!text.trim() || !selectedUser || !stompClient?.active) return;

    const msg = {
      senderId,
      receiverId: selectedUser.id,
      content: text,
      seen: false
    };

    stompClient.publish({
      destination: "/app/private-message",
      body: JSON.stringify(msg)
    });

    setText("");
    setShowEmojiPicker(false);
  };

  const addEmoji = (emoji) => {
    setText(prev => prev + emoji);
  };

  useEffect(() => {
    if (!selectedUser || !stompClient?.active) return;

    const hasUnseen = messages.some(m =>
        Number(m.senderId) === Number(selectedUser.id) &&
        Number(m.receiverId) === Number(senderId) &&
        !m.seen
    );

    if (!hasUnseen) return;

    stompClient.publish({
      destination: "/app/seen",
      body: JSON.stringify({
        senderId: selectedUser.id,
        receiverId: senderId
      })
    });

  }, [messages, selectedUser, senderId, stompClient]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const filteredUsers = users.filter(u => u.id !== senderId);

  const filteredMessages = messages.filter(msg => {
    if (!selectedUser) return false;

    return (
        (Number(msg.senderId) === Number(senderId) &&
            Number(msg.receiverId) === Number(selectedUser.id)) ||
        (Number(msg.senderId) === Number(selectedUser.id) &&
            Number(msg.receiverId) === Number(senderId))
    );
  });

  const renderTicks = (msg) => {
    if (Number(msg.senderId) !== Number(senderId)) return null;
    if (msg.seen) return "✓✓";
    const isReceiverOnline = onlineUsers.includes(msg.receiverId);
    return isReceiverOnline ? "✓✓" : "✓";
  };

  return (
      <div className="flex h-screen bg-[#f0f2f5] dark:bg-[#0b141a] font-sans transition-colors duration-300 overflow-hidden">

        {/* SIDEBAR */}
        <div className={`${showSidebar ? "flex" : "hidden"} md:flex w-full md:w-[30%] min-w-0 md:min-w-[300px] border-r border-gray-300 dark:border-gray-700 flex-col bg-white dark:bg-[#111b21]`}>

          {/* Header */}
          <div className="h-[60px] bg-[#f0f2f5] dark:bg-[#202c33] flex items-center px-4 border-b">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
              {sessionStorage.getItem("userName")?.charAt(0) || "U"}
            </div>
            <h2 className="ml-4 font-bold text-gray-800 dark:text-white">Chats</h2>
          </div>

          {/* Search */}
          <div className="p-3">
            <input
                placeholder="Search contacts..."
                className="w-full bg-[#f0f2f5] dark:bg-[#202c33] dark:text-white text-sm py-2 px-4 rounded-xl"
            />
          </div>

          {/* Users */}
          <div className="flex-1 overflow-y-auto">
            {filteredUsers.map(user => (
                <div
                    key={user.id}
                    onClick={() => {
                      setSelectedUser(user);
                      setShowSidebar(false);
                    }}
                    className={`flex items-center px-4 py-3 cursor-pointer ${
                        selectedUser?.id === user.id
                            ? "bg-[#f0f2f5] dark:bg-[#2a3942]"
                            : "hover:bg-gray-50 dark:hover:bg-[#202c33]"
                    }`}
                >
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-blue-200 flex items-center justify-center font-bold">
                      {user.name.charAt(0)}
                    </div>
                    {onlineUsers.includes(user.id) && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full"></div>
                    )}
                  </div>

                  <div className="ml-4">
                    <h4 className="font-semibold">{user.name}</h4>
                    <p className="text-xs text-green-500">
                      {onlineUsers.includes(user.id) ? "online" : ""}
                    </p>
                  </div>
                </div>
            ))}
          </div>
        </div>

        {/* CHAT AREA */}
        <div className={`flex-1 flex flex-col ${showSidebar ? "hidden md:flex" : "flex"}`}>

          {selectedUser ? (
              <>
                {/* Header */}
                <div className="h-[60px] bg-[#f0f2f5] dark:bg-[#202c33] flex items-center px-4">

                  {/* BACK BUTTON (mobile only) */}
                  <button
                      onClick={() => setShowSidebar(true)}
                      className="md:hidden mr-3 text-xl"
                  >
                    ←
                  </button>

                  <div className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center mr-3">
                    {selectedUser.name.charAt(0)}
                  </div>

                  <h3 className="font-semibold">{selectedUser.name}</h3>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 flex flex-col space-y-2">

                  {filteredMessages.map((msg, i) => {
                    const isMine = Number(msg.senderId) === Number(senderId);

                    return (
                        <div
                            key={msg.id || i}
                            className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                        >
                          <div
                              className={`px-3 py-2 max-w-[85%] sm:max-w-[70%] text-sm rounded-lg ${
                                  isMine
                                      ? "bg-green-200"
                                      : "bg-white dark:bg-gray-700"
                              }`}
                          >
                            {msg.content}

                            {isMine && (
                                <div className="text-xs text-right mt-1">
                                  {renderTicks(msg)}
                                </div>
                            )}
                          </div>
                        </div>
                    );
                  })}

                  <div ref={messagesEndRef}></div>
                </div>

                {/* Emoji Picker */}
                {showEmojiPicker && (
                    <div className="p-3 flex flex-wrap gap-2 bg-white dark:bg-[#202c33]">
                      {commonEmojis.map(e => (
                          <button key={e} onClick={() => addEmoji(e)}>
                            {e}
                          </button>
                      ))}
                    </div>
                )}

                {/* Input */}
                <div className="p-2 sm:p-3 flex gap-2 items-center bg-[#f0f2f5] dark:bg-[#202c33]">

                  <button onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
                    😊
                  </button>

                  <input
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                      className="flex-1 px-3 py-2 rounded-lg"
                      placeholder="Type a message"
                  />

                  <button
                      onClick={sendMessage}
                      disabled={!text.trim()}
                      className="bg-green-500 text-white px-3 py-2 rounded-lg"
                  >
                    Send
                  </button>

                </div>
              </>
          ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                Select a contact to chat
              </div>
          )}

        </div>
      </div>
  );
}

export default ChatPage;