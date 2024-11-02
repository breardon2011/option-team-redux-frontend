import React from "react";
import Chat from "./Chat";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1 className="text-2xl font-bold mb-4">Chat Application</h1>
      </header>
      <Chat /> {/* Display the Chat component here */}
    </div>
  );
}

export default App;
