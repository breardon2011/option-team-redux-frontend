import React, { useState, useEffect } from "react";

function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [ws, setWs] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const websocket = new WebSocket("ws://localhost:8000/ws");

    websocket.onopen = () => {
      console.log("WebSocket Connected");
      setIsConnected(true);
    };

    websocket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setMessages((prev) => [...prev, data.content]);
      } catch (error) {
        console.error("Error parsing message:", error);
      }
    };

    websocket.onclose = () => {
      console.log("WebSocket closed");
      setIsConnected(false);
    };

    websocket.onerror = (error) => {
      console.error("WebSocket error:", error);
      setIsConnected(false);
    };

    setWs(websocket);

    return () => websocket.close();
  }, []);

  const sendMessage = () => {
    if (ws && isConnected && input) {
      const messageData = {
        user_message: input,
      };
      try {
        ws.send(JSON.stringify(messageData));
        setInput("");
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-6">
      {!isConnected && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4 rounded">
          Connecting to chat server...
        </div>
      )}
      <div className="flex-grow overflow-auto bg-white shadow-lg rounded-xl p-6 mb-6">
        <div className="space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className="p-3 max-w-[80%] rounded-2xl bg-blue-500 text-white self-end ml-auto"
            >
              {msg}
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center space-x-4 bg-white p-4 rounded-xl shadow-lg">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-grow p-3 bg-gray-50 border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white transition-all"
          placeholder="Type a message..."
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transform hover:scale-105 transition-all duration-200 font-medium shadow-md"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default Chat;
